import React from 'react';

interface SectionHeadingProps {
  /** Small uppercase eyebrow text above the title */
  eyebrow?: string;
  /** Main section title — rendered in editorial serif */
  title: string;
  /** Supporting subtitle paragraph */
  subtitle?: string;
  /** Center or left-align */
  align?: 'center' | 'left';
  /** Color scheme */
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * SectionHeading — clean editorial heading unit.
 * Eyebrow label + serif title + supporting prose. No ornamental clutter.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  theme = 'dark',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const isCentered = align === 'center';
  const alignment = isCentered ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {/* Eyebrow */}
      {eyebrow && (
        <p
          className={`eyebrow mb-5 block ${isCentered ? 'text-center' : 'text-left'}`}
        >
          {eyebrow}
        </p>
      )}

      {/* Title */}
      <h2
        className={`heading-serif mb-6 ${
          isDark ? 'text-cream-100' : 'text-stone-900'
        } ${isCentered ? 'text-center' : 'text-left'}`}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`prose-editorial max-w-2xl ${
            isCentered ? 'mx-auto text-center' : 'text-left'
          } ${isDark ? 'text-cream-300' : 'text-stone-600'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
