import { searchAnimeByGenre, searchAnimeByTags } from "@/lib/searchAnimeByTags";
import { GENRE_MAP, TAG_MAP } from "@/public/data/tags";
import axios from "axios";

export async function POST(request) {
  const { prompt } = await request.json();

  const systemPrompt = `
  Given an anime-related prompt from a user, return a JSON with the following keys:

  1. "genres" — an array of anime genres the user is interested in (like "Shounen", "Adventure", "Comedy", "Isekai"). Be concise and use known anime genres.
  2. Tags — an array of anime tags the user is interested in (like "action", "overpowered main character", "magic", "high animation quality"). Be concise and use known anime tags.
  3. "related_to" — optional. If the user mentions a specific anime or character (e.g. "I like Solo Leveling" or "like Gojo from Jujutsu Kaisen"), return the name(s) here. Otherwise, omit this field.

  Respond in JSON only. No explanation or commentary.

  Available genres: ${GENRE_MAP}

  Available tags: ${TAG_MAP.map((tag) => tag.name)}

  NOTE: Make sure you send the top 3-5 relevant genres only. There is no lomit for tags. Use the genres and tags that are provided with the same case.
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

    if (typeof raw !== "string") throw new Error("Wrong type of response");

    if (raw.startsWith("```json") && raw.endsWith("```")) {
      raw = raw.split("\n").slice(1, -1).join(" ");
    }

    let genres = JSON.parse(raw)?.genres || [];
    let tags = JSON.parse(raw)?.tags || [];
    let related_to = JSON.parse(raw)?.related_to || [];

    const animeList = await getAnime(genres, tags, related_to);

    return Response.json({ animeList, genres });
  } catch (error) {
    console.error("Gemini error:", error);
    return Response.json({ error: "Failed to call Gemini" });
  }
}

const getAnime = async (userGenres = [], usertags = [], relatedTo = []) => {
  const animeResultsByGenre = await searchAnimeByGenre(userGenres);
  const animeResultsByTags = await searchAnimeByTags(usertags);

  let animeResults = [...animeResultsByTags, ...animeResultsByGenre];

  animeResults = filterOutDuplicates(animeResults);

  let message = "Anime recommendations";
  if (animeResults?.length === 0) {
    message = "We couldn't find anything with your preferences. Sorry :(";
  }

  return {
    results: [
      // Most relevant
      ...animeResults.filter(
        (result) =>
          matchAnimeName(relatedTo, result?.title?.english) ||
          matchAnimeName(relatedTo, result?.title?.romaji)
      ),
      // Less relevant
      ...animeResults.filter(
        (result) =>
          !matchAnimeName(relatedTo, result?.title?.english) &&
          !matchAnimeName(relatedTo, result?.title?.romaji)
      ),
    ],
    message,
  };
};

function matchAnimeName(relatedNames, name) {
  if (!name || !relatedNames) return false;

  for (const related of relatedNames) {
    if (name.includes(related) || related.includes(name)) {
      return true;
    }
  }
  return false;
}

const filterOutDuplicates = (animeResults) => {
  const uniqueIDs = new Set();

  let filteredResults = [];
  for (const animeResult of animeResults) {
    if (!uniqueIDs.has(animeResult.id)) {
      uniqueIDs.add(animeResult.id);
      filteredResults.push(animeResult);
    }
  }

  return filteredResults;
};
