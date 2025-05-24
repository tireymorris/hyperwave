import type { Child, FC } from 'hono/jsx';

type ExpandableProps = {
  trigger: Child;
  children: Child;
  defaultExpanded?: boolean;
};

const Expandable: FC<ExpandableProps> = ({
  trigger,
  children,
  defaultExpanded = false,
}) => {
  const uniqueId = `expandable-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div
      class={`group relative z-50 ${defaultExpanded ? 'expanded' : ''}`}
      id={uniqueId}
    >
      <div
        class="cursor-pointer"
        onclick={`document.getElementById('${uniqueId}').classList.toggle('expanded'); return false;`}
      >
        {trigger}
      </div>
      <div class="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-[.expanded]:max-h-[1000px] group-[.expanded]:opacity-100">
        {children}
      </div>
    </div>
  );
};

export default Expandable;
