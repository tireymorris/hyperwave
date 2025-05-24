import { type MiddlewareHandler } from 'hono';
import { logHandler } from '@/middleware/logger';

export const noAuth = (): MiddlewareHandler => {
  return async (c, next) => {
    logHandler.info('auth', 'Authentication bypassed - using read-only mode');

    c.set('user', {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Guest User',
      role: 'user',
      type: 'access',
    });

    await next();
  };
};
