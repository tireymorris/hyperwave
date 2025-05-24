import { type FC } from 'hono/jsx';

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
};

type InputProps = BaseProps & {
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
};

type TextareaProps = BaseProps & {
  type: 'textarea';
  rows?: number;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
};

type Props = InputProps | TextareaProps;

const baseClasses =
  'w-full rounded-lg border border-border-primary border-opacity-60 bg-app-background px-4 py-3 text-base text-text-primary placeholder-text-secondary backdrop-blur-sm transition-all duration-300 hover:border-border-accent hover:border-opacity-80 focus:border-border-accent focus:bg-app-background-accent focus:outline-none focus:ring-2 focus:ring-border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 font-primary';

const FormField: FC<Props> = (props) => {
  const normalizeValue = (value: string | number | undefined): string => {
    if (value === undefined || value === null) {
      return '';
    }
    return value.toString();
  };

  return (
    <div>
      <label class="mb-1 block text-sm text-text-primary font-primary">
        {props.label}
      </label>
      {props.type === 'textarea' ? (
        <textarea
          name={props.name}
          class={baseClasses}
          placeholder={props.placeholder}
          rows={props.rows}
          required={props.required}
          disabled={props.disabled}
        >
          {normalizeValue(props.value)}
        </textarea>
      ) : (
        <input
          type={props.type}
          name={props.name}
          class={baseClasses}
          placeholder={props.placeholder}
          required={props.required}
          disabled={props.disabled}
          value={normalizeValue(props.value)}
        />
      )}
    </div>
  );
};

export default FormField;
