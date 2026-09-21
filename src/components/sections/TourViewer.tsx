import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, ExternalLink, RotateCcw, Smartphone, X } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingState } from '../common/LoadingState';
import { Tabs } from '../common/Tabs';
import { overlayFade } from '../../lib/motion';
import { useDialog } from '../../lib/useDialog';
import { residencesData } from '../../data/residencesData';
import type { ResidenceUnit } from '../../types';

interface TourViewerProps {
  isOpen: boolean;
  unitId: string;
  onChangeUnit: (id: string) => void;
  onClose: () => void;
  onEnquire: (unit: ResidenceUnit) => void;
}

const tourUnits = residencesData.filter((u) => !!u.threeDUrl);

const Viewer: React.FC<Omit<TourViewerProps, 'isOpen'>> = ({ unitId, onChangeUnit, onClose, onEnquire }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  useDialog(ref, true, onClose, '[data-tour-close]');

  const unit = tourUnits.find((u) => u.id === unitId) ?? tourUnits[0];
  const url = unit.threeDUrl as string;

  const reload = () => {
    setLoading(true);
    setFailed(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <motion.div
      ref={ref}
      data-surface="deepest"
      role="dialog"
      aria-modal="true"
      aria-label={`${unit.title} — 3D walkthrough`}
      className="fixed inset-0 z-[110] flex flex-col bg-forest-950 text-linen-100"
      variants={overlayFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-rule px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src="/assets/branding/aranya-wordmark-light-320.png"
            alt="Aranya The Park"
            width={160}
            height={45}
            className="hidden h-8 w-auto sm:block"
          />
          <div className="min-w-0">
            <p className="t-micro text-gold-300">3D walkthrough</p>
            <h4 className="t-h3-ui truncate text-linen-100">{unit.title}</h4>
          </div>
          <div className="hidden md:block">
            <Tabs
              size="sm"
              ariaLabel="Choose a residence"
              items={tourUnits.map((u) => ({ id: u.id, label: u.type }))}
              value={unit.id}
              onChange={(id) => {
                onChangeUnit(id);
                reload();
              }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={reload} className="hidden h-11 w-11 items-center justify-center rounded-full text-linen-300 hover:bg-white/[0.06] hover:text-gold-300 sm:flex" aria-label="Reload tour">
            <RotateCcw size={16} strokeWidth={1.5} />
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="hidden h-11 w-11 items-center justify-center rounded-full text-linen-300 hover:bg-white/[0.06] hover:text-gold-300 sm:flex" aria-label="Open in a new tab">
            <ExternalLink size={16} strokeWidth={1.5} />
          </a>
          <Button size="sm" className="hidden lg:inline-flex" onClick={() => onEnquire(unit)}>
            Enquire about this home
          </Button>
          <button
            type="button"
            data-tour-close
            onClick={onClose}
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-linen-100 hover:border-gold-300 hover:text-gold-300"
            aria-label="Close walkthrough"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile unit switch */}
      <div className="border-b border-rule px-4 py-2 md:hidden">
        <Tabs
          size="sm"
          grow
          ariaLabel="Choose a residence"
          items={tourUnits.map((u) => ({ id: u.id, label: u.type }))}
          value={unit.id}
          onChange={(id) => {
            onChangeUnit(id);
            reload();
          }}
        />
      </div>

      {/* Viewport */}
      <div className="relative min-h-0 flex-1 bg-black">
        {loading && !failed && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-forest-950">
            <LoadingState size="lg" label="Loading the walkthrough" />
          </div>
        )}
        {failed ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-forest-950 p-8 text-center">
            <span className="icon-ring mb-5 h-16 w-16">
              <Compass size={28} strokeWidth={1.25} />
            </span>
            <h3 className="t-h3 text-linen-100">Open the walkthrough directly</h3>
            <p className="t-body mx-auto mt-3 max-w-md text-linen-400">
              For unconstrained hardware acceleration, launch this 3D tour in its own browser tab.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={url} target="_blank" rel="noopener noreferrer" icon={<ExternalLink size={14} />}>
                Launch in new tab
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Back to residences
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            key={`${unit.id}-${reloadKey}`}
            src={url}
            title={`${unit.title} 3D walkthrough`}
            className="h-full w-full border-0"
            allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
          />
        )}
      </div>

      {/* Footer strip */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-rule px-4 py-2.5 sm:px-6">
        <span className="t-micro flex items-center gap-2 text-linen-400">
          <Smartphone size={13} className="text-gold-400" />
          Rotate to landscape for the widest view
        </span>
        <div className="flex items-center gap-3">
          <Button size="sm" className="lg:hidden" onClick={() => onEnquire(unit)}>
            Enquire
          </Button>
          <span className="t-micro hidden text-linen-500 sm:inline">Esc to exit</span>
        </div>
      </div>
    </motion.div>
  );
};

/** Fullscreen 3D walkthrough (iframe) for residences with a `threeDUrl`. */
export const TourViewer: React.FC<TourViewerProps> = ({ isOpen, ...rest }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{isOpen && <Viewer key="tour" {...rest} />}</AnimatePresence>,
    document.body
  );
};
