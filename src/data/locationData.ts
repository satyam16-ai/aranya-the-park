import type { InfrastructureProject, LocationNode } from '../types';

export const locationNodes: LocationNode[] = [
  // Transit & Connectivity
  {
    id: 'c1',
    name: 'Malad West Metro Station',
    category: 'connectivity',
    time: '3 Mins',
    routeNote: 'Metro Line 2A (Yellow Line)',
    distanceNote: 'Rapid transit connection north to Dahisar & south to Andheri West',
    coords: { x: 36, y: 38 },
    highlight: true,
  },
  {
    id: 'c2',
    name: 'Lower Malad Metro Station',
    category: 'connectivity',
    time: '5 Mins',
    routeNote: 'Metro Line 2A Corridor',
    distanceNote: 'Quick hop to commercial corporate enclaves',
    coords: { x: 36, y: 64 },
  },
  {
    id: 'c3',
    name: 'Malad Railway Station',
    category: 'connectivity',
    time: '9 Mins',
    routeNote: 'Western Railway Line',
    distanceNote: 'Suburban train corridor directly connecting Churchgate to Dahanu',
    coords: { x: 56, y: 44 },
    highlight: true,
  },
  {
    id: 'c4',
    name: 'Western Express Highway (WEH)',
    category: 'connectivity',
    time: '14 Mins',
    routeNote: 'Via Malad-Goregaon arterial',
    distanceNote: 'Mumbai’s primary north-south express corridor',
    coords: { x: 82, y: 46 },
    highlight: true,
  },
  {
    id: 'c5',
    name: 'Chhatrapati Shivaji Maharaj Intl. Airport',
    category: 'connectivity',
    time: '42 Mins',
    routeNote: 'Via WEH / Elevated Corridor',
    distanceNote: 'Seamless domestic (T1) and international (T2) flight departures',
    coords: { x: 82, y: 90 },
  },
  {
    id: 'c6',
    name: 'New Link Road Boulevard',
    category: 'connectivity',
    time: 'Direct',
    routeNote: '18.3m Dedicated Private Access Road',
    distanceNote: 'Direct vehicular access straight onto New Link Road',
    coords: { x: 34, y: 52 },
    highlight: true,
  },

  // Entertainment & Leisure
  {
    id: 'e1',
    name: 'Inorbit Mall Malad',
    category: 'entertainment',
    time: '4 Mins',
    routeNote: 'Off New Link Road',
    distanceNote: 'High-end retail, cinema, dining, and Hypercity',
    coords: { x: 38, y: 58 },
    highlight: true,
  },
  {
    id: 'e2',
    name: 'Goregaon Sports Club (GSC)',
    category: 'entertainment',
    time: '4 Mins',
    routeNote: 'Link Road Extension',
    distanceNote: 'Olympic-sized sports facilities, swimming, tennis & banqueting',
    coords: { x: 42, y: 72 },
  },
  {
    id: 'e3',
    name: 'Infiniti Mall Malad',
    category: 'entertainment',
    time: '6 Mins',
    routeNote: 'Link Road North',
    distanceNote: 'Megaplex cinemas, international luxury brands & arcade',
    coords: { x: 35, y: 22 },
  },
  {
    id: 'e4',
    name: 'Oberoi Mall Goregaon',
    category: 'entertainment',
    time: '13 Mins',
    routeNote: 'Off Western Express Highway',
    distanceNote: 'Premium designer boutique brands, fine dining & cinema',
    coords: { x: 84, y: 40 },
  },

  // Education
  {
    id: 'ed1',
    name: 'Kothari Starz Pre-School',
    category: 'education',
    time: '1 Min',
    routeNote: 'Immediate neighborhood',
    distanceNote: 'Premier early childhood learning & daycare center',
    coords: { x: 27, y: 48 },
    highlight: true,
  },
  {
    id: 'ed2',
    name: 'Vibgyor Rise International',
    category: 'education',
    time: '2 Mins',
    routeNote: 'Mindspace enclave',
    distanceNote: 'Renowned international curriculum & holistic sports infrastructure',
    coords: { x: 33, y: 45 },
    highlight: true,
  },
  {
    id: 'ed3',
    name: 'Rejoice International School',
    category: 'education',
    time: '3 Mins',
    routeNote: 'Malad West',
    distanceNote: 'Progressive academic environment with multi-disciplinary facilities',
    coords: { x: 29, y: 35 },
  },
  {
    id: 'ed4',
    name: 'Ryan International School',
    category: 'education',
    time: '7 Mins',
    routeNote: 'Evershine Nagar / Link Road',
    distanceNote: 'Established ICSE / CBSE institution with expansive campus',
    coords: { x: 48, y: 30 },
  },
  {
    id: 'ed5',
    name: 'Witty International School',
    category: 'education',
    time: '8 Mins',
    routeNote: 'Malad West',
    distanceNote: 'Global Cambridge & IB international schooling',
    coords: { x: 44, y: 54 },
  },
  {
    id: 'ed6',
    name: 'Orchids The International School',
    category: 'education',
    time: '10 Mins',
    routeNote: 'Malad West',
    distanceNote: 'STEM-focused pedagogy and modern robotics labs',
    coords: { x: 52, y: 24 },
  },
  {
    id: 'ed7',
    name: 'Oberoi International School',
    category: 'education',
    time: '15 Mins',
    routeNote: 'Oberoi Garden City / WEH',
    distanceNote: 'World-class IB World School ranking among India’s finest',
    coords: { x: 88, y: 32 },
  },

  // Healthcare
  {
    id: 'h1',
    name: 'CritiCare Asia Multispeciality Hospital',
    category: 'healthcare',
    time: '2 Mins',
    routeNote: 'Opp. Mindspace',
    distanceNote: 'Advanced tertiary care, 24x7 emergency trauma & ICU facilities',
    coords: { x: 33, y: 42 },
    highlight: true,
  },
  {
    id: 'h2',
    name: 'Cloudnine Hospital',
    category: 'healthcare',
    time: '5 Mins',
    routeNote: 'Link Road',
    distanceNote: 'India’s premier maternity, pediatrics & neonatal care center',
    coords: { x: 40, y: 50 },
  },
  {
    id: 'h3',
    name: 'Lifeline Medicare Hospital',
    category: 'healthcare',
    time: '11 Mins',
    routeNote: 'Malad West',
    distanceNote: 'Comprehensive multispecialty healthcare & cardiac diagnostic center',
    coords: { x: 54, y: 56 },
  },
];

