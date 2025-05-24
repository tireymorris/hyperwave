import type { Child, FC } from 'hono/jsx';
import Button from '@/components/Button';
import Expandable from '@/components/Expandable';

type ExpandablePanelProps = {
  title: string;
  defaultExpanded?: boolean;
  children: Child;
};

const ExpandablePanel: FC<ExpandablePanelProps> = ({
  title,
  defaultExpanded = true,
  children,
}) => {
  return (
    <Expandable
      defaultExpanded={defaultExpanded}
      trigger={
        <Button
          variant="secondary"
          className="flex w-full items-center justify-between rounded-lg border border-border-subtle bg-app-background-alt px-4 py-2 shadow-xl backdrop-blur-xl hover:bg-app-surface-hover"
        >
          <span class="font-medium">{title}</span>
          <span class="transition-transform duration-300 group-[.expanded]:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </Button>
      }
    >
      {children}
    </Expandable>
  );
};

export default ExpandablePanel;
