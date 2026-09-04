# hyperwave

Server-rendered UI, small client surface, fast feedback loops, and straightforward deploys.

## Philosophy

Ship HTML first.

Use JavaScript only when required.

Optimize for readability and small payloads.

## Stack

- [Bun](https://bun.sh/) runtime, package manager, and compiler
- [Hono](https://hono.dev/) HTTP framework
- [UnoCSS](https://unocss.dev/integrations/cli) utility-first CSS generation
- TSX server components for templating

## Optional client-side tools

No client framework is included by default.

Add only what a page needs: [htmx](https://htmx.org/), [Alpine.js](https://alpinejs.dev/), [hyperscript](http://hyperscript.org/), [Stimulus](https://stimulus.hotwired.dev/), or plain JavaScript.

## Run

```sh
bun install
bun dev
```

Open [http://localhost:1234](http://localhost:1234).

Edit `src/server.tsx` and refresh.

## Build and deploy

```sh
bun run build
```

- Serves on `PORT` or `1234`
- Deploy the compiled binary with `public/`

