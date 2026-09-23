import React, { useCallback, useEffect, useRef, useState } from 'react';
import { projectData } from '../../data/projectData';

/** The headline sets itself letter by letter; these drive the stagger. */
const LETTER_START = 0.45;
const LETTER_STEP = 0.055;

/**
 * The headline split into words, each letter carrying the moment it arrives.
 * Built once at module scope: the schedule never changes, so it has no business
 * being recomputed on every render.
 */
const HEADLINE_WORDS = (() => {
  let i = 0;
  return projectData.positioning.split(' ').map((word, w) => ({
    key: `${word}-${w}`,
    letters: Array.from(word).map((char, c) => ({
      key: `${word}-${w}-${c}`,
      char,
      delay: +(LETTER_START + i++ * LETTER_STEP).toFixed(3),
    })),
  }));
})();

/** The address waits for the last letter to land. */
const ADDRESS_DELAY = +(
  LETTER_START +
  HEADLINE_WORDS.reduce((n, w) => n + w.letters.length, 0) * LETTER_STEP +
  0.25
).toFixed(3);

interface HeroSlide {
  src: string;
  srcSet?: string;
  /** Narrow-viewport source, used through <picture> when present. */
  mobileSrc?: string;
  width: number;
  height: number;
  alt: string;
  /** Crop bias — these frames are far taller than the fold they sit in. */
  position: string;
}

/**
 * The hero frames, in order. Add or remove one here and the slideshow, the dots
 * and the preload schedule all follow; nothing else needs touching.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/assets/opt/life-garden-walk-2000.webp',
    srcSet:
      '/assets/opt/life-garden-walk-640.webp 640w, /assets/opt/life-garden-walk-1280.webp 1280w, /assets/opt/life-garden-walk-2000.webp 2000w',
    width: 2000,
    height: 1787,
    alt: 'A resident walking barefoot along a flowering garden path at Aranya The Park',
    position: 'object-[34%_center] lg:object-center',
  },
  {
    src: '/assets/story-arrival-aerial.jpg',
    mobileSrc: '/assets/story-arrival-aerial-mobile.jpg',
    width: 2000,
    height: 2519,
    alt: 'Aranya The Park — twin towers rising from a secluded green canopy beside the 18.3-metre boulevard',
    position: 'object-top sm:object-center',
  },
  {
    src: '/assets/opt/grand-lobby-2000.webp',
    srcSet:
      '/assets/opt/grand-lobby-640.webp 640w, /assets/opt/grand-lobby-1280.webp 1280w, /assets/opt/grand-lobby-2000.webp 2000w',
    width: 2000,
    height: 1445,
    alt: 'The double-height air-conditioned arrival lobby at Aranya The Park',
    position: 'object-center',
  },
];

/** Dwell per frame, and the cross-fade that carries one into the next. */
const SLIDE_MS = 6000;
const FADE_MS = 1400;
/** The later frames stay off the network until the first one has landed. */
const PRELOAD_DELAY_MS = 1200;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hero — The Arrival.
 *
 * Layer one is deliberately bare: the positioning line in gold, setting itself
 * one letter at a time, over its address. The frames behind it cross-fade on a
 * timer — the client's 23-09 note asked for a slideshow in place of the pinned
 * GSAP sequence that revealed the second frame on scroll, so the hero is now a
 * single viewport that costs no scroll distance at all.
 *
 * The timer stops whenever the hero is off-screen or the tab is hidden, and
 * `prefers-reduced-motion` holds the first frame with the dots still working.
 */
