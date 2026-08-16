(() => {
  const FOOD_KEY='elsewhere_food_v1';
  let queued=false;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const round=v=>Math.round(Number(v)||0);

  function foodState(){
    try{
      const raw=JSON.parse(localStorage.getItem(FOOD_KEY)||'{}');
      raw.savedMeals=Array.isArray(raw.savedMeals)?raw.savedMeals:[];
      return raw;
    }catch{return {savedMeals:[]}}
  }

  function injectStyles(){
    if(document.querySelector('#elsewhereFavouriteQuickStyles'))return;
    const style=document.createElement('style');
    style.id='elsewhereFavouriteQuickStyles';
    style.textContent=`
      #foodAddFavourite b{color:#9b5f4c;background:#f6e9e1}
      .foodFavouritePickerIntro{font-size:.82rem;color:#737c75;line-height:1.45;margin:-6px 0 14px}
      .foodFavouritePickerList{display:grid;gap:9px;margin-top:8px}
      .foodFavouritePickerCard{border:1px solid #ded9cd;background:#fffdf8;border-radius:17px;padding:13px}
      .foodFavouritePickerTop{display:flex;justify-content:space-between;gap:12px;align-items:start}
      .foodFavouritePickerTop strong{font-size:.96rem;color:#344b3c}
      .foodFavouritePickerTop span{font-size:.82rem;font-weight:800;color:#5e695f;white-space:nowrap}
      .foodFavouritePickerPortions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
      .foodFavouritePickerPortions button{border:0;background:#eef2e9;color:#344b3c;border-radius:999px;padding:8px 11px;font-size:.78rem;font-weight:750}
      .foodFavouritePickerEmpty{background:#f5f3ed;border-radius:17px;padding:16px;color:#707a73;font-size:.85rem;line-height:1.45}
    `;
    document.head.appendChild(style);
  }

  function logFavourite(meal,portion,close){
    if(!meal)return;
    const calories=round((Number(meal.caloriesPerPortion)||0)*Number(portion));
    if(calories<=0)return;
    if(window.elsewhereFood?.add){
      close?.();
      window.elsewhereFood.add({
        name:meal.name,
        calories,
        source:'saved',
        savedMealId:meal.id,
        portion:Number(portion)
      });
      return;
    }
    const original=[...document.querySelectorAll('[data-food-log]')].find(b=>b.dataset.foodLog===`${meal.id}|${portion}`);
    if(original){close?.();original.click()}
  }

  function openPicker(){
    document.querySelector('#foodFavouriteQuickModal')?.remove();
    const favourites=foodState().savedMeals.filter(m=>m.favourite);
    const box=document.createElement('div');
    box.id='foodFavouriteQuickModal';
    box.className='foodModal';
    box.innerHTML=`<div class="foodModalCard"><button class="foodModalClose" aria-label="Close">×</button><p class="eyebrow">QUICK ADD</p><h2>Add a favourite</h2><p class="foodFavouritePickerIntro">Choose what you are having and the portion. Elsewhere will add it to the meal time you are in now.</p>${favourites.length?`<div class="foodFavouritePickerList">${favourites.map(m=>`<div class="foodFavouritePickerCard"><div class="foodFavouritePickerTop"><strong>${esc(m.name)}</strong><span>${round(m.caloriesPerPortion)} kcal</span></div><div class="foodFavouritePickerPortions"><button data-quick-favourite="${esc(m.id)}|0.5">½ portion</button><button data-quick-favourite="${esc(m.id)}|1">1 portion</button><button data-quick-favourite="${esc(m.id)}|1.5">1½ portions</button><button data-quick-favourite="${esc(m.id)}|2">2 portions</button></div></div>`).join('')}</div>`:`<div class="foodFavouritePickerEmpty">You do not have any favourites yet. Tap ♡ beside something in Today or Previous days first, then it will appear here.</div>`}</div>`;
    document.body.appendChild(box);
    const close=()=>box.remove();
    box.querySelector('.foodModalClose').onclick=close;
    box.onclick=e=>{if(e.target===box)close()};
    box.querySelectorAll('[data-quick-favourite]').forEach(button=>button.onclick=()=>{
      const[id,portion]=button.dataset.quickFavourite.split('|');
      const meal=favourites.find(m=>m.id===id);
      logFavourite(meal,portion,close);
    });
  }

  function ensureButton(){
    injectStyles();
    const grid=document.querySelector('#foodLogGrid');
    const quick=document.querySelector('#foodQuickAdd');
    if(!grid||!quick)return;
    let button=document.querySelector('#foodAddFavourite');
    if(!button){
      button=document.createElement('button');
      button.id='foodAddFavourite';
      button.className='foodAction';
      button.innerHTML='<b>♥</b><span><strong>Add a favourite</strong><small>Leftovers or something you repeat</small></span>';
      quick.insertAdjacentElement('afterend',button);
    }else if(button.parentElement!==grid){
      quick.insertAdjacentElement('afterend',button);
    }
    button.onclick=openPicker;
  }

  function queue(){if(queued)return;queued=true;setTimeout(()=>{queued=false;ensureButton()},0)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(queue,100),{once:true});else setTimeout(queue,100);
  const cook=document.querySelector('#cook');if(cook)new MutationObserver(queue).observe(cook,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-go="cook"]'))setTimeout(queue,50)},true);
})();