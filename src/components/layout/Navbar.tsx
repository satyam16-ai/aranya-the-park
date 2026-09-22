import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'OVERVIEW', href: '#overview' },
  { label: 'RESIDENCES', href: '#residences' },
  { label: '3D EXPERIENCE', href: '#virtual-tour' },
  { label: 'AMENITIES', href: '#amenities' },
  { label: 'FLOOR PLANS', href: '#floor-plans' },
  { label: 'LOCATION', href: '#location' },
] as const;

interface NavbarProps {
  onOpenLeadModal?: (purpose?: string) => void;
  onOpenFloorPlansModal?: () => void;
  onOpenLocationModal?: () => void;
}

/**
 * Navbar — Floating Modern Glass Luxury Navigation.
 * Initially blends seamlessly into the cinematic hero.
 * Morphs into a floating glass architectural pill upon scrolling.
 */
export const Navbar: React.FC<NavbarProps> = ({
  onOpenLeadModal,
  onOpenFloorPlansModal,
  onOpenLocationModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    isMobile: boolean = false
  ) => {
    if (label === 'FLOOR PLANS' && onOpenFloorPlansModal) {
      e.preventDefault();
      if (isMobile) closeMobile();
      onOpenFloorPlansModal();
      return;
    }
    if (label === 'LOCATION' && onOpenLocationModal) {
      e.preventDefault();
      if (isMobile) closeMobile();
      onOpenLocationModal();
      return;
    }
    if (isMobile) {
      closeMobile();
    }
  };

  return (
    <>
      {/* ─── Floating Modern Glass Luxury Pill Navbar ─── */}
      <header
        className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top,0.75rem))] sm:top-4 z-50 flex justify-center px-3.5 sm:px-6 pointer-events-none"
        role="banner"
      >
        <div
          className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-500 ease-out flex items-center justify-between px-4 sm:px-7 py-2 sm:py-2.5 border ${
            isScrolled
              ? 'bg-dark-900/85 backdrop-blur-2xl border-champagne-400/20 shadow-[inset_0_1px_0_rgba(200,169,107,0.15),0_12px_40px_-8px_rgba(0,0,0,0.7)]'
              : 'bg-dark-950/65 backdrop-blur-xl border-champagne-400/15 shadow-[inset_0_1px_0_rgba(200,169,107,0.12),0_8px_30px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* ─── Official Brand Lockup: Crest + Wordmark ─── */}
          <a
            href="#"
            className="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer"
            aria-label="Aranya The Park — Home"
          >
            <img
              src="/assets/branding/aranya-crest-96.png"
              srcSet="/assets/branding/aranya-crest-48.png 1x, /assets/branding/aranya-crest-96.png 2x, /assets/branding/aranya-crest-144.png 3x"
              alt=""
              width={48}
              height={48}
              loading="eager"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[8deg]"
            />
            <img
              src="/assets/branding/aranya-wordmark-light-320.png"
              srcSet="/assets/branding/aranya-wordmark-light-160.png 1x, /assets/branding/aranya-wordmark-light-320.png 2x, /assets/branding/aranya-wordmark-light-480.png 3x"
              alt="Aranya The Park"
              width={160}
              height={45}
              loading="eager"
              className="h-10 sm:h-11 w-auto object-contain shrink-0 transition-opacity duration-300 group-hover:opacity-85"
            />
          </a>

          {/* ─── Desktop Navigation Links ─── */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-9"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.label, false)}
                className="relative text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-ivory/85 hover:text-champagne-200 transition-colors duration-300 py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-champagne-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* ─── Desktop Primary CTA ─── */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => (onOpenLeadModal ? onOpenLeadModal('Navbar Inquiry') : undefined)}
              className="btn-lux px-5 py-2 text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-champagne-300 hover:text-dark-950 hover:bg-champagne-400 border border-champagne-400/40 hover:border-champagne-400 rounded-full transition-all duration-300 cursor-pointer select-none"
            >
              ENQUIRE
            </button>
          </div>

          {/* ─── Mobile Menu Toggle ─── */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-ivory hover:text-champagne-300 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center -mr-1"
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Fullscreen Editorial Drawer ─── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
          isMobileOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark-950/98 backdrop-blur-2xl transition-opacity duration-500"
          onClick={closeMobile}
        />

        {/* Top Header Bar inside Drawer */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-[max(1.25rem,env(safe-area-inset-top,0px))] pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <img
              src="/assets/branding/aranya-crest-96.png"
              srcSet="/assets/branding/aranya-crest-48.png 1x, /assets/branding/aranya-crest-96.png 2x, /assets/branding/aranya-crest-144.png 3x"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain shrink-0"
            />
            <div className="flex flex-col items-start gap-1">
              <img
                src="/assets/branding/aranya-wordmark-light-320.png"
                srcSet="/assets/branding/aranya-wordmark-light-160.png 1x, /assets/branding/aranya-wordmark-light-320.png 2x, /assets/branding/aranya-wordmark-light-480.png 3x"
                alt="Aranya The Park"
                width={160}
                height={45}
                className="h-11 w-auto object-contain"
              />
              <span className="text-[9px] font-sans font-medium tracking-[0.35em] uppercase text-champagne-400/90 pl-0.5">
                THE LUSHURY LIFE · MALAD WEST
              </span>
            </div>
          </div>

          <button
            onClick={closeMobile}
            className="p-2 text-ivory-muted hover:text-ivory transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer -mr-2"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Menu Items with Generous Spacing & Touch Targets */}
        <div className="relative z-10 flex flex-col justify-between h-[calc(100%-80px)] px-7 py-8 overflow-y-auto overflow-touch pb-safe">
          <nav className="flex flex-col space-y-3 pt-2">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.label, true)}
                style={{ transitionDelay: `${idx * 40}ms` }}
                className="group flex items-center justify-between py-3.5 px-2 min-h-[48px] rounded-[4px] font-serif text-2xl sm:text-3xl text-ivory/90 hover:text-champagne-300 tracking-[0.12em] transition-all uppercase font-light active:bg-white/[0.03]"
              >
                <span>{link.label}</span>
                <span className="text-xs font-sans text-champagne-400/40 group-hover:text-champagne-300 group-hover:translate-x-1 transition-all">
                  0{idx + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="pt-8 pb-4 space-y-3">
            <button
              onClick={() => {
                closeMobile();
                if (onOpenLeadModal) onOpenLeadModal('Mobile Navigation Inquiry');
              }}
              className="btn-lux w-full py-4 min-h-[52px] text-xs font-sans font-semibold tracking-[0.2em] uppercase text-dark-950 bg-champagne-400 hover:bg-champagne-300 active:scale-[0.99] rounded-full transition-all duration-300 cursor-pointer text-center shadow-[0_8px_25px_rgba(200,169,107,0.3)]"
            >
              ENQUIRE NOW
            </button>
            <div className="text-center">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-ivory-muted/50">
                MALAD WEST · MUMBAI
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
