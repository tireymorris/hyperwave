import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serveStatic } from '@hono/node-server/serve-static';
import { env } from '@/utils/env';
import { contextLog, logHandler, logging } from '@/middleware/logger';
import { noAuth } from '@/middleware/noAuth';
import { requireAuth } from '@/middleware/requireAuth';
import { errorHandler } from '@/middleware/error-handler';
import authRouter from '@/routers/auth';
import dashboardRouter from '@/routers/dashboard';
import profileRouter from '@/routers/profile';
import settingsRouter from '@/routers/settings';
import modalRouter from '@/routers/modal';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { secureHeaders } from 'hono/secure-headers';
import { HTTP_STATUS } from '@/utils/constants';

const app = new Hono();
logHandler.info('http', 'Initializing server', {
  environment: env('NODE_ENV'),
  skipAuth: env('SKIP_AUTH') === 'true',
});

app.use('*', logging());
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', errorHandler());
app.use('*', secureHeaders());

const skipAuth = env('SKIP_AUTH') === 'true';
if (skipAuth) {
  logHandler.info(
    'auth',
    'Using noAuth middleware - authentication is disabled',
  );
  app.use('*', noAuth());
} else {
  logHandler.info(
    'auth',
    'Using requireAuth middleware - authentication is enabled',
  );
  app.use('/api/*', requireAuth());
  app.use('/dashboard', requireAuth());
  app.use('/profile', requireAuth());
  app.use('/settings', requireAuth());
}

app.use('/styles/*', serveStatic({ root: './public' }));
app.use('/favicon.svg', serveStatic({ path: './public/favicon.svg' }));

app.route('/', authRouter);
app.route('/dashboard', dashboardRouter);
app.route('/profile', profileRouter);
app.route('/settings', settingsRouter);
app.route('/modal', modalRouter);

app.get('/', async (c) => {
  contextLog(c, 'http', 'info', 'User redirected to dashboard');
  return c.redirect('/dashboard');
});

app.notFound((c) => {
  logHandler.warn('http', 'Not found', { path: c.req.path });

  c.status(HTTP_STATUS.NOT_FOUND);

  const path = c.req.path;
  if (
    path.startsWith('/assets/') ||
    path.startsWith('/styles/') ||
    path.startsWith('/js/') ||
    path.startsWith('/images/')
  ) {
    return c.json({ error: 'File not found', path }, HTTP_STATUS.NOT_FOUND);
  }

  return c.html(
    <Layout title="Not Found" c={c}>
      <h2 class="text-xl font-bold text-status-error">❌ Page not found</h2>
      <p class="mt-2 text-text-secondary">
        The page you're looking for doesn't exist.
      </p>
      <Button hxGet="/" hxTarget="body" hxSwap="outerHTML" className="mt-4">
        Go back home
      </Button>
    </Layout>,
  );
});

app.onError((err, _c) => {
  logHandler.error('system', 'Server error', { error: err });
  const status =
    err instanceof Error && 'status' in err && typeof err.status === 'number'
      ? err.status
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return new Response(
    JSON.stringify({ error: err.message || 'Internal server error' }),
    { status },
  );
});

const port = parseInt(env('PORT'), 10);
logHandler.info('system', `Server starting on port ${port}...`);

serve({ fetch: app.fetch, port }, (info) => {
  logHandler.info('system', `Server started on port ${info.port}`);
});
