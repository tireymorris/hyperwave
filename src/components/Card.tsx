import type { Child, FC } from 'hono/jsx';

interface CardProps {
  children: Child;
  title?: string;
  titleSize?: string;
  action?: Child;
  className?: string;
  variant?: 'default' | 'section';
}

const Card: FC<CardProps> = ({
  children,
  title,
  titleSize = 'text-sm',
  action,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = 'rounded-lg border border-opacity-50';
  const variantStyles =
    variant === 'section'
      ? 'bg-app-background-accent p-6 border-border-primary'
      : 'bg-app-background-alt p-4 opacity-90 shadow-md backdrop-blur-lg border-border-subtle';

  return (
    <div class={`${baseStyles} ${variantStyles} ${className}`}>
      {(title || action) && (
        <div class="mb-3 flex items-center justify-between">
          {title && (
            <h3
              class={`font-semibold font-primary ${variant === 'section' ? 'text-xl text-text-primary' : `text-text-primary ${titleSize}`}`}
            >
              {'>'} {title}
            </h3>
          )}
          {action}
        </div>
      )}
      <div class="text-text-primary font-primary">{children}</div>
    </div>
  );
};

export default Card;
