import React from 'react';
import { ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Container } from '../common/Container';
import { projectData } from '../../data/projectData';

export const Footer: React.FC = () => {
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
              <span className="text-[10px] tracking-[0.18em] uppercase text-champagne-300 font-medium block mt-1 whitespace-nowrap">
                THE LUSHURY LIFE · MALAD WEST
              </span>
            </div>
          </div>
          <p className="font-serif text-lg sm:text-xl text-ivory/80 italic font-light max-w-md">
            "A serene metropolitan address, where life is lush with open greens and generous with space."
          </p>
        </div>

        {/* Editorial footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 py-14">
          {/* Col 1: MahaRERA compliance */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              MahaRERA Registration
            </h4>
            <p className="text-ivory-muted text-xs leading-relaxed font-light">
              Aranya The Park is a MahaRERA-registered project. Scan the code to view its registration.
            </p>
            <div className="p-3.5 rounded-[3px] bg-white/[0.03] border border-white/[0.08] flex items-start gap-4">
              <a
                href={projectData.reraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-[3px] bg-white p-1.5 transition-opacity hover:opacity-80"
              >
                <img
                  src="/assets/rera-qr.png"
                  alt="Scan to verify this project on the MahaRERA portal"
                  width={360}
                  height={360}
                  loading="lazy"
                  className="h-16 w-16"
                />
              </a>
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 text-champagne-300 text-xs font-medium">
                  <ShieldCheck size={14} className="text-champagne-400 shrink-0" />
                  <span>MahaRERA Registered</span>
                </div>
                <a
                  href={projectData.reraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] text-champagne-300 hover:text-champagne-200 transition-colors"
                >
                  <span>Scan or verify on the MahaRERA portal</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Experience Center */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold">
              Site Address
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
            <a href="#enquiry" className="hover:text-champagne-300 transition-colors">Enquire</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
