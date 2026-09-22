import React from 'react';
import { imageManifest } from '../../data/imageManifest';

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /**
   * Viewport-width hint for the browser's srcSet picker.
   * Pass the width the image actually occupies, e.g. "(min-width:1024px) 891px, 100vw".
   */
  sizes?: string;
}

/**
 * Img — <img> that pulls srcSet and intrinsic dimensions from the generated
 * image manifest (see scripts/extract-brochure-assets.py).
 *
 * Declaring width/height lets the browser reserve the right box before the file
 * lands, so growing the images doesn't introduce layout shift. Anything absent
 * from the manifest (branding logos, the hero crops) renders as a plain <img>,
 * so this is safe to use for every image on the page.
 */
export const Img: React.FC<ImgProps> = ({ src, alt, sizes = '100vw', ...rest }) => {
  const entry = imageManifest[src];

  if (!entry) {
    return <img src={src} alt={alt} {...rest} />;
  }

  return (
    <img
      src={src}
      srcSet={entry.srcSet}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      {...rest}
    />
  );
};
