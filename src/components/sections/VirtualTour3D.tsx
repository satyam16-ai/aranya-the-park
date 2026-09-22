import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  ExternalLink,
  X,
  RotateCcw,
  Smartphone,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { Button } from '../common/Button';
import { LoadingState } from '../common/LoadingState';

interface VirtualTour3DProps {
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  externalSelectedId?: '2bhk' | '3bhk';
  externalTriggerModal?: boolean;
}

interface ResidenceTourData {
  id: '2bhk' | '3bhk';
  type: string;
  name: string;
  carpetArea: string;
  tower: string;
  deck: string;
  ceiling: string;
  fittings: string;
  tagline: string;
  description: string;
  highlights: string[];
  url: string;
  thumbnail: string;
}

const TOUR_DATA: Record<'2bhk' | '3bhk', ResidenceTourData> = {
  '2bhk': {
    id: '2bhk',
    type: '2 BHK',
    name: 'Signature 2 BHK Residence',
    carpetArea: 'Details On Request',
    tower: 'Tower B',
    deck: 'Private Sunlit Deck',
    ceiling: 'Up to 11 Ft.',
    fittings: 'Premium Grohe Bath Fittings',
    tagline: 'An urban sanctuary crafted for spatial intelligence and natural illumination.',
    description:
      'Engineered to maximize usable living space with generous lounge and dining areas, an ergonomic kitchen, and a private sundeck overlooking landscaped greens. Every corner is illuminated by expansive French windows.',
    highlights: [
      'Generous living & private sundeck layout',
      'Private sunlit sundeck embracing cool western breezes',
      'Floor-to-ceiling clearance up to 11 feet',
      'Designer vitrified flooring & French windows',
      '100% Vastu-compliant entrance and living orientation',
    ],
    url: 'https://surbhi-infotech.s3.ap-south-1.amazonaws.com/Aranya_The_Park/aranya_the_park_b_2bhk-699/index.html',
    thumbnail: '/assets/opt/lifestyle-living-2000.webp',
  },
  '3bhk': {
    id: '3bhk',
    type: '3 BHK',
    name: 'Executive 3 BHK Residence',
    carpetArea: 'Details On Request',
    tower: 'Tower B',
    deck: 'Dual Private Sundecks',
    ceiling: 'Up to 11 Ft.',
    fittings: 'Premium Grohe Bath Fittings',
    tagline: 'Palatial multi-bedroom luxury with expansive entertaining salons.',
    description:
      'A masterclass in proportions. Features a sprawling living room seamlessly opening to an outdoor deck, a dedicated formal dining alcove, an opulent master bedroom suite with private balcony, and multi-directional cross-ventilation.',
    highlights: [
      'Expansive multi-bedroom family layout',
      'Dual private sundecks for living salon and master retreat',
      'Up to 11 ft. soaring ceiling volume throughout',
      'Premium Grohe fittings in all bathrooms',
      'Cross-ventilated layout with panoramic dual-aspect vistas',
    ],
    url: 'https://surbhi-infotech.s3.ap-south-1.amazonaws.com/Aranya_The_Park/aranya_the_park_b_3bhk-1066/index.html',
    thumbnail: '/assets/opt/residences-interior-2000.webp',
  },
};

