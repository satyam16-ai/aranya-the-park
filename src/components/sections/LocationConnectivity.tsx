import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Map, TrainFront, ShoppingBag, GraduationCap, HeartPulse, type LucideIcon } from 'lucide-react';
import { locationCategories, locationMosaic, locationNodes, infrastructureProjects } from '../../data/locationData';
import { projectData } from '../../data/projectData';
import { cn } from '../../lib/cn';
import { Button } from '../common/Button';
import { Container } from '../common/Container';
import { Frame } from '../common/Frame';
import { Img } from '../common/Img';
import { SectionIntro } from '../common/SectionIntro';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

interface LocationConnectivityProps {
  onOpenLocationModal: (category?: string) => void;
}

const icons: Record<string, LucideIcon> = { TrainFront, ShoppingBag, GraduationCap, HeartPulse };

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Aranya The Park, Behind Evershine Mall, Mindspace, Malad West, Mumbai 400064');

/** Location — the brochure's "next-door conveniences" spread, driven by locationData. */
export const LocationConnectivity: React.FC<LocationConnectivityProps> = ({ onOpenLocationModal }) => {
  const [open, setOpen] = useState<string>('connectivity');

  return (
    <section id="location" data-surface="white" className="watermark overflow-hidden py-section">
      <Container size="showcase">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Mosaic */}
          <Reveal className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {locationMosaic.map((m, i) => (
                <div
                  key={m.src}
                  className={cn(
                    'relative overflow-hidden rounded-xs',
                    m.span === 'wide' ? 'col-span-2 aspect-[2/1] sm:aspect-[16/9]' : 'aspect-square',
                    i === 3 && 'hidden sm:block'
                  )}
                >
                  <Img
                    src={m.src}
                    alt={m.alt}
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              {/* Boulevard callout tile */}
              <div data-surface="sage" className="flex aspect-square flex-col justify-between rounded-xs p-4 sm:p-5">
                <span className="t-micro text-gold-300">Direct access</span>
                <div>
                  <p className="font-display text-3xl leading-none text-linen-100 sm:text-4xl">18.3 m</p>
                  <p className="t-micro mt-2 text-linen-300">Private boulevard to New Link Road</p>
                </div>
              </div>
            </div>
            <p className="t-micro mt-3 text-fg-muted">Representative images</p>
          </Reveal>

          {/* Categories */}
          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="Chapter 05 · Location"
              title={
                <>
                  The comfort of <em>next-door</em> conveniences
                </>
              }
              lead="Behind Evershine Mall and Mindspace, three minutes from Malad West metro, with the Western Express Highway and the airport a straight run away."
            />

            <RevealGroup as="ul" className="mt-10 divide-y divide-rule border-y border-rule">
              {locationCategories.map((cat) => {
                const Icon = icons[cat.icon];
                const nodes = locationNodes.filter((n) => n.category === cat.id);
                const expanded = open === cat.id;
                return (
                  <RevealItem as="li" key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? '' : cat.id)}
                      aria-expanded={expanded}
                      aria-controls={`loc-${cat.id}`}
                      className="flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span className="icon-ring">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <span className="t-h3-ui flex-1 text-fg">{cat.label}</span>
                      <span className="t-micro text-fg-muted">{nodes.length} places</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.5}
                        className={cn('text-fg-muted transition-transform duration-300', expanded && 'rotate-180')}
                      />
                    </button>
                    <div
                      id={`loc-${cat.id}`}
                      className={cn(
                        'grid transition-[grid-template-rows] duration-400 ease-luxe',
                        expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      )}
                    >
                      <ul className="overflow-hidden">
                        {nodes.map((n) => (
                          <li key={n.id} className="flex items-baseline gap-3 py-1.5 pl-[3.75rem] text-sm">
                            <span className={cn('flex-1', n.highlight ? 'text-fg' : 'text-fg-muted')}>{n.name}</span>
                            <span className="flex-1 border-b border-dotted border-rule" aria-hidden="true" />
                            <span className="font-sans font-medium tabular-nums text-fg">{n.time}</span>
                          </li>
                        ))}
                        <li className="h-4" aria-hidden="true" />
                      </ul>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="secondary" icon={<Map size={14} />} onClick={() => onOpenLocationModal('connectivity')}>
                Explore the map
              </Button>
              <Button variant="ghost" href={MAPS_URL} target="_blank" rel="noopener noreferrer" icon={<ExternalLink size={12} />}>
                Get directions
              </Button>
            </Reveal>
            <p className="t-micro mt-6 text-fg-muted">{projectData.address}</p>
          </div>
        </div>

        {/* Infrastructure */}
        <RevealGroup as="ul" className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {infrastructureProjects.map((p) => (
            <RevealItem as="li" key={p.id}>
              <Frame className="h-full">
                <div className="p-4">
                  <span className="t-micro text-accent-text">{p.status}</span>
                  <h3 className="t-h3-ui mt-2 text-fg">{p.name}</h3>
                  <p className="t-small mt-2 text-fg-muted">{p.benefit}</p>
                </div>
              </Frame>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
};
