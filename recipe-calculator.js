(() => {
  const FOOD_KEY='elsewhere_food_v1';
  const CUSTOM_KEY='elsewhere_custom_ingredients_v1';
  const $r=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const n=v=>Number.isFinite(Number(v))?Number(v):0;
  const round=v=>Math.round(n(v));
  const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');

  // Approximate kcal per 100g. Values remain editable in the builder.
  // Density is grams per ml; each is an approximate edible weight in grams.
  const common=[
    {name:'Chicken breast',kcal:120,aliases:['chicken breast fillet']},{name:'Chicken thighs, skinless',kcal:150,aliases:['chicken thigh']},{name:'Beef mince 5%',kcal:137,aliases:['lean beef mince']},{name:'Beef mince 10%',kcal:176},{name:'Turkey mince',kcal:140},{name:'Pork mince',kcal:180},{name:'Salmon',kcal:208},{name:'White fish',kcal:90,aliases:['cod','haddock']},{name:'Prawns',kcal:85,aliases:['shrimp']},{name:'Tuna, canned in spring water',kcal:116,aliases:['tinned tuna']},{name:'Egg',kcal:143,each:58,aliases:['eggs']},{name:'Tofu',kcal:144},
    {name:'Lentils, cooked',kcal:116},{name:'Chickpeas, cooked',kcal:164},{name:'Chickpeas, canned drained',kcal:139,each:240},{name:'Kidney beans, cooked',kcal:127},{name:'Kidney beans, canned drained',kcal:110,each:240},{name:'Black beans, cooked',kcal:132},{name:'Butter beans, canned drained',kcal:103,each:240},
    {name:'Pasta, dry',kcal:350,aliases:['dry pasta']},{name:'Basmati rice, dry',kcal:350,aliases:['rice','dry rice']},{name:'Brown rice, dry',kcal:360},{name:'Couscous, dry',kcal:376},{name:'Noodles, dry',kcal:350},{name:'Potato',kcal:77,aliases:['potatoes']},{name:'Sweet potato',kcal:86},{name:'Wholemeal bread',kcal:247,each:38,aliases:['bread']},{name:'Flour tortilla',kcal:310,each:64,aliases:['wrap','tortilla']},{name:'Oats',kcal:372,aliases:['porridge oats']},
    {name:'Onion',kcal:40,each:110,aliases:['onions']},{name:'Red onion',kcal:40,each:110},{name:'Garlic clove',kcal:149,each:3,aliases:['garlic']},{name:'Red pepper',kcal:31,each:160,aliases:['pepper','bell pepper']},{name:'Courgette',kcal:17,each:196,aliases:['zucchini']},{name:'Carrot',kcal:41,each:61,aliases:['carrots']},{name:'Broccoli',kcal:34},{name:'Cauliflower',kcal:25},{name:'Spinach',kcal:23},{name:'Mushrooms',kcal:22},{name:'Tomato',kcal:18,each:123,aliases:['tomatoes']},{name:'Cherry tomatoes',kcal:18},{name:'Frozen peas',kcal:81,aliases:['peas']},{name:'Sweetcorn',kcal:86},{name:'Green beans',kcal:31},{name:'Aubergine',kcal:25,each:300,aliases:['eggplant']},
    {name:'Chopped tomatoes, canned',kcal:24,each:400,aliases:['tinned tomatoes','canned tomatoes']},{name:'Passata',kcal:30,density:1.02},{name:'Tomato purée',kcal:82,aliases:['tomato puree']},{name:'Coconut milk, full fat',kcal:180,density:1.0,each:400},{name:'Coconut milk, light',kcal:75,density:1.0,each:400},
    {name:'Olive oil',kcal:884,density:0.91},{name:'Vegetable oil',kcal:884,density:0.92},{name:'Butter',kcal:717},{name:'Mayonnaise',kcal:680,density:0.94},{name:'Pesto',kcal:460},{name:'Peanut butter',kcal:588},{name:'Honey',kcal:304,density:1.42},{name:'Sugar',kcal:400},{name:'Soy sauce',kcal:53,density:1.16},
    {name:'Semi-skimmed milk',kcal:47,density:1.03,aliases:['milk']},{name:'Greek yoghurt 0%',kcal:59,density:1.03},{name:'Greek yoghurt 5%',kcal:97,density:1.03},{name:'Double cream',kcal:467,density:0.99},{name:'Crème fraîche',kcal:292,aliases:['creme fraiche']},{name:'Cheddar',kcal:416},{name:'Parmesan',kcal:431},{name:'Mozzarella',kcal:280},{name:'Feta',kcal:265},
    {name:'Apple',kcal:52,each:182},{name:'Banana',kcal:89,each:118},{name:'Blueberries',kcal:57},{name:'Strawberries',kcal:32},{name:'Avocado',kcal:160,each:150},{name:'Lemon juice',kcal:22,density:1.03},{name:'Lime juice',kcal:25,density:1.03}
  ];

  function customFoods(){try{return JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]')}catch{return[]}}
  function saveCustomFoods(v){localStorage.setItem(CUSTOM_KEY,JSON.stringify(v.slice(0,100)))}
  function allFoods(){return [...customFoods(),...common]}
  function findFood(name){
    const q=norm(name);if(!q)return null;
    const foods=allFoods();
    return foods.find(f=>norm(f.name)===q||(f.aliases||[]).some(a=>norm(a)===q)) ||
      foods.find(f=>norm(f.name).startsWith(q)||(f.aliases||[]).some(a=>norm(a).startsWith(q))) || null;
  }
  function gramsFor(amount,unit,food){
    const density=n(food?.density)||1;
    if(unit==='g')return amount;
    if(unit==='kg')return amount*1000;
    if(unit==='ml')return amount*density;
    if(unit==='tsp')return amount*5*density;
    if(unit==='tbsp')return amount*15*density;
    if(unit==='each')return food?.each?amount*n(food.each):null;
    return amount;
  }
  function foodState(){try{return JSON.parse(localStorage.getItem(FOOD_KEY)||'{"target":null,"entries":[],"savedMeals":[]}')}catch{return {target:null,entries:[],savedMeals:[]}}}
  function saveFoodState(s){localStorage.setItem(FOOD_KEY,JSON.stringify(s))}

  function injectStyles(){
    if($r('#ingredientRecipeStyles'))return;
    const style=document.createElement('style');style.id='ingredientRecipeStyles';style.textContent=`
      .recipeBuilder{position:fixed;z-index:13000;inset:0;background:rgba(34,42,36,.58);display:flex;align-items:flex-end;justify-content:center;padding:10px}.recipeBuilderCard{width:min(720px,100%);max-height:94vh;overflow:auto;background:#fffdf8;border-radius:26px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.24);position:relative}.recipeBuilderCard h2{font-family:Georgia,serif;font-weight:400;font-size:1.8rem;margin:4px 0 6px;color:#344b3c}.recipeBuilderCard .muted{line-height:1.45}.recipeClose{position:absolute;right:14px;top:12px;border:0;background:transparent;color:#59645c;font-size:1.8rem}.recipeTop{display:grid;grid-template-columns:1fr 120px;gap:10px;margin:18px 0}.recipeField span{display:block;font-size:.76rem;font-weight:800;color:#59645c;margin-bottom:5px}.recipeField input,.recipeIngredient input,.recipeIngredient select{width:100%;box-sizing:border-box;border:1px solid #d8dcd5;border-radius:12px;background:white;padding:11px 12px;font:inherit;color:#344b3c}.recipeIngredients{display:grid;gap:10px;margin:10px 0}.recipeIngredient{background:#f6f4ee;border:1px solid #e3e2dc;border-radius:17px;padding:12px}.recipeIngredientHead{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.recipeRemove{border:0;background:transparent;color:#7a837d;font-size:1.25rem}.recipeIngredientNumbers{display:grid;grid-template-columns:90px 100px 1fr;gap:7px;margin-top:8px}.recipeIngredientMeta{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:8px;font-size:.74rem;color:#758078}.recipeIngredientMeta strong{color:#344b3c}.recipeWarning{color:#9a5e3a}.recipeAdd{width:100%;border:1px dashed #aab4ac;background:#f8f7f2;color:#344b3c;border-radius:14px;padding:11px;font-weight:800;margin:4px 0 14px}.recipeSummary{background:#344b3c;color:#fffdf8;border-radius:20px;padding:16px;margin:14px 0}.recipeSummaryTop{display:flex;justify-content:space-between;gap:14px}.recipeSummary strong{font-family:Georgia,serif;font-weight:400;font-size:1.8rem}.recipeSummary small{display:block;opacity:.78;margin-top:3px}.recipeSourceNote{font-size:.72rem;line-height:1.45;color:#7b847e;margin:10px 2px}.recipeSave{width:100%;margin-top:6px}.recipeToast{position:fixed;z-index:14000;left:50%;bottom:90px;transform:translateX(-50%);background:#344b3c;color:white;padding:10px 15px;border-radius:999px;font-size:.82rem;box-shadow:0 8px 30px rgba(0,0,0,.2)}@media(max-width:500px){.recipeTop{grid-template-columns:1fr 105px}.recipeIngredientNumbers{grid-template-columns:82px 92px 1fr}.recipeBuilderCard{padding:21px 16px}}
    `;document.head.appendChild(style);
  }

  function toast(text){$r('#recipeToast')?.remove();const t=document.createElement('div');t.id='recipeToast';t.className='recipeToast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}

  function ingredientRow(){
    const row=document.createElement('div');row.className='recipeIngredient';
    row.innerHTML=`<div class="recipeIngredientHead"><input data-role="name" list="elsewhereIngredientList" placeholder="Ingredient — e.g. chicken breast"><button class="recipeRemove" type="button" aria-label="Remove ingredient">×</button></div><div class="recipeIngredientNumbers"><input data-role="amount" type="number" inputmode="decimal" min="0" step="0.1" placeholder="Amount"><select data-role="unit"><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="tsp">tsp</option><option value="tbsp">tbsp</option><option value="each">item</option></select><input data-role="kcal" type="number" inputmode="decimal" min="0" step="0.1" placeholder="kcal / 100g"></div><div class="recipeIngredientMeta"><span data-role="hint">Choose a common ingredient or enter the packet value.</span><strong data-role="total">0 kcal</strong></div>`;
    const name=row.querySelector('[data-role="name"]'),amount=row.querySelector('[data-role="amount"]'),unit=row.querySelector('[data-role="unit"]'),kcal=row.querySelector('[data-role="kcal"]'),hint=row.querySelector('[data-role="hint"]');
    const applyMatch=()=>{const food=findFood(name.value);if(food){row.dataset.food=food.name;kcal.value=food.kcal;hint.textContent=`Estimate: ${food.kcal} kcal per 100g${food.each?' · item weight known':''}`;}else{delete row.dataset.food;hint.textContent='Not in the built-in list — enter kcal per 100g from the packet or recipe.';}updateRecipe(row.closest('.recipeBuilderCard'))};
    name.addEventListener('change',applyMatch);name.addEventListener('blur',applyMatch);[amount,kcal].forEach(x=>x.addEventListener('input',()=>updateRecipe(row.closest('.recipeBuilderCard'))));unit.addEventListener('change',()=>updateRecipe(row.closest('.recipeBuilderCard')));
    row.querySelector('.recipeRemove').onclick=()=>{const card=row.closest('.recipeBuilderCard');row.remove();updateRecipe(card)};
    return row;
  }

  function rowData(row){
    const name=row.querySelector('[data-role="name"]').value.trim(),amount=n(row.querySelector('[data-role="amount"]').value),unit=row.querySelector('[data-role="unit"]').value,kcal100=n(row.querySelector('[data-role="kcal"]').value);const food=findFood(name);const grams=gramsFor(amount,unit,food);
    const calories=grams==null?0:(grams*kcal100/100);
    return {name,amount,unit,kcal100,grams,calories,food};
  }
  function updateRecipe(card){
    if(!card)return;let total=0,invalidEach=false;
    card.querySelectorAll('.recipeIngredient').forEach(row=>{const d=rowData(row),out=row.querySelector('[data-role="total"]'),hint=row.querySelector('[data-role="hint"]');if(d.unit==='each'&&d.amount>0&&!d.food?.each){invalidEach=true;out.textContent='—';hint.textContent='For this ingredient, use grams or ml so Elsewhere can estimate it.';hint.classList.add('recipeWarning')}else{hint.classList.remove('recipeWarning');out.textContent=d.calories>0?`≈ ${round(d.calories)} kcal`:'0 kcal';total+=d.calories}});
    const portions=n(card.querySelector('#recipePortions').value),per=portions>0?total/portions:0;card.querySelector('#recipeWholeTotal').textContent=`≈ ${round(total).toLocaleString()} kcal`;card.querySelector('#recipePerPortion').textContent=portions>0&&total>0?`≈ ${round(per).toLocaleString()} kcal`:'—';card.querySelector('#recipeSaveBtn').disabled=!(card.querySelector('#recipeName').value.trim()&&total>0&&portions>0&&!invalidEach);
  }

  function openBuilder(){
    $r('#recipeBuilder')?.remove();injectStyles();const box=document.createElement('div');box.id='recipeBuilder';box.className='recipeBuilder';
    const options=allFoods().sort((a,b)=>a.name.localeCompare(b.name)).map(f=>`<option value="${esc(f.name)}"></option>`).join('');
    box.innerHTML=`<div class="recipeBuilderCard"><button class="recipeClose" aria-label="Close">×</button><p class="eyebrow">RECIPE CALCULATOR</p><h2>What went into it?</h2><p class="muted">Add the ingredients and amounts. Elsewhere will estimate the whole recipe, then divide it by the portions you actually made.</p><div class="recipeTop"><label class="recipeField"><span>Recipe name</span><input id="recipeName" placeholder="e.g. Chicken traybake"></label><label class="recipeField"><span>Portions</span><input id="recipePortions" type="number" inputmode="decimal" min="0.25" step="0.25" value="4"></label></div><datalist id="elsewhereIngredientList">${options}</datalist><div class="recipeIngredients" id="recipeIngredients"></div><button class="recipeAdd" id="recipeAddIngredient" type="button">+ Add ingredient</button><div class="recipeSummary"><div class="recipeSummaryTop"><div><small>WHOLE RECIPE</small><strong id="recipeWholeTotal">≈ 0 kcal</strong></div><div style="text-align:right"><small>PER PORTION</small><strong id="recipePerPortion">—</strong></div></div></div><p class="recipeSourceNote">Common-food values are approximate and editable. For branded or packaged ingredients, use the kcal per 100g shown on the packet for a better estimate.</p><button class="primary recipeSave" id="recipeSaveBtn" disabled>Save recipe</button></div>`;
    document.body.appendChild(box);const card=box.querySelector('.recipeBuilderCard'),list=box.querySelector('#recipeIngredients');
    const add=()=>{const row=ingredientRow();list.appendChild(row);row.querySelector('[data-role="name"]').focus();updateRecipe(card)};add();add();add();
    box.querySelector('#recipeAddIngredient').onclick=add;box.querySelector('.recipeClose').onclick=()=>box.remove();box.onclick=e=>{if(e.target===box)box.remove()};box.querySelector('#recipeName').addEventListener('input',()=>updateRecipe(card));box.querySelector('#recipePortions').addEventListener('input',()=>updateRecipe(card));
    box.querySelector('#recipeSaveBtn').onclick=()=>{
      const name=box.querySelector('#recipeName').value.trim(),portions=n(box.querySelector('#recipePortions').value),ingredients=[...box.querySelectorAll('.recipeIngredient')].map(rowData).filter(x=>x.name&&x.amount>0&&x.kcal100>0),total=ingredients.reduce((a,x)=>a+x.calories,0);if(!name||portions<=0||total<=0)return;
      const custom=customFoods();ingredients.forEach(i=>{if(!i.food&&!custom.some(x=>norm(x.name)===norm(i.name))){custom.unshift({name:i.name,kcal:i.kcal100})}});saveCustomFoods(custom);
      const s=foodState();s.entries=Array.isArray(s.entries)?s.entries:[];s.savedMeals=Array.isArray(s.savedMeals)?s.savedMeals:[];s.savedMeals.unshift({id:uid(),name,caloriesPerPortion:round(total/portions),source:'recipe',recipeTotal:round(total),recipePortions:portions,ingredients:ingredients.map(i=>({name:i.name,amount:i.amount,unit:i.unit,kcalPer100:i.kcal100,calories:round(i.calories)})),createdAt:new Date().toISOString()});saveFoodState(s);box.remove();window.elsewhereFood?.render?.();toast(`${name} saved · about ${round(total/portions)} kcal per portion`);
    };
  }

  document.addEventListener('click',e=>{const button=e.target.closest?.('#foodRecipe');if(!button)return;e.preventDefault();e.stopImmediatePropagation();openBuilder()},true);
  injectStyles();
})();