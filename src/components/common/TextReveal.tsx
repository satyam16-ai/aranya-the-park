import React, { useRef, useEffect, useState } from 'react';

interface TextRevealProps {
  children: React.ReactNode;
  /** Animation variant */
  animation?: 'fade-up' | 'fade' | 'slide-left';
  /** Stagger delay in ms */
  delay?: number;
  /** Threshold for intersection observer (0–1) */
  threshold?: number;
  className?: string;
  /** HTML tag to render */
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'blockquote';
}

/**
 * TextReveal — triggers a scroll-based reveal animation when the element
 * enters the viewport. Used for editorial text entrances throughout the site.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
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
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animations: Record<string, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
    'fade-up': {
      hidden: { opacity: 0, transform: 'translateY(28px)' },
      visible: { opacity: 1, transform: 'translateY(0)' },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    'slide-left': {
      hidden: { opacity: 0, transform: 'translateX(-32px)' },
      visible: { opacity: 1, transform: 'translateX(0)' },
    },
  };

  const anim = animations[animation];

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        ...(isVisible ? anim.visible : anim.hidden),
        transition: `opacity 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms, transform 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};
