import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { imageSettle, imageWipe, viewportOnce } from '../../lib/motion';

interface ImageRevealProps {
  className?: string;
  /** Aspect utility for the box, e.g. "aspect-[4/3]". Omit when the parent sizes it. */
  aspect?: string;
  children: React.ReactNode;
}

/**
 * Curtain wipe (clip-path) + gentle settle (scale 1.06 → 1) for imagery.
 * Wrap an <Img>; the image should carry `w-full h-full object-cover`.
 */
export const ImageReveal: React.FC<ImageRevealProps> = ({ className, aspect, children }) => (
  <motion.div
    className={cn('relative overflow-hidden', aspect, className)}
    variants={imageWipe}
    initial="hidden"
    whileInView="visible"
    viewport={viewportOnce}
  >
    <motion.div className="h-full w-full" variants={imageSettle}>
      {children}
    </motion.div>
  </motion.div>
);
