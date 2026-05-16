(() => {
  'use strict';

  const STORAGE_KEY = 'athalie.cookie-ack';
  if (localStorage.getItem(STORAGE_KEY) === '1') return;

  const LANG_TEXT = {
    fr: {
      title: 'Stockage local',
      body:  'Ce site ne dépose aucun cookie de suivi. Nous mémorisons uniquement votre préférence de langue dans votre navigateur.',
      link:  'En savoir plus',
      cta:   'J\u2019ai compris'
    },
    nl: {
      title: 'Lokale opslag',
      body:  'Deze site plaatst geen tracking-cookies. Wij bewaren enkel uw taalvoorkeur in uw browser.',
      link:  'Meer info',
      cta:   'Begrepen'
    },
    en: {
      title: 'Local storage',
      body:  'This site sets no tracking cookies. We only store your language preference in your browser.',
      link:  'Learn more',
      cta:   'Got it'
    }
  };

  const lang = (localStorage.getItem('athalie.lang') || document.documentElement.lang || 'fr').slice(0, 2);
  const t = LANG_TEXT[lang] || LANG_TEXT.fr;

  const banner = document.createElement('aside');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'cb-title');
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <div class="cookie-banner__copy">
        <strong id="cb-title">${t.title}</strong>
        <p>${t.body} <a href="/privacy.html#cookies">${t.link}</a></p>
      </div>
      <button type="button" class="cookie-banner__cta">${t.cta}</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Reveal after a short delay so the page settles
  requestAnimationFrame(() => {
    setTimeout(() => banner.classList.add('cookie-banner--in'), 400);
  });

  banner.querySelector('.cookie-banner__cta').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    banner.classList.remove('cookie-banner--in');
    setTimeout(() => banner.remove(), 320);
  });
})();
