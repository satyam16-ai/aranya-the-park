import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ShieldCheck,
  Check,
  X,
  Move,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import { detailedFloorPlans, type DetailedFloorPlan } from '../../data/floorPlansData';

export interface FloorPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  initialCategory?: 'master' | 'tower-a' | 'tower-b';
}

export const FloorPlansModal: React.FC<FloorPlansModalProps> = ({
  isOpen,
  onClose,
  onOpenLeadModal,
  initialCategory = 'master',
}) => {
  const [activeCategory, setActiveCategory] = useState<'master' | 'tower-a' | 'tower-b'>(initialCategory);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('master-layout');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showDetailsPane, setShowDetailsPane] = useState<boolean>(true);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync initialCategory if opened with specific category
  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategory(initialCategory);
      const firstOfCat = detailedFloorPlans.find((p) => p.category === initialCategory);
      if (firstOfCat) {
        setSelectedPlanId(firstOfCat.id);
      }
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, initialCategory]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Category plans
  const categoryPlans = detailedFloorPlans.filter((p) => p.category === activeCategory);

  // Current active plan
  const currentPlan: DetailedFloorPlan =
    categoryPlans.find((p) => p.id === selectedPlanId) || categoryPlans[0] || detailedFloorPlans[0];

  const handleSelectCategory = (cat: 'master' | 'tower-a' | 'tower-b') => {
    setActiveCategory(cat);
    const firstOfCat = detailedFloorPlans.find((p) => p.category === cat);
    if (firstOfCat) {
      setSelectedPlanId(firstOfCat.id);
    }
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Floor Plan Explorer Pop-up Window"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[94vh] bg-dark-900 border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-[4px] flex flex-col overflow-hidden animate-scale-in select-none">
        {/* ─── Top Luxury Header Bar ─── */}
        <div className="px-4 sm:px-6 py-3.5 bg-dark-950/90 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-champagne-300 text-[10px] tracking-[0.3em] uppercase font-sans font-semibold">
                ARCHITECTURAL BLUEPRINTS
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-ivory-muted/70 font-sans border-l border-white/[0.1] pl-2">
                <ShieldCheck size={11} className="text-champagne-400" />
                MahaRERA: P51800011594
              </span>
            </div>
            <h2 className="font-serif text-base sm:text-xl text-ivory font-light truncate">
              Interactive Floor Plan Explorer
            </h2>
          </div>

          {/* Quick Header Category Pills on Tablet/Desktop */}
          <div className="hidden lg:flex items-center p-1 bg-white/[0.03] border border-white/[0.08] rounded-full">
            {[
              { id: 'master', label: 'Master Layout' },
              { id: 'tower-a', label: 'Tower A (3 BHK)' },
              { id: 'tower-b', label: 'Tower B (2 BHK)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSelectCategory(tab.id as any)}
                className={`px-3.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-all rounded-full cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-champagne-400 text-dark-950 font-semibold shadow-sm'
                    : 'text-ivory-muted hover:text-ivory'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline-gold"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => onOpenLeadModal(`Inquiry from Floor Plan: ${currentPlan.title}`)}
            >
              Request CAD Plans
            </Button>

            <button
              onClick={() => setShowDetailsPane(!showDetailsPane)}
              className={`p-2 border rounded-[3px] text-xs font-sans transition-colors cursor-pointer ${
                showDetailsPane
                  ? 'bg-white/[0.08] border-champagne-400/50 text-champagne-300'
                  : 'border-white/[0.08] text-ivory-muted hover:text-ivory'
              }`}
              title="Toggle Details Drawer"
            >
              <Info size={16} />
            </button>

            <button
              onClick={onClose}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer ml-1"
              aria-label="Close Pop-up Window"
              title="Close (ESC)"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ─── Level 1 Category Pills on Mobile/Tablet ─── */}
        <div className="lg:hidden px-4 py-2 bg-dark-950 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'master', label: 'Master Layout' },
            { id: 'tower-a', label: 'Tower A' },
            { id: 'tower-b', label: 'Tower B' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectCategory(tab.id as any)}
              className={`px-3 py-1 text-[10px] font-sans uppercase tracking-wider whitespace-nowrap transition-colors rounded-full border ${
                activeCategory === tab.id
                  ? 'bg-champagne-400 text-dark-950 border-champagne-300 font-semibold'
                  : 'border-white/[0.08] text-ivory-muted hover:text-ivory'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Level 2 Floor Selector Bar & Interactive Zoom Toolbar ─── */}
        <div className="px-4 sm:px-6 py-2.5 bg-dark-950/70 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
            <span className="text-[10px] uppercase tracking-wider text-ivory-muted/70 mr-1 hidden sm:inline">
              Layout:
            </span>
            {categoryPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-[3px] border ${
                    isSelected
                      ? 'border-champagne-400/60 bg-white/[0.08] text-champagne-300 font-semibold'
                      : 'border-white/[0.06] text-ivory-muted hover:text-ivory hover:border-white/[0.15]'
                  }`}
                >
                  {plan.floorLabel}
                </button>
              );
            })}
          </div>

          {/* Zoom and Reset Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-[3px] border border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-[3px] border border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-[3px] border border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw size={14} />
            </button>
            <a
              href={currentPlan.image}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-[3px] border border-white/[0.08] text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors inline-flex items-center ml-1"
              title="Download High-Res Blueprint"
            >
              <Download size={14} />
            </a>
          </div>
        </div>

        {/* ─── Main Interactive Blueprint Canvas ─── */}
        <div className="relative flex-1 w-full bg-dark-950 overflow-hidden flex items-center justify-center">
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`w-full h-full flex items-center justify-center ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Pan & Zoom Image Container */}
            <div
              className="transition-transform duration-100 ease-out origin-center pointer-events-none flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              <img
                src={currentPlan.image}
                alt={currentPlan.title}
                className="max-h-[68vh] max-w-[90vw] object-contain filter contrast-[1.12] brightness-[0.98] drop-shadow-2xl"
                draggable={false}
              />
            </div>
          </div>

          {/* Canvas Floating Guidance Cue */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-dark-900/90 border border-white/[0.08] text-ivory-muted text-[11px] font-sans backdrop-blur-md">
              <Move size={12} className="text-champagne-300" />
              <span>Drag to Pan • Zoom controls or pinch to inspect</span>
            </div>
          </div>

          {/* Current Scale & Zoom Multiplier Indicator */}
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none hidden sm:block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-dark-900/90 border border-white/[0.08] text-champagne-300 text-[10px] font-sans uppercase tracking-wider backdrop-blur-md">
              <span>Scale: {Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>

        {/* ─── Bottom Collapsible Details & Highlights Drawer ─── */}
        {showDetailsPane && (
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-dark-950/95 border-t border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center shrink-0">
            <div className="lg:col-span-8 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-champagne-300 font-semibold">
                  {currentPlan.title}
                </span>
                <span className="text-[11px] text-ivory-muted/70 hidden sm:inline">• {currentPlan.subtitle}</span>
              </div>
              <p className="text-xs text-ivory-muted leading-relaxed font-light mt-1 line-clamp-2">
                {currentPlan.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ivory-muted">
                {currentPlan.highlights.slice(0, 3).map((hl) => (
                  <span key={hl} className="inline-flex items-center gap-1.5">
                    <Check size={12} className="text-champagne-400" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenLeadModal(`Interested in ${currentPlan.title}`);
                }}
              >
                Inquire For This Unit
              </Button>
              <Button
                variant="outline"
                size="sm"
                href={currentPlan.image}
                target="_blank"
                rel="noopener noreferrer"
                icon={<Download size={13} />}
              >
                Download Blueprint
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
