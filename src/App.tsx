import { lazy, Suspense, useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StickyActionBar } from './components/layout/StickyActionBar';
import { Hero } from './components/sections/Hero';
import { Highlights } from './components/sections/Highlights';
import { Chapter } from './components/sections/Chapter';
import { Residences } from './components/sections/Residences';
import { Amenities } from './components/sections/Amenities';
import { LocationConnectivity } from './components/sections/LocationConnectivity';
import { Specifications } from './components/sections/Specifications';
import { Gallery } from './components/sections/Gallery';
import { DeveloperTrust } from './components/sections/DeveloperTrust';
import { EnquiryCTA } from './components/sections/EnquiryCTA';
import { IntentPrompt } from './components/common/IntentPrompt';
import type { FloorPlanCategory } from './components/sections/FloorPlansModal';

const LeadFormModal = lazy(() =>
  import('./components/sections/LeadFormModal').then((m) => ({ default: m.LeadFormModal }))
);
const FloorPlansModal = lazy(() =>
  import('./components/sections/FloorPlansModal').then((m) => ({ default: m.FloorPlansModal }))
);
const LocationModal = lazy(() =>
  import('./components/sections/LocationModal').then((m) => ({ default: m.LocationModal }))
);

export default function App() {
  const [lead, setLead] = useState<{ open: boolean; purpose: string; config?: string; everOpened: boolean }>({
    open: false,
    purpose: 'General Inquiry',
    everOpened: false,
  });
  const [floorPlans, setFloorPlans] = useState<{ open: boolean; category: FloorPlanCategory; ever: boolean }>({
    open: false,
    category: 'master',
    ever: false,
  });
  const [location, setLocation] = useState<{ open: boolean; category: string; ever: boolean }>({
    open: false,
    category: 'all',
    ever: false,
  });

  const openLead = useCallback((purpose: string = 'General Inquiry', config?: string) => {
    setLead({ open: true, purpose, config, everOpened: true });
  }, []);
  const closeLead = useCallback(() => setLead((l) => ({ ...l, open: false })), []);

  const openFloorPlans = useCallback((category: FloorPlanCategory = 'master') => {
    setFloorPlans({ open: true, category, ever: true });
  }, []);
  const closeFloorPlans = useCallback(() => setFloorPlans((f) => ({ ...f, open: false })), []);

  const openLocation = useCallback(
    (category: string = 'all') => setLocation({ open: true, category, ever: true }),
    []
  );
  const closeLocation = useCallback(() => setLocation((l) => ({ ...l, open: false })), []);

  return (
    <MotionConfig reducedMotion="user">
      <Navbar onOpenLeadModal={openLead} onOpenFloorPlansModal={() => openFloorPlans('master')} />

      <main id="main">
        <Hero onOpenLeadModal={openLead} />
        <Highlights />
        <Chapter />
        <Residences onOpenLeadModal={openLead} onOpenFloorPlansModal={openFloorPlans} />
        <Amenities />
        <LocationConnectivity onOpenLocationModal={openLocation} />
        <Specifications />
        <Gallery />
        <DeveloperTrust />
        <EnquiryCTA />
      </main>

      <Footer onOpenFloorPlansModal={() => openFloorPlans('master')} onOpenLocationModal={() => openLocation('all')} />
      <StickyActionBar onOpenLeadModal={openLead} />
      <IntentPrompt suppressed={lead.open || lead.everOpened} onOpen={() => openLead('Intent Prompt')} />

      <Suspense fallback={null}>
        {(lead.open || lead.everOpened) && (
          <LeadFormModal isOpen={lead.open} onClose={closeLead} purpose={lead.purpose} defaultConfig={lead.config} />
        )}
        {floorPlans.ever && (
          <FloorPlansModal
            isOpen={floorPlans.open}
            onClose={closeFloorPlans}
            onOpenLeadModal={openLead}
            initialCategory={floorPlans.category}
          />
        )}
        {location.ever && (
          <LocationModal isOpen={location.open} onClose={closeLocation} initialCategory={location.category} />
        )}
      </Suspense>
    </MotionConfig>
  );
}
