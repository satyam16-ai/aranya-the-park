import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation, ExternalLink, X, Clock, Route } from 'lucide-react';
import { Button } from '../common/Button';
import { Img } from '../common/Img';
import { Tabs } from '../common/Tabs';
import { cn } from '../../lib/cn';
import { overlayFade, panelIn } from '../../lib/motion';
import { useDialog } from '../../lib/useDialog';
import { locationCategories, locationNodes, infrastructureProjects } from '../../data/locationData';
import { projectData } from '../../data/projectData';

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

type Filter = 'all' | 'connectivity' | 'entertainment' | 'education' | 'healthcare';
type MapMode = 'schematic' | 'regional';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Aranya The Park, Behind Evershine Mall, Mindspace, Malad West, Mumbai 400064');

const isFilter = (v?: string): v is Filter =>
  v === 'all' || v === 'connectivity' || v === 'entertainment' || v === 'education' || v === 'healthcare';

// Brand palette for the SVG (inline attributes can't read CSS variables reliably in all browsers)
const C = {
  bg: '#13261e',
  ground: '#20362c',
  road: '#30493e',
  rule: 'rgba(215,193,152,0.35)',
  gold: '#d7c198',
  goldDeep: '#a68a5d',
  ink: '#081711',
  linen: '#f8f2ec',
  muted: '#bfb6ab',
  metro: '#eab308',
  rail: '#a6beb3',
};

