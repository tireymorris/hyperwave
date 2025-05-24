import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import {
  COOKIE_CONFIG,
  COOKIE_OPTIONS,
  ERROR_CODES,
  ERROR_CODE_MAP,
  TOKEN_EXPIRY_SECONDS,
} from '@/lib/auth/constants';
import {
  blacklistToken,
  generateCsrfToken,
  generateToken,
  verifyToken,
} from '@/lib/auth/tokens';
import { sendMagicLink, validateMagicLink } from '@/lib/auth/magic';
import { contextLog, logHandler } from '@/middleware/logger';
import { env } from '@/utils/env';
import { getAuthProvider } from '@/lib/providers';
import { z } from 'zod';
import { Hono } from 'hono';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { HTTP_STATUS } from '@/utils/constants';

const BLACKLIST_TIMEOUT_MS = 100;

const authRouter = new Hono();

authRouter.get('/auth/logout', (c) => {
  const accessToken = getCookie(c, COOKIE_CONFIG.access.name);
  const refreshToken = getCookie(c, COOKIE_CONFIG.refresh.name);

  if (accessToken) blacklistToken(accessToken);
  if (refreshToken) blacklistToken(refreshToken);

  deleteCookie(c, COOKIE_CONFIG.access.name, {
    ...COOKIE_OPTIONS,
    path: COOKIE_CONFIG.access.path,
  });
  deleteCookie(c, COOKIE_CONFIG.refresh.name, {
    ...COOKIE_OPTIONS,
    path: COOKIE_CONFIG.refresh.path,
  });

  if (c.req.header('HX-Request')) {
    c.header('HX-Redirect', '/login');
    logHandler.debug('auth', 'User logged out');
    return c.body(null);
  }
  return c.redirect('/login');
});

authRouter.get('/login', async (c) => {
  logHandler.debug('http', 'Login page requested');
  const csrfToken = await generateCsrfToken();
  logHandler.debug('token', 'Generated CSRF token');
  return c.html(
    <Layout title="Sign in" c={c}>
      <div class="mb-8 flex justify-center">
        <span class="flex transform transition-transform duration-300 hover:scale-110">
          <span class="text-2xl font-bold text-text-primary font-primary">
            {env('APP_NAME')}
          </span>
        </span>
      </div>
      <form action="/auth/login" method="post" class="space-y-6">
        <input type="hidden" name="csrf" value={csrfToken} />

        <div class="mb-6 space-y-2 text-center">
          <p class="text-sm text-text-secondary font-primary">
            Enter your email to sign in or create an account
          </p>
        </div>

        <div class="space-y-2">
          <label
            for="email"
            class="block text-sm font-medium text-text-primary font-primary"
          >
            Email Address:
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            className="w-full"
            placeholder="yourname@company.com"
            required
          />
        </div>

        <Button variant="primary" size="lg" className="w-full" type="submit">
          Send Login Link
        </Button>
      </form>

      <footer class="mt-6 text-center">
        <p class="text-center text-sm text-text-secondary font-primary">
          Your data is encrypted and secure with{' '}
          <span class="font-medium text-text-primary">{env('APP_NAME')}</span>
        </p>
      </footer>
    </Layout>,
    HTTP_STATUS.OK,
  );
});

