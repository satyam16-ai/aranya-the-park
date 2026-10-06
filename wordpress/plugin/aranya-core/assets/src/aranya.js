/**
 * Aranya The Park — site behaviour (Alpine.js components).
 *
 * Each component here is the port of one React component's state and effects;
 * the markup it drives is printed by the matching Elementor widget with the
 * same Tailwind classes. Names in comments refer to the React files in src/.
 *
 * Alpine is bundled into this file as a private instance (build/build-js.mjs)
 * and never touches window.Alpine: Elementor 4 ships its own Alpine for its
 * atomic widgets, and two instances must not claim the same markup. Ours
 * answers only to the `ar-` prefix (ar-data, ar-show, ar-on:click,
 * ar-bind:class …) — markup uses no `x-`, `@` or `:` shorthand, so Elementor's
 * instance finds nothing of ours to process. Widgets re-rendered in the
 * Elementor editor are picked up by Alpine's mutation observer.
 *
 * Public API (used by widget markup and available to custom code):
 *   Aranya.openLead(purpose?, config?)   — the enquiry modal (LeadFormModal)
 *   Aranya.openLightbox({url,title,description,category,credit})
 *   Aranya.openFloorPlans(category?)     — 'master' | 'tower-a' | 'tower-b'
 *   Aranya.openLocation(category?)       — 'all' | 'connectivity' | …
 *   Aranya.unlockPlans()
 */
import Alpine from 'alpinejs';

