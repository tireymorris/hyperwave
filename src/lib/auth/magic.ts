import { generateToken } from '@/lib/auth/tokens';
import { TOKEN_EXPIRY_SECONDS } from '@/lib/auth/constants';
import { env } from '@/utils/env';
import { logHandler } from '@/middleware/logger';
import { z } from 'zod';
import { getAuthProvider, getEmailProvider } from '@/lib/providers';

export async function sendMagicLink(
  email: string,
): Promise<{ error: string | null }> {
  if (!email || !z.string().email().safeParse(email).success) {
    logHandler.warn('auth', 'Invalid email format', { email });
    return { error: 'Invalid email format' };
  }

  try {
    const authProvider = await getAuthProvider();
    logHandler.debug('auth', 'User verified or created for magic link', {
      email,
    });

    const token = await generateToken({ type: 'magic', email, role: 'user' });
    logHandler.debug('auth', 'Generated magic link token', {
      email,
      tokenLength: token.length,
    });

    await authProvider.storeToken(token, email, TOKEN_EXPIRY_SECONDS.magic);
    logHandler.debug('auth', 'Stored magic link token', {
      email,
      expiry: TOKEN_EXPIRY_SECONDS.magic,
    });

    const host = env('HOST');
    const appName = env('APP_NAME');
    const magicLink = `${host}/auth/verify?token=${token}`;
    logHandler.debug('auth', 'Created magic link URL', {
      email,
      host,
      appName,
      url: magicLink.substring(0, magicLink.indexOf('?')),
    });

    const emailProvider = getEmailProvider();
    logHandler.debug('auth', 'Initialized email provider', {
      email,
      provider: emailProvider.constructor.name,
    });

    logHandler.info('auth', 'Sending magic link email', { email });

    const mailResponse = await emailProvider.send({
      from: env('EMAIL_FROM'),
      to: email,
      subject: '🔑 Your magic link to sign in',
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Your Magic Login Link</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.5;
                  margin: 0;
                  padding: 0;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  background: #000;
                  background-image: linear-gradient(to bottom right, #000, rgba(17, 24, 39, 0.95), #000);
                  min-height: 100vh;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 40px 20px;
                }
                .wrapper {
                  background: rgba(17, 24, 39, 0.7);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 16px;
                  padding: 32px;
                  color: #fff;
                }
                .logo {
                  margin-bottom: 32px;
                  text-align: center;
                }
                h1 {
                  color: #fff;
                  font-size: 24px;
                  font-weight: 600;
                  margin: 0 0 24px;
                  text-align: center;
                }
                p {
                  color: rgba(255, 255, 255, 0.8);
                  margin: 0 0 24px;
                  text-align: center;
                }
                .button {
                  background: linear-gradient(to right, #3b82f6, #2563eb);
                  border-radius: 6px;
                  color: #fff;
                  display: inline-block;
                  font-weight: 500;
                  padding: 12px 24px;
                  text-decoration: none;
                  text-align: center;
                  width: 100%;
                  max-width: 300px;
                }
                .button:hover {
                  background: linear-gradient(to right, #2563eb, #1d4ed8);
                }
                .link {
                  color: #3b82f6;
                  word-break: break-all;
                }
                .footer {
                  margin-top: 32px;
                  color: rgba(255, 255, 255, 0.5);
                  font-size: 14px;
                  text-align: center;
                }
                .main-content {
                  margin-bottom: 32px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="wrapper">
                  <div class="logo">🌊/div>
                  <div class="main-content">
                    <h1>Welcome to ${appName}!</h1>
                    <p>Click the button below to log in to your account. This link will expire in 15 minutes.</p>
                    <p style="text-align: center;">
                      <a href="${magicLink}" class="button">Log in to ${appName}</a>
                    </p>
                    <p style="margin-top: 24px; font-size: 14px;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${magicLink}" class="link">${magicLink}</a>
                    </p>
                  </div>
                  <div class="footer">
                    <p>This email was sent by ${appName}. If you didn't request this email, you can safely ignore it.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
    });

    if (mailResponse.error) {
      logHandler.error('auth', 'Failed to send magic link email', {
        email,
        error: mailResponse.error,
        errorMessage: mailResponse.error.message,
        errorStack: mailResponse.error.stack,
        from: env('EMAIL_FROM'),
        providerType: emailProvider.constructor.name,
      });
      return { error: 'Failed to send magic link email' };
    }

    logHandler.info('auth', 'Magic link email sent successfully', {
      email,
      messageId: mailResponse.data?.id,
    });

    return { error: null };
  } catch (error) {
    logHandler.error('auth', 'Failed to send magic link', {
      email,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return { error: 'Failed to send magic link' };
  }
}

export async function validateMagicLink(
  token: string,
  email: string,
): Promise<boolean> {
  logHandler.debug('auth', 'Starting magic link validation', {
    email,
    tokenLength: token.length,
  });

  try {
    const authProvider = await getAuthProvider();
    const storage = await authProvider.validateToken(token, email);
    logHandler.debug('auth', 'Token validation result', {
      email,
      isValid: storage,
      tokenLength: token.length,
    });

    if (storage) {
      const userProvider = await authProvider.getUserByEmail(email);

      if (userProvider) {
        await authProvider.updateLastLogin(userProvider.id);
        logHandler.info('user', 'Updated last login time for user', { email });
      } else {
        logHandler.warn('user', 'User not found during magic link validation', {
          email,
        });
      }

      await authProvider.invalidateToken(token);
      logHandler.info('auth', 'Magic link token validated and invalidated', {
        email,
      });
    } else {
      logHandler.warn('auth', 'Invalid magic link token', {
        email,
        tokenLength: token.length,
      });
    }

    return storage;
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logHandler.error('auth', 'Error validating magic link', {
      email,
      errorMessage: errorObj.message,
      errorStack: errorObj.stack,
      errorName: errorObj.name,
    });
    return false;
  }
}
