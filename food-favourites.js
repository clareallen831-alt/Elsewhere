(() => {
  const FOOD_KEY = 'elsewhere_food_v1';
  const ROOT_ID = 'foodFavouritesWrap';
  let applying = false;
  let scheduled = false;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
  const uid = () => `fav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const round = v => Math.round(num(v));

  function state() {
    try {
      const raw = JSON.parse(localStorage.getItem(FOOD_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return {target:null, entries:[], savedMeals:[], imports:[]};
      return {
        ...raw,
        entries: Array.isArray(raw.entries) ? raw.entries : [],
        savedMeals: Array.isArray(raw.savedMeals) ? raw.savedMeals : [],
        imports: Array.isArray(raw.imports) ? raw.imports : []
      };
    } catch {
      return {target:null, entries:[], savedMeals:[], imports:[]};
    }
  }

  function save(s) {
    localStorage.setItem(FOOD_KEY, JSON.stringify(s));
  }

  function toast(message) {
    document.querySelector('#foodFavouriteToast')?.remove();
    const el = document.createElement('div');
    el.id = 'foodFavouriteToast';
    el.className = 'foodFavouriteToast';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function findMealForEntry(s, entry) {
    if (!entry) return null;
    if (entry.savedMealId) {
      const linked = s.savedMeals.find(m => m.id === entry.savedMealId);
      if (linked) return linked;
    }
    const name = String(entry.name || '').trim().toLowerCase();
    const calories = round(entry.calories);
    return s.savedMeals.find(m =>
      String(m.name || '').trim().toLowerCase() === name &&
      round(m.caloriesPerPortion) === calories
    ) || null;
  }

  function favouriteEntry(entryId) {
    const s = state();
    const entry = s.entries.find(e => e.id === entryId);
    if (!entry) return;

    let meal = findMealForEntry(s, entry);
    if (!meal) {
      meal = {
        id: uid(),
        name: entry.name,
        caloriesPerPortion: round(entry.calories),
        source: 'favourite',
        favourite: true,
        createdAt: new Date().toISOString()
      };
      s.savedMeals.unshift(meal);
      entry.savedMealId = meal.id;
    } else {
      meal.favourite = true;
      if (!entry.savedMealId) entry.savedMealId = meal.id;
    }
    save(s);
    toast(`${entry.name} added to Favourites`);
    scheduleApply();
  }

  function toggleSavedFavourite(mealId) {
    const s = state();
    const meal = s.savedMeals.find(m => m.id === mealId);
    if (!meal) return;
    meal.favourite = !meal.favourite;
    save(s);
    toast(meal.favourite ? `${meal.name} added to Favourites` : `${meal.name} removed from Favourites`);
    scheduleApply();
  }

  function logFavourite(mealId, portion) {
    const selector = `[data-food-log="${CSS.escape(mealId)}|${CSS.escape(String(portion))}"]`;
    const original = document.querySelector(selector);
    if (original) {
      original.click();
      return;
    }

    // Fallback if the underlying Saved meals card is temporarily unavailable.
    const s = state();
    const meal = s.savedMeals.find(m => m.id === mealId);
    if (!meal) return;
    const now = new Date();
    const h = now.getHours();
    const mealType = h < 11 ? 'breakfast' : h < 15 ? 'lunch' : h < 21 ? 'dinner' : 'snack';
    const dateKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    s.entries.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      dateKey,
      createdAt: now.toISOString(),
      name: meal.name,
      calories: round(num(meal.caloriesPerPortion) * num(portion)),
      mealType,
      source: 'saved',
      savedMealId: meal.id,
      portion: num(portion)
    });
    save(s);
    toast(`${meal.name} added`);
    document.dispatchEvent(new CustomEvent('elsewhere-food-favourite-added'));
    location.reload();
  }

  function favouriteCard(meal) {
    return `<div class="foodMealCard foodFavouriteCard">
      <div class="foodMealHead">
        <div><strong>${esc(meal.name)}</strong><small>Favourite · easy to repeat</small></div>
        <span class="foodMealKcal">${round(meal.caloriesPerPortion)} kcal</span>
      </div>
      <div class="foodPortions">
        <button data-food-favourite-log="${esc(meal.id)}|0.5">½ portion</button>
        <button data-food-favourite-log="${esc(meal.id)}|1">1 portion</button>
        <button data-food-favourite-log="${esc(meal.id)}|1.5">1½ portions</button>
        <button data-food-favourite-log="${esc(meal.id)}|2">2 portions</button>
      </div>
      <div class="foodCardActions"><button data-food-favourite-toggle="${esc(meal.id)}">♥ Remove from favourites</button></div>
    </div>`;
  }

  function renderFavourites(s) {
    const savedRoot = document.querySelector('#foodSavedMeals');
    if (!savedRoot) return;
    const savedHeading = savedRoot.previousElementSibling;
    let wrap = document.querySelector(`#${ROOT_ID}`);
    const favourites = s.savedMeals.filter(m => m.favourite);

    if (!favourites.length) {
      wrap?.remove();
      return;
    }

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = ROOT_ID;
      savedHeading?.before(wrap);
    }

    wrap.innerHTML = `
      <div class="foodFavouriteHead">
        <div><p class="eyebrow">QUICK AGAIN</p><h2 class="sectionTitle">Favourites</h2></div>
        <span>Perfect for leftovers</span>
      </div>
      <div class="foodFavouriteHint">Tap the portion you are having and Elsewhere will log it as the meal time you are in now.</div>
      <div class="stack">${favourites.map(favouriteCard).join('')}</div>
    `;

    wrap.querySelectorAll('[data-food-favourite-log]').forEach(button => {
      button.onclick = () => {
        const [id, portion] = button.dataset.foodFavouriteLog.split('|');
        logFavourite(id, portion);
      };
    });
    wrap.querySelectorAll('[data-food-favourite-toggle]').forEach(button => {
      button.onclick = () => toggleSavedFavourite(button.dataset.foodFavouriteToggle);
    });
  }

  function decorateToday(s) {
    document.querySelectorAll('#foodTodayList .foodEntry').forEach(row => {
      const edit = row.querySelector('[data-food-edit-entry]');
      const actions = row.querySelector('.foodEntryActions');
      if (!edit || !actions) return;
      const entryId = edit.dataset.foodEditEntry;
      const entry = s.entries.find(e => e.id === entryId);
      if (!entry) return;
      const meal = findMealForEntry(s, entry);
      const isFavourite = Boolean(meal?.favourite);

      let button = actions.querySelector('[data-food-favourite-entry]');
      if (!button) {
        button = document.createElement('button');
        button.dataset.foodFavouriteEntry = entryId;
        actions.prepend(button);
      }
      button.className = `foodFavouriteButton${isFavourite ? ' isFavourite' : ''}`;
      button.textContent = isFavourite ? '♥' : '♡';
      button.setAttribute('aria-label', isFavourite ? `${entry.name} is a favourite` : `Add ${entry.name} to favourites`);
      button.title = isFavourite ? 'Favourite' : 'Add to Favourites';
      button.onclick = () => {
        if (isFavourite) {
          toggleSavedFavourite(meal.id);
        } else {
          favouriteEntry(entryId);
        }
      };
    });
  }

  function decorateSaved(s) {
    document.querySelectorAll('#foodSavedMeals .foodMealCard').forEach(card => {
      const edit = card.querySelector('[data-food-edit]');
      if (!edit) return;
      const mealId = edit.dataset.foodEdit;
      const meal = s.savedMeals.find(m => m.id === mealId);
      if (!meal) return;
      const head = card.querySelector('.foodMealHead');
      if (!head) return;

      let heart = head.querySelector('[data-food-saved-heart]');
      if (!heart) {
        heart = document.createElement('button');
        heart.dataset.foodSavedHeart = mealId;
        head.appendChild(heart);
      }
      heart.className = `foodSavedHeart${meal.favourite ? ' isFavourite' : ''}`;
      heart.textContent = meal.favourite ? '♥' : '♡';
      heart.setAttribute('aria-label', meal.favourite ? `Remove ${meal.name} from favourites` : `Add ${meal.name} to favourites`);
      heart.title = meal.favourite ? 'Remove from Favourites' : 'Add to Favourites';
      heart.onclick = () => toggleSavedFavourite(mealId);
    });
  }

  function injectStyles() {
    if (document.querySelector('#elsewhereFoodFavouriteStyles')) return;
    const style = document.createElement('style');
    style.id = 'elsewhereFoodFavouriteStyles';
    style.textContent = `
      .foodFavouriteHead{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:24px 2px 9px}
      .foodFavouriteHead .sectionTitle{margin:1px 0 0}.foodFavouriteHead .eyebrow{margin:0}
      .foodFavouriteHead>span{font-size:.72rem;color:#7a827b;margin-bottom:3px}
      .foodFavouriteHint{background:#f2eee4;border:1px solid rgba(93,85,75,.08);border-radius:15px;padding:11px 13px;color:#70695e;font-size:.78rem;line-height:1.4;margin-bottom:9px}
      .foodFavouriteCard{border-color:#d7d1bd;background:linear-gradient(145deg,#fffdf8,#faf5e9)}
      .foodFavouriteCard .foodMealHead{padding-right:2px}
      .foodFavouriteButton,.foodSavedHeart{border:0;background:transparent!important;color:#9a6755!important;font-size:1.2rem!important;line-height:1!important;padding:6px!important;min-width:30px;cursor:pointer}
      .foodFavouriteButton.isFavourite,.foodSavedHeart.isFavourite{color:#9b5f4c!important}
      .foodSavedHeart{margin-left:auto;align-self:flex-start;font-size:1.35rem!important}
      .foodMealHead>.foodMealKcal+.foodSavedHeart{margin-left:-5px}
      .foodFavouriteToast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:13000;background:#344b3c;color:white;border-radius:999px;padding:10px 15px;box-shadow:0 8px 30px rgba(0,0,0,.18);font-size:.82rem;white-space:nowrap}
    `;
    document.head.appendChild(style);
  }

  function apply() {
    if (applying) return;
    applying = true;
    try {
      if (!document.querySelector('#cook')) return;
      injectStyles();
      const s = state();
      renderFavourites(s);
      decorateToday(s);
      decorateSaved(s);
    } finally {
      applying = false;
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }

  const observer = new MutationObserver(scheduleApply);
  const start = () => {
    const cook = document.querySelector('#cook');
    if (cook) observer.observe(cook, {childList:true, subtree:true});
    apply();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-go="cook"]')) setTimeout(scheduleApply, 30);
  });
  setTimeout(scheduleApply, 700);
})();