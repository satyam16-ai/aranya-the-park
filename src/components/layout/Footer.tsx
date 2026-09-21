import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Container } from '../common/Container';
import { projectData } from '../../data/projectData';

interface FooterProps {
  onOpenFloorPlansModal: () => void;
  onOpenLocationModal: () => void;
}

const explore = [
  { label: 'Overview', href: '#overview' },
  { label: 'Residences', href: '#residences' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Location', href: '#location' },
  { label: 'Specifications', href: '#specifications' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Developer', href: '#developer' },
];

const linkClass = 't-small text-linen-400 transition-colors hover:text-gold-300';

export const Footer: React.FC<FooterProps> = ({ onOpenFloorPlansModal, onOpenLocationModal }) => (
  <footer data-surface="deepest" className="relative pb-28 pt-16 lg:pb-14 lg:pt-20">
    <Container>
      {/* Brand row */}
      <div className="flex flex-col gap-10 border-b border-rule pb-12 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/assets/branding/aranya-crest-144.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0"
            loading="lazy"
          />
          <div>
            <img
              src="/assets/branding/aranya-wordmark-light-480.png"
              alt="Aranya The Park"
              width={480}
              height={136}
              loading="lazy"
              className="h-12 w-auto sm:h-14"
            />
            <p className="t-micro mt-2 text-gold-300">The Lushury Life · Malad West</p>
          </div>
        </div>
        <div className="md:text-right">
          <img
            src="/assets/branding/project-by-zaveri-bkm-light.png"
            alt={`Project by ${projectData.jointVenture}`}
            width={900}
            height={189}
            loading="lazy"
            className="h-12 w-auto md:ml-auto"
          />
        </div>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div>
          <h4 className="t-micro mb-5 text-linen-100">Explore</h4>
          <ul className="space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="t-micro mb-5 text-linen-100">Plans &amp; Location</h4>
          <ul className="space-y-2.5">
            <li>
              <button type="button" onClick={onOpenFloorPlansModal} className={linkClass}>
                Floor plan explorer
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenLocationModal} className={linkClass}>
                Location &amp; transit map
              </button>
            </li>
            <li>
              <a href="#residences" className={linkClass}>
                3D walkthroughs
              </a>
            </li>
            <li>
              <a href="#enquiry" className={linkClass}>
                Book a private viewing
              </a>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="t-micro mb-5 text-linen-100">Experience centre</h4>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-400" />
              <span className="t-small text-linen-400">{projectData.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} strokeWidth={1.5} className="shrink-0 text-gold-400" />
              <a href={projectData.phoneRaw} className="t-small text-linen-100 transition-colors hover:text-gold-300">
                {projectData.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} strokeWidth={1.5} className="shrink-0 text-gold-400" />
              <a href={`mailto:${projectData.emailPlaceholder}`} className="t-small text-linen-100 transition-colors hover:text-gold-300">
                {projectData.emailPlaceholder}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="t-micro mb-5 text-linen-100">MahaRERA</h4>
          <div className="rounded-sm border border-card-border bg-card p-4">
            <div className="flex items-center gap-2 text-gold-300">
              <ShieldCheck size={16} strokeWidth={1.5} />
              <span className="t-micro">Registration no.</span>
            </div>
            <p className="mt-2 font-mono text-sm tracking-[0.12em] text-linen-100">{projectData.mahaRera}</p>
            <a
              href={projectData.reraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-micro mt-3 inline-flex items-center gap-1.5 text-linen-400 transition-colors hover:text-gold-300"
            >
              Verify on MahaRERA <ExternalLink size={11} />
            </a>
          </div>
          <p className="t-small mt-4 text-linen-500">
            {projectData.developer}
            <br />
            Joint venture: {projectData.jointVenture}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-rule pt-6">
        <p className="text-[0.75rem] leading-relaxed text-linen-500">
          Disclaimer: Images, artist impressions, specifications, floor plans, dimensions, elevations and features shown are
          conceptual and indicative only. Photographs marked "representative" are stock imagery. Final layout and
          specifications are subject to approvals by competent planning authorities. MahaRERA Registration No.{' '}
          <span className="text-linen-300">{projectData.mahaRera}</span>, available at{' '}
          <a
            href={projectData.reraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-gold-300"
          >
            maharera.mahaonline.gov.in
          </a>
          .
        </p>
        <div className="mt-5 flex flex-col items-start justify-between gap-3 text-[0.75rem] text-linen-500 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Aranya The Park. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span aria-disabled="true" className="cursor-not-allowed">
              Privacy policy
            </span>
            <span aria-hidden="true">·</span>
            <span aria-disabled="true" className="cursor-not-allowed">
              Terms of use
            </span>
          </div>
        </div>
      </div>
    </Container>
  </footer>
);
