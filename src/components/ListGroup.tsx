import { type Child, type FC } from 'hono/jsx';

type ListGroupProps = {
  children: Child;
  spacing?: 'sm' | 'md' | 'lg';
};

const ListGroup: FC<ListGroupProps> = ({ children, spacing = 'md' }) => {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return <div class={spacingClasses[spacing]}>{children}</div>;
};

export default ListGroup;
