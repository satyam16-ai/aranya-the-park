import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { locationNodes, infrastructureProjects } from '../../data/locationData';
import { projectData } from '../../data/projectData';

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal?: (purpose: string, config?: string) => void;
  initialCategory?: string;
}

/** Category tones, matched to the dots in the destination list under the map. */
const CATEGORY_TONE: Record<string, string> = {
  connectivity: '#7DD3FC',
  education: '#6EE7B7',
  healthcare: '#FDA4AF',
  entertainment: '#FCD34D',
};

/**
 * Where each destination sits on the schematic, in viewBox units, with the short
 * name its label carries and the side that label hangs off.
 *
 * These are drawing coordinates, not survey ones. What they do hold to is the
 * corridor each landmark actually sits on — the metro stations on the metro
 * line, Malad Station on the railway, the highway nodes on the WEH — and enough
 * room between neighbours that two labels never land on top of each other.
 *
 * The plot sits east of New Link Road, between Link Road and S. V. Road, just
 * south of Rejoice International School — the position the brochure map marks
 * with the Aranya crest, confirmed by the client on 24-09.
 *
 * New Link Road itself gets no marker: it is drawn as a corridor and named at
 * the top of the map, and the access-road plate already says how the site meets
 * it. It still appears in the destination list, where "Direct" reads correctly.
 */
const NODE_LAYOUT: Record<
  string,
  { x: number; y: number; short: string; side: 'n' | 's' | 'e' | 'w' }
> = {
  c1: { x: 386, y: 230, short: 'Malad West Metro', side: 'w' },
  c2: { x: 386, y: 412, short: 'Lower Malad Metro', side: 'e' },
  c3: { x: 840, y: 240, short: 'Malad Station', side: 'e' },
  c4: { x: 1010, y: 300, short: 'W. E. Highway', side: 'w' },
  c5: { x: 1010, y: 515, short: 'Airport (CSMIA)', side: 'w' },
  e1: { x: 412, y: 478, short: 'Inorbit Mall', side: 'w' },
  e2: { x: 250, y: 190, short: 'Goregaon Sports Club', side: 's' },
  e3: { x: 140, y: 120, short: 'Infiniti Mall', side: 's' },
  e4: { x: 1040, y: 420, short: 'Oberoi Mall', side: 'w' },
  ed1: { x: 560, y: 222, short: 'Kothari Starz', side: 'n' },
  ed2: { x: 200, y: 440, short: 'Vibgyor Rise', side: 's' },
  ed3: { x: 472, y: 200, short: 'Rejoice Intl.', side: 'n' },
  ed4: { x: 300, y: 95, short: 'Ryan Intl.', side: 's' },
  ed5: { x: 768, y: 360, short: 'Witty Intl.', side: 's' },
  ed6: { x: 640, y: 120, short: 'Orchids Intl.', side: 'n' },
  ed7: { x: 1040, y: 195, short: 'Oberoi Intl.', side: 'w' },
  h1: { x: 180, y: 285, short: 'CritiCare Asia', side: 'n' },
  h2: { x: 500, y: 440, short: 'Cloudnine', side: 's' },
  h3: { x: 800, y: 130, short: 'Lifeline Medicare', side: 'n' },
};

/** The parcel centre; routes are drawn from here, under the parcel itself. */
const SITE_ORIGIN = { x: 596, y: 308 };

const PLATE_H = 15;

