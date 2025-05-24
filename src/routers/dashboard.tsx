import Layout from '@/components/Layout';
import { Hono } from 'hono';
import { contextLog } from '@/middleware/logger';
import { getUserFromContext } from '@/lib/auth/session';
import { env } from '@/utils/env';
import PageHeader from '@/components/PageHeader';

const dashboardRouter = new Hono();

dashboardRouter.get('/', async (c) => {
  const user = getUserFromContext(c);
  const userEmail = user?.email;
  const justLoggedIn = c.req.query('justLoggedIn') === 'true';

  contextLog(c, 'ui', 'debug', 'Viewing dashboard', {
    userEmail,
    justLoggedIn,
  });

  return c.html(
    <Layout title="Dashboard" c={c}>
      <div class="space-y-8">
        <PageHeader title="Dashboard" />

        <div class="space-y-6">
          <div class="rounded-lg border border-border-primary border-opacity-50 bg-app-background-alt p-6 shadow-sm">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              <div class="flex flex-col rounded-lg border border-border-primary border-opacity-40 bg-app-background-accent p-6 shadow-md transition-all hover:bg-border-primary/8 hover:border-opacity-60 font-primary">
                <h3 class="mb-2 text-xl font-bold text-text-primary">
                  [User Data]
                </h3>
                <p class="text-text-secondary">
                  Manage user profile and personal settings
                </p>
                <a
                  href="/profile"
                  class="mt-4 inline-flex items-center justify-center rounded-md bg-app-background border border-border-primary border-opacity-50 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-border-primary/8 hover:border-opacity-70 font-primary"
                >
                  Access Profile
                </a>
              </div>

              <div class="flex flex-col rounded-lg border border-status-info border-opacity-40 bg-app-background-accent p-6 shadow-md transition-all hover:bg-status-info/8 hover:border-opacity-60 font-primary">
                <h3 class="mb-2 text-xl font-bold text-status-info">
                  [Settings]
                </h3>
                <p class="text-text-secondary">
                  Configure application settings and preferences
                </p>
                <a
                  href="/settings"
                  class="mt-4 inline-flex items-center justify-center rounded-md bg-app-background border border-status-info border-opacity-50 px-4 py-2 text-sm font-medium text-status-info transition-colors hover:bg-status-info/8 hover:border-opacity-70 font-primary"
                >
                  Manage Settings
                </a>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-border-primary border-opacity-50 bg-app-background-alt p-6 shadow-sm">
            <h2 class="mb-4 text-xl font-semibold font-primary text-text-primary">
              Welcome!
            </h2>
            <div class="space-y-4">
              <div class="rounded-lg bg-app-background-accent border border-border-primary border-opacity-40 p-4 text-text-primary font-primary shadow-sm">
                <h3 class="mb-2 font-semibold text-text-primary">
                  {env('APP_NAME')}
                </h3>
                <p class="text-sm text-text-secondary">
                  This application provides a base shell with authentication and
                  common UI components. Use it as a starting point for your own
                  applications.
                </p>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://github.com/tireymorris/hyperwave"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-md bg-app-background border border-border-primary border-opacity-50 px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-border-primary/8 hover:border-opacity-70 font-primary"
                >
                  <svg
                    class="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  GitHub Repository
                </a>

                <a
                  href="https://htmx.org/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-md bg-app-background border border-border-primary border-opacity-50 px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-border-primary/8 hover:border-opacity-70 font-primary"
                >
                  HTMX Documentation
                </a>

                <a
                  href="https://tailwindcss.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-md bg-app-background border border-border-primary border-opacity-50 px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-border-primary/8 hover:border-opacity-70 font-primary"
                >
                  Tailwind CSS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
  );
});

export default dashboardRouter;
