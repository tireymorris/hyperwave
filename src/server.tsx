import * as elements from "typed-html";
import { Attributes } from "typed-html";
import { Hono } from "hono";
import { logger } from "hono/logger";
import Layout from "./Layout.tsx";

const app = new Hono();

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
    <Layout>
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
        <ul class="flex flex-col gap-3">
          <li>
            <a class="font-bold" href="https://bun.sh/">
              Bun
            </a>{" "}
            provides the runtime, test runner, package manager, and{" "}
            <a href="https://bun.sh/docs/api/sqlite">SQLite bindings</a>
          </li>
          <li>
            <a class="font-bold" href="https://hono.dev">
              Hono
            </a>{" "}
            is a robust web framework with great DX and performance
          </li>
          <li>
            <a class="font-bold" href="https://tailwindcss.com/">
              Tailwind
            </a>{" "}
            allows us to keep our styles close to our HTML
          </li>
          <li>
            <a class="font-bold" href="https://htmx.org/reference/">
              HTMX
            </a>{" "}
            gives 99% of the client-side interactivity most apps need
          </li>
        </ul>
      </section>
    </Layout>,
  ),
);

export default app;
