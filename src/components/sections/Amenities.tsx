import React from 'react';
import {
  Trophy,
  Users,
  UsersRound,
  Baby,
  Dumbbell,
  BicepsFlexed,
  Gamepad2,
  GlassWater,
  Zap,
  CarFront,
  Flower2,
  Sprout,
  Sun,
  Sunrise,
  PartyPopper,
  MoonStar,
  Footprints,
  Route,
  Leaf,
  Activity,
  Wind,
  Armchair,
  Sofa,
  Coffee,
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

type IconProps = { size?: number | string; strokeWidth?: number | string; className?: string };
type IconType = React.ComponentType<IconProps>;

const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** A court seen from above: baseline, net and the two kitchen lines. */
const CourtIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} className={className} {...line}>
    <rect x="2.5" y="6" width="19" height="12" rx="1" />
    <path d="M12 6v12M8.5 6v12M15.5 6v12M2.5 12h6M15.5 12h6" />
  </svg>
);

/** A playground slide: ladder on the left, the chute running down to the right. */
const SlideIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={strokeWidth} className={className} {...line}>
    <path d="M4 21V4M8 21V4M4 8h4M4 12h4M4 16h4" />
    <path d="M8 5c3.5 0 5 2.5 6.5 7S17.5 20 21 20" />
  </svg>
);

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

/** The small mark beside each card's badge, drawn for what the badge says. */
const badgeIcons: Record<string, IconType> = {
  pickleball: CourtIcon,
  'senior-citizens': Sofa,
  'kids-play': SlideIcon,
  'fitness-center': BicepsFlexed,
  'games-room': UsersRound,
  banquet: UsersRound,
  'ev-charging': CarFront,
  'aranya-garden': Sprout,
  'rooftop-yoga': Sunrise,
  'party-lawn': MoonStar,
  'jogging-pathway': Route,
  reflexology: Footprints,
  'terrace-gym': Wind,
  'family-seating': Coffee,
};

/**
 * Every amenity at once, ground level first, then the terraces: the client
 * asked on 27-09 for all of them on show rather than behind tabs and pages.
 */
const ITEMS: AmenityItem[] = (['ground', 'terrace', 'building'] as const).flatMap((level) =>
  amenitiesData.filter((a) => a.category === level)
);

/**
 * Where each card sits on the six-column desktop grid: three to a row, as in
 * the reference. A short last row widens its cards to fill the row rather
 * than leave a hole.
 */
const spanFor = (i: number) => {
  const tail = ITEMS.length % 3;
  if (i < ITEMS.length - tail) return 'lg:col-span-2';
  return tail === 1 ? 'lg:col-span-6' : 'lg:col-span-3';
};
const SIZES: Record<string, string> = {
  'lg:col-span-2': '(min-width:1024px) 31vw, (min-width:640px) 50vw, 100vw',
  'lg:col-span-3': '(min-width:1024px) 47vw, (min-width:640px) 50vw, 100vw',
  'lg:col-span-6': '(min-width:1024px) 94vw, (min-width:640px) 50vw, 100vw',
};

/**
 * Amenities — "Life Beyond Four Walls", built to the client's 26-09 reference.
 *
 * The heading, then all fourteen photograph cards. Pointing at a card
 * outlines it in gold; a click or tap opens the photograph in the lightbox.
 */
export const Amenities: React.FC<AmenitiesProps> = ({ onSelectAmenity }) => {
  return (
    <section
      id="amenities"
      // Lands flush with the viewport top from the nav, so the section fills the screen.
      style={{ scrollMarginTop: 0 }}
      className="relative isolate overflow-hidden bg-dark-950 text-ivory [--gap:clamp(14px,1vw,20px)]"
    >
      <SectionBackdrop leaves />

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
            <p className="max-w-[29rem] shrink-0 text-[length:clamp(1rem,0.95vw,1.16rem)] leading-[1.55] text-ivory/85 lg:pl-[clamp(28px,2.8vw,56px)]">
              Fourteen thoughtfully curated spaces across the ground level and rooftop terraces — from sunrise yoga
              to pickleball and serene evenings under the gazebo. Hover to preview, or select to explore each amenity
              in full.
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

        {/* ─── Cards: all fourteen, ground level first ─── */}
        <ul
          aria-label="All amenities"
          className="mt-[clamp(28px,4.8vh,48px)] grid grid-cols-1 gap-(--gap) sm:grid-cols-2 lg:grid-cols-6"
        >
          {ITEMS.map((amenity, i) => {
            const Icon = amenityIcons[amenity.id] ?? Trophy;
            const BadgeIcon = badgeIcons[amenity.id];
            const span = spanFor(i);
            return (
              <li key={amenity.id} className={span}>
                <article className="group relative isolate h-[210px] overflow-hidden rounded-[14px] border border-white/[0.1] transition-[border-color,box-shadow] duration-300 hover:border-champagne-300 hover:shadow-[0_0_0_1px_rgba(216,189,140,0.8),0_0_28px_rgba(200,169,107,0.35)] sm:h-[230px] lg:h-[clamp(180px,23vh,236px)]">
                  <Img
                    src={amenity.image}
                    alt=""
                    sizes={SIZES[span]}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-10 h-full w-full object-cover brightness-[0.92]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,19,13,0.9)_0%,rgba(6,19,13,0.72)_26%,rgba(6,19,13,0.22)_54%,rgba(6,19,13,0)_74%),linear-gradient(0deg,rgba(6,19,13,0.5)_0%,rgba(6,19,13,0)_45%)]"
                  />

                  <div className="flex h-full flex-col justify-between p-[clamp(14px,2.4vh,24px)] pr-[clamp(64px,5.2vw,96px)]">
                    <span className="inline-flex h-[clamp(36px,5.8vh,54px)] w-[clamp(36px,5.8vh,54px)] shrink-0 items-center justify-center rounded-full border border-champagne-400/60 bg-dark-950/35 text-champagne-300 backdrop-blur-sm">
                      <Icon strokeWidth={1.5} className="h-[44%] w-[44%]" />
                    </span>

                    <div className="mt-[clamp(4px,1.1vh,12px)]">
                      <h3 className="font-serif text-[length:clamp(1.15rem,1.35vw,1.7rem)] font-semibold leading-tight tracking-[-0.005em] text-ivory [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
                        {amenity.name}
                      </h3>
                      <p className="mt-0.5 text-[length:clamp(0.92rem,0.86vw,1.06rem)] text-ivory-muted">
                        {amenity.categoryLabel}
                      </p>
                    </div>

                    {amenity.badge && (
                      <p className="mt-[clamp(4px,1.1vh,12px)] flex items-center gap-3 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-ivory/85">
                        {BadgeIcon && <BadgeIcon size={18} strokeWidth={1.5} className="shrink-0 text-champagne-300" />}
                        {amenity.badge}
                      </p>
                    )}
                  </div>

                  <ImageCredit src={amenity.image} className="absolute right-3 top-3" />

                  <span
                    aria-hidden="true"
                    className="absolute bottom-[clamp(12px,2vh,20px)] right-[clamp(12px,1.2vw,22px)] inline-flex h-[clamp(38px,5.2vh,46px)] w-[clamp(38px,5.2vh,46px)] items-center justify-center rounded-full border border-champagne-400/70 bg-dark-950/55 text-ivory backdrop-blur-sm transition-colors duration-300 group-hover:border-champagne-300 group-hover:bg-dark-950/75"
                  >
                    <ArrowRight size={19} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>

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
    </section>
  );
};
