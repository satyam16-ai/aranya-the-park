import React from 'react';

/**
 * SectionBackdrop — the soft green glow behind every section below the hero.
 *
 * It once carried gold strands, contour rings and monstera leaves as well;
 * the client had all of those taken off (27-09), leaving the glow alone.
 * It paints behind the content, so the section needs `relative isolate`.
 */
export const SectionBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_30%,#0e2a1f_0%,rgba(7,21,16,0)_72%)]" />
  </div>
);
