import { type Child, type FC } from 'hono/jsx';

type PageHeaderProps = {
  title: string;
  icon?: string;
  prefix?: string;
  action?: Child;
};

const PageHeader: FC<PageHeaderProps> = ({
  title,
  icon = '',
  prefix = '',
  action,
}) => {
  return (
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold font-primary text-text-primary">
        {'>'} {prefix && `[${prefix}] `}
        {icon && `[${icon}] `}
        {title}
      </h1>
      {action}
    </div>
  );
};

export default PageHeader;
