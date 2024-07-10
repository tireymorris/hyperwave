import { Hono } from "hono";
import { getCachedArticles } from "models/article";
import { debug } from "util/log";
import { formatRelativeTime } from "util/time";

export default function articlesRoutes(app: Hono) {
  app.get("/articles", async (c) => {
    debug("GET /articles - Start");

    const offset = parseInt(c.req.query("offset") || "0", 10);
    const limit = parseInt(c.req.query("limit") || "15", 10);

    debug("Offset:", offset);
    debug("Limit:", limit);

    const articles = getCachedArticles(offset, limit).map((article) => ({
      ...article,
      relativeDate: formatRelativeTime(new Date(article.created_at)),
    }));

    debug("Articles retrieved:", articles.length);

    return c.html(
      <ul class="list-none m-0 p-0">
        {articles.map((article) => (
          <li key={article.id} class="p-0 m-0 border-b list-none mb-1">
            <a
              href={article.link}
              class="text-teal-500 hover:underline visited:text-purple-600"
            >
              {article.title}
            </a>
            <div class="text-gray-500 text-sm">
              {article.relativeDate} - {article.source}
            </div>
          </li>
        ))}
      </ul>,
    );
  });
}
