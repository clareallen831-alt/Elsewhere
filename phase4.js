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