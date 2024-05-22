type Props = {
  title: string;
  currentPath?: string;
  children: any;
};

export default function Layout({ title, children }: Props) {
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
        <script src="https://unpkg.com/htmx.org@1.9.9" />
        <link rel="stylesheet" href="/styles/uno.css" />
        <script>htmx.config.globalViewTransitions = true</script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      </head>

      <style>{`* { box-sizing: border-box; margin: 0; outline: none; color: unset; }`}</style>
      <body class="font-lato m-0 bg-blue-100 p-0 text-base">{children}</body>
    </html>
  );
}
