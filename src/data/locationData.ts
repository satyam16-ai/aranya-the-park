import type { InfrastructureProject, LocationNode } from '../types';

/*
 * The destinations are the client's brochure list ("The comfort of next-door
 * conveniences"), cut down at the 25-09 review to connectivity 2-4, education
 * 1, 2, 4 and 5, entertainment 1-3 and healthcare 1-3. Times are the brochure's.
 */
export const locationNodes: LocationNode[] = [
  // Transit & Connectivity
  {
    id: 'c1',
    name: 'Malad West Metro Station',
    category: 'connectivity',
    time: '3 Mins',
    routeNote: 'Metro Line 2A (Yellow Line)',
    distanceNote: 'On the Dahisar – Andheri West metro line',
    highlight: true,
  },
  {
    id: 'c3',
    name: 'Malad Railway Station',
    category: 'connectivity',
    time: '9 Mins',
    routeNote: 'Western Railway Line',
    distanceNote: 'Western line suburban rail, Churchgate to Dahanu',
    highlight: true,
  },
  {
    id: 'c4',
    name: 'Western Express Highway (WEH)',
    category: 'connectivity',
    time: '14 Mins',
    routeNote: 'Via Malad-Goregaon arterial',
    distanceNote: 'Mumbai’s main north–south highway',
    highlight: true,
  },

  // Entertainment & Leisure
  {
    id: 'e1',
    name: 'Inorbit Mall Malad',
    category: 'entertainment',
    time: '4 Mins',
    routeNote: 'Off New Link Road',
    distanceNote: 'Shopping, dining and cinema',
    highlight: true,
  },
  {
    id: 'e2',
    name: 'Goregaon Sports Club (GSC)',
    category: 'entertainment',
    time: '4 Mins',
    routeNote: 'Link Road Extension',
    distanceNote: 'Sports, fitness and social club',
  },
  {
    id: 'e3',
    name: 'Infiniti Mall Malad',
    category: 'entertainment',
    time: '6 Mins',
    routeNote: 'Link Road North',
    distanceNote: 'Shopping, dining and cinema',
  },

  // Education
  {
    id: 'ed1',
    name: 'Kothari Starz Pre-School',
    category: 'education',
    time: '1 Min',
    routeNote: 'Immediate neighborhood',
    distanceNote: 'Early-years learning, a minute away',
    highlight: true,
  },
  {
    id: 'ed2',
    name: 'Vibgyor Rise International',
    category: 'education',
    time: '2 Mins',
    routeNote: 'Mindspace enclave',
    distanceNote: 'School in the Mindspace neighbourhood',
    highlight: true,
  },
  {
    id: 'ed4',
    name: 'Ryan International School',
    category: 'education',
    time: '7 Mins',
    routeNote: 'Evershine Nagar / Link Road',
    distanceNote: 'School off Link Road',
  },
  {
    id: 'ed5',
    name: 'Witty International School',
    category: 'education',
    time: '8 Mins',
    routeNote: 'Malad West',
    distanceNote: 'International school in Malad West',
  },

  // Healthcare
  {
    id: 'h1',
    name: 'CritiCare Asia Multispeciality Hospital',
    category: 'healthcare',
    time: '2 Mins',
    routeNote: 'Opp. Mindspace',
    distanceNote: 'Multispeciality hospital, two minutes away',
    highlight: true,
  },
  {
    id: 'h2',
    name: 'Cloudnine Hospital',
    category: 'healthcare',
    time: '5 Mins',
    routeNote: 'Link Road',
    distanceNote: 'Maternity and children’s hospital',
  },
  {
    id: 'h3',
    name: 'Lifeline Medicare Hospital',
    category: 'healthcare',
    time: '11 Mins',
    routeNote: 'Malad West',
    distanceNote: 'Multispeciality hospital',
  },
];

export const infrastructureProjects: InfrastructureProject[] = [
  {
    id: 'metro-2a',
    name: 'Metro Line 2A (Yellow Line)',
    status: 'Operational',
    description: 'Metro line connecting Dahisar to Andheri West, with a station at Malad West.',
    benefit: 'Malad West station is 3 minutes from Aranya.',
  },
  {
    id: 'coastal-road',
    name: 'Coastal Road Northern Extension',
    status: 'Under Execution',
    description: 'Northern extension of the Coastal Road, linking Versova to Bhayander.',
    benefit: 'A coastal route north and south along the western suburbs.',
  },
  {
    id: 'gmlr-tunnel',
    name: 'GMLR (Goregaon-Mulund Link Road) Tunnel',
    status: 'Under Construction',
    description: 'Tunnel project connecting the Western and Eastern Express Highways.',
    benefit: 'A faster east–west link from the western suburbs.',
  },
  {
    id: 'metro-6',
    name: 'Metro Line 6 (Pink Line)',
    status: 'Under Execution',
    description: 'East–west metro corridor linking Lokhandwala to Vikhroli.',
    benefit: 'Rail access across the city, from west to east.',
  },
];
