import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { EnquiryForm } from './EnquiryForm';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose?: string;
  defaultConfig?: string;
}

/** Map internal purpose strings to a human title for the dialog header. */
const titleFor = (purpose: string, submitted: boolean): string => {
  if (submitted) return 'Enquiry received';
  const m = purpose.match(/(\d) BHK/);
  if (m) return `Enquire about the ${m[1]} BHK residence`;
  if (/floor plan/i.test(purpose)) return 'Floor plans & pricing';
  if (/visit|viewing/i.test(purpose)) return 'Book a private viewing';
  return 'Enquire about Aranya The Park';
};

const brandLockup = (
  <span className="flex items-center gap-3">
    <img
      src="/assets/branding/aranya-crest-96.png"
      srcSet="/assets/branding/aranya-crest-48.png 1x, /assets/branding/aranya-crest-96.png 2x, /assets/branding/aranya-crest-144.png 3x"
      alt=""
      width={44}
      height={44}
      className="h-10 w-10 shrink-0"
    />
    <img
      src="/assets/branding/aranya-wordmark-320.png"
      srcSet="/assets/branding/aranya-wordmark-160.png 1x, /assets/branding/aranya-wordmark-320.png 2x, /assets/branding/aranya-wordmark-480.png 3x"
      alt="Aranya The Park"
      width={160}
      height={45}
      className="h-9 w-auto shrink-0"
    />
  </span>
);

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  purpose = 'General Inquiry',
  defaultConfig,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const title = titleFor(purpose, submitted);

  const handleClose = () => {
    onClose();
    // reset after the exit animation
    window.setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={brandLockup}
      ariaLabel={title}
      subtitle={`${title} · Malad West, Mumbai`}
      size="md"
      surface="linen"
      initialFocus="input[name='fullName']"
    >
      <EnquiryForm
        purpose={purpose}
        defaultConfig={defaultConfig}
        onSuccess={() => setSubmitted(true)}
        onDone={handleClose}
      />
    </Modal>
  );
};
