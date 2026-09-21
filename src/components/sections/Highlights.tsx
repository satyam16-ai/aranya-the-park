import React from 'react';
import {
  Home,
  GlassWater,
  Car,
  Compass,
  DoorClosed,
  Coffee,
  Sparkles,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { projectData } from '../../data/projectData';
import { cn } from '../../lib/cn';
import { Container } from '../common/Container';
import { Img } from '../common/Img';
import { SectionIntro } from '../common/SectionIntro';
import { Stat } from '../common/Stat';
import { RevealGroup, RevealItem } from '../common/Reveal';

const icons: Record<string, LucideIcon> = {
  Home,
  GlassWater,
  Car,
  Compass,
  DoorClosed,
  Coffee,
  Sparkles,
  Trophy,
};

type Hallmark = (typeof projectData.hallmarks)[number];

/** A hallmark with a photo: the render fills the tile, copy sits on its darkened foot. */
const PhotoTile: React.FC<{ h: Hallmark; image: string; Icon: LucideIcon }> = ({ h, image, Icon }) => (
  <RevealItem
    as="li"
    className="group relative isolate min-h-[15rem] overflow-hidden rounded-sm sm:col-span-2 sm:min-h-[17rem]"
  >
    <Img
      src={image}
      alt={h.imageAlt ?? ''}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
      style={{ objectPosition: h.focus }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/45 via-45% to-forest-950/10" />
    <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
      <span className="icon-ring border-gold-300/60 text-gold-300">
        <Icon size={18} strokeWidth={1.5} />
      </span>
      <h3 className="t-h3-ui mt-4 text-linen-100">{h.title}</h3>
      <p className="t-small mt-1.5 max-w-md text-linen-300">{h.description}</p>
    </div>
  </RevealItem>
);

/** A hallmark without a photo: icon up top, copy anchored to the foot so rows align. */
const IconTile: React.FC<{ h: Hallmark; Icon: LucideIcon }> = ({ h, Icon }) => (
  <RevealItem
    as="li"
    className="flex flex-col gap-5 rounded-sm border border-card-border bg-card p-6 sm:min-h-[17rem] sm:justify-between sm:gap-0 sm:p-7"
  >
    <span className="icon-ring">
      <Icon size={18} strokeWidth={1.5} />
    </span>
    <div>
      <h3 className="t-h3-ui text-fg">{h.title}</h3>
      <p className="t-small mt-1.5 text-fg-muted">{h.description}</p>
    </div>
  </RevealItem>
);

/**
 * Highlights — the four headline numbers, then the eight hallmarks as a bento
 * of renders and icon tiles (photo tiles span two columns), on white.
 */
export const Highlights: React.FC = () => (
  <section id="highlights" data-surface="white" className="watermark overflow-hidden py-section">
    <Container>
      <SectionIntro
        eyebrow="Why Aranya"
        title={
          <>
            A parkside address of <em>uncommon</em> proportion
          </>
        }
        lead={projectData.tagline + ' — where architecture, wellness and lush open greens converge, three minutes from the metro.'}
      />

      {/* Stats */}
      <RevealGroup
        as="ul"
        className="mt-14 grid grid-cols-2 gap-y-10 border-y border-rule py-10 lg:grid-cols-4 lg:gap-y-0"
        aria-label="Project highlights"
      >
        {projectData.stats.map((s, i) => (
          <RevealItem
            as="li"
            key={s.label}
            className={i > 0 ? 'lg:border-l lg:border-rule lg:pl-10' : ''}
          >
            <Stat value={s.value} label={s.label} subtext={s.subtext} size="md" />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Hallmarks bento */}
      <RevealGroup
        as="ul"
        className={cn(
          'mt-12 grid grid-cols-1 gap-4 sm:grid-flow-dense sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'
        )}
        staggerChildren={0.06}
      >
        {projectData.hallmarks.map((h) => {
          const Icon = icons[h.icon] ?? Sparkles;
          return h.image ? (
            <PhotoTile key={h.id} h={h} image={h.image} Icon={Icon} />
          ) : (
            <IconTile key={h.id} h={h} Icon={Icon} />
          );
        })}
      </RevealGroup>
    </Container>
  </section>
);
