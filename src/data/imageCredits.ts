import { imageManifest } from './imageManifest';
import { photoManifest } from './photoManifest';

/**
 * What a photograph on the site has to own up to. The lifestyle photography is
 * stock, standing in for the life rather than showing the site, and says so.
 * Renders of the project carry no label: the client does not want them called
 * artist's impressions (25-09). The manifest still marks them 'artist', so the
 * label can come back by adding it here. The credit is set per image by
 * scripts/optimize-photos.py and travels in the manifest.
 */
const LABELS: Partial<Record<'artist' | 'representative', string>> = {
  representative: 'Representational image',
};

export const imageCredit = (src: string): string | undefined => {
  const credit = (photoManifest[src] ?? imageManifest[src])?.credit;
  return credit ? LABELS[credit] : undefined;
};
