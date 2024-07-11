import Layout from "components/Layout";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import articlesRoutes from "routes/articles";
import { formatRelativeTime, getLastUpdatedTimestamp } from "util/time";
import { getCachedArticles } from "models/article";
import Articles from "components/Articles";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("/scripts/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

app.get("/", async (c) => {
  const lastUpdatedDate = getLastUpdatedTimestamp();
  const lastUpdated = lastUpdatedDate
    ? formatRelativeTime(lastUpdatedDate)
    : null;

  const firstPageArticles = getCachedArticles();

  return c.html(
    <Layout title="hyperwave" lastUpdated={lastUpdated}>
      <div class="flex flex-col gap-2 p-4 min-h-screen text-base">
        <Articles articles={firstPageArticles} />
        <div
          id="articles"
          method="GET"
          href="/articles"
          trigger="scroll"
          debounce="1"
          offset="32"
          limit="32"
          target="#articles"
          class="w-full"
          data-total="1000"
        ></div>
      </div>
    </Layout>,
  );
});

articlesRoutes(app);

export default {
  port: process.env.PORT || 1234,
  fetch: app.fetch,
};
