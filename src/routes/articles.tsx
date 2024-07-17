import Articles from "components/Articles";
import { Hono } from "hono";
import { getCachedArticles } from "models/article";
import { debug } from "util/log";

export default function articlesRoutes(app: Hono) {
  app.get("/articles", async (c) => {
    debug("GET /articles - Start");

    const offset = parseInt(c.req.query("offset") || "0", 10);
    const limit = parseInt(c.req.query("limit") || "32", 10);

    debug("Offset:", offset);
    debug("Limit:", limit);

    const articles = getCachedArticles(offset, limit);
    debug("Articles retrieved:", articles.length);

    return c.html(<Articles articles={articles} />);
  });
}
