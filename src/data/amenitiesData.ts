import type { AmenityItem } from '../types';

export const amenitiesData: AmenityItem[] = [
  // ─── GROUND FLOOR AMENITIES ───
  {
    id: 'pickleball',
    name: 'Pickle Ball Court',
    category: 'ground',
    categoryLabel: 'Ground Level Sport',
    tagline: 'A cheerful zone for shared victories & cherished bonds',
    description:
      'Regulation-standard outdoor pickleball court engineered with pro-grade non-slip cushioned sports turf, evening floodlighting, and viewing benches for spirited friendly matches.',
    image: '/assets/opt/amenity-pickleball-2000.webp',
    badge: 'Trending Sport',
    highlights: ['Regulation Dimensions (13.4m x 6.0m)', 'Pro-Cushioned Surface', 'Evening Floodlighting'],
  },
  {
    id: 'senior-citizens',
    name: "Senior Citizens' Area",
    category: 'ground',
    categoryLabel: 'Tranquility & Peace',
    tagline: 'A serene corner for seasoned souls',
    description:
      'A peaceful botanical enclave nestled away from vehicular pathways, furnished with ergonomic shaded benches, flowering planters, and gentle walking trails.',
    image: '/assets/opt/amenity-senior-citizens-2000.webp',
    badge: 'Quiet Sanctuary',
    highlights: ['Ergonomic Teak Benches', 'Tranquil Shaded Tree Canopy', 'Level Gentle Footpaths'],
  },
  {
    id: 'kids-play',
    name: "Children's Play Area",
    category: 'ground',
    categoryLabel: 'Kids & Family',
    tagline: 'A wonderland of joy for your tiny-tots',
    description:
      'Secure adventure haven equipped with sensory play structures, slides, swings, and soft-turf safety surfaces to let your little ones explore without bounds.',
    image: '/assets/opt/amenity-kids-play-2000.webp',
    badge: 'Child Safe',
    highlights: ['Impact-Absorbent Flooring', 'Zero-Traffic Safe Zone', 'Shaded Seating for Parents'],
  },
  {
    id: 'fitness-center',
    name: 'Fitness Center',
    category: 'ground',
    categoryLabel: 'Wellness & Strength',
    tagline: 'A high-end gymnasium for energising workouts',
    description:
      'Architecturally designed fitness sanctuary fitted with world-class cardio stations, free weights, resistance machines, and dedicated stretching bays overlooking landscaped gardens.',
    image: '/assets/opt/amenity-fitness-center-2000.webp',
    badge: 'Fully Equipped',
    highlights: ['Biophilic Garden Views', 'World-Class Cardio & Strength', 'Personal Trainer Bay'],
  },
  {
    id: 'games-room',
    name: 'Multipurpose Games Room',
    category: 'ground',
    categoryLabel: 'Indoor Recreation',
    tagline: 'A vibrant space for good games and great times',
    description:
      'Bespoke leisure clubroom featuring a championship tournament pool table (9.71m x 5.05m), card tables, board game alcoves, and relaxed spectator seating.',
    image: '/assets/opt/amenity-games-room-2000.webp',
    badge: 'Clubhouse Level',
    highlights: ['Championship Pool Table', 'Card & Board Game Tables', 'Acoustic Wall Panelling'],
  },
  {
    id: 'banquet',
    name: 'Banquet Hall',
    category: 'ground',
    categoryLabel: 'Celebration Arena',
    tagline: 'A venue for every grand family occasion',
    description:
      'Air-conditioned banquet venue accommodating up to 150 guests. Equipped with an elevated presentation stage, dedicated green rooms, serving pantry, and separate wash areas.',
    image: '/assets/opt/amenity-banquet-gazebo-2000.webp',
    badge: '150-Guest Capacity',
    highlights: ['150 Guest Capacity', 'Dedicated Green Rooms', 'Full Catering Pantry'],
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Station',
    category: 'ground',
    categoryLabel: 'Eco Mobility',
    tagline: 'Eco-conscious green infrastructure at your doorstep',
    description:
      'Dedicated multi-point high-speed electric vehicle charging docks compatible with all modern 2-wheeler and 4-wheeler EVs, powered by smart metering.',
    image: '/assets/opt/grand-lobby-2000.webp',
    badge: 'Eco Infrastructure',
    highlights: ['Fast-Charge Ports', 'Safe Tower Parking Integration', 'Dedicated Fire Protection'],
  },
  {
    id: 'aranya-garden',
    name: 'Aranya Garden (Aroma Garden)',
    category: 'ground',
    categoryLabel: 'Biophilic Landscape',
    tagline: 'Sensory serenity amidst indigenous aromatic flora',
    description:
      'Landscape master plan curated by BeyondGreen featuring fragrant indigenous flowering shrubs, stepped manicured hedges, and soothing sensory pathways.',
    image: '/assets/opt/lifestyle-park-greens-2800.webp',
    badge: 'Curated by BeyondGreen',
    highlights: ['Indigenous Fragrant Flora', 'Aromatic Therapeutic Shrubs', '40% Open Green Buffer'],
  },

  // ─── TERRACE AMENITIES ───
  {
    id: 'rooftop-yoga',
    name: 'Yoga & Meditation Lawn',
    category: 'terrace',
    categoryLabel: 'Rooftop Zen',
    tagline: 'A zen zone to balance your body, mind & soul',
    description:
      'Elevated natural turf yoga deck open to early morning sunrise and cooling sea breezes, offering an invigorating open-air meditation sanctuary high above the city.',
    image: '/assets/opt/amenity-rooftop-yoga-2000.webp',
    badge: 'Panoramic Heights',
    highlights: ['Sunrise Facing Deck', 'Natural Grass Turf', 'Tranquil Acoustic Heights'],
  },
  {
    id: 'party-lawn',
    name: 'Gazebo & Party Lawn',
    category: 'terrace',
    categoryLabel: 'Rooftop Entertaining',
    tagline: 'A rooftop spot for serene evenings & starlit celebrations',
    description:
      'Designer timber pergola gazebo surrounded by flowering planter beds, ambient LED path lighting, and an expansive lawn for private family gatherings under the stars.',
    image: '/assets/opt/amenity-banquet-gazebo-2000.webp',
    badge: 'Starlit Events',
    highlights: ['Pergolised Gazebo Seating', 'Integrated Party Illumination', 'Glass Parapet Skyline Edge'],
  },
  {
    id: 'jogging-pathway',
    name: 'Jogging Pathway',
    category: 'terrace',
    categoryLabel: 'Skyline Fitness',
    tagline: 'A revitalizing fitness loop with panoramic Western Suburb views',
    description:
      'Continuous rubberized rooftop jogging loop safely framed with glass safety balustrades, offering an uninterrupted running path above street traffic.',
    image: '/assets/opt/lifestyle-sundeck-2000.webp',
    badge: 'Panoramic Track',
    highlights: ['High-Traction Jogging Surface', 'Continuous Safety Balustrade', 'Unmatched Horizon Vistas'],
  },
  {
    id: 'reflexology',
    name: 'Reflexology Pathway',
    category: 'terrace',
    categoryLabel: 'Holistic Wellness',
    tagline: 'Natural therapeutic foot acupressure for daily rejuvenation',
    description:
      'Smooth hand-selected river stones embedded in alternating textures to naturally stimulate pressure points, promote circulation, and relieve fatigue.',
    image: '/assets/opt/lifestyle-park-greens-2800.webp',
    badge: 'Therapeutic Walk',
    highlights: ['River Stone Texture Beds', 'Parallel Handrail Support', 'Aromatherapeutic Green Borders'],
  },
  {
    id: 'terrace-gym',
    name: 'Open Terrace Gym',
    category: 'terrace',
    categoryLabel: 'Open-Air Fitness',
    tagline: 'Breathe fresh sea breezes while training in the sky',
    description:
      'Outdoor calisthenics and functional training zone with weather-proof resistance bars, core training mats, and chin-up stations open to the morning sky.',
    image: '/assets/opt/amenity-fitness-center-2000.webp',
    badge: 'Skyline Calisthenics',
    highlights: ['All-Weather Training Equipment', 'Open-Air Calisthenics', 'Sunrise Facing Orientation'],
  },
  {
    id: 'family-seating',
    name: 'Family Seating Area',
    category: 'terrace',
    categoryLabel: 'Social Harmony',
    tagline: 'Unwind together with panoramic starlit horizons',
    description:
      'Sheltered alcoves with architectural lounge chairs, wind-deflecting glass screens, and lush potted flora designed for multi-generational conversations and evening tea.',
    image: '/assets/opt/lifestyle-sundeck-2000.webp',
    badge: 'Community Haven',
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
