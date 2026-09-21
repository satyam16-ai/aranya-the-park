import type { HeroSlide } from '../types';

/**
 * Hero carousel — the client's own architectural renders, in the order the
 * brochure tells the story: the tower, the site, the arrival, the pavilion.
 * The first slide is preloaded in index.html; keep it the tower.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'tower',
    image: '/assets/opt/render-tower-dusk-2600.webp',
    alt: 'Aranya The Park — tower elevation at dusk, Malad West',
    caption: 'The tower at dusk',
    focus: { desktop: '50% 70%', phone: '50% 30%' },
  },
  {
    id: 'aerial',
    image: '/assets/opt/render-aerial-towers-2327.webp',
    alt: 'Aerial view of the two towers of Aranya The Park set among trees and greens',
    caption: 'Two towers in 40% open greens',
    focus: { desktop: '50% 42%', phone: '50% 45%' },
  },
  {
    id: 'lobby',
    image: '/assets/opt/render-grand-lobby-2000.webp',
    alt: 'Grand double-height air-conditioned lobby with Italian marble and oak panelling',
    caption: 'Grand double-height lobby',
    focus: { desktop: '50% 50%', phone: '45% 50%' },
  },
  {
    id: 'entrance',
    image: '/assets/opt/render-entrance-drive-2000.webp',
    alt: 'Glass-fronted entrance lobby seen from the drive-through at night',
    caption: 'Entrance drive & lobby façade',
    focus: { desktop: '60% 50%', phone: '74% 55%' },
  },
  {
    id: 'pavilion',
    image: '/assets/opt/render-fitness-pavilion-2000.webp',
    alt: 'Glass fitness pavilion beside the children’s play court at dusk',
    caption: 'Fitness pavilion & play court',
    focus: { desktop: '58% 55%', phone: '60% 55%' },
  },
  {
    id: 'gym',
    image: '/assets/opt/render-gym-2000.webp',
    alt: 'Fitness centre with treadmills and strength stations overlooking the city',
    caption: 'Fitness centre with city views',
    focus: { desktop: '50% 50%', phone: '55% 50%' },
  },
];
