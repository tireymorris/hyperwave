import type { Child, FC } from 'hono/jsx';

type DangerZoneProps = {
  title: string;
  description: string;
  action: Child;
};

const DangerZone: FC<DangerZoneProps> = ({ title, description, action }) => {
  return (
    <div class="border-t border-border-secondary border-opacity-30 pt-4">
      <h3 class="mb-2 font-medium text-status-error font-primary">
        Danger Zone
      </h3>
      <div class="rounded-lg border border-status-error border-opacity-30 bg-status-error/5 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-status-error font-primary">
              {title}
            </div>
            <div class="text-sm text-status-error-dim font-primary">
              {description}
            </div>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
