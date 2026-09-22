import React from 'react';

interface LoadingStateProps {
  /** Text label shown below the spinner */
  label?: string;
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes: Record<string, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

/**
 * LoadingState — a minimal, architectural loading indicator.
 * A thin gold-bordered square rotating — avoids generic circular spinners.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  label,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
      <div
        className={`${spinnerSizes[size]} border border-champagne-400/50 animate-spin`}
        style={{
          animationDuration: '2.5s',
          animationTimingFunction: 'cubic-bezier(0.5, 0, 0.5, 1)',
        }}
      />
      {label && (
        <p className="text-detail text-cream-300/60">{label}</p>
      )}
    </div>
  );
};
