export default function MovieCard({ movie, seed }) {
  return (
    <img
      width={400}
      height={300}
      src={`https://picsum.photos/seed/${seed}/400/300`}
    />
  );
}