export const infrastructureProjects: InfrastructureProject[] = [
  {
    id: 'metro-2a',
    name: 'Metro Line 2A (Yellow Line)',
    status: 'Operational',
    description: 'Direct high-frequency metro line connecting Dahisar to Andheri West via Malad West station.',
    benefit: 'Reach Andheri corporate hubs and metro interchanges in 15 comfortable, air-conditioned minutes.',
  },
  {
    id: 'coastal-road',
    name: 'Coastal Road Northern Extension',
    status: 'Under Execution',
    description: 'Extending Mumbai’s iconic 8-lane Coastal Road corridor from Versova directly to Bhayander.',
    benefit: 'Unlocks rapid, signal-free commute to Bandra, BKC, and South Mumbai.',
  },
  {
    id: 'gmlr-tunnel',
    name: 'GMLR (Goregaon-Mulund Link Road) Tunnel',
    status: 'Under Construction',
    description: 'Subterranean twin-tunnel project connecting Western Express Highway with Eastern Express Highway.',
    benefit: 'Cuts travel time between Western Suburbs and Thane/Powai/Navi Mumbai from 90 to 25 minutes.',
  },
  {
    id: 'metro-6',
    name: 'Metro Line 6 (Pink Line)',
    status: 'Under Execution',
    description: 'High-speed east-west elevated metro corridor linking Lokhandwala to Vikhroli via JVLR.',
    benefit: 'Direct connectivity to SEEPZ, Powai tech corridor, and Eastern Express Highway.',
  },
];

export type LocationCategory = LocationNode['category'];

export interface LocationCategoryMeta {
  id: LocationCategory;
  label: string;
  /** lucide icon name, resolved in the component */
  icon: 'TrainFront' | 'ShoppingBag' | 'GraduationCap' | 'HeartPulse';
  image: string;
  imageAlt: string;
}

export const locationCategories: LocationCategoryMeta[] = [
  {
    id: 'connectivity',
    label: 'Connectivity',
    icon: 'TrainFront',
    image: '/assets/opt/city-local-train-2000.webp',
    imageAlt: 'Western Railway suburban train near Malad station',
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: 'ShoppingBag',
    image: '/assets/opt/city-shopping-2000.webp',
    imageAlt: 'A couple shopping at a mall',
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'GraduationCap',
    image: '/assets/opt/city-school-2000.webp',
    imageAlt: 'A schoolboy raising his hand in class',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: 'HeartPulse',
    image: '/assets/opt/city-hospital-2000.webp',
    imageAlt: 'A modern hospital room',
  },
];

/** Photo mosaic for the Location section (brochure page 8 composition). */
export const locationMosaic = [
  { src: '/assets/opt/city-highway-2000.webp', alt: 'Western Express Highway', span: 'wide' },
  { src: '/assets/opt/city-hospital-2000.webp', alt: 'Hospital room', span: 'std' },
  { src: '/assets/opt/city-shopping-2000.webp', alt: 'Shopping at the mall', span: 'std' },
  { src: '/assets/opt/city-school-2000.webp', alt: 'International school classroom', span: 'std' },
  { src: '/assets/opt/city-metro-2000.webp', alt: 'Mumbai Metro', span: 'std' },
  { src: '/assets/opt/city-airport-2000.webp', alt: 'Airport departure lounge at sunset', span: 'std' },
  { src: '/assets/opt/city-local-train-2000.webp', alt: 'Suburban local train', span: 'std' },
] as const;
