import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { easeOutExpo } from '../../lib/motion';
import { useEscape, useFocusTrap, useScrollLock } from '../../lib/useDialog';
import { projectData } from '../../data/projectData';
import { Button } from '../common/Button';

interface NavLink {
  label: string;
  href: string;
  /** Section id used for active-state tracking (omit for modal triggers). */
  section?: string;
  action?: 'floor-plans';
}

const NAV_LINKS: NavLink[] = [
  { label: 'Residences', href: '#residences', section: 'residences' },
  { label: 'Amenities', href: '#amenities', section: 'amenities' },
  { label: 'Floor Plans', href: '#residences', action: 'floor-plans' },
  { label: 'Location', href: '#location', section: 'location' },
  { label: 'Gallery', href: '#gallery', section: 'gallery' },
  { label: 'Developer', href: '#developer', section: 'developer' },
];

interface NavbarProps {
  onOpenLeadModal: (purpose?: string) => void;
  onOpenFloorPlansModal: () => void;
}

/**
 * Navbar — a slim full-width bar. Transparent over the hero; becomes a linen
 * surface with a gold hairline once the page scrolls. Tracks the active
 * section and offers a full-screen drawer on phones.
 */
export const Navbar: React.FC<NavbarProps> = ({ onOpenLeadModal, onOpenFloorPlansModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.section).filter(Boolean) as string[];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        setActive(ids.find((id) => inView.has(id)) ?? null);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  useScrollLock(drawerOpen);
  useEscape(drawerOpen, closeDrawer);
  useFocusTrap(drawerRef, drawerOpen);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.action === 'floor-plans') {
      e.preventDefault();
      closeDrawer();
      onOpenFloorPlansModal();
      return;
    }
    closeDrawer();
  };

  const onLight = scrolled;

  return (
    <>
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>

      <header
        role="banner"
        data-surface={onLight ? 'linen' : undefined}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-luxe',
          onLight
            ? 'border-b border-gold-500/35 bg-linen-50/92 shadow-sm backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-wide items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:px-12">
          {/* Brand */}
          <a href="#overview" className="flex items-center gap-3" aria-label="Aranya The Park — home">
            <img
              src="/assets/branding/aranya-crest-96.png"
              srcSet="/assets/branding/aranya-crest-48.png 1x, /assets/branding/aranya-crest-96.png 2x, /assets/branding/aranya-crest-144.png 3x"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 lg:h-11 lg:w-11"
            />
            <img
              src={onLight ? '/assets/branding/aranya-wordmark-320.png' : '/assets/branding/aranya-wordmark-light-320.png'}
              srcSet={
                onLight
                  ? '/assets/branding/aranya-wordmark-160.png 1x, /assets/branding/aranya-wordmark-320.png 2x, /assets/branding/aranya-wordmark-480.png 3x'
                  : '/assets/branding/aranya-wordmark-light-160.png 1x, /assets/branding/aranya-wordmark-light-320.png 2x, /assets/branding/aranya-wordmark-light-480.png 3x'
              }
              alt="Aranya The Park"
              width={160}
              height={45}
              className="h-9 w-auto shrink-0 lg:h-10"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = !!link.section && active === link.section;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLink(e, link)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group relative py-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
                    onLight ? 'text-linen-800 hover:text-linen-950' : 'text-linen-100/85 hover:text-linen-50'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px bg-gold-500 transition-[width] duration-500 ease-out-expo',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={projectData.phoneRaw}
              className={cn(
                'hidden items-center gap-2 font-sans text-xs tracking-[0.06em] transition-colors xl:flex',
                onLight ? 'text-linen-700 hover:text-linen-950' : 'text-linen-200 hover:text-linen-50'
              )}
            >
              <Phone size={14} strokeWidth={1.5} className="text-gold-500" />
              {projectData.phone}
            </a>
            <Button size="sm" onClick={() => onOpenLeadModal('Navbar Inquiry')}>
              Enquire
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              '-mr-2 flex h-11 w-11 items-center justify-center lg:hidden',
              onLight ? 'text-linen-900' : 'text-linen-100'
            )}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            data-surface="deep"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="pinstripe fixed inset-0 z-[70] flex flex-col lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className="flex h-16 items-center justify-between px-5 pt-[env(safe-area-inset-top,0px)] sm:px-8">
              <div className="flex items-center gap-3">
                <img src="/assets/branding/aranya-crest-96.png" alt="" width={40} height={40} className="h-10 w-10" />
                <img src="/assets/branding/aranya-wordmark-light-320.png" alt="Aranya The Park" width={160} height={45} className="h-9 w-auto" />
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="-mr-2 flex h-11 w-11 items-center justify-center text-linen-100"
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-6 sm:px-10" aria-label="Primary">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * 0.05, duration: 0.5, ease: easeOutExpo } }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleLink(e, link)}
                      className="group flex items-baseline gap-5 border-b border-rule/60 py-4"
                    >
                      <span className="t-micro w-6 text-gold-400">{String(i + 1).padStart(2, '0')}</span>
                      <span className="t-h3 text-linen-100 transition-colors group-hover:text-gold-300">{link.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="grid grid-cols-2 gap-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] sm:px-10">
              <Button variant="secondary" href={projectData.phoneRaw} icon={<Phone size={14} />} iconPosition="left">
                Call
              </Button>
              <Button
                onClick={() => {
                  closeDrawer();
                  onOpenLeadModal('Mobile Navigation Inquiry');
                }}
              >
                Enquire
              </Button>
              <p className="t-micro col-span-2 pt-3 text-center text-linen-400">Malad West · Mumbai · MahaRERA {projectData.mahaRera}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
