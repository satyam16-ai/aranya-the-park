import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { projectData } from '../../data/projectData';
import { Container } from '../common/Container';
import { Frame } from '../common/Frame';
import { Img } from '../common/Img';
import { ImageReveal } from '../common/ImageReveal';
import { SectionIntro } from '../common/SectionIntro';
import { Reveal } from '../common/Reveal';
import { EnquiryForm } from './EnquiryForm';
import { WHATSAPP_URL } from '../layout/StickyActionBar';

/** Enquiry — the closing conversion section on the sage surface. */
export const EnquiryCTA: React.FC = () => (
  <section id="enquiry" data-surface="sage" className="pinstripe overflow-hidden py-section">
    <Container>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionIntro
            eyebrow="Private preview"
            title={
              <>
                Begin your <em>Lushury</em> life
              </>
            }
            lead="Schedule a personalised walkthrough of the sample residences, the 3D spatial models and the rooftop decks with our relationship desk."
          />

          <Frame as="figure" className="mt-8">
            <ImageReveal aspect="aspect-[16/8]">
              <Img
                src="/assets/opt/life-sunset-terrace-2000.webp"
                alt="Two residents on a private sundeck at sunset"
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="h-full w-full object-cover object-[50%_45%]"
              />
            </ImageReveal>
            <figcaption className="t-micro mt-3 px-1 text-fg-muted">Private sundecks · Representative image</figcaption>
          </Frame>

          <Reveal as="ul" className="mt-8 space-y-5 border-t border-rule pt-8">
            <li className="flex items-center gap-4">
              <span className="icon-ring">
                <Phone size={17} strokeWidth={1.5} />
              </span>
              <div>
                <p className="t-micro text-fg-muted">Direct sales desk</p>
                <a href={projectData.phoneRaw} className="font-sans text-lg text-fg transition-colors hover:text-gold-300">
                  {projectData.phone}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="icon-ring">
                <MessageCircle size={17} strokeWidth={1.5} />
              </span>
              <div>
                <p className="t-micro text-fg-muted">Instant chat</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-sans text-lg text-fg transition-colors hover:text-gold-300">
                  WhatsApp concierge
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="icon-ring">
                <MapPin size={17} strokeWidth={1.5} />
              </span>
              <div>
                <p className="t-micro text-fg-muted">Experience centre</p>
                <p className="t-small mt-1 max-w-sm text-fg">{projectData.address}</p>
              </div>
            </li>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <Frame>
            <div data-surface="white" className="rounded-xs p-6 sm:p-8 lg:p-10">
              <h3 className="t-h3 text-fg">Request a private viewing</h3>
              <p className="t-small mt-2 text-fg-muted">Zero brokerage · direct developer desk · replies within working hours.</p>
              <EnquiryForm purpose="Private Viewing (section)" compact className="mt-7" />
            </div>
          </Frame>
        </Reveal>
      </div>
    </Container>
  </section>
);
