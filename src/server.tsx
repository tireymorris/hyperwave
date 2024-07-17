import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import Layout from "./components/Layout.tsx";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

app.get("/", (c) =>
  c.html(
    <Layout title="hyperwave">
      <main class="m-auto flex h-full flex-col items-center gap-8 px-10 py-8">
        <h1>🌊 welcome to hyperwave</h1>
        <pre class="rounded-md bg-blue-200 px-4 py-2">
          ⌨️ edit <code class="bg-slate-200">src/server.tsx</code>
        </pre>
        <pre class="rounded-md bg-blue-200 px-4 py-2">
          📚 read the{" "}
          <a href="https://github.com/tireymorris/hyperwave?tab=readme-ov-file#hyperwave-">
            friendy manual
          </a>
          !
        </pre>
      </main>
    </Layout>,
  ),
);

export default {
  port: process.env.PORT || 1234,
  fetch: app.fetch,
};
