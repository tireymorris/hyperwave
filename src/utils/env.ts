import { z } from 'zod';
import { logHandler } from '@/middleware/logger';

const DEFAULT_SECRET_KEY_LENGTH = 32;
const DEFAULT_HTTP_PORT = 3000;

const envSchema = z.object({
  APP_NAME: z.string().default('hyperwave'),
  DATABASE_PATH: z.string().default('app.db'),
  EMAIL_FROM: z.string().default('noreply@example.com'),
  HOST: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(DEFAULT_HTTP_PORT),
  RESEND_API_KEY: z.string().optional().or(z.string()),
  SECRET_KEY: z.string().min(DEFAULT_SECRET_KEY_LENGTH),
  SKIP_AUTH: z.string().default('false'),
});

export function env(key: keyof typeof envSchema.shape): string {
  try {
    const value = envSchema.parse(process.env)[key];
    if (value === undefined && envSchema.shape[key]?.isOptional()) {
      return '';
    }
    if (value === null) {
      logHandler.error(
        'http',
        `Attempted to access unknown environment variable: ${key}`,
      );
      throw new Error(`Environment variable ${key} is not set`);
    }
    return String(value);
  } catch (error) {
    logHandler.error(
      'http',
      `Failed to retrieve environment variable: ${key}`,
      { error },
    );
    throw new Error(`Failed to retrieve environment variable: ${key}`);
  }
}
