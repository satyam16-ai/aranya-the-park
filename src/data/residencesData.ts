import type { ResidenceUnit } from '../types';

/*
 * RERA carpet areas as confirmed by the client (1 Oct 2026), the smallest to
 * the largest unit of each type:
 *   2 BHK  699 – 880 sq.ft
 *   3 BHK  1028 – 1166 sq.ft
 *   5 BHK  1422 sq.ft
 */

export const residencesData: ResidenceUnit[] = [
  {
    id: '2bhk',
    type: '2 BHK',
    title: 'The Park Residence',
    carpetArea: '699 – 880 sq.ft',
    tag: 'Signature 2 BHK',
    // No sundeck in the 2 BHK (client, 30 Sep): the chip is hidden when empty.
    deck: '',
    description:
      'A well-planned home that is open to light and air, with a generous living room, French windows and Vastu-compliant planning throughout.',
    features: [
      'Premium Grohe fittings in all bathrooms',
      'Vitrified flooring & French windows',
      'Vastu-compliant planning',
      'Floor-to-ceiling height of up to 11 ft',
      'High-speed OTIS elevators',
    ],
    image: '/assets/opt/life-family-sofa-2000.webp',
    floorPlanImage: '/assets/opt/fp-b-2bhk-2600.webp',
  },
  {
    id: '3bhk',
    type: '3 BHK',
    title: 'The Family Residence',
    carpetArea: '1028 – 1166 sq.ft',
    tag: 'Family 3 BHK',
    // No sundeck in the 3 BHK (client, 30 Sep).
    deck: '',
    description:
      'Room for a growing family: three bedrooms, a separate dining area and French windows that bring the daylight into everyday life.',
    features: [
      'Floor-to-ceiling height of up to 11 ft',
      'Vastu-compliant planning',
      'Premium Grohe fittings in all bathrooms',
      'Video door phone',
      'Elegant glass railings',
    ],
    image: '/assets/opt/life-family-living-2000.webp',
    floorPlanImage: '/assets/opt/fp-b-3bhk-2600.webp',
  },
  {
    id: '5bhk',
    type: '5 BHK',
    title: 'The Grand Residence',
    carpetArea: '1422 sq.ft',
    tag: 'Grand 5 BHK',
    deck: 'Private Sundeck',
    description:
      'Our most generous plan, for families who want space to spread out: five bedrooms, expansive living areas and a private sundeck with open views.',
    features: [
      'Five bedrooms with expansive living areas',
      'Private sundeck with panoramic views',
      'Premium Grohe fittings in all bathrooms',
      'High-speed OTIS elevators',
      'Designer wall tiles & vitrified flooring',
    ],
    image: '/assets/opt/life-sunset-terrace-2000.webp',
    floorPlanImage: '/assets/opt/fp-b-5bhk-2600.webp',
  },
];