authRouter.post('/auth/login', async (c) => {
  const formData = await c.req.parseBody();
  const email = formData['email']?.toString().trim().toLowerCase();
  const csrfToken = formData['csrf']?.toString();

  if (!csrfToken) {
    return c.json({ error: 'Missing CSRF token' }, HTTP_STATUS.FORBIDDEN);
  }

  try {
    await verifyToken(csrfToken);
    logHandler.debug('auth', 'CSRF token verified successfully', {
      truncatedToken: csrfToken.substring(0, 20) + '...',
    });
  } catch (csrfError) {
    logHandler.error('auth', 'verifyCsrfToken failed', {
      truncatedToken: csrfToken.substring(0, 20) + '...',
      error: csrfError,
    });
    return c.json({ error: 'Invalid CSRF token' }, HTTP_STATUS.FORBIDDEN);
  }

  if (!email || !z.string().email().safeParse(email).success) {
    logHandler.warn('auth', 'Invalid email format', { email });
    c.status(HTTP_STATUS.BAD_REQUEST);
    return c.html(
      <Layout title="Invalid Email" c={c}>
        <div class="flex flex-col space-y-4">
          <h1 class="text-2xl font-bold font-primary text-status-error">
            {'>'} [Error] Invalid Email Format
          </h1>
          <p class="font-primary text-text-primary">
            Please enter a valid email address.
          </p>
          <Button hxGet="/login" hxTarget="body" hxSwap="outerHTML">
            Back to Login
          </Button>
        </div>
      </Layout>,
    );
  }

  logHandler.info('auth', 'Login attempt', { email });

  try {
    const authProvider = await getAuthProvider();
    const userProvider = await authProvider.createUser(email);
    logHandler.info('user', 'User created or found', {
      id: userProvider.id,
      email,
    });

    const token = await generateToken({ type: 'magic', email, role: 'user' });
    await authProvider.storeToken(token, email, TOKEN_EXPIRY_SECONDS.magic);
    logHandler.info('token', 'Magic link token stored', { email });

    if (env('NODE_ENV') === 'development') {
      const host = env('HOST');
      const magicLink = `${host}/auth/verify?token=${token}`;
      logHandler.info('auth', 'Development magic link', { magicLink });

      c.status(HTTP_STATUS.OK);
      return c.html(
        <Layout title="Development Login" c={c}>
          <h2 class="text-xl font-bold text-status-warning font-primary">
            {'>'} Development Mode
          </h2>
          <p class="mt-2 text-text-primary font-primary">
            Check the console for the magic link URL.
          </p>
          <Button hxGet="/login" hxTarget="body" hxSwap="outerHTML">
            Back to Login
          </Button>
        </Layout>,
      );
    }

    const result = await sendMagicLink(email);
    if (result.error) {
      logHandler.error('auth', 'Failed to send magic link', {
        error: result.error,
      });
      c.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      return c.html(
        <Layout title="Error Sending Link" c={c}>
          <h2 class="text-xl font-bold text-status-error font-primary">
            {'>'} [Error] Failed to Send Magic Link
          </h2>
          <p class="mt-2 text-text-primary font-primary">
            There was an issue sending the login link. Please try again later.
          </p>
          <Button hxGet="/login" hxTarget="body" hxSwap="outerHTML">
            Back to Login
          </Button>
        </Layout>,
      );
    }

    logHandler.info('auth', 'Magic link process completed', { email });
    c.status(HTTP_STATUS.OK);
    return c.html(
      <Layout title="Check Your Email" c={c}>
        <h2 class="text-xl font-bold text-status-success font-primary">
          {'>'} [System] Check Your Email
        </h2>
        <p class="mt-2 text-text-primary font-primary">
          We've sent a magic link to{' '}
          <strong class="text-text-primary">{email}</strong>. Click the link
          in the email to log in.
        </p>
        <footer class="mt-4 text-center text-xs text-text-secondary font-primary">
          Can't find the email? Check your spam folder or try again.
        </footer>
      </Layout>,
    );
  } catch (error) {
    logHandler.error('auth', 'Login process failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    c.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return c.html(
      <Layout title="Error" c={c}>
        <h2 class="text-xl font-bold text-status-error font-primary">
          {'>'} [Fatal] System Error
        </h2>
        <p class="mt-2 text-text-primary font-primary">
          An unexpected error occurred. Please try again later.
        </p>
        <Button hxGet="/login" hxTarget="body" hxSwap="outerHTML">
          Back to Login
        </Button>
      </Layout>,
    );
  }
});

