import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { Attributes, CustomElementHandler } from "typed-html";

function Layout({ children }: Attributes) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="hyperwave" />
        <title>hyperwave</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.classless.min.css"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>"
        />
        <script src="https://unpkg.com/htmx.org@1.9.5" />
        <script src="https://unpkg.com/hyperscript.org@0.9.11" />
      </head>

      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

new Elysia()
  .use(html())
  .get("/time", () => <h2>{new Date().toLocaleTimeString()}</h2>)
  .get("/", () => (
    <Layout>
      <p>🚀welcome to Hyperwave! 🌊</p>
      <p>
        <a href="https://bun.sh/">Bun</a> provides the runtime, test runner,
        package manager, and database via
        <a href="https://bun.sh/docs/api/sqlite">SQLite</a>
      </p>
      <p>
        <a href="https://elysiajs.com/">Elysia</a> is a robust web framework
        with great DX and performance.
      </p>
      <p>
        <a href="https://picocss.com/">PicoCSS</a> allows us to write semantic
        HTML that actually looks good.
      </p>
      <p>
        <a href="https://htmx.org/reference/">HTMX</a> and <a href="https://hyperscript.org/">Hyperscript</a> give us 99% of the
        client-side interactivity most apps need.
      </p>
    </Layout>
  ))
  .listen(process.env.PORT || 4321);
