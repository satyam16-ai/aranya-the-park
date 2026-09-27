import React from 'react';
import {
  Trophy,
  Users,
  Baby,
  Dumbbell,
  Gamepad2,
  GlassWater,
  Zap,
  Flower2,
  Sun,
  PartyPopper,
  Footprints,
  Leaf,
  Activity,
  Armchair,
  ArrowRight,
} from 'lucide-react';
import { Img } from '../common/Img';
import { ImageCredit } from '../common/ImageCredit';
import { SectionBackdrop } from '../common/SectionBackdrop';
import { amenitiesData } from '../../data/amenitiesData';
import type { AmenityItem } from '../../types';

interface AmenitiesProps {
  onSelectAmenity: (amenity: AmenityItem) => void;
}

type IconType = React.ComponentType<{ strokeWidth?: number; className?: string }>;

/** The mark in each card's ring; the id is the key so data order can change freely. */
const amenityIcons: Record<string, IconType> = {
  pickleball: Trophy,
  'senior-citizens': Users,
  'kids-play': Baby,
  'fitness-center': Dumbbell,
  'games-room': Gamepad2,
  banquet: GlassWater,
  'ev-charging': Zap,
  'aranya-garden': Flower2,
  'rooftop-yoga': Sun,
  'party-lawn': PartyPopper,
  'jogging-pathway': Footprints,
  reflexology: Leaf,
  'terrace-gym': Activity,
  'family-seating': Armchair,
};

/**
 * The amenities in two groups, ground level then the terraces, each laid out
 * so its rows come out full on the widest screens: eight ground-level cards
 * four to a row, six terrace cards three to a row.
 */
const GROUPS = [
  {
    level: 'ground',
    title: 'Ground Level',
    span: 'xl:col-span-3',
    sizes: '(min-width:1280px) 23vw, (min-width:640px) 50vw, 100vw',
  },
  {
    level: 'terrace',
    title: 'Rooftop Terraces',
    span: 'xl:col-span-4',
    sizes: '(min-width:1280px) 31vw, (min-width:640px) 50vw, 100vw',
  },
  {
    level: 'building',
    title: 'Within the Towers',
    span: 'xl:col-span-4',
    sizes: '(min-width:1280px) 31vw, (min-width:640px) 50vw, 100vw',
  },
]
  .map((group) => ({ ...group, items: amenitiesData.filter((a) => a.category === group.level) }))
  .filter((group) => group.items.length > 0);

/**
 * Amenities — "Life Beyond Four Walls", built to the client's 26-09 reference.
 *
 * The heading, then every amenity at once (the client asked on 27-09 for all
 * of them on show rather than behind tabs), grouped by where it sits. Each
 * card keeps to a photograph, its name and one short line; pointing at a card
 * outlines it in gold, and a click or tap opens the photograph in the lightbox.
 */
