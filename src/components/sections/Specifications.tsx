import React from 'react';
import { specificationsData } from '../../data/specificationsData';
import { Container } from '../common/Container';
import { Frame } from '../common/Frame';
import { Img } from '../common/Img';
import { ImageReveal } from '../common/ImageReveal';
import { SectionIntro } from '../common/SectionIntro';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

/** Material swatches: tight crops of the renders — focal point + zoom, no extra files. */
const swatches = [
  { label: 'Italian marble', src: '/assets/opt/render-grand-lobby-2000.webp', focus: '52% 96%', zoom: 2.4 },
  { label: 'Oak panelling', src: '/assets/opt/render-grand-lobby-2000.webp', focus: '9% 42%', zoom: 2.6 },
  { label: 'Glass & steel', src: '/assets/opt/render-entrance-drive-2000.webp', focus: '44% 38%', zoom: 2 },
  { label: 'Curated greens', src: '/assets/opt/render-fitness-pavilion-2000.webp', focus: '28% 84%', zoom: 2.2 },
  { label: 'Skyline views', src: '/assets/opt/render-gym-2000.webp', focus: '80% 30%', zoom: 2.2 },
];

/** Specifications — every category as one editorial list on the champagne surface. */
export const Specifications: React.FC = () => (
  <section id="specifications" data-surface="gold" className="botanical overflow-hidden py-section">
    <Container>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              eyebrow="Chapter 06 · Specifications"
              title={
                <>
                  Built to <em>endure</em>
                </>
              }
              lead="Essential architectural parameters, fittings and engineering hallmarks — from Grohe fittings to an earthquake-resistant RCC frame."
            />
            <Reveal className="mt-8">
              <span className="t-micro text-fg-muted">Materials &amp; finishes</span>
              <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
                {swatches.map((sw) => (
                  <li key={sw.label}>
                    <div className="aspect-square overflow-hidden rounded-xs border border-rule">
                      <Img
                        src={sw.src}
                        alt=""
                        aria-hidden="true"
                        sizes="(min-width: 1024px) 7vw, 18vw"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: sw.focus, transform: `scale(${sw.zoom})`, transformOrigin: sw.focus }}
                      />
                    </div>
                    <p className="mt-2 font-sans text-[0.6875rem] font-medium leading-snug text-fg-muted">{sw.label}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Frame as="figure" className="mt-10 hidden lg:block">
              <ImageReveal aspect="aspect-[4/5]">
                <Img
                  src="/assets/opt/render-entrance-drive-2000.webp"
                  alt="The glazed entrance and porte-cochère"
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="h-full w-full object-cover object-[72%_50%]"
                />
              </ImageReveal>
              <figcaption className="t-micro mt-3 px-1 text-fg-muted">Entrance & porte-cochère · artist's impression</figcaption>
            </Frame>
          </div>
        </div>

        <div className="lg:col-span-7">
          <RevealGroup as="div" className="divide-y divide-rule" staggerChildren={0.06}>
            {specificationsData.map((cat, i) => (
              <RevealItem as="div" key={cat.category} className="py-8 first:pt-0 last:pb-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl text-accent-text tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="t-h3 text-fg">{cat.category}</h3>
                </div>
                <dl className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                  {cat.items.map((item) => (
                    <div key={item.feature} className="border-l border-rule pl-4">
                      <dt className="t-micro text-fg-muted">{item.feature}</dt>
                      <dd className="mt-1 text-[0.9375rem] text-fg">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Container>
  </section>
);
