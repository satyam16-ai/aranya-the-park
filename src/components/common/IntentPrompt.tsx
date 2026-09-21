import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { easeOutExpo } from '../../lib/motion';

const DISMISS_KEY = 'aranya_prompt_dismissed';
const MIN_ELAPSED_MS = 20_000;
const SCROLL_DEPTH = 0.6;

interface IntentPromptProps {
  /** True while the lead modal is open or has been opened this session. */
  suppressed: boolean;
  onOpen: () => void;
}

/**
 * IntentPrompt — replaces the timed auto-popup. Shows once per session, only
 * after 20 s, when the visitor has read ≥ 60% of the page or (desktop) moves
 * the cursor out through the top of the window. Never shows if the enquiry
 * modal was already used.
 */
export const IntentPrompt: React.FC<IntentPromptProps> = ({ suppressed, onOpen }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const mountedAt = useRef(Date.now());
  const suppressedRef = useRef(suppressed);
  suppressedRef.current = suppressed;

  useEffect(() => {
    if (dismissed) return;

    const ready = () => Date.now() - mountedAt.current >= MIN_ELAPSED_MS && !suppressedRef.current;
    const show = () => {
      if (!ready()) return;
      setVisible(true);
      cleanup();
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) show();
    };
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && window.matchMedia('(pointer: fine)').matches) show();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    // re-check scroll depth once the minimum time has elapsed
    const timer = window.setTimeout(onScroll, MIN_ELAPSED_MS + 50);

    function cleanup() {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.clearTimeout(timer);
    }
    return cleanup;
  }, [dismissed]);

  // If the visitor opens the enquiry modal themselves, retire the prompt.
  useEffect(() => {
    if (suppressed && visible) dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressed]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      /* private mode */
    }
  };

  const accept = () => {
    dismiss();
    onOpen();
  };

  return (
    <AnimatePresence>
      {visible && !suppressed && (
        <motion.aside
          data-surface="linen"
          role="complementary"
          aria-label="Get floor plans and pricing"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.25 } }}
          className="fixed inset-x-4 bottom-24 z-[60] rounded-sm border border-card-border shadow-xl lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[360px]"
        >
          <div className="relative p-5 pr-12">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <div className="flex items-start gap-4">
              <img
                src="/assets/branding/aranya-crest-96.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-11 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="t-h3-ui text-fg">Floor plans &amp; pricing</p>
                <p className="t-small mt-1 text-fg-muted">
                  Receive the 2, 3 &amp; 4 BHK plans and current offers directly from the developer desk.
                </p>
              </div>
            </div>
            <Button size="sm" className="mt-4 w-full" icon={<ArrowRight size={14} />} onClick={accept}>
              Get details
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
