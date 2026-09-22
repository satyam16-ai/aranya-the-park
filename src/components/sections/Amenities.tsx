import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { amenitiesData } from '../../data/amenitiesData';
import type { AmenityItem } from '../../types';

interface AmenitiesProps {
  onSelectAmenity: (amenity: AmenityItem) => void;
  onOpenLeadModal?: (purpose?: string) => void;
}

export const Amenities: React.FC<AmenitiesProps> = ({
  onSelectAmenity,
  onOpenLeadModal,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const current = amenitiesData[activeIndex] || amenitiesData[0];

  // ─── Pill rail carousel ───
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(240, el.clientWidth * 0.8),
      behavior: 'smooth',
    });
  }, []);

  // Keep the selected pill in view when the detail arrows change the amenity
  useEffect(() => {
    const el = railRef.current;
    const pill = pillRefs.current[activeIndex];
    if (!el || !pill) return;
    const target = pill.offsetLeft - (el.clientWidth - pill.offsetWidth) / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' });
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? amenitiesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === amenitiesData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="amenities" className="section-spacing bg-dark-950 text-ivory relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-champagne-400/[0.02] blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Chapter Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-5">
            CHAPTER 05 · WELLNESS & RECREATION
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ivory uppercase mb-6 leading-[1.05]">
            Life Beyond<br />Four Walls
          </h2>
          <p className="font-sans text-sm sm:text-base text-ivory-muted font-light max-w-2xl mx-auto leading-relaxed">
            From sunrise yoga on the skyline deck to vigorous pickleball rallies and sunset gatherings under the gazebo.
          </p>
        </div>

        {/* ─── Modern Glass Amenity Pill Carousel ─── */}
        <div className="relative mb-10">
          {/* Edge fades signalling more amenities off-screen */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-dark-950 via-dark-950/80 to-transparent transition-opacity duration-300 ${
              canPrev ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-dark-950 via-dark-950/80 to-transparent transition-opacity duration-300 ${
              canNext ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Carousel arrows */}
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            disabled={!canPrev}
            aria-label="Show previous amenities"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -mt-2 z-20 w-9 h-9 rounded-full glass-control items-center justify-center text-ivory-muted hover:text-ivory disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            disabled={!canNext}
            aria-label="Show more amenities"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mt-2 z-20 w-9 h-9 rounded-full glass-control items-center justify-center text-ivory-muted hover:text-ivory disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>

          {/* Scrollable pill rail — `safe center` centres the row when it fits
              but falls back to start-alignment when it overflows, so the
              leading pills stay reachable. */}
          <div
            ref={railRef}
            aria-label="Select an amenity"
            className="flex items-center justify-start lg:[justify-content:safe_center] gap-2 overflow-x-auto overflow-touch pb-4 px-2 sm:px-12"
          >
            {amenitiesData.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    pillRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={isActive}
                  className={`px-4 sm:px-5 py-2.5 text-[11px] font-sans uppercase tracking-[0.14em] font-medium rounded-full shrink-0 whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                      : 'glass-control text-ivory-muted hover:text-ivory'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Hero Amenity Cinematic Stage ─── */}
        <div className="glass-panel p-6 sm:p-10 lg:p-14 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Large Cinematic Photograph */}
            <div className="lg:col-span-8 relative">
              <div
                onClick={() => onSelectAmenity(current)}
                className="relative aspect-[16/10] overflow-hidden rounded-[4px] shadow-2xl bg-black border border-white/[0.06] group cursor-pointer"
              >
                <Img
                  src={current.image}
                  alt={current.name}
                  sizes="(min-width: 1024px) 891px, 100vw"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 glass-panel text-champagne-300 text-[10px] font-sans uppercase tracking-[0.2em] font-semibold rounded-full">
                    {current.categoryLabel}
                  </span>
                  <span className="px-3 py-1.5 glass-panel text-ivory-muted text-[10px] font-sans uppercase tracking-widest rounded-full hidden sm:inline-block">
                    {current.badge}
                  </span>
                </div>

                {/* Hover Maximize Cue */}
                <div className="absolute bottom-5 right-5 z-10 p-2.5 rounded-full glass-panel text-ivory group-hover:text-champagne-300 group-hover:scale-110 transition-all">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative & Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold">
                  0{activeIndex + 1} / 0{amenitiesData.length}
                </span>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous amenity"
                    className="w-9 h-9 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next amenity"
                    className="w-9 h-9 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-light mb-2">
                  {current.name}
                </h3>
                <p className="font-serif italic text-sm sm:text-base text-champagne-300/85">
                  "{current.tagline}"
                </p>
              </div>

              <p className="font-sans text-sm text-ivory-muted leading-relaxed font-light">
                {current.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-1 border-t border-white/[0.08]">
                {current.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-2.5 text-xs text-ivory/90 font-sans">
                    <Check size={13} className="text-champagne-400 shrink-0 mt-0.5" />
                    <span className="font-light">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenLeadModal?.(`Amenity Inquiry — ${current.name}`)}
                  className="btn-lux w-full py-3.5 px-6 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-ivory-muted hover:text-ivory border border-white/[0.12] hover:border-champagne-400/50 rounded-[3px] glass-panel-subtle transition-all duration-300 cursor-pointer"
                >
                  SCHEDULE AMENITY TOUR
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
