import type { ResidenceUnit } from '../types';

export const residencesData: ResidenceUnit[] = [
  {
    id: '2bhk',
    type: '2 BHK',
    title: 'The Park Residence',
    carpetArea: 'On Request',
    tag: 'Signature 2 BHK',
    tower: 'Tower B',
    deck: 'Private Sundeck',
    description:
      'A well-planned home that is open to light and air, with a generous living room, a private sundeck overlooking the greens and Vastu-compliant planning throughout.',
    features: [
      'Private sundeck with panoramic views',
      'Premium Grohe fittings in all bathrooms',
      'Vitrified flooring & French windows',
      'Vastu-compliant planning',
      'Floor-to-ceiling height of up to 11 ft',
    ],
    image: '/assets/opt/lifestyle-living-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-b-typical-2600.webp',
  },
  {
    id: '3bhk',
    type: '3 BHK',
    title: 'The Sundeck Residence',
    carpetArea: 'On Request',
    tag: 'Family 3 BHK',
    tower: 'Tower A',
    deck: 'Private Sundeck',
    description:
      'Room for a growing family: three bedrooms, a separate dining area and a private sundeck that brings the outdoors into everyday life.',
    features: [
      'Floor-to-ceiling height of up to 11 ft',
      'Private sundeck with panoramic views',
      'Premium Grohe fittings in all bathrooms',
      'Video door phone',
      'Elegant glass railings',
    ],
    image: '/assets/opt/residences-interior-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-typical-2600.webp',
  },
  {
    id: '4bhk',
    type: '4 BHK',
    title: 'The Grand Residence',
    carpetArea: 'On Request',
    tag: 'Grand 4 BHK',
    tower: 'Tower A',
    deck: 'Private Sundeck',
    description:
      'Our most generous plan, for families who want space to spread out: four bedrooms, expansive living areas and a private sundeck with open views.',
    features: [
      'Four bedrooms with expansive living areas',
      'Private sundeck with panoramic views',
      'Premium Grohe fittings in all bathrooms',
      'High-speed OTIS elevators',
      'Designer wall tiles & vitrified flooring',
    ],
    image: '/assets/opt/lifestyle-sundeck-2000.webp',
    floorPlanImage: '/assets/opt/plan-tower-a-upper-2600.webp',
  },
];
