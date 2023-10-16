export default function MovieDetails({ movie }) {
  return (
    <div class="w-md h-sm bg-slate-300 shadow-lg px-6 py-4 rounded-md">
      <div class="w-lg">{movie.name}</div>
      <div>{movie.year}</div>
      <div>{movie.director}</div>
      <div>{movie.year}</div>
      <div>{movie.storyline}</div>
      <div>{movie.actors}</div>
    </div>
  );
}
