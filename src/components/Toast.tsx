import type { FC } from 'hono/jsx';
import { createRawToastDismissal } from '@/utils/script-loader';
import { env } from '@/utils/env';

const TOAST_DELAY = {
  test: 100,
  production: 5000,
};

const ANIMATION_DURATION = 200;

interface ToastProps {
  type: 'success' | 'error';
  message: string;
}

const Toast: FC<ToastProps> = ({ type, message }) => {
  const delay =
    env('NODE_ENV') === 'test' ? TOAST_DELAY.test : TOAST_DELAY.production;
  const id = `toast-${Math.random().toString(36).slice(2)}`;
  const scriptId = `script-${id}`;

  return (
    <>
      <div
        id={id}
        class={`fixed right-4 top-4 translate-y-0 transform-gpu opacity-100 transition-all duration-200 ease-out font-primary border-2 ${
          type === 'success'
            ? 'bg-app-background border-status-success text-status-success'
            : 'bg-app-background border-status-error text-status-error'
        } rounded-none p-4 shadow-lg backdrop-blur-lg`}
        style="position: fixed !important; top: 1rem !important; right: 1rem !important; z-index: 9999 !important;"
      >
        <div class="flex items-center">
          <span class="mr-2 text-lg">
            {type === 'success' ? '[SUCCESS]' : '[ERROR]'}
          </span>
          {message}
        </div>
      </div>
      {createRawToastDismissal(id, delay, ANIMATION_DURATION, scriptId)}
    </>
  );
};

export default Toast;
