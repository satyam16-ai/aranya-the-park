import type { Transition, Variants } from 'framer-motion';

/** Shared easing curves (mirrors --ease-out-expo / --ease-luxe in index.css). */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeLuxe = [0.2, 0.8, 0.2, 1] as const;

export const revealTransition: Transition = { duration: 0.7, ease: easeOutExpo };

/** Fade + 24px rise; used by <Reveal> and most section content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeLuxe } },
};

/** Parent variant that staggers its children's `fadeUp`. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Curtain wipe for imagery. */
export const imageWipe: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0 0 0 0)', transition: { duration: 1, ease: [0.77, 0, 0.175, 1] } },
};

export const imageSettle: Variants = {
  hidden: { scale: 1.06 },
  visible: { scale: 1, transition: { duration: 1.4, ease: easeOutExpo } },
};

/** Cross-fade for tab panels. */
export const crossFade: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeLuxe } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } },
};

/** Overlay + panel for modals. */
export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const panelIn: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: easeOutExpo } },
  exit: { opacity: 0, scale: 0.985, y: 8, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const viewportOnce = { once: true, margin: '-10% 0px -10% 0px' } as const;
