import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Download, ShieldCheck, Check, X, Move } from 'lucide-react';
import { Button } from '../common/Button';
import { Img } from '../common/Img';
import { Tabs } from '../common/Tabs';
import { cn } from '../../lib/cn';
import { overlayFade, panelIn } from '../../lib/motion';
import { useDialog } from '../../lib/useDialog';
import { detailedFloorPlans, type DetailedFloorPlan } from '../../data/floorPlansData';
import { projectData } from '../../data/projectData';

export type FloorPlanCategory = 'master' | 'tower-a' | 'tower-b';

export interface FloorPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  initialCategory?: FloorPlanCategory;
}

const CATEGORIES: { id: FloorPlanCategory; label: string; hint?: string }[] = [
  { id: 'master', label: 'Master layout' },
  { id: 'tower-a', label: 'Tower A', hint: '3 & 4 BHK' },
  { id: 'tower-b', label: 'Tower B', hint: '2 & 3 BHK' },
];

const toolBtn =
  'flex h-10 w-10 items-center justify-center rounded-xs border border-card-border text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg';

const Explorer: React.FC<Omit<FloorPlansModalProps, 'isOpen'>> = ({ onClose, onOpenLeadModal, initialCategory = 'master' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, true, onClose, '[data-fp-close]');

  const [category, setCategory] = useState<FloorPlanCategory>(initialCategory);
  const [planId, setPlanId] = useState<string>(
    detailedFloorPlans.find((p) => p.category === initialCategory)?.id ?? detailedFloorPlans[0].id
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gesture = useRef<{ startDist: number; startZoom: number; startPan: { x: number; y: number }; startMid: { x: number; y: number } } | null>(null);

  const plans = detailedFloorPlans.filter((p) => p.category === category);
  const plan: DetailedFloorPlan = plans.find((p) => p.id === planId) ?? plans[0];

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const selectCategory = (c: FloorPlanCategory) => {
    setCategory(c);
    setPlanId(detailedFloorPlans.find((p) => p.category === c)?.id ?? '');
    resetView();
  };

  const selectPlan = (id: string) => {
    setPlanId(id);
    resetView();
  };

  /* Pointer-based pan (mouse + touch) and two-finger pinch zoom */
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      setDragging(true);
      gesture.current = { startDist: 0, startZoom: zoom, startPan: pan, startMid: { x: e.clientX, y: e.clientY } };
    } else if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      gesture.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startZoom: zoom,
        startPan: pan,
        startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size >= 2) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      setZoom(Math.min(3, Math.max(0.75, (g.startZoom * dist) / Math.max(g.startDist, 1))));
      setPan({ x: g.startPan.x + (mid.x - g.startMid.x), y: g.startPan.y + (mid.y - g.startMid.y) });
    } else {
      setPan({ x: g.startPan.x + (e.clientX - g.startMid.x), y: g.startPan.y + (e.clientY - g.startMid.y) });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      setDragging(false);
      gesture.current = null;
    } else if (pointers.current.size === 1) {
      const [a] = Array.from(pointers.current.values());
      gesture.current = { startDist: 0, startZoom: zoom, startPan: pan, startMid: { x: a.x, y: a.y } };
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-stretch justify-center p-0 sm:items-center sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Floor plan explorer"
      variants={overlayFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-forest-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={ref}
        data-surface="linen"
        variants={panelIn}
        className="relative z-10 flex h-full w-full max-w-[1280px] flex-col overflow-hidden border border-card-border shadow-xl sm:h-[92vh] sm:rounded-md"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-card-border px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="t-micro text-accent-text">Architectural blueprints</span>
              <span className="t-micro hidden items-center gap-1 text-fg-muted md:inline-flex">
                <ShieldCheck size={12} className="text-gold-600" /> MahaRERA {projectData.mahaRera}
              </span>
            </div>
            <h2 className="t-h3 truncate text-fg">Floor plan explorer</h2>
          </div>
          <div className="hidden lg:block">
            <Tabs<FloorPlanCategory> ariaLabel="Plan category" items={CATEGORIES} value={category} onChange={selectCategory} size="sm" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => {
                onClose();
                onOpenLeadModal(`Floor plans — ${plan.title}`);
              }}
            >
              Request plans &amp; pricing
            </Button>
            <button
              type="button"
              data-fp-close
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
              aria-label="Close floor plans"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mobile category */}
        <div className="border-b border-card-border px-4 py-2 lg:hidden">
          <Tabs<FloorPlanCategory> ariaLabel="Plan category" items={CATEGORIES} value={category} onChange={selectCategory} size="sm" grow />
        </div>

        {/* Floor chips + zoom */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-card-border bg-surface-alt px-4 py-2.5 sm:px-6">
          <div className="scroll-x flex max-w-full items-center gap-1.5" role="tablist" aria-label="Floor">
            {plans.map((p) => {
              const selected = p.id === plan.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectPlan(p.id)}
                  className={cn(
                    'whitespace-nowrap rounded-xs border px-3 py-1.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] transition-colors',
                    selected ? 'border-gold-500 bg-gold-500 text-linen-950' : 'border-card-border text-fg-muted hover:text-fg'
                  )}
                >
                  {p.floorLabel}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))} className={toolBtn} aria-label="Zoom in">
              <ZoomIn size={15} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))} className={toolBtn} aria-label="Zoom out">
              <ZoomOut size={15} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={resetView} className={toolBtn} aria-label="Reset view">
              <RotateCcw size={15} strokeWidth={1.5} />
            </button>
            <a href={plan.image} target="_blank" rel="noopener noreferrer" className={toolBtn} aria-label="Open blueprint image">
              <Download size={15} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={cn('flex h-full w-full touch-none items-center justify-center', dragging ? 'cursor-grabbing' : 'cursor-grab')}
          >
            <div
              className="pointer-events-none flex items-center justify-center will-change-transform"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: dragging ? 'none' : 'transform 120ms ease-out' }}
            >
              <Img
                src={plan.image}
                alt={plan.title}
                sizes="(min-width: 1280px) 1200px, 100vw"
                loading="eager"
                className="max-h-[62vh] max-w-[92vw] object-contain sm:max-h-[64vh]"
                draggable={false}
              />
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-xs border border-card-border bg-surface/90 px-3 py-1.5 backdrop-blur-sm">
            <Move size={12} className="text-gold-600" />
            <span className="t-micro text-fg-muted">Drag to pan · pinch or use the controls to zoom</span>
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-xs border border-card-border bg-surface/90 px-3 py-1.5 backdrop-blur-sm sm:block">
            <span className="t-micro tabular-nums text-fg-muted">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Details */}
        <div className="grid shrink-0 grid-cols-1 items-center gap-4 border-t border-card-border px-4 py-4 sm:px-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <p className="t-micro text-accent-text">{plan.categoryLabel}</p>
            <h3 className="t-h3-ui mt-1 text-fg">{plan.title}</h3>
            <p className="t-small mt-1 line-clamp-2 text-fg-muted">{plan.subtitle}</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {plan.highlights.slice(0, 3).map((h) => (
                <li key={h} className="t-micro flex items-center gap-1.5 text-fg-muted">
                  <Check size={12} className="text-gold-600" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 lg:col-span-4 lg:justify-end">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onOpenLeadModal(`Interested in ${plan.title}`);
              }}
            >
              Enquire for this plan
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/** Floor plan explorer — master layout, Tower A and Tower B plates with pan/zoom. */
export const FloorPlansModal: React.FC<FloorPlansModalProps> = ({ isOpen, ...rest }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{isOpen && <Explorer key="floor-plans" {...rest} />}</AnimatePresence>,
    document.body
  );
};
