/**
 * Enquiry Submission Service
 * 
 * Clean frontend form architecture with an isolated submission handler.
 * Ready for integration with real CRM webhooks (e.g. LeadSquared, Salesforce, HubSpot)
 * or custom backend REST APIs.
 */

export interface EnquiryPayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  configuration: '2 BHK' | '3 BHK' | '4 BHK' | 'All Configurations';
  contactMethod: 'WhatsApp' | 'Phone Call' | 'Email';
  message?: string;
  purpose: string;
  timestamp?: string;
}

export interface EnquiryResponse {
  success: boolean;
  leadId: string;
  message: string;
  timestamp: string;
}

const STORAGE_KEY = 'aranya_the_park_enquiries';

/**
 * Submits an enquiry payload.
 * When ready, replace the internal implementation with a real `fetch('/api/leads', ...)` call.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
  const timestamp = new Date().toISOString();
  const leadId = `ATP-${Date.now().toString(36).toUpperCase()}`;

  const fullRecord = {
    ...payload,
    leadId,
    timestamp,
    status: 'registered',
  };

  // Simulate network latency (250ms) for smooth optimistic UI transition
  await new Promise((resolve) => setTimeout(resolve, 250));

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.unshift(fullRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Local storage write skipped:', err);
  }

  return {
    success: true,
    leadId,
    message: 'Your enquiry has been registered with the Aranya The Park sales desk.',
    timestamp,
  };
}

/**
 * Retrieve all registered leads from local storage (for debugging/admin inspection)
 */
export function getStoredEnquiries(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/* ────────────────────────────────────────────────────────────────
   OTP VERIFICATION — stubbed
   ────────────────────────────────────────────────────────────────
   The UI below is final; only these two functions need replacing when a
   provider account exists (MSG91 / Twilio / WhatsApp Business API). Swap the
   bodies for `fetch('/api/otp/send'|'/api/otp/verify', ...)` — the modal does
   not care how the code is delivered.

   Until then any 6-digit code is accepted, so the form stays testable and the
   flow can be demoed. NOTE: this is not security; it must be wired to a real
   provider before the site takes live leads. */

const OTP_SESSION_KEY = 'aranya_verified_phone';

/** Pretends to dispatch a one-time code to the given number. */
export async function sendOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    success: true,
    message: `Verification code sent to +91 ${phoneNumber}.`,
  };
}

/** Accepts any 6-digit code. Replace with a real provider check. */
export async function verifyOtp(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!/^\d{6}$/.test(code)) {
    return { success: false, message: 'Enter the 6-digit code.' };
  }

  try {
    sessionStorage.setItem(OTP_SESSION_KEY, phoneNumber);
  } catch {
    /* private mode — verification simply won't persist across reloads */
  }
  return { success: true, message: 'Number verified.' };
}

/* ────────────────────────────────────────────────────────────────
   FLOOR PLAN ACCESS
   ────────────────────────────────────────────────────────────────
   Floor plans render blurred until a visitor submits an enquiry. The unlock
   lasts for the browsing session only, so a returning visitor enquires again. */

const PLANS_UNLOCKED_KEY = 'aranya_plans_unlocked';

export function hasUnlockedPlans(): boolean {
  try {
    return sessionStorage.getItem(PLANS_UNLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function unlockPlans(): void {
  try {
    sessionStorage.setItem(PLANS_UNLOCKED_KEY, 'true');
    window.dispatchEvent(new Event('aranya:plans-unlocked'));
  } catch {
    /* ignore — plans stay blurred, which is the safe default */
  }
}
