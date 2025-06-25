import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { GENRE_MAP } from "@/public/data/meta";
import { XIcon } from "lucide-react";
import { Context } from "../context/context";
import { toast } from "sonner";

const GenreSection = ({ initialGenres = [] }) => {
  const [hovering, setHovering] = useState(false);
  const { events } = useContext(Context);

  return (
    <div
      className="w-full flex flex-col gap-4 p-4 border-2 rounded-xl hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 ease-in-out"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <p className="scroll-m-20 text-xl tracking-tight text-balance">
        Detected Genre
      </p>
      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
        {initialGenres.map((genre, id) => (
          <Badge
            key={id}
            onClick={() => {
              if (initialGenres.length === 1) {
                toast(
                  "Yamete Kudasai!!! If you remove this, we won't know your kink :("
                );
                return;
              }
              const newGenres = initialGenres.filter((g) => g !== genre);
              events.emit("loadAnime", newGenres);
            }}
          >
            {genre}
            {hovering && <XIcon />}
          </Badge>
        ))}

        <Select
          onValueChange={(value) => {
            const newGenres = [...initialGenres, value];
            events.emit("loadAnime", newGenres);
          }}
          value={""}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add more Genre" />
          </SelectTrigger>
          <SelectContent>
            {GENRE_MAP.filter((genre) => !initialGenres.includes(genre)).map(
              (genre, id) => (
                <SelectItem value={genre} key={id}>
                  {genre}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GenreSection;
