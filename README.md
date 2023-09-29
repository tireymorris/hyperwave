# Hyperwave 🌊
## Truly RESTful full-stack starter kit 

Run `bun dev`  and edit `src/server.ts` to get started!

To build an executable for your current architecture, run `bun run build` 

## Philosophy

Let's assume for a minute that we live in a fantasy land where 99% of our applications can be rendered on the server.

... This repo is that fantasy land 🤘

The approach follows in the original tradition of the Web: REST, via HTML over the wire.

By shifting responsibility to the backend as a policy, we eliminate the complexity of a separate client-side application.

We rule out an entire category of bugs, and embrace the original concept of the web.


## 🔋 What's included? 
### 🚀 everything you need, and nothing you don't. 

In this implementation, we utilize HTMX, Tailwind, and Bun's native support for JSX to build functional components that are rendered to HTML and served by Hono.

- [Bun](https://bun.sh/) provides the bundler, runtime, test runner, and package manager, and database via [SQLite](https://bun.sh/docs/api/sqlite)
- [Hono](https://hono.dev) is a robust web framework with great DX and performance
- [Tailwind](https://tailwindcss.com/) allows us to keep our styles close to our HTML
- [HTMX](https://htmx.org/reference/) gives 99% of the client-side interactivity most apps need

