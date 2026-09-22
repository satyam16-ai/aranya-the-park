import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  FileCheck,
} from 'lucide-react';
import { Container } from '../common/Container';
import { developerData } from '../../data/developerData';
import { projectData } from '../../data/projectData';

interface DeveloperTrustProps {
  onOpenLightbox?: (
    url: string,
    title: string,
    description?: string,
    category?: string
  ) => void;
  onOpenLeadModal?: (purpose: string, config?: string) => void;
}

/**
 * DeveloperTrust — Official Client-Approved Branding & Developer Heritage Section.
 * Features:
 * 1. Visual transition to Brand Heritage with subtle organic ambience.
 * 2. High-editorial 2-column spread inspired by the official brochure:
 *    - Left: Twilight skyline photograph showing gentleman on sky deck overlooking the city.
 *    - Right: Warm champagne/beige editorial card (#BFA370) with 100% text-free organic pattern,
 *      official Aranya logo lockup, headline "A legacy of trust, Excellence & commitment.",
 *      brochure narrative preserving "The Lushury Life", and developer entity.
 * 3. Official PROJECT BY Partner Branding:
 *    - Renders the actual client-supplied partner logo artwork:
 *      [ ZAVERI REALTY ] × [ BKM MINDSPACE ]
 * 4. MahaRERA Regulatory Authority:
 *    - Precise regulatory title: "MAHARERA REGISTERED"
 *    - Registration number: P51800011594
 *    - Official CTA: "VERIFY ON OFFICIAL MAHARERA PORTAL"
 * 5. Trusted Technical Consortium partners.
 */
