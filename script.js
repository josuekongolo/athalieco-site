(() => {
  'use strict';

  const SUPPORTED = ['fr', 'nl', 'en'];
  const DEFAULT_LANG = 'fr';
  const STORAGE_KEY = 'athalie.lang';

  /* ---------- LANG DETECTION ---------- */
  function detectLang() {
    const url = new URLSearchParams(location.search).get('lang');
    if (url && SUPPORTED.includes(url)) return url;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    const nav = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(nav)) return nav;

    return DEFAULT_LANG;
  }

  /* ---------- APPLY LANG ---------- */
  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    const dict = (window.I18N && window.I18N[lang]) || {};

    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : `${lang}-BE`);

    // Update <title> and meta description per language (SEO)
    if (dict['meta.title']) document.title = dict['meta.title'];
    if (dict['meta.description']) {
      let m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', dict['meta.description']);
    }
    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'en' ? 'en_GB' : `${lang}_BE`);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.querySelectorAll('.lang button, .mobile-nav__lang button').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.setAttribute('aria-pressed', String(active));
    });

    localStorage.setItem(STORAGE_KEY, lang);

    if (history.replaceState) {
      const params = new URLSearchParams(location.search);
      if (lang === DEFAULT_LANG) params.delete('lang');
      else params.set('lang', lang);
      const qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  }

  /* ---------- INIT LANG ---------- */
  function initLang() {
    document.querySelectorAll('.lang button, .mobile-nav__lang button').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
    applyLang(detectLang());
  }

  /* ---------- MOBILE DRAWER ---------- */
  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const panel  = document.getElementById('mobile-nav');
    const backdrop = document.querySelector('.mobile-nav__backdrop');
    const closeBtn = panel ? panel.querySelector('.mobile-nav__close') : null;
    if (!toggle || !panel) return;

    // Once initialized, drop the [hidden] attribute so CSS transitions can run.
    // CSS still keeps the drawer off-screen via transform: translateX(100%).
    panel.removeAttribute('hidden');
    if (backdrop) backdrop.removeAttribute('hidden');

    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      if (backdrop) backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) {
        const firstLink = panel.querySelector('nav a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      } else {
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on link click (navigation), close button, backdrop click, ESC
    panel.querySelectorAll('nav a, .mobile-nav__cta').forEach(a => {
      a.addEventListener('click', () => setOpen(false));
    });
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    if (backdrop) backdrop.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
      }
    });

    matchMedia('(min-width: 1025px)').addEventListener('change', e => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- HEADER SCROLL STATE ---------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = document.querySelectorAll('.service, .sectors li, .steps li, .kpi, .hero__copy, .hero__card, .section__head, .team__copy, .team__visual, .form, .contact__list');
    els.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ---------- CONTACT TABS ---------- */
  function initContactTabs() {
    const tabs = document.querySelectorAll('.contact__tab');
    const panels = document.querySelectorAll('.contact__panel');
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        panels.forEach(p => { p.hidden = p.dataset.panel !== target; });
      });
    });
  }

  /* ---------- CONTACT FORM — light UX polish, native submit ---------- */
  function initContactForm() {
    const form = document.querySelector('form.form[action*="formsubmit.co"]');
    if (!form) return;
    // Just disable the submit button on click to prevent double-submission.
    // The form submits natively to FormSubmit, which handles the redirect to _next.
    form.addEventListener('submit', () => {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Envoi en cours…';
      }
    });
  }

  /* ---------- SUBJECT PRE-FILL FROM ?subject= ---------- */
  function initSubjectPrefill() {
    const subj = new URLSearchParams(location.search).get('subject');
    if (!subj) return;
    const select = document.getElementById('f-subject');
    if (!select) return;
    const opt = [...select.options].find(o => o.value.toLowerCase() === subj.toLowerCase());
    if (opt) opt.selected = true;
  }

  /* ---------- FOOTER YEAR ---------- */
  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- BOOT ---------- */
  function boot() {
    initLang();
    initMobileNav();
    initHeaderScroll();
    initReveal();
    initContactTabs();
    initContactForm();
    initSubjectPrefill();
    initYear();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
