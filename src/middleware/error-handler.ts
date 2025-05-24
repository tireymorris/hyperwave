import type { Context, MiddlewareHandler, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { contextLog } from '@/middleware/logger';
import { HTTP_STATUS } from '@/utils/constants';

const ERROR_PREFIX_LENGTH = 4;

interface ErrorResponse {
  status: number;
  message: string;
  code?: string | undefined;
  details?: Record<string, unknown> | undefined;
}

export function errorHandler(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      return handleError(c, error);
    }
    return c.res;
  };
}

function handleError(c: Context, error: unknown): Response {
  const response = createErrorResponse(error);

  contextLog(c, 'http', 'error', `Request error: ${response.message}`, {
    path: c.req.path,
    method: c.req.method,
    status: response.status,
    code: response.code,
    headers: safeHeaders(c),
    details: response.details,
    error:
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack || 'No stack trace available',
          }
        : String(error),
  });

  if (response.status === HTTP_STATUS.BAD_REQUEST) {
    c.status(HTTP_STATUS.BAD_REQUEST);
  } else if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    c.status(HTTP_STATUS.UNAUTHORIZED);
  } else if (response.status === HTTP_STATUS.FORBIDDEN) {
    c.status(HTTP_STATUS.FORBIDDEN);
  } else if (response.status === HTTP_STATUS.NOT_FOUND) {
    c.status(HTTP_STATUS.NOT_FOUND);
  } else if (response.status === HTTP_STATUS.METHOD_NOT_ALLOWED) {
    c.status(HTTP_STATUS.METHOD_NOT_ALLOWED);
  } else if (response.status === HTTP_STATUS.REQUEST_TIMEOUT) {
    c.status(HTTP_STATUS.REQUEST_TIMEOUT);
  } else if (response.status === HTTP_STATUS.CONFLICT) {
    c.status(HTTP_STATUS.CONFLICT);
  } else if (response.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    c.status(HTTP_STATUS.TOO_MANY_REQUESTS);
  } else if (response.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    c.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  } else if (response.status === HTTP_STATUS.BAD_GATEWAY) {
    c.status(HTTP_STATUS.BAD_GATEWAY);
  } else if (response.status === HTTP_STATUS.SERVICE_UNAVAILABLE) {
    c.status(HTTP_STATUS.SERVICE_UNAVAILABLE);
  } else if (response.status === HTTP_STATUS.GATEWAY_TIMEOUT) {
    c.status(HTTP_STATUS.GATEWAY_TIMEOUT);
  } else {
    c.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  if (c.req.path.startsWith('/api')) {
    return c.json({
      success: false,
      error: {
        message: response.message,
        status: response.status,
        code: response.code,
      },
    });
  }

  return c.redirect(
    `/?error=${encodeURIComponent(response.message || 'An error occurred')}&status=${response.status}`,
  );
}

function createErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof HTTPException) {
    return {
      status: error.status,
      message: error.message || getDefaultMessageForStatus(error.status),
      details: error.getResponse
        ? {
            response: String(error.getResponse()),
          }
        : undefined,
    };
  }

  if (error instanceof Error) {
    const statusMatch = error.message.match(/^(\d{3}):/);
    const status =
      statusMatch && statusMatch[1]
        ? parseInt(statusMatch[1], 10)
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    return {
      status,
      message: statusMatch
        ? error.message.substring(ERROR_PREFIX_LENGTH).trim()
        : error.message,
      code: error.name,
      details: { stack: error.stack || 'No stack trace available' },
    };
  }

  return {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: error ? String(error) : 'Unknown error occurred',
  };
}

function getDefaultMessageForStatus(status: number): string {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Bad Request';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Unauthorized';
    case HTTP_STATUS.FORBIDDEN:
      return 'Forbidden';
    case HTTP_STATUS.NOT_FOUND:
      return 'Not Found';
    case HTTP_STATUS.METHOD_NOT_ALLOWED:
      return 'Method Not Allowed';
    case HTTP_STATUS.REQUEST_TIMEOUT:
      return 'Request Timeout';
    case HTTP_STATUS.CONFLICT:
      return 'Conflict';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'Too Many Requests';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
    case HTTP_STATUS.BAD_GATEWAY:
      return 'Bad Gateway';
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return 'Service Unavailable';
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return 'Gateway Timeout';
    default:
      return 'An unexpected error occurred';
  }
}

function safeHeaders(c: Context): Record<string, string> {
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    if (['authorization', 'cookie'].includes(key.toLowerCase())) {
      headers[key] = '[REDACTED]';
    } else {
      headers[key] = value;
    }
  });
  return headers;
}
