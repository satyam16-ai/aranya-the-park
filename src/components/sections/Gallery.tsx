import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { SectionHeading } from '../common/SectionHeading';
import { galleryData } from '../../data/galleryData';
import { Lightbox } from '../common/Lightbox';

interface GalleryProps {
  onOpenLeadModal?: (purpose: string, config?: string) => void;
}

type GalleryCategory = 'all' | 'exterior' | 'interior' | 'amenities' | 'lifestyle' | 'architecture';

export const Gallery: React.FC<GalleryProps> = ({ onOpenLeadModal: _onOpenLeadModal }) => {
  const [activeTab, setActiveTab] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tabs: { label: string; value: GalleryCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Exterior', value: 'exterior' },
    { label: 'Interior', value: 'interior' },
    { label: 'Amenities', value: 'amenities' },
    { label: 'Lifestyle', value: 'lifestyle' },
    { label: 'Architecture', value: 'architecture' },
  ];

  const filteredGallery =
    activeTab === 'all'
      ? galleryData
      : galleryData.filter(
          (item) =>
            item.category === activeTab ||
            item.secondaryCategories?.includes(activeTab as any)
        );

  const currentLightboxItem =
    lightboxIndex !== null && filteredGallery[lightboxIndex]
      ? filteredGallery[lightboxIndex]
      : null;

  const handlePrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredGallery.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <section id="gallery" className="section-spacing bg-dark-950 relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase" className="relative z-10">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="CURATED VISUAL CHRONICLES"
          title="Project Gallery"
          subtitle="Explore the architectural elevation, living volumes, wellness decks, and verdant parkscapes."
          align="center"
          theme="dark"
          className="mb-12 sm:mb-16"
        />

        {/* Category Pill Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto overflow-touch pb-3 sm:pb-0 px-1 sm:px-0 mb-12 sm:mb-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setLightboxIndex(null);
                }}
                className={`px-5 py-2.5 font-sans text-xs tracking-wider uppercase whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer rounded-full border ${
                  isActive
                    ? 'bg-champagne-400 border-champagne-300 text-dark-950 font-semibold shadow-[0_4px_20px_rgba(200,169,107,0.25)]'
                    : 'bg-white/[0.03] border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.08]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid — Asymmetric editorial layout with clean frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className={`relative overflow-hidden cursor-pointer group rounded-[4px] border border-white/[0.08] bg-dark-900 transition-all duration-500 hover:border-champagne-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${
                idx < 2 ? 'sm:col-span-1 lg:first:col-span-2 lg:first:row-span-2' : ''
              } ${idx === 0 ? 'aspect-[4/3] lg:aspect-auto' : 'aspect-[4/3]'}`}
            >
              <Img
                src={item.image}
                alt={item.title}
                sizes="(min-width: 1024px) 490px, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100"
              />

              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-300 block mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-ivory font-light group-hover:text-champagne-200 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-champagne-300 group-hover:bg-champagne-400 group-hover:text-dark-950 transition-all duration-300 shrink-0">
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Lightbox */}
      {currentLightboxItem && lightboxIndex !== null && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          imageUrl={currentLightboxItem.image}
          title={currentLightboxItem.title}
          description={currentLightboxItem.caption}
          category={currentLightboxItem.categoryLabel}
          currentIndex={lightboxIndex}
          totalCount={filteredGallery.length}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < filteredGallery.length - 1}
        />
      )}
    </section>
  );
};
