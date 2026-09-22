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
  Maximize2,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
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

/**
 * Amenities — every space as a marked tile. The photograph is deliberately
 * held back: tapping a tile opens it in the lightbox, which keeps the section
 * compact and makes the full set scannable at a glance.
 */
export const Amenities: React.FC<AmenitiesProps> = ({ onSelectAmenity, onOpenLeadModal }) => {
  const groups: AmenityItem['category'][] = ['ground', 'terrace', 'building'];

  return (
    <section id="amenities" className="section-spacing bg-dark-950 text-ivory relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-champagne-400/[0.02] blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-4">
            WELLNESS &amp; RECREATION
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory uppercase mb-4 leading-[1.05]">
            Life Beyond<br />Four Walls
          </h2>
          <p className="font-sans text-sm text-ivory-muted font-light max-w-2xl mx-auto leading-relaxed">
            From sunrise yoga on the skyline deck to vigorous pickleball rallies and sunset
            gatherings under the gazebo. Select any space to view it.
          </p>
        </div>

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
                    return (
                      <li key={amenity.id}>
                        <button
                          type="button"
                          onClick={() => onSelectAmenity(amenity)}
                          aria-label={`${amenity.name} — view image`}
                          className="group relative w-full h-full text-left p-4 sm:p-5 rounded-[4px] glass-panel-subtle border border-white/[0.07] hover:border-champagne-400/40 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
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
              onClick={() => onOpenLeadModal('Amenity Tour Request')}
              className="tracking-wider uppercase text-xs"
            >
              Schedule an Amenity Tour
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};
