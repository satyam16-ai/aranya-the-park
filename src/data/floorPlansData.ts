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
    title: 'Integrated Master Layout Plan',
    subtitle: 'Comprehensive Site Plan with 18.3m Boulevard & Open Greens',
    image: '/assets/opt/master-layout-plan-2600.webp',
    description:
      'The comprehensive master layout showcasing Tower A and Tower B footprints, 18.3m wide private access boulevard leading from New Link Road, 6.0m arterial circulation driveways, aroma gardens, children’s play park, senior citizen haven, and 5% dedicated amenity open space.',
    highlights: [
      '18.3m wide direct access avenue to New Link Road',
      'Dual residential towers: Tower A & Tower B',
      'Continuous 6.00m two-way peripheral driveway',
      'Biophilic aroma gardens & dedicated children’s play park',
      'Multi-tier automated tower parking system',
    ],
  },
  {
    id: 'fitness-club-ground',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Fitness Club Ground Floor',
    title: 'Fitness Club — Ground Level Sports Layout',
    subtitle: 'Regulation Pickleball Arena, Games Room & Arrival Reception',
    image: '/assets/opt/plan-clubhouse-ground-2600.webp',
    description:
      'Ground floor sports facility blueprint featuring regulation Pickleball Court (13.40m x 6.00m), reception lobby (3.43m x 2.35m), indoor games area (3.43m x 2.85m), card table zone, and terrace access stairs.',
    highlights: [
      'Regulation Pickleball Court: 13.40m x 6.00m (+450mm lvl)',
      'Arrival Reception Lobby: 3.43m x 2.35m',
      'Card Table & Indoor Games Arena',
      'Ground-level fitness club entrance',
    ],
  },
  {
    id: 'clubhouse-terrace',
    category: 'master',
    categoryLabel: 'Master Layout',
    floorLabel: 'Club House Terrace Floor Plan',
    title: 'Club House — Terrace Level Recreation Plan',
    subtitle: 'Billiards Lounge, Pool Arena & Outdoor Terrace (+4200mm)',
    image: '/assets/opt/plan-clubhouse-ground-2600.webp',
    description:
      'Terrace clubhouse layout at +4200mm level featuring the expansive Billiards & Pool Table Arena (9.71m x 5.05m), outdoor leisure terrace (7.05m x 7.50m), and circulation lobby (2.03m x 1.00m).',
    highlights: [
      'Billiards & Pool Table Arena: 9.71m x 5.05m',
      'Outdoor Recreation Terrace: 7.05m x 7.50m (+4200mm lvl)',
      'Direct staircase connection from Ground Sports Club',
      'Panoramic garden views overlooking green landscape',
    ],
  },

  // ─── A TOWER ───
  {
    id: 'tower-a-ground',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower A — Ground Floor & Terrace Layout',
    subtitle: 'Double-Height AC Lobby (9.98m x 6.65m), 3-Stack Parking & Sky Terrace',
    image: '/assets/opt/plan-tower-a-ground-terrace-2600.webp',
    description:
      'Grand arrival level of Tower A featuring the majestic double-height air-conditioned entrance lobby (9.98m x 6.65m), stilt parking, 3-stack automated car parking bays (7.97m x 3.10m), canopy drop-off, and sky terrace seating layout.',
    highlights: [
      'Double-height AC Entrance Lobby: 9.98m x 6.65m',
      'Automated 3-stack parking bays: 7.97m x 3.10m',
      'Grand canopy arrival drop-off',
      'Sky terrace with yoga & family seating pavilion',
    ],
  },
  {
    id: 'tower-a-1st',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '1st Floor',
    title: 'Tower A — 1st Floor Residence Layout',
    subtitle: 'First Habitable Level with Private Balconies & Dining Foyers',
    image: '/assets/opt/plan-tower-a-2nd-3rd-2600.webp',
    description:
      'Detailed blueprint of Tower A first habitable residence floor. Shows private balconies, 0.75m architectural chajja weather protections, dining foyers, and external AC ledge service niches.',
    highlights: [
      'Generous private balconies with open green vistas',
      '0.75m architectural chajja weather protection',
      'Dedicated dining foyers and circulation passages',
      'External AC ledges for soundless interior living',
    ],
  },
  {
    id: 'tower-a-2nd-3rd',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '2nd & 3rd Floor',
    title: 'Tower A — 2nd & 3rd Floor Plan',
    subtitle: 'Balconies, Dining Passages & Weather-Protected Chajjas',
    image: '/assets/opt/plan-tower-a-2nd-3rd-2600.webp',
    description:
      'Architectural layout of Tower A 2nd and 3rd floors. Demonstrates symmetric residence arrangement, wide living balconies, 0.75m chajjas, and structural utility ducts.',
    highlights: [
      'Multi-bedroom living suites with attached balconies',
      'Independent passage connections (1.05m x 3.39m)',
      'Dedicated AC service ledges (1.2m x 2.1m)',
      'Vastu-aligned main entrance thresholds',
    ],
  },
  {
    id: 'tower-a-5th-14th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '5th–14th Floor',
    title: 'Tower A — 5th to 14th Floor Typical Plan',
    subtitle: 'Signature Typical Floor Plate with High-Speed OTIS Lift Core',
    image: '/assets/opt/plan-tower-a-typical-2600.webp',
    description:
      'Core mid-rise residential floor plate of Tower A. High-speed OTIS elevator core, fire lift, wide staircases, dedicated dining halls, external service ducts, and French window balcony embrasures.',
    highlights: [
      'Mid-rise vantage points with unhindered cross-ventilation',
      'High-speed OTIS elevators',
      'Separate dining areas and ergonomic kitchen layouts',
    ],
  },
  {
    id: 'tower-a-16th-18th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '16th–18th Floor',
    title: 'Tower A — 16th to 18th Floor Plan',
    subtitle: 'Upper Mid-Rise Residences with Extended Balconies',
    image: '/assets/opt/plan-tower-a-typical-2600.webp',
    description:
      'Upper mid-rise layouts in Tower A rising above surrounding tree canopies. Features expansive private balconies (3.52m x 1.25m), dining foyers, and master suites with dual-aspect cross-breezes.',
    highlights: [
      'Expansive private sundecks: 3.52m x 1.25m',
      'Elevated windflow and abundant daylight penetration',
      'High-grade acoustic isolation between residence units',
      'MahaRERA compliant fire safety refuge floor connectivity',
    ],
  },
  {
    id: 'tower-a-19th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '19th Floor',
    title: 'Tower A — 19th Floor Palatial Layout',
    subtitle: 'High-Altitude Residence Floor with Panoramic City Horizons',
    image: '/assets/opt/plan-tower-a-upper-2600.webp',
    description:
      'High-altitude 19th floor layout in Tower A. Large family suites, dual-aspect dining halls (3.30m x 1.80m), expansive sundecks (3.43m x 1.32m), and premium privacy.',
    highlights: [
      'Panoramic western horizon and sunset views',
      'Extended living salon balconies: 3.43m x 1.32m',
      'Dedicated servant washrooms on floor lobby',
      'Multi-bedroom combinations for bespoke large families',
    ],
  },
  {
    id: 'tower-a-20th',
    category: 'tower-a',
    categoryLabel: 'A Tower',
    floorLabel: '20th Floor',
    title: 'Tower A — 20th Floor Presidential Plan',
    subtitle: 'Top-Tier Luxury Residences & Duplex Amalgamation Layout',
    image: '/assets/opt/plan-tower-a-upper-2600.webp',
    description:
      'Penultimate residence tier of Tower A. Showcases palatial room dimensions, multiple master suites, wrap-around sundeck access, and direct high-speed elevator connectivity to the rooftop sky lounge.',
    highlights: [
      'Top-floor exclusivity with panoramic vistas above Malad West',
      'Custom 4 BHK presidential combination layouts',
      'Direct elevator access to rooftop zen amenities',
      'Premium Grohe fittings in all bathrooms',
    ],
  },

  // ─── B TOWER ───
  {
    id: 'tower-b-ground',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Ground Floor',
    title: 'Tower B — Ground Banquet & Terrace Haven',
    subtitle: '150-Guest Banquet Hall, Stage, Pantry & Rooftop Pergola',
    image: '/assets/opt/plan-tower-b-ground-terrace-2600.webp',
    description:
      'Tower B Ground Level hosts the lavish 150-guest Grand Banquet Hall with presentation stage, dedicated green rooms, and catering pantry. Also displays the rooftop reflexology path, stepping stones, and flower bed terrace.',
    highlights: [
      '150-guest air-conditioned Grand Banquet Hall',
      'Performance stage & dual private green rooms',
      'Catering pantry & guest wash areas',
      'Rooftop reflexology stone pathway & timber pergola',
    ],
  },
  {
    id: 'tower-b-1st',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '1st Floor',
    title: 'Tower B — 1st Floor Residence Plan',
    subtitle: 'First Habitable Floor with Garden Canopy Facing Balconies',
    image: '/assets/opt/plan-tower-b-typical-2600.webp',
    description:
      'Tower B first residential floor plate featuring 2 BHK and 3 BHK homes overlooking the central landscape park. Features dedicated kitchens (2.75m x 2.13m), dining alcoves, and private sundecks.',
    highlights: [
      'Direct views over the 40% open green landscaped grounds',
      'Ergonomic kitchen design: 2.75m x 2.13m',
      'Private sundecks attached to living salons',
      'Vastu-compliant east-west circulation',
    ],
  },
  {
    id: 'tower-b-typical',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: '2nd–21st Floor',
    title: 'Tower B — 2nd to 21st Floor Typical Plan',
    subtitle: 'Signature 2 BHK & 3 BHK Residences',
    image: '/assets/opt/plan-tower-b-typical-2600.webp',
    description:
      'The core typical floor plate of Tower B from 2nd to 21st floors. Hosts the signature 2 BHK and 3 BHK residences with well-proportioned bedrooms, dining salons, and private sundecks.',
    highlights: [
      'Thoughtfully planned 2 BHK & 3 BHK usable layouts',
      'Master bedrooms with private en-suite Grohe bathrooms',
      'Generous dining alcoves: 3.85m x 1.47m',
    ],
  },
  {
    id: 'tower-b-refuge',
    category: 'tower-b',
    categoryLabel: 'B Tower',
    floorLabel: 'Refuge Floor',
    title: 'Tower B — 20th & 21st Floor Refuge Plan',
    subtitle: 'Upper Floor Living with Integrated Safety Refuge Balcony (2.15m x 1.53m)',
    image: '/assets/opt/plan-tower-b-upper-2600.webp',
    description:
      'Upper-tier residential layout for Tower B 20th and 21st floors. Illustrates the mandatory statutory fire refuge area (2.15m x 1.53m), adjoining 3 BHK bedrooms (3.40m x 3.60m), and high-altitude living salons.',
    highlights: [
      'Approved MahaRERA & CFO fire refuge area: 2.15m x 1.53m',
      'Panoramic high-floor vistas across Malad West',
      'Master suite bedrooms with external weather chajjas',
    ],
  },
];
