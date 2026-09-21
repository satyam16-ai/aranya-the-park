import React from 'react';
import { cn } from '../../lib/cn';
import { Eyebrow } from './Eyebrow';
import { RevealGroup, RevealItem } from './Reveal';

interface SectionIntroProps {
  eyebrow?: React.ReactNode;
  /** May contain an <em> for the emphasised word (rendered in Bodoni italic). */
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h1' | 'h2';
  className?: string;
  id?: string;
}

/** The one heading recipe: eyebrow → Bodoni title → Jost lead. */
export const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: Tag = 'h2',
  size = 'h2',
  className,
  id,
}) => (
  <RevealGroup
    as="header"
    className={cn(
      'max-w-3xl',
      align === 'center' && 'mx-auto text-center flex flex-col items-center',
      className
    )}
  >
    {eyebrow && (
      <RevealItem as="div" className="mb-5">
        <Eyebrow align={align}>{eyebrow}</Eyebrow>
      </RevealItem>
    )}
    <RevealItem as="div">
      <Tag id={id} className={cn(size === 'h1' ? 't-h1' : 't-h2', 'text-fg')}>
        {title}
      </Tag>
    </RevealItem>
    {lead && (
      <RevealItem as="p" className={cn('t-lead text-fg-muted mt-5', align === 'center' && 'mx-auto')}>
        {lead}
      </RevealItem>
    )}
  </RevealGroup>
);
