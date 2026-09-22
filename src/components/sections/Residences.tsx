import React, { useState } from 'react';
import {
  Eye,
  Check,
  Maximize2,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { Button } from '../common/Button';
import { residencesData } from '../../data/residencesData';
import type { ResidenceUnit } from '../../types';

interface ResidencesProps {
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  onSelectFloorPlan: (imageUrl: string, title: string) => void;
  onOpenFloorPlansModal?: (category?: 'master' | 'tower-a' | 'tower-b') => void;
  onOpenLightbox?: (
    url: string,
    title: string,
    description?: string,
    category?: string
  ) => void;
}

export const Residences: React.FC<ResidencesProps> = ({
  onOpenLeadModal,
  onSelectFloorPlan,
  onOpenFloorPlansModal,
  onOpenLightbox,
}) => {
  const [selectedId, setSelectedId] = useState<string>('2bhk');

  const currentUnit: ResidenceUnit =
    residencesData.find((unit) => unit.id === selectedId) || residencesData[0];


  return (
    <section id="residences" className="section-spacing bg-dark-950 text-ivory relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -left-48 top-1/3 w-[500px] h-[500px] rounded-full bg-champagne-400/[0.02] blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Chapter Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-5">
            SANCTUARIES OF PROPORTION
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ivory uppercase mb-6">
            Space to Live
          </h2>
          <p className="font-sans text-sm sm:text-base text-ivory-muted font-light max-w-2xl mx-auto leading-relaxed">
            Homes engineered around generous volumes, cross-ventilating private sundecks, and uncompromised privacy.
          </p>
        </div>

        {/* ─── Elegant Glass Configuration Selector ─── */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 glass-panel rounded-full max-w-lg w-full justify-between gap-1.5">
            {residencesData.map((unit) => {
              const isActive = selectedId === unit.id;
              return (
                <button
                  key={unit.id}
                  onClick={() => setSelectedId(unit.id)}
                  className={`flex-1 py-3 px-3 sm:px-6 text-center font-sans transition-all duration-300 cursor-pointer rounded-full ${
                    isActive
                      ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                      : 'text-ivory-muted hover:text-ivory hover:bg-white/[0.04]'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="block text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold">
                    {unit.type}
                  </span>
                  <span className="block text-[10px] tracking-wider opacity-75 mt-0.5 normal-case">
                    {unit.carpetArea}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Architectural Showcase: Interior & Residence ─── */}
        <div className="glass-panel p-6 sm:p-10 lg:p-14 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Large Image — 8 cols */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-[4px] shadow-2xl bg-black border border-white/[0.06]">
                <div
                  className="relative aspect-[16/10] overflow-hidden group/img cursor-zoom-in"
                  onClick={() =>
                    onOpenLightbox?.(
                      currentUnit.image,
                      `${currentUnit.title} — ${currentUnit.type}`,
                      currentUnit.description,
                      currentUnit.tag
                    )
                  }
                >
                  <Img
                    src={currentUnit.image}
                    alt={`${currentUnit.title} — ${currentUnit.type} Residence`}
                    sizes="(min-width: 1024px) 891px, 100vw"
                    className="w-full h-full object-cover object-center group-hover/img:scale-[1.02] transition-transform duration-700 ease-out brightness-[0.92]"
                  />

                  {/* Inspect cue */}
                  <span className="absolute bottom-5 right-5 z-20 p-2.5 rounded-full glass-panel text-ivory group-hover/img:text-champagne-300 group-hover/img:scale-110 transition-all">
                    <Maximize2 size={16} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-3.5 py-1.5 glass-panel text-champagne-300 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-semibold rounded-full">
                      {currentUnit.tag}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Right: Details — 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block">
                  Configuration Profile
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                  {currentUnit.title}
                </h3>
                <p className="font-serif italic text-base text-champagne-300/80 mt-1">
                  {currentUnit.type} Luxury Residence
                </p>
              </div>

              {/* Compact Glass Metrics */}
              <div className="flex flex-wrap gap-2.5 text-xs font-sans">
                <span className="px-3.5 py-1.5 glass-panel-subtle text-champagne-300 rounded-full font-medium">
                  Area: {currentUnit.carpetArea}
                </span>
                <span className="px-3.5 py-1.5 glass-panel-subtle text-champagne-300 rounded-full font-medium">
                  {currentUnit.deck}
                </span>
                <span className="px-3.5 py-1.5 glass-panel-subtle text-champagne-300 rounded-full font-medium">
                  {currentUnit.tower}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-ivory-muted leading-relaxed font-light">
                {currentUnit.description}
              </p>

              {/* Key Features */}
              <div className="space-y-2.5">
                {currentUnit.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm text-ivory/90 font-sans">
                    <Check size={14} className="text-champagne-400 shrink-0 mt-0.5" />
                    <span className="font-light">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Hierarchy */}
              <div className="pt-2 flex flex-col gap-3">
                <Button
                  variant="gold"
                  size="md"
                  icon={<Eye size={15} />}
                  onClick={() => {
                    if (onOpenFloorPlansModal) {
                      onOpenFloorPlansModal(currentUnit.id === '2bhk' ? 'tower-b' : 'tower-a');
                    } else {
                      onSelectFloorPlan(
                        currentUnit.floorPlanImage,
                        `${currentUnit.type} Blueprint`
                      );
                    }
                  }}
                  className="w-full"
                >
                  VIEW BLUEPRINT
                </Button>

                <button
                  onClick={() =>
                    onOpenLeadModal(`Enquire — ${currentUnit.type}`, currentUnit.type)
                  }
                  className="btn-lux w-full py-3.5 px-6 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-ivory-muted hover:text-ivory border border-white/[0.12] hover:border-champagne-400/50 rounded-[3px] glass-panel-subtle transition-all duration-300 cursor-pointer"
                >
                  REQUEST DETAILS
                </button>
              </div>

              {/* 4 BHK note */}
              {currentUnit.id === '4bhk' && (
                <p className="text-[11px] text-ivory-muted/60 font-sans font-light leading-relaxed">
                  * 4 BHK Presidential Residences occupy select upper floors.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
