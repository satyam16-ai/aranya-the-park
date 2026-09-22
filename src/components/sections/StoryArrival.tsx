import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Story Chapter 01 — Arrival
 * Pinned cinematic scroll sequence:
 * Full-screen visual with "THE LUSHURY LIFE" -> image scale -> architectural reveal -> typography transition.
 */
export const StoryArrival: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current || !pinRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=60%' : '+=100%',
          pin: pinRef.current,
          scrub: 0.3, // Snappy & ultra-responsive 1:1 scroll without laggy dragging
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Subtle scale of arrival visual & fade text 1 out
      tl.to(img1Ref.current, {
        scale: isMobile ? 1.05 : 1.08,
        force3D: true,
        ease: 'none',
      }, 0);

      tl.to(text1Ref.current, {
        opacity: 0,
        y: isMobile ? -20 : -35,
        force3D: true,
        ease: 'power1.out',
      }, 0.1);

      // Phase 2: Fade in architectural image 2 with GPU-accelerated transition
      tl.fromTo(img2Ref.current, 
        { opacity: 0, scale: isMobile ? 1.03 : 1.06 },
        { opacity: 1, scale: 1, force3D: true, ease: 'power1.inOut' },
        0.25
      );

      // Phase 3: Reveal second typography layer cleanly
      tl.fromTo(text2Ref.current,
        { opacity: 0, y: isMobile ? 20 : 35 },
        { opacity: 1, y: 0, force3D: true, ease: 'power2.out' },
        0.45
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="story-arrival" ref={sectionRef} className="relative bg-dark-950 text-ivory">
      <div ref={pinRef} className="relative h-[100dvh] min-h-[100svh] sm:h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Layer 1: Grand Arrival Visual — GPU-accelerated without heavy CSS filters */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            ref={img1Ref}
            src="/assets/opt/grand-lobby-2000.webp"
            alt="Aranya The Park Grand Arrival Lobby"
            className="w-full h-full object-cover object-center will-change-transform transform-gpu"
            style={{ willChange: 'transform, opacity' }}
          />
          {/* Streamlined single-pass ambient dark green overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/30 to-dark-950/50" />
        </div>

        {/* Layer 2: Architectural Elevation Reveal — GPU-accelerated */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <picture>
            <source media="(max-width: 1023px)" srcSet="/assets/story-arrival-aerial-mobile.jpg" />
            <img
              ref={img2Ref}
              src="/assets/story-arrival-aerial.jpg"
              alt="Aranya The Park — twin towers rising from a secluded green canopy beside the 18.3-metre boulevard"
              className="w-full h-full object-cover object-top sm:object-center opacity-0 will-change-transform transform-gpu"
              style={{ willChange: 'transform, opacity' }}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/35 to-dark-950/50" />
        </div>

        {/* Text Layer 1: "THE LUSHURY LIFE" */}
        <div ref={text1Ref} className="relative z-20 text-center px-5 sm:px-6 max-w-4xl mx-auto will-change-transform transform-gpu">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 block mb-4 sm:mb-6 font-medium">
            CHAPTER 01 · THE ARRIVAL
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.14em] text-ivory font-light leading-[0.96] uppercase">
            The Lushury Life
          </h2>
          <p className="font-sans text-[11px] sm:text-sm uppercase tracking-[0.22em] text-ivory/90 mt-4 sm:mt-6 font-light">
            Behind Evershine Mall · Serviced by an 18.3-Metre Boulevard
          </p>
        </div>

        {/* Text Layer 2: Revealed Architectural Paradigm */}
        <div ref={text2Ref} className="absolute z-20 text-center px-5 sm:px-6 max-w-3xl mx-auto opacity-0 pointer-events-none will-change-transform transform-gpu">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 block mb-4 sm:mb-6 font-medium">
            ARCHITECTURAL SCALE
          </span>
          <h3 className="font-serif text-2xl sm:text-5xl md:text-6xl text-ivory font-light leading-tight mb-4 sm:mb-6">
            Where Space, Air & Light Reclaim Their True Meaning
          </h3>
          <p className="font-sans text-xs sm:text-base text-ivory/90 font-light leading-relaxed max-w-2xl mx-auto">
            A sanctuary secluded from city cacophony, rising tall on Malad West's most prestigious boulevard.
          </p>
        </div>
      </div>
    </div>
  );
};
