import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Title shown in the modal header */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Max width variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom max width override */
  maxWidth?: string;
}

const modalSizes: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-[820px] lg:max-w-[860px]',
  lg: 'max-w-[900px]',
};

/**
 * Modal — Dark Luxury overlay dialog with glass panel styling.
 * Supports ESC to close, click-outside to close, scroll lock.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  size = 'md',
  maxWidth,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/85 backdrop-blur-md animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Panel — Compact, Elegant, Max 85vh */}
      <div
        className={`relative w-full ${maxWidth || modalSizes[size]} bg-dark-900/95 border border-champagne-400/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] rounded-lg sm:rounded-xl animate-scale-in max-h-[85vh] overflow-y-auto overflow-touch z-10`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 border-b border-white/[0.08] sticky top-0 bg-dark-900/95 backdrop-blur-md z-20">
            <div>
              <h3 className="font-serif text-lg sm:text-2xl text-ivory font-light tracking-wide">{title}</h3>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-champagne-300/90 mt-0.5 font-sans font-medium tracking-wider uppercase">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.08] rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Close button (when no title) */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.08] rounded-full transition-all duration-200 z-10 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-7">{children}</div>
      </div>
    </div>
  );
};