/** Hang a label plate off the chosen side of its marker. */
const platePosition = (side: 'n' | 's' | 'e' | 'w', w: number) => {
  switch (side) {
    case 'n':
      return { x: -w / 2, y: -17 - PLATE_H, tx: 0, ty: -17 - PLATE_H + 10.5 };
    case 's':
      return { x: -w / 2, y: 17, tx: 0, ty: 27.5 };
    case 'e':
      return { x: 16, y: -PLATE_H / 2, tx: 16 + w / 2, ty: 3 };
    default:
      return { x: -16 - w, y: -PLATE_H / 2, tx: -16 - w / 2, ty: 3 };
  }
};

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onOpenLeadModal,
  initialCategory,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('c1');
  const [mapMode, setMapMode] = useState<'schematic' | 'brochure'>('schematic');
  const [isBrochureZoomed, setIsBrochureZoomed] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(initialCategory || 'all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeSelectedNode = locationNodes.find((n) => n.id === selectedNodeId) || locationNodes[0];
  const activeLayout = NODE_LAYOUT[selectedNodeId];

  /**
   * Picking a category also moves the selection into it, so the map, the
   * detail card and the list never disagree about what is on screen.
   */
  const applyCategoryFilter = useCallback((cat: string) => {
    setActiveCategoryFilter(cat);
    if (cat !== 'all') {
      const first = locationNodes.find((n) => n.category === cat);
      if (first) setSelectedNodeId(first.id);
    }
  }, []);

  // Sync category if provided
  useEffect(() => {
    if (isOpen && initialCategory) {
      applyCategoryFilter(initialCategory);
    }
  }, [isOpen, initialCategory, applyCategoryFilter]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'connectivity':
        return { dot: 'bg-sky-400' };
      case 'education':
        return { dot: 'bg-emerald-400' };
      case 'healthcare':
        return { dot: 'bg-rose-400' };
      case 'entertainment':
        return { dot: 'bg-amber-400' };
      default:
        return { dot: 'bg-champagne-300' };
    }
  };

  const filteredNodes =
    activeCategoryFilter === 'all'
      ? locationNodes
      : locationNodes.filter((n) => n.category === activeCategoryFilter);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Location and connectivity"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[94vh] bg-dark-900 border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-[4px] flex flex-col overflow-hidden animate-scale-in">
        {/* ─── Top Luxury Header Bar ─── */}
        <div className="px-4 sm:px-6 py-3.5 bg-dark-950/90 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-champagne-300 text-[10px] tracking-[0.3em] uppercase font-sans font-semibold">
                PRIME PIN CODE 400064 · MALAD WEST, MUMBAI
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-ivory-muted/70 font-sans border-l border-white/[0.1] pl-2">
                <Sparkles size={11} className="text-champagne-400" />
                +16.7% Appreciation (3 Yrs)
              </span>
            </div>
            <h2 className="font-serif text-base sm:text-xl text-ivory font-light truncate">
              A Neighbourhood of Quick Access
            </h2>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                'Aranya The Park Malad West Behind Evershine Mall Mumbai'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] text-ivory hover:text-champagne-300 text-xs font-sans uppercase tracking-wider transition-colors rounded-[3px]"
            >
              <Navigation size={12} />
              <span>Google Maps</span>
              <ExternalLink size={10} />
            </a>

            {onOpenLeadModal && (
              <Button
                variant="outline-gold"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => onOpenLeadModal('Arrange a Private Site Visit')}
              >
                Schedule Site Visit
              </Button>
            )}

            <button
              onClick={onClose}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer ml-1"
              aria-label="Close Pop-up Window"
              title="Close (ESC)"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ─── Scrollable Modal Body ─── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Brief Context & Appreciation Strip */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-[4px] bg-white/[0.02] border border-white/[0.08] text-xs">
            <div className="max-w-2xl text-ivory-muted leading-relaxed font-light">
              Behind Evershine Mall in Mindspace, Malad West, with an 18.3-metre-wide access road straight onto New Link Road. Malad West Metro is 3 minutes away, the Western Express Highway 14.
            </div>
            <div className="inline-flex flex-wrap items-center gap-3 text-[11px] text-ivory-muted bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-[3px] shrink-0">
              <span className="text-champagne-300 font-medium flex items-center gap-1">
                <Sparkles size={11} className="text-champagne-400" /> Malad West Capital Growth:
              </span>
              <span className="text-ivory font-medium">+10.5% (1 Yr)</span>
              <span className="text-white/[0.2]">•</span>
              <span className="text-ivory font-medium">+16.7% (3 Yrs)</span>
            </div>
          </div>

          {/* ─── Interactive Map Visual Stage ─── */}
          <div className="bg-dark-950 border border-white/[0.08] rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Map Mode & Controls Toolbar */}
            <div className="px-4 sm:px-5 py-3 bg-dark-900/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-champagne-400 animate-pulse" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-champagne-300">
                  {mapMode === 'schematic' ? 'Transit Schematic' : 'Regional Map'}
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex p-0.5 bg-white/[0.03] border border-white/[0.08] rounded-[3px] text-xs">
                <button
                  onClick={() => setMapMode('schematic')}
                  className={`px-3 py-1 font-sans text-[11px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ${
                    mapMode === 'schematic'
                      ? 'bg-champagne-400 text-dark-950 font-semibold shadow-sm'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  Transit Schematic
                </button>
                <button
                  onClick={() => setMapMode('brochure')}
                  className={`px-3 py-1 font-sans text-[11px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ${
                    mapMode === 'brochure'
                      ? 'bg-champagne-400 text-dark-950 font-semibold shadow-sm'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  Regional Map
                </button>
              </div>
            </div>

            {/* Map Content Viewport */}
            {mapMode === 'schematic' ? (
              <div className="relative w-full bg-[#0c0d0c] select-none overflow-x-auto overflow-y-hidden">
                {/* The schematic needs width to stay legible, so on a narrow
                    screen it scrolls sideways instead of shrinking away. */}
                <div className="relative min-w-[900px] aspect-[2/1]">
                  <svg
                    viewBox="0 0 1120 560"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Schematic map of Aranya The Park, east of New Link Road, with its 18.3 metre access road and the transit, schools, hospitals and retail around it"
                  >
                    <defs>
                      <pattern id="modalMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      </pattern>
                      <linearGradient id="modalWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#081014" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#0c0d0c" stopOpacity="0" />
                      </linearGradient>
                      <radialGradient id="modalAranyaPulse" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#C8A96B" stopOpacity="0.45" />
                        <stop offset="60%" stopColor="#C8A96B" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#C8A96B" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <rect width="1120" height="560" fill="#0c0d0c" />
                    <rect width="1120" height="560" fill="url(#modalMapGrid)" />

                    {/* ─── Malad Creek, on the western edge ─── */}
                    <path d="M 0,0 L 75,0 Q 115,280 65,560 L 0,560 Z" fill="url(#modalWaterGrad)" />
                    <text
                      x="28"
                      y="300"
                      fill="rgba(200,169,107,0.22)"
                      fontSize="11"
                      letterSpacing="4"
                      transform="rotate(-90, 28, 300)"
                      fontFamily="sans-serif"
                    >
                      MALAD CREEK
                    </text>

                    {/* ─── Arterials, west to east ─── */}
                    {/* Metro 2A runs along the western flank of Link Road */}
                    <line x1="386" y1="44" x2="386" y2="560" stroke="#EAB308" strokeWidth="3" strokeDasharray="7 5" opacity="0.85" />
                    <text
                      x="376"
                      y="548"
                      fill="#EAB308"
                      fontSize="8.5"
                      letterSpacing="1.4"
                      transform="rotate(-90, 376, 548)"
                      fontFamily="sans-serif"
                    >
                      METRO LINE 2A
                    </text>

                    <line x1="412" y1="0" x2="412" y2="560" stroke="#1f201f" strokeWidth="22" />
                    <line x1="412" y1="0" x2="412" y2="560" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeDasharray="12 9" />
                    <text x="412" y="26" fill="#F4F0E8" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                      NEW LINK ROAD
                    </text>

                    <line x1="730" y1="0" x2="730" y2="560" stroke="#1a1b1a" strokeWidth="15" />
                    <text x="730" y="26" fill="rgba(244,240,232,0.5)" fontSize="9" letterSpacing="2" textAnchor="middle" fontFamily="sans-serif">
                      S. V. ROAD
                    </text>

                    <line x1="840" y1="0" x2="840" y2="560" stroke="#1c1d1c" strokeWidth="16" />
                    <line x1="835" y1="0" x2="835" y2="560" stroke="#94A3B8" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.45" />
                    <line x1="845" y1="0" x2="845" y2="560" stroke="#94A3B8" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.45" />
                    <text x="840" y="26" fill="#CBD5E1" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                      WESTERN RAILWAY
                    </text>

                    <line x1="1010" y1="0" x2="1010" y2="560" stroke="#222322" strokeWidth="24" />
                    <line x1="1010" y1="0" x2="1010" y2="560" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeDasharray="14 10" />
                    <text x="1010" y="26" fill="#F4F0E8" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                      W. E. HIGHWAY
                    </text>

                    {/* East–west links */}
                    <path d="M 412,150 L 840,150 L 1010,136" stroke="#2c2d2c" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <path d="M 730,470 L 1010,486" stroke="#2c2d2c" strokeWidth="7" strokeLinecap="round" fill="none" />
                    <text x="872" y="464" fill="#8d887e" fontSize="7.5" textAnchor="middle" letterSpacing="0.6" fontFamily="sans-serif">
                      GOREGAON–MULUND LINK ROAD
                    </text>

                    {/* ─── Mindspace, the commercial pocket west of Link Road ─── */}
                    <rect
                      x="150"
                      y="300"
                      width="180"
                      height="100"
                      rx="3"
                      fill="rgba(255,255,255,0.016)"
                      stroke="rgba(255,255,255,0.11)"
                      strokeWidth="1.4"
                      strokeDasharray="5 4"
                    />
                    <text x="240" y="345" fill="#B9B3A8" fontSize="9.5" fontWeight="600" textAnchor="middle" letterSpacing="1.6" fontFamily="sans-serif">
                      MINDSPACE
                    </text>
                    <text x="240" y="358" fill="rgba(255,255,255,0.28)" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">
                      COMMERCIAL IT PARK
                    </text>

                    {/* ─── Route from the site to the selected destination ─── */}
                    {/* Drawn before the parcel so it slips out from under it. */}
                    {activeLayout && (
                      <line
                        x1={SITE_ORIGIN.x}
                        y1={SITE_ORIGIN.y}
                        x2={activeLayout.x}
                        y2={activeLayout.y}
                        stroke="#C8A96B"
                        strokeWidth="1.5"
                        strokeDasharray="7 7"
                        opacity="0.45"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Evershine Mall — the project sits behind it, off Link Road */}
                    <rect x="448" y="268" width="56" height="46" rx="2" fill="#1b1c1b" stroke="rgba(200,169,107,0.35)" strokeWidth="1" />
                    <text x="476" y="288" fill="#F4F0E8" fontSize="7" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                      EVERSHINE
                    </text>
                    <text x="476" y="298" fill="#C8A96B" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                      MALL
                    </text>

                    {/* The 18.3 m access road, parcel gate west onto New Link Road */}
                    <line x1="412" y1="332" x2="522" y2="332" stroke="#C8A96B" strokeWidth="9" strokeLinecap="round" />
                    <line x1="412" y1="332" x2="522" y2="332" stroke="#0c0d0c" strokeWidth="1.6" strokeDasharray="5 4" />
                    <circle cx="412" cy="332" r="5.5" fill="#C8A96B" stroke="#080908" strokeWidth="2" />
                    <circle cx="522" cy="332" r="5.5" fill="#C8A96B" stroke="#080908" strokeWidth="2" />
                    <rect x="420" y="338" width="94" height="15" rx="2" fill="#080908" stroke="rgba(200,169,107,0.5)" strokeWidth="0.8" />
                    <text x="467" y="348.5" fill="#F4F0E8" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.4" fontFamily="sans-serif">
                      18.3 M ACCESS ROAD
                    </text>

                    {/* ─── Aranya The Park: its own parcel, east of New Link Road ─── */}
                    <circle cx="596" cy="308" r="68" fill="url(#modalAranyaPulse)" />
                    <rect x="522" y="262" width="148" height="92" rx="3" fill="rgba(200,169,107,0.09)" stroke="#C8A96B" strokeWidth="1.6" />
                    <image
                      href="/assets/branding/aranya-wordmark-light.png"
                      x="534"
                      y="282"
                      width="124"
                      height="35"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <title>Aranya The Park</title>
                    </image>
                    <text x="596" y="340" fill="rgba(244,240,232,0.55)" fontSize="7" textAnchor="middle" letterSpacing="1.4" fontFamily="sans-serif">
                      THE SITE
                    </text>

                    {/* ─── Destination markers ─── */}
                    {locationNodes.map((node) => {
                      const spot = NODE_LAYOUT[node.id];
                      if (!spot) return null;

                      const tone = CATEGORY_TONE[node.category] || '#C8A96B';
                      const isSelected = selectedNodeId === node.id;
                      const isHovered = hoveredNodeId === node.id;
                      const inFilter =
                        activeCategoryFilter === 'all' || node.category === activeCategoryFilter;
                      const minutes = node.time.match(/\d+/)?.[0] ?? '·';

                      return (
                        <g
                          key={node.id}
                          transform={`translate(${spot.x}, ${spot.y})`}
                          opacity={inFilter ? 1 : 0.15}
                          style={{ pointerEvents: inFilter ? 'auto' : 'none' }}
                          className="cursor-pointer focus:outline-none"
                          role="button"
                          tabIndex={inFilter ? 0 : -1}
                          aria-label={`${node.name}, ${node.time}`}
                          onClick={() => setSelectedNodeId(node.id)}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          onFocus={() => setHoveredNodeId(node.id)}
                          onBlur={() => setHoveredNodeId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedNodeId(node.id);
                            }
                          }}
                        >
                          {(isSelected || isHovered) && (
                            <circle r="20" fill={tone} opacity={isSelected ? 0.2 : 0.12} />
                          )}
                          <circle
                            r={isSelected ? 12.5 : isHovered ? 11 : 9.5}
                            fill={isSelected ? tone : '#12130f'}
                            stroke={tone}
                            strokeWidth={isSelected ? 2 : 1.4}
                            className="transition-all duration-200"
                          />
                          <text
                            y="3"
                            fill={isSelected ? '#080908' : tone}
                            fontSize="7.5"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                            className="pointer-events-none"
                          >
                            {minutes}
                          </text>
                        </g>
                      );
                    })}

                    {/* ─── Labels, painted last so they never sit under a marker ─── */}
                    {locationNodes.map((node) => {
                      const spot = NODE_LAYOUT[node.id];
                      if (!spot) return null;

                      const isSelected = selectedNodeId === node.id;
                      const isHovered = hoveredNodeId === node.id;
                      const inFilter =
                        activeCategoryFilter === 'all' || node.category === activeCategoryFilter;
                      // Every destination on the map carries its name. The layout above
                      // is spaced so all of the plates can sit up at once without
                      // colliding, so nothing is left as an unexplained bubble.
                      if (!inFilter) return null;

                      const tone = CATEGORY_TONE[node.category] || '#C8A96B';
                      const text = `${spot.short} · ${node.time}`;
                      const w = text.length * 4.75 + 18;
                      const plate = platePosition(spot.side, w);

                      return (
                        <g
                          key={`${node.id}-label`}
                          transform={`translate(${spot.x}, ${spot.y})`}
                          className="pointer-events-none"
                        >
                          <rect
                            x={plate.x}
                            y={plate.y}
                            width={w}
                            height={PLATE_H}
                            rx="2"
                            fill="#080908"
                            stroke={isSelected || isHovered ? tone : 'rgba(255,255,255,0.14)'}
                            strokeWidth={isSelected ? 1.2 : 0.8}
                            opacity="0.96"
                          />
                          <text
                            x={plate.tx}
                            y={plate.ty}
                            fill={isSelected || isHovered ? '#FFFFFF' : '#D9D4CA'}
                            fontSize="8.5"
                            fontWeight={isSelected ? 700 : 600}
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            {text}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 bg-dark-950/95 border border-white/[0.08] p-2.5 rounded-[3px] text-[10px] backdrop-blur-md hidden sm:block">
                    <div className="text-champagne-300 font-semibold uppercase tracking-wider text-[9px] mb-1.5">
                      Map Legend
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { tone: CATEGORY_TONE.connectivity, label: 'Transit & Highways' },
                        { tone: CATEGORY_TONE.education, label: 'Schools' },
                        { tone: CATEGORY_TONE.healthcare, label: 'Hospitals' },
                        { tone: CATEGORY_TONE.entertainment, label: 'Retail & Leisure' },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-1.5 text-ivory-muted">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.tone }} />
                          <span className="whitespace-nowrap">{row.label}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 text-ivory-muted">
                        <span className="w-3 h-[3px] bg-[#EAB308] shrink-0" />
                        <span className="whitespace-nowrap">Metro Line 2A</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-ivory-muted">
                        <span className="w-3 h-[3px] bg-[#C8A96B] shrink-0" />
                        <span className="whitespace-nowrap">18.3 m Access Road</span>
                      </div>
                    </div>
                  </div>

                  {/* Hint */}
                  <div className="absolute bottom-3 right-3 bg-dark-950/90 border border-white/[0.08] px-2.5 py-1.5 rounded-[3px] text-[10px] text-ivory-muted/80 backdrop-blur-md hidden sm:block">
                    Select a marker to trace the route · numbers are minutes
                  </div>
                  <div className="absolute bottom-3 left-3 bg-dark-950/90 border border-white/[0.08] px-2.5 py-1.5 rounded-[3px] text-[10px] text-ivory-muted/80 backdrop-blur-md sm:hidden">
                    Swipe the map · tap a marker for details
                  </div>
                </div>
              </div>
            ) : (
              /* Brochure Map View */
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/10] bg-dark-950 overflow-hidden">
                <div
                  className={`w-full h-full flex items-center justify-center p-2 transition-transform duration-500 cursor-zoom-in ${
                    isBrochureZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                  }`}
                  onClick={() => setIsBrochureZoomed(!isBrochureZoomed)}
                >
                  <img
                    src="/assets/opt/location-map-infra-2800.webp"
                    alt="Aranya The Park — Regional Location Map"
                    className="max-h-full max-w-full object-contain filter contrast-[1.1] brightness-[0.95]"
                  />
                </div>
                <div className="absolute bottom-3 right-3 z-10">
                  <button
                    onClick={() => setIsBrochureZoomed(!isBrochureZoomed)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900/90 border border-white/[0.12] text-champagne-300 hover:text-white text-[11px] font-sans uppercase tracking-wider backdrop-blur-md cursor-pointer rounded-[3px]"
                  >
                    <Maximize2 size={12} />
                    <span>{isBrochureZoomed ? 'Reset View' : 'Zoom In'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Category Filter Tabs ─── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'connectivity', label: 'Transit & Highways' },
              { id: 'education', label: 'Schools' },
              { id: 'healthcare', label: 'Hospitals' },
              { id: 'entertainment', label: 'Retail & Leisure' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => applyCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer rounded-full border ${
                  activeCategoryFilter === cat.id
                    ? 'bg-champagne-400 text-dark-950 border-champagne-300 font-semibold'
                    : 'border-white/[0.08] text-ivory-muted hover:text-ivory hover:border-white/[0.2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ─── Grid: Active Node Highlight Card + Quick Node Chips ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Active Selected Node Card */}
            <div className="lg:col-span-5 p-5 bg-white/[0.02] border border-white/[0.1] rounded-[4px] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-semibold">
                  Destination Details
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-ivory font-semibold bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-[3px]">
                  <Clock size={12} className="text-champagne-400" />
                  {activeSelectedNode.time}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl text-ivory font-medium">
                  {activeSelectedNode.name}
                </h3>
                <p className="text-xs text-ivory-muted leading-relaxed font-light mt-1">
                  {activeSelectedNode.distanceNote}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.08] text-xs">
                <div>
                  <span className="text-[10px] uppercase text-ivory-muted/70 block">Category</span>
                  <span className="text-champagne-300 font-medium capitalize">{activeSelectedNode.category}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ivory-muted/70 block">Commute Time</span>
                  <span className="text-ivory font-medium">{activeSelectedNode.time}</span>
                </div>
              </div>

              {activeSelectedNode.routeNote && (
                <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-[3px] text-[11px] text-ivory-muted flex items-start gap-2">
                  <Info size={13} className="text-champagne-400 shrink-0 mt-0.5" />
                  <span>{activeSelectedNode.routeNote}</span>
                </div>
              )}
            </div>

            {/* List of Destination Nodes in Category */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const colors = getCategoryColor(node.category);
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3 text-left transition-all cursor-pointer rounded-[4px] border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white/[0.08] border-champagne-400 text-ivory shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-ivory-muted hover:text-ivory hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        <span className="text-[10px] uppercase tracking-wider text-ivory-muted/70">
                          {node.category}
                        </span>
                      </div>
                      <div className="text-xs font-medium truncate text-ivory">{node.name}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-semibold text-champagne-300">{node.time}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Upcoming Infrastructure Catalysts Timeline ─── */}
          <div className="pt-4 border-t border-white/[0.08]">
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] text-champagne-300 font-semibold mb-4">
              Infrastructure Shaping Malad West
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {infrastructureProjects.map((proj) => (
                <div key={proj.name} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-[4px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-champagne-300 font-semibold">
                      {proj.status}
                    </span>
                  </div>
                  <h5 className="font-sans text-xs font-semibold text-ivory">{proj.name}</h5>
                  <p className="text-[11px] text-ivory-muted leading-relaxed font-light">{proj.description}</p>
                  <p className="text-[10px] text-champagne-300/80 font-sans pt-1 border-t border-white/[0.06]">{proj.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Modal Sticky Footer ─── */}
        <div className="px-4 sm:px-6 py-3 bg-dark-950/95 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-ivory-muted">
            <MapPin size={14} className="text-champagne-400" />
            <span className="line-clamp-1">{projectData.address}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                onClose();
                if (onOpenLeadModal) onOpenLeadModal('Book a Site Visit');
              }}
            >
              Book Site Visit
            </Button>
            <Button
              variant="outline"
              size="sm"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                'Aranya The Park Malad West Behind Evershine Mall Mumbai'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={<Navigation size={13} />}
            >
              Driving Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
