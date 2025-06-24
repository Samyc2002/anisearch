"use client";
import { Fragment, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { searchAnimeByGenre } from "@/lib/searchAnimeByTags";
import { DEFAULT_ANIME_LIST, GENRE_MAP } from "@/public/data/tags";
import axios from "axios";
import { BadgeCheckIcon, Loader, Search } from "lucide-react";
import { toast } from "sonner";
import { fetchGenres } from "@/lib/fetchGenres";
import Image from "next/image";

export default function Home() {
  const [prevPrompt, setPrevPrompt] = useState("");
  const [prompt, setPrompt] = useState("");
  const [detectedGenres, setDetectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animeResults, setAnimeResults] = useState(DEFAULT_ANIME_LIST);

  const getAnime = async (userGenres = [], relatedTo = []) => {
    await fetchGenres();
    setDetectedGenres(userGenres);

    const animeResults = await searchAnimeByGenre(userGenres);

    let message = "Anime recommendations";
    if (animeResults?.length === 0) {
      message = "We couldn't find anything with your preferences. Sorry :(";
    }

    setAnimeResults({
      results: animeResults,
      message,
    });
  };

  const onSearch = async () => {
    try {
      if (!prompt) {
        toast.error("Please provide a prompt.");
        return;
      }

      setLoading(true);
      setPrevPrompt(prompt);

      const { data } = await axios.post("/api", { prompt });
      const { genres = [], animeList = DEFAULT_ANIME_LIST } = data || {};
      setDetectedGenres(genres);
      setAnimeResults(animeList);

      setLoading(false);
    } catch (error) {
      console.error("Some error occurred:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const isDisabled = () => prevPrompt === prompt;

  function generatePrompt(genres) {
    if (!genres || genres.length === 0)
      return "Show me something wild and unexpected.";

    // Shuffle and pick 2–3 tags randomly
    const selectedGenres = [...genres]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Templates with dynamic tag insertion
    const templates = [
      "I'm craving an anime with {genres}. Any suggestions?",
      "Give me something with {genres} vibes.",
      "Got any good shows featuring {genres}?",
      "Surprise me with an anime that has {genres}.",
      "I want an anime with {genres}, no questions asked.",
      "Anything with {genres}? I'm in.",
    ];

    // Format tags into a sentence
    const genrePhrase = selectedGenres.join(", ");

    // Pick a random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    return template.replace("{genres}", genrePhrase);
  }

  const surpriseMe = () => {
    const genres = GENRE_MAP.sort(() => 0.5 - Math.random()).slice(0, 3);
    const prompt = generatePrompt(genres);

    setPrompt(prompt);
    setPrevPrompt(prompt);
    setDetectedGenres(genres);
    getAnime(genres);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[10rem] right-[-10rem] w-[30rem] h-[30rem] bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[50rem] left-[30rem] w-[30rem] h-[30rem] bg-yellow-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <main className="flex flex-col items-center justify-items-center min-h-screen gap-16 p-10 md:p-40 xl:p-64">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-[length:200%_200%] animate-gradient-move">
            Ani- Search
          </h1>

          <h2 className="scroll-m-20 text-center text-3xl tracking-tight text-balance">
            Describe your anime kink. We&apos;ll find it.
          </h2>

          <div className="flex flex-col items-center justify-items-cente gap-8 w-[60%]">
            <Input
              className="w-full"
              placeholder="e.g. Hot assassin girl with a tragic past and daddy issues"
              onChange={(event) => setPrompt(event.target.value)}
              value={prompt}
            />
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              <Button
                variant={isDisabled() ? "ghost" : "default"}
                onClick={(event) => {
                  event.preventDefault();
                  if (isDisabled()) return;

                  onSearch();
                }}
                className={!isDisabled() && "cursor-pointer"}
              >
                {loading ? (
                  <>
                    <Loader /> Loading
                  </>
                ) : (
                  <>
                    <Search /> Serach
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={surpriseMe}
                className="cursor-pointer"
              >
                🎲 Surprise Me
              </Button>
            </div>
            {detectedGenres.length > 0 && (
              <div className="w-full flex flex-col gap-4">
                <p>Detected Genre:</p>
                <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                  {detectedGenres.map((genre, id) => (
                    <Badge key={id}>{genre}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(animeResults.results.length > 0 || animeResults.message) && (
              <div className="w-full flex flex-col">
                <h1 className="text-xl tracking-tight text-balance">
                  {animeResults.message}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-5">
                  {animeResults.results.map((anime) => (
                    <Card
                      key={anime.id}
                      className="overflow-hidden p-0 rounded-xl transition-transform hover:scale-105 hover:shadow-lg bg-black/40 backdrop-blur-md"
                    >
                      <a
                        href={anime.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-full h-[300px]"
                      >
                        <Image
                          src={anime.coverImage.large}
                          alt={anime.title.english || anime.title.romaji}
                          fill
                          className="w-full h-64 object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </a>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {anime.title.english || anime.title.romaji}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                          {anime.description?.replace(/<[^>]*>/g, "")}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {anime.genres?.slice(0, 3).map((genre, id) => (
                            <Fragment key={id}>
                              {detectedGenres.includes(genre) && (
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-500 text-white dark:bg-blue-600"
                                >
                                  <BadgeCheckIcon />
                                  {genre}
                                </Badge>
                              )}
                              {!detectedGenres.includes(genre) && (
                                <Badge>{genre}</Badge>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Toaster />
        </main>
      </div>
    </div>
  );
}
