export interface DetailedFloorPlan {
  id: string;
  category: 'master' | 'tower-a' | 'tower-b';
  categoryLabel: string;
  floorLabel: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  highlights: string[];
}

export const detailedFloorPlans: DetailedFloorPlan[] = [
  // ─── MASTER LAYOUT ───
  {
    id: 'master-layout',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Master Site Plan',
    title: 'Master Layout',
    subtitle: 'Two towers, landscaped grounds and an 18.3 m access road',
    image: '/assets/opt/master-layout-plan-2600.webp',
    description:
      'The complete site plan: Tower A and Tower B within landscaped grounds, the 18.3 m access road from New Link Road, 6 m internal driveways, the car parking tower, the aroma garden, the children’s play area, the senior citizens’ area and a 5% amenity open space.',
    highlights: [
      '18.3 m-wide access road to New Link Road',
      'Tower A and Tower B within landscaped grounds',
      '6 m-wide internal driveways',
      'Aroma garden, play area and senior citizens’ area',
      'Automated car parking tower',
    ],
  },
  {
    id: 'fitness-club-ground',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Fitness Club · Ground',
    title: 'Fitness Club — Ground Floor',
    subtitle: 'Gym, pool table room, games area and reception',
    image: '/assets/opt/plan-clubhouse-ground-2600.webp',
    description:
      'The fitness club’s ground floor brings together a 7.05 × 7.50 m gym, a pool table room, a games area for cards and carrom, and a reception lobby, with washrooms and a water station.',
    highlights: [
      'Gym: 7.05 × 7.50 m',
      'Pool table room: 3.71 × 5.05 m',
      'Games area for cards & carrom: 3.43 × 2.85 m',
      'Reception lobby: 3.43 × 2.35 m',
    ],
  },
  {
    id: 'clubhouse-terrace',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Club House · Terrace',
    title: 'Club House — Terrace Level',
    subtitle: 'Pickleball court at the +4,200 mm level',
    image: '/assets/opt/plan-clubhouse-ground-2600.webp',
    description:
      'Above the fitness club, the terrace holds a 13.40 × 6.00 m pickleball court at the +4,200 mm level, reached by a staircase from the ground floor.',
    highlights: [
      'Pickleball court: 13.40 × 6.00 m',
      'Terrace at the +4,200 mm level',
      'Staircase from the fitness club below',
    ],
  },

  // ─── A TOWER ───
  {
    id: 'tower-a-ground',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower A — Ground Floor & Terrace',
    subtitle: 'Double-height lobby, parking and the rooftop amenity terrace',
    image: '/assets/opt/plan-tower-a-ground-terrace-2600.webp',
    description:
      'Tower A’s arrival level, with a double-height air-conditioned entrance lobby beneath a canopy drop-off and stilt and stack parking on either side, shown with the terrace above: walking path, yoga and meditation lawn, open gym, family seating and party lawn.',
    highlights: [
      'Double-height air-conditioned entrance lobby',
      'Canopy drop-off at the entrance',
      'Stilt and stack parking',
      'Terrace walking path, yoga lawn & open gym',
    ],
  },
  {
    id: 'tower-a-1st',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '1st Floor',
    title: 'Tower A — 1st Floor',
    subtitle: 'The first residential floor, above the double-height lobby',
    image: '/assets/opt/plan-tower-a-2nd-3rd-2600.webp',
    description:
      'The first residential level of Tower A, planned around the double-height lobby below. Homes have separate dining areas, balconies, chajjas for weather protection and dedicated AC ledges.',
    highlights: [
      'Homes set above the double-height lobby',
      'Separate dining areas',
      'Balconies and chajjas',
      'Dedicated AC ledges',
    ],
  },
  {
    id: 'tower-a-2nd-3rd',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '2nd & 3rd Floor',
    title: 'Tower A — 2nd & 3rd Floors',
    subtitle: 'Residential floors around a central lift core',
    image: '/assets/opt/plan-tower-a-2nd-3rd-2600.webp',
    description:
      'Tower A’s 2nd and 3rd floors: a mirrored arrangement of homes around a central lift core, each with living and dining areas, bedrooms with attached baths, balconies and AC ledges.',
    highlights: [
      'Mirrored homes around a central lift core',
      'Living and dining areas in every home',
      'Balconies, chajjas and AC ledges',
    ],
  },
  {
    id: 'tower-a-5th-14th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '5th–14th Floor',
    title: 'Tower A — 5th to 14th Floors',
    subtitle: 'The typical floor plan',
    image: '/assets/opt/plan-tower-a-typical-2600.webp',
    description:
      'The typical floor of Tower A, repeated from the 5th to the 14th floor: homes arranged around a core of high-speed OTIS elevators, with separate dining areas and well-planned kitchens.',
    highlights: [
      'Typical floor, 5th to 14th',
      'High-speed OTIS elevators',
      'Separate dining areas and well-planned kitchens',
    ],
  },
  {
    id: 'tower-a-16th-18th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '16th–18th Floor',
    title: 'Tower A — 16th to 18th Floors',
    subtitle: 'Upper floors with wider views',
    image: '/assets/opt/plan-tower-a-typical-2600.webp',
    description:
      'Tower A’s upper residential floors, from the 16th to the 18th, with balconies and private sundecks that open to wider views over Malad West.',
    highlights: [
      'Upper floors, 16th to 18th',
      'Balconies and private sundecks',
      'Wider views over Malad West',
      'High-speed OTIS elevators',
    ],
  },
  {
    id: 'tower-a-19th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '19th Floor',
    title: 'Tower A — 19th Floor',
    subtitle: 'High-floor residences',
    image: '/assets/opt/plan-tower-a-upper-2600.webp',
    description:
      'The 19th floor of Tower A: high-floor homes with separate dining areas, balconies and private sundecks, served by the central lift core.',
    highlights: [
      'High-floor residences',
      'Separate dining areas',
      'Balconies and private sundecks',
      'Servant toilets on every floor',
    ],
  },
  {
    id: 'tower-a-20th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '20th Floor',
    title: 'Tower A — 20th Floor',
    subtitle: 'The upper residential floor',
    image: '/assets/opt/plan-tower-a-upper-2600.webp',
    description:
      'The 20th floor of Tower A, among the tower’s highest residential levels, with lift access continuing up to the terrace amenities.',
    highlights: [
      'Among Tower A’s highest residential floors',
      'Lift access up to the terrace',
      'Premium Grohe fittings in all bathrooms',
    ],
  },

  // ─── B TOWER ───
  {
    id: 'tower-b-ground',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower B — Ground Floor & Terrace',
    subtitle: 'Entrance lobby, banquet hall and the rooftop party lawn',
    image: '/assets/opt/plan-tower-b-ground-terrace-2600.webp',
    description:
      'Tower B’s ground floor pairs a double-height entrance lobby and society office with the banquet hall, complete with stage area, green rooms, pantry and wash area. The terrace above holds a party lawn with pergola, a reflexology path, stepping stones and an open gym.',
    highlights: [
      'Double-height entrance lobby',
      'Banquet hall for up to 150 guests',
      'Stage area, green rooms and pantry',
      'Terrace party lawn, pergola & reflexology path',
    ],
  },
  {
    id: 'tower-b-1st',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '1st Floor',
    title: 'Tower B — 1st Floor',
    subtitle: 'The first residential floor',
    image: '/assets/opt/plan-tower-b-typical-2600.webp',
    description:
      'The first residential floor of Tower B, set beside the double-height lobby. Homes have separate dining areas, well-planned kitchens and chajjas for weather protection.',
    highlights: [
      'Homes beside the double-height lobby',
      'Separate dining areas',
      'Well-planned kitchens',
      'Vastu-compliant planning',
    ],
  },
  {
    id: 'tower-b-typical',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '2nd–21st Floor',
    title: 'Tower B — 2nd to 21st Floors',
    subtitle: 'The typical floor plan',
    image: '/assets/opt/plan-tower-b-typical-2600.webp',
    description:
      'The typical floor of Tower B, from the 2nd to the 21st floor: homes with living and dining areas, bedrooms with attached baths, and balconies.',
    highlights: [
      'Typical floor, 2nd to 21st',
      'Living and dining areas in every home',
      'Premium Grohe fittings in all bathrooms',
    ],
  },
  {
    id: 'tower-b-refuge',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Refuge Floor',
    title: 'Tower B — Refuge Floor',
    subtitle: 'Residences alongside a dedicated refuge area',
    image: '/assets/opt/plan-tower-b-upper-2600.webp',
    description:
      'The refuge floor of Tower B: residences planned alongside a dedicated refuge area, part of the tower’s fire-safety design.',
    highlights: [
      'Dedicated refuge area',
      'Part of the advanced fire-safety systems',
      'High-floor residences',
    ],
  },
];
