# hyperwave 🌊

hyperwave is a server-side framework for building web applications.

- fast: tiny payloads with no bloated client side rendering
- productive: build _really_ fast with htmx, tailwind, tsx, hyperscript
- ergonomic: best tooling of modern tooling combined with rock solid app architecture
- portable: compile a binary to deploy anywhere

Choosing hyperwave means embracing a smarter way to develop web applications,
where ease of use, performance, and developer experience go hand in hand.

### Setup

`bun install && bun run src/db.ts && bun dev`

Visit port 1234 and edit `server.tsx`

---

### Example

This is the endpoint serving our initial landing page:

```typescript
app.get("/", ({ html }) =>
  html(
    <Layout title="hyperwave 🌊">
      <section class="flex flex-col gap-8">
        <div>
          <button
            class="bg-blue-100 p-4 text-sm font-bold rounded-md shadow-sm"
            hx-get="/instructions"
            hx-target="closest div"
            _="on click toggle .loading"
          >
            fetch instructions from <code>/instructions</code>
          </button>
        </div>
      </section>
    </Layout>,
  ),
);
```

- The API serves a full HTML document to the client, which includes Tailwind classes and HTMX attributes
- The response is wrapped in a `<Layout />` tag, a server-rendered functional component, which takes a `title` prop
- The button, when clicked, will issue a `GET` request to `/instructions` and replace the content of its parent div with the response.
- Includes a tiny hyperscript to toggle a class when the button is clicked

---

### Deployment

Build an executable for your current architecture with `bun run build`

`PORT` environment variable is available if needed (default is 1234)

Note: deploy `public/` with the executable, it contains the generated UnoCSS build.

---

### Components

- [bun](https://bun.sh/) provides the bundler, runtime, test runner, and package manager.
- [SQLite](https://bun.sh/docs/api/sqlite) is production-ready and built into Bun.
- [hono](https://hono.dev) is a robust web framework with great DX and performance
- [unoCSS](https://unocss.dev/integrations/cli) is Tailwind-compatible and generates only the styles used in application code.
- [htmx](https://htmx.org/reference/) gives 99% of the client-side interactivity most apps need.
- [hyperscript](http://hyperscript.org) is a scripting library for rapid application development.
- [zod](https://zod.dev/) is a powerful runtime validation library.

---

### Benefits and takeways

**Why bother switching to hyperwave?**

- Drastically reduces time from idea to rendered UI
- Very little cognitive friction to creating something new, after initial learning curve

**Speed / performance benefit**

- hyperwave is designed to generate the smallest possible payloads
- Deployment is as simple as compiling and running a binary 😎

**Simplicity**

- Bun saves us a ton of time and effort fighting tooling issues
- SPAs are over-prescribed and inherently introduce serious costs

**Dev UX benefit**

- Better primitives for quickly building UX
- Uniform interface simplifies writing and reading code

**Architectural benefit**

- Can scale backend and product independently, loosely coupled
