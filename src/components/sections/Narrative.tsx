import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export const Narrative: React.FC = () => {
  return (
    <section id="overview-story" className="section-spacing bg-forest-900 relative overflow-hidden text-cream-200">
      {/* Subtle Background Glows */}
      <div className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full bg-forest-800/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-[500px] h-[500px] rounded-full bg-forest-800/15 blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="The Design Philosophy"
          title="The Lushury Life — Redefined"
          subtitle="While the world races behind fleeting luxuries, Aranya The Park introduces a calm paradigm: life enriched by nature, scale, and time."
          align="center"
        />

        {/* ─── Subsection 1: Editorial Narrative — Image Left ─── */}
        <div className="mt-20 sm:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden shadow-2xl">
              <img
                src="/assets/opt/lifestyle-sundeck-2000.webp"
                alt="Sunlit Sundeck moments at Aranya The Park"
                className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.9]"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] text-cream-100 font-light leading-snug">
              What is luxury if it doesn't add life to your years?
            </h3>

            <p className="prose-editorial">
              We welcome you to the greener side of life. At Aranya The Park, living is immersed in 40% open green landscapes curated by BeyondGreen, sensory aroma gardens, and architectural residences engineered with generous ceiling volumes and private sunlit balconies.
            </p>

            <p className="prose-editorial">
              Conceived jointly by <strong className="text-cream-100">Zaveri Realty</strong> and <strong className="text-cream-100">BKM Mindspace</strong>, this landmark stands as a testament to structural durability, refined aesthetics, and timeless family sanctuary.
            </p>

            {/* Two Key Differentiators */}
            <div className="pt-4 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg text-champagne-300 mb-1.5">Sunlit Vistas</h4>
                <p className="text-sm text-cream-300/60 font-light leading-relaxed">
                  Private balconies embracing natural sunrise & sea breezes.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg text-champagne-300 mb-1.5">Generous Volumes</h4>
                <p className="text-sm text-cream-300/60 font-light leading-relaxed">
                  Generous vertical clearance ensuring supreme ventilation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Soft Divider ─── */}
        <div className="divider-soft my-20 sm:my-24" />

        {/* ─── Subsection 2: Park Living — Image Right (merged from ParkLiving) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Text (appears first on desktop for visual asymmetry) */}
          <div className="space-y-6 lg:order-1">
            <span className="eyebrow">Biophilic Sanctuary</span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] text-cream-100 font-light leading-snug">
              An urban forest retreat where nature breathes alongside modern luxury.
            </h3>

            <p className="prose-editorial">
              Unlike dense high-rise developments, Aranya The Park devotes substantial open space to lush landscaped buffers, ensuring clean air circulation, acoustic dampening, and daily contact with vibrant green foliage.
            </p>

            {/* Two Key Differentiators */}
            <div className="pt-4 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg text-champagne-300 mb-1.5">Aroma Gardens</h4>
                <p className="text-sm text-cream-300/60 font-light leading-relaxed">
                  Indigenous flowering plants providing therapeutic calming effects.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg text-champagne-300 mb-1.5">18.3m Boulevard</h4>
                <p className="text-sm text-cream-300/60 font-light leading-relaxed">
                  A private tree-lined approach connecting to New Link Road.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-2">
            <div className="overflow-hidden shadow-2xl">
              <img
                src="/assets/opt/lifestyle-park-greens-2800.webp"
                alt="BeyondGreen Landscape at Aranya The Park"
                className="w-full h-[420px] sm:h-[500px] object-cover object-center transition-transform duration-700 ease-out brightness-[0.9]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
