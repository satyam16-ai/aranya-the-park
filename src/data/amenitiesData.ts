import type { AmenityItem } from '../types';

export const amenitiesData: AmenityItem[] = [
  // ─── GROUND FLOOR AMENITIES ───
  {
    id: 'pickleball',
    name: 'Pickleball Court',
    category: 'ground',
    categoryLabel: 'Sport & Play',
    tagline: 'A cheerful zone for shared victories & cherished bonds',
    description:
      'A 13.4 × 6 m pickleball court, made for quick morning rallies and friendly weekend doubles.',
    image: '/assets/opt/amenity-pickleball-play-2000.webp',
    badge: '13.4 × 6 m Court',
    highlights: ['Regulation Dimensions (13.4m x 6.0m)', 'Pro-Cushioned Surface', 'Evening Floodlighting'],
  },
  {
    id: 'senior-citizens',
    name: "Senior Citizens' Area",
    category: 'ground',
    categoryLabel: 'Quiet Leisure',
    tagline: 'A serene corner for the seasoned souls',
    description:
      'A calm corner set aside for unhurried conversation, the morning paper and evenings with old friends.',
    image: '/assets/opt/amenity-seniors-terrace-2000.webp',
    badge: 'Quiet Corner',
    highlights: ['Ergonomic Teak Benches', 'Tranquil Shaded Tree Canopy', 'Level Gentle Footpaths'],
  },
  {
    id: 'kids-play',
    name: "Children's Play Area",
    category: 'ground',
    categoryLabel: 'Kids & Family',
    tagline: 'A wonderland of joy for your tiny tots',
    description:
      'A dedicated outdoor play area with room to run, climb and swing, set within the landscaped grounds.',
    image: '/assets/opt/amenity-kids-swing-2000.webp',
    badge: 'Play Zone',
    highlights: ['Impact-Absorbent Flooring', 'Zero-Traffic Safe Zone', 'Shaded Seating for Parents'],
  },
  {
    id: 'fitness-center',
    name: 'Fitness Center',
    category: 'ground',
    categoryLabel: 'Wellness & Strength',
    tagline: 'A high-end gymnasium for energising workouts',
    description:
      'A 7.05 × 7.50 m gym in the fitness club, equipped for cardio and strength training, a short walk from your front door.',
    image: '/assets/opt/render-gym-2000.webp',
    badge: 'Fitness Club',
    highlights: ['Biophilic Garden Views', 'World-Class Cardio & Strength', 'Personal Trainer Bay'],
  },
  {
    id: 'games-room',
    name: 'Multipurpose Games Room',
    category: 'ground',
    categoryLabel: 'Indoor Recreation',
    tagline: 'A vibrant space for good games and great times',
    description:
      'A pool table room, card tables and carrom under one roof: the easy place for friendly rivalries and long evenings.',
    image: '/assets/opt/amenity-games-lounge-2000.webp',
    badge: 'Clubhouse',
    highlights: ['Championship Pool Table', 'Card & Board Game Tables', 'Acoustic Wall Panelling'],
  },
  {
    id: 'banquet',
    name: 'Banquet Hall',
    category: 'ground',
    categoryLabel: 'Celebrations',
    tagline: 'A venue for every occasion',
    description:
      'A banquet hall for up to 150 guests, with a stage area, green rooms and a pantry, so family occasions can be hosted at home.',
    image: '/assets/opt/amenity-banquet-hall-2000.webp',
    badge: '150 Guests',
    highlights: ['150 Guest Capacity', 'Dedicated Green Rooms', 'Full Catering Pantry'],
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Station',
    category: 'ground',
    categoryLabel: 'Eco Mobility',
    tagline: 'Charged and ready, right at home',
    description:
      'Dedicated charging for electric vehicles within the project, so your car is ready when you are.',
    image: '/assets/opt/amenity-parking-2000.webp',
    badge: 'EV Ready',
    highlights: ['Fast-Charge Ports', 'Safe Tower Parking Integration', 'Dedicated Fire Protection'],
  },
  {
    id: 'aranya-garden',
    name: 'Aroma Garden',
    category: 'ground',
    categoryLabel: 'Landscape',
    tagline: 'A fragrant walk through the green',
    description:
      'A sensory garden of fragrant planting and quiet paths, part of the BeyondGreen landscape and true to Aranya, the Sanskrit word for forest.',
    image: '/assets/opt/life-garden-walk-2000.webp',
    badge: 'By BeyondGreen',
    highlights: ['Indigenous Fragrant Flora', 'Aromatic Therapeutic Shrubs', '40% Open Green Buffer'],
  },

  // ─── TERRACE AMENITIES ───
  {
    id: 'rooftop-yoga',
    name: 'Yoga & Meditation Lawn',
    category: 'terrace',
    categoryLabel: 'Rooftop Wellness',
    tagline: 'A zen zone to balance your body, mind & soul',
    description:
      'An open-air lawn on the terrace for yoga, stretching and a few quiet minutes before the day begins.',
    image: '/assets/opt/amenity-yoga-deck-2000.webp',
    badge: 'Terrace',
    highlights: ['Sunrise Facing Deck', 'Natural Grass Turf', 'Tranquil Acoustic Heights'],
  },
  {
    id: 'party-lawn',
    name: 'Gazebo & Party Lawn',
    category: 'terrace',
    categoryLabel: 'Rooftop Entertaining',
    tagline: 'A rooftop spot for serene evenings',
    description:
      'A terrace lawn with a pergola gazebo for birthdays, get-togethers and long evenings under the open sky.',
    image: '/assets/opt/amenity-rooftop-pergola-2000.webp',
    badge: 'Rooftop Evenings',
    highlights: ['Pergolised Gazebo Seating', 'Integrated Party Illumination', 'Glass Parapet Skyline Edge'],
  },
  {
    id: 'jogging-pathway',
    name: 'Jogging Pathway',
    category: 'terrace',
    categoryLabel: 'Rooftop Fitness',
    tagline: 'A walking loop above the city',
    description:
      'A pathway around the terrace for a morning jog or an evening walk, with open views across the western suburbs.',
    image: '/assets/opt/life-family-garden-2000.webp',
    badge: 'Terrace Loop',
    highlights: ['High-Traction Jogging Surface', 'Continuous Safety Balustrade', 'Unmatched Horizon Vistas'],
  },
  {
    id: 'reflexology',
    name: 'Reflexology Pathway',
    category: 'terrace',
    categoryLabel: 'Holistic Wellness',
    tagline: 'Every step a gentle reset',
    description:
      'A textured pathway that works the soles of the feet as you walk: a simple daily ritual for tired feet.',
    image: '/assets/opt/lifestyle-park-greens-2800.webp',
    badge: 'Wellness Walk',
    highlights: ['River Stone Texture Beds', 'Parallel Handrail Support', 'Aromatherapeutic Green Borders'],
  },
  {
    id: 'terrace-gym',
    name: 'Open Terrace Gym',
    category: 'terrace',
    categoryLabel: 'Open-Air Fitness',
    tagline: 'Train in the open air',
    description:
      'Outdoor fitness stations on the terrace for bodyweight and functional training in the fresh air.',
    image: '/assets/opt/render-fitness-pavilion-2000.webp',
    badge: 'Open-Air',
    highlights: ['All-Weather Training Equipment', 'Open-Air Calisthenics', 'Sunrise Facing Orientation'],
  },
  {
    id: 'family-seating',
    name: 'Family Seating Area',
    category: 'terrace',
    categoryLabel: 'Together Time',
    tagline: 'Unwind together under open skies',
    description:
      'Comfortable terrace seating where the family can gather over evening tea and conversation.',
    image: '/assets/opt/life-sunset-terrace-2000.webp',
    badge: 'Family Corner',
    highlights: ['Architectural Wind Deflectors', 'Ergonomic All-Weather Loungers', 'Starlit Evening Views'],
  },
];

