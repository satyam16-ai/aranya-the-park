import type { ResidenceUnit } from '../types';

/*
 * Areas are RERA carpet ranges read off the architect's floor sheets
 * (company_assets/Data for Landing Page/Floor Plans), across every floor:
 *   2 BHK  679 (Tower B flat 02) to 904 sq.ft (Tower A 203/204, with a study)
 *   3 BHK  993 (Tower B flat 03) to 1195 sq.ft (Tower A 901)
 *   5 BHK  1382 (Tower B 5 BHK) to 1675 sq.ft (Tower A 1903 + 1904 jodi)
 * Re-read the sheets if the architect issues new ones.
 */

export const residencesData: ResidenceUnit[] = [
  {
    id: '2bhk',
    type: '2 BHK',
    title: 'The Park Residence',
    carpetArea: '679 – 904 sq.ft',
    tag: 'Signature 2 BHK',
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
    image: '/assets/opt/life-family-sofa-2000.webp',
    floorPlanImage: '/assets/opt/fp-b-2bhk-2600.webp',
  },
  {
    id: '3bhk',
    type: '3 BHK',
    title: 'The Sundeck Residence',
    carpetArea: '993 – 1195 sq.ft',
    tag: 'Family 3 BHK',
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
    image: '/assets/opt/life-family-living-2000.webp',
    floorPlanImage: '/assets/opt/fp-b-3bhk-2600.webp',
  },
  {
    id: '5bhk',
    type: '5 BHK',
    title: 'The Grand Residence',
    carpetArea: '1382 – 1675 sq.ft',
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
