import type { FC } from 'hono/jsx';

export const FormattedText: FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  return (
    <div class={className} dangerouslySetInnerHTML={{ __html: text }}></div>
  );
};

export default FormattedText;
