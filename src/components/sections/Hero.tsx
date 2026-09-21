import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { projectData } from '../../data/projectData';
import { heroSlides } from '../../data/heroSlides';
import { Button } from '../common/Button';
import { Frame } from '../common/Frame';
import { easeOutExpo } from '../../lib/motion';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useCarousel } from '../../lib/useCarousel';
import { CarouselArrows, CarouselCaption, CarouselNav, CarouselSlides } from './HeroCarousel';

interface HeroProps {
  onOpenLeadModal: (purpose?: string) => void;
}

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo, delay } },
});

const Wordmark: React.FC = () => (
  <h1 className="m-0">
    <img
      src="/assets/branding/aranya-wordmark-light.png"
      alt=""
      width={2393}
      height={678}
      fetchPriority="high"
      className="h-auto w-[min(100%,22rem)] lg:w-[min(100%,26rem)]"
    />
    <span className="sr-only">{projectData.name}</span>
  </h1>
);

const Ctas: React.FC<HeroProps> = ({ onOpenLeadModal }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <Button size="lg" icon={<ArrowRight size={15} />} onClick={() => onOpenLeadModal('Hero Enquiry')}>
      Enquire now
    </Button>
    <Button variant="secondary" size="lg" href="#residences" icon={<ArrowDown size={15} />}>
      Explore residences
    </Button>
  </div>
);

const Stats: React.FC<{ className?: string }> = ({ className }) => (
  <dl className={className}>
    {projectData.stats.map((s) => (
      <div key={s.label}>
        <dt className="sr-only">{s.label}</dt>
        <dd className="font-display text-[clamp(1.625rem,1rem+1.4vw,2.125rem)] leading-none text-gold-300 tabular-nums">
          {s.value}
        </dd>
        <dd className="t-micro mt-2 text-linen-400">{s.label}</dd>
      </div>
    ))}
  </dl>
);

const Partners: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <img
      src="/assets/branding/project-by-zaveri-bkm-light.png"
      alt={`Project by ${projectData.jointVenture}`}
      width={900}
      height={189}
      loading="lazy"
      className="h-10 w-auto opacity-90"
    />
  </div>
);

const LEAD =
  'Thoughtfully designed 2, 3 & 4 BHK residences with private sundecks and ceilings up to 11 ft, set in 40% open greens behind Evershine Mall, Malad West.';

/**
 * Hero — editorial split on the deepest forest surface. Desktop: copy beside a
 * carousel of the project's renders inside the brochure's gold frame. Phones:
 * the renders run full-bleed with the wordmark, statement and CTAs over their
 * darkened foot, then the lead copy and stats follow on the solid surface.
 */
