const EnableDarkMode = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const updateDarkModeClass = () => {
              const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (prefersDarkMode) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            };

            // Initial check
            updateDarkModeClass();

            // Listen for changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDarkModeClass);
          })();
        `,
      }}
    />
  );
};

export default EnableDarkMode;
