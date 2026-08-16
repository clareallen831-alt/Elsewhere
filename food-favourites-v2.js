(() => {
  const FOOD_KEY='elsewhere_food_v1';
  const ROOT_ID='foodFavouritesWrap';
  let scheduled=false;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uid=()=>`fav-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const round=v=>Math.round(num(v));

  function state(){
    try{
      const raw=JSON.parse(localStorage.getItem(FOOD_KEY)||'null');
      if(!raw||typeof raw!=='object')return {target:null,entries:[],savedMeals:[],imports:[]};
      return {...raw,entries:Array.isArray(raw.entries)?raw.entries:[],savedMeals:Array.isArray(raw.savedMeals)?raw.savedMeals:[],imports:Array.isArray(raw.imports)?raw.imports:[]};
    }catch{return {target:null,entries:[],savedMeals:[],imports:[]}}
  }
  const save=s=>localStorage.setItem(FOOD_KEY,JSON.stringify(s));

  function toast(message){
    document.querySelector('#foodFavouriteToast')?.remove();
    const el=document.createElement('div');el.id='foodFavouriteToast';el.className='foodFavouriteToast';el.textContent=message;document.body.appendChild(el);
    setTimeout(()=>el.remove(),2200);
  }

  function findMealForEntry(s,entry){
    if(!entry)return null;
    if(entry.savedMealId){const linked=s.savedMeals.find(m=>m.id===entry.savedMealId);if(linked)return linked}
    const name=String(entry.name||'').trim().toLowerCase(),calories=round(entry.calories);
    return s.savedMeals.find(m=>String(m.name||'').trim().toLowerCase()===name&&round(m.caloriesPerPortion)===calories)||null;
  }

  function favouriteEntry(entryId){
    const s=state(),entry=s.entries.find(e=>e.id===entryId);if(!entry)return;
    let meal=findMealForEntry(s,entry);
    if(!meal){
      meal={id:uid(),name:entry.name,caloriesPerPortion:round(entry.calories),source:'favourite',favourite:true,createdAt:new Date().toISOString()};
      s.savedMeals.unshift(meal);entry.savedMealId=meal.id;
    }else{meal.favourite=true;if(!entry.savedMealId)entry.savedMealId=meal.id}
    save(s);toast(`${entry.name} added to Favourites`);scheduleApply();
  }

  function toggleSavedFavourite(mealId){
    const s=state(),meal=s.savedMeals.find(m=>m.id===mealId);if(!meal)return;
    meal.favourite=!meal.favourite;save(s);toast(meal.favourite?`${meal.name} added to Favourites`:`${meal.name} removed from Favourites`);scheduleApply();
  }

  function logFavourite(mealId,portion){
    const original=[...document.querySelectorAll('[data-food-log]')].find(b=>b.dataset.foodLog===`${mealId}|${portion}`);
    if(original){original.click();setTimeout(scheduleApply,30);return}
    const s=state(),meal=s.savedMeals.find(m=>m.id===mealId);if(!meal)return;
    const now=new Date(),h=now.getHours(),mealType=h<11?'breakfast':h<15?'lunch':h<21?'dinner':'snack';
    const dateKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    s.entries.unshift({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,dateKey,createdAt:now.toISOString(),name:meal.name,calories:round(num(meal.caloriesPerPortion)*num(portion)),mealType,source:'saved',savedMealId:meal.id,portion:num(portion)});
    save(s);location.reload();
  }

  function favouriteCard(meal){
    return `<div class="foodMealCard foodFavouriteCard"><div class="foodMealHead"><div><strong>${esc(meal.name)}</strong><small>Favourite · easy to repeat</small></div><span class="foodMealKcal">${round(meal.caloriesPerPortion)} kcal</span></div><div class="foodPortions"><button data-food-favourite-log="${esc(meal.id)}|0.5">½ portion</button><button data-food-favourite-log="${esc(meal.id)}|1">1 portion</button><button data-food-favourite-log="${esc(meal.id)}|1.5">1½ portions</button><button data-food-favourite-log="${esc(meal.id)}|2">2 portions</button></div><div class="foodCardActions"><button data-food-favourite-toggle="${esc(meal.id)}">♥ Remove from favourites</button></div></div>`;
  }

  function renderFavourites(s){
    const savedRoot=document.querySelector('#foodSavedMeals');if(!savedRoot)return;
    const heading=savedRoot.previousElementSibling;let wrap=document.querySelector(`#${ROOT_ID}`);const favourites=s.savedMeals.filter(m=>m.favourite);
    if(!favourites.length){wrap?.remove();return}
    const signature=favourites.map(m=>`${m.id}:${m.name}:${m.caloriesPerPortion}`).join('|');
    if(!wrap){wrap=document.createElement('div');wrap.id=ROOT_ID;heading?.before(wrap)}
    if(wrap.dataset.signature!==signature){
      wrap.dataset.signature=signature;
      wrap.innerHTML=`<div class="foodFavouriteHead"><div><p class="eyebrow">QUICK AGAIN</p><h2 class="sectionTitle">Favourites</h2></div><span>Perfect for leftovers</span></div><div class="foodFavouriteHint">Tap the portion you are having and Elsewhere will log it as the meal time you are in now.</div><div class="stack">${favourites.map(favouriteCard).join('')}</div>`;
    }
    wrap.querySelectorAll('[data-food-favourite-log]').forEach(b=>b.onclick=()=>{const[id,p]=b.dataset.foodFavouriteLog.split('|');logFavourite(id,p)});
    wrap.querySelectorAll('[data-food-favourite-toggle]').forEach(b=>b.onclick=()=>toggleSavedFavourite(b.dataset.foodFavouriteToggle));
  }

  function setEntryHeart(button,entry,s){
    if(!button||!entry)return;
    const meal=findMealForEntry(s,entry),fav=Boolean(meal?.favourite);
    const symbol=fav?'♥':'♡';if(button.textContent!==symbol)button.textContent=symbol;
    button.classList.toggle('isFavourite',fav);
    button.setAttribute('aria-label',fav?`${entry.name} is a favourite`:`Add ${entry.name} to favourites`);
    button.title=fav?'Favourite':'Add to Favourites';
    button.onclick=e=>{e.preventDefault();e.stopPropagation();fav?toggleSavedFavourite(meal.id):favouriteEntry(entry.id)};
  }

  function decorateToday(s){
    document.querySelectorAll('#foodTodayList .foodEntry').forEach(row=>{
      const edit=row.querySelector('[data-food-edit-entry]'),actions=row.querySelector('.foodEntryActions');if(!edit||!actions)return;
      const entry=s.entries.find(e=>e.id===edit.dataset.foodEditEntry);if(!entry)return;
      let button=actions.querySelector('[data-food-favourite-entry]');
      if(!button){button=document.createElement('button');button.dataset.foodFavouriteEntry=entry.id;button.className='foodFavouriteButton';actions.prepend(button)}
      setEntryHeart(button,entry,s);
    });
  }

  function decorateHistory(s){
    document.querySelectorAll('#foodHistoryList .foodHistoryEntry').forEach(row=>{
      const edit=row.querySelector('[data-history-edit]'),actions=row.querySelector('.foodHistoryEntryActions');if(!edit||!actions)return;
      const entry=s.entries.find(e=>e.id===edit.dataset.historyEdit);if(!entry)return;
      let button=actions.querySelector('[data-history-favourite-entry]');
      if(!button){button=document.createElement('button');button.dataset.historyFavouriteEntry=entry.id;button.className='foodFavouriteButton foodHistoryFavouriteButton';actions.prepend(button)}
      setEntryHeart(button,entry,s);
    });
  }

  function decorateSaved(s){
    document.querySelectorAll('#foodSavedMeals .foodMealCard').forEach(card=>{
      const edit=card.querySelector('[data-food-edit]');if(!edit)return;
      const meal=s.savedMeals.find(m=>m.id===edit.dataset.foodEdit);if(!meal)return;
      const head=card.querySelector('.foodMealHead');if(!head)return;
      let heart=head.querySelector('[data-food-saved-heart]');if(!heart){heart=document.createElement('button');heart.dataset.foodSavedHeart=meal.id;head.appendChild(heart)}
      const symbol=meal.favourite?'♥':'♡';if(heart.textContent!==symbol)heart.textContent=symbol;
      heart.className=`foodSavedHeart${meal.favourite?' isFavourite':''}`;heart.setAttribute('aria-label',meal.favourite?`Remove ${meal.name} from favourites`:`Add ${meal.name} to favourites`);heart.title=meal.favourite?'Remove from Favourites':'Add to Favourites';heart.onclick=()=>toggleSavedFavourite(meal.id);
    });
  }

  function injectStyles(){
    if(document.querySelector('#elsewhereFoodFavouriteStyles'))return;
    const style=document.createElement('style');style.id='elsewhereFoodFavouriteStyles';style.textContent=`
      .foodFavouriteHead{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:24px 2px 9px}.foodFavouriteHead .sectionTitle{margin:1px 0 0}.foodFavouriteHead .eyebrow{margin:0}.foodFavouriteHead>span{font-size:.72rem;color:#7a827b;margin-bottom:3px}.foodFavouriteHint{background:#f2eee4;border:1px solid rgba(93,85,75,.08);border-radius:15px;padding:11px 13px;color:#70695e;font-size:.78rem;line-height:1.4;margin-bottom:9px}.foodFavouriteCard{border-color:#d7d1bd;background:linear-gradient(145deg,#fffdf8,#faf5e9)}.foodFavouriteButton,.foodSavedHeart{border:0;background:transparent!important;color:#9a6755!important;font-size:1.2rem!important;line-height:1!important;padding:6px!important;min-width:30px;cursor:pointer}.foodFavouriteButton.isFavourite,.foodSavedHeart.isFavourite{color:#9b5f4c!important}.foodSavedHeart{margin-left:auto;align-self:flex-start;font-size:1.35rem!important}.foodHistoryFavouriteButton{font-size:1.08rem!important;padding:5px!important;min-width:28px}.foodFavouriteToast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:13000;background:#344b3c;color:white;border-radius:999px;padding:10px 15px;box-shadow:0 8px 30px rgba(0,0,0,.18);font-size:.82rem;white-space:nowrap}`;document.head.appendChild(style);
  }

  function apply(){
    if(!document.querySelector('#foodTodayList')||!document.querySelector('#foodSavedMeals'))return;
    injectStyles();const s=state();renderFavourites(s);decorateToday(s);decorateHistory(s);decorateSaved(s);
  }
  function scheduleApply(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()})}

  const start=()=>{apply();setTimeout(scheduleApply,500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  document.addEventListener('click',()=>setTimeout(scheduleApply,40));
  document.addEventListener('change',()=>setTimeout(scheduleApply,40));
  const cook=document.querySelector('#cook');if(cook)new MutationObserver(()=>scheduleApply()).observe(cook,{childList:true,subtree:true});
})();