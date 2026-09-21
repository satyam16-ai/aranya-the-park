import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp, revealTransition, stagger, viewportOnce } from '../../lib/motion';

type Tag = 'div' | 'section' | 'ul' | 'li' | 'span' | 'p' | 'header' | 'figure';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: Tag;
  delay?: number;
  children?: React.ReactNode;
}

/** Fade + rise once the element scrolls into view. */
export const Reveal: React.FC<RevealProps> = ({ as = 'div', delay = 0, children, ...rest }) => {
  const Comp = motion[as] as typeof motion.div;
  const variants = delay
    ? { hidden: fadeUp.hidden, visible: { opacity: 1, y: 0, transition: { ...revealTransition, delay } } }
    : fadeUp;
  return (
    <Comp variants={variants} initial="hidden" whileInView="visible" viewport={viewportOnce} {...rest}>
      {children}
    </Comp>
  );
};

interface RevealGroupProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: Tag;
  staggerChildren?: number;
  delayChildren?: number;
  children?: React.ReactNode;
}

/** Parent that staggers its <RevealItem> children. */
export const RevealGroup: React.FC<RevealGroupProps> = ({
  as = 'div',
  staggerChildren = 0.08,
  delayChildren = 0,
  children,
  ...rest
}) => {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      variants={stagger(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Comp>
  );
};

interface RevealItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: Tag;
  children?: React.ReactNode;
}

export const RevealItem: React.FC<RevealItemProps> = ({ as = 'div', children, ...rest }) => {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp variants={fadeUp} {...rest}>
      {children}
    </Comp>
  );
};
