import type { FC } from 'hono/jsx';
import Button from '@/components/Button';
import type { Action } from '@/components/Modal';

interface ModalFooterProps {
  onClose: string;
  target: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  dangerAction?: Action;
}

const ModalFooter: FC<ModalFooterProps> = ({
  onClose,
  target,
  primaryAction,
  secondaryAction,
  dangerAction,
}) => {
  return (
    <div class="mt-6 flex items-center justify-between border-t border-border-secondary pt-6">
      <div>
        {dangerAction && (
          <Button
            variant="danger"
            hxGet={onClose}
            hxTarget={target}
            disabled={dangerAction.disabled || false}
          >
            {dangerAction.label}
          </Button>
        )}
      </div>
      <div class="flex gap-2">
        {secondaryAction && (
          <Button
            variant="secondary"
            hxGet={onClose}
            hxTarget={target}
            disabled={secondaryAction.disabled || false}
          >
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant="primary"
            disabled={primaryAction.disabled || false}
            {...(primaryAction['hx-post']
              ? { hxPost: primaryAction['hx-post'] }
              : {})}
            {...(!primaryAction['hx-post'] &&
            (primaryAction['hx-get'] || onClose)
              ? { hxGet: primaryAction['hx-get'] || onClose }
              : {})}
            hxTarget={primaryAction['hx-target'] || target}
            {...(primaryAction['hx-include']
              ? { hxInclude: primaryAction['hx-include'] }
              : {})}
            {...(primaryAction['hx-indicator']
              ? { hxIndicator: primaryAction['hx-indicator'] }
              : {})}
            {...(primaryAction['hx-swap']
              ? { hxSwap: primaryAction['hx-swap'] }
              : {})}
            {...(primaryAction['hx-trigger']
              ? { hxTrigger: primaryAction['hx-trigger'] }
              : {})}
            type={
              primaryAction.type ||
              (primaryAction['hx-post'] ? 'submit' : 'button')
            }
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModalFooter;
