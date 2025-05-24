import type { Child, FC } from 'hono/jsx';

type LinkProps = {
  href: string;
  children: Child;
  external?: boolean;
  active?: boolean;
  class?: string;
};

const Link: FC<LinkProps> = ({
  href,
  children,
  external = false,
  active = false,
  class: className = '',
}) => {
  return (
    <a
      href={href}
      target={external ? '_blank' : '_self'}
      rel={external ? 'noopener noreferrer' : undefined}
      class={`cursor-pointer font-medium text-text-secondary no-underline transition-colors duration-200 hover:text-text-primary ${active ? 'text-text-primary' : ''} ${className}`}
    >
      {children}
    </a>
  );
};

export default Link;