const Panel: React.FC<Omit<LocationModalProps, 'isOpen'>> = ({ onClose, initialCategory }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, true, onClose, '[data-loc-close]');

  const [filter, setFilter] = useState<Filter>(isFilter(initialCategory) ? initialCategory : 'all');
  const [mode, setMode] = useState<MapMode>('schematic');
  const [selectedId, setSelectedId] = useState<string>('c1');

  const nodes = filter === 'all' ? locationNodes : locationNodes.filter((n) => n.category === filter);
  const selected = locationNodes.find((n) => n.id === selectedId) ?? locationNodes[0];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-stretch justify-center p-0 sm:items-center sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Location and connectivity map"
      variants={overlayFade}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-forest-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={ref}
        data-surface="deep"
        variants={panelIn}
        className="relative z-10 flex h-full w-full max-w-[1280px] flex-col overflow-hidden border border-card-border shadow-xl sm:h-[92vh] sm:rounded-md"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-card-border px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <span className="t-micro text-accent-text">Malad West · 400064</span>
            <h2 className="t-h3 truncate text-fg">Connected to everything that matters</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" href={MAPS_URL} target="_blank" rel="noopener noreferrer" icon={<ExternalLink size={12} />}>
              Google Maps
            </Button>
            <button
              type="button"
              data-loc-close
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
              aria-label="Close map"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="scroll-x flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Map */}
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-sm border border-card-border bg-forest-950">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-4 py-2.5">
                  <span className="t-micro flex items-center gap-2 text-gold-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
                    {mode === 'schematic' ? 'Transit schematic' : 'Regional map'}
                  </span>
                  <Tabs<MapMode>
                    size="sm"
                    ariaLabel="Map mode"
                    items={[
                      { id: 'schematic', label: 'Schematic' },
                      { id: 'regional', label: 'Regional' },
                    ]}
                    value={mode}
                    onChange={setMode}
                  />
                </div>

                {mode === 'schematic' ? (
                  <div className="relative aspect-[4/3] w-full select-none sm:aspect-[16/9]">
                    <svg viewBox="0 0 1000 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Schematic map of arterial roads, metro and rail around Aranya The Park">
                      <defs>
                        <pattern id="locGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
                        </pattern>
                        <radialGradient id="locPulse" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={C.gold} stopOpacity="0.55" />
                          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="1000" height="500" fill={C.bg} />
                      <rect width="1000" height="500" fill="url(#locGrid)" />

                      {/* Coast */}
                      <path d="M 0,0 L 90,0 Q 140,250 80,500 L 0,500 Z" fill={C.ink} opacity="0.7" />
                      <text x="35" y="260" fill={C.rule} fontSize="11" letterSpacing="4" transform="rotate(-90, 35, 260)" fontFamily="Jost, sans-serif">
                        MALAD CREEK · ARABIAN SEA
                      </text>

                      {/* Mindspace */}
                      <polygon points="160,220 280,220 280,420 160,420" fill={C.ground} stroke={C.rule} strokeWidth="1.5" strokeDasharray="4 2" />
                      <text x="220" y="325" fill={C.muted} fontSize="10" fontWeight="500" textAnchor="middle" letterSpacing="1.5" fontFamily="Jost, sans-serif">MINDSPACE</text>
                      <text x="220" y="340" fill={C.muted} opacity="0.6" fontSize="8" textAnchor="middle" fontFamily="Jost, sans-serif">COMMERCIAL IT PARK</text>

                      {/* Evershine Mall */}
                      <rect x="240" y="260" width="45" height="45" fill={C.road} stroke={C.rule} strokeWidth="1" />
                      <text x="262" y="286" fill={C.linen} fontSize="7" textAnchor="middle" fontWeight="500" fontFamily="Jost, sans-serif">EVERSHINE</text>
                      <text x="262" y="295" fill={C.gold} fontSize="6" textAnchor="middle" fontFamily="Jost, sans-serif">MALL</text>

                      {/* New Link Road */}
                      <line x1="360" y1="0" x2="360" y2="500" stroke={C.road} strokeWidth="22" />
                      <line x1="360" y1="0" x2="360" y2="500" stroke={C.gold} strokeWidth="2" strokeDasharray="12 8" opacity="0.6" />
                      <text x="360" y="30" fill={C.linen} fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="500" fontFamily="Jost, sans-serif">NEW LINK ROAD</text>

                      {/* Metro 2A */}
                      <line x1="380" y1="0" x2="380" y2="500" stroke={C.metro} strokeWidth="3" strokeDasharray="6 4" opacity="0.85" />
                      <text x="390" y="470" fill={C.metro} fontSize="9" letterSpacing="1.5" transform="rotate(-90, 390, 470)" fontFamily="Jost, sans-serif">METRO LINE 2A</text>

                      {/* Boulevard */}
                      <path d="M 360,310 L 260,310" stroke={C.gold} strokeWidth="8" strokeLinecap="round" />
                      <rect x="270" y="295" width="80" height="12" fill={C.ink} stroke={C.gold} strokeWidth="0.8" rx="2" />
                      <text x="310" y="304" fill={C.linen} fontSize="7" fontWeight="500" textAnchor="middle" fontFamily="Jost, sans-serif">18.3 M BOULEVARD</text>

                      {/* Western Railway */}
                      <line x1="580" y1="0" x2="580" y2="500" stroke={C.road} strokeWidth="18" />
                      <line x1="575" y1="0" x2="575" y2="500" stroke={C.rail} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
                      <line x1="585" y1="0" x2="585" y2="500" stroke={C.rail} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
                      <text x="580" y="30" fill={C.linen} fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="500" fontFamily="Jost, sans-serif">WESTERN RAILWAY</text>

                      {/* WEH */}
                      <line x1="820" y1="0" x2="820" y2="500" stroke={C.road} strokeWidth="24" />
                      <line x1="820" y1="0" x2="820" y2="500" stroke={C.gold} strokeWidth="2" strokeDasharray="14 10" opacity="0.6" />
                      <text x="820" y="30" fill={C.linen} fontSize="10" letterSpacing="2" textAnchor="middle" fontWeight="500" fontFamily="Jost, sans-serif">WESTERN EXPRESS HIGHWAY</text>

                      {/* Flyovers */}
                      <path d="M 360,180 L 580,180 L 820,160" stroke={C.road} strokeWidth="7" strokeLinecap="round" />
                      <text x="470" y="172" fill={C.muted} fontSize="8" textAnchor="middle" fontFamily="Jost, sans-serif">MITHOWKI FLYOVER</text>
                      <path d="M 360,380 L 580,380 L 820,400" stroke={C.road} strokeWidth="7" strokeLinecap="round" />
                      <text x="700" y="394" fill={C.muted} fontSize="8" textAnchor="middle" fontFamily="Jost, sans-serif">MRINAL TAI GORE FLYOVER</text>

                      {/* Site */}
                      <g transform="translate(230, 270)">
                        <circle r="32" fill="url(#locPulse)" />
                        <circle r="14" fill={C.gold} stroke={C.ink} strokeWidth="3" />
                        <text y="4" fill={C.ink} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Bodoni Moda, serif">A</text>
                        <rect x="-70" y="-36" width="140" height="22" fill={C.ink} stroke={C.gold} strokeWidth="1.2" rx="2" />
                        <image href="/assets/branding/aranya-wordmark-light-320.png" x="-62" y="-34" width="124" height="18" preserveAspectRatio="xMidYMid meet" />
                      </g>

                      {/* Nodes */}
                      {nodes.map((node) => {
                        const active = selectedId === node.id;
                        const { x, y } = node.coords ?? { x: 50, y: 50 };
                        const px = (x / 100) * 1000;
                        const py = (y / 100) * 500;
                        const w = node.name.length * 6.2 + 20;
                        return (
                          <g
                            key={node.id}
                            transform={`translate(${px}, ${py})`}
                            onClick={() => setSelectedId(node.id)}
                            className="group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedId(node.id)}
                            aria-label={`${node.name}, ${node.time}`}
                          >
                            <circle r={active ? 18 : 10} fill={active ? C.gold : C.ground} stroke={active ? C.linen : C.goldDeep} strokeWidth={active ? 2 : 1.2} />
                            <text y="3" fill={active ? C.ink : C.linen} fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="Jost, sans-serif">
                              {node.time.replace(' Mins', "'").replace(' Min', "'")}
                            </text>
                            <g transform="translate(0, -18)" className={active ? 'block' : 'hidden group-hover:block'}>
                              <rect x={-w / 2} y="-14" width={w} height="16" fill={C.ink} stroke={C.gold} strokeWidth="1" rx="2" />
                              <text y="-3" fill={C.linen} fontSize="8" fontWeight="500" textAnchor="middle" fontFamily="Jost, sans-serif">
                                {node.name} · {node.time}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                    <div className="absolute bottom-3 left-3 hidden space-y-1 rounded-xs border border-card-border bg-forest-950/90 p-2.5 backdrop-blur-sm sm:block">
                      <p className="t-micro text-gold-300">Legend</p>
                      <p className="flex items-center gap-2 text-[0.6875rem] text-linen-300"><span className="h-0.5 w-3 bg-[#eab308]" /> Metro Line 2A</p>
                      <p className="flex items-center gap-2 text-[0.6875rem] text-linen-300"><span className="h-0.5 w-3 bg-gold-300" /> 18.3 m boulevard</p>
                      <p className="flex items-center gap-2 text-[0.6875rem] text-linen-300"><span className="h-0.5 w-3 bg-forest-300" /> Western Railway</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
                    <Img
                      src="/assets/opt/location-map-infra-2800.webp"
                      alt="Aranya The Park — regional location map"
                      sizes="(min-width: 1024px) 800px, 100vw"
                      loading="eager"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Infrastructure */}
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {infrastructureProjects.map((p) => (
                  <li key={p.id} className="rounded-sm border border-card-border bg-card p-4">
                    <span className="t-micro text-gold-300">{p.status}</span>
                    <p className="t-h3-ui mt-1 text-fg">{p.name}</p>
                    <p className="t-small mt-1.5 text-fg-muted">{p.benefit}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* List */}
            <div className="lg:col-span-4">
              <Tabs<Filter>
                size="sm"
                grow
                ariaLabel="Filter places"
                items={[{ id: 'all', label: 'All' }, ...locationCategories.map((c) => ({ id: c.id, label: c.label }))]}
                value={filter}
                onChange={setFilter}
              />

              <div className="mt-4 rounded-sm border border-gold-400/40 bg-card p-4">
                <span className="t-micro text-gold-300">Selected</span>
                <p className="t-h3-ui mt-1 text-fg">{selected.name}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-fg">
                  <Clock size={14} className="text-gold-400" /> {selected.time}
                  {selected.routeNote && (
                    <>
                      <span className="text-fg-muted">·</span>
                      <Route size={14} className="text-gold-400" /> {selected.routeNote}
                    </>
                  )}
                </p>
                {selected.distanceNote && <p className="t-small mt-2 text-fg-muted">{selected.distanceNote}</p>}
              </div>

              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {nodes.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(n.id)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm transition-colors',
                        n.id === selectedId ? 'text-gold-300' : 'text-fg-muted hover:text-fg'
                      )}
                      aria-pressed={n.id === selectedId}
                    >
                      <span>{n.name}</span>
                      <span className="tabular-nums text-fg">{n.time}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-start gap-3">
                <Navigation size={16} className="mt-0.5 shrink-0 text-gold-400" />
                <p className="t-small text-fg-muted">{projectData.address}</p>
              </div>
              <Button className="mt-4 w-full sm:hidden" href={MAPS_URL} target="_blank" rel="noopener noreferrer" icon={<ExternalLink size={12} />}>
                Open in Google Maps
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/** Location & transit map — schematic and regional views with every place from locationData. */
export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, ...rest }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>{isOpen && <Panel key="location" {...rest} />}</AnimatePresence>,
    document.body
  );
};
