import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { StoryArrival } from './components/sections/StoryArrival';
import { StoryGreens } from './components/sections/StoryGreens';
import { Residences } from './components/sections/Residences';
import { FloorPlans } from './components/sections/FloorPlans';
import { FloorPlansModal } from './components/sections/FloorPlansModal';
import { Amenities } from './components/sections/Amenities';
import { LocationConnectivity } from './components/sections/LocationConnectivity';
import { LocationModal } from './components/sections/LocationModal';
import { Specifications } from './components/sections/Specifications';
import { Gallery } from './components/sections/Gallery';
import { DeveloperTrust } from './components/sections/DeveloperTrust';
import { EnquiryCTA } from './components/sections/EnquiryCTA';
import { Footer } from './components/layout/Footer';
import { StickyActionBar } from './components/layout/StickyActionBar';
import { LeadFormModal } from './components/sections/LeadFormModal';
import { EnquiryPopup } from './components/common/EnquiryPopup';
import { Lightbox } from './components/common/Lightbox';
import type { AmenityItem } from './types';

interface LightboxState {
  url: string;
  title: string;
  description?: string;
  category?: string;
}

/**
 * useScrollReveal — lightweight IntersectionObserver for scroll-triggered animations.
 * Adds `.revealed` class to `.reveal` elements when they enter the viewport.
 */
function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
}

export default function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalPurpose, setLeadModalPurpose] = useState('General Inquiry');
  const [leadModalConfig, setLeadModalConfig] = useState('2 BHK');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Pop-up window states for Floor Plans & Location Connectivity
  const [isFloorPlansModalOpen, setIsFloorPlansModalOpen] = useState(false);
  const [floorPlansCategory, setFloorPlansCategory] = useState<'master' | 'tower-a' | 'tower-b'>('master');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationCategory, setLocationCategory] = useState<string>('all');

  // Initialize scroll reveal
  useScrollReveal();

  const handleOpenLeadModal = useCallback((purpose: string = 'General Inquiry', config: string = '2 BHK') => {
    setLeadModalPurpose(purpose);
    setLeadModalConfig(config);
    setIsLeadModalOpen(true);
  }, []);

  const handleOpenFloorPlansModal = useCallback((category: 'master' | 'tower-a' | 'tower-b' = 'master') => {
    setFloorPlansCategory(category);
    setIsFloorPlansModalOpen(true);
  }, []);

  const handleOpenLocationModal = useCallback((category: string = 'all') => {
    setLocationCategory(category);
    setIsLocationModalOpen(true);
  }, []);

  /** Generic lightbox opener shared by every section image. */
  const handleOpenLightbox = useCallback(
    (url: string, title: string, description?: string, category?: string) => {
      setLightbox({ url, title, description, category });
    },
    []
  );

  const handleSelectFloorPlan = useCallback((imageUrl: string, title: string) => {
    setLightbox({
      url: imageUrl,
      title,
      description: 'Architectural floor plan layout.',
      category: 'Floor Plan Blueprint',
    });
  }, []);

  const handleSelectAmenity = useCallback((amenity: AmenityItem) => {
    setLightbox({
      url: amenity.image,
      title: amenity.name,
      description: `${amenity.tagline} — ${amenity.description}`,
      category: amenity.categoryLabel,
    });
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-ivory selection:bg-champagne-400 selection:text-dark-950 font-sans antialiased overflow-x-hidden">
      {/* ─── Global Floating Glass Navigation ─── */}
      <Navbar
        onOpenLeadModal={handleOpenLeadModal}
        onOpenFloorPlansModal={() => handleOpenFloorPlansModal('master')}
        onOpenLocationModal={() => handleOpenLocationModal('all')}
      />

      {/* ─── Chapter 00: Cinematic Hero ─── */}
      <Hero onOpenLeadModal={handleOpenLeadModal} />

      {/* ─── Chapter 01: Arrival (Pinned GSAP Scroll Story) ─── */}
      <StoryArrival />

      {/* ─── Chapter 02: A New Kind of Luxury (40% Open Greens) ─── */}
      <StoryGreens onOpenLightbox={handleOpenLightbox} />

      {/* ─── Chapter 03: Residences (Living Volumes) ─── */}
      <Residences
        onOpenLeadModal={handleOpenLeadModal}
        onSelectFloorPlan={handleSelectFloorPlan}
        onOpenFloorPlansModal={handleOpenFloorPlansModal}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* ─── Chapter 05: Life Beyond Four Walls (Amenities) ─── */}
      <Amenities
        onSelectAmenity={handleSelectAmenity}
        onOpenLeadModal={handleOpenLeadModal}
      />

      {/* ─── Chapter 06: Location & Connectivity (18.3m Boulevard) ─── */}
      <LocationConnectivity onOpenModal={handleOpenLocationModal} />

      {/* ─── Chapter 07: Crafted in Every Detail (Specifications) ─── */}
      <Specifications onOpenLeadModal={handleOpenLeadModal} />

      {/* ─── Interactive Floor Plans ─── */}
      <FloorPlans
        onOpenLeadModal={handleOpenLeadModal}
        onOpenModal={handleOpenFloorPlansModal}
        onSelectFloorPlanLightbox={handleSelectFloorPlan}
      />

      {/* ─── Curated Image Gallery ─── */}
      <Gallery onOpenLeadModal={handleOpenLeadModal} />

      {/* ─── Developer Heritage & Trust ─── */}
      <DeveloperTrust onOpenLeadModal={handleOpenLeadModal} onOpenLightbox={handleOpenLightbox} />

      {/* ─── Private Concierge Experience (Enquiry CTA) ─── */}
      <EnquiryCTA onOpenLeadModal={handleOpenLeadModal} />

      {/* ─── Spacious Editorial Footer ─── */}
      <Footer />

      {/* ─── Floating Glass Action Pill ─── */}
      <StickyActionBar onOpenLeadModal={handleOpenLeadModal} />

      {/* ─── Interactive Lead Capture Modal ─── */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultPurpose={leadModalPurpose}
        defaultConfig={leadModalConfig}
      />

      {/* ─── Global Automatic Enquiry Popup (10s Delay) ─── */}
      <EnquiryPopup delayMs={10000} />

      {/* ─── Floor Plans Pop-up ─── */}
      <FloorPlansModal
        isOpen={isFloorPlansModalOpen}
        onClose={() => setIsFloorPlansModalOpen(false)}
        onOpenLeadModal={handleOpenLeadModal}
        initialCategory={floorPlansCategory}
      />

      {/* ─── Location Pop-up ─── */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onOpenLeadModal={handleOpenLeadModal}
        initialCategory={locationCategory}
      />

      {/* ─── Fullscreen Image Lightbox ─── */}
      {lightbox && (
        <Lightbox
          isOpen={!!lightbox}
          onClose={() => setLightbox(null)}
          imageUrl={lightbox.url}
          title={lightbox.title}
          description={lightbox.description}
          category={lightbox.category}
        />
      )}
    </div>
  );
}