export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-6%']);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const inView = useInView(ref, { amount: 0.3 });
  const carousel = useCarousel(heroSlides, inView);

  return (
    <section id="overview" ref={ref} data-surface="deepest" className="pinstripe relative isolate overflow-hidden">
      {/* ───────── Phones & tablets ───────── */}
      {!desktop && (
      <div>
        <div
          className="relative min-h-[100svh]"
          aria-roledescription="carousel"
          aria-label="Project renders"
          {...carousel.swipeProps}
        >
          <div className="absolute inset-0 overflow-hidden">
            <CarouselSlides c={carousel} variant="phone" sizes="100vw" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-forest-950/50 via-transparent via-30% to-forest-950 to-[78%]" />
          <div className="relative z-[4] flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-28 sm:px-8">
            <motion.div {...enter(0.1)} className="flex items-center justify-between gap-4">
              <CarouselNav c={carousel} />
              <CarouselArrows c={carousel} size="sm" />
            </motion.div>
            <motion.div {...enter(0.15)}>
              <CarouselCaption c={carousel} className="mt-3" />
            </motion.div>
            <motion.p {...enter(0.2)} className="t-eyebrow mt-8 text-gold-300">
              {projectData.location}
            </motion.p>
            <motion.div {...enter(0.35)} className="mt-6">
              <Wordmark />
            </motion.div>
            <motion.p {...enter(0.5)} className="t-display t-foil mt-5 text-[clamp(1.75rem,1rem+4vw,2.75rem)]">
              {projectData.positioning}
            </motion.p>
            <motion.div {...enter(0.65)} className="mt-8">
              <Ctas onOpenLeadModal={onOpenLeadModal} />
            </motion.div>
          </div>
        </div>
        <div className="px-5 pb-12 pt-10 sm:px-8">
          <p className="t-lead text-linen-300">{LEAD}</p>
          <Stats className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule pt-8" />
          <Partners className="mt-10 flex items-center gap-4" />
        </div>
      </div>
      )}

      {/* ───────── Desktop: exactly one viewport tall ───────── */}
      {desktop && (
      <div className="flex h-[100svh] min-h-[640px] flex-col">
        <div className="mx-auto grid w-full max-w-wide min-h-0 flex-1 grid-cols-12 items-stretch gap-10 px-12 pb-[clamp(2rem,4.5vh,3rem)] pt-[clamp(5.5rem,11vh,7rem)] xl:gap-14">
          <div className="col-span-6 flex min-h-0 flex-col">
            <div className="flex flex-1 flex-col justify-center">
            <motion.p {...enter(0.2)} className="t-eyebrow text-gold-300">
              {projectData.location}
            </motion.p>
            <motion.div {...enter(0.35)} className="mt-[clamp(0.75rem,2vh,1.5rem)]">
              <h1 className="m-0">
                <img
                  src="/assets/branding/aranya-wordmark-light.png"
                  alt=""
                  width={2393}
                  height={678}
                  fetchPriority="high"
                  className="h-auto w-[clamp(17rem,24vh,23rem)]"
                />
                <span className="sr-only">{projectData.name}</span>
              </h1>
            </motion.div>
            <motion.p
              {...enter(0.5)}
              className="t-display t-foil mt-[clamp(0.75rem,1.6vh,1.25rem)] whitespace-nowrap text-[clamp(1.5rem,0.5rem+2.3vw,2.75rem)]"
            >
              {projectData.positioning}
            </motion.p>
            <motion.p {...enter(0.62)} className="t-lead mt-[clamp(0.75rem,1.6vh,1.25rem)] max-w-[46ch] text-linen-300">
              {LEAD}
            </motion.p>
            <motion.div {...enter(0.74)} className="mt-[clamp(1.25rem,2.6vh,1.75rem)]">
              <Ctas onOpenLeadModal={onOpenLeadModal} />
            </motion.div>
            <motion.div {...enter(0.9)}>
              <Stats className="mt-[clamp(1.5rem,3.2vh,2.5rem)] grid grid-cols-4 gap-x-6 border-t border-rule pt-[clamp(1rem,2.2vh,1.5rem)]" />
            </motion.div>
            </div>
            {/* Partner lockup sits on the bottom edge, level with the frame */}
            <motion.div {...enter(1.05)} className="mt-auto shrink-0 pt-[clamp(1rem,2.4vh,1.75rem)] [@media(max-height:720px)]:hidden">
              <Partners className="flex items-center gap-4" />
            </motion.div>
          </div>

          <motion.div
            className="col-span-6 min-h-0"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: easeOutExpo, delay: 0.3 } }}
          >
            <Frame
              as="figure"
              className="h-full min-h-[420px]"
              aria-roledescription="carousel"
              aria-label="Project renders"
              {...carousel.hoverProps}
            >
              <div className="relative h-full w-full overflow-hidden">
                <motion.div style={{ y: imageY }} className="absolute inset-0 -bottom-[6%]">
                  <CarouselSlides c={carousel} variant="desktop" sizes="(min-width: 1024px) 44vw, 100vw" />
                </motion.div>
                <span className="t-micro absolute right-5 top-5 z-[3] hidden rounded-xs border border-gold-400/30 bg-forest-950/50 px-3 py-1.5 text-gold-300 backdrop-blur-sm xl:inline-block">
                  MahaRERA {projectData.mahaRera}
                </span>
                <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-forest-950/95 via-forest-950/65 via-45% to-transparent px-6 pb-5 pt-28">
                  <div className="flex items-center justify-between gap-6">
                    <CarouselNav c={carousel} />
                    <CarouselArrows c={carousel} className="shrink-0" />
                  </div>
                  <figcaption>
                    <CarouselCaption c={carousel} className="mt-3" />
                  </figcaption>
                </div>
              </div>
            </Frame>
          </motion.div>
        </div>

        <motion.a
          href="#highlights"
          aria-label="Scroll to highlights"
          className="absolute bottom-[clamp(0.5rem,1.4vh,1rem)] left-1/2 flex -translate-x-1/2 items-center gap-2 text-linen-500 transition-colors hover:text-gold-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.8 } }}
        >
          <span className="t-micro">Scroll</span>
          <ArrowDown size={12} className="animate-bounce" />
        </motion.a>
      </div>
      )}
    </section>
  );
};