export const Hero: React.FC = () => {
  const [active, setActive] = useState(0);
  const [preloadRest, setPreloadRest] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  /** Why the slideshow is currently held, if it is. */
  const pausedRef = useRef({ hidden: false, offscreen: false });

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const schedule = useCallback(() => {
    stop();
    if (HERO_SLIDES.length < 2 || prefersReducedMotion()) return;
    if (pausedRef.current.hidden || pausedRef.current.offscreen) return;
    timerRef.current = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_SLIDES.length),
      SLIDE_MS
    );
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setPreloadRest(true);
      setActive(i);
      // A manual pick earns a full dwell, not the remainder of the old one.
      schedule();
    },
    [schedule]
  );

  // Give the first frame the network to itself; it is the LCP element.
  useEffect(() => {
    const t = window.setTimeout(() => setPreloadRest(true), PRELOAD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      pausedRef.current.hidden = document.hidden;
      schedule();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current.offscreen = !entry.isIntersecting;
        schedule();
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    schedule();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, [schedule]);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative h-[100dvh] min-h-[100svh] sm:h-screen w-full overflow-hidden flex flex-col bg-dark-950 text-ivory select-none"
    >
      {/* ─── Frames ─── */}
      {/* The frames are clipped here: each one is scaled past the fold by the
          slow push, and this is what keeps that off the page. */}
      <div data-hero-frames className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {HERO_SLIDES.map((slide, i) => {
          const isActive = i === active;
          // Frames past the first stay unmounted until the hero has settled.
          if (i > 0 && !preloadRest) return null;

          const img = (
            <img
              src={slide.src}
              srcSet={slide.srcSet}
              sizes="100vw"
              width={slide.width}
              height={slide.height}
              alt={isActive ? slide.alt : ''}
              fetchPriority={i === 0 ? 'high' : 'low'}
              className={`w-full h-full object-cover transform-gpu ${slide.position}`}
            />
          );

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity ease-out ${
                isActive ? 'opacity-100 hero-slide-active' : 'opacity-0'
              }`}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            >
              {slide.mobileSrc ? (
                <picture>
                  <source media="(max-width: 1023px)" srcSet={slide.mobileSrc} />
                  {img}
                </picture>
              ) : (
                img
              )}
            </div>
          );
        })}

        {/* Readability stack — neutral black, never the brand green: a green
            wash over the photography is what the client rejected on 23-09.
            Weight goes only where the copy is, plus the two edge fades that
            seam the frame into the page. */}
        <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(ellipse_56%_38%_at_50%_50%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.38)_50%,transparent_84%)]" />
        {/* The mobile crop is a narrow slice of a wide frame, so it takes a
            single soft veil instead of the desktop centre scrim. */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-black/45 via-black/32 to-black/55" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-dark-950 to-transparent" />
      </div>

      {/* ─── Top-right Developer Branding ─── */}
      <div className="hidden lg:block absolute right-8 xl:right-12 top-[14%] z-20">
        <img
          src="/assets/branding/project-by-zaveri-bkm-light.png"
          alt={`Project by ${projectData.jointVenture}`}
          className="h-14 xl:h-16 w-auto object-contain opacity-90 hero-animate-aside"
        />
      </div>

      {/* ─── Navbar spacer ─── */}
      <div className="relative z-20 pt-[4.5rem] sm:pt-28 lg:pt-[clamp(5.5rem,9vh,8rem)] shrink-0" />

      {/* ─── The statement ─── */}
      <div className="relative z-20 flex-1 flex items-center px-5 sm:px-8 py-4 lg:py-0">
        {/* One statement and its address, nothing else: the client's 23-09
            note took the wordmark, the supporting copy and both buttons out
            of the first fold. Enquiry lives in the navbar and the sticky bar. */}
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="m-0 font-serif uppercase text-champagne-400 leading-[1.06] tracking-[0.08em] sm:tracking-[0.12em] text-[clamp(1.875rem,7vw,4.5rem)] drop-shadow-[0_4px_26px_rgba(0,0,0,0.8)]">
            {/* The line is announced once, in full, from here; the animated
                letters are decoration and stay out of the a11y tree. */}
            <span className="sr-only">
              {projectData.name} &mdash; {projectData.positioning}
            </span>
            <span aria-hidden="true">
              {HEADLINE_WORDS.map((word, w) => (
                <React.Fragment key={word.key}>
                  {/* A real space between words, so the line can still wrap
                      on a narrow screen. */}
                  {w > 0 && ' '}
                  <span className="inline-block">
                    {word.letters.map((letter) => (
                      <span
                        key={letter.key}
                        className="hero-letter inline-block"
                        style={{ animationDelay: `${letter.delay}s` }}
                      >
                        {letter.char}
                      </span>
                    ))}
                  </span>
                </React.Fragment>
              ))}
            </span>
          </h1>

          <div
            className="hero-animate-subtitle mt-5 sm:mt-7 flex items-center justify-center gap-4 sm:gap-5"
            style={{ animationDelay: `${ADDRESS_DELAY}s` }}
          >
            <span className="hidden sm:block w-10 lg:w-16 h-px bg-champagne-400/60 shrink-0" />
            <p className="font-sans uppercase text-champagne-300 font-medium leading-relaxed tracking-[0.14em] sm:tracking-[0.24em] text-[11px] sm:text-sm lg:text-base drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Behind Evershine Mall &middot; {projectData.location}
            </p>
            <span className="hidden sm:block w-10 lg:w-16 h-px bg-champagne-400/60 shrink-0" />
          </div>
        </div>
      </div>

      {/* ─── Frame dots + scroll cue ─── */}
      <div className="relative z-20 shrink-0 pb-16 sm:pb-20 lg:pb-[clamp(1.25rem,2.5vh,2.25rem)]">
        <div className="flex flex-col items-center gap-4 lg:gap-3.5 hero-animate-cue">
          <div className="flex items-center gap-2" aria-label="Hero frames">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show frame ${i + 1} of ${HERO_SLIDES.length}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  i === active ? 'w-7 bg-champagne-400' : 'w-1.5 bg-ivory/35 hover:bg-ivory/70'
                }`}
              />
            ))}
          </div>

          <img
            src="/assets/branding/project-by-zaveri-bkm-light.png"
            alt={`Project by ${projectData.jointVenture}`}
            className="lg:hidden h-9 w-auto object-contain opacity-85"
          />
          <a
            href="#story-greens"
            className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-ivory-muted/70 hover:text-champagne-300 transition-colors duration-300 cursor-pointer"
          >
            Scroll to Explore
          </a>
        </div>
      </div>
    </section>
  );
};
