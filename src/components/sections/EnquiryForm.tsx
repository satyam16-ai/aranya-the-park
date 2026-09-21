import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { cn } from '../../lib/cn';
import { crossFade } from '../../lib/motion';
import { submitEnquiry, type EnquiryPayload } from '../../services/enquiryService';
import { projectData } from '../../data/projectData';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { WHATSAPP_URL } from '../layout/StickyActionBar';

type Configuration = EnquiryPayload['configuration'];
type ContactMethod = EnquiryPayload['contactMethod'];

const CONFIGS: Configuration[] = ['2 BHK', '3 BHK', '4 BHK', 'All Configurations'];
const METHODS: ContactMethod[] = ['WhatsApp', 'Phone Call', 'Email'];

const isConfiguration = (v?: string): v is Configuration =>
  !!v && (CONFIGS as string[]).includes(v);

interface EnquiryFormProps {
  purpose: string;
  defaultConfig?: string;
  /** Hide the contact-method and message fields (inline section). */
  compact?: boolean;
  submitLabel?: string;
  onSuccess?: (leadId: string) => void;
  onDone?: () => void;
  className?: string;
}

/** The one enquiry form: used by the lead modal and the closing section. */
export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  purpose,
  defaultConfig,
  compact = false,
  submitLabel = 'Request a private viewing',
  onSuccess,
  onDone,
  className,
}) => {
  const uid = useId();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [configuration, setConfiguration] = useState<Configuration>(isConfiguration(defaultConfig) ? defaultConfig : '2 BHK');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('WhatsApp');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const validate = () => {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = 'Please enter your name.';
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) next.phone = 'Enter a 10-digit Indian mobile number.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email address looks incomplete.';
    if (!consent) next.consent = 'Please allow us to contact you.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await submitEnquiry({
        fullName: fullName.trim(),
        phoneNumber: `+91 ${phone.replace(/\D/g, '')}`,
        email: email.trim() || undefined,
        configuration,
        contactMethod,
        message: message.trim() || undefined,
        purpose,
      });
      setLeadId(res.leadId);
      onSuccess?.(res.leadId);
      try {
        sessionStorage.setItem('aranya_prompt_dismissed', 'true');
      } catch {
        /* private mode */
      }
    } catch (err) {
      console.error('Enquiry submission failed', err);
      setErrors({ form: 'Something went wrong. Please call us or try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setLeadId(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setErrors({});
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {leadId ? (
          <motion.div key="done" variants={crossFade} initial="initial" animate="animate" exit="exit" className="py-4 text-center">
            <span className="icon-ring mx-auto h-16 w-16 text-accent">
              <CheckCircle2 size={28} strokeWidth={1.25} />
            </span>
            <h3 className="t-h3 mt-6 text-fg">Thank you, {fullName.split(' ')[0]}.</h3>
            <p className="t-body mx-auto mt-3 text-fg-muted">
              Our developer desk will reach you on {contactMethod === 'Phone Call' ? 'a call' : contactMethod} shortly.
              Your reference is <span className="font-mono tracking-[0.1em] text-fg">{leadId}</span>.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" icon={<MessageCircle size={14} />}>
                Continue on WhatsApp
              </Button>
              <Button variant="secondary" onClick={onDone ?? reset}>
                {onDone ? 'Back to the site' : 'Send another enquiry'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={crossFade}
            initial="initial"
            animate="animate"
            exit="exit"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div className={cn('grid gap-5', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
              <div>
                <label htmlFor={`${uid}-name`} className="label">
                  Full name *
                </label>
                <input
                  id={`${uid}-name`}
                  name="fullName"
                  autoComplete="name"
                  className="input"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? `${uid}-name-err` : undefined}
                />
                {errors.fullName && (
                  <p id={`${uid}-name-err`} className="t-small mt-1.5 text-[#b3261e]">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="label">
                  Mobile number *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-fg-muted">+91</span>
                  <input
                    id={`${uid}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    className="input pl-12"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id={`${uid}-phone-err`} className="t-small mt-1.5 text-[#b3261e]">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-email`} className="label">
                Email <span className="normal-case tracking-normal text-fg-muted/70">(optional)</span>
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="t-small mt-1.5 text-[#b3261e]">{errors.email}</p>}
            </div>

            <div>
              <span className="label">Configuration</span>
              <Tabs<Configuration>
                ariaLabel="Configuration"
                size="sm"
                grow
                items={CONFIGS.map((c) => ({ id: c, label: c === 'All Configurations' ? 'All' : c }))}
                value={configuration}
                onChange={setConfiguration}
              />
            </div>

            {!compact && (
              <>
                <div>
                  <span className="label">Preferred contact</span>
                  <Tabs<ContactMethod>
                    ariaLabel="Preferred contact method"
                    size="sm"
                    grow
                    items={METHODS.map((m) => ({ id: m, label: m }))}
                    value={contactMethod}
                    onChange={setContactMethod}
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-msg`} className="label">
                    Message or preferred visit date <span className="normal-case tracking-normal text-fg-muted/70">(optional)</span>
                  </label>
                  <textarea
                    id={`${uid}-msg`}
                    name="message"
                    rows={3}
                    className="input resize-none"
                    placeholder="Weekend mornings work best for me…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </>
            )}

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-gold-600"
              />
              <span className="t-small text-fg-muted">
                I authorise representatives of Aranya The Park ({projectData.jointVenture}) to contact me via call,
                WhatsApp or email about floor plans and private site visits. Zero brokerage.
              </span>
            </label>
            {errors.consent && <p className="t-small text-[#b3261e]">{errors.consent}</p>}
            {errors.form && <p className="t-small text-[#b3261e]">{errors.form}</p>}

            <Button type="submit" size="lg" className="w-full" icon={<Send size={14} />} disabled={submitting}>
              {submitting ? 'Sending…' : submitLabel}
            </Button>

            <p className="t-micro text-center text-fg-muted">
              Direct desk{' '}
              <a href={projectData.phoneRaw} className="text-fg transition-colors hover:text-accent-text">
                {projectData.phone}
              </a>{' '}
              · MahaRERA {projectData.mahaRera}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
