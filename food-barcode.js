(() => {
  const CACHE_KEY='elsewhere_food_barcode_cache_v1';
  const OFF_BASE='https://world.openfoodfacts.org/api/v2/product/';
  const MEALS=[['breakfast','Breakfast'],['lunch','Lunch'],['dinner','Dinner'],['snack','Snacks'],['drink','Drinks']];
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const round=v=>Math.round(num(v));
  let stream=null, raf=0, scanBusy=false, scanLocked=false, lastScanAt=0;

  function currentMeal(){
    const h=new Date().getHours();
    return h<11?'breakfast':h<15?'lunch':h<21?'dinner':'snack';
  }
  function stopCamera(){
    if(raf)cancelAnimationFrame(raf);raf=0;
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
    scanBusy=false;scanLocked=false;lastScanAt=0;
  }
  function closeBarcodeModal(){stopCamera();$('#foodBarcodeModal')?.remove()}

  function readCache(){
    try{const x=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}
  }
  function cacheFacts(code,facts){
    const c=readCache();
    c[code]={...facts,cachedAt:Date.now()};
    const keys=Object.keys(c).sort((a,b)=>(c[b].cachedAt||0)-(c[a].cachedAt||0)).slice(0,80);
    const trimmed={};keys.forEach(k=>trimmed[k]=c[k]);
    try{localStorage.setItem(CACHE_KEY,JSON.stringify(trimmed))}catch{}
  }

  function injectStyles(){
    if($('#foodBarcodeStyles'))return;
    const style=document.createElement('style');
    style.id='foodBarcodeStyles';
    style.textContent=`
      .foodBarcodeAction b svg{width:22px;height:22px;display:block}
      .foodScannerViewport{position:relative;aspect-ratio:4/3;background:#182019;border-radius:18px;overflow:hidden;margin:14px 0 10px}
      .foodScannerViewport video{width:100%;height:100%;object-fit:cover;display:block}
      .foodScannerGuide{position:absolute;left:9%;right:9%;top:29%;height:38%;border:2px solid rgba(255,255,255,.92);border-radius:16px;box-shadow:0 0 0 999px rgba(0,0,0,.22);pointer-events:none}
      .foodScannerGuide:before{content:"";position:absolute;left:7%;right:7%;top:50%;height:2px;background:rgba(225,244,227,.78);box-shadow:0 0 9px rgba(225,244,227,.7)}
      .foodScannerStatus{min-height:20px;margin:8px 2px 12px;color:#667269;font-size:.8rem;line-height:1.45}
      .foodScannerStatus[data-kind="error"]{color:#8b4a42}.foodScannerStatus[data-kind="working"]{color:#58685c;font-weight:700}
      .foodBarcodeManual{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-top:9px}
      .foodBarcodeManual label{margin:0}.foodBarcodeLookup{height:45px;border:0;background:#eef2e9;color:#344b3c;border-radius:13px;padding:0 14px;font-weight:800}
      .foodBarcodeProduct{background:#f2f0e8;border:1px solid #e0e2dc;border-radius:17px;padding:14px;margin:12px 0}
      .foodBarcodeProduct strong{display:block;font-size:1rem}.foodBarcodeProduct small{display:block;color:#748078;margin-top:3px;line-height:1.4}
      .foodBarcodeCalc{display:flex;justify-content:space-between;gap:12px;align-items:baseline;background:#eef2e9;border-radius:14px;padding:12px 13px;margin:12px 0}
      .foodBarcodeCalc strong{font-family:Georgia,serif;font-weight:400;font-size:1.45rem}.foodBarcodeCalc span{font-size:.76rem;color:#6f7972;text-align:right}
      .foodBarcodeAttribution{font-size:.68rem;color:#879087;line-height:1.35;margin:12px 2px 0}.foodBarcodeAttribution a{color:inherit}
      @media(max-width:390px){.foodBarcodeManual{grid-template-columns:1fr}.foodBarcodeLookup{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function barcodeIcon(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5v14M7 5v14M10 5v14M14 5v14M16.5 5v14M20 5v14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M3 4h4M3 4v4M21 4h-4M21 4v4M3 20h4M3 20v-4M21 20h-4M21 20v-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  }

  function ensureButton(){
    const grid=$('.foodActionGrid');
    if(!grid||$('#foodBarcodeScan'))return;
    const button=document.createElement('button');
    button.className='foodAction foodBarcodeAction';
    button.id='foodBarcodeScan';
    button.innerHTML=`<b>${barcodeIcon()}</b><span><strong>Scan barcode</strong><small>Packaged food on the go</small></span>`;
    const quick=$('#foodQuickAdd');
    quick?.insertAdjacentElement('afterend',button);
    if(!quick)grid.prepend(button);
    button.addEventListener('click',openScanner);
  }

  function scannerMarkup(){
    const box=document.createElement('div');
    box.id='foodBarcodeModal';box.className='foodModal';
    box.innerHTML=`<div class="foodModalCard">
      <button class="foodModalClose" aria-label="Close">×</button>
      <p class="eyebrow">SCAN A BARCODE</p><h2>Point at the barcode</h2>
      <p class="muted">Hold the packet steady inside the frame. If the camera cannot read it, type the barcode number below.</p>
      <div class="foodScannerViewport" id="foodScannerViewport"><video id="foodBarcodeVideo" playsinline muted></video><span class="foodScannerGuide"></span></div>
      <p class="foodScannerStatus" id="foodScannerStatus">Starting the camera…</p>
      <div class="foodBarcodeManual"><label class="foodField"><span>Barcode number</span><input id="foodBarcodeManualInput" inputmode="numeric" autocomplete="off" placeholder="e.g. 5012345678900"></label><button class="foodBarcodeLookup" id="foodBarcodeLookup" type="button">Look up</button></div>
      <p class="foodBarcodeAttribution">Product information comes from <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">Open Food Facts</a>. Always check the pack if a value looks wrong.</p>
    </div>`;
    document.body.appendChild(box);
    box.querySelector('.foodModalClose').onclick=closeBarcodeModal;
    box.onclick=e=>{if(e.target===box)closeBarcodeModal()};
    box.querySelector('#foodBarcodeLookup').onclick=()=>{
      const code=normaliseCode(box.querySelector('#foodBarcodeManualInput').value);
      if(!code){setScannerStatus('Enter the numbers printed under the barcode.','error');return}
      stopCamera();lookupBarcode(code);
    };
    box.querySelector('#foodBarcodeManualInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();box.querySelector('#foodBarcodeLookup').click()}});
    return box;
  }

  function setScannerStatus(text,kind=''){
    const el=$('#foodScannerStatus');if(!el)return;el.textContent=text;el.dataset.kind=kind;
  }
  function normaliseCode(value){return String(value||'').replace(/\D/g,'').slice(0,18)}

  async function openScanner(){
    closeBarcodeModal();injectStyles();scannerMarkup();
    if(!navigator.mediaDevices?.getUserMedia){setScannerStatus('Camera scanning is not available here. Type the barcode number below.','error');return}
    if(!('BarcodeDetector' in window)){setScannerStatus('This browser cannot read barcodes from the live camera yet. Type the barcode number below.','error');return}
    try{
      let formats=['ean_13','ean_8','upc_a','upc_e'];
      if(typeof BarcodeDetector.getSupportedFormats==='function'){
        const supported=await BarcodeDetector.getSupportedFormats();
        formats=formats.filter(f=>supported.includes(f));
      }
      const detector=formats.length?new BarcodeDetector({formats}):new BarcodeDetector();
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
      const video=$('#foodBarcodeVideo');if(!video){stopCamera();return}
      video.srcObject=stream;await video.play();
      setScannerStatus('Looking for a barcode…','working');
      scanLocked=false;
      const loop=async now=>{
        if(!stream||scanLocked)return;
        if(video.readyState>=2&&!scanBusy&&now-lastScanAt>320){
          scanBusy=true;lastScanAt=now;
          try{
            const found=await detector.detect(video);
            const code=normaliseCode(found?.[0]?.rawValue);
            if(code){
              scanLocked=true;setScannerStatus(`Barcode ${code} found. Looking up the food…`,'working');
              stopCamera();await lookupBarcode(code);return;
            }
          }catch(e){console.warn('Barcode scan frame failed',e)}finally{scanBusy=false}
        }
        raf=requestAnimationFrame(loop);
      };
      raf=requestAnimationFrame(loop);
    }catch(e){
      console.warn('Could not start barcode camera',e);
      const denied=e?.name==='NotAllowedError'||e?.name==='SecurityError';
      setScannerStatus(denied?'Camera permission is off. You can type the barcode number below.':'I could not start the camera. Type the barcode number below instead.','error');
    }
  }

  function servingFrom(product,nutriments){
    const kcalServing=num(nutriments['energy-kcal_serving']);
    const kcal100=num(nutriments['energy-kcal_100g']);
    let quantity=num(product.serving_quantity);
    let unit=String(product.serving_quantity_unit||'').trim();
    if(!quantity&&product.serving_size){
      const m=String(product.serving_size).match(/([0-9]+(?:\.[0-9]+)?)\s*(g|ml)\b/i);
      if(m){quantity=num(m[1]);unit=m[2].toLowerCase()}
    }
    if(kcalServing>0)return {mode:'serving',kcalPerUnit:kcalServing,amount:1,amountLabel:'Servings eaten',step:.25,detail:product.serving_size?`${round(kcalServing)} kcal per serving · ${product.serving_size}`:`${round(kcalServing)} kcal per serving`};
    if(kcal100>0&&quantity>0)return {mode:'serving',kcalPerUnit:kcal100*quantity/100,amount:1,amountLabel:'Servings eaten',step:.25,detail:`About ${round(kcal100*quantity/100)} kcal per ${product.serving_size||`${quantity}${unit||'g/ml'}`} · ${round(kcal100)} kcal per 100g/ml`};
    if(kcal100>0)return {mode:'amount',kcalPer100:kcal100,amount:100,amountLabel:'Amount eaten / drunk (g or ml)',step:1,detail:`${round(kcal100)} kcal per 100g/ml`};
    return null;
  }

  function factsFromProduct(code,product){
    const nutriments=product.nutriments||{};
    const name=product.product_name||product.product_name_en||product.generic_name||`Barcode ${code}`;
    const brand=String(product.brands||'').split(',')[0].trim();
    const serving=servingFrom(product,nutriments);
    return {code,name,brand,quantity:product.quantity||'',serving};
  }

  async function lookupBarcode(code){
    code=normaliseCode(code);if(!code)return;
    setScannerStatus(`Looking up ${code}…`,'working');
    const cached=readCache()[code];
    try{
      const fields='code,product_name,product_name_en,generic_name,brands,quantity,serving_size,serving_quantity,serving_quantity_unit,nutriments';
      const r=await fetch(`${OFF_BASE}${encodeURIComponent(code)}.json?fields=${encodeURIComponent(fields)}`,{headers:{Accept:'application/json'},cache:'no-store'});
      if(!r.ok)throw new Error(`Open Food Facts ${r.status}`);
      const data=await r.json();
      if(Number(data.status)===1&&data.product){
        const facts=factsFromProduct(code,data.product);cacheFacts(code,facts);closeBarcodeModal();openProduct(facts);return;
      }
      closeBarcodeModal();openManualResult(code,null,'That barcode is not in Open Food Facts yet. Enter the calories from the pack and Elsewhere can still log it.');
    }catch(e){
      console.warn('Barcode lookup failed',e);
      if(cached){closeBarcodeModal();openProduct(cached,true);return}
      closeBarcodeModal();openManualResult(code,null,'I could not reach the product database. Enter the pack calories manually and you can still add it.');
    }
  }

  function modalShell({eyebrow,title,intro='',inner='',saveLabel='Add to today'}){
    const old=$('#foodBarcodeModal');if(old)old.remove();
    const box=document.createElement('div');box.id='foodBarcodeModal';box.className='foodModal';
    box.innerHTML=`<div class="foodModalCard"><button class="foodModalClose" aria-label="Close">×</button><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${intro?`<p class="muted">${esc(intro)}</p>`:''}${inner}<p class="foodBarcodeAttribution">Product information comes from <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">Open Food Facts</a>. Nutrition databases can contain errors, so check the pack if something looks wrong.</p><div class="foodModalActions"><button class="secondary" data-barcode-cancel>Cancel</button><button class="primary" data-barcode-save>${esc(saveLabel)}</button></div></div>`;
    document.body.appendChild(box);
    const close=()=>{stopCamera();box.remove()};
    box.querySelector('.foodModalClose').onclick=close;box.querySelector('[data-barcode-cancel]').onclick=close;box.onclick=e=>{if(e.target===box)close()};
    return {box,close};
  }

  function mealOptions(){return MEALS.map(([v,l])=>`<option value="${v}" ${v===currentMeal()?'selected':''}>${l}</option>`).join('')}

  function openProduct(facts,fromCache=false){
    if(!facts?.serving){openManualResult(facts?.code||'',facts,'I found the product, but not reliable calorie information. Check the pack and enter the calories for what you ate.');return}
    const s=facts.serving;
    const amount=Number(s.amount)||1;
    const initial=s.mode==='serving'?round(s.kcalPerUnit*amount):round(s.kcalPer100*amount/100);
    const subtitle=[facts.brand,facts.quantity].filter(Boolean).join(' · ');
    const {box,close}=modalShell({
      eyebrow:'BARCODE FOUND',title:'Add this food',intro:fromCache?'Using the last product details saved on this phone.':'Check the portion, then add it straight to today.',
      inner:`<div class="foodBarcodeProduct"><strong>${esc(facts.name)}</strong>${subtitle?`<small>${esc(subtitle)}</small>`:''}<small>${esc(s.detail||'')}</small></div>
        <label class="foodField"><span>Food name</span><input id="foodBarcodeName" value="${esc(facts.name)}"></label>
        <label class="foodField"><span>${esc(s.amountLabel)}</span><input id="foodBarcodeAmount" type="number" inputmode="decimal" min="0.01" step="${s.step||1}" value="${amount}"></label>
        <label class="foodField"><span>Calories to add</span><input id="foodBarcodeCalories" type="number" inputmode="numeric" min="1" value="${initial}"></label>
        <label class="foodField"><span>Add to</span><select id="foodBarcodeMeal">${mealOptions()}</select></label>
        <div class="foodBarcodeCalc"><strong id="foodBarcodeLiveKcal">${initial} kcal</strong><span>Editable if the pack says something different</span></div>`
    });
    const amountEl=box.querySelector('#foodBarcodeAmount'),calEl=box.querySelector('#foodBarcodeCalories'),live=box.querySelector('#foodBarcodeLiveKcal');
    let manual=false;
    const calculate=()=>{
      const a=num(amountEl.value);const c=s.mode==='serving'?round(s.kcalPerUnit*a):round(s.kcalPer100*a/100);
      if(!manual&&c>0)calEl.value=c;live.textContent=`${round(calEl.value)} kcal`;
    };
    amountEl.addEventListener('input',calculate);
    calEl.addEventListener('input',()=>{manual=true;live.textContent=`${round(calEl.value)} kcal`});
    box.querySelector('[data-barcode-save]').onclick=()=>{
      const name=box.querySelector('#foodBarcodeName').value.trim(),cal=round(calEl.value),meal=box.querySelector('#foodBarcodeMeal').value;
      if(!name||cal<=0)return;
      close();window.elsewhereFood?.add?.({name,calories:cal,mealType:meal,source:'barcode'});
    };
  }

  function openManualResult(code,facts,message){
    const name=facts?.name||'';const subtitle=[facts?.brand,facts?.quantity].filter(Boolean).join(' · ');
    const {box,close}=modalShell({eyebrow:'BARCODE',title:name||'Add this food',intro:message,inner:`${name?`<div class="foodBarcodeProduct"><strong>${esc(name)}</strong>${subtitle?`<small>${esc(subtitle)}</small>`:''}</div>`:''}<label class="foodField"><span>Food name</span><input id="foodBarcodeName" value="${esc(name)}" placeholder="e.g. protein yoghurt"></label><label class="foodField"><span>Calories for what you ate</span><input id="foodBarcodeCalories" type="number" inputmode="numeric" min="1" placeholder="Check the pack"></label><label class="foodField"><span>Add to</span><select id="foodBarcodeMeal">${mealOptions()}</select></label><p class="foodFieldHint">Barcode ${esc(code)}</p>`});
    box.querySelector('[data-barcode-save]').onclick=()=>{
      const n=box.querySelector('#foodBarcodeName').value.trim(),c=round(box.querySelector('#foodBarcodeCalories').value),meal=box.querySelector('#foodBarcodeMeal').value;
      if(!n||c<=0)return;close();window.elsewhereFood?.add?.({name:n,calories:c,mealType:meal,source:'barcode-manual'});
    };
  }

  function boot(){
    injectStyles();ensureButton();
    const observer=new MutationObserver(()=>requestAnimationFrame(ensureButton));
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('click',e=>{if(e.target.closest?.('[data-go="cook"],.homeFood'))setTimeout(ensureButton,80)},true);
    window.addEventListener('pageshow',ensureButton);
  }

  if(window.elsewhereFood)boot();
  else{
    let tries=0;const wait=setInterval(()=>{if(window.elsewhereFood||tries++>100){clearInterval(wait);if(window.elsewhereFood)boot()}},50);
  }
})();