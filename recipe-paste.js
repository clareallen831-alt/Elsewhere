(() => {
  const $p=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clean=s=>String(s||'').replace(/^\s*[-•*]\s*/,'').replace(/\s+/g,' ').trim();
  const fire=(el,type='input')=>el?.dispatchEvent(new Event(type,{bubbles:true}));
  const unitMap={
    g:'g',gram:'g',grams:'g',kg:'kg',kilogram:'kg',kilograms:'kg',ml:'ml',millilitre:'ml',millilitres:'ml',milliliter:'ml',milliliters:'ml',
    tsp:'tsp',teaspoon:'tsp',teaspoons:'tsp',tbsp:'tbsp',tablespoon:'tbsp',tablespoons:'tbsp',
    item:'each',items:'each',each:'each',egg:'each',eggs:'each',onion:'each',onions:'each',clove:'each',cloves:'each',tin:'each',tins:'each',can:'each',cans:'each'
  };
  const unicodeFractions={'½':0.5,'¼':0.25,'¾':0.75,'⅓':1/3,'⅔':2/3,'⅛':0.125};

  function numberValue(raw){
    raw=String(raw||'').trim();
    if(!raw)return 0;
    if(unicodeFractions[raw]!=null)return unicodeFractions[raw];
    const mixedUnicode=raw.match(/^(\d+)\s*([½¼¾⅓⅔⅛])$/);if(mixedUnicode)return Number(mixedUnicode[1])+unicodeFractions[mixedUnicode[2]];
    const mixed=raw.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(mixed)return Number(mixed[1])+Number(mixed[2])/Number(mixed[3]);
    const frac=raw.match(/^(\d+)\/(\d+)$/);if(frac)return Number(frac[1])/Number(frac[2]);
    const n=Number(raw.replace(',','.'));return Number.isFinite(n)?n:0;
  }

  function normalUnit(raw){return unitMap[String(raw||'').toLowerCase().replace(/[.]/g,'')]||null}
  function tidyIngredientName(name,containerUnit){
    let out=clean(name).replace(/[,:;.-]+$/,'').trim();
    out=out.replace(/\b(of)\b\s*/i,'').trim();
    if(containerUnit==='tin'||containerUnit==='tins'||containerUnit==='can'||containerUnit==='cans')out=out.replace(/\b(tinned|canned)\b/ig,'').trim();
    if(/^garlic$/i.test(out))return 'garlic';
    return out;
  }

  function parseCalories(line){
    const per100=line.match(/(\d+(?:[.,]\d+)?)\s*kcal\s*(?:\/|per)\s*100\s*(?:g|ml)?/i);
    if(per100)return Number(per100[1].replace(',','.'));
    return null;
  }

  function parseIngredient(line){
    let text=clean(line);if(!text)return null;
    if(/^(ingredients?|method|instructions?|nutrition|notes?)\s*:??$/i.test(text))return null;
    if(/^(serves?|servings?|portions?|makes)\b/i.test(text))return null;
    const kcal100=parseCalories(text);
    text=text.replace(/[|—–-]?\s*\(?\d+(?:[.,]\d+)?\s*kcal\s*(?:\/|per)\s*100\s*(?:g|ml)?\)?/ig,'').trim();

    let m=text.match(/^((?:\d+\s+\d+\/\d+)|(?:\d+\/\d+)|(?:\d+(?:[.,]\d+)?)|(?:\d*[½¼¾⅓⅔⅛]))\s*(g|grams?|kg|kilograms?|ml|millilit(?:re|er)s?|tsp|teaspoons?|tbsp|tablespoons?|tins?|cans?|cloves?|items?|each)\b\s*(?:of\s+)?(.+)$/i);
    if(m){
      const amount=numberValue(m[1]),rawUnit=m[2].toLowerCase(),unit=normalUnit(rawUnit),name=tidyIngredientName(m[3],rawUnit);
      return amount>0&&unit&&name?{name,amount,unit,kcal100}:null;
    }

    m=text.match(/^(.+?)\s*[—–:-]\s*((?:\d+\s+\d+\/\d+)|(?:\d+\/\d+)|(?:\d+(?:[.,]\d+)?)|(?:\d*[½¼¾⅓⅔⅛]))\s*(g|grams?|kg|kilograms?|ml|millilit(?:re|er)s?|tsp|teaspoons?|tbsp|tablespoons?|tins?|cans?|cloves?|items?|each)\b/i);
    if(m){
      const amount=numberValue(m[2]),rawUnit=m[3].toLowerCase(),unit=normalUnit(rawUnit),name=tidyIngredientName(m[1],rawUnit);
      return amount>0&&unit&&name?{name,amount,unit,kcal100}:null;
    }

    m=text.match(/^((?:\d+\s+\d+\/\d+)|(?:\d+\/\d+)|(?:\d+(?:[.,]\d+)?)|(?:\d*[½¼¾⅓⅔⅛]))\s+(.+)$/i);
    if(m){
      const amount=numberValue(m[1]),name=tidyIngredientName(m[2]);
      if(amount>0&&name&&!/^minutes?|hours?|mins?|hrs?\b/i.test(name))return {name,amount,unit:'each',kcal100};
    }
    return null;
  }

  function parseRecipe(text){
    const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    let name='',portions=0,perPortion=0;
    for(const raw of lines){
      const line=clean(raw);
      let m=line.match(/^(?:recipe|title|meal)\s*:\s*(.+)$/i);if(m&&!name){name=m[1].trim();continue}
      m=line.match(/^(?:serves?|servings?|portions?|makes)\s*:?\s*(\d+(?:[.,]\d+)?)/i);if(m&&!portions){portions=Number(m[1].replace(',','.'));continue}
      m=line.match(/(?:calories?|energy)\s*(?:per\s*(?:portion|serving))?\s*:?\s*(?:about\s*|approx\.?\s*|≈\s*)?(\d+)\s*kcal/i);if(m&&!perPortion)perPortion=Number(m[1]);
    }
    const ingredients=lines.map(parseIngredient).filter(Boolean);
    if(!name){
      const first=lines.map(clean).find(line=>line&&!parseIngredient(line)&&! /^(ingredients?|method|instructions?|serves?|servings?|portions?|makes|nutrition|calories?)\b/i.test(line));
      if(first)name=first.replace(/^#+\s*/,'').trim();
    }
    return {name,portions:portions||4,ingredients,perPortion};
  }

  function injectStyles(){
    if($p('#recipePasteStyles'))return;const s=document.createElement('style');s.id='recipePasteStyles';s.textContent=`
      .recipePasteModal{position:fixed;z-index:14500;inset:0;background:rgba(34,42,36,.58);display:flex;align-items:flex-end;justify-content:center;padding:10px}.recipePasteCard{width:min(720px,100%);max-height:94vh;overflow:auto;background:#fffdf8;border-radius:26px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.24);position:relative}.recipePasteCard h2{font-family:Georgia,serif;font-weight:400;font-size:1.8rem;margin:4px 0 7px;color:#344b3c}.recipePasteClose{position:absolute;right:14px;top:12px;border:0;background:transparent;color:#59645c;font-size:1.8rem}.recipePasteCard textarea{width:100%;box-sizing:border-box;min-height:220px;border:1px solid #d8dcd5;border-radius:15px;background:#fff;padding:13px;font:inherit;color:#344b3c;resize:vertical;margin:14px 0}.recipePasteHelp{background:#f3f1ea;border-radius:16px;padding:12px 14px;font-size:.78rem;line-height:1.5;color:#68736b}.recipePasteActions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.recipePasteActions .primary{grid-column:1/-1}.recipePasteStatus{font-size:.78rem;min-height:1.2em;color:#7a5a38;margin-top:8px}.recipePasteMini{border:0;background:#eef2e9;color:#344b3c;border-radius:999px;padding:9px 12px;font-weight:750}.foodAction.pasteRecipe>b{font-size:1rem}@media(max-width:420px){.recipePasteCard{padding:21px 16px}.recipePasteActions{grid-template-columns:1fr}.recipePasteActions .primary{grid-column:auto}}
    `;document.head.appendChild(s);
  }

  function addPasteButton(){
    const grid=$p('#cook .foodActionGrid');if(!grid||$p('#foodPasteRecipe'))return;
    const b=document.createElement('button');b.className='foodAction wide pasteRecipe';b.id='foodPasteRecipe';b.innerHTML='<b>⎘</b><span><strong>Paste recipe</strong><small>From ChatGPT, a website or your notes</small></span>';b.onclick=openPaste;grid.appendChild(b);
  }

  function builderRows(){return [...document.querySelectorAll('#recipeBuilder .recipeIngredient')]}
  function fillBuilder(parsed){
    const trigger=$p('#foodRecipe');if(!trigger)return false;
    trigger.click();
    const card=$p('#recipeBuilder .recipeBuilderCard');if(!card)return false;
    const name=$p('#recipeBuilder #recipeName'),portions=$p('#recipeBuilder #recipePortions');
    if(name&&parsed.name){name.value=parsed.name;fire(name)}
    if(portions&&parsed.portions){portions.value=parsed.portions;fire(portions)}
    while(builderRows().length<parsed.ingredients.length)$p('#recipeBuilder #recipeAddIngredient')?.click();
    const rows=builderRows();
    parsed.ingredients.forEach((item,i)=>{
      const row=rows[i];if(!row)return;
      const n=row.querySelector('[data-role="name"]'),a=row.querySelector('[data-role="amount"]'),u=row.querySelector('[data-role="unit"]'),k=row.querySelector('[data-role="kcal"]');
      n.value=item.name;fire(n,'change');a.value=item.amount;fire(a);u.value=item.unit;fire(u,'change');if(item.kcal100){k.value=item.kcal100;fire(k)}
    });
    return true;
  }

  function copyPrompt(status){
    const prompt='Format this recipe so I can paste it into my Elsewhere app. Use exactly this structure:\n\nRecipe: [name]\nServes: [number]\nIngredients:\n- [amount] [g/kg/ml/tsp/tbsp/item] [ingredient] — [kcal per 100g if known]\n- ...\n\nDo not include the cooking method before the ingredients. Use metric measurements where possible. If you know a packaged ingredient’s calories, write them as “123 kcal/100g”.';
    navigator.clipboard?.writeText(prompt).then(()=>{status.textContent='ChatGPT formatting prompt copied.'}).catch(()=>{status.textContent='Could not copy automatically — you can still paste a normal recipe here.'});
  }

  function openPaste(){
    $p('#recipePasteModal')?.remove();injectStyles();const box=document.createElement('div');box.id='recipePasteModal';box.className='recipePasteModal';box.innerHTML=`<div class="recipePasteCard"><button class="recipePasteClose" aria-label="Close">×</button><p class="eyebrow">PASTE A RECIPE</p><h2>Bring it into Elsewhere.</h2><p class="muted">Paste a recipe from ChatGPT, a website or your notes. Elsewhere will pull out the parts it recognises, then let you check everything in the normal recipe calculator.</p><textarea id="recipePasteText" placeholder="Recipe: Chicken traybake\nServes: 4\nIngredients:\n- 500 g chicken breast\n- 1 tbsp olive oil\n- 1 onion\n- 400 g chopped tomatoes"></textarea><div class="recipePasteHelp"><strong>Best results:</strong> include a recipe name, how many portions it makes and one ingredient per line with a quantity. If ChatGPT gives kcal/100g for an ingredient, Elsewhere can use that too.</div><div class="recipePasteStatus" id="recipePasteStatus"></div><div class="recipePasteActions"><button class="secondary" id="recipePasteCancel">Cancel</button><button class="recipePasteMini" id="recipeCopyPrompt">Copy ChatGPT prompt</button><button class="primary" id="recipePasteImport">Import & check</button></div></div>`;document.body.appendChild(box);
    const close=()=>box.remove(),status=box.querySelector('#recipePasteStatus');box.querySelector('.recipePasteClose').onclick=close;box.querySelector('#recipePasteCancel').onclick=close;box.onclick=e=>{if(e.target===box)close()};box.querySelector('#recipeCopyPrompt').onclick=()=>copyPrompt(status);
    box.querySelector('#recipePasteImport').onclick=()=>{
      const text=box.querySelector('#recipePasteText').value.trim();if(!text){status.textContent='Paste a recipe first.';return}
      const parsed=parseRecipe(text);if(!parsed.ingredients.length){status.textContent='I could not find ingredient quantities. Try one ingredient per line, for example “500 g chicken breast”.';return}
      close();if(!fillBuilder(parsed))alert('Could not open the recipe calculator. Close and reopen Elsewhere, then try again.');
    };
  }

  injectStyles();addPasteButton();
  const cook=$p('#cook');if(cook)new MutationObserver(addPasteButton).observe(cook,{childList:true,subtree:true});
  window.elsewhereRecipePaste={parse:parseRecipe,open:openPaste};
})();