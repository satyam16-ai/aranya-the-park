import React from 'react';
import { Compass, Building2, ShieldCheck, MapPin, ExternalLink, type LucideIcon } from 'lucide-react';
import { developerData } from '../../data/developerData';
import { projectData } from '../../data/projectData';
import { Card } from '../common/Card';
import { Container } from '../common/Container';
import { Frame } from '../common/Frame';
import { Img } from '../common/Img';
import { ImageReveal } from '../common/ImageReveal';
import { SectionIntro } from '../common/SectionIntro';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

const pillarIcons: LucideIcon[] = [Compass, Building2, ShieldCheck, MapPin];

/** Developer — Zaveri Realty × BKM Mindspace, consultants and MahaRERA, on linen. */
export const DeveloperTrust: React.FC = () => (
  <section id="developer" data-surface="linen" className="watermark overflow-hidden py-section">
    <Container size="showcase">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionIntro
            eyebrow="A project by"
            title={
              <>
                A legacy of <em>trust</em>, vision &amp; excellence
              </>
            }
            lead={developerData.narrative}
          />

          <Reveal className="mt-10">
            <Card className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <img
                src="/assets/branding/project-by-zaveri-bkm.png"
                alt={`Project by ${projectData.jointVenture}`}
                width={900}
                height={189}
                loading="lazy"
                className="h-14 w-auto sm:h-16"
              />
              <p className="t-micro text-fg-muted sm:text-right">
                {developerData.entity}
              </p>
            </Card>
          </Reveal>

          <RevealGroup as="ul" className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {developerData.pillars.map((p, i) => {
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <RevealItem as="li" key={p.title} className="flex items-start gap-4">
                  <span className="icon-ring">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="t-h3-ui text-fg">{p.title}</h3>
                    <p className="t-small mt-1.5 text-fg-muted">{p.description}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <div className="lg:col-span-6">
          <Frame as="figure">
            <ImageReveal aspect="aspect-[4/3] lg:aspect-[5/4]">
              <Img
                src="/assets/opt/life-lobby-arrival-2000.webp"
                alt="A couple walking through the entrance lobby"
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="h-full w-full object-cover"
              />
            </ImageReveal>
            <figcaption className="t-micro mt-3 px-1 text-fg-muted">Representative image</figcaption>
          </Frame>

          <Reveal className="mt-8">
            <Card>
              <div className="flex items-center gap-3 text-accent-text">
                <ShieldCheck size={18} strokeWidth={1.5} />
                <span className="t-micro">MahaRERA registered</span>
              </div>
              <p className="mt-3 font-mono text-lg tracking-[0.14em] text-fg">{projectData.mahaRera}</p>
              <a
                href={projectData.reraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-micro mt-3 inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
              >
                Verify on the MahaRERA portal <ExternalLink size={11} />
              </a>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* Consultants */}
      <Reveal className="mt-16 border-t border-rule pt-10 lg:mt-20">
        <span className="t-eyebrow">Project consultants</span>
        <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {developerData.consultants.map((c) => (
            <li key={c.role}>
              <p className="t-micro text-fg-muted">{c.role}</p>
              <p className="mt-1.5 font-sans text-sm font-medium text-fg">{c.name}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  </section>
);
