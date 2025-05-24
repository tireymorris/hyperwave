import type { Child, FC } from 'hono/jsx';

type FieldRowProps = {
  title: string;
  description?: string;
  children: Child;
  className?: string;
};

const FieldRow: FC<FieldRowProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div
      class={`flex items-center justify-between rounded-lg bg-app-background-accent border border-border-secondary border-opacity-40 p-4 shadow-sm ${className}`}
    >
      <div>
        <div class="font-medium text-text-primary font-primary">{title}</div>
        {description && (
          <div class="text-sm text-text-secondary font-primary">
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default FieldRow;
