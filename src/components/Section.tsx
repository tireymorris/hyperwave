import type { Child, FC } from 'hono/jsx';

type SectionProps = {
  title: string;
  children: Child;
  className?: string;
};

const Section: FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <div
      class={`rounded-lg border border-border-primary border-opacity-50 bg-app-background-alt p-6 shadow-sm ${className}`}
    >
      <h2 class="mb-4 text-xl font-semibold font-primary text-text-primary">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Section;