export const DeveloperTrust: React.FC<DeveloperTrustProps> = ({ onOpenLeadModal, onOpenLightbox }) => {
  return (
    <section
      id="developer"
      className="section-spacing bg-dark-900 relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* Subtle ambient luxury glow */}
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-champagne-400/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase" className="relative z-10">
        {/* Section Pre-title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-300 font-medium block mb-3">
            DEVELOPER HERITAGE & PARTNERSHIP
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-ivory font-light tracking-tight">
            A Legacy of Trust, Vision & Excellence
          </h2>
        </div>

        {/* ─── Main Editorial Brand Spread (Inspired by Brochure Page 29) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] mb-14 sm:mb-16">
          
          {/* Left Column: Architectural Skyline Editorial (Twilight View from Sky Deck) */}
          <div
            className="lg:col-span-6 relative min-h-[420px] sm:min-h-[540px] lg:min-h-[720px] bg-dark-950 overflow-hidden flex flex-col justify-between group/img cursor-zoom-in"
            onClick={() =>
              onOpenLightbox?.(
                '/assets/branding/skyline-editorial.jpg',
                'Aranya The Park — Skyline Perspective',
                developerData.narrative,
                'Developer Partnership'
              )
            }
          >
            <img
              src="/assets/branding/skyline-editorial.jpg"
              alt="Aranya The Park — Skyline Perspective & Developer Partnership"
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] group-hover/img:scale-105 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            {/* Subtle atmospheric gradient over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/30" />

            {/* Top Badge: Official Partnership */}
            <div className="relative z-10 p-6 sm:p-8">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-dark-950/75 backdrop-blur-md border border-white/10 text-[10px] font-sans font-medium tracking-[0.22em] text-champagne-300 uppercase">
                STRATEGIC ALLIANCE
              </span>
            </div>

            {/* Bottom Caption inside image */}
            <div className="relative z-10 p-6 sm:p-8 backdrop-blur-sm bg-gradient-to-t from-dark-950/90 to-transparent">
              <span className="font-serif text-sm sm:text-base text-ivory/90 font-light block">
                Zaveri Realty × BKM Mindspace
              </span>
              <span className="text-[10px] font-sans tracking-[0.25em] text-ivory-muted uppercase block mt-1">
                Elevating Mumbai's Skyline with Structural Longevity
              </span>
            </div>
          </div>

          {/* Right Column: Warm Champagne / Beige Editorial Branding Card */}
          <div className="lg:col-span-6 relative bg-[#BFA370] text-[#1D1B16] p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden">
            {/* Subtle organic botanical pattern overlay (pure decorative texture, 100% text-free) */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-repeat"
              style={{ backgroundImage: `url('/assets/branding/botanical-pattern.jpg')`, backgroundSize: '400px auto' }}
            />

            <div className="relative z-10 space-y-6 sm:space-y-8">
              {/* Official Aranya Brand Lockup: Crest + Typography */}
              <div className="flex flex-col items-start gap-4 pb-2 border-b border-[#1D1B16]/15">
                <img
                  src="/assets/branding/aranya-logo.png"
                  alt="Aranya The Park Official Logo"
                  className="h-28 sm:h-32 w-auto object-contain drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Headline from brochure */}
              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1B3636] font-normal tracking-tight leading-snug">
                  A legacy of trust,<br />
                  <span className="text-[#1D1B16] font-semibold">Excellence & commitment.</span>
                </h3>
              </div>

              {/* Exact Brochure Narrative preserving "The Lushury Life" */}
              <p className="font-serif text-sm sm:text-base text-[#2C2820] leading-relaxed sm:leading-loose font-normal">
                Zaveri Realty and BKM Mindspace bring together their collective expertise to present{' '}
                <strong className="font-semibold text-[#181612]">The Lushury Life</strong>, a landmark development built on the pillars of trust, vision, and excellence. This partnership reflects a commitment to upholding the highest standards of design, construction, and reliability, offering an impeccable investment for residents today and for generations to come.
              </p>

              {/* Developer Entity Statement */}
              <div className="pt-2">
                <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#3D372B] font-semibold block mb-1">
                  DEVELOPER ENTITY
                </span>
                <p className="font-serif text-sm sm:text-base text-[#181612] font-medium">
                  {developerData.entity}
                </p>
              </div>
            </div>

            {/* Bottom Action inside beige card */}
            {onOpenLeadModal && (
              <div className="relative z-10 pt-8 mt-6 border-t border-[#1D1B16]/15 flex items-center justify-between">
                <button
                  onClick={() => onOpenLeadModal('Connect with Developer Desk', 'Developer Trust')}
                  className="btn-lux px-6 py-3 rounded-full bg-[#181612] hover:bg-[#2B271F] text-[#F4EFE6] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer select-none"
                >
                  Connect with Developer Desk
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Official Developer Partnership: PROJECT BY ZAVERI REALTY × BKM MINDSPACE ─── */}
        <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/[0.08] mb-14 sm:mb-16 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-300 font-semibold block">
              PROJECT BY
            </span>
            <div className="w-16 h-[1px] bg-champagne-400/40 mx-auto" />
          </div>

          {/* Actual Client-Provided Partner Logo Artwork */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20 py-4">
            {/* Zaveri Realty Logo */}
            <div className="flex items-center justify-center p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-champagne-400/40 transition-all duration-300 w-full max-w-[320px]">
              <img
                src="/assets/branding/zaveri-realty-logo.png"
                alt="Zaveri Realty"
                className="h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>

            {/* Elegant Divider */}
            <div className="font-serif text-xl sm:text-2xl text-champagne-300/60 font-light select-none">
              ×
            </div>

            {/* BKM Mindspace Logo */}
            <div className="flex items-center justify-center p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-champagne-400/40 transition-all duration-300 w-full max-w-[320px]">
              <img
                src="/assets/branding/bkm-mindspace-logo.png"
                alt="BKM Mindspace"
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>

          <p className="font-serif text-xs sm:text-sm text-ivory-muted/75 font-light tracking-wide max-w-2xl mx-auto">
            A distinguished joint partnership dedicated to uncompromised construction excellence, biophilic spatial planning, and timely project delivery in Mumbai.
          </p>
        </div>

        {/* ─── Statutory MahaRERA & Technical Consortium (Brochure Page 30) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: MahaRERA Statutory Verification Card */}
          <div className="lg:col-span-5 glass-panel p-8 sm:p-10 text-center flex flex-col justify-between rounded-xl border border-white/[0.08] space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-champagne-300">
              <ShieldCheck size={28} />
            </div>
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-medium block mb-2">
                STATUTORY REGISTRATION
              </span>
              <h4 className="font-serif text-2xl text-ivory font-light">MAHARERA REGISTERED</h4>
              <div className="mt-3">
                <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70 block mb-1">
                  Registration No.
                </span>
                <div className="inline-block px-5 py-2.5 bg-white/[0.04] border border-white/[0.1] font-mono text-sm sm:text-base text-champagne-300 font-semibold rounded-[4px] tracking-wider">
                  {projectData.mahaRera}
                </div>
              </div>
            </div>
            <a
              href={projectData.reraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lux w-full py-3.5 px-4 bg-champagne-400 hover:bg-champagne-300 text-dark-950 font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 rounded-full shadow-[0_4px_20px_rgba(200,169,107,0.25)] hover:shadow-[0_6px_25px_rgba(200,169,107,0.35)]"
            >
              <FileCheck size={15} />
              <span>VERIFY ON OFFICIAL MAHARERA PORTAL</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Right: Technical Consortium Partners (Brochure Page 30) */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-xl border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-medium">
                  TRUSTED TECHNICAL PARTNERS
                </span>
                <span className="text-[10px] font-mono text-ivory-muted/60 tracking-wider">
                  STATUTORY CONSORTIUM
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {developerData.consultants.slice(0, 6).map((partner) => (
                  <div
                    key={partner.name}
                    className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:border-champagne-400/30 transition-colors"
                  >
                    <span className="text-[9px] font-sans uppercase tracking-widest text-champagne-300/80 block mb-0.5 font-medium">
                      {partner.role}
                    </span>
                    <p className="font-serif text-sm text-ivory font-light">
                      {partner.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] font-sans text-ivory-muted/60 pt-6 mt-4 border-t border-white/[0.06] font-light leading-relaxed">
              Executed with leading municipal and structural engineering teams ensuring seismic integrity, biophilic landscape execution, and seamless statutory transparency.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
