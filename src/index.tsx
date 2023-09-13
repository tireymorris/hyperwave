import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import {Attributes, CustomElementHandler} from "typed-html"


function Layout({ children, title }: Attributes) {
  return (
    <html lang="en" class="bg-gray-200">
      <head>
        <title>{title}</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/htmx.org@1.9.5"></script>
      </head>
      <body class="p-5">
        <main class="h-full w-full flex flex-col gap-3">
          <h1 class="text-2xl">Hello World</h1>
          <h2 hx-get="/time" hx-target="this">
            Psst! Click for a new time!
          </h2>
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
    <Layout title="Highlight Interview">
      <sub>I'm here too!</sub>
    </Layout>
  ))
  .listen(process.env.PORT || 4321);
