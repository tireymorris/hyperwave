import { Article } from "models/article";
import { formatRelativeTime } from "util/time";

export default function Articles(props: { articles: Article[] }) {
  const relativeDate = (article: Article) =>
    formatRelativeTime(new Date(article.created_at));

  return (
    <ul class="list-none m-0 p-0">
      {props.articles.map((article) => (
        <li key={article.id} class="p-0 m-0 border-b list-none mb-1">
          <a
            href={article.link}
            class="text-teal-500 hover:underline visited:text-purple-600"
          >
            {article.title}
          </a>
          <div class="text-gray-500 text-sm">
            {relativeDate(article)} - {article.source}
          </div>
        </li>
      ))}
    </ul>
  );
}
