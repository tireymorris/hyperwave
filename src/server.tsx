import Layout from "components/Layout";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import articlesRoutes from "routes/articles";
import { formatRelativeTime, getLastUpdatedTimestamp } from "util/time";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("/scripts/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

app.get("/", async (c) => {
  const lastUpdatedDate = getLastUpdatedTimestamp();
  const lastUpdated = lastUpdatedDate
    ? formatRelativeTime(lastUpdatedDate)
    : null;

  return c.html(
    <Layout title="hyperwave" lastUpdated={lastUpdated}>
      <div class="flex flex-col gap-2 p-4 min-h-screen text-base">
        <div
          id="articles"
          method="GET"
          href="/articles"
          trigger="scroll"
          debounce="1"
          target="#articles"
          class="w-full px-2"
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
