import type { FC } from 'hono/jsx';

type InputProps = {
  type?: 'text' | 'email' | 'password';
  name: string;
  placeholder?: string;
  value?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
};

const Input: FC<InputProps> = ({
  type = 'text',
  name,
  placeholder,
  value,
  className = '',
  required = false,
  disabled = false,
  id,
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      required={required}
      disabled={disabled}
      id={id}
      className={`w-full rounded-lg border border-border-primary border-opacity-60 bg-app-background px-4 py-3 text-base text-text-primary placeholder-text-secondary backdrop-blur-sm transition-all duration-300 hover:border-border-accent hover:border-opacity-80 focus:border-border-accent focus:bg-app-background-accent focus:outline-none focus:ring-2 focus:ring-border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 font-primary ${className}`}
      {...props}
    />
  );
};

export default Input;
