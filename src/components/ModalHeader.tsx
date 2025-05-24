import type { FC } from 'hono/jsx';

interface ModalHeaderProps {
  title: string;
  onClose: string;
  target: string;
}

const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose, target }) => {
  return (
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-text-primary font-primary">
        {'>'} {title}
      </h2>
      <button
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-app-background text-text-tertiary transition-all duration-200 hover:border-border-secondary hover:bg-app-surface-hover hover:text-text-primary focus:ring-2 focus:ring-border-primary/20 focus:outline-none font-primary"
        hx-get={onClose}
        hx-target={target}
        aria-label="Close modal"
      >
        ✕
      </button>
    </div>
  );
};

export default ModalHeader;
