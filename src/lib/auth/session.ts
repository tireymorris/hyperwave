import type { Context } from 'hono';
import type { TokenPayload } from '@/lib/auth/constants';
import { logHandler } from '@/middleware/logger';

export function getUserFromContext(c: Context): TokenPayload | null {
  try {
    const user = c.get('user');
    if (!user || typeof user !== 'object') {
      return null;
    }

    const userObj = user as TokenPayload;
    if (!userObj.email || !userObj.role || !userObj.type) {
      return null;
    }

    logHandler.debug('auth', 'getUserFromContext completed successfully', {
      context: 'getUserFromContext',
    });
    return userObj;
  } catch (error) {
    logHandler.error('auth', 'getUserFromContext failed', {
      context: 'getUserFromContext',
      error,
    });
    return null;
  }
}

export function isAuthenticated(c: Context): boolean {
  const user = getUserFromContext(c);
  const isAuth = !!user;
  if (!isAuth) {
    logHandler.debug('auth', 'User not authenticated');
  }
  return isAuth;
}

export function getBaseUrl(c: Context): string {
  const url = new URL(c.req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  logHandler.debug('http', 'Generated base URL', { baseUrl });
  return baseUrl;
}
