import Layout from "components/Layout";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import articlesRoutes from "routes/articles";
import { formatRelativeTime } from "util/time";
import { getCachedArticles, getLastUpdatedTimestamp } from "models/article";
import Articles from "components/Articles";

const app = new Hono();

// Middleware to set Cache-Control headers for all responses
app.use("*", (c, next) => {
  c.res.headers.set("Cache-Control", "public, max-age=60"); // Cache for 1 minute
  return next();
});

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("/scripts/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

// Render first page of articles, with infinite scroll if JS is enabled
app.get("/", async (c) => {
  const lastUpdatedDate = getLastUpdatedTimestamp();
  const lastUpdated = lastUpdatedDate
    ? formatRelativeTime(lastUpdatedDate)
    : null;

  const firstPageArticles = getCachedArticles(0, 64);

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
          offset="64"
          limit="64"
          target="#articles"
          class="w-full"
          update-mode="append"
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
