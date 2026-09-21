import React, { useId, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export interface TabItem<T extends string> {
  id: T;
  label: React.ReactNode;
  hint?: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Stretch tabs to fill the rail. */
  grow?: boolean;
}

/**
 * Accessible segmented control (role=tablist, roving tabindex, arrow keys)
 * with a gold indicator that slides between tabs.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  className,
  grow = false,
}: TabsProps<T>) {
  const layoutId = useId();
  const refs = useRef<Map<T, HTMLButtonElement>>(new Map());

  const focusTab = (id: T) => {
    refs.current.get(id)?.focus();
    onChange(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      focusTab(items[next].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex max-w-full gap-1 rounded-sm border border-card-border bg-card p-1 scroll-x',
        grow && 'w-full',
        className
      )}
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) refs.current.set(item.id, el);
              else refs.current.delete(item.id);
            }}
            role="tab"
            type="button"
            id={`${layoutId}-tab-${item.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'relative isolate flex shrink-0 flex-col items-center justify-center rounded-xs font-sans font-medium uppercase transition-colors duration-300 ease-luxe',
              size === 'sm'
                ? 'min-h-9 px-4 text-[0.6875rem] tracking-[0.14em]'
                : 'min-h-11 px-5 text-xs tracking-[0.16em]',
              grow && 'flex-1',
              selected ? 'text-linen-950' : 'text-fg-muted hover:text-fg'
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${layoutId}-indicator`}
                className="absolute inset-0 -z-10 rounded-xs bg-gold-500"
                transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              />
            )}
            <span>{item.label}</span>
            {item.hint && (
              <span
                className={cn(
                  'mt-0.5 text-[0.625rem] tracking-[0.08em] normal-case',
                  selected ? 'text-linen-950/70' : 'text-fg-muted/80'
                )}
              >
                {item.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
