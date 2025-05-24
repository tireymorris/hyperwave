import { Resend } from 'resend';
import { env } from '@/utils/env';
import { logHandler } from '@/middleware/logger';

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

interface EmailResponse {
  data: { id: string } | null;
  error: Error | null;
}

interface EmailProvider {
  send(config: EmailConfig): Promise<EmailResponse>;
}

class ResendProvider implements EmailProvider {
  private client: Resend;
  private apiKeyConfigured: boolean;
  private static API_KEY_MIN_LENGTH = 10;

  constructor(apiKey?: string) {
    const configuredApiKey = apiKey || env('RESEND_API_KEY');
    this.apiKeyConfigured =
      !!configuredApiKey &&
      configuredApiKey.length > ResendProvider.API_KEY_MIN_LENGTH;

    this.client = new Resend(configuredApiKey);

    logHandler.debug('email', 'Resend provider initialized', {
      apiKeyConfigured: this.apiKeyConfigured,
      apiKeyLength: configuredApiKey ? configuredApiKey.length : 0,
      environment: env('NODE_ENV'),
    });

    if (!this.apiKeyConfigured) {
      logHandler.warn('email', 'Resend API key not properly configured', {
        apiKeyPresent: !!configuredApiKey,
        environment: env('NODE_ENV'),
      });
    }
  }

  async send(config: EmailConfig): Promise<EmailResponse> {
    if (!this.apiKeyConfigured) {
      logHandler.error(
        'email',
        'Cannot send email - Resend API key not configured',
        {
          to: config.to,
          subject: config.subject,
          from: config.from,
          environment: env('NODE_ENV'),
        },
      );
      return {
        data: null,
        error: new Error('Resend API key not properly configured'),
      };
    }

    logHandler.debug('email', 'Preparing to send email via Resend', {
      to: config.to,
      subject: config.subject,
      from: config.from,
      contentLength: config.html.length,
    });

    try {
      logHandler.debug('email', 'Calling Resend API', {
        to: config.to,
        apiKeyConfigured: this.apiKeyConfigured,
      });

      const { data, error } = await this.client.emails.send(config);

      if (error) {
        logHandler.error('email', 'Resend API error', {
          error,
          errorMessage: error.message,
          name: error.name,
          to: config.to,
          from: config.from,
        });
      } else {
        logHandler.debug('email', 'Email sent successfully via Resend', {
          id: data?.id,
          to: config.to,
          from: config.from,
        });
      }

      logHandler.debug('email', 'sendEmailViaResend completed successfully', {
        to: config.to,
        subject: config.subject,
        from: config.from,
      });
      return { data, error };
    } catch (error) {
      logHandler.error('email', 'sendEmailViaResend failed', {
        to: config.to,
        subject: config.subject,
        from: config.from,
        error,
      });
      return { data: null, error: error as Error };
    }
  }
}

class ConsoleEmailProvider implements EmailProvider {
  private lastConfig: EmailConfig | null = null;

  async send(config: EmailConfig): Promise<EmailResponse> {
    this.lastConfig = config;
    logHandler.info('email', 'Sending email:', {
      to: config.to,
      subject: config.subject,
      html: config.html,
    });
    logHandler.debug('email', 'Email sent successfully via console');
    return { data: { id: 'test_console' }, error: null };
  }

  getLastConfig(): EmailConfig | null {
    logHandler.debug('email', 'Retrieving last email config');
    return this.lastConfig;
  }
}

let emailProvider: EmailProvider;

export function initializeEmailProvider(): void {
  if (env('NODE_ENV') === 'development') {
    emailProvider = new ConsoleEmailProvider();
    logHandler.info(
      'email',
      'Initialized Console email provider for local development',
    );
  } else {
    emailProvider = new ResendProvider(env('RESEND_API_KEY'));
    logHandler.info(
      'email',
      'Initialized Resend email provider for production',
    );
  }
}

export function getEmailProvider(): EmailProvider {
  if (!emailProvider) {
    initializeEmailProvider();
  }
  return emailProvider;
}
