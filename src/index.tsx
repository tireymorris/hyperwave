import * as elements from "typed-html";
import { Attributes, CustomElementHandler } from "typed-html";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

function Layout({ children }: Attributes) {
  return (
    <html lang="en" hx-swap="outerHTML transition:true">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="hyperwave" />
        <title>hyperwave</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>"
        />
        <script src="https://unpkg.com/htmx.org@1.9.5" />
        <script src="https://cdn.tailwindcss.com" />
        <script>htmx.config.globalViewTransitions = true</script>
      </head>

      <body class="bg-blue-100 w-full">
        <main class="bg-blue-100 sm:p-10 p-4 flex flex-col w-full justify-center gap-8 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}

app.use("*", logger());
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
    </Layout>,
  ),
);

export default app;
