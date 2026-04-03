import EnableDarkMode from "../util/EnableDarkMode";

type LayoutProps = {
  title: string;
  currentPath?: string;
  children: any;
};

function Layout({ title, children }: LayoutProps) {
  return (
    <html
      lang="en"
      className="bg-white text-black dark:bg-gray-900 dark:text-white"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="hyperwave" />
        <title>{title}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌊</text></svg>"
        />
        <link rel="stylesheet" href="/styles/uno.css" />
        <EnableDarkMode />
      </head>
      <style>{`* { box-sizing: border-box; margin: 0; outline: none; color: unset; }`}</style>
      <body className="font-lato m-0 bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}

export default Layout;
