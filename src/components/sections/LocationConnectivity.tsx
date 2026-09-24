import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Train,
  ShoppingBag,
  Maximize2,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { projectData } from '../../data/projectData';

interface LocationConnectivityProps {
  onOpenModal?: (category?: string) => void;
}

const keyArterials = [
  { label: 'MALAD WEST', detail: 'Mumbai 400064', note: 'Mindspace Neighbourhood' },
  { label: 'NEW LINK ROAD', detail: '18.3 m Access Road', note: 'Behind Evershine Mall' },
  { label: 'WESTERN EXPRESS', detail: '14 Minutes', note: 'North–South Highway' },
  { label: 'AIRPORT', detail: '42 Minutes', note: 'CSMIA, T1 & T2' },
];

const transitHighlights = [
  { icon: Train, label: 'Metro 2A', time: '3 min', note: 'Malad West Station' },
  { icon: ShoppingBag, label: 'Inorbit Mall', time: '4 min', note: 'Retail & Dining' },
  { icon: MapPin, label: 'Malad Station', time: '9 min', note: 'Western Railway' },
];

/** The client's drone film of the drive in from Malad Station. */
const FILM = {
  small: '/assets/video/location-route-960.mp4',
  large: '/assets/video/location-route-1920.mp4',
  poster: '/assets/video/location-route-poster.webp',
};

const MAP_EMBED =
  projectData.mapEmbedUrl ||
  `https://maps.google.com/maps?q=${encodeURIComponent(
    `${projectData.name}, Behind Evershine Mall, Mindspace, Malad West, Mumbai 400064`
  )}&z=16&output=embed`;

/**
 * Plays muted while it is on screen and pauses when it leaves; the controls
 * unmute it. Phones get the 960 px encode, and nothing downloads until the film
 * first comes into view. Once the visitor pauses it, it stays paused.
 */
const RouteFilm: React.FC = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [src] = useState(() =>
    window.matchMedia('(max-width: 767px)').matches ? FILM.small : FILM.large
  );
  const pausedByVisitor = useRef(false);
  const pausingForScroll = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!pausedByVisitor.current) video.play().catch(() => {});
        } else if (!video.paused) {
          pausingForScroll.current = true;
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={FILM.poster}
      muted
      loop
      playsInline
      controls
      preload="none"
      onPlay={() => (pausedByVisitor.current = false)}
      onPause={() => {
        pausedByVisitor.current = !pausingForScroll.current;
        pausingForScroll.current = false;
      }}
      className="absolute inset-0 w-full h-full object-cover"
      aria-label="Drone film of the route from Malad Station to Aranya The Park, via S. V. Road"
    />
  );
};

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
        <SectionHeading
          eyebrow="Location"
          title="A Neighbourhood of Quick Access"
          subtitle="Behind Evershine Mall in Mindspace, Malad West, a few minutes from the metro, schools, hospitals and malls."
        />

        {/* ─── Progressive Arterial Reveal Strip ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
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
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-16">
          {transitHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center space-y-2.5 p-3 sm:p-5 glass-panel-subtle rounded-[4px] hover:border-champagne-400/30 transition-all cursor-default"
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

        {/* ─── The drive in, filmed ─── */}
        <figure className="mb-16">
          <div className="relative aspect-[20/9] bg-black rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
            <RouteFilm />
          </div>
          <figcaption className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-ivory-muted/70">
            <span className="text-champagne-300">Route 01</span> · Malad Station to the site, via S. V. Road
          </figcaption>
        </figure>

        {/* ─── Infrastructure Narrative & Modal Triggers ─── */}
        <div className="glass-panel p-6 sm:p-10 lg:p-12 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-12 space-y-6">
              <div>
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block">
                  The Approach
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                  Straight onto New Link Road
                </h3>
              </div>

              <p className="font-sans text-sm text-ivory-muted leading-relaxed font-light">
                An 18.3-metre-wide access road leads from Aranya straight onto New Link Road. Metro Line 2A already runs close by, and the Coastal Road northern extension, the GMLR tunnel and Metro Line 6 will bring more of the city within reach.
              </p>

              {/* Category Links */}
              <div className="space-y-2.5 pt-2">
                {[
                  { cat: 'transit', label: 'Transit & Highways', sub: 'Metro 2A, Malad Station, WEH' },
                  { cat: 'education', label: 'Schools', sub: 'Kothari Starz, Vibgyor Rise, Ryan Intl., Witty Intl.' },
                  { cat: 'healthcare', label: 'Hospitals', sub: 'CritiCare Asia, Cloudnine, Lifeline Medicare' },
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
                  VIEW FULL MAP
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

        {/* ─── The site on Google Maps ─── */}
        <div className="mt-16">
          <div className="mb-5">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block">
              On the Map
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
              Behind Evershine Mall, Malad West
            </h3>
          </div>
          <div className="relative h-[360px] sm:h-[460px] rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.7)] bg-dark-950">
            <iframe
              src={MAP_EMBED}
              title="Aranya The Park on Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <p className="mt-3 flex items-start gap-2 font-sans text-xs text-ivory-muted">
            <MapPin size={14} className="text-champagne-400 shrink-0 mt-px" />
            <span>{projectData.address}</span>
          </p>
        </div>
      </Container>

    </section>
  );
};