export const Amenities: React.FC<AmenitiesProps> = ({ onSelectAmenity }) => {
  return (
    <section
      id="amenities"
      // Lands flush with the viewport top from the nav, so the section fills the screen.
      style={{ scrollMarginTop: 0 }}
      className="relative isolate overflow-hidden bg-dark-950 text-ivory [--gap:clamp(12px,1vw,20px)]"
    >
      <SectionBackdrop />

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-col px-5 pt-[88px] pb-14 sm:px-8 sm:pt-24 lg:px-[3.9vw] lg:pt-[clamp(92px,13.6vh,140px)] lg:pb-18">
        {/* ─── Heading ─── */}
        <header className="relative grid grid-cols-1 gap-x-(--gap) gap-y-5 lg:grid-cols-3">
          <div>
            <p className="flex items-center gap-5 text-[length:clamp(11.5px,0.68vw,13px)] font-semibold uppercase tracking-[0.24em] text-champagne-300">
              Wellness &amp; Recreation
              <span aria-hidden="true" className="h-px w-14 bg-champagne-400/70" />
            </p>
            <h2 className="mt-[clamp(10px,1.8vh,18px)] font-serif text-[length:clamp(2.6rem,min(5.4vw,calc(20vh_-_80px)),6.5rem)] font-semibold leading-[0.9] tracking-[-0.015em]">
              <span className="block text-ivory">Life Beyond</span>
              <span className="block bg-[linear-gradient(180deg,#E6D2A6_0%,#C8A96B_100%)] bg-clip-text pb-[0.08em] text-transparent">
                Four Walls
              </span>
            </h2>
          </div>

          <div className="flex items-center lg:col-span-2 lg:pt-[clamp(28px,4.4vh,44px)]">
            <span aria-hidden="true" className="hidden w-px self-stretch bg-white/[0.12] lg:block" />
            <p className="min-w-0 max-w-[29rem] lg:shrink-0 text-[length:clamp(1rem,0.95vw,1.16rem)] leading-[1.55] text-ivory/85 lg:pl-[clamp(28px,2.8vw,56px)]">
              Fourteen thoughtfully curated spaces across the ground level and rooftop terraces — from sunrise yoga
              to pickleball and serene evenings under the gazebo. Select any space to see it in full.
            </p>

            {/* Set in the site's own italic, turned like a hand-written note. It is
                centred in whatever room the paragraph leaves, so the two never meet. */}
            <p
              aria-hidden="true"
              className="pointer-events-none mx-auto hidden shrink-0 translate-y-[22%] -rotate-[13deg] whitespace-nowrap pl-6 font-serif text-[length:clamp(1.75rem,2.3vw,2.9rem)] font-medium italic leading-[1.05] text-champagne-400/70 xl:block"
            >
              <span className="block">
                Spaces for
                <svg viewBox="0 0 24 24" className="ml-[0.2em] inline-block h-[0.8em] w-[0.8em] -translate-y-[0.55em] rotate-[8deg] text-champagne-300">
                  <path d="M11.5 22C11 14 13.5 7.5 21 2.5c.6 8.4-2.6 15-9.5 19.5z" fill="currentColor" />
                  <path d="M10.5 22C9.6 17 6.6 13.7 2.5 12.6c.4 4.8 3.4 8.3 8 9.4z" fill="currentColor" opacity="0.75" />
                </svg>
              </span>
              <span className="ml-[0.9em] block">a balanced life</span>
            </p>
          </div>
        </header>

        {/* ─── Cards, one group per level ─── */}
        <div className="mt-[clamp(32px,5.2vh,56px)] flex flex-col gap-[clamp(36px,5vh,56px)]">
          {GROUPS.map((group) => (
            <div key={group.level}>
              <div className="flex items-center gap-4">
                <h3
                  id={`amenities-${group.level}`}
                  className="text-[length:clamp(11.5px,0.68vw,13px)] font-semibold uppercase tracking-[0.24em] text-champagne-300"
                >
                  {group.title}
                </h3>
                <span aria-hidden="true" className="text-[length:clamp(11.5px,0.68vw,13px)] font-semibold tracking-[0.18em] text-champagne-400/60">
                  {String(group.items.length).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.1]" />
              </div>

              <ul
                aria-labelledby={`amenities-${group.level}`}
                className="mt-[clamp(14px,2vh,20px)] grid grid-cols-1 gap-(--gap) sm:grid-cols-2 xl:grid-cols-12"
              >
                {group.items.map((amenity) => {
                  const Icon = amenityIcons[amenity.id] ?? Trophy;
                  return (
                    <li key={amenity.id} className={group.span}>
                      <article className="group relative isolate h-[170px] overflow-hidden rounded-[14px] border border-white/[0.1] transition-[border-color,box-shadow] duration-300 hover:border-champagne-300 hover:shadow-[0_0_0_1px_rgba(216,189,140,0.8),0_0_28px_rgba(200,169,107,0.35)] sm:h-[210px] lg:h-[240px] xl:h-[clamp(200px,26vh,260px)]">
                        <Img
                          src={amenity.image}
                          alt=""
                          sizes={group.sizes}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 -z-10 h-full w-full object-cover"
                        />
                        {/* One dark band along the foot of every card, so the words
                            read the same on bright photographs and dark renders. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(6,19,13,0.92)_0%,rgba(6,19,13,0.6)_38%,rgba(6,19,13,0)_70%)]"
                        />

                        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-[clamp(14px,2vh,20px)]">
                          <div className="min-w-0 flex-1">
                            <span className="hidden h-[clamp(36px,4.6vh,44px)] w-[clamp(36px,4.6vh,44px)] items-center justify-center rounded-full border border-champagne-400/60 bg-dark-950/40 text-champagne-300 backdrop-blur-sm sm:inline-flex">
                              <Icon strokeWidth={1.5} className="h-[46%] w-[46%]" />
                            </span>
                            <h4 className="font-serif text-[length:clamp(1.05rem,1.15vw,1.45rem)] font-semibold leading-tight tracking-[-0.005em] text-ivory [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] sm:mt-[clamp(8px,1.2vh,12px)]">
                              {amenity.name}
                            </h4>
                            {amenity.badge && (
                              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ivory/80">
                                {amenity.badge}
                              </p>
                            )}
                          </div>

                          <span
                            aria-hidden="true"
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne-400/70 bg-dark-950/55 text-ivory backdrop-blur-sm transition-colors duration-300 group-hover:border-champagne-300 group-hover:bg-dark-950/75 xl:h-10 xl:w-10"
                          >
                            <ArrowRight size={17} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>

                        <ImageCredit src={amenity.image} className="absolute right-3 top-3" />

                        {/* The whole card is the control; the text above stays real headings. */}
                        <button
                          type="button"
                          onClick={() => onSelectAmenity(amenity)}
                          aria-label={`${amenity.name}: view image`}
                          className="absolute inset-0 z-10 cursor-pointer rounded-[14px] focus-visible:outline-offset-[-2px]"
                        />
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
