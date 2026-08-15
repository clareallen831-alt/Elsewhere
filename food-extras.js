(() => {
  const FOOD_KEY='elsewhere_food_v1';
  const $x=s=>document.querySelector(s);
  const $$x=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const mealLabels={breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner',snack:'Snacks',drink:'Drinks'};
  const mealOrder=['breakfast','lunch','dinner','snack','drink'];
  const round=v=>Math.round(Number(v)||0);

  function state(){
    try{
      const s=JSON.parse(localStorage.getItem(FOOD_KEY)||'{}');
      s.entries=Array.isArray(s.entries)?s.entries:[];
      s.savedMeals=Array.isArray(s.savedMeals)?s.savedMeals:[];
      s.imports=Array.isArray(s.imports)?s.imports:[];
      return s;
    }catch{return {target:null,entries:[],savedMeals:[],imports:[]}}
  }
  function save(s){localStorage.setItem(FOOD_KEY,JSON.stringify(s))}
  function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function pastKey(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-days);return dateKey(d)}
  function normalMeal(v){
    v=String(v||'').toLowerCase();
    if(/breakfast|morning/.test(v))return'breakfast';
    if(/lunch|midday/.test(v))return'lunch';
    if(/dinner|tea|evening|supper/.test(v))return'dinner';
    if(/drink|latte|coffee|tea/.test(v))return'drink';
    return'snack';
  }
  function prettyDate(key,index){
    if(index===1)return 'Yesterday';
    const d=new Date(`${key}T12:00:00`);
    return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'});
  }

  function injectStyles(){
    if($x('#foodExtrasStyles'))return;
    const s=document.createElement('style');s.id='foodExtrasStyles';s.textContent=`
      .foodActionSections{display:grid;gap:18px;margin:2px 0 22px}.foodToolSection{display:grid;gap:8px}.foodToolLabel{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:#78827b;font-weight:800;margin:0 2px}.foodToolSection .foodActionGrid{margin:0}.foodRecipeGrid{grid-template-columns:1fr 1fr}.foodRecipeGrid .pasteRecipe{grid-column:1/-1}.foodHistory{margin:26px 0 8px}.foodHistoryTop{display:flex;justify-content:space-between;align-items:end;gap:14px;margin-bottom:10px}.foodHistoryTop h2{margin:0}.foodHistoryTop small{color:#7a837c;line-height:1.35}.foodHistoryDay{background:#fffdf8;border:1px solid #e0e2dc;border-radius:17px;margin-bottom:8px;overflow:hidden}.foodHistoryDay summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px;cursor:pointer}.foodHistoryDay summary::-webkit-details-marker{display:none}.foodHistoryDay summary span{display:flex;flex-direction:column;gap:2px}.foodHistoryDay summary strong{font-size:.93rem;color:#344b3c}.foodHistoryDay summary small{font-size:.73rem;color:#7b847e}.foodHistoryTotal{font-size:.82rem;color:#566259;white-space:nowrap}.foodHistoryBody{border-top:1px solid #ecece7;padding:10px 13px 13px}.foodHistoryMeal{margin:7px 0 10px}.foodHistoryMeal>p{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:#7c857e;margin:0 0 5px}.foodHistoryEntry{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #efefe9}.foodHistoryEntry:last-child{border-bottom:0}.foodHistoryEntry strong{font-size:.84rem;font-weight:650}.foodHistoryEntry span{font-size:.8rem;font-weight:800}.foodHistoryEntryActions{display:flex;gap:2px}.foodHistoryEntryActions button{border:0;background:transparent;color:#7a837d;padding:5px;font-size:.88rem}.foodHistoryAdd{width:100%;border:1px dashed #b9c0ba;background:#f6f5ef;color:#344b3c;border-radius:13px;padding:10px;font-weight:750;margin-top:7px}.foodHistoryEmpty{font-size:.8rem;color:#7b847e;padding:2px 0 6px}.foodHistoryModalNote{font-size:.76rem;color:#7b847e;margin:-5px 0 10px}.foodImportNudge{background:#eef2e9;border-radius:15px;padding:11px 13px;font-size:.78rem;line-height:1.45;color:#5f6d63;margin-top:2px}.foodImportNudge strong{color:#344b3c}@media(max-width:420px){.foodRecipeGrid{grid-template-columns:1fr}.foodRecipeGrid .pasteRecipe{grid-column:auto}.foodHistoryEntry{grid-template-columns:1fr auto}.foodHistoryEntryActions{grid-column:2;grid-row:1/3}}
    `;document.head.appendChild(s);
  }

  function organiseActions(){
    const cook=$x('#cook');if(!cook)return;
    const quick=$x('#foodQuickAdd'),paste=$x('#foodPasteImport'),saveMeal=$x('#foodSaveMeal'),recipe=$x('#foodRecipe');
    if(!quick||!paste||!saveMeal||!recipe)return;
    let shell=$x('#foodActionSections');
    if(!shell){
      const old=quick.closest('.foodActionGrid');if(!old)return;
      shell=document.createElement('div');shell.id='foodActionSections';shell.className='foodActionSections';
      shell.innerHTML=`<div class="foodToolSection"><p class="foodToolLabel">LOG TODAY</p><div class="foodActionGrid foodLogGrid" id="foodLogGrid"></div><div class="foodImportNudge"><strong>ChatGPT estimates:</strong> paste a few foods together, or tap an Add to Elsewhere link from ChatGPT and they will arrive here separately.</div></div><div class="foodToolSection"><p class="foodToolLabel">MEALS & RECIPES</p><div class="foodActionGrid foodRecipeGrid" id="foodRecipeGrid"></div></div>`;
      old.before(shell);old.remove();
    }
    const log=$x('#foodLogGrid'),recipes=$x('#foodRecipeGrid');if(!log||!recipes)return;
    [quick,paste].forEach(b=>{if(b.parentElement!==log)log.appendChild(b)});
    [saveMeal,recipe].forEach(b=>{if(b.parentElement!==recipes)recipes.appendChild(b)});
    const pasteRecipe=$x('#foodPasteRecipe');if(pasteRecipe&&pasteRecipe.parentElement!==recipes)recipes.appendChild(pasteRecipe);
    const pStrong=paste.querySelector('strong'),pSmall=paste.querySelector('small');
    if(pStrong)pStrong.textContent='Add from ChatGPT';
    if(pSmall)pSmall.textContent='Paste today’s calorie estimates';
  }

  function ensureHistory(){
    const today=$x('#foodTodayList');if(!today)return;
    let section=$x('#foodHistorySection');
    if(!section){
      section=document.createElement('section');section.id='foodHistorySection';section.className='foodHistory';
      section.innerHTML='<div class="foodHistoryTop"><div><p class="eyebrow">RECENT DAYS</p><h2 class="sectionTitle">Previous days</h2></div><small>Forgot something?<br>Add it to the right day.</small></div><div id="foodHistoryList"></div>';
      today.insertAdjacentElement('afterend',section);
    }
    renderHistory();
  }

  function historyRows(items){
    if(!items.length)return '<div class="foodHistoryEmpty">Nothing logged for this day.</div>';
    return mealOrder.map(type=>{
      const rows=items.filter(i=>normalMeal(i.mealType)===type);if(!rows.length)return'';
      return `<div class="foodHistoryMeal"><p>${mealLabels[type]}</p>${rows.map(e=>`<div class="foodHistoryEntry"><strong>${esc(e.name)}</strong><span>${round(e.calories)} kcal</span><div class="foodHistoryEntryActions"><button data-history-edit="${esc(e.id)}" aria-label="Edit">✎</button><button data-history-remove="${esc(e.id)}" aria-label="Remove">×</button></div></div>`).join('')}</div>`;
    }).join('');
  }

  function renderHistory(){
    const root=$x('#foodHistoryList');if(!root)return;
    const open=new Set($$x('#foodHistoryList details[open]').map(d=>d.dataset.day));
    const s=state();
    root.innerHTML=Array.from({length:7},(_,i)=>i+1).map(i=>{
      const key=pastKey(i),items=s.entries.filter(e=>e.dateKey===key),total=items.reduce((a,e)=>a+round(e.calories),0),label=prettyDate(key,i);
      return `<details class="foodHistoryDay" data-day="${key}" ${open.has(key)?'open':''}><summary><span><strong>${esc(label)}</strong><small>${esc(key.split('-').reverse().join('/'))}</small></span><b class="foodHistoryTotal">${items.length?`${total.toLocaleString()} kcal`:'No entries'}</b></summary><div class="foodHistoryBody">${historyRows(items)}<button class="foodHistoryAdd" data-history-add="${key}">+ Add something to this day</button></div></details>`;
    }).join('');
    $$x('[data-history-add]').forEach(b=>b.onclick=e=>{e.preventDefault();openHistoryEditor(null,b.dataset.historyAdd)});
    $$x('[data-history-edit]').forEach(b=>b.onclick=e=>{e.preventDefault();const entry=state().entries.find(x=>x.id===b.dataset.historyEdit);if(entry)openHistoryEditor(entry,entry.dateKey)});
    $$x('[data-history-remove]').forEach(b=>b.onclick=e=>{e.preventDefault();if(!confirm('Remove this food entry?'))return;const s=state();s.entries=s.entries.filter(x=>x.id!==b.dataset.historyRemove);save(s);window.elsewhereFood?.render?.()});
  }

  function openHistoryEditor(entry,key){
    $x('#foodHistoryModal')?.remove();
    const box=document.createElement('div');box.id='foodHistoryModal';box.className='foodModal';
    const editing=Boolean(entry);
    box.innerHTML=`<div class="foodModalCard"><button class="foodModalClose" aria-label="Close">×</button><p class="eyebrow">${editing?'EDIT A PAST DAY':'ADD TO A PAST DAY'}</p><h2>${editing?'Update this item':'What did you have?'}</h2><p class="foodHistoryModalNote">${esc(new Date(`${key}T12:00:00`).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}))}</p><label class="foodField"><span>Food or drink</span><input id="historyFoodName" value="${esc(entry?.name||'')}" placeholder="e.g. toast with peanut butter"></label><label class="foodField"><span>Estimated calories</span><input id="historyFoodCalories" type="number" inputmode="numeric" min="1" value="${esc(entry?.calories||'')}" placeholder="e.g. 320"></label><label class="foodField"><span>Add to</span><select id="historyFoodMeal">${mealOrder.map(v=>`<option value="${v}" ${normalMeal(entry?.mealType||'snack')===v?'selected':''}>${mealLabels[v]}</option>`).join('')}</select></label><div class="foodModalActions"><button class="secondary" id="historyCancel">Cancel</button><button class="primary" id="historySave">${editing?'Save changes':'Add to this day'}</button></div></div>`;
    document.body.appendChild(box);const close=()=>box.remove();box.querySelector('.foodModalClose').onclick=close;box.querySelector('#historyCancel').onclick=close;box.onclick=e=>{if(e.target===box)close()};
    box.querySelector('#historySave').onclick=()=>{
      const name=box.querySelector('#historyFoodName').value.trim(),calories=round(box.querySelector('#historyFoodCalories').value),mealType=box.querySelector('#historyFoodMeal').value;if(!name||calories<=0)return;
      if(editing){const s=state(),target=s.entries.find(x=>x.id===entry.id);if(target){target.name=name;target.calories=calories;target.mealType=mealType}save(s);close();window.elsewhereFood?.render?.()}
      else{close();window.elsewhereFood?.add?.({name,calories,mealType,dateKey:key})}
    };
  }

  let queued=false;
  function enhance(){queued=false;injectStyles();organiseActions();ensureHistory()}
  function queue(){if(queued)return;queued=true;setTimeout(enhance,0)}
  const cook=$x('#cook');if(cook)new MutationObserver(queue).observe(cook,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-go="cook"]'))setTimeout(queue,30)},true);
  setTimeout(queue,80);
})();
