(() => {
  const MASTER_SOURCE='./illustrations/fashion/aw-master-sprite-b64.txt?v=20260817-master-fix';
  const FINAL_SOURCE='./illustrations/fashion/aw-final-five.webp?v=20260817-final5-fix';
  const MASTER_COLS=6, MASTER_ROWS=6;
  const MASTER_ORDER=[
    'tee-white','tee-cream','breton','tee-olive','tee-blue','tee-navy',
    'cream-cable','oatmeal-lambswool','navy-merino','blue-knit','olive-cardigan','cream-halfzip',
    'white-oxford','blue-oxford','stripe-oxford','chambray-shirt','cream-tee','dark-straight-jeans',
    'mid-straight-jeans','wide-jeans','olive-cords','wool-trousers','chinos','wool-midi',
    'ariat-wellies','barbour-short-wellies','tan-chelsea-boots','knee-boots','leather-belt','everyday-bag',
    'wool-scarf','silk-scarf','stone-trench','wool-coat'
  ];
  const MASTER_POS=Object.fromEntries(MASTER_ORDER.map((key,i)=>[key,[i%MASTER_COLS,Math.floor(i/MASTER_COLS)]]));
  const FINAL_POS={
    'barbour-wax':[0,0],
    'olive-barn':[1,0],
    'tweed-blazer':[2,0],
    'heeled-chelsea-boots':[0,1],
    'loafers':[1,1]
  };
  const TEE_MAP={
    'tee-white':'tee-white',
    'tee-cream':'tee-cream',
    'tee-breton':'breton',
    'tee-olive':'tee-olive',
    'tee-blue':'tee-blue',
    'tee-navy':'tee-navy'
  };
  let masterUrl='';
  let finalUrl='';

  function injectStyles(){
    if(document.querySelector('#aw-image-repair-styles'))return;
    const style=document.createElement('style');
    style.id='aw-image-repair-styles';
    style.textContent=`
      .awFinalFiveArt{display:block;width:62px;height:62px;flex:0 0 62px;border-radius:14px;border:1px solid rgba(92,82,69,.08);background-repeat:no-repeat;background-size:300% 200%;background-color:#faf6ef;box-shadow:0 3px 9px rgba(67,57,45,.045)}
      @media(max-width:480px){.awFinalFiveArt{width:56px;height:56px;flex-basis:56px}}
    `;
    document.head.appendChild(style);
  }

  function base64WebpToUrl(text){
    const clean=text.replace(/\s+/g,'');
    const binary=atob(clean);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  }

  function paintMasterElement(el,key){
    if(!masterUrl||!MASTER_POS[key])return;
    const [x,y]=MASTER_POS[key];
    el.style.backgroundImage=`url("${masterUrl}")`;
    el.style.backgroundRepeat='no-repeat';
    el.style.backgroundSize='600% 600%';
    el.style.backgroundPosition=`${x/(MASTER_COLS-1)*100}% ${y/(MASTER_ROWS-1)*100}%`;
  }

  function applyMaster(){
    if(!masterUrl)return;
    document.querySelectorAll('[data-aw-art]').forEach(el=>paintMasterElement(el,el.dataset.awArt));
    document.querySelectorAll('[data-core-tee]').forEach(input=>{
      const key=TEE_MAP[input.dataset.coreTee];
      if(!key)return;
      const visual=input.closest('.fashionCoreTee')?.querySelector('.fashionCoreTeeVisual');
      if(!visual)return;
      let art=visual.querySelector('.awCoreTeeArt');
      if(!art){
        visual.innerHTML='';
        art=document.createElement('span');
        art.className='awCoreTeeArt';
        visual.appendChild(art);
      }
      paintMasterElement(art,key);
    });
  }

  function applyFinalFive(){
    if(!finalUrl)return;
    document.querySelectorAll('[data-aw-master-item]').forEach(input=>{
      const key=input.dataset.awMasterItem;
      const p=FINAL_POS[key];
      if(!p)return;
      const row=input.closest('.fashionCheck');
      if(!row)return;
      let art=row.querySelector('.awFinalFiveArt');
      if(!art){
        art=document.createElement('span');
        art.className='awFinalFiveArt';
        art.setAttribute('aria-hidden','true');
        const fake=row.querySelector('.fashionFakeCheck');
        row.insertBefore(art,fake||row.firstChild);
      }
      art.style.backgroundImage=`url("${finalUrl}")`;
      art.style.backgroundRepeat='no-repeat';
      art.style.backgroundSize='300% 200%';
      art.style.backgroundPosition=`${p[0]/2*100}% ${p[1]*100}%`;
    });
  }

  function apply(){
    injectStyles();
    if(localStorage.getItem('elsewhere_fashion_season_v1')==='ss')return;
    if((localStorage.getItem('elsewhere_fashion_tab_v1')||'capsule')!=='capsule')return;
    applyMaster();
    applyFinalFive();
  }

  async function loadMaster(){
    try{
      const r=await fetch(MASTER_SOURCE,{cache:'no-cache'});
      if(!r.ok)throw new Error(`Master illustrations ${r.status}`);
      masterUrl=base64WebpToUrl(await r.text());
      apply();
    }catch(e){console.warn('Could not repair Autumn/Winter master illustrations',e)}
  }

  async function loadFinalFive(){
    try{
      const r=await fetch(FINAL_SOURCE,{cache:'no-cache'});
      if(!r.ok)throw new Error(`Final illustrations ${r.status}`);
      finalUrl=URL.createObjectURL(await r.blob());
      apply();
    }catch(e){console.warn('Could not load final Autumn/Winter illustrations',e)}
  }

  let pending=false;
  function sync(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;apply()});
  }

  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))setTimeout(apply,100);
  },true);
  window.addEventListener('pageshow',apply);

  injectStyles();
  loadMaster();
  loadFinalFive();
  apply();
})();