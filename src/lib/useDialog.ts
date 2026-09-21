import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/** Locks body scroll while `active`; safe for stacked overlays. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.style.overflow = prev;
    };
  }, [active]);
}

/** Marks everything outside the overlay inert (the app root) while `active`. */
export function useInertRoot(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.getElementById('root');
    if (!root) return;
    const wasInert = root.hasAttribute('inert');
    root.setAttribute('inert', '');
    return () => {
      if (!wasInert) root.removeAttribute('inert');
    };
  }, [active]);
}

/** Calls `onClose` on Escape while `active`. */
export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

/**
 * Traps Tab focus inside `ref` while `active`, focuses the first focusable
 * (or `initialFocus`) on open and restores focus to the opener on close.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, initialFocus?: string) {
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    opener.current = document.activeElement;

    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const raf = requestAnimationFrame(() => {
      const target = (initialFocus && node.querySelector<HTMLElement>(initialFocus)) || focusables()[0] || node;
      target.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('keydown', onKey);
      const el = opener.current as HTMLElement | null;
      if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
    };
  }, [ref, active, initialFocus]);
}

/** All four behaviours a modal dialog needs. */
export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void, initialFocus?: string) {
  useScrollLock(active);
  useInertRoot(active);
  useEscape(active, onClose);
  useFocusTrap(ref, active, initialFocus);
}
