import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, ShieldCheck, Flame, Building2, ArrowUpDown, Lightbulb, Trees, Car, Bath, type LucideIcon } from 'lucide-react';
import { amenitiesData, commonFacilities } from '../../data/amenitiesData';
import type { AmenityItem } from '../../types';
import { easeLuxe } from '../../lib/motion';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { Lightbox } from '../common/Lightbox';
import { SectionIntro } from '../common/SectionIntro';
import { Tabs } from '../common/Tabs';
import { Reveal } from '../common/Reveal';

type Filter = 'all' | 'ground' | 'terrace';

const facilityIcons: Record<string, LucideIcon> = {
  cctv: ShieldCheck,
  firefighting: Flame,
  earthquake: Building2,
  lifts: ArrowUpDown,
  led: Lightbulb,
  landscaped: Trees,
  parking: Car,
  toilets: Bath,
};

const groupLabel: Record<AmenityItem['category'], string> = {
  ground: 'Ground level',
  terrace: 'Rooftop terrace',
  building: 'Building',
};

/** Amenities — 14 spaces as a photographic grid on the deep forest surface. */
export const Amenities: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === 'all' ? amenitiesData : amenitiesData.filter((a) => a.category === filter)),
    [filter]
  );
  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="amenities" data-surface="deep" className="overflow-hidden py-section">
      <Container size="showcase">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Chapter 04 · Wellness & Recreation"
            title={
              <>
                Life beyond <em>four walls</em>
              </>
            }
            lead="From sunrise yoga on the skyline deck to pickleball rallies and sunset gatherings under the gazebo — fourteen spaces across two levels."
          />
          <Reveal className="shrink-0">
            <Tabs<Filter>
              ariaLabel="Filter amenities by level"
              items={[
                { id: 'all', label: 'All' },
                { id: 'ground', label: 'Ground level' },
                { id: 'terrace', label: 'Rooftop' },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </Reveal>
        </div>

        <motion.ul layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((a, i) => (
              <motion.li
                layout
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: easeLuxe, delay: (i % 6) * 0.05 } }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group block w-full overflow-hidden rounded-sm border border-card-border bg-card text-left transition-colors hover:border-gold-400/50"
                  aria-label={`${a.name} — view details`}
                >
                  <div className="relative aspect-square overflow-hidden sm:aspect-[4/3]">
                    <Img
                      src={a.image}
                      alt={a.name}
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-950/60 to-transparent" />
                    <span className="t-micro absolute left-3 top-3 hidden rounded-xs bg-forest-950/60 px-2 py-1 text-linen-200 backdrop-blur-sm sm:left-4 sm:top-4 sm:block">
                      {groupLabel[a.category]}
                    </span>
                    <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-linen-100/30 text-linen-100 opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 size={14} strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="p-3 sm:p-5">
                    <p className="t-micro hidden text-gold-300 sm:block">{a.categoryLabel}</p>
                    <h3 className="font-sans text-sm font-medium leading-snug text-fg sm:mt-1.5 sm:text-lg">{a.name}</h3>
                    <p className="t-small mt-1.5 hidden line-clamp-2 text-fg-muted sm:block">{a.tagline}</p>
                    <span className="mt-4 block h-px w-8 bg-gold-400 transition-[width] duration-500 ease-out-expo group-hover:w-16" />
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Common facilities — on the darkened parking render */}
        <Reveal className="relative isolate mt-14 overflow-hidden rounded-sm border border-card-border p-6 sm:p-8 lg:mt-16">
          <Img
            src="/assets/opt/amenity-parking-2000.webp"
            alt=""
            aria-hidden="true"
            sizes="(min-width: 1024px) 90vw, 100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_60%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/95 via-forest-900/90 to-forest-900/80" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
            <div className="lg:w-64 lg:shrink-0">
              <span className="t-eyebrow">Building-wide</span>
              <h3 className="t-h3 mt-3 text-fg">Quietly essential</h3>
              <p className="t-small mt-3 text-fg-muted">Automated tower parking, EV bays and round-the-clock surveillance sit below the greens.</p>
            </div>
            <ul className="grid flex-1 grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {commonFacilities.map((f) => {
                const Icon = facilityIcons[f.id] ?? ShieldCheck;
                return (
                  <li key={f.id} className="flex items-start gap-3">
                    <span className="icon-ring h-10 w-10">
                      <Icon size={16} strokeWidth={1.5} />
                    </span>
                    <span className="pt-2 text-sm text-fg">{f.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>

      <Lightbox
        isOpen={current !== null}
        onClose={() => setOpenIndex(null)}
        imageUrl={current?.image ?? ''}
        title={current?.name ?? ''}
        category={current ? `${groupLabel[current.category]} · ${current.categoryLabel}` : undefined}
        description={current?.description}
        highlights={current?.highlights}
        hasPrev={openIndex !== null && openIndex > 0}
        hasNext={openIndex !== null && openIndex < items.length - 1}
        onPrev={() => setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
        onNext={() => setOpenIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i))}
        currentIndex={openIndex ?? undefined}
        totalCount={items.length}
      />
    </section>
  );
};
