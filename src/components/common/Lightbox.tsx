import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { overlayFade } from '../../lib/motion';
import { useDialog } from '../../lib/useDialog';

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
  category?: string;
  /** Optional bullet list shown under the description (e.g. amenity highlights). */
  highlights?: string[];
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

const toolBtn =
  'flex h-10 w-10 items-center justify-center rounded-full text-linen-300 transition-colors hover:bg-white/[0.08] hover:text-gold-300';

const Viewer: React.FC<Omit<LightboxProps, 'isOpen'>> = ({
  onClose,
  imageUrl,
  title,
  description,
  category,
  highlights,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useDialog(containerRef, true, onClose, '[data-lightbox-close]');

  useEffect(() => setZoom(1), [imageUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPrev, onNext, hasPrev, hasNext]);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && onNext && hasNext) onNext();
    else if (diff < -50 && onPrev && hasPrev) onPrev();
    touchStartX.current = null;
  };

  const counter =
    currentIndex !== undefined && totalCount !== undefined ? (
      <span className="t-micro text-linen-400 tabular-nums">
        <span className="text-gold-300">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="mx-1.5 text-linen-500">/</span>
        {String(totalCount).padStart(2, '0')}
      </span>
    ) : null;

  return (
    <motion.div
      ref={containerRef}
      data-surface="deepest"
      className="fixed inset-0 z-[110] flex select-none flex-col bg-forest-950/[0.97] text-linen-100 backdrop-blur-xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image viewer`}
      variants={overlayFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-start justify-between gap-4 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top,1rem))] sm:px-8">
        <div className="min-w-0 pr-2">
          {category && <span className="t-micro mb-1 block text-gold-300">{category}</span>}
          <h3 className="t-h3 line-clamp-2 text-[1.125rem] text-linen-100 sm:text-h3">{title}</h3>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden pr-2 sm:block">{counter}</div>
          <div className="flex items-center rounded-full border border-white/10 bg-forest-900/80 p-0.5">
            <button type="button" onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))} aria-label="Zoom in" className={toolBtn}>
              <ZoomIn size={16} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))} aria-label="Zoom out" className={toolBtn}>
              <ZoomOut size={16} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom" className={cn(toolBtn, 'hidden sm:flex')}>
              <RotateCcw size={15} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" className={cn(toolBtn, 'hidden sm:flex')}>
              {isFullscreen ? <Minimize size={15} strokeWidth={1.5} /> : <Maximize size={15} strokeWidth={1.5} />}
            </button>
          </div>
          <button
            type="button"
            data-lightbox-close
            onClick={onClose}
            aria-label="Close (Esc)"
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-linen-100 transition-colors hover:border-gold-300 hover:text-gold-300"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-2 sm:px-20">
        {hasPrev && onPrev && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-forest-900/70 text-linen-100 transition-all hover:border-gold-400/60 hover:text-gold-300 sm:left-8"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        )}

        <div
          className="flex max-h-full max-w-full items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt={title}
              className="max-h-[68vh] max-w-[94vw] rounded-xs object-contain shadow-xl sm:max-h-[76vh] sm:max-w-[82vw]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {hasNext && onNext && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-forest-900/70 text-linen-100 transition-all hover:border-gold-400/60 hover:text-gold-300 sm:right-8"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="flex shrink-0 flex-col gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] pt-2 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="min-w-0 max-w-2xl">
          {description && <p className="t-small text-linen-300">{description}</p>}
          {highlights && highlights.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {highlights.map((h) => (
                <li key={h} className="t-micro flex items-center gap-2 text-linen-400">
                  <span className="h-1 w-1 rounded-full bg-gold-400" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="sm:hidden">{counter}</div>
      </div>
    </motion.div>
  );
};

/** Fullscreen image viewer with zoom, swipe, keyboard navigation and captions. */
export const Lightbox: React.FC<LightboxProps> = ({ isOpen, ...rest }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{isOpen && <Viewer key="lightbox" {...rest} />}</AnimatePresence>,
    document.body
  );
};
