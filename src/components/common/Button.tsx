import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'outline-gold' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  /** Render as a link-like element */
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

/**
 * Button — architectural luxury button system.
 * Slightly rounded corners (2px) for refinement. Gold accents, subtle depth on hover.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  icon,
  iconPosition = 'right',
  href,
  target,
  rel,
  children,
  className = '',
  ...props
}) => {
  const base = [
    'inline-flex items-center justify-center gap-2.5',
    'font-sans font-semibold uppercase tracking-[0.14em]',
    'rounded-[3px]',
    'btn-lux',
    'cursor-pointer select-none',
    'disabled:opacity-40 disabled:pointer-events-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-400',
  ].join(' ');

  const sizes: Record<string, string> = {
    sm: 'text-[0.625rem] px-5 sm:px-6 py-2.5 min-h-[42px]',
    md: 'text-[0.6875rem] px-6 sm:px-8 py-3 sm:py-3.5 min-h-[46px]',
    lg: 'text-xs px-8 sm:px-10 py-3.5 sm:py-4 min-h-[50px]',
  };

  const variants: Record<string, string> = {
    gold: [
      'bg-gradient-to-b from-champagne-300 to-champagne-400 text-forest-800',
      'shadow-[0_4px_14px_rgba(200,169,107,0.22)]',
      'hover:from-champagne-200 hover:to-champagne-300',
      'hover:shadow-[0_10px_30px_rgba(200,169,107,0.45)]',
      'active:from-champagne-400 active:to-champagne-500',
    ].join(' '),
    outline: [
      'border border-champagne-400/40 text-champagne-300',
      'bg-transparent backdrop-blur-sm',
      'hover:border-champagne-400 hover:text-cream-100 hover:bg-champagne-400/[0.08]',
      'hover:shadow-[0_8px_26px_rgba(197,168,128,0.16)]',
    ].join(' '),
    'outline-gold': [
      'border border-champagne-400/40 text-champagne-300',
      'bg-transparent backdrop-blur-sm',
      'hover:border-champagne-400 hover:text-dark-950 hover:bg-champagne-400',
      'hover:shadow-[0_10px_30px_rgba(200,169,107,0.4)]',
    ].join(' '),
    dark: [
      'bg-forest-700 text-cream-200 border border-champagne-400/20',
      'hover:bg-forest-600 hover:border-champagne-400/45 hover:text-cream-100',
      'hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
    ].join(' '),
    ghost: [
      'text-champagne-300 bg-transparent',
      'hover:text-cream-100 hover:bg-cream-100/[0.07]',
    ].join(' '),
  };

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="btn-icon-left shrink-0 -ml-0.5">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="btn-icon-right shrink-0 -mr-0.5">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {content}
    </button>
  );
};
