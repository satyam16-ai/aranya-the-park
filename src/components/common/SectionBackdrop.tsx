import React from 'react';
import { Img } from './Img';

/** Topographic rings for the lower-left corner, drawn once at load. */
const CONTOURS = Array.from({ length: 9 }, (_, k) => {
  const pts: string[] = [];
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const r = 64 + k * 36 + 15 * Math.sin(3 * t + k * 0.55) + 8 * Math.sin(5 * t + 1.3 + k * 0.35);
    pts.push(`${(150 + r * 1.4 * Math.cos(t)).toFixed(1)} ${(560 + r * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
});

/**
 * Gold strands drifting up across the section, like the fine veins in the
 * client's 26-09 sample. Each rides the same rising diagonal at an uneven
 * offset, with its own slow wave, so neighbours bunch, part and cross rather
 * than hatch. They run above the contour rings so the two never mesh.
 */
const STRAND_OFFSETS = [0, 26, 70, 88, 150, 176, 238, 300];
const STRANDS = STRAND_OFFSETS.map((offset, k) => {
  const amp = 22 + ((k * 37) % 5) * 11;
  const wave = 300 + ((k * 53) % 7) * 34;
  const phase = k * 1.7;
  const pts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const x = -100 + (i / 48) * 1800;
    const y = 520 - x * 0.36 - offset + amp * Math.sin(x / wave + phase);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join('L')}`;
});

/**
 * SectionBackdrop — the forest backdrop every section below the hero shares.
 *
 * First drawn for "Life Beyond Four Walls" (the client's 26-09 reference) and
 * carried to the rest of the page at their request: a green glow, contour
 * rings in the lower left and fine gold strands across the whole section. The
 * monstera leaves in the top-right corner are Amenities' alone (client, 27-09),
 * so they are opt-in. It paints behind the content, so the section needs
 * `relative isolate`. Every piece is capped in size, so a tall section gets
 * the same composition across its first screen as a one-screen section does.
 */
export const SectionBackdrop: React.FC<{ leaves?: boolean }> = ({ leaves = false }) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_30%,#0e2a1f_0%,rgba(7,21,16,0)_72%)]" />
    {leaves && (
      <Img
        src="/assets/opt/decor-monstera-leaves-2000.webp"
        alt=""
        sizes="50vw"
        loading="lazy"
        decoding="async"
        className="absolute right-0 top-0 h-[380px] w-[75%] object-cover object-[35%_45%] opacity-45 brightness-[1.3] saturate-[1.1] [mask-image:radial-gradient(ellipse_100%_100%_at_100%_0%,#000_30%,transparent_74%)] lg:h-[min(64%,620px)] lg:w-[46%] lg:opacity-90"
      />
    )}
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-x-0 top-0 h-[min(100%,1000px)] w-full text-champagne-400/[0.24] [mask-image:linear-gradient(90deg,transparent_0%,#000_14%,#000_86%,transparent_100%)]"
    >
      {STRANDS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
    <svg
      viewBox="0 0 760 700"
      preserveAspectRatio="xMinYMax slice"
      className="absolute bottom-0 left-0 h-[min(62%,640px)] w-[46%] text-champagne-400/[0.12]"
    >
      {CONTOURS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  </div>
);
