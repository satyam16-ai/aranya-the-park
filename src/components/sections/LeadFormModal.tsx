import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Download,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectData } from '../../data/projectData';
import { submitEnquiry } from '../../services/enquiryService';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: string;
  defaultConfig?: string;
}

type ConfigurationChoice = '2 BHK' | '3 BHK' | '4 BHK' | 'All Configurations';
type ContactMethodChoice = 'WhatsApp' | 'Phone Call' | 'Email';

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  defaultPurpose = 'Enquire Now',
  defaultConfig = '2 BHK',
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [configuration, setConfiguration] = useState<ConfigurationChoice>(
    (defaultConfig as ConfigurationChoice) || '2 BHK'
  );
  const [contactMethod, setContactMethod] = useState<ContactMethodChoice>('WhatsApp');
  const [message, setMessage] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState('');

  // Synchronize default config if changed from outside
  useEffect(() => {
    if (defaultConfig) {
      if (['2 BHK', '3 BHK', '4 BHK', 'All Configurations'].includes(defaultConfig)) {
        setConfiguration(defaultConfig as ConfigurationChoice);
      }
    }
  }, [defaultConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !consentAgreed) return;

    setIsSubmitting(true);

    try {
      const response = await submitEnquiry({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        configuration,
        contactMethod,
        message: message.trim() || undefined,
        purpose: defaultPurpose,
      });

      setGeneratedLeadId(response.leadId);
      setIsSubmitted(true);
      try {
        sessionStorage.setItem('aranya_enquiry_popup_dismissed', 'true');
      } catch {}
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setMessage('');
    setConsentAgreed(true);
    onClose();
  };

  const getPurposeIcon = () => {
    const p = defaultPurpose.toLowerCase();
    if (p.includes('visit') || p.includes('tour')) return <Calendar size={14} className="text-champagne-300" />;
    if (p.includes('brochure') || p.includes('deck') || p.includes('pdf')) return <Download size={14} className="text-champagne-300" />;
    if (p.includes('callback') || p.includes('call')) return <Clock size={14} className="text-champagne-300" />;
    return <Sparkles size={14} className="text-champagne-300" />;
  };

  const isNavbarOrGeneral =
    !defaultPurpose ||
    defaultPurpose === 'Navbar Inquiry' ||
    defaultPurpose === 'General Inquiry' ||
    defaultPurpose === 'Enquire Now' ||
    defaultPurpose === 'Hero Enquiry' ||
    defaultPurpose === 'Mobile Quick Action' ||
    defaultPurpose === 'Automated Consultation' ||
    defaultPurpose.includes('Consultation');

  const modalTitle = isSubmitted
    ? 'Enquiry Confirmed'
    : isNavbarOrGeneral
    ? 'Enquire About Aranya The Park'
    : defaultPurpose;

  const modalSubtitle = isSubmitted
    ? `Reference ID: ${generatedLeadId}`
    : 'Malad West · Mumbai';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      size="md"
    >
      {isSubmitted ? (
        /* Minimalist, Premium Success State */
        <div className="py-6 text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-14 h-14 mx-auto rounded-full bg-champagne-400/10 border border-champagne-400/30 flex items-center justify-center text-champagne-300">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-300 font-semibold">
              Direct Developer Registration
            </span>
            <h4 className="font-serif text-2xl text-ivory font-light">
              Thank You, {fullName}
            </h4>
            <p className="text-ivory-muted font-sans text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
              Your inquiry regarding <strong className="text-ivory">{configuration}</strong> has been logged directly with the authorized sales concierge desk under reference <strong className="text-champagne-300">{generatedLeadId}</strong>.
            </p>
          </div>

          {/* Contact Confirmation Banner */}
          <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[4px] text-xs text-ivory-muted text-left space-y-1 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-champagne-300 font-medium text-[11px]">
              <span>Preferred Communication</span>
              <span className="uppercase tracking-wider font-semibold">{contactMethod}</span>
            </div>
            <p className="text-[11px] text-ivory-muted/70 font-light">
              A designated senior relationship manager will connect with you shortly with authentic floor plans and pricing.
            </p>
          </div>

          {/* Quick Action Touchpoints */}
          <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
            <a
              href={`https://wa.me/919769766500?text=${encodeURIComponent(
                `Hello Aranya The Park Team, I am ${fullName}. I have registered an enquiry (${generatedLeadId}) for ${configuration}. Please share the digital brochure and floor plans.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lux w-full py-2.5 px-4 bg-[#25D366] text-white font-sans text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 hover:brightness-105 transition-all rounded-[4px] shadow-md"
            >
              <MessageSquare size={14} />
              <span>Connect Instantly on WhatsApp</span>
            </a>

            <button
              onClick={handleResetAndClose}
              className="py-1.5 text-ivory-muted/60 hover:text-ivory text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      ) : (
        /* Compact, Luxury Two-Column Enquiry Form */
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 font-sans text-xs">
          {/* Subtle MahaRERA & Developer Desk Strip */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-[4px] text-[11px] text-ivory-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-champagne-400" />
              <span>MahaRERA: <strong className="text-ivory font-mono text-[10px] sm:text-[11px]">{projectData.mahaRera}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-champagne-300">
              {getPurposeIcon()}
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold">
                Direct Developer Desk
              </span>
            </div>
          </div>

          {/* Two-Column Grid: Full Name & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
                Full Name <span className="text-champagne-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] px-3.5 text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
                Mobile Number <span className="text-champagne-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-ivory-muted/50 font-mono text-xs">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="w-full h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] pl-11 pr-3.5 text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-xs"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
              Email Address <span className="text-ivory-muted/50 lowercase">(optional for digital brochure)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] px-3.5 text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-xs"
            />
          </div>

          {/* Interested Configuration — 4 options in 1 row on desktop */}
          <div className="space-y-1">
            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
              Configuration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['2 BHK', '3 BHK', '4 BHK', 'All Configurations'] as ConfigurationChoice[]).map((cfg) => (
                <button
                  type="button"
                  key={cfg}
                  onClick={() => setConfiguration(cfg)}
                  className={`py-2 px-2 text-center rounded-[4px] border font-sans text-xs tracking-wider transition-all cursor-pointer ${
                    configuration === cfg
                      ? 'border-champagne-400 bg-champagne-400 text-dark-950 font-semibold shadow-sm'
                      : 'border-white/[0.08] bg-white/[0.02] text-ivory-muted hover:text-ivory hover:border-white/[0.2]'
                  }`}
                >
                  {cfg}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Contact Channel — 3 options in 1 row */}
          <div className="space-y-1">
            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
              Preferred Contact Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'WhatsApp' as ContactMethodChoice, icon: <MessageSquare size={13} />, label: 'WhatsApp' },
                { id: 'Phone Call' as ContactMethodChoice, icon: <Phone size={13} />, label: 'Phone Call' },
                { id: 'Email' as ContactMethodChoice, icon: <Mail size={13} />, label: 'Email' },
              ].map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setContactMethod(method.id)}
                  className={`py-2 px-2 text-center rounded-[4px] border font-sans text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    contactMethod === method.id
                      ? 'border-champagne-400 bg-white/[0.08] text-champagne-300 font-semibold'
                      : 'border-white/[0.08] bg-white/[0.02] text-ivory-muted/70 hover:text-ivory hover:border-white/[0.2]'
                  }`}
                >
                  {method.icon}
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Message / Visit Date */}
          <div className="space-y-1">
            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
              Message or Preferred Visit Date <span className="text-ivory-muted/50 lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Interested in high floor 3 BHK with sunrise sundeck view..."
              className="w-full h-[76px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] p-3 text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all resize-none text-base sm:text-xs"
            />
          </div>

          {/* Mandatory Consent Checkbox */}
          <div className="pt-0.5 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="consent-check"
              checked={consentAgreed}
              onChange={(e) => setConsentAgreed(e.target.checked)}
              className="mt-0.5 accent-[#C8A96B] cursor-pointer shrink-0"
              required
            />
            <label htmlFor="consent-check" className="text-[10px] text-ivory-muted/65 leading-relaxed font-light cursor-pointer select-none">
              I authorize representatives of Aranya The Park (Zaveri Realty & BKM Mindspace) to contact me via Call, WhatsApp, or Email regarding floor plans and private site visits. Zero brokerage.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={isSubmitting || !consentAgreed}
              className="w-full justify-center tracking-wider uppercase font-semibold text-xs py-3"
              icon={<Send size={13} />}
            >
              {isSubmitting ? 'Registering…' : 'REQUEST A PRIVATE VIEWING'}
            </Button>
          </div>

          {/* Direct WhatsApp / Phone Secondary Line */}
          <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-ivory-muted/65">
            <span>Direct Desk: <strong className="text-ivory">{projectData.phone}</strong></span>
            <a
              href={`https://wa.me/919769766500?text=${encodeURIComponent(
                'Hello Aranya The Park Team, I would like immediate project assistance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne-300 hover:text-champagne-200 uppercase tracking-wider flex items-center gap-1 font-medium transition-colors"
            >
              <span>Quick WhatsApp</span>
              <ChevronRight size={10} />
            </a>
          </div>
        </form>
      )}
    </Modal>
  );
};
