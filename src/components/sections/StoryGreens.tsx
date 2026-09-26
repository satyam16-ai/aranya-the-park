import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Img } from '../common/Img';
import { ImageCredit } from '../common/ImageCredit';
import { SectionBackdrop } from '../common/SectionBackdrop';

const SPREAD = '/assets/opt/render-fitness-club-2600.webp';
const SPREAD_TITLE = 'Welcome to a Forevermore Life';
const SPREAD_CAPTION =
  '40% open green spaces, an aroma garden and landscaped walks.';

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
 * The project render of the clubhouse lawns and play area runs as a
 * near-full-bleed showcase band, sized by viewport height on desktop and as a
 * 4:3 frame on narrower screens, with the full image one tap away in the
 * lightbox.
 */
export const StoryGreens: React.FC<StoryGreensProps> = ({ onOpenLightbox }) => {
  const openSpread = () =>
    onOpenLightbox?.(SPREAD, SPREAD_TITLE, SPREAD_CAPTION, 'The Lushury Life');

  return (
    <section id="story-greens" className="section-spacing bg-dark-900 text-ivory relative isolate overflow-hidden">
      <SectionBackdrop />

      <Container size="showcase">
        {/* Chapter Eyebrow */}
        <SectionHeading
          eyebrow="Welcome to a Forevermore Life"
          title="Luxury, Made Lush"
        />

        {/* Editorial band — commented out
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-10 sm:mb-12 text-left">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-serif text-5xl sm:text-6xl lg:text-7xl text-champagne-300 font-light tracking-tight leading-none block">
              40%
            </span>
            <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-ivory font-semibold block">
              Open Green Spaces
            </span>
          </div>

          <p className="lg:col-span-5 font-sans text-sm sm:text-base text-ivory-muted font-light leading-relaxed">
            While the world races after fleeting luxuries, Aranya offers a different kind — <strong className="text-ivory font-medium">The Lushury</strong>. Life here is lush with 40% open green spaces and generous with sunlit sundecks and spacious homes.
          </p>

          <div className="lg:col-span-3 pt-4 border-t border-white/[0.08] flex items-center gap-6">
            <div>
              <span className="font-serif text-2xl text-ivory font-light block">2 Towers</span>
              <span className="text-[10px] font-sans uppercase tracking-[0.08em] text-ivory-muted/70 whitespace-nowrap">Tower A &amp; Tower B</span>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <span className="font-serif text-2xl text-ivory font-light block">Vastu</span>
              <span className="text-[10px] font-sans uppercase tracking-[0.08em] text-ivory-muted/70 whitespace-nowrap">Compliant Homes</span>
            </div>
          </div>
        </div>
        */}

        {/* ─── Brochure-style Stats Bar ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-10 sm:mb-12 rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {[
            { value: '40%+', label: 'Open Green', sublabel: 'Living' },
            { value: '11 ft', label: 'Ceiling Height,', sublabel: 'Up To' },
            { value: '18.3 m', label: 'Private Access', sublabel: 'Road' },
            { value: '3 min', label: 'To Malad West', sublabel: 'Metro' },
          ].map((stat) => (
            <div
              key={stat.value}
              className="bg-white/[0.03] backdrop-blur-sm px-5 py-6 sm:px-7 sm:py-8 text-center flex flex-col items-center justify-center gap-1.5 hover:bg-white/[0.06] transition-colors duration-300"
            >
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-champagne-300 font-light tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-ivory font-semibold leading-tight">
                {stat.label}
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-ivory-muted/70 font-medium leading-tight">
                {stat.sublabel}
              </span>
            </div>
          ))}
        </div>
      </Container>

      {/* ─── Showcase Band: the landscaped grounds ─── */}
      <div className="flex justify-center px-4 sm:px-8">
        <button
          type="button"
          onClick={openSpread}
          aria-label="View the full image"
          className="group relative block w-full max-w-[640px] aspect-[4/3] overflow-hidden rounded-[4px] border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-zoom-in
                     lg:max-w-none lg:aspect-auto lg:h-[min(86vh,1250px)]"
        >
          <Img
            src={SPREAD}
            alt="The clubhouse, lawns and children’s play area at Aranya The Park"
            sizes="(min-width: 1024px) 100vw, 440px"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]
                       lg:static lg:h-full lg:w-full lg:max-w-full lg:object-cover"
          />

          <ImageCredit src={SPREAD} className="absolute bottom-4 left-4 z-10" />

          {/* Inspect cue */}
          <span className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full glass-panel text-ivory group-hover:text-champagne-300 group-hover:scale-110 transition-all">
            <Maximize2 size={16} />
          </span>
        </button>
      </div>

      {/* Caption sits below the image rather than over it. */}
      <div className="flex items-center justify-center gap-3 mt-5 px-4 text-[11px] font-sans text-ivory-muted/70 uppercase tracking-wider text-center">
        <span>The Clubhouse &amp; Lawns</span>
        <span className="w-px h-3 bg-white/[0.12]" />
        <span>Malad West</span>
      </div>
    </section>
  );
};
