import React from 'react';
import { ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Container } from '../common/Container';
import { projectData } from '../../data/projectData';

interface FooterProps {
  onOpenFloorPlansModal?: () => void;
  onOpenLocationModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFloorPlansModal,
  onOpenLocationModal,
}) => {
  return (
    <footer className="bg-dark-950 text-ivory-muted pt-20 pb-28 lg:pb-16 font-sans text-xs border-t border-white/[0.08]">
      <Container>
        {/* Editorial Brand Statement Header */}
        <div className="pb-14 border-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/branding/aranya-crest.png"
              alt="Aranya Logo"
              className="h-12 w-12 object-contain shrink-0"
              loading="lazy"
            />
            <div>
              <img
                src="/assets/branding/aranya-wordmark-light.png"
                alt="Aranya The Park"
                width={2393}
                height={678}
                loading="lazy"
                className="h-12 sm:h-14 w-auto max-w-full object-contain block"
              />
              <span className="text-[10px] tracking-[0.35em] uppercase text-champagne-300 font-medium block mt-1">
                THE LUSHURY LIFE · MALAD WEST
              </span>
            </div>
          </div>
          <p className="font-serif text-lg sm:text-xl text-ivory/80 italic font-light max-w-md">
            "A parkside residence crafted for those who value volume, tranquility, and refined distinction."
          </p>
        </div>

        {/* 4-Column Editorial Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 py-14">
          {/* Col 1: Project Identity & MahaRERA */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              RERA Compliance
            </h4>
            <p className="text-ivory-muted text-xs leading-relaxed font-light">
              Aranya The Park is registered under MahaRERA as a luxury joint-venture residential estate.
            </p>
            <div className="p-3.5 rounded-[3px] bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-champagne-300 text-xs font-medium">
                <ShieldCheck size={14} className="text-champagne-400 shrink-0" />
                <span>MahaRERA Reg. No.</span>
              </div>
              <div className="font-mono text-[11px] text-ivory tracking-wider font-semibold">
                {projectData.mahaRera}
              </div>
              <a
                href={projectData.reraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] text-champagne-300 hover:text-champagne-200 transition-colors pt-1"
              >
                <span>Verify on MahaRERA Portal</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Col 2: Residences & Story */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              Story & Residences
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-muted font-light">
              <li>
                <a href="#story-arrival" className="hover:text-champagne-300 transition-colors">
                  Chapter 01 · Arrival
                </a>
              </li>
              <li>
                <a href="#story-greens" className="hover:text-champagne-300 transition-colors">
                  Chapter 02 · 40% Open Greens
                </a>
              </li>
              <li>
                <a href="#residences" className="hover:text-champagne-300 transition-colors">
                  Chapter 03 · 2, 3 & 4 BHK Residences
                </a>
              </li>
              <li>
                <a href="#virtual-tour" className="hover:text-champagne-300 transition-colors">
                  Chapter 04 · 3D Spatial Walkthrough
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-champagne-300 transition-colors">
                  Chapter 05 · Life Beyond Four Walls
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications & Plans */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              Plans & Location
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-muted font-light">
              <li>
                <a href="#location" className="hover:text-champagne-300 transition-colors">
                  Chapter 06 · Strategic Arterial Connectivity
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-champagne-300 transition-colors">
                  Chapter 07 · Signature Specifications
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenFloorPlansModal}
                  className="hover:text-champagne-300 transition-colors cursor-pointer text-left"
                >
                  Floor Plans Blueprint Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLocationModal}
                  className="hover:text-champagne-300 transition-colors cursor-pointer text-left"
                >
                  Location & Transit Map
                </button>
              </li>
              <li>
                <a href="#gallery" className="hover:text-champagne-300 transition-colors">
                  Curated Image Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Experience Center */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              Experience Center
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-champagne-400 shrink-0 mt-0.5" />
                <span className="text-ivory-muted leading-relaxed font-light">
                  {projectData.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-champagne-400 shrink-0" />
                <a
                  href={projectData.phoneRaw}
                  className="text-ivory hover:text-champagne-300 transition-colors font-medium"
                >
                  {projectData.phone}
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-ivory-muted/70 leading-relaxed font-light">
              <span>{projectData.developer}</span>
              <br />
              <span>Joint Venture: {projectData.jointVenture}</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-6 text-[10px] text-ivory-muted/50 leading-relaxed border-t border-white/[0.08]">
          <p>
            Disclaimer: The images, artist impressions, specifications, floor plans, dimensions, elevations, and features shown are conceptual and indicative only. Final layout and specifications are subject to approvals by competent planning authorities. MahaRERA Registration No.: <strong className="text-champagne-300/80">{projectData.mahaRera}</strong>, available on the official MahaRERA website (<a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noreferrer" className="text-champagne-400/70 hover:text-champagne-300 underline underline-offset-2 transition-colors">maharera.mahaonline.gov.in</a>).
          </p>
        </div>

        {/* Copyright & Sub-links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ivory-muted/60">
          <span>
            © {new Date().getFullYear()} Aranya The Park. All Rights Reserved.
          </span>
          <div className="flex items-center gap-4">
            <a href="#overview" className="hover:text-ivory transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#overview" className="hover:text-ivory transition-colors">Terms of Use</a>
            <span>•</span>
            <a href="#enquiry" className="hover:text-champagne-300 transition-colors">VIP Concierge</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
