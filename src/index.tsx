import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

new Elysia()
  .use(html())
  .get("/", () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <h1 class="text-2xl">Hello World</h1>
        <form>
          <label for="thing">Thing!</label>
          <input type="text" id="thing" />
        </form>
      </body>
    </html>
  ))
  .listen(process.env.PORT || 4321);
