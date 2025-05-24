import { logHandler } from '@/middleware/logger';
import { getAuthProvider, initializeAuthProvider } from '@/lib/providers/auth';
import {
  getEmailProvider,
  initializeEmailProvider,
} from '@/lib/providers/email';

let isInitialized = false;

async function initialize(): Promise<void> {
  if (isInitialized) return;

  logHandler.info('api', 'Initializing providers');
  await initializeAuthProvider();
  initializeEmailProvider();
  isInitialized = true;
  logHandler.info('api', 'All providers initialized successfully');
}

export { getAuthProvider, getEmailProvider };

void (async (): Promise<void> => {
  try {
    await initialize();
    logHandler.info('api', 'Auto-initialization completed successfully');
  } catch (error) {
    logHandler.error('api', 'Failed to auto-initialize providers', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
})();
