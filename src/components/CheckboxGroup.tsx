import { type FC } from 'hono/jsx';

type Option = {
  value: string;
  label: string;
  checked?: boolean;
};

type Props = {
  label: string;
  name: string;
  options: Option[];
  onChange?: (value: string, checked: boolean) => void;
};

const CheckboxGroup: FC<Props> = ({ label, name, options, onChange }) => {
  return (
    <div>
      <label class="mb-1 block text-sm text-text-tertiary">{label}</label>
      <div class="space-y-2">
        {options.map((option) => (
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={option.checked}
              class="rounded border-border-subtle bg-app-surface-dim"
              onChange={(e: Event) => {
                const target = e.target as HTMLInputElement;
                onChange?.(option.value, target.checked);
              }}
            />
            <span class="text-sm text-text-secondary">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
