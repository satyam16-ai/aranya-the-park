import React, { useRef, useEffect, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  /** Animation direction of the curtain wipe */
  direction?: 'up' | 'left';
  /** Aspect ratio wrapper class (e.g. 'aspect-[4/3]') */
  aspectRatio?: string;
  className?: string;
  /** Overlay gradient from bottom */
  overlay?: boolean;
  /** Children rendered over the image (e.g. captions) */
  children?: React.ReactNode;
}

/**
 * ImageReveal — an image that is masked on load and revealed with
 * a cinematic curtain wipe when it scrolls into view.
 */
export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  direction = 'up',
  aspectRatio = 'aspect-[4/3]',
  className = '',
  overlay = false,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The clip-path transitions from hidden to fully visible
  const clipPaths = {
    up: {
      hidden: 'inset(100% 0 0 0)',
      visible: 'inset(0 0 0 0)',
    },
    left: {
      hidden: 'inset(0 100% 0 0)',
      visible: 'inset(0 0 0 0)',
    },
  };

  const clip = clipPaths[direction];

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden border border-champagne-400/15 ${aspectRatio} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          clipPath: isVisible ? clip.visible : clip.hidden,
          transition: 'clip-path 1s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'clip-path',
          transform: isVisible ? 'scale(1)' : 'scale(1.08)',
          transitionProperty: 'clip-path, transform',
          transitionDuration: '1s, 1.4s',
          transitionTimingFunction:
            'cubic-bezier(0.77, 0, 0.175, 1), cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-transparent to-transparent pointer-events-none" />
      )}

      {children && (
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 z-10">
          {children}
        </div>
      )}
    </div>
  );
};
