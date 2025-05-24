import { type Child, type FC } from 'hono/jsx';

type Props = {
  primaryText: string;
  secondaryText: string;
  action?: Child;
};

const ListItem: FC<Props> = ({ primaryText, secondaryText, action }) => {
  return (
    <div class="flex items-center justify-between rounded-lg bg-app-surface-dim p-4">
      <div>
        <div class="font-medium">{primaryText}</div>
        <div class="text-sm text-text-tertiary">{secondaryText}</div>
      </div>
      {action && <div class="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export default ListItem;
