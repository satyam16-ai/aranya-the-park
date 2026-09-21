import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, MessageCircle, CalendarDays, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { easeOutExpo } from '../../lib/motion';
import { projectData } from '../../data/projectData';

interface StickyActionBarProps {
  onOpenLeadModal: (purpose?: string) => void;
}

export const WHATSAPP_URL = `https://wa.me/919769766500?text=${encodeURIComponent(
  'Hello, I would like to schedule a private preview of Aranya The Park, Malad West.'
)}`;

const itemClass =
  'flex min-h-12 items-center gap-3 rounded-sm border border-gold-400/25 bg-forest-900/92 px-4 font-sans text-xs font-medium uppercase tracking-[0.14em] text-linen-100 shadow-lg backdrop-blur-md transition-colors hover:border-gold-400/60 hover:text-gold-300';

/**
 * StickyActionBar — the floating contact widget. Actions stay folded behind a
 * single trigger; opening springs out Call / WhatsApp / Enquire. The halo pulses
 * until the first open.
 */
export const StickyActionBar: React.FC<StickyActionBarProps> = ({ onOpenLeadModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // The hero carries its own CTAs — the widget appears once it scrolls away.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setHasOpened(true);
    setIsOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
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

  const items = [
    { key: 'call', label: 'Call', icon: <Phone size={16} strokeWidth={1.5} />, href: projectData.phoneRaw },
    { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} strokeWidth={1.5} />, href: WHATSAPP_URL, external: true },
  ];

  return (
    <div
      ref={rootRef}
      className={cn(
        'pb-safe pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-[opacity,transform] duration-500 ease-luxe lg:bottom-6 lg:right-8 lg:flex-row lg:items-center lg:pb-0',
        pastHero || isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
      aria-hidden={!pastHero && !isOpen}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="actions"
            id="contact-actions"
            className="pointer-events-auto flex flex-col items-end gap-2.5 lg:flex-row lg:items-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
          >
            {items.map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={close}
                className={itemClass}
                variants={{
                  hidden: { opacity: 0, y: 8, scale: 0.96 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: easeOutExpo } },
                }}
              >
                <span className={cn(item.key === 'whatsapp' ? 'text-whatsapp' : 'text-gold-400')}>{item.icon}</span>
                {item.label}
              </motion.a>
            ))}
            <motion.button
              type="button"
              onClick={() => {
                close();
                onOpenLeadModal('Floating Widget');
              }}
              className={cn(itemClass, 'border-gold-500 bg-gold-500 text-linen-950 hover:bg-gold-400 hover:text-linen-950')}
              variants={{
                hidden: { opacity: 0, y: 8, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: easeOutExpo } },
              }}
            >
              <CalendarDays size={16} strokeWidth={1.5} />
              Enquire
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="contact-actions"
        aria-label={isOpen ? 'Close contact options' : 'Contact us'}
        tabIndex={pastHero || isOpen ? 0 : -1}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-linen-950 shadow-gold transition-transform duration-300 ease-luxe hover:scale-105 active:scale-95',
          pastHero || isOpen ? 'pointer-events-auto' : 'pointer-events-none',
          !hasOpened && 'animate-halo'
        )}
      >
        <span className={cn('absolute transition-all duration-300', isOpen ? 'rotate-90 opacity-0' : 'opacity-100')}>
          <Phone size={20} strokeWidth={1.5} />
        </span>
        <span className={cn('absolute transition-all duration-300', isOpen ? 'opacity-100' : '-rotate-90 opacity-0')}>
          <X size={20} strokeWidth={1.5} />
        </span>
      </button>
    </div>
  );
};
