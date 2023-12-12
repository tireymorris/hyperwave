import Magnify from "../../assets/icons/magnify";
import Input from "./Input";
import Nav from "./Nav";

type Props = {
  title: string;
  currentPath?: string;
  children: any;
};

export default function Layout({ title, children, currentPath }: Props) {
  return (
    <html lang="en" hx-boost="true" hx-swap="outerHTML transition:true">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="hyperwave" />
        <title>{title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎄</text></svg>"
        />
        <script src="https://unpkg.com/htmx.org@1.9.9" />
        <link rel="stylesheet" href="/styles/uno.css" />
        <script>htmx.config.globalViewTransitions = true</script>
      </head>

      <style>{`* { box-sizing: border-box; margin: 0; outline: none; color: unset; }`}</style>

      <body class="bg-gray-100 font-lato m-0 text-base">
        <header class="border-b-solid border-b-1 fixed sticky flex w-full gap-16 border-slate-200 bg-white py-3 pl-10 pr-4 leading-5">
          <a href="/" class="no-underline">
            <h1>Hyperwave 🌊</h1>
          </a>
          <div class="relative hidden md:block">
            <Input
              class="w-80"
              placeholder="Search clients, trips, groups, or invoices..."
            />
            <span class="relative right-8 top-0.5 fill-neutral-500">
              <Magnify />
            </span>
          </div>
        </header>

        <Nav currentPath={currentPath} />

        <main class="m-auto flex flex-col justify-center gap-8 px-10 py-4 pl-20 md:pl-60">
          {children}
        </main>
      </body>
    </html>
  );
}
