(() => {
  const COAT_COLOUR = 'Green / brown';
  const CURRENT_ITEM_ID = 'grey-wool-coat';
  const LEGACY_ITEM_ID = 'wool-coat';
  let queued = false;

  function updateColourWithin(container) {
    if (!container) return;
    const colour = [...container.querySelectorAll('small')].find(element =>
      /^(?:Charcoal \/ soft grey|Olive \/ brown|Green \/ brown)$/i.test(element.textContent.trim())
    );
    if (colour && colour.textContent.trim() !== COAT_COLOUR) colour.textContent = COAT_COLOUR;
  }

  function updateCapsule(panel) {
    panel.querySelectorAll(
      `[data-fashion-item="${CURRENT_ITEM_ID}"], [data-fashion-item="${LEGACY_ITEM_ID}"]`
    ).forEach(input => {
      const row = input.closest('.fashionCheck, label, article') || input.parentElement;
      updateColourWithin(row);
    });

    // Retain compatibility with the earlier Autumn / Winter capsule renderer.
    panel.querySelectorAll('strong').forEach(title => {
      const name = title.textContent.trim();
      if (name !== 'Long wool coat' && name !== 'Long wool coat with oversized collar') return;
      updateColourWithin(title.parentElement);
      updateColourWithin(title.closest('.fashionCheck, label, article'));
    });
  }

  function updateOutfits(panel) {
    panel.querySelectorAll('.fashionOutfitCopy p, .fashionOutfitCard p').forEach(copy => {
      const current = copy.textContent;
      const next = current.replace(/Long grey coat/g, 'Green / brown long wool coat');
      if (next !== current) copy.textContent = next;
    });
  }

  function apply() {
    queued = false;
    const panel = document.querySelector('#fashionPanel');
    if (!panel) return;
    updateCapsule(panel);
    updateOutfits(panel);
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queue, {once: true});
  } else {
    queue();
  }

  new MutationObserver(queue).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  window.addEventListener('pageshow', queue);
})();
