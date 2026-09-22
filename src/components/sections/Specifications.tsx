import React, { useState } from 'react';
import { Container } from '../common/Container';
import { specificationsData } from '../../data/specificationsData';
import { Button } from '../common/Button';
import { Compass } from 'lucide-react';

interface SpecificationsProps {
  onOpenLeadModal?: (purpose: string, config?: string) => void;
}

export const Specifications: React.FC<SpecificationsProps> = ({
  onOpenLeadModal,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const currentCategory = specificationsData[activeCategoryIndex] || specificationsData[0];

  return (
    <section id="specifications" className="section-spacing bg-dark-950 text-ivory relative overflow-hidden">
      {/* Background subtle illumination */}
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-[500px] h-[500px] bg-champagne-400/[0.015] rounded-full blur-3xl pointer-events-none" />

      <Container>
        {/* Chapter Header */}
        <div className="text-center mb-14 sm:mb-20">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-4">
            ARCHITECTURAL STANDARDS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory uppercase mb-5 leading-[1.1]">
            Project Specifications
          </h2>
          <p className="font-sans text-xs sm:text-sm text-ivory-muted font-light max-w-xl mx-auto leading-relaxed">
            Essential architectural parameters, fittings, and engineering hallmarks curated for enduring quality and refined metropolitan living.
          </p>
        </div>

        {/* ─── Category Selection Tabs (Minimalist Glass Pills) ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          {specificationsData.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-champagne-400 text-dark-950 font-semibold shadow-md'
                    : 'text-ivory-muted hover:text-ivory bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* ─── Specifications Presentation Stage ─── */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-6 sm:p-10 lg:p-12 rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="border-b border-white/[0.08] pb-4 mb-8 flex items-center justify-between">
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold">
                {currentCategory.category}
              </span>
              <span className="text-[11px] text-ivory-muted/60 font-sans tracking-wider">
                0{activeCategoryIndex + 1} / 0{specificationsData.length}
              </span>
            </div>

            {/* Concise Editorial Specification List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              {currentCategory.items.map((item, idx) => (
                <div key={idx} className="space-y-1.5 border-b border-white/[0.04] pb-6 last:border-b-0">
                  <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-champagne-300/80 font-medium">
                    {item.feature}
                  </span>
                  <p className="font-serif text-lg sm:text-xl text-ivory font-light leading-snug">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Enquire Action */}
            {onOpenLeadModal && (
              <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="font-sans text-xs text-ivory-muted font-light">
                  Direct developer consultation regarding materials, layouts, and construction milestones.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  icon={<Compass size={14} />}
                  onClick={() => onOpenLeadModal('Project Specifications', currentCategory.category)}
                  className="shrink-0"
                >
                  ENQUIRE FOR SPECIFICATION DETAILS
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
