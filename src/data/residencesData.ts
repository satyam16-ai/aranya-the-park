import type { ResidenceUnit } from '../types';

export const residencesData: ResidenceUnit[] = [
  {
    id: '2bhk',
    type: '2 BHK',
    title: 'The Urban Sanctuary',
        tag: 'Signature 2 BHK',
    tower: 'Tower B',
    deck: 'Private Sunlit Deck',
    ceilingHeight: 'Up to 11 Ft.',
    description:
      'Intelligently engineered to maximize natural light, cross-ventilation, and functional flow. Features an expansive living lounge, master bedroom suite, and a private sundeck overlooking the green landscape.',
    features: [
      'Thoughtfully designed spacious layout',
      'Private sundeck with panoramic open vistas',
      'Floor-to-ceiling height up to 11 feet',
      'Exquisite Grohe fittings in all bathrooms',
      'Designer vitrified tile flooring & French windows',
      '100% Vastu-compliant spatial planning',
    ],
    threeDUrl:
      'https://surbhi-infotech.s3.ap-south-1.amazonaws.com/Aranya_The_Park/aranya_the_park_b_2bhk-699/index.html',
    threeDThumbnail: '/assets/opt/life-family-living-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-b-typical-2600.webp',
  },
  {
    id: '3bhk',
    type: '3 BHK',
    title: 'The Grand Boulevard',
        tag: 'Executive 3 BHK',
    tower: 'Tower A',
    deck: 'Dual Private Sundecks',
    ceilingHeight: 'Up to 11 Ft.',
    description:
      'A palatial three-bedroom residence designed for connoisseurs of fine living. Boasts a vast entertaining living salon, dedicated dining alcove, generous master bedroom, and dual sundecks embracing morning sunshine.',
    features: [
      'Generous multi-bedroom family footprint',
      'Dual private sundecks for living & master suites',
      'Up to 11 ft. soaring ceiling clearance',
      'Grohe sanitary luxury fittings in all bathrooms',
      'Video door phone with 24/7 lobby security link',
      'Cross-ventilated dual-aspect windows',
    ],
    threeDUrl:
      'https://surbhi-infotech.s3.ap-south-1.amazonaws.com/Aranya_The_Park/aranya_the_park_b_3bhk-1066/index.html',
    threeDThumbnail: '/assets/opt/life-family-sofa-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-typical-2600.webp',
  },
  {
    id: '4bhk',
    type: '4 BHK',
    title: 'The Presidential Haven',
        tag: 'Palatial 4 BHK',
    tower: 'Tower A · Upper floors',
    deck: 'Wraparound Skyline Sundeck',
    ceilingHeight: 'Up to 11 Ft.',
    description:
      'An ultra-exclusive multi-generational residence offering unprecedented privacy and prestige. Highlights include dual master suites, formal family lounge, private sundeck, and panoramic Mumbai skyline vantage points.',
    features: [
      'Expansive 4 BHK multi-generational layout',
      'Wraparound sundeck with uninterrupted skyline views',
      'Soaring 11 ft ceiling heights throughout',
      'Premium Grohe designer bath fixtures',
      'High-speed OTIS elevator access to residence floor',
      'Dedicated servant washroom facilities on floor',
    ],
    threeDUrl: undefined,
    threeDThumbnail: '/assets/opt/life-sunset-terrace-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-upper-2600.webp',
  },
];
