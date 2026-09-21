import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { galleryData } from '../../data/galleryData';
import type { GalleryItem } from '../../types';
import { cn } from '../../lib/cn';
import { easeLuxe } from '../../lib/motion';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { Lightbox } from '../common/Lightbox';
import { SectionIntro } from '../common/SectionIntro';
import { Tabs } from '../common/Tabs';
import { Reveal } from '../common/Reveal';

type Filter = 'all' | 'exterior' | 'interior' | 'amenities' | 'lifestyle' | 'architecture';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'interior', label: 'Interiors' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

const aspectClass: Record<NonNullable<GalleryItem['aspect']>, string> = {
  tall: 'aspect-[3/4]',
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
};

const matches = (item: GalleryItem, f: Filter) =>
  f === 'all' || item.category === f || item.secondaryCategories?.includes(f);

/** Gallery — CSS-columns masonry on the deepest surface with a full lightbox. */
export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(() => galleryData.filter((g) => matches(g, filter)), [filter]);
  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <section id="gallery" data-surface="deepest" className="overflow-hidden py-section">
      <Container size="showcase">
        <SectionIntro
          align="center"
          eyebrow="Chapter 07 · Gallery"
          title={
            <>
              Renders, spaces &amp; <em>everyday</em> moments
            </>
          }
          lead="The architectural elevation, arrival spaces, wellness decks and the parkscape in between."
        />
        <Reveal className="mt-10 flex justify-center">
          <Tabs<Filter> ariaLabel="Filter gallery" items={filters} value={filter} onChange={setFilter} size="sm" />
        </Reveal>

        <motion.div layout className="mt-10 columns-2 gap-3 sm:gap-5 lg:mt-12 lg:columns-3 lg:gap-6">
          <AnimatePresence initial={false}>
            {items.map((g, i) => (
              <motion.figure
                layout
                key={g.id}
                className="mb-3 break-inside-avoid sm:mb-5 lg:mb-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: easeLuxe, delay: (i % 6) * 0.04 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-xs border border-transparent transition-colors hover:border-gold-400/60"
                  aria-label={`${g.title} — open image`}
                >
                  <div className={cn('relative overflow-hidden', aspectClass[g.aspect ?? 'landscape'])}>
                    <Img
                      src={g.image}
                      alt={g.title}
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 text-left sm:p-5">
                      <div>
                        <span className="t-micro hidden text-gold-300 sm:block">{g.categoryLabel}</span>
                        <span className="block font-sans text-sm font-medium leading-snug text-linen-100 sm:mt-1 sm:text-lg">{g.title}</span>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-linen-100/30 text-linen-100 opacity-0 transition-opacity group-hover:opacity-100">
                        <Maximize2 size={14} strokeWidth={1.5} />
                      </span>
                    </figcaption>
                  </div>
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <Lightbox
        isOpen={current !== null}
        onClose={() => setOpenIndex(null)}
        imageUrl={current?.image ?? ''}
        title={current?.title ?? ''}
        category={current?.categoryLabel}
        description={current ? `${current.caption}${current.attribution ? ` · ${current.attribution}` : ''}` : undefined}
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
