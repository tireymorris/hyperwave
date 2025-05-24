import type { FC } from 'hono/jsx';

type SelectOption = {
  value: string;
  label: string;
  selected?: boolean;
};

type SelectProps = {
  name: string;
  options: SelectOption[];
  className?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

const Select: FC<SelectProps> = ({
  name,
  options,
  className = '',
  required = false,
  disabled = false,
  id,
  placeholder,
  ...props
}) => {
  return (
    <select
      name={name}
      required={required}
      disabled={disabled}
      id={id}
      class={`min-w-32 rounded-lg border border-border-primary border-opacity-60 bg-app-background px-4 py-3 text-base text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-border-accent hover:border-opacity-80 focus:border-border-accent focus:bg-app-background-accent focus:outline-none focus:ring-2 focus:ring-border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 font-primary ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          selected={option.selected}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
