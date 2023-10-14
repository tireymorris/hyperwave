import MovieCard from "./MovieCard.tsx";

import movies from "../fixtures/movies.json";

export default function CategoryRow({offset}) {
  return (
    <div class="flex gap-4">
      {movies.slice(offset, offset+100).map((movie, idx) =>
        <MovieCard seed={offset+idx} movie={movie} />
      )}
    </div>
  );
}
