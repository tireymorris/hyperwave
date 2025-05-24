import type { FC } from 'hono/jsx';

interface IconButtonProps {
  onClick?: string;
  title?: string;
  className?: string;
  children: any;
  hxGet?: string;
  hxTarget?: string;
  hxSwap?: string;
}

const IconButton: FC<IconButtonProps> = ({
  onClick,
  title,
  className = '',
  children,
  hxGet,
  hxTarget,
  hxSwap,
}) => {
  return (
    <button
      class={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-app-surface/40 text-text-white-dim ring-0 backdrop-blur-sm transition-all duration-200 hover:bg-app-surface hover:text-text-white focus:outline-none focus:ring-1 focus:ring-border-primary/30 ${className}`}
      {...(onClick ? { 'hx-on': `click: ${onClick}` } : {})}
      {...(hxGet ? { 'hx-get': hxGet } : {})}
      {...(hxTarget ? { 'hx-target': hxTarget } : {})}
      {...(hxSwap ? { 'hx-swap': hxSwap } : {})}
      type="button"
      title={title}
    >
      {children}
    </button>
  );
};

export const FullscreenButton: FC<{ className?: string }> = ({
  className = '',
}) => (
  <IconButton
    onClick="document.getElementById('hero-image').requestFullscreen()"
    title="View fullscreen"
    className={`absolute right-3 top-3 z-10 ${className}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7"
      />
    </svg>
  </IconButton>
);

export default IconButton;
