import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useReducedMotion } from 'framer-motion';
import type { HeroSlide } from '../types';

/** Dwell time per render, in ms. */
export const INTERVAL = 6000;
/** Cross-fade length, in seconds. */
export const FADE = 1.1;

export interface Carousel {
  slides: HeroSlide[];
  index: number;
  slide: HeroSlide;
  /** The auto-advance timer is running. */
  playing: boolean;
  /** The visitor pressed pause. */
  paused: boolean;
  reduce: boolean;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  togglePaused: () => void;
  /** Spread onto the hovered area: a resting mouse holds the current render. */
  hoverProps: {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
  };
  /** Spread onto the swipeable area. */
  swipeProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  /** Arrow-key navigation for the controls. */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Carousel state: auto-advances while the hero is on screen, the tab is
 * visible, nothing is hovered and the visitor has not paused it or asked
 * for reduced motion. Manual navigation always works.
 */
export function useCarousel(slides: HeroSlide[], inView: boolean): Carousel {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(() => document.visibilityState === 'hidden');
  const reduce = useReducedMotion() ?? false;
  const playing = count > 1 && !paused && !hovered && !hidden && inView && !reduce;

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(next, INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, index, next]);

  useEffect(() => {
    const sync = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touch.current) return;
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = e.changedTouches[0].clientY - touch.current.y;
      touch.current = null;
      // Horizontal, deliberate and not a scroll.
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) next();
      else prev();
    },
    [next, prev]
  );

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true);
  }, []);
  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(false);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  return {
    slides,
    index,
    slide: slides[index],
    playing,
    paused,
    reduce,
    next,
    prev,
    goTo,
    togglePaused,
    hoverProps: { onPointerEnter, onPointerLeave },
    swipeProps: { onTouchStart, onTouchEnd },
    onKeyDown,
  };
}
