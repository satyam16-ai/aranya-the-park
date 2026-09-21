import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../common/Container';
import { Frame } from '../common/Frame';
import { Img } from '../common/Img';
import { ImageReveal } from '../common/ImageReveal';
import { SectionIntro } from '../common/SectionIntro';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

/** Slow vertical drift (±4%) tied to scroll; disabled for reduced motion. */
const useDrift = (from: string, to: string) => {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [from, to]);
  return [target, y] as const;
};

/**
 * Chapter — "The Arrival" and "40% Open Greens" as one brochure-style spread
 * on the sage surface. Replaces the pinned scroll story.
 */
export const Chapter: React.FC = () => {
  const [lobbyTarget, lobbyY] = useDrift('-4%', '4%');
  const [gardenTarget, gardenY] = useDrift('4%', '-4%');

  return (
    <section id="story" data-surface="sage" className="pinstripe overflow-hidden py-section">
      <Container size="showcase">
        {/* Row 1 — The Arrival */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Frame as="figure">
              <ImageReveal aspect="aspect-[4/3] lg:aspect-[3/2]">
                <motion.div ref={lobbyTarget} style={{ y: lobbyY }} className="-mt-[8%] h-[116%] w-full">
                  <Img
                    src="/assets/opt/render-grand-lobby-2000.webp"
                    alt="The double-height entrance lobby — Italian marble, oak panelling and a coffered ceiling"
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </ImageReveal>
              <figcaption className="t-micro mt-3 flex flex-wrap justify-between gap-2 px-1 text-fg-muted">
                <span>Double-height AC lobby · Italian marble</span>
                <span>Interiors: Kalpesh Makwana Design Studio</span>
              </figcaption>
            </Frame>
          </div>

          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="Chapter 01 · The Arrival"
              title={
                <>
                  Where space, air &amp; light <em>reclaim</em> their true meaning
                </>
              }
              lead="A sanctuary secluded from the city's cacophony, rising tall on Malad West's most prestigious boulevard — behind Evershine Mall, served by a private 18.3-metre approach to New Link Road."
            />
            <Reveal className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-6">
              <div>
                <p className="font-display text-3xl text-gold-300">18.3 m</p>
                <p className="t-micro mt-2 text-fg-muted">Private access boulevard</p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold-300">2 towers</p>
                <p className="t-micro mt-2 text-fg-muted">Sculpted, cross-ventilated plates</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Row 2 — 40% Open Greens */}
        <div className="mt-24 grid grid-cols-1 items-center gap-10 lg:mt-32 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <RevealGroup>
              <RevealItem as="div">
                <span className="t-eyebrow">Chapter 02 · Biophilic Sanctuary</span>
              </RevealItem>
              <RevealItem as="div" className="mt-6 flex items-end gap-4">
                <span className="t-stat t-foil">40%</span>
                <span className="t-micro pb-2 text-fg">
                  Open green
                  <br />
                  spaces
                </span>
              </RevealItem>
              <RevealItem as="div">
                <h2 className="t-h2 mt-6 text-fg">
                  A newer kind of luxury — <em>the lushury</em>
                </h2>
              </RevealItem>
              <RevealItem as="p" className="t-lead mt-5 text-fg-muted">
                While the world races behind fleeting luxuries, Aranya The Park introduces a calmer paradigm:
                life enriched by nature, scale and time. Over 40% of the estate is open landscape — sensory
                aroma lawns, shaded courtyards and reflexology trails curated by BeyondGreen.
              </RevealItem>
              <RevealItem as="div" className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-6">
                <div>
                  <p className="font-display text-3xl text-gold-300">11 ft</p>
                  <p className="t-micro mt-2 text-fg-muted">Ceiling clearance</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-gold-300">100%</p>
                  <p className="t-micro mt-2 text-fg-muted">Vastu-aligned planning</p>
                </div>
              </RevealItem>
            </RevealGroup>
          </div>

          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <Frame as="figure">
              <ImageReveal aspect="aspect-[4/3] lg:aspect-[3/2]">
                <motion.div ref={gardenTarget} style={{ y: gardenY }} className="-mt-[8%] h-[116%] w-full">
                  <Img
                    src="/assets/opt/render-aerial-towers-2327.webp"
                    alt="Aerial view of Towers A and B rising from a canopy of trees and landscaped greens"
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="h-full w-full object-cover object-[50%_45%]"
                  />
                </motion.div>
              </ImageReveal>
              <figcaption className="t-micro mt-3 px-1 text-right text-fg-muted">
                Towers A &amp; B amid the greens · Artist's impression
              </figcaption>
            </Frame>

            {/* Offset portrait inset */}
            <Reveal
              delay={0.2}
              className="absolute -bottom-10 -left-4 hidden w-[34%] shadow-xl lg:block"
            >
              <Frame className="bg-surface">
                <div className="aspect-[3/4] overflow-hidden">
                  <Img
                    src="/assets/opt/life-family-garden-2000.webp"
                    alt="A young family walking through the gardens"
                    sizes="20vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Frame>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
};
