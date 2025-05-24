import type { Child, FC } from 'hono/jsx';
import type { Context } from 'hono';
import Navigation from '@/components/Navigation';
import Toast from '@/components/Toast';
import { getUserFromContext, isAuthenticated } from '@/lib/auth/session';
import { logHandler } from '@/middleware/logger';
import { raw } from 'hono/html';
import { createRawInlineScript } from '@/utils/script-loader';

type LayoutProps = {
  title: string;
  currentPath?: string;
  children: Child;
  c: Context;
  notification?: {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  };
  userEmail?: string;
  justLoggedIn?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
};

const Layout: FC<LayoutProps> = ({ title, children, c, spacing = 'lg' }) => {
  const userEmail = getUserFromContext(c)?.email;
  const pathname = c.req.path || '/';
  const isAuthPage = pathname === '/auth';
  const isLandingPage = false;
  const showNav = isAuthenticated(c) && !isAuthPage && !isLandingPage;
  const error = c.req.query('error');
  const justLoggedIn = c.req.query('justLoggedIn');
  const successMessage =
    c.req.query('success') || justLoggedIn
      ? `Welcome back, ${userEmail}!`
      : undefined;

  logHandler.debug('ui', 'Rendering layout', {
    userEmail,
    error,
    successMessage,
    justLoggedIn,
  });

  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  return (
    <>
      {raw('<!DOCTYPE html>')}
      <html
        lang="en"
        class="font-primary min-h-screen bg-app-background text-text-primary antialiased animate-flicker"
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Terminal access granted" />
          <title>
            {title ? `[${title}] - System` : 'Terminal - System access'}
          </title>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="stylesheet" href="/styles/app.css" />
          <link rel="stylesheet" href="/styles/uno.css" />
          {raw(
            `<script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"></script>`,
          )}
          {raw(
            `<script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/class-tools.js"></script>`,
          )}
          {createRawInlineScript(
            'htmx-config',
            'htmx.config.globalViewTransitions = true',
          )}
        </head>
        <body
          class="flex min-h-screen w-full flex-col items-center justify-start bg-app-background relative overflow-x-hidden"
          hx-boost="true"
        >
          {error ? (
            <Toast
              type="error"
              message={
                error === 'invalid_token' || error === 'tampered_token'
                  ? '> Error: Invalid access token - security breach detected'
                  : error === 'expired_token'
                    ? '> Error: Token expired - request new authorization'
                    : error === 'token_revoked'
                      ? '> Error: Token revoked - access denied'
                      : error === 'verification_required'
                        ? '> System: Email verification required'
                        : '> Fatal error: System malfunction detected'
              }
            />
          ) : successMessage ? (
            <Toast
              type="success"
              message={`> Access granted: Welcome ${userEmail}`}
            />
          ) : null}
          {showNav && (
            <Navigation userEmail={userEmail} currentPath={pathname} />
          )}
          <main class={`mx-auto w-full max-w-6xl px-4 py-2 relative z-10`}>
            <div class="border border-border-primary border-glow rounded-lg bg-app-background-alt shadow-2xl transition-all duration-300 p-6">
              <div class={spacingClasses[spacing]}>{children}</div>
            </div>
          </main>
          <div id="modal-container"></div>
        </body>
      </html>
    </>
  );
};

export default Layout;
