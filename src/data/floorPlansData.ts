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

/*
 * Every plan is one sheet of the architect's drawings (company_assets/Data for
 * Landing Page), rendered by scripts/optimize-photos.py — one drawing per
 * image. Carpet areas stay on the sheets and out of this copy: the copy shows
 * beneath the plan while the plan is still locked behind the enquiry form.
 */

const plan = (slug: string) => `/assets/opt/${slug}-2600.webp`;

const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };
const ordinal = (n: number) => ORDINAL[n] ?? `${n}th`;

/** Tower A's residential floors drawn one per sheet, 4th to 20th. The refuge
 *  floors (8th and 15th) are not shown. */
const TOWER_A_FLOORS = [4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20];
const towerAFloors: DetailedFloorPlan[] = TOWER_A_FLOORS.map((n) => ({
  id: `tower-a-${n}`,
  category: 'tower-a',
  categoryLabel: 'A Tower',
  floorLabel: `${ordinal(n)} Floor`,
  title: `Tower A — ${ordinal(n)} Floor`,
  subtitle: 'Residential floor',
  image: plan(`fp-a-${String(n).padStart(2, '0')}`),
  description: `The architect’s plan for the ${ordinal(n)} floor of Tower A, with flat numbers and RERA carpet areas listed on the sheet.`,
  highlights: [],
}));

