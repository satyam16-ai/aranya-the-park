import React, { useState, useEffect, useCallback } from 'react';
import { LeadFormModal } from '../sections/LeadFormModal';

const POPUP_DISMISSED_KEY = 'aranya_enquiry_popup_dismissed';

interface EnquiryPopupProps {
  /** Optional delay in milliseconds before triggering the popup (default: 10000ms = 10s) */
  delayMs?: number;
}

/**
 * EnquiryPopup — Global Automatic Luxury Consultation Modal.
 * Appears smoothly exactly 10 seconds after page load.
 * Dismissal is persisted in sessionStorage so visitors are not repeatedly interrupted.
 * Reuses LeadFormModal for single source of truth in styling, validation, and layout.
 */
export const EnquiryPopup: React.FC<EnquiryPopupProps> = ({ delayMs = 10000 }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Expose developer trigger helpers on window for instant testing
    if (typeof window !== 'undefined') {
      (window as any).__openEnquiryPopup = () => setIsOpen(true);
      (window as any).__resetEnquiryPopup = () => {
        try {
          sessionStorage.removeItem(POPUP_DISMISSED_KEY);
        } catch {}
        setIsOpen(true);
      };
    }

    // Check if dismissed in this browser session
    try {
      if (sessionStorage.getItem(POPUP_DISMISSED_KEY) === 'true') {
        console.info('[Aranya The Park] Enquiry popup is suppressed because it was previously closed in this session.');
        return;
      }
    } catch {}

    console.info(`[Aranya The Park] Global enquiry popup scheduled to appear in ${delayMs / 1000}s...`);

    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(POPUP_DISMISSED_KEY) === 'true') {
          return;
        }
      } catch {}

      console.info('[Aranya The Park] 10s elapsed — opening enquiry popup.');
      setIsOpen(true);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [delayMs]);

  const handleClose = useCallback(() => {
    try {
      sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    } catch {}
    setIsOpen(false);
  }, []);

  return (
    <LeadFormModal
      isOpen={isOpen}
      onClose={handleClose}
      defaultPurpose="Automated Consultation"
    />
  );
};
