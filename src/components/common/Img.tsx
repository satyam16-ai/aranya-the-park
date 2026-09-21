import React from 'react';
import { imageManifest } from '../../data/imageManifest';
import { photoManifest } from '../../data/photoManifest';

const manifest = { ...imageManifest, ...photoManifest };

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /**
   * Viewport-width hint for the browser's srcSet picker.
   * Pass the width the image actually occupies, e.g. "(min-width:1024px) 50vw, 100vw".
   */
  sizes?: string;
}

/**
 * Img — <img> that pulls srcSet and intrinsic dimensions from the generated
 * manifests (scripts/extract-brochure-assets.py + scripts/optimize-photos.py).
 * Declaring width/height lets the browser reserve the box before the file lands.
 * Anything absent from the manifests renders as a plain <img>.
 */
export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) => {
  const entry = manifest[src];

  if (!entry) {
    return <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />;
  }

  return (
    <img
      src={src}
      srcSet={entry.srcSet}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
};
