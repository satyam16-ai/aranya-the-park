import React from 'react';

interface StatProps {
  /** The large number or value */
  value: string;
  /** Unit or suffix (sq. ft., BHK, etc.) */
  unit?: string;
  /** Description label below the value */
  label: string;
  /** Color theme */
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * Stat — a single large-number metric with label.
 * Used in stats bars, project highlights, and developer trust sections.
 */
export const Stat: React.FC<StatProps> = ({
  value,
  unit,
  label,
  theme = 'dark',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-baseline justify-center gap-1.5">
        <span
          className={`heading-display text-3xl sm:text-4xl md:text-5xl ${
            isDark ? 'text-champagne-300' : 'text-champagne-600'
          }`}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`text-xs font-sans font-medium tracking-wider uppercase ${
              isDark ? 'text-champagne-400/60' : 'text-champagne-600/60'
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      <p
        className={`text-detail mt-2.5 ${
          isDark ? 'text-cream-300/70' : 'text-stone-500'
        }`}
      >
        {label}
      </p>
    </div>
  );
};
