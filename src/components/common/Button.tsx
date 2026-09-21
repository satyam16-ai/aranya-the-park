import React from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

type AnchorProps = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & { href: string };
type NativeProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeProps;

const base =
  'group inline-flex items-center justify-center gap-2.5 font-sans font-medium uppercase tracking-[0.16em] whitespace-nowrap select-none rounded-xs transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-luxe disabled:opacity-40 disabled:pointer-events-none active:translate-y-0 active:scale-[0.985]';

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[0.6875rem] px-5 min-h-10',
  md: 'text-xs px-7 min-h-12',
  lg: 'text-xs px-9 min-h-14',
};

const variants: Record<ButtonVariant, string> = {
  primary:
    'btn-sheen bg-gold-500 text-linen-950 hover:bg-gold-400 hover:-translate-y-px hover:shadow-gold',
  secondary:
    'border border-fg/35 text-fg hover:border-fg/70 hover:bg-fg/[0.06] hover:-translate-y-px',
  inverse: 'bg-linen-100 text-linen-950 hover:bg-white hover:-translate-y-px hover:shadow-md',
  ghost:
    'relative text-xs py-1 text-accent-text after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-6 after:bg-accent after:transition-[width] after:duration-500 after:ease-out-expo hover:after:w-full',
};

/**
 * Button — the single button language of the site.
 * primary: gold fill / ink text · secondary: hairline outline in the surface
 * foreground · ghost: text link with a growing gold rule · inverse: linen fill.
 * Renders an <a> when `href` is given.
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variant !== 'ghost' && sizes[size], variants[variant], className);

  const iconNode = icon ? (
    <span
      className={cn(
        'shrink-0 transition-transform duration-300 ease-luxe',
        iconPosition === 'right' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
  ) : null;

  const content = (
    <>
      {iconPosition === 'left' && iconNode}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' && iconNode}
    </>
  );

  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};
