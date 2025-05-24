import type { Context, MiddlewareHandler, Next } from 'hono';

const MAX_RETENTION_DAYS = 7;
const HOURS_PER_DAY = 24;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MAX_LOGS_IN_MEMORY = 10000;
const STORAGE_CLEANUP_FACTOR = 0.2;

const categories = {
  auth: { icon: '🔑', description: 'Authentication' },
  token: { icon: '🎟️', description: 'Token operations' },
  email: { icon: '📧', description: 'Email operations' },
  http: { icon: '🌐', description: 'HTTP operations' },
  ui: { icon: '🎨', description: 'UI operations' },
  theme: { icon: '🎭', description: 'Theming' },
  user: { icon: '👤', description: 'User operations' },
  db: { icon: '🗄️', description: 'Database operations' },
  cache: { icon: '📦', description: 'Caching operations' },
  perf: { icon: '⚡', description: 'Performance' },
  storage: { icon: '💾', description: 'Storage operations' },
  system: { icon: '🖥️', description: 'System operations' },
  api: { icon: '🔧', description: 'API operations' },
} as const;

export type LogCategory =
  | 'auth'
  | 'token'
  | 'email'
  | 'http'
  | 'ui'
  | 'theme'
  | 'user'
  | 'db'
  | 'cache'
  | 'perf'
  | 'storage'
  | 'system'
  | 'api';

export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

const MAX_LOG_RETENTION =
  MAX_RETENTION_DAYS *
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  1000;

const logStorage: LogEntry[] = [];

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  icon: string;
  correlationId?: string | undefined;
  data?: Record<string, unknown> | undefined;
  context?:
    | {
        request?:
          | {
              method?: string | undefined;
              path?: string | undefined;
              ip?: string | undefined;
              userAgent?: string | undefined;
            }
          | undefined;
        user?:
          | {
              email?: string | undefined;
            }
          | undefined;
      }
    | undefined;
}

function getIcon(category: LogCategory): string {
  return categories[category]?.icon ?? '🔧';
}

function formatMessage(
  type: string,
  message: string,
  data?: Record<string, unknown>,
): string {
  const timestamp = new Date().toISOString().split('T')[1]?.slice(0, -1) ?? '';
  const prefix = `[${timestamp}] ${type.toUpperCase()}:`;
  const formattedMessage = data
    ? `${message} ${JSON.stringify(data)}`
    : message;
  return `${prefix} ${formattedMessage}`;
}

export const logger = {
  error: (msg: string): boolean => process.stderr.write(`${msg}\n`),
  log: (msg: string): boolean => process.stdout.write(`${msg}\n`),
};

function log(
  level: LogLevel,
  category: LogCategory,
  message: string,
  data?: Record<string, unknown>,
  context?: Context,
): void {
  const icon = getIcon(category);
  const timestamp = new Date().toISOString();

  const logEntry: LogEntry = {
    timestamp,
    level,
    category,
    message,
    icon,
    data,
  };

  if (context) {
    logEntry.context = {
      request: {
        method: context.req.method,
        path: context.req.path,
        ip:
          context.req.header('x-forwarded-for') ||
          context.req.header('x-real-ip'),
        userAgent: context.req.header('user-agent'),
      },
    };

    try {
      const user = context.get('user');
      if (user && typeof user === 'object' && 'email' in user) {
        if (!logEntry.context) {
          logEntry.context = {};
        }
        logEntry.context.user = {
          email: String(user.email),
        };
      }
    } catch (e) {}
  }

  let formattedMessage: string;

  formattedMessage = ` ${formatMessage(category, `${icon} ${message}`, data)}`;

  if (level === LogLevel.ERROR) {
    logger.error(formattedMessage);
  } else {
    logger.log(formattedMessage);
  }

  storeLog(logEntry);
}

function storeLog(entry: LogEntry): void {
  logStorage.push(entry);

  if (logStorage.length > MAX_LOGS_IN_MEMORY) {
    logStorage.splice(
      0,
      Math.floor(MAX_LOGS_IN_MEMORY * STORAGE_CLEANUP_FACTOR),
    );
  }

  const now = Date.now();
  let i = 0;
  while (i < logStorage.length) {
    const timestamp = logStorage[i]?.timestamp;
    if (timestamp) {
      const logDate = new Date(timestamp).getTime();
      if (now - logDate > MAX_LOG_RETENTION) {
        logStorage.splice(i, 1);
      } else {
        i++;
      }
    } else {
      logStorage.splice(i, 1);
    }
  }
}

export const logHandler = {
  error: (
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    context?: Context,
  ): void => log(LogLevel.ERROR, category, message, data, context),
  warn: (
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    context?: Context,
  ): void => log(LogLevel.WARN, category, message, data, context),
  info: (
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    context?: Context,
  ): void => log(LogLevel.INFO, category, message, data, context),
  debug: (
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    context?: Context,
  ): void => log(LogLevel.DEBUG, category, message, data, context),
};

export function getLogs(options?: {
  level?: LogLevel;
  category?: LogCategory;
  limit?: number;
  since?: Date;
}): LogEntry[] {
  const { level, category, limit = MAX_LOGS_IN_MEMORY, since } = options || {};

  let filteredLogs = [...logStorage];

  if (level) {
    const levels = Object.values(LogLevel);
    const levelIndex = levels.indexOf(level);
    const allowedLevels = levels.slice(0, levelIndex + 1);

    filteredLogs = filteredLogs.filter((log) =>
      allowedLevels.includes(log.level),
    );
  }

  if (category) {
    filteredLogs = filteredLogs.filter((log) => log.category === category);
  }

  if (since) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp) >= since,
    );
  }

  return filteredLogs
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, limit);
}

export interface LoggingContext {
  c: Context;
  category: LogCategory;
  level?: keyof typeof logHandler;
  message: string;
  data?: Record<string, unknown> | undefined;
}

export function contextLog(
  c: Context | null,
  category: LogCategory,
  level: keyof typeof logHandler = 'debug',
  message: string,
  data?: Record<string, unknown>,
): void {
  if (c && typeof c.get === 'function') {
    try {
      const logFn = c.get('log');
      if (typeof logFn === 'function') {
        logFn({ c, category, level, message, data });
        return;
      }
    } catch (error) {}
  }

  logHandler[level](category, message, data, c || undefined);
}

export function logging(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const startTime = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    const userAgent = c.req.header('user-agent') || 'unknown';
    const ip =
      c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';

    logHandler.info(
      'http',
      `Request received: ${method} ${path}`,
      {
        method,
        path,
        userAgent,
        ip,
      },
      c,
    );

    c.set('log', (ctx: LoggingContext) => {
      const logLevel = ctx.level || 'debug';
      logHandler[logLevel](ctx.category, ctx.message, ctx.data, ctx.c);
    });

    await next();

    const duration = Date.now() - startTime;

    logHandler.debug(
      'http',
      `Request complete: ${method} ${path}`,
      {
        method,
        path,
        duration: `${duration}ms`,
        status: c.res.status,
      },
      c,
    );
  };
}

declare module 'hono' {
  interface ContextVariableMap {
    log: (ctx: LoggingContext) => void;
  }
}
