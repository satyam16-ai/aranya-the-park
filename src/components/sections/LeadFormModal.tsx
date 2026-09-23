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
  Loader2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectData } from '../../data/projectData';
import { submitEnquiry, sendOtp, verifyOtp, unlockPlans } from '../../services/enquiryService';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: string;
  defaultConfig?: string;
}

/* lucide-react no longer ships brand marks, so the four we need are inlined. */
const socialIcons: Record<string, React.FC> = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 6.35a3.49 3.49 0 1 0 0 6.98 3.49 3.49 0 0 0 0-6.98Zm0 5.76a2.27 2.27 0 1 1 0-4.54 2.27 2.27 0 0 1 0 4.54Zm4.44-5.9a.82.82 0 1 1-1.63 0 .82.82 0 0 1 1.63 0Z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77A26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.9h3.4V21h-3.4V8.9Zm5.53 0h3.26v1.65h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.08 2.27 4.08 5.21V21h-3.4v-5.33c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-3.4V8.9Z" />
    </svg>
  ),
};

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

  /* OTP step: 'idle' before a code is requested, 'sent' while awaiting the
     code, 'verified' once the number is confirmed. Submission is blocked
     until 'verified'. */
  const [otpStage, setOtpStage] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');

  const phoneIsComplete = /^[6-9]\d{9}$/.test(phoneNumber);

  /* Editing the number after verifying invalidates the verification. */
  useEffect(() => {
    setOtpStage('idle');
    setOtpCode('');
    setOtpNotice('');
    setOtpError('');
  }, [phoneNumber]);

  const handleSendOtp = async () => {
    if (!phoneIsComplete || otpBusy) return;
    setOtpBusy(true);
    setOtpError('');
    const res = await sendOtp(phoneNumber);
    setOtpBusy(false);
    if (res.success) {
      setOtpStage('sent');
      setOtpNotice(res.message);
    } else {
      setOtpError(res.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpBusy) return;
    setOtpBusy(true);
    setOtpError('');
    const res = await verifyOtp(phoneNumber, otpCode);
    setOtpBusy(false);
    if (res.success) {
      setOtpStage('verified');
      setOtpNotice(res.message);
    } else {
      setOtpError(res.message);
    }
  };

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
    if (otpStage !== 'verified') return;

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
      // A submitted enquiry is what reveals the floor plans for this session.
      unlockPlans();
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
    setOtpStage('idle');
    setOtpCode('');
    setOtpNotice('');
    setOtpError('');
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
              Enquiry Received
            </span>
            <h4 className="font-serif text-2xl text-ivory font-light">
              Thank You, {fullName}
            </h4>
            <p className="text-ivory-muted font-sans text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
              Your enquiry for <strong className="text-ivory">{configuration}</strong> is with our sales team under reference <strong className="text-champagne-300">{generatedLeadId}</strong>.
            </p>
          </div>

          {/* Contact Confirmation Banner */}
          <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[4px] text-xs text-ivory-muted text-left space-y-1 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-champagne-300 font-medium text-[11px]">
              <span>Preferred Communication</span>
              <span className="uppercase tracking-wider font-semibold">{contactMethod}</span>
            </div>
            <p className="text-[11px] text-ivory-muted/70 font-light">
              A member of our sales team will be in touch shortly with floor plans and current pricing.
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
              <span>Continue on WhatsApp</span>
            </a>

            {/* Follow the project — hidden until the URLs are filled in projectData */}
            {projectData.socials.some((s) => s.url) && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted/60">
                  Follow Aranya The Park
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  {projectData.socials
                    .filter((s) => s.url)
                    .map((s) => {
                      const Icon = socialIcons[s.label];
                      if (!Icon) return null;
                      return (
                        <a
                          key={s.label}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/[0.12] text-ivory-muted hover:text-champagne-300 hover:border-champagne-400/50 transition-colors"
                        >
                          <Icon />
                        </a>
                      );
                    })}
                </div>
              </div>
            )}

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
              <span>MahaRERA registered project</span>
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
                <span className="absolute left-3.5 text-ivory-muted/50 text-xs tabular-nums font-semibold">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="w-full h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] pl-11 pr-[104px] text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-xs"
                />

                {/* Verification trigger lives inside the field so the form stays two columns */}
                {otpStage === 'verified' ? (
                  <span className="absolute right-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-champagne-300">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!phoneIsComplete || otpBusy}
                    className="absolute right-2 h-8 px-3 rounded-[3px] bg-champagne-400/90 hover:bg-champagne-300 disabled:bg-white/[0.06] disabled:text-ivory-muted/40 text-dark-950 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {otpBusy && otpStage === 'idle' ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : otpStage === 'sent' ? (
                      'Resend'
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* One-time password */}
          {otpStage === 'sent' && (
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block">
                Verification Code <span className="text-champagne-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  className="flex-1 h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] px-3.5 text-ivory tracking-[0.4em] placeholder:tracking-normal placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length !== 6 || otpBusy}
                  className="shrink-0 px-5 rounded-[4px] border border-champagne-400/50 hover:border-champagne-300 text-champagne-300 hover:text-champagne-200 disabled:opacity-40 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {otpBusy ? <Loader2 size={13} className="animate-spin" /> : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {(otpNotice || otpError) && otpStage !== 'verified' && (
            <p className={`text-[10px] ${otpError ? 'text-red-300' : 'text-ivory-muted/70'}`}>
              {otpError || otpNotice}
            </p>
          )}

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
              placeholder="e.g. Preferred floor, budget or a good time to call"
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
              I authorise representatives of Aranya The Park (Zaveri Realty & BKM Mindspace) to contact me by call, WhatsApp or email about floor plans, pricing and site visits.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={isSubmitting || !consentAgreed || otpStage !== 'verified'}
              className="w-full justify-center tracking-wider uppercase font-semibold text-xs py-3"
              icon={<Send size={13} />}
            >
              {isSubmitting
                ? 'Sending…'
                : otpStage !== 'verified'
                  ? 'VERIFY YOUR NUMBER TO CONTINUE'
                  : 'REQUEST A PRIVATE VISIT'}
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
