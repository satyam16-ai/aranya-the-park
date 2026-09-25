import React from 'react';
import { imageCredit } from '../../data/imageCredits';

interface ImageCreditProps {
  /** The image being credited — the same path the <img> or <Img> renders. */
  src: string;
  /** Placement, usually `absolute` plus a corner. */
  className?: string;
}

/**
 * The small print on an image: "Representational image" on stock lifestyle
 * photography. Renders nothing for images that need no credit: the project
 * renders, plans and logos (see src/data/imageCredits.ts).
 */
export const ImageCredit: React.FC<ImageCreditProps> = ({ src, className = '' }) => {
  const label = imageCredit(src);
  if (!label) return null;

  return (
    <span
      className={`pointer-events-none select-none inline-block rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 font-sans text-[9px] sm:text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-ivory/90 ${className}`}
    >
      {label}
    </span>
  );
};
