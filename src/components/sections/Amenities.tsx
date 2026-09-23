import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  Maximize2,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { Img } from '../common/Img';
import { amenitiesData } from '../../data/amenitiesData';
import type { AmenityItem } from '../../types';

interface AmenitiesProps {
  onSelectAmenity: (amenity: AmenityItem) => void;
  onOpenLeadModal?: (purpose?: string) => void;
}

/** One mark per amenity; the id is the key so data order can change freely. */
const amenityIcons: Record<string, LucideIcon> = {
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

const groupLabels: Record<AmenityItem['category'], string> = {
  ground: 'Ground Level',
  terrace: 'Rooftop Terrace',
  building: 'Building',
};

/** Panel geometry, fixed so the flip decision needs no measuring pass. */
const PREVIEW_W = 340;
const PREVIEW_H = 256;
/** Clears the floating navbar when the panel flips below its card. */
const TOP_SAFE = 96;
const SHOW_DELAY = 90;
const HIDE_DELAY = 80;

interface HoverState {
  item: AmenityItem;
  el: HTMLElement;
}

/**
 * Amenities — every space as a marked tile.
 *
 * The photograph used to be a click away; the client's 23-09 note asked for it
 * on hover instead, so a tile now raises a floating preview and the click is
 * kept for the full lightbox. Touch devices have no hover, so there the tap
 * still goes straight to the lightbox — the preview is a pointer affordance,
 * never the only way to the image.
 */
export const Amenities: React.FC<AmenitiesProps> = ({ onSelectAmenity, onOpenLeadModal }) => {
  const groups: AmenityItem['category'][] = ['ground', 'terrace', 'building'];

  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (showTimer.current) window.clearTimeout(showTimer.current);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  const handleEnter = useCallback(
    (item: AmenityItem, el: HTMLElement) => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      clearTimers();
      // Sweeping from one tile to the next should swap the image, not replay
      // the entrance — the delay only guards the very first reveal.
      if (hovered) {
        setHovered({ item, el });
        return;
      }
      showTimer.current = window.setTimeout(() => setHovered({ item, el }), SHOW_DELAY);
    },
    [hovered]
  );

  const handleLeave = useCallback(() => {
    clearTimers();
    hideTimer.current = window.setTimeout(() => setHovered(null), HIDE_DELAY);
  }, []);

  // Anchor to the tile rather than the cursor: one measurement per tile instead
  // of one per mousemove, and it works for keyboard focus unchanged.
  useLayoutEffect(() => {
    // No reset on leave: the panel is gated on `hovered`, and this effect runs
    // before paint, so the next tile's position lands in the same frame.
    if (!hovered) return;

    const place = () => {
      const r = hovered.el.getBoundingClientRect();
      const left = Math.max(
        16,
        Math.min(r.left + r.width / 2 - PREVIEW_W / 2, window.innerWidth - PREVIEW_W - 16)
      );
      let top = r.top - PREVIEW_H - 12;
      if (top < TOP_SAFE) top = r.bottom + 12;
      top = Math.min(top, window.innerHeight - PREVIEW_H - 16);
      setPos({ left, top });
    };

    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  }, [hovered]);

  return (
    <section id="amenities" className="section-spacing bg-dark-950 text-ivory relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-champagne-400/[0.02] blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Section Header */}
        <SectionHeading
          eyebrow="Wellness & Recreation"
          title={<>Life Beyond Four Walls</>}
          subtitle="Fourteen spaces across the ground level and the rooftop terraces, from sunrise yoga to pickleball and evenings under the gazebo. Hover to preview; select to view in full."
        />

        {/* ─── Amenity marks, grouped by level ─── */}
        <div className="space-y-10">
          {groups.map((group) => {
            const items = amenitiesData.filter((a) => a.category === group);
            if (items.length === 0) return null;

            return (
              <div key={group}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-champagne-300/90 font-semibold shrink-0">
                    {groupLabels[group]}
                  </span>
                  <span className="h-px flex-1 bg-white/[0.08]" />
                  <span className="font-sans text-[10px] text-ivory-muted/50 tabular-nums shrink-0">
                    {String(items.length).padStart(2, '0')}
                  </span>
                </div>

                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {items.map((amenity) => {
                    const Icon = amenityIcons[amenity.id] ?? Trophy;
                    const isPreviewing = hovered?.item.id === amenity.id;
                    return (
                      <li key={amenity.id}>
                        <button
                          type="button"
                          onClick={() => onSelectAmenity(amenity)}
                          onMouseEnter={(e) => handleEnter(amenity, e.currentTarget)}
                          onMouseLeave={handleLeave}
                          onFocus={(e) => handleEnter(amenity, e.currentTarget)}
                          onBlur={handleLeave}
                          aria-label={`${amenity.name} — view image`}
                          className={`group relative w-full h-full text-left p-4 sm:p-5 rounded-[4px] glass-panel-subtle border transition-all duration-300 cursor-pointer hover:border-champagne-400/40 hover:bg-white/[0.03] ${
                            isPreviewing ? 'border-champagne-400/40 bg-white/[0.03]' : 'border-white/[0.07]'
                          }`}
                        >
                          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-champagne-400/30 text-champagne-300 group-hover:border-champagne-400/70 group-hover:text-champagne-200 transition-colors">
                            <Icon size={19} strokeWidth={1.4} />
                          </span>

                          <h3 className="font-serif text-base sm:text-lg text-ivory mt-3.5 leading-snug">
                            {amenity.name}
                          </h3>
                          <p className="font-sans text-[11px] text-ivory-muted/70 mt-1 leading-relaxed line-clamp-2">
                            {amenity.categoryLabel}
                          </p>

                          {/* Reveal cue */}
                          <span className="absolute top-4 right-4 text-ivory-muted/25 group-hover:text-champagne-300 transition-colors">
                            <Maximize2 size={13} />
                          </span>

                          {amenity.badge && (
                            <span className="absolute bottom-4 right-4 font-sans text-[9px] uppercase tracking-wider text-champagne-300/70">
                              {amenity.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Closing action */}
        {onOpenLeadModal && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => onOpenLeadModal('Arrange a Private Site Visit')}
              className="tracking-wider uppercase text-xs"
            >
              Arrange a Private Site Visit
            </Button>
          </div>
        )}
      </Container>

      {/* ─── Floating hover preview ─── */}
      {hovered && pos && (
        <div
          role="presentation"
          className="fixed z-40 pointer-events-none animate-scale-in"
          style={{ left: pos.left, top: pos.top, width: PREVIEW_W }}
        >
          <div className="rounded-[4px] overflow-hidden border border-champagne-400/30 bg-dark-900 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
            <div className="aspect-[16/9] w-full overflow-hidden bg-dark-900">
              <Img
                key={hovered.item.id}
                src={hovered.item.image}
                alt={hovered.item.name}
                sizes="340px"
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            <div className="px-4 py-3 border-t border-white/[0.07]">
              <p className="font-serif text-sm text-ivory leading-snug">{hovered.item.name}</p>
              <p className="font-sans text-[11px] text-ivory-muted/70 mt-0.5 leading-snug line-clamp-1">
                {hovered.item.tagline}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
