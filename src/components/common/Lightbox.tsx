import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
} from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description?: string;
  category?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

/**
 * Lightbox — Modern Dark Luxury Editorial Gallery Viewer
 * Clean deep near-black canvas, floating glass controls, fluid image containment,
 * touch swipe and keyboard navigation.
 */
export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
  category,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onPrev, onNext, hasPrev, hasNext, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50 && onNext && hasNext) {
      onNext();
    } else if (diff < -50 && onPrev && hasPrev) {
      onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#070807]/98 backdrop-blur-2xl text-ivory select-none animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Fullscreen Gallery Viewer`}
    >
      {/* ─── Top Floating Glass Bar ─── */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-[max(1rem,env(safe-area-inset-top,1rem))] pb-3 shrink-0">
        {/* Left: Category & Title */}
        <div className="min-w-0 pr-4">
          {category && (
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-champagne-400 block mb-0.5">
              {category}
            </span>
          )}
          <h3 className="font-serif text-base sm:text-xl text-ivory font-light truncate max-w-xs sm:max-w-md md:max-w-xl">
            {title}
          </h3>
        </div>

        {/* Right: Counter, Tool Actions & Circular Close Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentIndex !== undefined && totalCount !== undefined && (
            <div className="hidden sm:flex items-center px-3 py-1.5 glass-panel rounded-full text-xs font-sans tracking-widest text-champagne-300 border border-white/[0.08]">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="mx-1 text-white/30">/</span>
              <span className="text-ivory-muted/70">{String(totalCount).padStart(2, '0')}</span>
            </div>
          )}

          {/* Floating Glass Tool Pill */}
          <div className="flex items-center p-1 glass-panel rounded-full border border-white/[0.08] shadow-lg">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleReset}
              aria-label="Reset zoom"
              className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            </button>
            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noreferrer"
              aria-label="Download image"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Download Image"
            >
              <Download size={14} />
            </a>
          </div>

          {/* Circular Floating Glass Close Button */}
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="w-10 h-10 rounded-full glass-control border border-white/[0.12] hover:border-champagne-400/50 flex items-center justify-center text-ivory hover:text-champagne-300 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg ml-1"
            title="Close (Esc)"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ─── Architectural Canvas with Floating Navigation Arrows ─── */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center px-4 sm:px-16 py-2">
        {/* Floating Left Arrow */}
        {hasPrev && onPrev && (
          <button
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute left-3 sm:left-8 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full glass-control border border-white/[0.1] hover:border-champagne-400/50 flex items-center justify-center text-ivory hover:text-champagne-300 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl backdrop-blur-xl"
            title="Previous Image (Left Arrow)"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
        )}

        {/* Scaled Photographic Canvas */}
        <div
          className="transition-all duration-300 ease-out origin-center flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            key={imageUrl}
            src={imageUrl}
            alt={title}
            className="max-h-[72vh] sm:max-h-[78vh] max-w-[94vw] sm:max-w-[85vw] object-contain rounded-[3px] border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] animate-fade-in"
          />
        </div>

        {/* Floating Right Arrow */}
        {hasNext && onNext && (
          <button
            onClick={onNext}
            aria-label="Next image"
            className="absolute right-3 sm:right-8 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full glass-control border border-white/[0.1] hover:border-champagne-400/50 flex items-center justify-center text-ivory hover:text-champagne-300 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl backdrop-blur-xl"
            title="Next Image (Right Arrow)"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* ─── Bottom Subtle Information Strip ─── */}
      <div className="relative z-30 px-6 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left shrink-0">
        {description ? (
          <p className="font-sans text-xs text-ivory-muted/80 font-light max-w-xl truncate">
            {description}
          </p>
        ) : (
          <div />
        )}

        {/* Mobile Counter */}
        {currentIndex !== undefined && totalCount !== undefined && (
          <div className="sm:hidden flex items-center px-3 py-1 glass-panel rounded-full text-[11px] font-sans tracking-wider text-champagne-300 border border-white/[0.08]">
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1 text-white/30">/</span>
            <span className="text-ivory-muted/70">{String(totalCount).padStart(2, '0')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
