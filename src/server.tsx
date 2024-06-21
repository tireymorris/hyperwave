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
        <h1 class="text-5xl font-extrabold text-white drop-shadow-lg">
          🌊 hyperwave
        </h1>
        <pre class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white shadow-lg">
          ⌨️ edit&nbsp;
          <code class="bg-gray-300 text-black rounded px-2 py-1">
            src/server.tsx
          </code>
        </pre>
        <pre class="rounded-md bg-gradient-to-r from-blue-500 to-teal-600 px-6 py-3 text-white shadow-lg">
          📚 read the&nbsp;
          <a
            href="https://github.com/tireymorris/hyperwave?tab=readme-ov-file#hyperwave-"
            class="underline hover:text-yellow-300"
          >
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
