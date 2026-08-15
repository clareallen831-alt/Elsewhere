(() => {
  const FOOD_KEY='elsewhere_food_v1';
  const LEGACY_MEALS_KEY='elsewhere_meals';
  const $f=s=>document.querySelector(s);
  const $$f=s=>[...document.querySelectorAll(s)];
  const foodEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const foodUid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const round=v=>Math.round(num(v));
  const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const mealLabels={breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner',snack:'Snacks'};
  const mealOrder=['breakfast','lunch','dinner','snack'];

  function defaultState(){return {target:null,entries:[],savedMeals:[]}}
  function foodState(){
    try{
      const raw=JSON.parse(localStorage.getItem(FOOD_KEY)||'null');
      if(!raw||typeof raw!=='object')return defaultState();
      return {target:raw.target||null,entries:Array.isArray(raw.entries)?raw.entries:[],savedMeals:Array.isArray(raw.savedMeals)?raw.savedMeals:[]};
    }catch{return defaultState()}
  }
  function saveFood(v){
    v.entries=(v.entries||[]).slice(0,1500);
    v.savedMeals=(v.savedMeals||[]).slice(0,250);
    localStorage.setItem(FOOD_KEY,JSON.stringify(v));
  }
  function legacyMeals(){
    try{
      const v=JSON.parse(localStorage.getItem(LEGACY_MEALS_KEY)||'{"rated":{},"ideas":[]}');
      return {rated:v.rated||{},ideas:Array.isArray(v.ideas)?v.ideas:[]};
    }catch{return {rated:{},ideas:[]}}
  }
  function saveLegacyMeals(v){localStorage.setItem(LEGACY_MEALS_KEY,JSON.stringify(v))}
  function currentMealType(){const h=new Date().getHours();return h<11?'breakfast':h<15?'lunch':h<21?'dinner':'snack'}

  function ensureFoodMarkup(){
    const section=$f('#cook');
    if(!section)return;
    section.innerHTML=`
      <button class="back" data-food-back>← My Things</button>
      <div class="sectionIntro foodIntro">
        <p class="eyebrow">OUR FOOD</p>
        <h1>Eat without the faff.</h1>
        <p>A simple estimate of what you have eaten. No streaks, no judgement, no need to make it perfect.</p>
      </div>

      <div class="foodSummaryCard">
        <div class="foodSummaryTop"><div><p class="eyebrow">TODAY</p><div class="foodTotal"><strong id="foodTodayTotal">0</strong><span>kcal logged</span></div></div><button class="foodQuietBtn" id="foodTargetBtn">Set target</button></div>
        <div class="foodProgress hidden" id="foodProgress"><span id="foodProgressFill"></span></div>
        <p class="foodTargetText" id="foodTargetText">You can add a daily target if that is useful to you.</p>
      </div>

      <div class="foodActionGrid">
        <button class="foodAction" id="foodQuickAdd"><b>＋</b><span><strong>Quick add</strong><small>Log something now</small></span></button>
        <button class="foodAction" id="foodSaveMeal"><b>♡</b><span><strong>Save a meal</strong><small>For things you eat again</small></span></button>
        <button class="foodAction wide" id="foodRecipe"><b>÷</b><span><strong>Recipe calculator</strong><small>Whole recipe → calories per portion</small></span></button>
      </div>

      <h2 class="sectionTitle">Today</h2>
      <div id="foodTodayList" class="stack"></div>

      <h2 class="sectionTitle">Saved meals</h2>
      <div id="foodSavedMeals" class="stack"></div>

      <div class="foodLegacy" id="foodLegacy"></div>
      <p class="foodNote">Calorie figures here are for everyday tracking and can be estimates. Elsewhere is keeping this food data on this device.</p>
    `;
    section.querySelector('[data-food-back]').onclick=()=>typeof go==='function'?go('things'):null;
  }

  function injectFoodStyles(){
    if($f('#elsewhereFoodStyles'))return;
    const style=document.createElement('style');style.id='elsewhereFoodStyles';style.textContent=`
      .foodIntro{margin-bottom:18px}.foodSummaryCard{background:#344b3c;color:#fffdf8;border-radius:24px;padding:22px;margin:8px 0 16px;box-shadow:0 10px 30px rgba(52,75,60,.12)}.foodSummaryTop{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.foodSummaryCard .eyebrow{color:#dce7de}.foodTotal{display:flex;align-items:baseline;gap:8px;margin-top:2px}.foodTotal strong{font-family:Georgia,serif;font-weight:400;font-size:2.8rem;line-height:1}.foodTotal span{font-size:.9rem;opacity:.85}.foodQuietBtn{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;border-radius:999px;padding:8px 12px;font-weight:700}.foodProgress{height:8px;background:rgba(255,255,255,.14);border-radius:999px;overflow:hidden;margin:18px 0 8px}.foodProgress.hidden{display:none}.foodProgress span{display:block;height:100%;width:0;background:#f3f0e8;border-radius:999px;transition:width .2s ease}.foodTargetText{font-size:.84rem;margin:8px 0 0;opacity:.86}.foodActionGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 18px}.foodAction{display:flex;align-items:center;gap:12px;text-align:left;border:1px solid #d9ddd5;background:#fffdf8;border-radius:18px;padding:15px;color:#344b3c}.foodAction.wide{grid-column:1/-1}.foodAction>b{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#eef2e9;font-size:1.25rem}.foodAction span{display:flex;flex-direction:column;gap:2px}.foodAction strong{font-size:.95rem}.foodAction small{color:#758078;font-size:.76rem}.foodDayGroup{margin-bottom:12px}.foodDayLabel{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#77827a;margin:0 0 6px}.foodEntry{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;background:#fffdf8;border:1px solid #e0e2dc;border-radius:16px;padding:12px 13px;margin-bottom:7px}.foodEntry strong{font-size:.92rem}.foodEntry small{display:block;color:#7b847e;margin-top:2px}.foodCalories{font-weight:800;white-space:nowrap}.foodDelete{border:0;background:transparent;color:#8a918c;font-size:1.2rem;line-height:1;padding:6px}.foodEmpty{padding:18px;background:#f5f3ed;border-radius:18px;color:#707a73;font-size:.9rem}.foodMealCard{background:#fffdf8;border:1px solid #dfe2db;border-radius:18px;padding:14px;margin-bottom:9px}.foodMealHead{display:flex;justify-content:space-between;gap:14px;align-items:start}.foodMealHead strong{font-size:1rem}.foodMealHead small{display:block;color:#778078;margin-top:3px}.foodMealKcal{font-weight:800;white-space:nowrap}.foodPortions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.foodPortions button,.foodTextButton{border:0;background:#eef2e9;color:#344b3c;border-radius:999px;padding:8px 11px;font-size:.78rem;font-weight:750}.foodCardActions{display:flex;gap:8px;margin-top:9px}.foodCardActions button{border:0;background:transparent;color:#6f7a72;font-size:.76rem;padding:3px 0}.foodLegacy{margin-top:24px}.foodLegacyBlock{margin-top:18px}.foodLegacyRow{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid #e5e5df}.foodLegacyRow strong{font-size:.9rem}.foodLegacyRow small{color:#7b847d}.foodNote{font-size:.76rem;line-height:1.5;color:#7d857f;margin:26px 3px 8px}.foodModal{position:fixed;z-index:11000;inset:0;background:rgba(34,42,36,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}.foodModalCard{width:min(680px,100%);max-height:92vh;overflow:auto;background:#fffdf8;border-radius:26px;padding:25px;box-shadow:0 20px 70px rgba(0,0,0,.2);position:relative}.foodModalCard h2{font-family:Georgia,serif;font-weight:400;font-size:1.8rem;margin:4px 0 16px}.foodModalClose{position:absolute;right:15px;top:13px;border:0;background:transparent;font-size:1.8rem;color:#59645c}.foodField{display:block;margin:13px 0}.foodField span{display:block;font-size:.78rem;font-weight:750;color:#59645c;margin-bottom:6px}.foodField input,.foodField select{width:100%;box-sizing:border-box;border:1px solid #d8dcd5;border-radius:13px;background:white;padding:12px 13px;font:inherit;color:#344b3c}.foodCalcResult{background:#eef2e9;border-radius:16px;padding:14px;margin:14px 0}.foodCalcResult strong{font-family:Georgia,serif;font-size:1.55rem;font-weight:400}.foodModalActions{display:flex;gap:10px;margin-top:16px}.foodModalActions button{flex:1}.foodRemoveTarget{display:block;border:0;background:transparent;color:#7a817c;text-decoration:underline;margin:10px auto 0}.foodToast{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:12000;background:#344b3c;color:white;border-radius:999px;padding:10px 15px;box-shadow:0 8px 30px rgba(0,0,0,.18);font-size:.82rem;white-space:nowrap}.foodToast button{border:0;background:transparent;color:white;text-decoration:underline;margin-left:9px;font-weight:800}@media(max-width:390px){.foodActionGrid{grid-template-columns:1fr}.foodAction.wide{grid-column:auto}.foodEntry{grid-template-columns:1fr auto}.foodEntry .foodDelete{grid-column:2;grid-row:1/3}}
    `;document.head.appendChild(style);
  }

  function showToast(text,undo){
    $f('#foodToast')?.remove();const t=document.createElement('div');t.id='foodToast';t.className='foodToast';t.innerHTML=`${foodEsc(text)}${undo?'<button>Undo</button>':''}`;document.body.appendChild(t);if(undo)t.querySelector('button').onclick=()=>{undo();t.remove()};setTimeout(()=>t.remove(),3200);
  }

  function openFoodModal({eyebrow='FOOD',title,body='',fields=[],saveLabel='Save',onSave,onReady,extra=''}){
    $f('#foodModal')?.remove();const box=document.createElement('div');box.id='foodModal';box.className='foodModal';
    box.innerHTML=`<div class="foodModalCard"><button class="foodModalClose" aria-label="Close">×</button><p class="eyebrow">${foodEsc(eyebrow)}</p><h2>${foodEsc(title)}</h2>${body?`<p class="muted">${foodEsc(body)}</p>`:''}<div class="foodModalFields">${fields.map(f=>`<label class="foodField"><span>${foodEsc(f.label)}</span>${f.type==='select'?`<select data-food-field="${foodEsc(f.id)}">${(f.options||[]).map(o=>`<option value="${foodEsc(o.value)}" ${o.value===f.value?'selected':''}>${foodEsc(o.label)}</option>`).join('')}</select>`:`<input data-food-field="${foodEsc(f.id)}" type="${f.type||'text'}" inputmode="${f.inputmode||''}" value="${foodEsc(f.value||'')}" placeholder="${foodEsc(f.placeholder||'')}" ${f.min!=null?`min="${f.min}"`:''} ${f.step!=null?`step="${f.step}"`:''}>`}</label>`).join('')}</div>${extra}<div class="foodModalActions"><button class="secondary" data-food-cancel>Cancel</button><button class="primary" data-food-save>${foodEsc(saveLabel)}</button></div></div>`;
    document.body.appendChild(box);const close=()=>box.remove();box.querySelector('.foodModalClose').onclick=close;box.querySelector('[data-food-cancel]').onclick=close;box.onclick=e=>{if(e.target===box)close()};
    const get=id=>box.querySelector(`[data-food-field="${id}"]`);onReady?.({box,get,close});
    box.querySelector('[data-food-save]').onclick=()=>{const vals={};fields.forEach(f=>vals[f.id]=(get(f.id)?.value||'').trim());onSave?.(vals,{box,get,close})};
    return box;
  }

  function addEntry({name,calories,mealType=currentMealType(),source='quick',savedMealId=null,portion=null}){
    calories=round(calories);if(!name||calories<=0)return;
    const s=foodState(),entry={id:foodUid(),dateKey:dayKey(),createdAt:new Date().toISOString(),name,calories,mealType,source,savedMealId,portion};s.entries.unshift(entry);saveFood(s);renderFood();showToast(`${name} added · ${calories} kcal`,()=>{const x=foodState();x.entries=x.entries.filter(e=>e.id!==entry.id);saveFood(x);renderFood()});
  }

  function renderSummary(s){
    const today=s.entries.filter(e=>e.dateKey===dayKey()),total=today.reduce((a,e)=>a+num(e.calories),0),target=num(s.target);
    $f('#foodTodayTotal').textContent=round(total).toLocaleString();const progress=$f('#foodProgress'),fill=$f('#foodProgressFill'),text=$f('#foodTargetText'),button=$f('#foodTargetBtn');
    if(target>0){progress.classList.remove('hidden');fill.style.width=`${Math.min(100,(total/target)*100)}%`;button.textContent='Change target';const remaining=round(target-total);text.textContent=remaining>0?`${remaining.toLocaleString()} kcal remaining from your ${round(target).toLocaleString()} kcal target.`:`${round(total).toLocaleString()} kcal logged today · target ${round(target).toLocaleString()} kcal.`}
    else{progress.classList.add('hidden');fill.style.width='0';button.textContent='Set target';text.textContent='You can add a daily target if that is useful to you.'}
  }

  function renderToday(s){
    const today=s.entries.filter(e=>e.dateKey===dayKey());const root=$f('#foodTodayList');
    if(!today.length){root.innerHTML='<div class="foodEmpty">Nothing logged yet. Add only what is useful — it does not need to be exact.</div>';return}
    root.innerHTML=mealOrder.map(type=>{const items=today.filter(e=>(e.mealType||'snack')===type);if(!items.length)return'';return `<div class="foodDayGroup"><p class="foodDayLabel">${mealLabels[type]}</p>${items.map(e=>`<div class="foodEntry"><div><strong>${foodEsc(e.name)}</strong>${e.portion?`<small>${foodEsc(e.portion)} portion${Number(e.portion)===1?'':'s'}</small>`:''}</div><span class="foodCalories">${round(e.calories)} kcal</span><button class="foodDelete" data-food-delete="${foodEsc(e.id)}" aria-label="Remove ${foodEsc(e.name)}">×</button></div>`).join('')}</div>`}).join('');
    $$f('[data-food-delete]').forEach(b=>b.onclick=()=>{const x=foodState();x.entries=x.entries.filter(e=>e.id!==b.dataset.foodDelete);saveFood(x);renderFood()});
  }

  function renderSaved(s){
    const root=$f('#foodSavedMeals');if(!s.savedMeals.length){root.innerHTML='<div class="foodEmpty">Meals you save will appear here, so logging them next time takes one tap.</div>';return}
    root.innerHTML=s.savedMeals.map(m=>`<div class="foodMealCard"><div class="foodMealHead"><div><strong>${foodEsc(m.name)}</strong><small>${m.source==='recipe'&&m.recipePortions?`Recipe · ${foodEsc(m.recipePortions)} portions`:'Saved meal'}</small></div><span class="foodMealKcal">${round(m.caloriesPerPortion)} kcal</span></div><div class="foodPortions"><button data-food-log="${foodEsc(m.id)}|0.5">½ portion</button><button data-food-log="${foodEsc(m.id)}|1">1 portion</button><button data-food-log="${foodEsc(m.id)}|1.5">1½ portions</button><button data-food-log="${foodEsc(m.id)}|2">2 portions</button></div><div class="foodCardActions"><button data-food-edit="${foodEsc(m.id)}">Edit</button><button data-food-remove="${foodEsc(m.id)}">Remove</button></div></div>`).join('');
    $$f('[data-food-log]').forEach(b=>b.onclick=()=>{const [id,pRaw]=b.dataset.foodLog.split('|'),p=Number(pRaw),m=foodState().savedMeals.find(x=>x.id===id);if(m)addEntry({name:m.name,calories:m.caloriesPerPortion*p,source:'saved',savedMealId:id,portion:p})});
    $$f('[data-food-edit]').forEach(b=>b.onclick=()=>openSavedMeal(foodState().savedMeals.find(x=>x.id===b.dataset.foodEdit)));
    $$f('[data-food-remove]').forEach(b=>b.onclick=()=>{const x=foodState();x.savedMeals=x.savedMeals.filter(m=>m.id!==b.dataset.foodRemove);saveFood(x);renderFood()});
  }

  function renderLegacy(){
    const root=$f('#foodLegacy');if(!root)return;const old=legacyMeals(),cooked=Object.keys(old.rated||{}),ideas=old.ideas||[];
    if(!cooked.length&&!ideas.length){root.innerHTML='';return}
    root.innerHTML=`${cooked.length?`<div class="foodLegacyBlock"><p class="eyebrow">ALREADY IN ELSEWHERE</p><h2 class="sectionTitle">Meals I already cook</h2>${cooked.map(name=>`<div class="foodLegacyRow"><div><strong>${foodEsc(name)}</strong><small> Add calories when you want to track it</small></div><button class="foodTextButton" data-food-convert="${foodEsc(name)}">Add calories</button></div>`).join('')}</div>`:''}${ideas.length?`<div class="foodLegacyBlock"><h2 class="sectionTitle">Want to try</h2>${ideas.map(x=>`<div class="foodLegacyRow"><div><strong>${foodEsc(x.title)}</strong>${x.note?`<small>${foodEsc(x.note)}</small>`:''}</div></div>`).join('')}<button class="secondary full" id="foodAddIdea">+ Save a meal idea</button></div>`:''}`;
    $$f('[data-food-convert]').forEach(b=>b.onclick=()=>openSavedMeal({name:b.dataset.foodConvert}));
    $f('#foodAddIdea')?.addEventListener('click',openMealIdea);
  }

  function openQuickAdd(){
    openFoodModal({eyebrow:'QUICK ADD',title:'What did you eat?',fields:[{id:'name',label:'Food or meal',placeholder:'e.g. chicken curry'},{id:'calories',label:'Estimated calories',type:'number',inputmode:'numeric',min:1,placeholder:'e.g. 520'},{id:'mealType',label:'Add to',type:'select',value:currentMealType(),options:mealOrder.map(v=>({value:v,label:mealLabels[v]}))}],saveLabel:'Add to today',onSave:(v,{close})=>{const c=round(v.calories);if(!v.name||c<=0)return;close();addEntry({name:v.name,calories:c,mealType:v.mealType})}})
  }

  function openTarget(){
    const s=foodState();const box=openFoodModal({eyebrow:'OPTIONAL TARGET',title:s.target?'Change your daily target':'Set a daily target',body:'This is just a reference point. Elsewhere will not turn it into a score.',fields:[{id:'target',label:'Calories per day',type:'number',inputmode:'numeric',min:1,value:s.target||'',placeholder:'Enter your own target'}],saveLabel:'Save target',extra:s.target?'<button class="foodRemoveTarget" type="button">Remove target</button>':'',onSave:(v,{close})=>{const t=round(v.target);if(t<=0)return;const x=foodState();x.target=t;saveFood(x);close();renderFood()}});box.querySelector('.foodRemoveTarget')?.addEventListener('click',()=>{const x=foodState();x.target=null;saveFood(x);box.remove();renderFood()})
  }

  function openSavedMeal(existing={}){
    const editing=Boolean(existing.id);openFoodModal({eyebrow:editing?'EDIT SAVED MEAL':'SAVE A MEAL',title:editing?'Update this meal':'Make next time easier',body:'Save the calories for one normal portion. You can log half, one, one-and-a-half or two portions later.',fields:[{id:'name',label:'Meal name',value:existing.name||'',placeholder:'e.g. Our chilli'},{id:'calories',label:'Calories per portion',type:'number',inputmode:'numeric',min:1,value:existing.caloriesPerPortion||'',placeholder:'e.g. 480'}],saveLabel:editing?'Save changes':'Save meal',onSave:(v,{close})=>{const c=round(v.calories);if(!v.name||c<=0)return;const s=foodState();if(editing){const m=s.savedMeals.find(x=>x.id===existing.id);if(m){m.name=v.name;m.caloriesPerPortion=c}}else{s.savedMeals.unshift({id:foodUid(),name:v.name,caloriesPerPortion:c,source:'manual',createdAt:new Date().toISOString()})}saveFood(s);close();renderFood()}})
  }

  function openRecipe(){
    openFoodModal({eyebrow:'RECIPE CALCULATOR',title:'Turn a recipe into portions',body:'For now, enter the calorie total for the whole recipe and how many portions it made. Photo recipe reading can be added later.',fields:[{id:'name',label:'Recipe name',placeholder:'e.g. Chicken & chorizo traybake'},{id:'total',label:'Calories in the whole recipe',type:'number',inputmode:'numeric',min:1,placeholder:'e.g. 2240'},{id:'portions',label:'How many portions?',type:'number',inputmode:'decimal',min:0.25,step:0.25,placeholder:'e.g. 4'}],saveLabel:'Save recipe',extra:'<div class="foodCalcResult" id="foodCalcResult">Enter the total and portions to see calories per portion.</div>',onReady:({box,get})=>{const update=()=>{const total=num(get('total').value),p=num(get('portions').value),out=box.querySelector('#foodCalcResult');out.innerHTML=total>0&&p>0?`<strong>${round(total/p)} kcal</strong><br><small>per portion</small>`:'Enter the total and portions to see calories per portion.'};get('total').addEventListener('input',update);get('portions').addEventListener('input',update)},onSave:(v,{close})=>{const total=num(v.total),p=num(v.portions);if(!v.name||total<=0||p<=0)return;const s=foodState();s.savedMeals.unshift({id:foodUid(),name:v.name,caloriesPerPortion:round(total/p),source:'recipe',recipeTotal:round(total),recipePortions:p,createdAt:new Date().toISOString()});saveFood(s);close();renderFood();showToast(`${v.name} saved · ${round(total/p)} kcal per portion`)}})
  }

  function openMealIdea(){
    openFoodModal({eyebrow:'SAVE A MEAL IDEA',title:'What sounds good?',fields:[{id:'title',label:'Meal or recipe',placeholder:'Something you want to try'},{id:'note',label:'Anything to remember?',placeholder:'Where you saw it, who recommended it…'}],saveLabel:'Save idea',onSave:(v,{close})=>{if(!v.title)return;const old=legacyMeals();old.ideas.unshift({id:foodUid(),title:v.title,note:v.note});saveLegacyMeals(old);close();renderFood()}})
  }

  function bindFoodActions(){
    $f('#foodQuickAdd')?.addEventListener('click',openQuickAdd);$f('#foodSaveMeal')?.addEventListener('click',()=>openSavedMeal());$f('#foodRecipe')?.addEventListener('click',openRecipe);$f('#foodTargetBtn')?.addEventListener('click',openTarget);
  }

  function renderFood(){
    if(!$f('#cook'))return;ensureFoodMarkup();const s=foodState();renderSummary(s);renderToday(s);renderSaved(s);renderLegacy();bindFoodActions();
  }

  function initFood(){
    injectFoodStyles();const tile=$f('.thing[data-go="cook"]');if(tile){const title=tile.querySelector('strong'),small=tile.querySelector('small');if(title)title.textContent='Eat';if(small)small.textContent='Simple food tracking for real life.'}
    const original=window.renderCook;window.renderCook=renderFood;$$f('[data-go="cook"]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderFood,0)));if($f('#cook')?.classList.contains('active'))renderFood();
    window.elsewhereFood={render:renderFood,state:foodState,originalRenderCook:original};
  }

  initFood();
})();