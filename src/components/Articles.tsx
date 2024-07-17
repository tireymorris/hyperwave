import { Article } from "models/article";
import { formatRelativeTime } from "util/time";

export default function Articles(props: { articles: Article[] }) {
  const relativeDate = (article: Article) =>
    formatRelativeTime(new Date(article.created_at));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {props.articles.map((article) => (
        <div
          key={article.id}
          className="bg-sky-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500 dark:border-none"
        >
          <div className="p-3">
            <a
              href={article.link}
              className="tracking-wider leading-relaxed text-md font-semibold text-sky-700 hover:text-blue-800 visited:text-purple-600 dark:text-blue-400 dark:hover:text-blue-600 dark:visited:text-purple-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {relativeDate(article)} - {article.source}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
