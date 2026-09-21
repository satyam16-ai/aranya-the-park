import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '../../lib/cn';
import { FADE, INTERVAL, type Carousel } from '../../lib/useCarousel';
import { Img } from '../common/Img';

/** Neighbouring slides are mounted (and therefore fetched) this long after a slide settles. */
const PRELOAD_AFTER = 2000;

interface SlidesProps {
  c: Carousel;
  /** Which crop to use: the near-square desktop frame or the tall phone backdrop. */
  variant: 'desktop' | 'phone';
  sizes: string;
}

/**
 * The stacked renders. The incoming slide fades in on top of the outgoing
 * one (so the dark surface never shows through) while drifting to 106%;
 * neighbours are mounted a moment after each change so the next fade never
 * waits on the network. Nothing is ever unmounted, so revisits are instant.
 */
export const CarouselSlides: React.FC<SlidesProps> = ({ c, variant, sizes }) => {
  const { slides, index, reduce } = c;
  const count = slides.length;
  const [mounted, setMounted] = useState<number[]>([0]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const wanted = [index, (index + 1) % count, (index - 1 + count) % count];
      setMounted((m) =>
        wanted.every((i) => m.includes(i)) ? m : [...new Set([...m, ...wanted])].sort((a, b) => a - b)
      );
    }, PRELOAD_AFTER);
    return () => window.clearTimeout(t);
  }, [index, count]);

  // A manual jump can outrun the preload timer — the current slide is always rendered.
  const shown = mounted.includes(index) ? mounted : [...mounted, index].sort((a, b) => a - b);
  const fade = reduce ? 0.3 : FADE;

  return (
    <>
      {shown.map((i) => {
        const s = slides[i];
        const active = i === index;
        return (
          <motion.div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            className="absolute inset-0"
            style={{ zIndex: active ? 2 : 1 }}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            // Outgoing slides stay opaque underneath until the incoming fade completes.
            transition={active ? { duration: fade, ease: 'easeInOut' } : { duration: 0, delay: fade }}
          >
            <motion.div
              className="h-full w-full"
              initial={false}
              animate={{ scale: active && !reduce ? 1.06 : 1 }}
              transition={active ? { duration: INTERVAL / 1000 + FADE, ease: 'linear' } : { duration: 0, delay: fade }}
            >
              <Img
                src={s.image}
                alt={s.alt}
                sizes={sizes}
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding={i === 0 ? 'sync' : 'async'}
                draggable={false}
                className="h-full w-full object-cover"
                style={{ objectPosition: s.focus[variant] }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
};

interface NavProps {
  c: Carousel;
  className?: string;
}

/** Progress bars (one per render, the current one fills over its dwell time) and a counter. */
export const CarouselNav: React.FC<NavProps> = ({ c, className }) => {
  const { slides, index, playing, goTo, onKeyDown } = c;
  return (
    <div className={cn('flex items-center gap-4', className)} onKeyDown={onKeyDown}>
      <div className="flex items-center gap-1.5">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show render ${i + 1}: ${s.caption}`}
              aria-current={active ? 'true' : undefined}
              className="group flex h-6 items-center"
            >
              <span className="block h-0.5 w-4 overflow-hidden bg-gold-300/30 transition-colors group-hover:bg-gold-300/55 xl:w-7">
                {active && (
                  <motion.span
                    key={`${s.id}-${playing}`}
                    className="block h-full w-full origin-left bg-gold-300"
                    initial={{ scaleX: playing ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <span className="t-micro text-linen-400 tabular-nums">
        <span className="text-gold-300">{String(index + 1).padStart(2, '0')}</span>
        <span className="mx-1 text-linen-500">/</span>
        {String(slides.length).padStart(2, '0')}
      </span>
    </div>
  );
};

interface ArrowsProps {
  c: Carousel;
  className?: string;
  size?: 'sm' | 'md';
}

const ctrl =
  'flex items-center justify-center rounded-full border border-gold-400/40 bg-forest-950/40 text-linen-100 backdrop-blur-sm transition-colors hover:border-gold-300 hover:text-gold-300';

/** Pause/play and previous/next. */
export const CarouselArrows: React.FC<ArrowsProps> = ({ c, className, size = 'md' }) => {
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const icon = size === 'sm' ? 16 : 18;
  return (
    <div className={cn('flex items-center gap-2', className)} onKeyDown={c.onKeyDown}>
      <button
        type="button"
        onClick={c.togglePaused}
        aria-label={c.paused ? 'Play slideshow' : 'Pause slideshow'}
        aria-pressed={c.paused}
        className={cn(ctrl, dim)}
      >
        {c.paused ? <Play size={icon - 3} strokeWidth={1.5} /> : <Pause size={icon - 3} strokeWidth={1.5} />}
      </button>
      <button type="button" onClick={c.prev} aria-label="Previous render" className={cn(ctrl, dim)}>
        <ChevronLeft size={icon} strokeWidth={1.5} />
      </button>
      <button type="button" onClick={c.next} aria-label="Next render" className={cn(ctrl, dim)}>
        <ChevronRight size={icon} strokeWidth={1.5} />
      </button>
    </div>
  );
};

/** "Artist's impression · <caption>", cross-fading with the render. */
export const CarouselCaption: React.FC<{ c: Carousel; className?: string }> = ({ c, className }) => (
  <div className={cn('relative', className)} aria-live={c.playing ? 'off' : 'polite'}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={c.slide.id}
        className="line-clamp-2 font-sans text-[0.8125rem] leading-snug text-linen-200"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-linen-400">Artist's impression · </span>
        {c.slide.caption}
      </motion.p>
    </AnimatePresence>
  </div>
);
