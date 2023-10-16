import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

import Layout from "./Layout.tsx";
import CategoryRow from "./CategoryRow.tsx";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));

app.use("*", logger());

app.onError((err, c) => c.html(<Layout title="error :(">{err}</Layout>));

app.get("/", ({ html }) => {
  const offset = Math.floor(Math.random() * 100);

  return html(
    <Layout title="hyperwave">
      <section class="flex flex-col gap-8">
        <CategoryRow offset={offset} />
        <CategoryRow offset={offset + 100} />
        <CategoryRow offset={offset + 200} />
      </section>
    </Layout>,
  );
});

export default app;
