(() => {
  const navTarget = id => ({
    today:'today',
    cook:'cook',
    health:'health',
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

  function syncNavigation() {
    const active = document.querySelector('.view.active');
    const target = navTarget(active?.id);
    document.querySelectorAll('.bottomNav .nav').forEach(button => {
      button.classList.toggle('active', Boolean(target) && button.dataset.go === target);
    });
  }

  const generatedHealthNav = document.querySelector('.nav[data-health-nav]');
  const openHealth = generatedHealthNav?.onclick ? generatedHealthNav.onclick.bind(generatedHealthNav) : null;
  generatedHealthNav?.remove();

  document.querySelectorAll('[data-go="health"]').forEach(button => {
    if (openHealth) button.addEventListener('click', openHealth);
  });

  document.addEventListener('click', () => setTimeout(syncNavigation, 0));
  const main = document.querySelector('main');
  if (main) new MutationObserver(syncNavigation).observe(main, {
    attributes:true,
    subtree:true,
    attributeFilter:['class']
  });

  const dateLabel = document.querySelector('#homeDayLabel');
  if (dateLabel) {
    dateLabel.textContent = new Intl.DateTimeFormat('en-GB', {
      weekday:'long',
      day:'numeric',
      month:'long'
    }).format(new Date()).toUpperCase();
  }

  syncNavigation();
})();