import type { FC } from 'hono/jsx';

interface StatProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'emerald' | 'amber';
  className?: string;
}

const Stat: FC<StatProps> = ({
  label,
  value,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: 'border-interactive-primary/50 text-status-info',
    emerald: 'border-status-success/50 text-status-success',
    amber: 'border-status-warning/50 text-status-warning',
  };

  return (
    <div
      class={`cursor-pointer rounded-lg border-2 bg-app-background p-3 shadow-lg backdrop-blur-lg transition-all duration-200 hover:bg-app-surface-hover ${colorClasses[color]} ${className}`}
    >
      <h3 class="text-sm font-semibold text-text-secondary">{label}</h3>
      <p class="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Stat;
