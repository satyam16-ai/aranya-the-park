import React, { useState } from 'react';
import { Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { projectData } from '../../data/projectData';
import { submitEnquiry } from '../../services/enquiryService';

interface EnquiryCTAProps {
  onOpenLeadModal?: (purpose?: string, config?: string) => void;
}

export const EnquiryCTA: React.FC<EnquiryCTAProps> = ({ onOpenLeadModal: _onOpenLeadModal }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [configuration, setConfiguration] = useState<'2 BHK' | '3 BHK' | '4 BHK'>('2 BHK');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

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
        contactMethod: 'WhatsApp',
        purpose: 'Begin Your Lushury Life (Private Concierge Form)',
      });

      setReferenceId(response.leadId);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="section-spacing bg-dark-950 relative overflow-hidden border-t border-white/[0.06]">
      {/* Background warm accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-champagne-400/[0.025] rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="relative z-10 glass-panel p-8 sm:p-14 lg:p-16 rounded-[4px] border border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Invitation */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-champagne-300 font-medium block mb-3">
                  PRIVATE CONCIERGE EXPERIENCE
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory font-light tracking-tight leading-[1.1]">
                  Begin Your<br />Lushury Life
                </h2>
              </div>

              <p className="font-sans text-sm sm:text-base text-ivory-muted font-light leading-relaxed">
                Schedule a personalized walkthrough of the sample residences, interactive 3D spatial models, and panoramic sky vistas with our Senior Relationship Concierge.
              </p>

              {/* Direct Touchpoints */}
              <div className="space-y-4 pt-2 border-t border-white/[0.08]">
                <a href={projectData.phoneRaw} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-champagne-300 group-hover:bg-champagne-400 group-hover:text-dark-950 transition-all duration-300">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70 block">Direct Sales Desk</span>
                    <span className="text-sm text-ivory font-medium group-hover:text-champagne-300 transition-colors">
                      {projectData.phone}
                    </span>
                  </div>
                </a>

                <a href="https://wa.me/919769766500" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                    <MessageSquare size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70 block">Instant Chat</span>
                    <span className="text-sm text-ivory font-medium group-hover:text-[#25D366] transition-colors">
                      WhatsApp Concierge
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: Glass Form */}
            <div className="lg:col-span-6 bg-dark-950/80 border border-white/[0.08] p-6 sm:p-10 rounded-[4px] shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-champagne-400/10 border border-champagne-400/30 flex items-center justify-center text-champagne-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-serif text-2xl text-ivory font-light">Private Preview Registered</h4>
                  <p className="font-sans text-sm text-ivory-muted font-light leading-relaxed">
                    Thank you, {fullName}. Reference: <strong className="text-champagne-300 font-medium">{referenceId}</strong>. Our relationship manager will reach out shortly.
                  </p>
                  <div className="pt-4 flex flex-col gap-3">
                    <a
                      href={`https://wa.me/919769766500?text=${encodeURIComponent(
                        `Hello, I am ${fullName} (${referenceId}). I just requested a private preview of ${configuration} at Aranya The Park.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lux py-3 px-4 bg-[#25D366] text-white font-sans text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all rounded-[3px]"
                    >
                      Connect on WhatsApp
                    </a>
                    <Button
                      variant="outline-gold"
                      size="sm"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFullName('');
                        setPhoneNumber('');
                        setEmail('');
                      }}
                    >
                      Submit Another Enquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-6">
                    <h3 className="font-serif text-xl sm:text-2xl text-ivory font-light">
                      Request A Private Viewing
                    </h3>
                    <p className="text-xs text-ivory-muted/70 mt-1 font-sans">
                      Direct developer consultation and personalized residence walkthrough
                    </p>
                  </div>

                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider text-ivory-muted/80 block mb-1.5" htmlFor="cta-name">
                      Full Name *
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aditya Singhania"
                      className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[3px] px-4 py-3 text-sm text-ivory placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:bg-white/[0.06] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider text-ivory-muted/80 block mb-1.5" htmlFor="cta-mobile">
                      Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-ivory-muted/50 font-mono text-xs">+91</span>
                      <input
                        id="cta-mobile"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile"
                        className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[3px] pl-12 pr-4 py-3 text-sm text-ivory placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:bg-white/[0.06] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider text-ivory-muted/80 block mb-1.5" htmlFor="cta-email">
                      Email Address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[3px] px-4 py-3 text-sm text-ivory placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:bg-white/[0.06] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[11px] uppercase tracking-wider text-ivory-muted/80 block mb-1.5">
                      Configuration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['2 BHK', '3 BHK', '4 BHK'] as const).map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setConfiguration(item)}
                          className={`py-2.5 px-3 text-center font-sans text-xs uppercase tracking-wider transition-all cursor-pointer rounded-[3px] border ${
                            configuration === item
                              ? 'bg-champagne-400 border-champagne-300 text-dark-950 font-semibold shadow-[0_2px_10px_rgba(200,169,107,0.3)]'
                              : 'bg-white/[0.03] border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.06]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 flex items-start gap-2.5 text-[11px] text-ivory-muted/60 font-sans">
                    <input
                      type="checkbox"
                      id="cta-consent"
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 accent-[#C8A96B] cursor-pointer"
                      required
                    />
                    <label htmlFor="cta-consent" className="cursor-pointer leading-relaxed">
                      I agree to receive project details via Call, WhatsApp, or Email. Direct developer interaction.
                    </label>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={isSubmitting || !consentAgreed}
                      className="w-full justify-center tracking-widest uppercase font-semibold text-xs"
                      icon={<ArrowRight size={15} />}
                    >
                      {isSubmitting ? 'Registering…' : 'REQUEST A PRIVATE VIEWING'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
