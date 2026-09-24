import { imageManifest } from './imageManifest';
import { photoManifest } from './photoManifest';

/**
 * What every photograph on the site has to own up to. Renders of the project
 * are artist's impressions; the lifestyle photography is stock, standing in for
 * the life rather than showing the site. The credit is set per image by
 * scripts/optimize-photos.py and travels in the manifest.
 */
const LABELS = {
  artist: 'Artist’s impression',
  representative: 'Representational image',
} as const;

export const imageCredit = (src: string): string | undefined => {
  const credit = (photoManifest[src] ?? imageManifest[src])?.credit;
  return credit ? LABELS[credit] : undefined;
};
