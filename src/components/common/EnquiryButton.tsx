import React, { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Send } from 'lucide-react';

interface EnquiryButtonProps {
  /** Text on the trigger button */
  label?: string;
  /** Variant passed to Button */
  variant?: 'gold' | 'outline' | 'dark';
  /** Size passed to Button */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * EnquiryButton — a self-contained CTA that opens a lead-capture modal.
 * Styled with the luxury form control tokens from the design system.
 */
export const EnquiryButton: React.FC<EnquiryButtonProps> = ({
  label = 'Enquire Now',
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
        icon={<Send size={13} strokeWidth={1.5} />}
      >
        {label}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsSubmitted(false);
        }}
        title="Schedule a Private Viewing"
        size="md"
      >
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-4 border border-champagne-400/40 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" className="text-champagne-400" />
              </svg>
            </div>
            <h4 className="heading-serif text-xl text-cream-100 mb-2">Thank You</h4>
            <p className="prose-editorial">Our team will connect with you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-luxury-label" htmlFor="enquiry-name">
                Full Name
              </label>
              <input
                id="enquiry-name"
                type="text"
                className="input-luxury"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="input-luxury-label" htmlFor="enquiry-phone">
                Phone
              </label>
              <input
                id="enquiry-phone"
                type="tel"
                className="input-luxury"
                placeholder="+91 00000 00000"
                required
              />
            </div>
            <div>
              <label className="input-luxury-label" htmlFor="enquiry-email">
                Email
              </label>
              <input
                id="enquiry-email"
                type="email"
                className="input-luxury"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="input-luxury-label" htmlFor="enquiry-config">
                Configuration Interest
              </label>
              <select id="enquiry-config" className="input-luxury">
                <option value="">Select configuration</option>
                <option value="2bhk">2 BHK</option>
                <option value="3bhk">3 BHK</option>
                <option value="4bhk">4 BHK Duplex</option>
              </select>
            </div>
            <Button variant="gold" size="lg" type="submit" className="w-full mt-2">
              Submit Enquiry
            </Button>
            <p className="text-[0.625rem] text-stone-500 text-center mt-3">
              By submitting, you agree to our privacy policy.
            </p>
          </form>
        )}
      </Modal>
    </>
  );
};
