import React from 'react';

interface SectionHeadingProps {
  /** Small uppercase eyebrow text above the title */
  eyebrow?: string;
  /** Main section title — rendered in editorial serif */
  title: React.ReactNode;
  /** Supporting subtitle paragraph */
  subtitle?: React.ReactNode;
  /**
   * The section's own controls — tabs, filters, a count, a button. On large
   * screens they sit on the heading's row instead of forming a second band
   * beneath it, which is where most of the reclaimed height comes from.
   */
  aside?: React.ReactNode;
  /** Left is the house style; `center` is kept for the few hero-like sections. */
  align?: 'left' | 'center';
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * SectionHeading — the one heading unit every section uses.
 *
 * Left-aligned and deliberately small: the client's 23-09 note was that the
 * headings and their supporting copy were eating the page. Sizing lives in
 * `.eyebrow` / `.heading-serif` / `.prose-editorial` (src/index.css) so the
 * whole site retunes from one place rather than nine hand-rolled headers.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  aside,
  align = 'left',
  theme = 'dark',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const isCentered = align === 'center';

  return (
    <div
      className={`mb-7 sm:mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10 ${
        isCentered ? 'lg:flex-col lg:items-center' : ''
      } ${className}`}
    >
      <div className={isCentered ? 'max-w-2xl mx-auto text-center' : 'max-w-2xl'}>
        {eyebrow && <span className="eyebrow block mb-2">{eyebrow}</span>}

        <h2
          className={`heading-serif uppercase ${isDark ? 'text-ivory' : 'text-stone-900'}`}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={`prose-editorial mt-2.5 max-w-xl ${
              isDark ? 'text-ivory-muted' : 'text-stone-600'
            } ${isCentered ? 'mx-auto' : ''}`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {aside && <div className="shrink-0 lg:pb-1">{aside}</div>}
    </div>
  );
};
