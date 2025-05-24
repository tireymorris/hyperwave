import type { Context, MiddlewareHandler, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { getUserFromContext } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/tokens';
import { COOKIE_CONFIG } from '@/lib/auth/constants';
import { getAuthProvider } from '@/lib/providers';
import { contextLog } from '@/middleware/logger';

export function requireAuth(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    try {
      const existingUser = getUserFromContext(c);
      if (existingUser) {
        return next();
      }

      const accessToken = getCookie(c, COOKIE_CONFIG.access.name);

      if (!accessToken) {
        contextLog(
          c,
          'auth',
          'debug',
          '🔑 No access token, redirecting to refresh endpoint',
        );
        return c.redirect(
          `/auth/refresh?redirect=${encodeURIComponent(c.req.url)}`,
        );
      }

      try {
        const payload = await verifyToken(accessToken);
        if (!payload) {
          contextLog(
            c,
            'auth',
            'debug',
            '🔑 Invalid access token, redirecting to refresh endpoint',
          );
          return c.redirect(
            `/auth/refresh?redirect=${encodeURIComponent(c.req.url)}`,
          );
        }

        const authProvider = await getAuthProvider();
        const user = await authProvider.getUserByEmail(payload.email);
        if (!user) {
          contextLog(
            c,
            'auth',
            'debug',
            '🔑 Redirecting to login - user not found',
          );
          return c.redirect('/login');
        }

        c.set('user', payload);
        return next();
      } catch (error) {
        contextLog(
          c,
          'auth',
          'debug',
          '🔑 Access token verification failed, redirecting to refresh endpoint',
          {
            error,
          },
        );
        return c.redirect(
          `/auth/refresh?redirect=${encodeURIComponent(c.req.url)}`,
        );
      }
    } catch (error) {
      contextLog(c, 'auth', 'error', '🔑 Error in requireAuth middleware', {
        error,
      });
      return c.redirect('/login');
    }
  };
}
