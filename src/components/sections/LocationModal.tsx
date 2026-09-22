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

  const activeSelectedNode = locationNodes.find((n) => n.id === selectedNodeId) || locationNodes[0];

  // Sync category if provided
  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategoryFilter(initialCategory);
    }
  }, [isOpen, initialCategory]);

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
      aria-label="Connected to Everything That Matters Pop-up Window"
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
              Connected to Everything That Matters
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
                onClick={() => onOpenLeadModal('Location Visit Consultation')}
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
              Positioned directly behind Evershine Mall and Mindspace, serviced by an exclusive 18.3-metre grand boulevard connecting straight to New Link Road. Seamless connectivity to Metro Line 2A, Western Express Highway, and Mumbai’s top corporate corridors.
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
                  {mapMode === 'schematic' ? 'Interactive Transit Schematic' : 'Master Regional Route Map'}
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
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/10] bg-[#0c0d0c] overflow-hidden select-none">
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <pattern id="modalMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="modalWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#081014" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0c0d0c" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="modalAranyaPulse" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C8A96B" stopOpacity="0.6" />
                      <stop offset="70%" stopColor="#C8A96B" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#C8A96B" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width="1000" height="500" fill="url(#modalMapGrid)" />

                  {/* Western Coastline */}
                  <path d="M 0,0 L 90,0 Q 140,250 80,500 L 0,500 Z" fill="url(#modalWaterGrad)" />
                  <text x="35" y="260" fill="rgba(200, 169, 107, 0.25)" fontSize="11" letterSpacing="4" transform="rotate(-90, 35, 260)" fontFamily="sans-serif">
                    MALAD CREEK / ARABIAN SEA
                  </text>

                  {/* Mindspace IT Park */}
                  <polygon points="160,220 280,220 280,420 160,420" fill="#141514" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="220" y="325" fill="#B9B3A8" fontSize="10" fontWeight="600" textAnchor="middle" letterSpacing="1.5" fontFamily="sans-serif">
                    MINDSPACE
                  </text>
                  <text x="220" y="340" fill="rgba(255, 255, 255, 0.3)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                    COMMERCIAL IT PARK
                  </text>

                  {/* Evershine Mall */}
                  <rect x="240" y="260" width="45" height="45" fill="#1b1c1b" stroke="rgba(200, 169, 107, 0.4)" strokeWidth="1" />
                  <text x="262" y="286" fill="#F4F0E8" fontSize="7" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                    EVERSHINE
                  </text>
                  <text x="262" y="295" fill="#C8A96B" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
                    MALL
                  </text>

                  {/* Arterial 1: New Link Road */}
                  <line x1="360" y1="0" x2="360" y2="500" stroke="#1f201f" strokeWidth="22" />
                  <line x1="360" y1="0" x2="360" y2="500" stroke="#C8A96B" strokeWidth="2" strokeDasharray="12 8" opacity="0.6" />
                  <text x="360" y="30" fill="#F4F0E8" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                    NEW LINK ROAD
                  </text>

                  {/* Arterial 2: Metro Line 2A */}
                  <line x1="380" y1="0" x2="380" y2="500" stroke="#EAB308" strokeWidth="3" strokeDasharray="6 4" opacity="0.8" />
                  <text x="390" y="470" fill="#EAB308" fontSize="9" letterSpacing="1.5" transform="rotate(-90, 390, 470)" fontFamily="sans-serif">
                    METRO LINE 2A (YELLOW LINE)
                  </text>

                  {/* 18.3M Dedicated Boulevard */}
                  <path d="M 360,310 L 260,310" stroke="#C8A96B" strokeWidth="8" strokeLinecap="round" />
                  <line x1="360" y1="310" x2="260" y2="310" stroke="#080908" strokeWidth="2" strokeDasharray="4 2" />
                  <rect x="270" y="295" width="80" height="12" fill="#080908" stroke="#C8A96B" strokeWidth="0.8" rx="2" />
                  <text x="310" y="304" fill="#F4F0E8" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5" fontFamily="sans-serif">
                    18.3M BOULEVARD
                  </text>

                  {/* Arterial 3: Western Railway */}
                  <line x1="580" y1="0" x2="580" y2="500" stroke="#1c1d1c" strokeWidth="18" />
                  <line x1="575" y1="0" x2="575" y2="500" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
                  <line x1="585" y1="0" x2="585" y2="500" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
                  <text x="580" y="30" fill="#CBD5E1" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                    WESTERN RAILWAY LINE
                  </text>

                  {/* Arterial 4: Western Express Highway */}
                  <line x1="820" y1="0" x2="820" y2="500" stroke="#222322" strokeWidth="24" />
                  <line x1="820" y1="0" x2="820" y2="500" stroke="#C8A96B" strokeWidth="2" strokeDasharray="14 10" opacity="0.6" />
                  <text x="820" y="30" fill="#F4F0E8" fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
                    WESTERN EXPRESS HIGHWAY (WEH)
                  </text>

                  {/* Connecting Flyovers */}
                  <path d="M 360,180 L 580,180 L 820,160" stroke="#2c2d2c" strokeWidth="7" strokeLinecap="round" />
                  <text x="470" y="172" fill="#B9B3A8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                    MITHOWKI FLYOVER
                  </text>

                  <path d="M 360,380 L 580,380 L 820,400" stroke="#2c2d2c" strokeWidth="7" strokeLinecap="round" />
                  <text x="700" y="394" fill="#B9B3A8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                    MRINAL TAI GORE FLYOVER
                  </text>

                  {/* Aranya Site Pin */}
                  <g transform="translate(230, 270)">
                    <circle cx="0" cy="0" r="32" fill="url(#modalAranyaPulse)" />
                    <circle cx="0" cy="0" r="14" fill="#C8A96B" stroke="#080908" strokeWidth="3" />
                    <text x="0" y="4" fill="#080908" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="serif">
                      A
                    </text>
                    <rect x="-70" y="-36" width="140" height="22" fill="#080908" stroke="#C8A96B" strokeWidth="1.2" rx="2" />
                    <image
                      href="/assets/branding/aranya-wordmark-light.png"
                      x="-62"
                      y="-34"
                      width="124"
                      height="18"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <title>Aranya The Park</title>
                    </image>
                  </g>

                  {/* Schematic Interactive Landmark Nodes */}
                  {locationNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const coords = node.coords || { x: 50, y: 50 };
                    const px = (coords.x / 100) * 1000;
                    const py = (coords.y / 100) * 500;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${px}, ${py})`}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="cursor-pointer transition-all duration-300 group"
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? 18 : 10}
                          fill={isSelected ? '#C8A96B' : '#1a1b1a'}
                          stroke={isSelected ? '#FFFFFF' : '#C8A96B'}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          className="transition-all duration-300"
                        />
                        <text
                          x="0"
                          y="3"
                          fill={isSelected ? '#080908' : '#F4F0E8'}
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {node.time}
                        </text>
                        <g transform="translate(0, -18)" className={isSelected ? 'block' : 'hidden group-hover:block'}>
                          <rect
                            x={-node.name.length * 3.2 - 10}
                            y="-14"
                            width={node.name.length * 6.4 + 20}
                            height="16"
                            fill="#080908"
                            stroke="#C8A96B"
                            strokeWidth="1"
                            rx="2"
                          />
                          <text x="0" y="-3" fill="#FFFFFF" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                            {node.name} ({node.time})
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Bottom Left Schematic Legend */}
                <div className="absolute bottom-3 left-3 bg-dark-950/95 border border-white/[0.08] p-2.5 rounded-[3px] text-[10px] space-y-1 backdrop-blur-md hidden sm:block">
                  <div className="text-champagne-300 font-semibold uppercase tracking-wider text-[9px] mb-1">
                    Arterial Legend
                  </div>
                  <div className="flex items-center gap-2 text-ivory-muted">
                    <span className="w-3 h-1 bg-[#EAB308]" />
                    <span>Metro Line 2A (Yellow)</span>
                  </div>
                  <div className="flex items-center gap-2 text-ivory-muted">
                    <span className="w-3 h-1 bg-[#C8A96B]" />
                    <span>18.3M Dedicated Boulevard</span>
                  </div>
                  <div className="flex items-center gap-2 text-ivory-muted">
                    <span className="w-3 h-1 bg-white/[0.4]" />
                    <span>New Link Road / WEH</span>
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
              { id: 'education', label: 'Top Schools' },
              { id: 'healthcare', label: 'Hospitals' },
              { id: 'entertainment', label: 'Retail & Commercial' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
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
              Major Infrastructure Catalysts Driving Malad West
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
                if (onOpenLeadModal) onOpenLeadModal('Site Visit Booking');
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