export const detailedFloorPlans: DetailedFloorPlan[] = [
  // ─── MASTER LAYOUT ───
  {
    id: 'master-layout',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Master Site Plan',
    title: 'Master Layout',
    subtitle: 'Two towers, the clubhouse and landscaped grounds',
    image: plan('fp-master-layout'),
    description:
      'The complete site plan: Tower A, Tower B and the clubhouse within landscaped grounds, with the car parking tower, the children’s play area, the aroma garden, the senior citizens’ area and a 5% amenity open space, all linked by internal driveways and a ramp to the basement.',
    highlights: [
      'Tower A, Tower B and the clubhouse',
      'Aroma garden, play area and senior citizens’ area',
      'Car parking tower and basement ramp',
      'Separate residential and commercial entries',
    ],
  },
  {
    id: 'fitness-club-ground',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Clubhouse · Ground',
    title: 'Clubhouse — Ground Floor',
    subtitle: 'Gym, pool table room, carrom room and reception',
    image: plan('fp-club-ground'),
    description:
      'The clubhouse ground floor: a 7.05 × 7.50 m gym, a pool table room, a carrom room, reception and a locker area, with separate men’s and women’s toilets and a water station.',
    highlights: [
      'Gym: 7.05 × 7.50 m',
      'Pool table room: 3.71 × 5.05 m',
      'Carrom room: 4.06 × 2.35 m',
      'Reception: 2.93 × 3.05 m',
    ],
  },
  {
    id: 'clubhouse-terrace',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Clubhouse · First',
    title: 'Clubhouse — First Floor',
    subtitle: 'Pickleball court',
    image: plan('fp-club-first'),
    description:
      'Above the gym, the clubhouse’s first floor is given over to a professional-size pickleball court, reached by the clubhouse staircase.',
    highlights: ['Professional-size pickleball court', 'Staircase from the ground floor'],
  },

  // ─── A TOWER ───
  {
    id: 'tower-a-ground',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower A — Ground Floor',
    subtitle: 'Double-height entrance lobby and parking',
    image: plan('fp-a-ground'),
    description:
      'Tower A’s arrival level: a double-height entrance lobby beneath a canopy, with stilt, stack and two-wheeler parking, EV charging parking, the lift lobby and a fire lift.',
    highlights: [
      'Double-height entrance lobby: 32′7″ × 21′8″',
      'Stilt, stack and two-wheeler parking',
      'EV charging parking',
      'Lifts and a fire lift',
    ],
  },
  {
    id: 'tower-a-1st',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '1st Floor',
    title: 'Tower A — 1st Floor',
    subtitle: 'The first residential floor',
    image: plan('fp-a-01'),
    description:
      'Tower A’s first residential floor, planned around the double-height lobby below, with flat numbers and RERA carpet areas listed on the sheet.',
    highlights: ['Homes set above the double-height lobby'],
  },
  {
    id: 'tower-a-2nd-3rd',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '2nd & 3rd Floor',
    title: 'Tower A — 2nd & 3rd Floors',
    subtitle: 'Residential floors',
    image: plan('fp-a-02'),
    description:
      'The 2nd and 3rd floors of Tower A share this plan; flat numbers and RERA carpet areas are listed on the sheet.',
    highlights: [],
  },
  // The 19th floor's jodi flat follows the 19th floor.
  ...towerAFloors.filter((f) => f.id !== 'tower-a-20'),
  {
    id: 'tower-a-jodi',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '19th Floor · Jodi Flat',
    title: 'Tower A — 19th Floor Jodi Flat',
    subtitle: 'Flats 1903 and 1904 combined',
    image: plan('fp-a-jodi'),
    description:
      'A jodi flat on the 19th floor of Tower A: flats 1903 and 1904 joined into a single residence, drawn with its RERA carpet area.',
    highlights: ['Two flats joined into one residence'],
  },
  ...towerAFloors.filter((f) => f.id === 'tower-a-20'),
  {
    id: 'tower-a-terrace',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: 'Terrace',
    title: 'Tower A — Terrace',
    subtitle: 'The rooftop amenity terrace',
    image: plan('fp-a-roof'),
    description:
      'Tower A’s roof, laid out as an amenity terrace: a walking pathway, a yoga and meditation lawn, an open gym, family seating, and a party lawn with a pergola and lounges.',
    highlights: ['Walking pathway', 'Yoga and meditation lawn', 'Open gym and family seating'],
  },

  // ─── B TOWER ───
  {
    id: 'tower-b-ground',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower B — Ground Floor',
    subtitle: 'Entrance lobby and banquet hall',
    image: plan('fp-b-ground'),
    description:
      'Tower B’s ground floor: a double-height entrance lobby, and the banquet hall with its stage area, green room, pantry and wash area.',
    highlights: ['Double-height entrance lobby', 'Banquet hall: 1,432 sq ft', 'Stage area, green room and pantry'],
  },
  {
    id: 'tower-b-1st',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '1st Floor',
    title: 'Tower B — 1st Floor',
    subtitle: 'The first residential floor',
    image: plan('fp-b-first'),
    description:
      'Tower B’s first residential floor, set beside the double-height lobby, with homes and a yogalaya on the same level.',
    highlights: ['Homes beside the double-height lobby', 'A yogalaya on this floor'],
  },
  {
    id: 'tower-b-typical',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '2nd–21st Floor',
    title: 'Tower B — 2nd to 21st Floors',
    subtitle: 'The typical floor plan',
    image: plan('fp-b-typical'),
    description:
      'The typical floor of Tower B, repeated from the 2nd to the 21st floor, with flat numbers and RERA carpet areas listed on the sheet.',
    highlights: ['Typical floor, 2nd to 21st'],
  },
  {
    id: 'tower-b-2bhk',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '2 BHK Unit',
    title: 'Tower B — 2 BHK',
    subtitle: 'Unit plan',
    image: plan('fp-b-2bhk'),
    description: 'A 2 BHK home in Tower B, drawn room by room with its RERA carpet area.',
    highlights: [],
  },
  {
    id: 'tower-b-3bhk',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '3 BHK Unit',
    title: 'Tower B — 3 BHK',
    subtitle: 'Unit plan',
    image: plan('fp-b-3bhk'),
    description: 'A 3 BHK home in Tower B, drawn room by room with its RERA carpet area.',
    highlights: [],
  },
  {
    id: 'tower-b-5bhk',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '5 BHK Unit',
    title: 'Tower B — 5 BHK',
    subtitle: 'Unit plan',
    image: plan('fp-b-5bhk'),
    description: 'A 5 BHK home in Tower B, drawn room by room with its RERA carpet area.',
    highlights: [],
  },
  {
    id: 'tower-b-terrace',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Terrace',
    title: 'Tower B — Terrace',
    subtitle: 'The rooftop amenity terrace',
    image: plan('fp-b-roof'),
    description:
      'Tower B’s roof, laid out as an amenity terrace: a party lawn with a pergola, a reflexology path, stepping stones, an open gym and a gazebo.',
    highlights: ['Party lawn with pergola', 'Reflexology path and stepping stones', 'Open gym and gazebo'],
  },
];
