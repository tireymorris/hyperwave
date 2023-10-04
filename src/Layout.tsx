export default function Layout({ title, children }) {
  return (
    <html lang="en" hx-boost="true" hx-swap="outerHTML transition:true">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="hyperwave" />
        <title>{title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>"
        />
        <script src="https://unpkg.com/htmx.org@1.9.5" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"
        />
        <link rel="stylesheet" href="/styles/uno.css" />
        <script>htmx.config.globalViewTransitions = true</script>
      </head>

      <body class="bg-blue-50">
        <header class="w-full px-10 py-4 bg-blue-100 border-b-2 border-blue-200 shadow-md">
          <a href="/">
            <h1 class="text-2xl font-bold">hyperwave 🌊</h1>
          </a>
        </header>
        <main class="p-10 flex flex-col m-auto justify-center gap-8">
          {children}
        </main>
      </body>
    </html>
  );
}