export const commonFacilities = [
  {
    id: 'cctv',
    title: '24/7 CCTV Surveillance',
    description: 'High-definition digital security cameras monitoring all entrances, driveways, lift lobbies, and amenity decks.',
  },
  {
    id: 'firefighting',
    title: 'Advanced Fire Fighting System',
    description: 'Automatic sprinklers, smoke detectors, dedicated fire elevator, refuge floors, and high-pressure hose reels.',
  },
  {
    id: 'earthquake',
    title: 'Earthquake-Resistant Structure',
    description: 'Robust RCC shear-wall engineered structure compliant with high seismic safety standards.',
  },
  {
    id: 'lifts',
    title: 'High-Speed OTIS Lifts',
    description: 'High-speed OTIS elevators with lift access extending directly up to the terrace level.',
  },
  {
    id: 'led',
    title: 'Energy-Efficient LED Illumination',
    description: 'Warm, low-energy architectural LED lighting throughout public lobbies, landscape paths, and amenity terraces.',
  },
  {
    id: 'landscaped',
    title: 'Curated Landscaped Areas',
    description: 'Extensive biophilic landscape architecture designed by BeyondGreen with 40% open green permeability.',
  },
  {
    id: 'parking',
    title: 'Fully Automatic Tower Parking',
    description: 'Intelligent multi-tier automated vehicle parking system ensuring effortless vehicle retrieval and zero ground congestion.',
  },
  {
    id: 'toilets',
    title: 'Servant Toilets on All Floors',
    description: 'Dedicated hygienic sanitation facilities on every floor lobby for domestic support staff and service personnel.',
  },
];
