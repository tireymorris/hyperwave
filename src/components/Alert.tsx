import { type Child, type FC } from 'hono/jsx';

type AlertType = 'default' | 'success' | 'warning' | 'error' | 'info';

type AlertProps = {
  title: string;
  description?: string;
  type?: AlertType;
  action?: Child;
};

const Alert: FC<AlertProps> = ({
  title,
  description,
  type = 'default',
  action,
}) => {
  const typeStyles = {
    default: 'bg-app-background-accent border-border-primary border-opacity-40',
    success: 'bg-app-background-accent border-status-success border-opacity-40',
    warning: 'bg-app-background-accent border-status-warning border-opacity-40',
    error: 'bg-app-background-accent border-status-error border-opacity-40',
    info: 'bg-app-background-accent border-status-info border-opacity-40',
  };

  const titleStyles = {
    default: 'font-medium text-text-primary font-primary',
    success: 'font-medium text-status-success font-primary',
    warning: 'font-medium text-status-warning font-primary',
    error: 'font-medium text-status-error font-primary',
    info: 'font-medium text-status-info font-primary',
  };

  return (
    <div
      class={`flex items-center justify-between rounded-lg border ${typeStyles[type]} p-4 font-primary shadow-sm`}
    >
      <div>
        <div class={titleStyles[type]}>
          {'>'} {title}
        </div>
        {description && (
          <div class="text-sm text-text-secondary font-primary">
            {description}
          </div>
        )}
      </div>
      {action}
    </div>
  );
};

export default Alert;