export const VirtualTour3D: React.FC<VirtualTour3DProps> = ({
  onOpenLeadModal,
  externalSelectedId,
  externalTriggerModal,
}) => {
  const [selectedId, setSelectedId] = useState<'2bhk' | '3bhk'>('2bhk');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync external configuration selection
  useEffect(() => {
    if (externalSelectedId && (externalSelectedId === '2bhk' || externalSelectedId === '3bhk')) {
      setSelectedId(externalSelectedId);
    }
  }, [externalSelectedId]);

  // Sync external modal trigger
  useEffect(() => {
    if (externalTriggerModal) {
      setIsLoading(true);
      setHasError(false);
      setIsModalOpen(true);
    }
  }, [externalTriggerModal]);

  const current = TOUR_DATA[selectedId];

  // Lock body scroll when fullscreen modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle ESC key to exit modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  const handleLaunchModal = () => {
    setIsLoading(true);
    setHasError(false);
    setIsModalOpen(true);
  };

  const handleSwitchTab = (id: '2bhk' | '3bhk') => {
    if (id !== selectedId) {
      setSelectedId(id);
      setIsLoading(true);
      setHasError(false);
    }
  };

  return (
    <section
      id="virtual-tour"
      className="section-spacing bg-dark-900 border-y border-white/[0.06] relative overflow-hidden text-ivory"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Chapter Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-5">
            CHAPTER 04 · SPATIAL IMMERSION
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ivory uppercase mb-4">
            Step Inside
          </h2>
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-ivory-muted font-light max-w-xl mx-auto">
            EXPLORE YOUR RESIDENCE IN 3D
          </p>
        </div>

        {/* ─── Modern Glass 2 BHK / 3 BHK Selector ─── */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 glass-panel rounded-full max-w-xs w-full justify-between gap-2">
            {(['2bhk', '3bhk'] as const).map((id) => {
              const item = TOUR_DATA[id];
              const isActive = selectedId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSwitchTab(id)}
                  className={`flex-1 py-3 px-4 text-center font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer rounded-full ${
                    isActive
                      ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                      : 'text-ivory-muted hover:text-ivory hover:bg-white/[0.04]'
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{item.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Product Experience Visual Showcase ─── */}
        <div className="glass-panel p-6 sm:p-10 lg:p-14 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Canvas & Click-to-Play Façade */}
            <div className="lg:col-span-7">
              <div className="relative border border-white/[0.08] rounded-[4px] overflow-hidden group shadow-2xl bg-black">
                {/* Visual Preview Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                  <Img
                    src={current.thumbnail}
                    alt={`${current.name} 3D Preview`}
                    sizes="(min-width: 1024px) 779px, 100vw"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent" />

                  {/* Center Play Compass Trigger */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full glass-panel border border-champagne-400/60 flex items-center justify-center text-champagne-300 shadow-[0_0_30px_rgba(200,169,107,0.3)] group-hover:scale-110 transition-transform duration-300">
                      <Compass size={32} className="text-champagne-400" />
                    </div>
                    <span className="font-sans text-xs sm:text-sm text-ivory mt-4 tracking-[0.25em] font-semibold uppercase drop-shadow">
                      EXPLORE IN 3D
                    </span>
                  </div>

                  {/* Click Overlay */}
                  <button
                    onClick={handleLaunchModal}
                    className="absolute inset-0 w-full h-full cursor-pointer z-20 focus:outline-none"
                    aria-label={`Launch 3D tour for ${current.name}`}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Specifications & Primary CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2">
                  {current.type} Virtual Walkthrough
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
                  {current.name}
                </h3>
                <p className="font-serif italic text-sm sm:text-base text-champagne-300/80 mt-1.5">
                  "{current.tagline}"
                </p>
              </div>

              {/* Quick Spec Metrics */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/[0.08] text-center font-sans">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ivory-muted/60">Carpet Area</span>
                  <strong className="text-sm sm:text-base text-champagne-300 font-semibold">
                    {current.carpetArea}
                  </strong>
                </div>
                <div className="border-x border-white/[0.08]">
                  <span className="block text-[10px] uppercase tracking-wider text-ivory-muted/60">Sundeck</span>
                  <strong className="text-sm sm:text-base text-champagne-300 font-semibold">
                    {current.deck}
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ivory-muted/60">Clear Height</span>
                  <strong className="text-sm sm:text-base text-champagne-300 font-semibold">
                    {current.ceiling}
                  </strong>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-ivory-muted leading-relaxed font-light">
                {current.description}
              </p>

              {/* Single Primary Action Button */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Button
                  variant="gold"
                  size="md"
                  icon={<Compass size={15} />}
                  onClick={handleLaunchModal}
                >
                  EXPLORE IN 3D
                </Button>

                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ivory-muted hover:text-champagne-300 uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Open Dedicated Window</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ─── Immersive Fullscreen 3D Modal / Viewer ─── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black text-ivory select-none animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.name} 3D Virtual Walkthrough`}
        >
          {/* Top Architectural Control Bar */}
          <div className="px-4 sm:px-8 py-3 bg-dark-950/95 border-b border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
            {/* Left: Brand & Residence Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <img
                    src="/assets/branding/aranya-wordmark-light.png"
                    alt="Aranya The Park"
                    width={2393}
                    height={678}
                    className="h-5 sm:h-6 w-auto object-contain shrink-0"
                  />
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-champagne-400 font-semibold truncate">
                    • Malad West
                  </span>
                </span>
                <h4 className="font-serif text-sm sm:text-lg text-ivory font-light truncate">
                  {current.name}
                </h4>
              </div>

              {/* Quick 2 BHK / 3 BHK Switcher inside Modal */}
              <div className="hidden sm:inline-flex p-1 glass-panel rounded-full ml-4">
                <button
                  onClick={() => handleSwitchTab('2bhk')}
                  className={`px-4 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors cursor-pointer rounded-full ${
                    selectedId === '2bhk'
                      ? 'bg-champagne-400 text-dark-950 font-bold'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  2 BHK
                </button>
                <button
                  onClick={() => handleSwitchTab('3bhk')}
                  className={`px-4 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors cursor-pointer rounded-full ${
                    selectedId === '3bhk'
                      ? 'bg-champagne-400 text-dark-950 font-bold'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  3 BHK
                </button>
              </div>
            </div>

            {/* Right: Actions & Close */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-champagne-400/30 text-xs font-sans text-champagne-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reload Tour"
              >
                <RotateCcw size={13} />
                <span>Reload</span>
              </button>

              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-champagne-400/30 text-xs font-sans text-champagne-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Open in Dedicated Window"
              >
                <span>Full Tab</span>
                <ExternalLink size={13} />
              </a>

              <Button
                variant="gold"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => {
                  setIsModalOpen(false);
                  onOpenLeadModal(`Interested in ${current.type} (3D Fullscreen)`, current.type);
                }}
              >
                Interested in this residence?
              </Button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-champagne-400/30"
                aria-label="Close 3D Walkthrough"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="relative flex-1 w-full bg-black">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-forest-950">
                <LoadingState size="lg" label="Initializing 3D Spatial Walkthrough..." />
                <p className="text-xs text-cream-300/50 mt-2 font-sans tracking-wide">
                  Loading high-fidelity textures & lighting geometry
                </p>
              </div>
            )}

            {/* Error / Fallback State */}
            {hasError ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 sm:p-12 bg-forest-950 text-center">
                <div className="w-16 h-16 border border-champagne-400 flex items-center justify-center text-champagne-400 mb-4">
                  <Compass size={32} />
                </div>
                <h3 className="heading-serif text-2xl sm:text-3xl text-cream-100 mb-3">
                  Direct 3D Experience Entry
                </h3>
                <p className="prose-editorial text-sm max-w-md mx-auto mb-6">
                  To provide you with unconstrained hardware acceleration, you can launch this 3D walkthrough directly in a dedicated browser tab.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="gold"
                    size="lg"
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLink size={16} />}
                  >
                    Launch in Dedicated Window
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setIsModalOpen(false)}>
                    Return to Overview
                  </Button>
                </div>
              </div>
            ) : (
              /* Live Mounted Iframe */
              <iframe
                key={`modal-${selectedId}`}
                src={current.url}
                title={`${current.name} 3D Fullscreen Walkthrough`}
                className="w-full h-full border-0"
                allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            )}
          </div>

          {/* Bottom Orientation Bar */}
          <div className="px-5 py-2.5 bg-forest-950/95 border-t border-champagne-400/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-cream-300/60 shrink-0">
            <div className="flex items-center gap-2">
              <Smartphone size={13} className="text-champagne-400 shrink-0" />
              <span>Mobile Tip: Rotate your device to landscape for the most panoramic view.</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Press ESC to exit</span>
              <span>•</span>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne-300 hover:text-white underline underline-offset-2"
              >
                Direct S3 Link ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
