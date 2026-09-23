export interface ProjectInfo {
  name: string;
  tagline: string;
  positioning: string;
  location: string;
  city: string;
  address: string;
  mahaRera: string;
  /** Official channels. Entries with an empty url are not rendered. */
  socials: { label: 'Instagram' | 'Facebook' | 'YouTube' | 'LinkedIn'; url: string }[];
  reraUrl: string;
  /** Google Business Profile short link. Falls back to a maps address search when empty. */
  googleBusinessUrl: string;
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
  }[];
}

export interface ResidenceUnit {
  id: string;
  type: string;
  title: string;
  carpetArea: string;
  tag: string;
  deck: string;
  description: string;
  features: string[];
  /** Which tower this configuration sits in. */
  tower: string;
  image: string;
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
