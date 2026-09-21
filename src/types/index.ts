export interface ProjectInfo {
  name: string;
  tagline: string;
  positioning: string;
  location: string;
  city: string;
  address: string;
  mahaRera: string;
  reraUrl: string;
  phone: string;
  phoneRaw: string;
  emailPlaceholder: string;
  developer: string;
  jointVenture: string;
  architect: string;
  landscapeArchitect: string;
  interiorDesigner: string;
  rccConsultant: string;
  legalAdvisor: string;
  stats: {
    label: string;
    value: string;
    subtext: string;
  }[];
  hallmarks: {
    id: string;
    title: string;
    description: string;
    icon: string;
    /** When set, the hallmark renders as a photo tile in the Highlights bento. */
    image?: string;
    imageAlt?: string;
    /** CSS object-position for the tile crop. */
    focus?: string;
  }[];
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  /** Short line shown under the render, after "Artist's impression". */
  caption: string;
  /** CSS object-position for the near-square desktop frame and the tall phone backdrop. */
  focus: { desktop: string; phone: string };
}

export interface ResidenceUnit {
  id: string;
  type: string;
  title: string;
  /** Carpet area in sq ft — omitted until the client supplies it. */
  carpetArea?: string;
  tower?: string;
  tag: string;
  deck: string;
  ceilingHeight: string;
  description: string;
  features: string[];
  threeDUrl?: string;
  threeDThumbnail: string;
  floorPlanImage: string;
}

export interface AmenityItem {
  id: string;
  name: string;
  category: 'ground' | 'terrace' | 'building';
  categoryLabel: string;
  tagline: string;
  description: string;
  image: string;
  badge?: string;
  attribution?: string;
  highlights: string[];
}

export interface FloorPlanItem {
  id: string;
  tower: 'Tower A' | 'Tower B' | 'Master Layout';
  floorLevel: string;
  title: string;
  category: 'typical' | 'special' | 'master' | 'terrace';
  image: string;
  description: string;
  highlights: string[];
}

export interface LocationNode {
  id: string;
  name: string;
  category: 'connectivity' | 'entertainment' | 'education' | 'healthcare';
  time: string;
  distanceNote?: string;
  routeNote?: string;
  coords?: { x: number; y: number };
  highlight?: boolean;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  status: string;
  description: string;
  benefit: string;
}

export interface SpecificationCategory {
  category: string;
  items: {
    feature: string;
    detail: string;
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'exterior' | 'interior' | 'amenities' | 'lifestyle' | 'architecture' | 'residences';
  secondaryCategories?: ('exterior' | 'interior' | 'amenities' | 'lifestyle' | 'architecture')[];
  categoryLabel: string;
  image: string;
  caption: string;
  attribution?: string;
  aspect?: 'portrait' | 'landscape' | 'wide' | 'tall';
}

export interface ConsultantPartner {
  role: string;
  name: string;
  description?: string;
}
