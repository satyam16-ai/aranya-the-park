import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Container } from '../common/Container';
import { Img } from '../common/Img';

const SPREAD = '/assets/opt/lifestyle-park-greens-2800.webp';
const SPREAD_TITLE = 'Welcome to a Forevermore Life';
const SPREAD_CAPTION =
  'Over 40% open green landscapes, sensory aroma lawns and tranquil courtyards, curated by BeyondGreen.';

interface StoryGreensProps {
  onOpenLightbox?: (
    url: string,
    title: string,
    description?: string,
    category?: string
  ) => void;
}

/**
 * Story Chapter 02 — A New Kind of Luxury
 * Editorial storytelling with large typography and imagery:
 * "A NEW KIND OF LUXURY" -> "40% OPEN GREEN SPACES"
 *
 * The brochure page is shown in full as a near-full-bleed showcase band. On
 * desktop it is sized by viewport height so the whole spread — photograph and
 * copy page — is readable in one screen. Below `lg` the spread's text would be
 * far too small, so the frame narrows to the single photo page and the full
 * page is one tap away in the lightbox.
 */
export const StoryGreens: React.FC<StoryGreensProps> = ({ onOpenLightbox }) => {
  const openSpread = () =>
    onOpenLightbox?.(SPREAD, SPREAD_TITLE, SPREAD_CAPTION, 'Chapter 02 · Biophilic Sanctuary');

  return (
    <section id="story-greens" className="section-spacing bg-dark-900 text-ivory relative overflow-hidden">
      {/* Background ambient warmth */}
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Chapter Eyebrow */}
        <div className="text-center mb-14 sm:mb-20">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-6">
            BIOPHILIC SANCTUARY
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-ivory leading-[1.05] max-w-4xl mx-auto uppercase">
            A Newer Kind<br />The Lushury
          </h2>
        </div>

        {/* Editorial band — the stat, the narrative and the metrics now run the
            full width so the image below can take the whole stage. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-10 sm:mb-12 text-left">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-serif text-7xl sm:text-8xl lg:text-9xl text-champagne-300 font-light tracking-tight leading-none block">
              40%
            </span>
            <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-ivory font-semibold block">
              Open Green Spaces
            </span>
          </div>

          <p className="lg:col-span-5 font-sans text-sm sm:text-base text-ivory-muted font-light leading-relaxed">
            While the world races behind fleeting luxuries, we bring you a different kind — <strong className="text-ivory font-medium">The Lushury</strong>. Where life is lush with over 40% open green landscapes, sensory aroma lawns, and tranquil courtyards curated by <strong className="text-ivory font-medium">BeyondGreen</strong>.
          </p>

          <div className="lg:col-span-3 pt-4 border-t border-white/[0.08] flex items-center gap-8">
            <div>
              <span className="font-serif text-2xl text-ivory font-light block">2 Towers</span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70">Tower A &amp; Tower B</span>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <span className="font-serif text-2xl text-ivory font-light block">100%</span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70">Vastu Aligned</span>
            </div>
          </div>
        </div>
      </Container>

      {/* ─── Showcase Band: the brochure page at full scale ─── */}
      <div className="flex justify-center px-4 sm:px-8">
        <button
          type="button"
          onClick={openSpread}
          aria-label="View the full brochure page"
          className="group relative block w-full max-w-[440px] aspect-[692/1000] overflow-hidden rounded-[4px] border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-zoom-in
                     lg:w-auto lg:max-w-none lg:aspect-auto lg:h-[min(86vh,1250px)]"
        >
          <Img
            src={SPREAD}
            alt="Verdant parkscapes at Aranya The Park — the Lushury brochure page"
            sizes="(min-width: 1024px) 1200px, 440px"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-left transition-transform duration-1000 ease-out group-hover:scale-[1.02]
                       lg:static lg:h-full lg:w-auto lg:max-w-[94vw] lg:object-contain"
          />

          {/* Inspect cue */}
          <span className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full glass-panel text-ivory group-hover:text-champagne-300 group-hover:scale-110 transition-all">
            <Maximize2 size={16} />
          </span>
        </button>
      </div>

      {/* Caption sits below the page rather than over it, so it never lands on
          the brochure's own typography. */}
      <div className="flex items-center justify-center gap-3 mt-5 px-4 text-[11px] font-sans text-ivory-muted/70 uppercase tracking-wider text-center">
        <span>BeyondGreen Landscape Architecture</span>
        <span className="w-px h-3 bg-white/[0.12]" />
        <span>Malad West</span>
      </div>
    </section>
  );
};
