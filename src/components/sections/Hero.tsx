import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { projectData } from '../../data/projectData';

interface HeroProps {
  onOpenLeadModal?: (purpose?: string) => void;
}

const RAIL_LABELS = [
  ['Urban', 'Serenity'],
  ['Timeless', 'Living'],
  ['Mumbai Lives', 'Elevated'],
];

export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  return (
    <section
      id="overview"
      className="relative min-h-[100svh] lg:h-screen lg:min-h-[760px] flex flex-col overflow-hidden bg-dark-950 text-ivory select-none"
    >
      {/* ─── Tower Render — sized to viewport height, anchored left, dissolving right ─── */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-auto lg:left-[-3%] z-0">
        <img
          src="/assets/opt/render-tower-day-963.webp"
          srcSet="/assets/opt/render-tower-day-800.webp 800w, /assets/opt/render-tower-day-963.webp 963w"
          sizes="(min-width: 1024px) 60vw, 100vw"
          width={963}
          height={1280}
          alt="Aranya The Park — tower elevation, Malad West"
          className="h-full w-full lg:w-auto object-cover object-[50%_bottom] lg:object-bottom brightness-[0.82] saturate-[0.92] contrast-[1.02]"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.5) 80%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.5) 80%, transparent 100%)',
          }}
          fetchPriority="high"
        />
        {/* Mobile readability veil */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-dark-950/55 via-dark-950/35 to-dark-950" />
        {/* Desktop: settle the daylight sky into the deep-green surface */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-dark-950 via-dark-950/25 via-35% to-dark-950/45" />
        {/* Ground + navbar-zone fades */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-dark-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-950/70 to-transparent" />
      </div>

      {/* ─── Faint crest watermark on the dark canvas ─── */}
      <img
        src="/assets/branding/aranya-crest.png"
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute -right-40 top-1/2 -translate-y-1/2 w-[720px] opacity-[0.045] z-0 pointer-events-none"
      />

      {/* ─── Top-right Developer Branding ─── */}
      <img
        src="/assets/branding/project-by-zaveri-bkm-light.png"
        alt={`Project by ${projectData.jointVenture}`}
        className="hidden lg:block absolute right-8 xl:right-12 top-[14%] z-10 h-14 xl:h-16 w-auto object-contain opacity-90 hero-animate-aside"
      />

      {/* ─── Left Editorial Rail ─── */}
      <div className="hidden lg:flex absolute left-7 xl:left-10 top-[19%] bottom-[9%] z-10 flex-col justify-between items-start hero-animate-aside">
        {RAIL_LABELS.map(([a, b], i) => (
          <React.Fragment key={a}>
            {i > 0 && (
              <span className="flex-1 w-px my-5 bg-gradient-to-b from-transparent via-champagne-400/40 to-transparent" />
            )}
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-ivory-muted/80 leading-[1.9] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {a}
              <br />
              {b}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* ─── Navbar spacer ─── */}
      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-[clamp(5.5rem,9vh,8rem)] shrink-0" />

      {/* ─── Main Composition ─── */}
      <div className="relative z-10 flex-1 flex items-center px-5 sm:px-8 lg:pl-0 lg:pr-8 xl:pr-12 py-6 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[22%_minmax(0,1fr)_22%] 2xl:grid-cols-[24%_minmax(0,1fr)_24%] items-center gap-8 xl:gap-10">
          {/* Centre column (over the dissolving image edge) */}
          <div className="lg:col-start-2 text-center max-w-2xl mx-auto lg:max-w-none">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-4 mb-5 sm:mb-7 hero-animate-eyebrow">
              <span className="w-8 sm:w-12 h-px bg-champagne-400/70" />
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-champagne-300 font-medium whitespace-nowrap">
                Malad West · Mumbai
              </span>
              <span className="w-8 sm:w-12 h-px bg-champagne-400/70" />
            </div>

            {/* Title — Official Aranya The Park wordmark lockup */}
            <h1 className="hero-animate-title m-0">
              <img
                src="/assets/branding/aranya-wordmark-light.png"
                alt="Aranya The Park"
                width={2393}
                height={678}
                fetchPriority="high"
                className="w-[clamp(17rem,44vw,36rem)] max-w-full h-auto mx-auto object-contain drop-shadow-[0_6px_30px_rgba(0,0,0,0.65)]"
              />
            </h1>

            {/* Ornament divider */}
            <div className="flex items-center justify-center gap-4 my-6 sm:my-8 lg:my-[clamp(1.25rem,2.6vh,2rem)] hero-animate-subtitle">
              <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-champagne-400/70" />
              <img
                src="/assets/branding/aranya-crest.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 sm:h-7 sm:w-7 opacity-90"
              />
              <span className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-champagne-400/70" />
            </div>

            {/* Tagline + supporting copy */}
            <div className="hero-animate-subtitle">
              <p className="font-serif uppercase tracking-[0.35em] text-ivory/85 text-sm sm:text-lg lg:text-xl mb-4 sm:mb-5 pl-[0.35em]">
                {projectData.positioning}
              </p>
              <p className="font-sans font-light text-ivory-muted text-sm sm:text-base lg:text-[1.05rem] leading-relaxed max-w-[460px] mx-auto">
                Where modern living meets nature&rsquo;s calm. Thoughtfully designed 2, 3 &amp; 4 BHK
                residences amid 40% open greens, for a more meaningful tomorrow.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 lg:mt-[clamp(1.5rem,3.2vh,2.5rem)] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hero-animate-cta">
              <button
                onClick={() => onOpenLeadModal?.('Hero Enquiry')}
                className="btn-lux group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-champagne-400 hover:bg-champagne-300 text-dark-950 font-sans font-semibold text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-[0_8px_30px_rgba(200,169,107,0.28)] hover:shadow-[0_10px_36px_rgba(200,169,107,0.42)] cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="#residences"
                className="btn-lux group w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-8 sm:pl-9 pr-3 py-2.5 rounded-full border border-ivory/25 hover:border-champagne-400/60 text-ivory font-sans font-medium text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-all duration-300 glass-panel-subtle cursor-pointer"
              >
                <span className="py-1">Explore Residences</span>
                <span className="w-8 h-8 rounded-full border border-ivory/30 group-hover:border-champagne-400 group-hover:bg-champagne-400/15 flex items-center justify-center transition-all duration-300">
                  <Play size={10} className="fill-current ml-0.5" />
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Scroll Cue (aligned under the centre column) ─── */}
      <div className="relative z-10 shrink-0 pb-24 sm:pb-28 lg:pb-[clamp(1.25rem,2.5vh,2.25rem)] lg:pr-8 xl:pr-12 grid grid-cols-1 lg:grid-cols-[22%_minmax(0,1fr)_22%] 2xl:grid-cols-[24%_minmax(0,1fr)_24%] hero-animate-cue">
        <div className="lg:col-start-2 flex flex-col items-center gap-3 lg:gap-2.5">
          <img
            src="/assets/branding/project-by-zaveri-bkm-light.png"
            alt={`Project by ${projectData.jointVenture}`}
            className="lg:hidden h-9 w-auto object-contain opacity-85 mb-3"
          />
          <a
            href="#story-arrival"
            className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-ivory-muted/70 hover:text-champagne-300 transition-colors duration-300 cursor-pointer"
          >
            Scroll to Explore
          </a>
        </div>
      </div>
    </section>
  );
};
