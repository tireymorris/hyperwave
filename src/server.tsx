import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

import Layout from "./Layout.tsx";
import MovieCard from "./MovieCard.tsx";
import CategoryRow from "./CategoryRow.tsx";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));

app.use("*", logger());

app.onError((err, c) => c.html(<Layout>{err}</Layout>));

app.get("/", ({ html }) => {
  return html(
    <Layout title="hyperwave">
      <section class="flex flex-col gap-8">
        <CategoryRow offset={0} />
        <CategoryRow offset={100} />
        <CategoryRow offset={200} />
      </section>
    </Layout>,
  );
});

export default app;
