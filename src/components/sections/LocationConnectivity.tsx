import React from 'react';
import {
  MapPin,
  Train,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Plane,
  Maximize2,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { projectData } from '../../data/projectData';

interface LocationConnectivityProps {
  onOpenModal?: (category?: string) => void;
}

const keyArterials = [
  { label: 'MALAD WEST', detail: 'Prime Pin Code 400064', note: 'Direct Boulevard Access' },
  { label: 'NEW LINK ROAD', detail: '18.3-Metre Boulevard', note: 'Behind Evershine Mall' },
  { label: 'METRO 2A', detail: '4 Minutes', note: 'D.N. Nagar to Dahisar' },
  { label: 'WESTERN EXPRESS', detail: '12 Minutes', note: 'Arterial North-South Spine' },
  { label: 'AIRPORT', detail: 'CSMIA Terminal', note: 'Seamless Highway Corridor' },
];

const transitHighlights = [
  { icon: Train, label: 'Metro 2A', time: '4 min', note: 'D.N. Nagar Station' },
  { icon: ShoppingBag, label: 'Inorbit Mall', time: '6 min', note: 'Retail & Dining' },
  { icon: MapPin, label: 'Mindspace', time: '2 min', note: 'IT Business Hub' },
  { icon: GraduationCap, label: 'Ryan Intl.', time: '5 min', note: 'Top School' },
  { icon: HeartPulse, label: 'Kokilaben', time: '8 min', note: 'Super-Specialty' },
  { icon: Plane, label: 'WEH / Airport', time: '12 min', note: 'Express Transit' },
];

export const LocationConnectivity: React.FC<LocationConnectivityProps> = ({
  onOpenModal,
}) => {
  const handleLaunchModal = (category: string = 'all') => {
    if (onOpenModal) {
      onOpenModal(category);
    }
  };

  return (
    <section id="location" className="section-spacing bg-dark-900 text-ivory relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-champagne-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Container size="showcase">
        {/* Chapter Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.4em] text-champagne-300 font-medium block mb-5">
            STRATEGIC CONVERGENCE
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ivory uppercase mb-6 leading-[1.05]">
            Connected to<br />Everything That Matters
          </h2>
          <p className="font-sans text-sm sm:text-base text-ivory-muted font-light max-w-2xl mx-auto leading-relaxed">
            Positioned behind Evershine Mall and Mindspace, serviced by a dedicated 18.3-metre grand boulevard connecting directly to New Link Road.
          </p>
        </div>

        {/* ─── Progressive Arterial Reveal Strip ─── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-14">
          {keyArterials.map((arterial) => (
            <div
              key={arterial.label}
              className="glass-panel p-4 rounded-[4px] text-center space-y-1 hover:border-champagne-400/30 transition-colors"
            >
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-champagne-300 font-bold block">
                {arterial.label}
              </span>
              <span className="font-serif text-sm text-ivory font-light block">
                {arterial.detail}
              </span>
              <span className="font-sans text-[10px] text-ivory-muted/60 block">
                {arterial.note}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Transit Highlights Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {transitHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center space-y-2.5 p-5 glass-panel-subtle rounded-[4px] hover:border-champagne-400/30 transition-all cursor-default"
              >
                <div className="w-10 h-10 mx-auto rounded-full glass-control flex items-center justify-center text-champagne-400">
                  <Icon size={17} />
                </div>
                <div>
                  <span className="block font-serif text-2xl font-light text-champagne-300">{item.time}</span>
                  <span className="block text-xs font-sans text-ivory font-medium mt-0.5">{item.label}</span>
                  <span className="block text-[10px] font-sans text-ivory-muted/60 mt-0.5">{item.note}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Infrastructure Narrative & Modal Triggers ─── */}
        <div className="glass-panel p-6 sm:p-10 lg:p-12 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-12 space-y-6">
              <div>
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block">
                  Suburban Epicenter
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                  Serviced by an 18.3-Metre Grand Boulevard
                </h3>
              </div>

              <p className="font-sans text-sm text-ivory-muted leading-relaxed font-light">
                Direct arterial access to New Link Road guarantees swift passage without commercial traffic friction. Integrated with upcoming infrastructure catalysts like the Coastal Road extension and GMLR corridor.
              </p>

              {/* Category Links */}
              <div className="space-y-2.5 pt-2">
                {[
                  { cat: 'transit', label: 'Transit & Metro Hubs', sub: 'Metro 2A, WEH, Link Road' },
                  { cat: 'education', label: 'Schools & Colleges', sub: 'Ryan Intl., Witty Intl., NM College' },
                  { cat: 'healthcare', label: 'Super-Specialty Hospitals', sub: 'Kokilaben, Holy Spirit, Criticare' },
                ].map((item) => (
                  <button
                    key={item.cat}
                    onClick={() => handleLaunchModal(item.cat)}
                    className="w-full p-3.5 glass-control hover:border-champagne-400/40 transition-all cursor-pointer flex items-center justify-between group/item rounded-[4px]"
                  >
                    <div className="text-left">
                      <span className="text-xs font-semibold text-ivory group-hover/item:text-champagne-300 transition-colors uppercase tracking-wider block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-ivory-muted/70 font-light block">{item.sub}</span>
                    </div>
                    <ArrowRight size={14} className="text-champagne-400/50 group-hover/item:text-champagne-400 group-hover/item:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Primary Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  variant="gold"
                  size="md"
                  icon={<Maximize2 size={15} />}
                  onClick={() => handleLaunchModal('all')}
                >
                  EXPAND FULL MAP
                </Button>
                <a
                  href={
                    projectData.googleBusinessUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${projectData.name}, ${projectData.address}`
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lux py-3.5 px-6 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-ivory-muted hover:text-ivory border border-white/[0.12] hover:border-champagne-400/50 rounded-[3px] glass-panel-subtle transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
                >
                  <Navigation size={14} />
                  GET DIRECTIONS
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>

    </section>
  );
};
