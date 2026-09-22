import React from 'react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export const Hallmarks: React.FC = () => {
  const highlights = [
    {
      value: '40%',
      title: 'OPEN GREEN SPACES',
      subtitle: 'Curated by BeyondGreen',
    },
    {
      value: '2 / 3 / 4 BHK',
      title: 'LUXURY RESIDENCES',
      subtitle: 'Up to 11 Ft. Floor Volumes',
    },
    {
      value: '18.3M',
      title: 'WIDE ACCESS ROAD',
      subtitle: 'Direct Link Road Connection',
    },
    {
      value: '150',
      title: 'GUEST BANQUET HALL',
      subtitle: 'Grand Celebration Pavilion',
    },
  ];

  return (
    <section
      id="highlights"
      className="section-spacing bg-forest-950 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-champagne-400/[0.03] rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="PROJECT HIGHLIGHTS"
          title="Architectural Scale & Natural Balance"
          align="center"
          theme="dark"
          className="mb-20 sm:mb-24"
        />

        {/* Typography-Led Statistics — Whitespace separation, no dividers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8 lg:gap-x-12 text-center">
          {highlights.map((item) => (
            <div key={item.title} className="space-y-3">
              <div className="font-serif text-5xl sm:text-6xl lg:text-7xl text-champagne-300 font-light tracking-tight leading-none">
                {item.value}
              </div>
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-cream-100 font-semibold">
                {item.title}
              </div>
              <p className="font-sans text-xs text-cream-300/40 font-light">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
