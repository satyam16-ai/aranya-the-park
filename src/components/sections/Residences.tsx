import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Compass, LayoutTemplate } from 'lucide-react';
import { residencesData } from '../../data/residencesData';
import type { ResidenceUnit } from '../../types';
import { crossFade } from '../../lib/motion';
import { Button } from '../common/Button';
import { Chip } from '../common/Chip';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { SectionIntro } from '../common/SectionIntro';
import { Tabs } from '../common/Tabs';
import { Reveal } from '../common/Reveal';
import { TourViewer } from './TourViewer';

interface ResidencesProps {
  onOpenLeadModal: (purpose?: string, config?: string) => void;
  onOpenFloorPlansModal: (category?: 'master' | 'tower-a' | 'tower-b') => void;
}

const towerCategory = (unit: ResidenceUnit): 'tower-a' | 'tower-b' =>
  unit.tower?.startsWith('Tower B') ? 'tower-b' : 'tower-a';

/**
 * Residences — 2 / 3 / 4 BHK selector with the 3D walkthrough built into the
 * unit card. On the linen surface with the crest watermark.
 */
export const Residences: React.FC<ResidencesProps> = ({ onOpenLeadModal, onOpenFloorPlansModal }) => {
  const [unitId, setUnitId] = useState(residencesData[0].id);
  const [tourOpen, setTourOpen] = useState(false);
  const unit = residencesData.find((u) => u.id === unitId) ?? residencesData[0];

  const specs: { label: string; value: string }[] = [
    ...(unit.carpetArea ? [{ label: 'Carpet area', value: unit.carpetArea }] : []),
    { label: 'Sundeck', value: unit.deck },
    { label: 'Ceiling height', value: unit.ceilingHeight },
    ...(unit.tower ? [{ label: 'Tower', value: unit.tower }] : []),
  ];

  return (
    <section id="residences" data-surface="linen" className="watermark relative overflow-hidden py-section">
      {/* Blueprint: the typical-floor plan as a faint line drawing behind the section head */}
      <img
        src="/assets/opt/plan-tower-a-typical-1600.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={1600}
        height={1156}
        className="pointer-events-none absolute -right-[12%] -top-[6%] hidden w-[58%] max-w-4xl opacity-[0.16] mix-blend-multiply [mask-image:radial-gradient(closest-side,black_35%,transparent_100%)] lg:block"
      />
      <Container size="showcase" className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Chapter 03 · Residences"
            title={
              <>
                Space to <em>live</em>, designed around light
              </>
            }
            lead="Homes engineered around generous 11-foot ceiling volumes, cross-ventilating private sundecks and uncompromised privacy."
          />
          <Reveal className="shrink-0">
            <Tabs
              ariaLabel="Choose a configuration"
              items={residencesData.map((u) => ({ id: u.id, label: u.type }))}
              value={unit.id}
              onChange={setUnitId}
            />
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:mt-14">
          <div className="grid grid-cols-1 overflow-hidden rounded-sm border border-card-border bg-card shadow-md lg:grid-cols-12">
            {/* Image */}
            <div className="relative lg:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={unit.id}
                  className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.6 } }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <Img
                    src={unit.threeDThumbnail}
                    alt={`${unit.type} — ${unit.title}`}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-950/70 to-transparent" />
                  <div className="absolute left-5 top-5 flex gap-2">
                    <Chip tone="solid">{unit.tag}</Chip>
                  </div>
                  <span className="t-micro absolute bottom-4 left-5 text-linen-200/80">Representative image</span>

                  {unit.threeDUrl && (
                    <button
                      type="button"
                      onClick={() => setTourOpen(true)}
                      className="group absolute bottom-5 right-5 flex items-center gap-3 rounded-sm border border-gold-300/50 bg-forest-950/70 px-4 py-3 text-linen-100 backdrop-blur-md transition-colors hover:border-gold-300 hover:bg-forest-950/85"
                      aria-label={`Explore the ${unit.type} in 3D`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-linen-950 transition-transform group-hover:scale-105">
                        <Compass size={16} strokeWidth={1.5} />
                      </span>
                      <span className="t-micro">Explore in 3D</span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Details */}
            <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={unit.id} variants={crossFade} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
                  <span className="t-eyebrow">{unit.type} residence</span>
                  <h3 className="t-h3 mt-4 text-fg">{unit.title}</h3>
                  <p className="t-body mt-3 text-fg-muted">{unit.description}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-rule py-5">
                    {specs.map((s) => (
                      <div key={s.label}>
                        <dt className="t-micro text-fg-muted">{s.label}</dt>
                        <dd className="mt-1 font-sans text-sm font-medium text-fg">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-5 space-y-2.5">
                    {unit.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-fg-muted">
                        <Check size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-gold-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button icon={<ArrowRight size={14} />} onClick={() => onOpenLeadModal(`Enquire — ${unit.type}`, unit.type)}>
                      Floor plan &amp; pricing
                    </Button>
                    <Button
                      variant="secondary"
                      icon={<LayoutTemplate size={14} />}
                      onClick={() => onOpenFloorPlansModal(towerCategory(unit))}
                    >
                      View floor plans
                    </Button>
                  </div>
                  {unit.id === '4bhk' && (
                    <p className="t-micro mt-5 text-fg-muted">* Presidential 4 BHK residences occupy select upper floors.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>

      <TourViewer
        isOpen={tourOpen}
        unitId={unit.threeDUrl ? unit.id : residencesData[0].id}
        onChangeUnit={setUnitId}
        onClose={() => setTourOpen(false)}
        onEnquire={(u) => {
          setTourOpen(false);
          onOpenLeadModal(`Interested in ${u.type} (3D walkthrough)`, u.type);
        }}
      />
    </section>
  );
};
