import type { Child, FC } from 'hono/jsx';
import ModalHeader from '@/components/ModalHeader';
import ModalFooter from '@/components/ModalFooter';

export interface Action {
  label: string;
  disabled: boolean;
  'hx-post'?: string;
  'hx-get'?: string;
  'hx-target'?: string;
  'hx-include'?: string;
  'hx-indicator'?: string;
  'hx-swap'?: string;
  'hx-trigger'?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  title: string;
  children: Child;
  onClose?: string;
  target?: string;
  showFooter?: boolean;
  primaryAction?: Action;
  secondaryAction?: Action;
  dangerAction?: Action;
}

const Modal: FC<ModalProps> = ({
  title,
  children,
  onClose = '/modal/close',
  target = '#modal-container',
  showFooter = true,
  primaryAction,
  secondaryAction,
  dangerAction,
}) => {
  const footerProps = {
    onClose,
    target,
    ...(primaryAction ? { primaryAction } : {}),
    ...(secondaryAction ? { secondaryAction } : {}),
    ...(dangerAction ? { dangerAction } : {}),
  };

  return (
    <div
      id="modal-container"
      class="fixed inset-0 z-[9999] flex items-center justify-center font-primary"
      hx-swap-oob="true"
    >
      <div
        class="fixed inset-0 bg-app-background-overlay backdrop-blur-sm"
        hx-get={onClose}
        hx-target={target}
        hx-trigger="click"
      ></div>

      <div
        class="relative z-[10000] max-h-[90vh] w-[600px] overflow-y-auto rounded-none border border-border-primary bg-app-background-alt border-glow p-6 shadow-xl"
        onclick="event.stopPropagation();"
      >
        <ModalHeader title={title} onClose={onClose} target={target} />
        <div class="text-text-primary font-primary">{children}</div>
        {showFooter && (primaryAction || secondaryAction || dangerAction) && (
          <ModalFooter {...footerProps} />
        )}
      </div>

      <div
        class="hidden"
        hx-get={onClose}
        hx-target={target}
        hx-trigger="keydown[key==='Escape'] from:window"
      ></div>
    </div>
  );
};

export default Modal;
