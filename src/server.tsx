import { Hono } from "hono";
import { logger } from "hono/logger";
import Layout from "./Layout.tsx";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));

app.use("*", logger());

app.onError((err, c) => c.html(<Layout>{err}</Layout>));

app.get("/instructions", ({ html }) =>
  html(
    <div class="text-md bg-blue-100 rounded-md p-8 self-start shadow-sm">
      <ol class="flex flex-col gap-4">
        <p>
          <code>$ bun dev</code>
        </p>
        <li>
          edit <code>src/server.ts</code>
        </li>
        <li>profit 🚀</li>
      </ol>
    </div>,
  ),
);

app.get("/", ({ html }) =>
  html(
    <Layout title="hyperwave">
      <section class="flex flex-col gap-8">
        <div>
          <button
            class="bg-blue-100 p-4 text-sm font-bold rounded-md shadow-sm"
            hx-get="/instructions"
            hx-target="closest div"
          >
            fetch instructions from <code>/instructions</code>
          </button>
        </div>
      </section>
    </Layout>,
  ),
);

export default app;
