import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Calendar, MessageSquare, X } from 'lucide-react';
import { projectData } from '../../data/projectData';

interface StickyActionBarProps {
  onOpenLeadModal: (purpose?: string) => void;
}

const WHATSAPP_URL = `https://wa.me/919769766500?text=${encodeURIComponent(
  'Hello, I would like to schedule a private preview of Aranya The Park, Malad West.'
)}`;

/**
 * StickyActionBar — the concierge closet.
 *
 * The contact actions stay folded away behind a single trigger so they never
 * sit on top of the page. Opening springs them out: a vertical stack on touch
 * devices, the familiar glass pill on desktop. A slow halo marks the trigger as
 * live until it has been opened once, after which it stops pestering.
 */
export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  onOpenLeadModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    setHasOpened(true);
    setIsOpen((prev) => !prev);
  }, []);

  // ESC and click-away dismiss the closet. It is not a modal, so no scroll lock.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isOpen, close]);

  /** Stagger the items out of the closet, and snap them back in on close. */
  const delay = (index: number) => ({
    transitionDelay: isOpen ? `${60 + index * 55}ms` : '0ms',
  });

  const panelState = isOpen
    ? 'opacity-100 scale-100 pointer-events-auto'
    : 'opacity-0 scale-95 pointer-events-none';

  return (
    <div
      ref={rootRef}
      className="fixed z-40 right-4 bottom-4 pb-safe lg:right-8 lg:bottom-6 lg:pb-0 flex flex-col items-end gap-3 lg:flex-row lg:items-center lg:gap-3 pointer-events-none"
    >
      {/* ─── Mobile: vertical stack of labelled pills ─── */}
      <div
        id="contact-closet-mobile"
        aria-hidden={!isOpen}
        className={`lg:hidden flex flex-col items-end gap-2.5 transition-all duration-300 ease-out origin-bottom-right ${panelState} ${
          isOpen ? 'translate-y-0' : 'translate-y-3'
        }`}
      >
        <a
          href={projectData.phoneRaw}
          onClick={close}
          style={delay(0)}
          className="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full glass-action-bar border border-white/[0.12] text-ivory transition-all duration-300"
        >
          <Phone size={15} className="text-champagne-400 shrink-0" />
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em]">
            Call
          </span>
        </a>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          style={delay(1)}
          className="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full glass-action-bar border border-white/[0.12] text-ivory transition-all duration-300"
        >
          <MessageSquare size={15} className="text-[#25D366] shrink-0" />
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em]">
            WhatsApp
          </span>
        </a>

        <button
          onClick={() => {
            close();
            onOpenLeadModal('Mobile Quick Action');
          }}
          style={delay(2)}
          className="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full bg-gradient-to-b from-champagne-300 to-champagne-400 text-dark-950 font-bold shadow-[0_8px_24px_rgba(200,169,107,0.35)] transition-all duration-300"
        >
          <Calendar size={15} className="shrink-0" />
          <span className="text-[11px] font-sans uppercase tracking-[0.18em]">
            Enquire
          </span>
        </button>
      </div>

      {/* ─── Desktop: the glass pill unfolds beside the trigger ─── */}
      <div
        id="contact-closet"
        aria-hidden={!isOpen}
        className={`hidden lg:flex items-center gap-2 p-2 glass-action-bar rounded-full border border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-400 ease-out origin-right ${panelState} ${
          isOpen ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        <a
          href={projectData.phoneRaw}
          style={delay(0)}
          className="btn-lux flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-ivory hover:text-champagne-300 hover:bg-white/[0.06] transition-all duration-300"
        >
          <Phone size={13} className="text-champagne-400" />
          <span>Call</span>
        </a>

        <span className="w-[1px] h-4 bg-white/[0.12]" />

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={delay(1)}
          className="btn-lux flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-ivory hover:text-champagne-300 hover:bg-white/[0.06] transition-all duration-300"
        >
          <MessageSquare size={13} className="text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => onOpenLeadModal('Desktop Floating Widget')}
          style={delay(2)}
          className="btn-lux flex items-center gap-2 px-6 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] bg-gradient-to-b from-champagne-300 to-champagne-400 hover:from-champagne-200 hover:to-champagne-300 text-dark-950 rounded-full shadow-[0_6px_20px_rgba(200,169,107,0.3)] transition-all duration-300 cursor-pointer select-none"
        >
          <Calendar size={13} />
          <span>Enquire</span>
        </button>
      </div>

      {/* ─── The closet door ─── */}
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="contact-closet"
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        className={`pointer-events-auto relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer select-none
                    bg-gradient-to-b from-champagne-300 to-champagne-400 text-dark-950
                    shadow-[0_10px_30px_rgba(200,169,107,0.4)]
                    hover:shadow-[0_14px_38px_rgba(200,169,107,0.55)] hover:scale-105
                    active:scale-95
                    transition-all duration-300 ease-out
                    ${!isOpen && !hasOpened ? 'closet-halo' : ''}`}
      >
        {/* Both glyphs are stacked and cross-faded, so the trigger never jumps */}
        <Phone
          size={21}
          strokeWidth={2}
          className={`absolute transition-all duration-300 ease-out ${
            isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <X
          size={22}
          strokeWidth={2}
          className={`absolute transition-all duration-300 ease-out ${
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </button>
    </div>
  );
};
