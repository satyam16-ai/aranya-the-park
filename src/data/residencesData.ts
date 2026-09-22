import type { ResidenceUnit } from '../types';

export const residencesData: ResidenceUnit[] = [
  {
    id: '2bhk',
    type: '2 BHK',
    title: 'The Urban Sanctuary',
    carpetArea: 'Details On Request',
    tag: 'Signature 2 BHK',
    tower: 'Tower B',
    deck: 'Private Sunlit Deck',
    description:
      'Intelligently engineered to maximize natural light, cross-ventilation, and functional flow. Features an expansive living lounge, master bedroom suite, and a private sundeck overlooking the green landscape.',
    features: [
      'Thoughtfully designed spacious layout',
      'Private sundeck with panoramic open vistas',
      'Exquisite Grohe fittings in all bathrooms',
      'Designer vitrified tile flooring & French windows',
      '100% Vastu-compliant spatial planning',
    ],
    image: '/assets/opt/lifestyle-living-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-b-typical-2600.webp',
  },
  {
    id: '3bhk',
    type: '3 BHK',
    title: 'The Grand Boulevard',
    carpetArea: 'Details On Request',
    tag: 'Executive 3 BHK',
    tower: 'Tower A',
    deck: 'Dual Private Sundecks',
    description:
      'A palatial three-bedroom residence designed for connoisseurs of fine living. Boasts a vast entertaining living salon, dedicated dining alcove, generous master bedroom, and dual sundecks embracing morning sunshine.',
    features: [
      'Generous multi-bedroom family footprint',
      'Dual private sundecks for living & master suites',
      'Grohe sanitary luxury fittings in all bathrooms',
      'Video door phone with 24/7 lobby security link',
      'Cross-ventilated dual-aspect windows',
    ],
    image: '/assets/opt/residences-interior-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-typical-2600.webp',
  },
  {
    id: '4bhk',
    type: '4 BHK',
    title: 'The Presidential Haven',
    carpetArea: 'Details On Request',
    tag: 'Palatial 4 BHK',
    tower: 'Tower A',
    deck: 'Wraparound Skyline Sundeck',
    description:
      'An ultra-exclusive multi-generational residence offering unprecedented privacy and prestige. Highlights include dual master suites, formal family lounge, private sundeck, and panoramic Mumbai skyline vantage points.',
    features: [
      'Expansive 4 BHK multi-generational layout',
      'Wraparound sundeck with uninterrupted skyline views',
      'Premium Grohe designer bath fixtures',
      'High-speed OTIS elevator access to residence floor',
      'Dedicated servant washroom facilities on floor',
    ],
    image: '/assets/opt/lifestyle-sundeck-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-upper-2600.webp',
  },
];
