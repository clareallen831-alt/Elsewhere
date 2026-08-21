(() => {
  const ROOT_CLASS = 'elsewhere-icons-only';
  const ICON_SOURCE = /(?:^|\/)(?:icon(?:-[^/?#]+)?\.(?:svg|png|webp)|nav-[^/?#]+\.webp)(?:[?#].*)?$/i;
  let queued = false;

  function isIcon(img) {
    const src = (img.getAttribute('src') || '').trim();
    return img.matches('.brandMark, .illustratedNavImage, [data-elsewhere-icon]')
      || Boolean(img.closest('.navIcon, .areaIcon'))
      || ICON_SOURCE.test(src);
  }

  function markImages(root = document) {
    const images = [];
    if (root instanceof HTMLImageElement) images.push(root);
    if (root.querySelectorAll) images.push(...root.querySelectorAll('img'));

    images.forEach(img => {
      if (isIcon(img)) {
        img.dataset.elsewhereIcon = 'true';
        img.hidden = false;
      } else {
        img.dataset.elsewhereImageHidden = 'true';
        img.hidden = true;
        img.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function disablePhotoControls(root = document) {
    root.querySelectorAll?.('#completionPhoto, #freePhoto, #photoPlaceFile').forEach(input => {
      input.disabled = true;
      const control = input.closest('.photoPick, label');
      if (control) control.hidden = true;
      else input.hidden = true;
    });

    root.querySelectorAll?.(
      '.photoPick, .photoEdit, .selectedPhotoPreview, .photoLightbox, .photoModal, ' +
      '#elsewherePhotoLightbox, #placePhotoModal, .memoryPhoto, .placePhoto, [data-photo-key]'
    ).forEach(element => {
      element.hidden = true;
      element.setAttribute('aria-hidden', 'true');
    });
  }

  function clearLegacyPhotoDb() {
    return new Promise(resolve => {
      const request = indexedDB.deleteDatabase('elsewhere_images_v1');
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    });
  }

  function wireClearAll() {
    const button = document.querySelector('#clearAll');
    if (!button || button.dataset.iconsOnlyClearWired) return;
    button.dataset.iconsOnlyClearWired = 'true';
    button.onclick = async () => {
      if (!confirm('Clear all saved Elsewhere data from this device?')) return;
      const keys = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key?.startsWith('elsewhere_')) keys.push(key);
      }
      keys.forEach(key => localStorage.removeItem(key));
      await clearLegacyPhotoDb();
      location.reload();
    };
  }

  function apply(root = document) {
    document.documentElement.classList.add(ROOT_CLASS);
    markImages(root);
    disablePhotoControls(root);
    wireClearAll();
  }

  function queueApply() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply(document);
    });
  }

  const style = document.createElement('style');
  style.id = 'elsewhere-icons-only-styles';
  style.textContent = `
    html.${ROOT_CLASS} img:not(.brandMark):not(.illustratedNavImage):not([data-elsewhere-icon]) {
      display: none !important;
    }
    html.${ROOT_CLASS} picture,
    html.${ROOT_CLASS} .photoPick,
    html.${ROOT_CLASS} .photoEdit,
    html.${ROOT_CLASS} .selectedPhotoPreview,
    html.${ROOT_CLASS} .photoLightbox,
    html.${ROOT_CLASS} .photoModal,
    html.${ROOT_CLASS} #elsewherePhotoLightbox,
    html.${ROOT_CLASS} #placePhotoModal,
    html.${ROOT_CLASS} .memoryPhoto,
    html.${ROOT_CLASS} .placePhoto,
    html.${ROOT_CLASS} [data-photo-key],
    html.${ROOT_CLASS} .softCountryBoard,
    html.${ROOT_CLASS} .fashionOutfitArt,
    html.${ROOT_CLASS} .fashionItemArt {
      display: none !important;
    }
    html.${ROOT_CLASS} .fashionOutfitCard::before {
      content: none !important;
      display: none !important;
      background: none !important;
      background-image: none !important;
    }
    html.${ROOT_CLASS} .fashionOutfitCard {
      overflow: visible;
    }
    html.${ROOT_CLASS} .fashionOutfitCopy {
      padding: 18px;
    }
  `;
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(document), {once: true});
  } else {
    apply(document);
  }

  new MutationObserver(queueApply).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
