import type { FC } from 'hono/jsx';

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;

interface ProgressBarProps {
  label: string;
  value: string | number;
  displayValue?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber';
  labelSize?: string;
  valueSize?: string;
  className?: string;
}

const ProgressBar: FC<ProgressBarProps> = ({
  label,
  value,
  color = 'blue',
  displayValue,
  labelSize = 'text-sm',
  valueSize = 'text-sm',
  className = '',
}) => {
  const colorClasses = {
    blue: 'bg-interactive-primary',
    purple: 'bg-interactive-secondary',
    emerald: 'bg-status-success',
    amber: 'bg-status-warning',
  };

  const percentage = typeof value === 'number' ? value : parseInt(value) || 0;
  const width = Math.min(Math.max(percentage, MIN_PERCENTAGE), MAX_PERCENTAGE);

  return (
    <div
      class={`grid grid-cols-[1fr_2fr_1fr] items-center gap-4 text-text-secondary ${className}`}
    >
      <span class={`font-medium ${labelSize}`}>{label}</span>
      <div class="h-2.5 w-full overflow-hidden rounded-full border border-border-subtle bg-app-surface">
        <div
          class={`h-full ${colorClasses[color]}`}
          style={`width: ${width}%`}
        />
      </div>
      <span class={`text-right font-medium ${valueSize}`}>
        {displayValue || `${percentage}%`}
      </span>
    </div>
  );
};

export default ProgressBar;
