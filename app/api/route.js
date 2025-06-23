import { TAG_MAP } from "@/public/data/tags";
import axios from "axios";

export async function POST(request) {
  const { prompt } = await request.json();
  console.log("prompt", prompt);
  const systemPrompt = `
  Given an anime-related prompt from a user, return a JSON with the following keys:

  1. "genres" — an array of anime genres the user is interested in (like "action", "overpowered main character", "magic", "high animation quality"). Be concise and use known anime tropes and genres.
  2. "related_to" — optional. If the user mentions a specific anime or character (e.g. "I like Solo Leveling" or "like Gojo from Jujutsu Kaisen"), return the name(s) here. Otherwise, omit this field.

  Respond in JSON only. No explanation or commentary.

  Available genres: ${TAG_MAP}

  NOTE: Make sure you send the top 3-5 relevant genres only. Use the genres that are provided with the same case.
  `;

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      system_instruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const { data: response } = await axios.post(url, data, { headers });

    let raw = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log(raw);

    if (typeof raw !== "string") throw new Error("Wrong type of response");

    if (raw.startsWith("```json") && raw.endsWith("```")) {
      raw = raw.split("\n").slice(1, -1).join(" ");
    }

    let genres = JSON.parse(raw)?.genres || [];

    return Response.json({ genres });
  } catch (error) {
    console.error("Gemini error:", error);
    return Response.json({ error: "Failed to call Gemini" });
  }
}
