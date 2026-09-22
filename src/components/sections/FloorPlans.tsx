import React, { useEffect, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FileDown,
  Lock,
  Eye,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { Img } from '../common/Img';
import { hasUnlockedPlans } from '../../services/enquiryService';

/**
 * Tower floor plates stay blurred until the visitor submits an enquiry; the
 * master plan is always legible. `unlockPlans()` fires the event we listen for,
 * so an unlock from anywhere on the page reveals the plans without a reload.
 */
function usePlansUnlocked(): boolean {
  const [unlocked, setUnlocked] = useState(hasUnlockedPlans);
  useEffect(() => {
    const sync = () => setUnlocked(hasUnlockedPlans());
    window.addEventListener('aranya:plans-unlocked', sync);
    return () => window.removeEventListener('aranya:plans-unlocked', sync);
  }, []);
  return unlocked;
}

import { detailedFloorPlans } from '../../data/floorPlansData';

interface FloorPlansProps {
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  onOpenModal?: (category?: 'master' | 'tower-a' | 'tower-b') => void;
  onSelectFloorPlanLightbox?: (imageUrl: string, title: string, desc?: string) => void;
}

type TowerSelection = 'tower-a' | 'tower-b' | 'master';

export const FloorPlans: React.FC<FloorPlansProps> = ({
  onOpenLeadModal,
  onOpenModal,
  onSelectFloorPlanLightbox,
}) => {
  const [selectedTower, setSelectedTower] = useState<TowerSelection>('tower-b');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const plansUnlocked = usePlansUnlocked();

  // Filter plans based on selected tower
  const towerPlans = detailedFloorPlans.filter((p) => {
    if (selectedTower === 'master') return p.category === 'master';
    if (selectedTower === 'tower-a') return p.category === 'tower-a';
    return p.category === 'tower-b';
  });

  const [activePlanId, setActivePlanId] = useState<string>(towerPlans[0]?.id || 'plan-b-typical');
  const currentPlan = towerPlans.find((p) => p.id === activePlanId) || towerPlans[0] || detailedFloorPlans[0];
  const isLocked = !plansUnlocked && currentPlan.category !== 'master';

  const handleTowerChange = (tower: TowerSelection) => {
    setSelectedTower(tower);
    setZoomLevel(1);
    const firstPlan = detailedFloorPlans.find((p) => {
      if (tower === 'master') return p.category === 'master';
      if (tower === 'tower-a') return p.category === 'tower-a';
      return p.category === 'tower-b';
    });
    if (firstPlan) setActivePlanId(firstPlan.id);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);

  const handleFullscreen = () => {
    // Fullscreen would show the unblurred plate, so a locked plan routes to the
    // enquiry form instead of the lightbox.
    if (isLocked) {
      onOpenLeadModal('Floor Plan Access');
      return;
    }
    if (onSelectFloorPlanLightbox) {
      onSelectFloorPlanLightbox(currentPlan.image, currentPlan.title, currentPlan.description);
    } else if (onOpenModal) {
      onOpenModal(selectedTower);
    }
  };

  return (
    <section id="floor-plans" className="section-spacing bg-dark-900 text-ivory relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-5">
            ARCHITECTURAL BLUEPRINTS
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ivory uppercase mb-5">
            Find Your Space
          </h2>
          <p className="font-sans text-sm sm:text-base text-ivory-muted font-light max-w-2xl mx-auto leading-relaxed">
            Inspect authentic MahaRERA approved floor plates with fluid zoom and detail navigation.
          </p>
        </div>

        {/* ─── Primary Tower Selector (Modern Glass Pill) ─── */}
        <div className="flex justify-center mb-6 px-4">
          <div className="inline-flex p-1 sm:p-1.5 glass-panel rounded-full max-w-md w-full justify-between gap-1 sm:gap-1.5">
            <button
              onClick={() => handleTowerChange('tower-a')}
              className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 text-center font-sans text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer rounded-full ${
                selectedTower === 'tower-a'
                  ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory'
              }`}
            >
              A TOWER
            </button>
            <button
              onClick={() => handleTowerChange('tower-b')}
              className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 text-center font-sans text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer rounded-full ${
                selectedTower === 'tower-b'
                  ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory'
              }`}
            >
              B TOWER
            </button>
            <button
              onClick={() => handleTowerChange('master')}
              className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 text-center font-sans text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer rounded-full ${
                selectedTower === 'master'
                  ? 'bg-champagne-400 text-dark-950 font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory'
              }`}
            >
              MASTER PLAN
            </button>
          </div>
        </div>

        {/* ─── Contextual Sub-Floor Selector ─── */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto overflow-touch pb-3 mb-8 px-4 sm:px-0">
          {towerPlans.map((plan) => {
            const isActive = plan.id === currentPlan.id;
            return (
              <button
                key={plan.id}
                onClick={() => {
                  setActivePlanId(plan.id);
                  setZoomLevel(1);
                }}
                className={`px-3.5 sm:px-4 py-2 text-[11px] font-sans uppercase tracking-[0.12em] whitespace-nowrap shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border border-champagne-400/80 bg-champagne-400/20 text-champagne-300 font-semibold shadow-sm'
                    : 'text-ivory-muted/80 hover:text-ivory bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {plan.floorLabel}
              </button>
            );
          })}
        </div>

        {/* ─── The Hero Floor Plan Canvas (Clean, Expansive, Minimal Controls) ─── */}
        <div className="glass-panel rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/[0.08] overflow-hidden">
          {/* Top Control Strip */}
          <div className="px-6 py-3.5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg text-ivory font-light">
                {currentPlan.title}
              </span>
            </div>

            {/* Minimal Zoom & Fullscreen Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="w-8 h-8 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="w-8 h-8 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={handleZoomReset}
                aria-label="Reset zoom"
                className="w-8 h-8 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>
              <span className="w-px h-5 bg-white/[0.1] mx-1" />
              <button
                onClick={handleFullscreen}
                aria-label="Fullscreen view"
                className="px-3.5 py-1.5 rounded-full glass-control flex items-center gap-1.5 text-xs text-champagne-300 hover:text-white cursor-pointer"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-wider">Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Large Architectural Blueprint Stage */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] bg-black/40 overflow-hidden flex items-center justify-center p-6 sm:p-10 cursor-grab active:cursor-grabbing">
            <div
              className="transition-transform duration-300 ease-out origin-center flex items-center justify-center w-full h-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <Img
                src={currentPlan.image}
                alt={currentPlan.title}
                sizes="(min-width: 1024px) 1400px, 100vw"
                className={`max-h-full max-w-full object-contain filter drop-shadow-2xl transition-[filter] duration-500 ${
                  isLocked ? 'blur-[14px] scale-[1.02]' : ''
                }`}
              />
            </div>

            {/* Enquiry gate — the master plan is never locked */}
            {isLocked && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-dark-950/55 backdrop-blur-[2px] px-6 text-center">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-champagne-400/40 text-champagne-300">
                  <Lock size={20} />
                </span>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="font-serif text-xl sm:text-2xl text-ivory">
                    Floor plans available on request
                  </h4>
                  <p className="text-xs text-ivory-muted leading-relaxed">
                    Share your details and the sales desk will unlock the detailed Tower A &amp;
                    Tower B plates, along with current pricing.
                  </p>
                </div>
                <Button
                  variant="gold"
                  size="md"
                  icon={<Eye size={15} />}
                  onClick={() => onOpenLeadModal('Floor Plan Access', '2 BHK')}
                >
                  UNLOCK FLOOR PLANS
                </Button>
              </div>
            )}

            {/* Subtle Zoom Indicator */}
            <div className="absolute bottom-4 left-4 text-[10px] font-sans tracking-widest uppercase text-ivory-muted/50 glass-panel-subtle px-2.5 py-1 rounded-full">
              Scale: {Math.round(zoomLevel * 100)}%
            </div>
          </div>

          {/* Bottom Context Footer */}
          <div className="px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-sans text-ivory-muted/70 font-light">
              {currentPlan.description}
            </p>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => onOpenLeadModal('Floor Plan Architectural PDF')}
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.16em] text-champagne-300 hover:text-white transition-colors cursor-pointer"
              >
                <FileDown size={14} />
                <span>Download Blueprint PDF</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
