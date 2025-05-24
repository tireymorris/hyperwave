import type { FC } from 'hono/jsx';

interface ToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  labelSize?: string;
  descriptionSize?: string;
  hxPost?: string;
  hxTarget?: string;
  hxSwap?: string;
  className?: string;
}

const Toggle: FC<ToggleProps> = ({
  label,
  description,
  enabled,
  labelSize = 'text-sm',
  descriptionSize = 'text-xs',
  hxPost,
  hxTarget,
  hxSwap,
  className = '',
}) => {
  const hxAttrs = {
    ...(hxPost && { 'hx-post': hxPost }),
    ...(hxTarget && { 'hx-target': hxTarget }),
    ...(hxSwap && { 'hx-swap': hxSwap }),
  };

  return (
    <div
      class={`flex items-center justify-between rounded-lg bg-app-background-accent border border-border-secondary border-opacity-40 p-4 shadow-sm ${className}`}
    >
      <div>
        <div class={`font-medium text-text-primary font-primary ${labelSize}`}>
          {label}
        </div>
        {description && (
          <div class={`text-text-secondary font-primary ${descriptionSize}`}>
            {description}
          </div>
        )}
      </div>
      <label class="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          class="peer sr-only"
          checked={enabled}
          {...hxAttrs}
        />
        <div class="peer h-6 w-11 cursor-pointer rounded-none bg-app-background border border-border-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-none after:border after:border-border-secondary after:bg-app-background-accent after:transition-all after:content-[''] peer-checked:bg-interactive-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-border-primary peer-checked:after:bg-interactive-primary peer-focus:outline-none"></div>
      </label>
    </div>
  );
};

export default Toggle;
