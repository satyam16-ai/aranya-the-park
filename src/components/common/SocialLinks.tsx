import React from 'react';
import { projectData } from '../../data/projectData';
import type { ProjectInfo } from '../../types';

type Network = ProjectInfo['socials'][number]['label'];

/* lucide-react no longer ships brand marks, so the four we need are inlined. */
const icons: Record<Network, React.FC> = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 6.35a3.49 3.49 0 1 0 0 6.98 3.49 3.49 0 0 0 0-6.98Zm0 5.76a2.27 2.27 0 1 1 0-4.54 2.27 2.27 0 0 1 0 4.54Zm4.44-5.9a.82.82 0 1 1-1.63 0 .82.82 0 0 1 1.63 0Z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77A26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.9h3.4V21h-3.4V8.9Zm5.53 0h3.26v1.65h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.08 2.27 4.08 5.21V21h-3.4v-5.33c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-3.4V8.9Z" />
    </svg>
  ),
};

const links = projectData.socials.filter((s) => s.url);

/** True when at least one channel has a URL, so callers can skip their label too. */
export const hasSocialLinks = links.length > 0;

/**
 * SocialLinks — the social channels in projectData as round icon links.
 * Entries without a URL stay hidden; with none filled in it renders nothing.
 */
export const SocialLinks: React.FC<{ className?: string }> = ({ className = '' }) => {
  if (!hasSocialLinks) return null;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map((s) => {
        const Icon = icons[s.label];
        return (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} (opens in a new tab)`}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/[0.12] text-ivory-muted hover:text-champagne-300 hover:border-champagne-400/50 transition-colors"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};