authRouter.get('/auth/verify', async (c) => {
  const token = c.req.query('token');
  logHandler.debug('auth', 'Verifying token', { token });

  if (!token) {
    logHandler.warn('auth', 'Missing verification token');
    c.status(HTTP_STATUS.BAD_REQUEST);
    return c.redirect(
      `/login?error=${ERROR_CODES.VERIFICATION_REQUIRED}`,
      HTTP_STATUS.REDIRECT,
    );
  }

  try {
    const payload = await verifyToken(token);
    if (payload.type !== 'magic') {
      throw new Error('Invalid token type');
    }
    if (!payload.email || typeof payload.email !== 'string') {
      throw new Error('Invalid token payload');
    }

    logHandler.debug('token', 'Validating magic link token against storage', {
      email: payload.email,
    });
    const isValid = await validateMagicLink(token, payload.email);
    if (!isValid) {
      logHandler.warn('token', 'Token not found in storage or invalid', {
        email: payload.email,
      });
      throw new Error('Token not found or invalid');
    }
    logHandler.debug('token', 'Token validated successfully against storage', {
      email: payload.email,
    });

    logHandler.debug('auth', 'verifyMagicLinkToken completed successfully', {
      truncatedToken: token.substring(0, 20) + '...',
    });

    const accessToken = await generateToken({
      type: 'access',
      email: payload.email,
      role: payload.role,
    });
    const refreshToken = await generateToken({
      type: 'refresh',
      email: payload.email,
      role: payload.role,
    });
    logHandler.debug('auth', 'Generated session tokens');

    setCookie(c, COOKIE_CONFIG.access.name, accessToken, {
      ...COOKIE_OPTIONS,
      path: COOKIE_CONFIG.access.path,
      maxAge: COOKIE_CONFIG.access.maxAge,
      expires: new Date(Date.now() + COOKIE_CONFIG.access.maxAge * 1000),
      secure: true,
    });

    setCookie(c, COOKIE_CONFIG.refresh.name, refreshToken, {
      ...COOKIE_OPTIONS,
      path: COOKIE_CONFIG.refresh.path,
      maxAge: COOKIE_CONFIG.refresh.maxAge,
    });

    const response = c.redirect(
      `/dashboard?justLoggedIn=true`,
      HTTP_STATUS.REDIRECT,
    );
    logHandler.debug('auth', 'Generated response');

    setTimeout(() => {
      blacklistToken(token);
      logHandler.debug('auth', 'Blacklisted magic token');
    }, BLACKLIST_TIMEOUT_MS);

    return response;
  } catch (verifyError) {
    logHandler.warn('auth', 'Token verification failed', {
      error: verifyError,
      truncatedToken: token.substring(0, 20) + '...',
    });
    const errorCode =
      verifyError instanceof Error && 'code' in verifyError && verifyError.code
        ? (ERROR_CODE_MAP[verifyError.code as keyof typeof ERROR_CODE_MAP] ??
          ERROR_CODES.INVALID)
        : ERROR_CODES.INVALID;
    return c.redirect(`/login?error=${errorCode}`, HTTP_STATUS.REDIRECT);
  }
});

authRouter.all('/auth/refresh', async (c) => {
  const isGet = c.req.method === 'GET';
  const redirectUrl = isGet ? c.req.query('redirect') : null;
  const refreshToken = getCookie(c, COOKIE_CONFIG.refresh.name);

  contextLog(c, 'auth', 'debug', 'Refresh token request received', {
    method: c.req.method,
    hasToken: Boolean(refreshToken),
    tokenLength: refreshToken?.length,
    hasRedirect: Boolean(redirectUrl),
  });

  if (!refreshToken) {
    contextLog(c, 'auth', 'warn', 'Missing refresh token');
    return isGet
      ? c.redirect('/login')
      : c.json({ message: 'Unauthorized' }, HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    contextLog(c, 'auth', 'debug', 'Attempting to verify refresh token');

    const payload = await verifyToken(refreshToken);

    contextLog(c, 'auth', 'debug', 'Refresh token verified', {
      email: payload.email,
      type: payload.type,
    });

    if (payload.type !== 'refresh') {
      contextLog(c, 'auth', 'warn', 'Invalid token type', {
        type: payload.type,
      });
      return isGet
        ? c.redirect('/login')
        : c.json({ message: 'Invalid token' }, HTTP_STATUS.FORBIDDEN);
    }

    const authProvider = await getAuthProvider();
    const userProvider = await authProvider.getUserByEmail(payload.email);

    if (!userProvider) {
      contextLog(c, 'auth', 'warn', 'User not found', { email: payload.email });
      return isGet
        ? c.redirect('/login')
        : c.json({ message: 'User not found' }, HTTP_STATUS.UNAUTHORIZED);
    }

    const newAccessToken = await generateToken({
      type: 'access',
      email: payload.email,
      role: payload.role,
    });
    contextLog(c, 'auth', 'debug', 'Generated new access token');

    setCookie(c, COOKIE_CONFIG.access.name, newAccessToken, {
      ...COOKIE_OPTIONS,
      path: COOKIE_CONFIG.access.path,
      maxAge: COOKIE_CONFIG.access.maxAge,
      expires: new Date(Date.now() + COOKIE_CONFIG.access.maxAge * 1000),
      secure: true,
    });

    if (isGet) {
      const targetUrl = redirectUrl || '/dashboard';
      contextLog(c, 'auth', 'debug', 'Redirecting after token refresh', {
        targetUrl,
      });
      return c.redirect(targetUrl);
    }

    return c.json({ message: 'Token refreshed' }, HTTP_STATUS.OK);
  } catch (error) {
    contextLog(c, 'auth', 'error', 'Failed to refresh token', {
      error: error instanceof Error ? error.message : String(error),
      code:
        error instanceof Error && 'code' in error
          ? (error as { code: string }).code
          : 'unknown',
    });

    return isGet
      ? c.redirect('/login')
      : c.json(
          { message: 'Failed to refresh token' },
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
  }
});

export default authRouter;
