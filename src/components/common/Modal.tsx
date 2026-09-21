import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { overlayFade, panelIn } from '../../lib/motion';
import { useDialog } from '../../lib/useDialog';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
type ModalSurface = 'linen' | 'deep';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Header title — a string, or a custom node (e.g. the brand lockup). */
  title?: React.ReactNode;
  /** Accessible name; required when `title` is not a plain string. */
  ariaLabel?: string;
  subtitle?: string;
  size?: ModalSize;
  surface?: ModalSurface;
  /** Selector of the element to focus first (defaults to the first focusable). */
  initialFocus?: string;
  className?: string;
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-[760px]',
  lg: 'max-w-[960px]',
  xl: 'max-w-[1200px]',
};

type PanelProps = Omit<ModalProps, 'isOpen'>;

const Panel: React.FC<PanelProps> = ({
  onClose,
  children,
  title,
  ariaLabel,
  subtitle,
  size = 'md',
  surface = 'linen',
  initialFocus,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, true, onClose, initialFocus);
  const dialogLabel = ariaLabel || (typeof title === 'string' ? title : 'Dialog');

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      variants={overlayFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div
        className="absolute inset-0 bg-forest-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={ref}
        data-surface={surface}
        variants={panelIn}
        className={cn(
          'relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-lg border border-card-border shadow-xl sm:max-h-[88vh] sm:rounded-md',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-card-border bg-surface/95 px-5 py-4 backdrop-blur-md sm:px-7">
          <div className="min-w-0">
            {typeof title === 'string' ? (
              <h3 className="t-h3 truncate text-fg">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="t-micro mt-1 text-fg-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="scroll-x overflow-y-auto overscroll-contain px-5 py-6 sm:px-7 sm:py-7">{children}</div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Modal — portal dialog with animated enter/exit, focus trap, inert page,
 * ESC + backdrop close and scroll lock. Slides up as a sheet on phones.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, ...rest }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{isOpen && <Panel key="modal" {...rest} />}</AnimatePresence>,
    document.body
  );
};
