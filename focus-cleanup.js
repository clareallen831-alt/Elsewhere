(() => {
  const RETIRED = new Set(['make', 'explore']);
  let queued = false;

  function retireActivityData() {
    try {
      if (typeof activities !== 'undefined' && Array.isArray(activities)) {
        for (let i = activities.length - 1; i >= 0; i -= 1) {
          if (RETIRED.has(activities[i]?.cat)) activities.splice(i, 1);
        }
      }
    } catch {}

    try {
      if (typeof logCats !== 'undefined' && Array.isArray(logCats)) {
        for (let i = logCats.length - 1; i >= 0; i -= 1) {
          if (RETIRED.has(logCats[i]?.[0])) logCats.splice(i, 1);
        }
      }
    } catch {}
  }

  function updateCopy() {
    const homeMore = document.querySelector('.homeWide[data-go="things"] small');
    if (homeMore) homeMore.textContent = 'Hugo, sewing and ideas that can wait.';

    const myLifeIntro = document.querySelector('#things .sectionIntro > p:last-child');
    if (myLifeIntro) myLifeIntro.textContent = 'A few things to return to, with no pressure to complete them.';
  }

  function removeRetiredUi() {
    document.querySelectorAll('[data-go="make"], [data-go="explore"]').forEach(el => el.remove());
    document.querySelectorAll('.cat[data-v="make"], .cat[data-v="explore"], #logCats [data-v="make"], #logCats [data-v="explore"]').forEach(el => el.remove());
    document.querySelector('#make')?.remove();
    document.querySelector('#explore')?.remove();

    const active = document.querySelector('.view.active');
    if (active && RETIRED.has(active.id)) {
      if (typeof go === 'function') go('things');
      else active.classList.remove('active');
    }
  }

  function apply() {
    queued = false;
    retireActivityData();
    removeRetiredUi();
    updateCopy();
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queue, {once:true});
  } else {
    queue();
  }

  const main = document.querySelector('main');
  if (main) new MutationObserver(queue).observe(main, {childList:true, subtree:true});

  setTimeout(queue, 250);
  setTimeout(queue, 900);
})();
