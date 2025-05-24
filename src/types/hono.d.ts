import type { TokenPayload } from '@/lib/auth/constants';

declare module 'hono' {
  interface ContextVariableMap {
    user: TokenPayload;
  }
}
