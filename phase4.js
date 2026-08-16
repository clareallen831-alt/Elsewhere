(() => {
  const navTarget = id => ({
    today:'today',
    cook:'cook',
    health:'health',
    fashion:'fashion',
    things:'things',
    hugo:'things',
    sew:'things',
    make:'things',
    explore:'things',
    ideas:'things',
    choose:'things',
    activity:'things',
    evening:'things',
    notDone:'things',
    complete:'things'
  }[id] || '');

  // Keep My Life resilient: try the painted asset with a cache-busting URL,
  // then fall back to an inline illustrated journal icon if the file cannot load.
  const myLifeFallbackSvg = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#e8dcc5"/></linearGradient>
        <linearGradient id="leather" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a66e45"/><stop offset="1" stop-color="#6e4b36"/></linearGradient>
        <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7d8b62"/><stop offset="1" stop-color="#415746"/></linearGradient>
        <filter id="soft"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" result="n"/><feBlend in="SourceGraphic" in2="n" mode="soft-light"/></filter>
      </defs>
      <g filter="url(#soft)" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 70c10-13 16-25 20-37" fill="none" stroke="#53684d" stroke-width="7" opacity=".9"/>
        <circle cx="17" cy="72" r="5" fill="none" stroke="#b98a50" stroke-width="3"/>
        <path d="M29 28c11-4 19-2 26 4v42c-8-5-17-6-27-2z" fill="url(#paper)" stroke="#9a7657" stroke-width="2"/>
        <path d="M55 32c8-5 17-6 27-2l1 43c-10-3-19-2-28 2z" fill="url(#paper)" stroke="#9a7657" stroke-width="2"/>
        <path d="M55 33v41" stroke="#c2ad8f" stroke-width="1.4"/>
        <path d="M34 39h15v12H34z" fill="#a9c1c7" opacity=".9"/>
        <path d="M34 48l5-5 3 3 4-5 3 7" fill="#6e876a" opacity=".9"/>
        <circle cx="69" cy="47" r="3.1" fill="#806043"/><circle cx="74" cy="43" r="2.6" fill="#806043"/><circle cx="78" cy="48" r="2.6" fill="#806043"/><circle cx="72.5" cy="53" r="4.4" fill="#806043"/>
        <ellipse cx="65" cy="64" rx="7" ry="4" fill="url(#green)" stroke="#775b42" stroke-width="1.2"/>
        <path d="M65 60v8M58 64h14" stroke="#d9c298" stroke-width="1" opacity=".7"/>
        <path d="M60 64c-8 3-10 8-8 14" fill="none" stroke="#526b50" stroke-width="1.8"/>
        <circle cx="43" cy="61" r="3.5" fill="#f1eee3" stroke="#b7a27f" stroke-width="1"/><circle cx="43" cy="61" r="1.3" fill="#d2a73d"/>
        <path d="M43 57v-5M39 58l-3-4M47 58l3-4" stroke="#71835d" stroke-width="1.2"/>
        <path d="M28 72c18 6 36 6 55 1" fill="none" stroke="url(#leather)" stroke-width="2.2" opacity=".8"/>
      </g>
    </svg>`);

  const illustratedNav = {
    today:'./illustrations/ui/nav-home.webp',
    cook:'./illustrations/ui/nav-food.webp',
    health:'./illustrations/ui/nav-health.webp',
    fashion:'./illustrations/ui/nav-fashion.webp',
    things:'./illustrations/ui/nav-mylife.webp?v=20260816-fix2'
  };

  function ensureIllustratedNavStyles() {
    if (document.querySelector('style[data-elsewhere-nav-illustrations]')) return;
    const style = document.createElement('style');
    style.dataset.elsewhereNavIllustrations = 'true';
    style.textContent = `
      .bottomNav .navIcon.illustratedNavIcon{position:relative;overflow:visible;width:31px!important;height:31px!important}
      .bottomNav .navIcon.illustratedNavIcon>svg{transition:opacity .15s ease}
      .bottomNav .navIcon .illustratedNavImage{position:absolute;inset:0;display:block;width:31px!important;height:31px!important;object-fit:contain;opacity:0;transition:opacity .15s ease;pointer-events:none}
      .bottomNav .navIcon.illustrationLoaded .illustratedNavImage{opacity:1}
      .bottomNav .navIcon.illustrationLoaded>svg{opacity:0}
      .bottomNav .nav.active .navIcon.illustrationLoaded .illustratedNavImage{transform:scale(1.06)}
    `;
    document.head.appendChild(style);
  }

  function applyIllustratedNavIcons() {
    ensureIllustratedNavStyles();
    document.querySelectorAll('.bottomNav .nav[data-go]').forEach(button => {
      const key = button.dataset.go;
      const src = illustratedNav[key];
      const slot = button.querySelector('.navIcon');
      if (!src || !slot) return;

      // If Fashion (or another feature) recreates a nav button, wire it again.
      const existing = slot.querySelector('.illustratedNavImage');
      if (existing && existing.dataset.navKey === key) return;
      existing?.remove();
      slot.classList.remove('illustrationLoaded');
      slot.classList.add('illustratedNavIcon');

      const img = new Image();
      img.className = 'illustratedNavImage';
      img.alt = '';
      img.setAttribute('aria-hidden','true');
      img.dataset.navKey = key;

      img.addEventListener('load', () => {
        slot.classList.add('illustrationLoaded');
      }, {once:true});

      img.addEventListener('error', () => {
        // Never leave a blank nav icon. My Life gets an inline illustrated fallback;
        // all other sections simply retain their original SVG if their image fails.
        if (key === 'things' && img.src !== myLifeFallbackSvg) {
          img.src = myLifeFallbackSvg;
          return;
        }
        slot.classList.remove('illustrationLoaded');
        img.remove();
      });

      slot.appendChild(img);
      img.src = src;
    });
  }

  function syncNavigation() {
    applyIllustratedNavIcons();
    const active = document.querySelector('.view.active');
    const target = navTarget(active?.id);
    document.querySelectorAll('.bottomNav .nav').forEach(button => {
      button.classList.toggle('active', Boolean(target) && button.dataset.go === target);
    });
  }

  function wireHealthNavigation() {
    const generated = document.querySelector('.nav[data-health-nav]');
    if (!generated) return;
    const openHealth = generated.onclick ? generated.onclick.bind(generated) : null;
    generated.remove();
    if (openHealth) {
      document.querySelectorAll('[data-go="health"]').forEach(button => {
        if (button.dataset.healthWired) return;
        button.dataset.healthWired = 'true';
        button.addEventListener('click', openHealth);
      });
    }
    syncNavigation();
  }

  document.addEventListener('click', () => setTimeout(syncNavigation, 0));
  const main = document.querySelector('main');
  if (main) new MutationObserver(syncNavigation).observe(main, {
    attributes:true,
    subtree:true,
    attributeFilter:['class']
  });

  const bottomNav = document.querySelector('.bottomNav');
  if (bottomNav) new MutationObserver(() => setTimeout(applyIllustratedNavIcons, 0)).observe(bottomNav, {
    childList:true,
    subtree:true
  });

  const dateLabel = document.querySelector('#homeDayLabel');
  if (dateLabel) {
    dateLabel.textContent = new Intl.DateTimeFormat('en-GB', {
      weekday:'long',
      day:'numeric',
      month:'long'
    }).format(new Date()).toUpperCase();
  }

  wireHealthNavigation();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(wireHealthNavigation, 0), {once:true});
  }
  setTimeout(wireHealthNavigation, 700);
  syncNavigation();
})();