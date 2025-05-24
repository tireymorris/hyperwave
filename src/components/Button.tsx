import type { Child, FC } from 'hono/jsx';

interface ButtonProps {
  children: Child;
  hxGet?: string;
  hxPost?: string;
  hxPut?: string;
  hxDelete?: string;
  hxTarget?: string;
  hxSwap?: string;
  hxConfirm?: string;
  hxInclude?: string;
  hxIndicator?: string;
  hxTrigger?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: FC<ButtonProps> = ({
  children,
  hxGet,
  hxPost,
  hxPut,
  hxDelete,
  hxTarget,
  hxSwap,
  hxConfirm,
  hxInclude,
  hxIndicator,
  hxTrigger,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseClasses =
    'rounded-lg font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 font-primary border border-opacity-60';

  const variantClasses = {
    primary:
      'border-interactive-primary bg-app-background text-text-primary shadow-md hover:bg-app-surface-hover hover:text-text-primary hover:border-opacity-80 focus:ring-2 focus:ring-interactive-primary/30 focus:outline-none',
    secondary:
      'border-border-subtle bg-app-background text-text-secondary shadow-md hover:bg-app-surface-hover hover:text-text-primary hover:border-border-secondary focus:ring-2 focus:ring-border-primary/20 focus:outline-none',
    danger:
      'border-interactive-danger bg-app-background text-status-error shadow-md hover:bg-status-error/8 hover:text-status-error hover:border-opacity-80 focus:ring-2 focus:ring-interactive-danger/30 focus:outline-none',
  };

  const hxAttrs = {
    ...(hxGet && { 'hx-get': hxGet }),
    ...(hxPost && { 'hx-post': hxPost }),
    ...(hxPut && { 'hx-put': hxPut }),
    ...(hxDelete && { 'hx-delete': hxDelete }),
    ...(hxTarget && { 'hx-target': hxTarget }),
    ...(hxSwap && { 'hx-swap': hxSwap }),
    ...(hxConfirm && { 'hx-confirm': hxConfirm }),
    ...(hxInclude && { 'hx-include': hxInclude }),
    ...(hxIndicator && { 'hx-indicator': hxIndicator }),
    ...(hxTrigger && { 'hx-trigger': hxTrigger }),
  };

  return (
    <button
      class={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...hxAttrs}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
