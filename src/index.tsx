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
    <div class="text-lg bg-blue-200 rounded-sm p-2">
      <p>
        <code>$ bun dev</code>
        <br />
        <br />
        then edit <code>src/index.ts</code> to get started!
      </p>
    </div>,
  ),
);

app.get("/", ({ html }) =>
  html(
    <Layout>
      <section class="flex flex-col gap-8">
        <h1 class="text-4xl">welcome to hyperwave 🌊</h1>
        <div>
          <button
            class="bg-blue-200 p-4 text-xl font-bold"
            hx-get="/instructions"
            hx-target="closest div"
          >
            instructions
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