(() => {
  'use strict';

  const cfg = window.AranyaConfig || {};

  /* ─── Utilities ─────────────────────────────────────────────────────── */

  /** Merges objects keeping getters as getters (object spread would freeze them). */
  const mix = (...objects) =>
    Object.defineProperties({}, Object.assign({}, ...objects.map(Object.getOwnPropertyDescriptors)));

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** sessionStorage that never throws (private mode, blocked storage). */
  const session = {
    get(key) {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        /* storage unavailable — behaviour falls back to the safe default */
      }
    },
    remove(key) {
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };

  /**
   * The modals lock page scroll the way React's did: body overflow. Counted, so
   * closing one opened over another (the plan lightbox over the Floor Plans
   * pop-up) keeps the page locked.
   */
  let scrollLocks = 0;
  const lockScroll = (on) => {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    document.body.style.overflow = scrollLocks ? 'hidden' : '';
  };

  const PLANS_KEY = 'aranya_plans_unlocked';
  const POPUP_KEY = 'aranya_enquiry_popup_dismissed';
  const UTM_KEY = 'aranya_utm';

  // Campaign attribution for the sales team: kept for the visit, sent with the enquiry.
  (() => {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
      if (params.get(k)) utm[k] = params.get(k);
    });
    if (Object.keys(utm).length) session.set(UTM_KEY, JSON.stringify(utm));
    if (!session.get('aranya_referrer') && document.referrer) session.set('aranya_referrer', document.referrer);
  })();

  /** POST to the plugin's REST API. Network failures resolve to { success:false }. */
  const api = async (path, body) => {
    try {
      const res = await fetch(`${cfg.rest || '/wp-json/aranya/v1/'}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cfg.nonce ? { 'X-WP-Nonce': cfg.nonce } : {}),
        },
        body: JSON.stringify(body),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      return typeof data === 'object' && data ? data : { success: false };
    } catch {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const pad2 = (n) => String(n).padStart(2, '0');

  /* ─── Public API ────────────────────────────────────────────────────── */

  const store = () => Alpine.store('aranya');

  const Aranya = {
    openLead(purpose = 'General Inquiry', config = '') {
      const s = store();
      if (!s) return;
      s.lead.purpose = purpose;
      s.lead.config = config;
      s.lead.fromPopup = false;
      s.lead.open = true;
      s.lead.seq++;
    },
    openLightbox(item) {
      const s = store();
      if (!s) return;
      s.lightbox.item = item;
      s.lightbox.open = true;
    },
    /** Opens the Floor Plans pop-up, or goes to the home page's plans if this page has none. */
    openFloorPlans(category = 'master') {
      if (document.querySelector('[data-aranya-modal="floorplans"]')) {
        window.dispatchEvent(new CustomEvent('aranya:open-floorplans', { detail: { category } }));
      } else {
        window.location.href = `${cfg.home || '/'}#floor-plans`;
      }
    },
    openLocation(category = 'all') {
      if (document.querySelector('[data-aranya-modal="location"]')) {
        window.dispatchEvent(new CustomEvent('aranya:open-location', { detail: { category } }));
      } else {
        window.location.href = `${cfg.home || '/'}#location`;
      }
    },
    /** A submitted enquiry reveals the tower plans for the rest of the session. */
    unlockPlans() {
      session.set(PLANS_KEY, 'true');
      const s = store();
      if (s) s.plansUnlocked = true;
      window.dispatchEvent(new Event('aranya:plans-unlocked'));
    },
  };
  window.Aranya = Aranya;

  /* ─── Mixins ────────────────────────────────────────────────────────── */

  /**
   * The picture's drawn box inside a stage (object-contain), ignoring transforms,
   * and the room the stage gives it.
   */
  const pictureBox = (stage) => {
    const img = stage && [...stage.querySelectorAll('img')].find((el) => el.offsetParent !== null);
    if (!stage || !img) return null;
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 0;
    const cs = getComputedStyle(stage);
    return {
      w: ratio ? Math.min(img.offsetWidth, img.offsetHeight * ratio) : img.offsetWidth,
      h: ratio ? Math.min(img.offsetHeight, img.offsetWidth / ratio) : img.offsetHeight,
      roomW: stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
      roomH: stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
      stageW: stage.clientWidth,
      stageH: stage.clientHeight,
    };
  };

  /** Scale that keeps a picture turned a quarter turn inside its stage. */
  const turnFit = (box, rotation) =>
    box && rotation % 180 ? Math.min(box.roomW / box.h, box.roomH / box.w) : 1;

  /**
   * hooks/useDragPan.ts — drag to pan a zoomed image (pointer events).
   * The stage element needs x-ref="stage"; panning starts only past 100% and
   * is clamped to the picture's edges. rotate() turns the picture 90° a click
   * (client, 30 Sep: plans could not be turned); a sideways picture is scaled
   * to stay inside the stage.
   */
  const dragPan = () => ({
    zoom: 1,
    rotation: 0,
    fit: 1,
    pan: { x: 0, y: 0 },
    dragging: false,
    panStart: null,
    get canPan() {
      return this.zoom > 1;
    },
    get panTransform() {
      return `translate(${this.pan.x}px, ${this.pan.y}px) rotate(${this.rotation}deg) scale(${this.zoom * this.fit})`;
    },
    rotate() {
      this.rotation = (this.rotation + 90) % 360;
      this.fit = turnFit(pictureBox(this.$refs.stage), this.rotation);
      this.pan = this.clampPan(this.pan);
    },
    /** Zoom, pan and turn back to the start. */
    resetView() {
      this.zoom = 1;
      this.rotation = 0;
      this.fit = 1;
      this.pan = { x: 0, y: 0 };
    },
    clampPan(p) {
      const box = pictureBox(this.$refs.stage);
      if (!box) return p;
      const turned = this.rotation % 180 !== 0;
      const w = (turned ? box.h : box.w) * this.fit;
      const h = (turned ? box.w : box.h) * this.fit;
      const maxX = Math.max(0, (w * this.zoom - box.stageW) / 2);
      const maxY = Math.max(0, (h * this.zoom - box.stageH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, p.x)),
        y: Math.min(maxY, Math.max(-maxY, p.y)),
      };
    },
    panDown(e) {
      if (!this.canPan || e.button !== 0) return;
      // Controls laid over the stage keep their clicks.
      if (e.target.closest('button, a')) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      this.panStart = { pointer: { x: e.clientX, y: e.clientY }, pan: { ...this.pan } };
      this.dragging = true;
    },
    panMove(e) {
      const s = this.panStart;
      if (!s) return;
      this.pan = this.clampPan({ x: s.pan.x + e.clientX - s.pointer.x, y: s.pan.y + e.clientY - s.pointer.y });
    },
    panEnd() {
      this.panStart = null;
      this.dragging = false;
    },
    resetPan() {
      this.pan = { x: 0, y: 0 };
    },
    /** Zooming out pulls the image back inside its edges. */
    initPan() {
      this.$watch('zoom', () => {
        this.pan = this.clampPan(this.pan);
      });
    },
  });

  /**
   * common/Lightbox.tsx — shared by the page-wide lightbox and the gallery's.
   * The host supplies: isOpen, item, hasPrev, hasNext, index, total, hasCounter,
   * close(), prev(), next().
   */
  const lightboxCore = () =>
    mix(dragPan(), {
      isFullscreen: false,
      touchStartX: null,
      zoomIn() {
        this.zoom = Math.min(this.zoom + 0.25, 2.5);
      },
      zoomOut() {
        this.zoom = Math.max(this.zoom - 0.25, 0.75);
      },
      zoomReset() {
        this.resetView();
      },
      toggleFullscreen() {
        if (!document.fullscreenElement) {
          this.$refs.lightboxRoot?.requestFullscreen?.().catch(() => {});
          this.isFullscreen = true;
        } else {
          document.exitFullscreen().catch(() => {});
          this.isFullscreen = false;
        }
      },
      // Touch swipe; a zoomed image pans instead.
      lbTouchStart(e) {
        this.touchStartX = this.canPan ? null : e.touches[0].clientX;
      },
      lbTouchEnd(e) {
        if (this.touchStartX === null) return;
        const diff = this.touchStartX - e.changedTouches[0].clientX;
        if (diff > 50 && this.hasNext) this.next();
        else if (diff < -50 && this.hasPrev) this.prev();
        this.touchStartX = null;
      },
      lbKeydown(e) {
        if (!this.isOpen) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft' && this.hasPrev) this.prev();
        if (e.key === 'ArrowRight' && this.hasNext) this.next();
        if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
      },
      pad2,
      /** Wires scroll lock, zoom reset on open and the pan reset on image change. */
      initLightbox() {
        this.initPan();
        this.$watch('isOpen', (open) => {
          lockScroll(open);
          if (open) this.resetView();
        });
        this.$watch('item', () => this.resetView());
        this._lbKey = (e) => this.lbKeydown(e);
        window.addEventListener('keydown', this._lbKey);
      },
      destroy() {
        window.removeEventListener('keydown', this._lbKey);
      },
    });

  /**
   * The enquiry form logic shared by LeadFormModal and EnquiryCTA: OTP stages
   * (idle → sent → verified), then submission to the WordPress REST API.
   */
  const enquiryForm = () => ({
    fullName: '',
    phoneNumber: '',
    email: '',
    // The forms no longer ask for these (client, 5 Oct); a configuration comes
    // only from the button that opened the form (e.g. Residences "3 BHK").
    configuration: '',
    contactMethod: '',
    message: '',
    consentAgreed: true,
    website: '', // honeypot
    isSubmitting: false,
    isSubmitted: false,
    leadId: '',
    submitError: '',
    otpStage: 'idle',
    otpCode: '',
    otpBusy: false,
    otpNotice: '',
    otpError: '',
    otpToken: '',
    get phoneIsComplete() {
      return /^[6-9]\d{9}$/.test(this.phoneNumber);
    },
    onPhoneInput(e) {
      this.phoneNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
      e.target.value = this.phoneNumber;
    },
    onOtpInput(e) {
      this.otpCode = e.target.value.replace(/\D/g, '').slice(0, 6);
      e.target.value = this.otpCode;
    },
    /** Editing the number after verifying invalidates the verification. */
    initEnquiryForm() {
      this.$watch('phoneNumber', () => {
        this.otpStage = 'idle';
        this.otpCode = '';
        this.otpNotice = '';
        this.otpError = '';
        this.otpToken = '';
      });
    },
    async sendOtp() {
      if (!this.phoneIsComplete || this.otpBusy) return;
      this.otpBusy = true;
      this.otpError = '';
      const res = await api('otp/send', { phone: this.phoneNumber });
      this.otpBusy = false;
      if (res.success) {
        this.otpStage = 'sent';
        this.otpNotice = res.message || '';
      } else {
        this.otpError = res.message || 'Could not send the code. Please try again.';
      }
    },
    async verifyOtp() {
      if (this.otpBusy) return;
      this.otpBusy = true;
      this.otpError = '';
      const res = await api('otp/verify', { phone: this.phoneNumber, code: this.otpCode });
      this.otpBusy = false;
      if (res.success) {
        this.otpStage = 'verified';
        this.otpNotice = res.message || '';
        this.otpToken = res.token || '';
      } else {
        this.otpError = res.message || 'Enter the 6-digit code.';
      }
    },
    async submitEnquiry(purpose, contactMethod) {
      if (!this.fullName.trim() || !this.phoneNumber.trim() || !this.consentAgreed) return false;
      if (this.otpStage !== 'verified') return false;
      this.isSubmitting = true;
      this.submitError = '';
      let utm = {};
      try {
        utm = JSON.parse(session.get(UTM_KEY) || '{}');
      } catch {
        utm = {};
      }
      const res = await api('enquiry', {
        fullName: this.fullName.trim(),
        phoneNumber: this.phoneNumber.trim(),
        email: this.email.trim() || undefined,
        configuration: this.configuration || undefined,
        contactMethod: contactMethod || this.contactMethod || undefined,
        message: this.message.trim() || undefined,
        purpose,
        otpToken: this.otpToken,
        website: this.website,
        pageUrl: window.location.href,
        referrer: session.get('aranya_referrer') || '',
        utm,
      });
      this.isSubmitting = false;
      if (!res.success) {
        this.submitError = res.message || 'Sorry, something went wrong. Please call us instead.';
        return false;
      }
      this.leadId = res.leadId;
      this.isSubmitted = true;
      // A submitted enquiry is what reveals the floor plans for this session.
      Aranya.unlockPlans();
      return true;
    },
  });

  /* ─── Components ────────────────────────────────────────────────────── */

  {
    Alpine.store('aranya', {
      lead: { open: false, purpose: 'General Inquiry', config: '', fromPopup: false, seq: 0 },
      lightbox: { open: false, item: null },
      plansUnlocked: session.get(PLANS_KEY) === 'true',
    });

    /** layout/Navbar.tsx */
    Alpine.data('navbar', () => ({
      isScrolled: false,
      isMobileOpen: false,
      init() {
        this._onScroll = () => {
          this.isScrolled = window.scrollY > 50;
        };
        window.addEventListener('scroll', this._onScroll, { passive: true });
        this._onScroll();
        this.$watch('isMobileOpen', (open) => {
          document.body.style.overflow = open ? 'hidden' : '';
        });
      },
      destroy() {
        window.removeEventListener('scroll', this._onScroll);
      },
      /** FLOOR PLANS and LOCATION open their pop-ups instead of scrolling. */
      navClick(e, action, isMobile) {
        if (action === 'floorplans' || action === 'location') {
          e.preventDefault();
          if (isMobile) this.isMobileOpen = false;
          if (action === 'floorplans') Aranya.openFloorPlans('master');
          else Aranya.openLocation('all');
          return;
        }
        if (isMobile) this.isMobileOpen = false;
      },
    }));

    /** sections/Hero.tsx — timed cross-fade, paused off-screen and in hidden tabs. */
    Alpine.data('hero', (opts = {}) => ({
      active: 0,
      preloadRest: false,
      count: opts.count || 1,
      slideMs: opts.slideMs || 6000,
      fadeMs: opts.fadeMs || 1400,
      textOutMs: 450,
      timer: null,
      // loading: the site loader still covers the page (site-loader-gate.js).
      paused: { hidden: false, offscreen: false, loading: document.documentElement.classList.contains('aranya-loading') },
      init() {
        // Give the first frame the network to itself; it is the LCP element.
        this._preload = window.setTimeout(() => {
          this.preloadRest = true;
        }, 1200);
        // The first frame gets its full dwell once the loader has lifted.
        this._onReady = () => {
          this.paused.loading = false;
          this.schedule();
        };
        window.addEventListener('aranya:ready', this._onReady);
        this._onVisibility = () => {
          this.paused.hidden = document.hidden;
          this.schedule();
        };
        document.addEventListener('visibilitychange', this._onVisibility);
        this._io = new IntersectionObserver(
          ([entry]) => {
            this.paused.offscreen = !entry.isIntersecting;
            this.schedule();
          },
          { threshold: 0.15 }
        );
        this._io.observe(this.$el);
        this.schedule();
      },
      destroy() {
        this.stop();
        window.clearTimeout(this._preload);
        window.removeEventListener('aranya:ready', this._onReady);
        document.removeEventListener('visibilitychange', this._onVisibility);
        this._io?.disconnect();
      },
      stop() {
        if (this.timer) window.clearInterval(this.timer);
        this.timer = null;
      },
      schedule() {
        this.stop();
        if (this.count < 2 || reducedMotion()) return;
        if (this.paused.loading && !document.documentElement.classList.contains('aranya-loading')) this.paused.loading = false;
        if (this.paused.hidden || this.paused.offscreen || this.paused.loading) return;
        this.timer = window.setInterval(() => {
          this.active = (this.active + 1) % this.count;
        }, this.slideMs);
      },
      /** A manual pick earns a full dwell, not the remainder of the old one. */
      goTo(i) {
        this.preloadRest = true;
        this.active = i;
        this.schedule();
      },
      /** The statements hand over rather than cross. */
      textFade(on) {
        return on
          ? { transitionDuration: `${this.fadeMs - this.textOutMs}ms`, transitionDelay: `${this.textOutMs}ms` }
          : { transitionDuration: `${this.textOutMs}ms`, transitionDelay: '' };
      },
    }));

    /** sections/Residences.tsx */
    Alpine.data('residences', (opts = {}) => ({
      selectedId: opts.initial || '',
    }));

    /** sections/Specifications.tsx */
    Alpine.data('specifications', () => ({
      activeIndex: 0,
      pad2,
    }));

    /** sections/LocationConnectivity.tsx — RouteFilm: plays while on screen. */
    Alpine.data('routeFilm', (opts = {}) => ({
      pausedByVisitor: false,
      pausingForScroll: false,
      init() {
        const video = this.$el;
        // Phones get the 960 px encode; nothing downloads until it is in view.
        video.src = window.matchMedia('(max-width: 767px)').matches ? opts.small || opts.large : opts.large;
        if (reducedMotion()) return;
        this._io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (!this.pausedByVisitor) video.play().catch(() => {});
            } else if (!video.paused) {
              this.pausingForScroll = true;
              video.pause();
            }
          },
          { threshold: 0.4 }
        );
        this._io.observe(video);
      },
      destroy() {
        this._io?.disconnect();
      },
      onPlay() {
        this.pausedByVisitor = false;
      },
      onPause() {
        this.pausedByVisitor = !this.pausingForScroll;
        this.pausingForScroll = false;
      },
    }));

    /** sections/LocationModal.tsx */
    Alpine.data('locationModal', (opts = {}) => ({
      isOpen: false,
      nodes: opts.nodes || [],
      selectedNodeId: opts.nodes?.[0]?.id || '',
      mapMode: 'schematic',
      isBrochureZoomed: false,
      activeCategoryFilter: 'all',
      hoveredNodeId: null,
      init() {
        this._onOpen = (e) => {
          this.isOpen = true;
          this.applyCategoryFilter(e.detail?.category || 'all');
        };
        window.addEventListener('aranya:open-location', this._onOpen);
        this._onKey = (e) => {
          if (this.isOpen && e.key === 'Escape') this.close();
        };
        window.addEventListener('keydown', this._onKey);
        this.$watch('isOpen', (open) => lockScroll(open));
      },
      destroy() {
        window.removeEventListener('aranya:open-location', this._onOpen);
        window.removeEventListener('keydown', this._onKey);
      },
      close() {
        this.isOpen = false;
      },
      get selected() {
        return this.nodes.find((n) => n.id === this.selectedNodeId) || this.nodes[0] || {};
      },
      /** Picking a category also moves the selection into it. */
      applyCategoryFilter(cat) {
        this.activeCategoryFilter = cat;
        if (cat !== 'all') {
          const first = this.nodes.find((n) => n.category === cat);
          if (first) this.selectedNodeId = first.id;
        }
      },
      inFilter(id) {
        const node = this.nodes.find((n) => n.id === id);
        return this.activeCategoryFilter === 'all' || (node && node.category === this.activeCategoryFilter);
      },
      isSel(id) {
        return this.selectedNodeId === id;
      },
      isHot(id) {
        return this.selectedNodeId === id || this.hoveredNodeId === id;
      },
      keySelect(e, id) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectedNodeId = id;
        }
      },
      get route() {
        const n = this.selected;
        return n && n.x !== '' && n.x !== undefined && n.x !== null ? n : null;
      },
    }));

    /** sections/FloorPlans.tsx — the plan viewer, on the page and in the Floor Plans pop-up. */
    const floorPlansViewer = (opts = {}) =>
      mix(dragPan(), {
        plans: opts.plans || [],
        selectedTower: opts.initialTower || 'tower-b',
        activePlanId: '',
        initViewer() {
          const first = this.plans.find((p) => p.tower === this.selectedTower);
          this.activePlanId = first ? first.id : this.plans[0]?.id || '';
          this.initPan();
          // useDragPan's resetKey is the plan id: a new plan starts centred and upright.
          this.$watch('current', () => this.resetView());
        },
        get towerPlans() {
          return this.plans.filter((p) => p.tower === this.selectedTower);
        },
        get current() {
          const tp = this.towerPlans;
          return tp.find((p) => p.id === this.activePlanId) || tp[0] || this.plans[0] || {};
        },
        get isLocked() {
          return !this.$store.aranya.plansUnlocked && this.current.tower !== 'master';
        },
        handleTowerChange(tower) {
          this.selectedTower = tower;
          this.resetView();
          const first = this.plans.find((p) => p.tower === tower);
          if (first) this.activePlanId = first.id;
        },
        pick(id) {
          this.activePlanId = id;
          this.resetView();
        },
        zoomIn() {
          this.zoom = Math.min(this.zoom + 0.25, 2.25);
        },
        zoomOut() {
          this.zoom = Math.max(this.zoom - 0.25, 0.75);
        },
        zoomReset() {
          this.resetView();
        },
        /** Fullscreen would show the unblurred plate, so a locked plan routes to the enquiry form. */
        fullscreen() {
          if (this.isLocked) {
            Aranya.openLead('Floor Plan Access');
            return;
          }
          Aranya.openLightbox({
            url: this.current.src,
            title: this.current.title,
            description: opts.lightboxNote || 'Indicative floor plan, subject to approvals.',
            category: opts.lightboxCategory || 'Floor Plan',
            credit: '',
            // A plan: no download, no right-click, and the common disclaimer.
            kind: 'plan',
            disclaimer: opts.disclaimer || '',
          });
        },
      });

    Alpine.data('floorPlans', (opts = {}) =>
      mix(floorPlansViewer(opts), {
        init() {
          this.initViewer();
        },
      })
    );

    /**
     * sections/FloorPlansModal.tsx — the section's viewer in a window (client,
     * 2 Oct: the pop-up's own viewer clipped tall plans and had no fullscreen).
     */
    Alpine.data('floorPlansModal', (opts = {}) =>
      mix(floorPlansViewer(opts), {
        isOpen: false,
        init() {
          this.initViewer();
          this._onOpen = (e) => {
            this.handleTowerChange(e.detail?.category || 'master');
            this.isOpen = true;
          };
          window.addEventListener('aranya:open-floorplans', this._onOpen);
          // Esc first closes the lightbox or enquiry form opened over the pop-up
          // (their handlers run after this one, so they are still open here).
          this._onKey = (e) => {
            const s = this.$store.aranya;
            if (this.isOpen && e.key === 'Escape' && !s.lightbox.open && !s.lead.open) this.close();
          };
          window.addEventListener('keydown', this._onKey);
          this.$watch('isOpen', (open) => lockScroll(open));
        },
        destroy() {
          window.removeEventListener('aranya:open-floorplans', this._onOpen);
          window.removeEventListener('keydown', this._onKey);
        },
        close() {
          this.isOpen = false;
        },
      })
    );

    /** sections/Gallery.tsx — filter tabs and its own lightbox with prev/next. */
    Alpine.data('gallery', (opts = {}) =>
      mix(lightboxCore(), {
        items: opts.items || [],
        activeTab: 'all',
        lightboxIndex: null,
        init() {
          this.initLightbox();
        },
        get filtered() {
          return this.activeTab === 'all'
            ? this.items
            : this.items.filter((i) => i.cat === this.activeTab || (i.cats || []).includes(this.activeTab));
        },
        inTab(id) {
          return this.filtered.some((i) => i.id === id);
        },
        setTab(tab) {
          this.activeTab = tab;
          this.lightboxIndex = null;
        },
        openItem(id) {
          this.lightboxIndex = this.filtered.findIndex((i) => i.id === id);
        },
        get isOpen() {
          return this.lightboxIndex !== null && !!this.filtered[this.lightboxIndex];
        },
        get item() {
          return this.isOpen ? this.filtered[this.lightboxIndex] : null;
        },
        get hasCounter() {
          return true;
        },
        get index() {
          return this.lightboxIndex ?? 0;
        },
        get total() {
          return this.filtered.length;
        },
        get hasPrev() {
          return this.lightboxIndex !== null && this.lightboxIndex > 0;
        },
        get hasNext() {
          return this.lightboxIndex !== null && this.lightboxIndex < this.filtered.length - 1;
        },
        prev() {
          if (this.hasPrev) this.lightboxIndex -= 1;
        },
        next() {
          if (this.hasNext) this.lightboxIndex += 1;
        },
        close() {
          this.lightboxIndex = null;
        },
      })
    );

    /** App.tsx's page-wide Lightbox (one image, no prev/next). */
    Alpine.data('lightbox', () =>
      mix(lightboxCore(), {
        init() {
          this.initLightbox();
        },
        get isOpen() {
          return this.$store.aranya.lightbox.open && !!this.$store.aranya.lightbox.item;
        },
        get item() {
          return this.$store.aranya.lightbox.item;
        },
        get hasCounter() {
          return false;
        },
        get index() {
          return 0;
        },
        get total() {
          return 1;
        },
        get hasPrev() {
          return false;
        },
        get hasNext() {
          return false;
        },
        prev() {},
        next() {},
        close() {
          this.$store.aranya.lightbox.open = false;
          this.$store.aranya.lightbox.item = null;
        },
      })
    );

    /** layout/StickyActionBar.tsx — the contact closet. */
    Alpine.data('stickyBar', () => ({
      isOpen: false,
      hasOpened: false,
      init() {
        // ESC and click-away dismiss the closet. It is not a modal, so no scroll lock.
        this._onKey = (e) => {
          if (this.isOpen && e.key === 'Escape') this.close();
        };
        this._onPointer = (e) => {
          if (this.isOpen && !this.$el.contains(e.target)) this.close();
        };
        document.addEventListener('keydown', this._onKey);
        document.addEventListener('mousedown', this._onPointer);
        document.addEventListener('touchstart', this._onPointer, { passive: true });
      },
      destroy() {
        document.removeEventListener('keydown', this._onKey);
        document.removeEventListener('mousedown', this._onPointer);
        document.removeEventListener('touchstart', this._onPointer);
      },
      toggle() {
        this.hasOpened = true;
        this.isOpen = !this.isOpen;
      },
      close() {
        this.isOpen = false;
      },
      /** Stagger the items out of the closet, and snap them back in on close. */
      delay(i) {
        return { transitionDelay: this.isOpen ? `${60 + i * 55}ms` : '0ms' };
      },
    }));

    /**
     * sections/LeadFormModal.tsx + common/Modal.tsx + common/EnquiryPopup.tsx.
     * One modal serves every "Enquire" button and the timed popup.
     */
    Alpine.data('leadModal', (opts = {}) =>
      mix(enquiryForm(), {
        init() {
          this.initEnquiryForm();
          const s = this.$store.aranya;
          this.$watch('$store.aranya.lead.seq', () => {
            // Each opening records the configuration of the button that opened it, if any.
            const c = s.lead.config;
            this.configuration = ['2 BHK', '3 BHK', '5 BHK'].includes(c) ? c : '';
          });
          this.$watch('$store.aranya.lead.open', (open) => lockScroll(open));
          this._onKey = (e) => {
            if (s.lead.open && e.key === 'Escape') this.close();
          };
          document.addEventListener('keydown', this._onKey);
          this.schedulePopup();
        },
        destroy() {
          document.removeEventListener('keydown', this._onKey);
          window.clearTimeout(this._popup);
        },
        get isOpen() {
          return this.$store.aranya.lead.open;
        },
        get purpose() {
          return this.$store.aranya.lead.purpose || 'Enquire Now';
        },
        get isNavbarOrGeneral() {
          const p = this.purpose;
          return (
            !p ||
            ['Navbar Inquiry', 'General Inquiry', 'Enquire Now', 'Hero Enquiry', 'Mobile Quick Action', 'Automated Consultation'].includes(p) ||
            p.includes('Consultation')
          );
        },
        get modalTitle() {
          if (this.isSubmitted) return opts.successTitle || 'Enquiry Confirmed';
          return this.isNavbarOrGeneral ? opts.generalTitle || 'Enquire About Aranya The Park' : this.purpose;
        },
        get modalSubtitle() {
          return this.isSubmitted ? `Reference ID: ${this.leadId}` : opts.subtitle || 'Malad West · Mumbai';
        },
        /** Which small icon sits in the "Direct Developer Desk" chip. */
        get purposeIcon() {
          const p = this.purpose.toLowerCase();
          if (p.includes('visit') || p.includes('tour')) return 'calendar';
          if (p.includes('brochure') || p.includes('deck') || p.includes('pdf')) return 'download';
          if (p.includes('callback') || p.includes('call')) return 'clock';
          return 'sparkles';
        },
        async submit() {
          const ok = await this.submitEnquiry(this.purpose);
          if (ok) session.set(POPUP_KEY, 'true');
        },
        whatsappAfter() {
          return `https://wa.me/${opts.whatsapp || ''}?text=${encodeURIComponent(
            `Hello Aranya The Park Team, I am ${this.fullName}. I have registered an enquiry (${this.leadId})${this.configuration ? ` for ${this.configuration}` : ''}. Please share the digital brochure and floor plans.`
          )}`;
        },
        /** Closing resets the form; closing the timed popup keeps it closed for the visit. */
        close() {
          const s = this.$store.aranya;
          if (s.lead.fromPopup) session.set(POPUP_KEY, 'true');
          this.isSubmitted = false;
          this.fullName = '';
          this.phoneNumber = '';
          this.email = '';
          this.message = '';
          this.consentAgreed = true;
          this.submitError = '';
          this.otpStage = 'idle';
          this.otpCode = '';
          this.otpNotice = '';
          this.otpError = '';
          s.lead.open = false;
          s.lead.fromPopup = false;
        },
        /** common/EnquiryPopup.tsx — opens once, a set delay after load. */
        schedulePopup() {
          window.__openEnquiryPopup = () => this.openPopup();
          window.__resetEnquiryPopup = () => {
            session.remove(POPUP_KEY);
            this.openPopup();
          };
          if (!cfg.popupEnabled || cfg.editor) return;
          if (session.get(POPUP_KEY) === 'true') return;
          this._popup = window.setTimeout(() => {
            if (session.get(POPUP_KEY) === 'true') return;
            this.openPopup();
          }, cfg.popupDelay ?? 10000);
        },
        openPopup() {
          const s = this.$store.aranya;
          if (s.lead.open) return;
          Aranya.openLead('Automated Consultation');
          s.lead.fromPopup = true;
        },
      })
    );

    /** sections/EnquiryCTA.tsx — the inline site-visit form. */
    Alpine.data('enquiryCta', (opts = {}) =>
      mix(enquiryForm(), {
        init() {
          this.initEnquiryForm();
        },
        async submit() {
          await this.submitEnquiry(opts.purpose || 'Begin Your Lushury Life (Site Visit Form)');
        },
        whatsappAfter() {
          return `https://wa.me/${opts.whatsapp || ''}?text=${encodeURIComponent(
            `Hello, I am ${this.fullName} (${this.leadId}). I have requested a site visit at Aranya The Park.`
          )}`;
        },
        reset() {
          this.isSubmitted = false;
          this.fullName = '';
          this.phoneNumber = '';
          this.email = '';
        },
      })
    );
  }

  Alpine.prefix('ar-');
  window.AranyaAlpine = Alpine; // for debugging and automated tests; not window.Alpine
  Alpine.start();

  /*
   * Elementor editor: widget HTML is inserted after load, and Elementor's own
   * Alpine (started earlier) walks it first. Both instances keep their "seen"
   * mark on the element itself (_x_marker), so ours would skip the widget.
   * When Elementor reports a widget ready, our components in it that are not
   * yet running are cleared of the foreign marks and initialised here.
   */
  const adopt = (scope) => {
    if (!scope || !scope.querySelectorAll) return;
    const roots = [...(scope.matches('[ar-data]') ? [scope] : []), ...scope.querySelectorAll('[ar-data]')];
    roots
      .filter((root) => !root._x_dataStack && !root.parentElement?.closest('[ar-data]'))
      .forEach((root) => {
        [root, ...root.querySelectorAll('*')].forEach((el) => delete el._x_marker);
        Alpine.initTree(root);
      });
  };
  const hookElementor = () =>
    window.elementorFrontend.hooks.addAction('frontend/element_ready/global', ($scope) => adopt($scope[0]));
  if (window.elementorFrontend && window.elementorFrontend.hooks) hookElementor();
  else if (window.jQuery) window.jQuery(window).on('elementor/frontend/init', hookElementor);
})();
