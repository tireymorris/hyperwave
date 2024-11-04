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
      <main class="m-auto flex h-full flex-col items-center gap-8 px-10 py-8 text-center">
        <h1 class="text-5xl font-extrabold text-black drop-shadow-lg dark:text-white">
          🌊 hyperwave
        </h1>
        <pre class="rounded-md bg-indigo-200 px-6 py-3 text-black shadow-lg dark:bg-indigo-600 dark:text-white">
          ⌨️ edit&nbsp;
          <code class="rounded bg-gray-300 px-2 py-1 text-black dark:bg-gray-700 dark:text-white">
            src/server.tsx
          </code>
        </pre>
        <pre class="rounded-md bg-blue-200 px-6 py-3 text-black shadow-lg dark:bg-blue-600 dark:text-white">
          📚 read the&nbsp;
          <a
            href="https://github.com/tireymorris/hyperwave?tab=readme-ov-file#hyperwave-"
            class="underline hover:text-yellow-600 dark:hover:text-yellow-300"
          >
            friendly manual
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
