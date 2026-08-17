(() => {
  const CHUNKS=[
    {src:'./illustrations/fashion/aw-sprite-1-b64.txt?v=20260817-c1',cols:3,rows:3,order:['tee-white','tee-cream','breton','tee-olive','tee-blue','tee-navy','cream-cable','oatmeal-lambswool','navy-merino']},
    {src:'./illustrations/fashion/aw-sprite-2-b64.txt?v=20260817-c2',cols:3,rows:3,order:['blue-knit','olive-cardigan','cream-halfzip','white-oxford','blue-oxford','stripe-oxford','chambray-shirt','cream-tee','dark-straight-jeans']},
    {src:'./illustrations/fashion/aw-sprite-3-b64.txt?v=20260817-c3',cols:3,rows:3,order:['mid-straight-jeans','wide-jeans','olive-cords','wool-trousers','chinos','wool-midi','ariat-wellies','barbour-short-wellies']},
    {src:'./illustrations/fashion/aw-sprite-4a-b64.txt?v=20260817-c4a',cols:2,rows:2,order:['tan-chelsea-boots','knee-boots','leather-belt','everyday-bag']},
    {src:'./illustrations/fashion/aw-sprite-4b-b64.txt?v=20260817-c4b',cols:2,rows:2,order:['wool-scarf','silk-scarf','stone-trench','wool-coat']}
  ];
  const FINAL_SOURCE='./illustrations/fashion/aw-final-five-small-b64.txt?v=20260817-final5-safe';
  const FINAL_POS={'barbour-wax':[0,0],'olive-barn':[1,0],'tweed-blazer':[2,0],'heeled-chelsea-boots':[0,1],'loafers':[1,1]};
  const TEE_MAP={'tee-white':'tee-white','tee-cream':'tee-cream','tee-breton':'breton','tee-olive':'tee-olive','tee-blue':'tee-blue','tee-navy':'tee-navy'};
  const assets=new Map();
  let finalUrl='',started=false,panelObserver=null,observedPanel=null;

  function injectStyles(){
    if(document.querySelector('#aw-image-stable-styles'))return;
    const style=document.createElement('style');
    style.id='aw-image-stable-styles';
    style.textContent=`
      .awMasterArt,.awCoreTeeArt,.awFinalFiveArt{position:relative;overflow:hidden}
      .awMasterArt,.awCoreTeeArt{background-image:none!important}
      .awStableLayer{position:absolute;inset:0;display:block;background-repeat:no-repeat;background-color:#faf6ef;pointer-events:none;z-index:2}
      .awFinalFiveArt{display:block;width:62px;height:62px;flex:0 0 62px;border-radius:14px;border:1px solid rgba(92,82,69,.08);background-image:none!important;background-color:#faf6ef;box-shadow:0 3px 9px rgba(67,57,45,.045)}
      @media(max-width:480px){.awFinalFiveArt{width:56px;height:56px;flex-basis:56px}}
    `;
    document.head.appendChild(style);
  }

  function base64WebpToUrl(text){
    const clean=text.replace(/\s+/g,''),binary=atob(clean),bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  }

  function layerFor(parent){
    let layer=parent.querySelector(':scope > .awStableLayer');
    if(!layer){
      layer=document.createElement('span');
      layer.className='awStableLayer';
      layer.setAttribute('aria-hidden','true');
      parent.appendChild(layer);
    }
    return layer;
  }

  function paint(parent,key){
    const a=assets.get(key);if(!a)return;
    const x=a.index%a.cols,y=Math.floor(a.index/a.cols),layer=layerFor(parent);
    layer.style.backgroundImage=`url("${a.url}")`;
    layer.style.backgroundSize=`${a.cols*100}% ${a.rows*100}%`;
    layer.style.backgroundPosition=`${a.cols===1?0:x/(a.cols-1)*100}% ${a.rows===1?0:y/(a.rows-1)*100}%`;
  }

  function applyMaster(){
    document.querySelectorAll('[data-aw-art]').forEach(el=>paint(el,el.dataset.awArt));
    document.querySelectorAll('[data-core-tee]').forEach(input=>{
      const key=TEE_MAP[input.dataset.coreTee];if(!key||!assets.has(key))return;
      const visual=input.closest('.fashionCoreTee')?.querySelector('.fashionCoreTeeVisual');if(!visual)return;
      let art=visual.querySelector('.awCoreTeeArt');
      if(!art){visual.innerHTML='';art=document.createElement('span');art.className='awCoreTeeArt';visual.appendChild(art)}
      paint(art,key);
    });
  }

  function applyFinalFive(){
    if(!finalUrl)return;
    document.querySelectorAll('[data-aw-master-item]').forEach(input=>{
      const key=input.dataset.awMasterItem,p=FINAL_POS[key];if(!p)return;
      const row=input.closest('.fashionCheck');if(!row)return;
      let art=row.querySelector('.awFinalFiveArt');
      if(!art){
        art=document.createElement('span');art.className='awFinalFiveArt';art.setAttribute('aria-hidden','true');
        const fake=row.querySelector('.fashionFakeCheck');row.insertBefore(art,fake||row.firstChild);
      }
      const layer=layerFor(art);
      layer.style.backgroundImage=`url("${finalUrl}")`;
      layer.style.backgroundSize='300% 200%';
      layer.style.backgroundPosition=`${p[0]/2*100}% ${p[1]*100}%`;
    });
  }

  function isAutumnWinterCapsule(){
    return localStorage.getItem('elsewhere_fashion_season_v1')!=='ss' && (localStorage.getItem('elsewhere_fashion_tab_v1')||'capsule')==='capsule';
  }

  function apply(){
    injectStyles();
    if(!isAutumnWinterCapsule())return;
    applyMaster();
    applyFinalFive();
    attachPanelObserver();
  }

  async function loadChunk(chunk){
    const r=await fetch(chunk.src,{cache:'no-cache'});if(!r.ok)throw new Error(`${chunk.src} ${r.status}`);
    const url=base64WebpToUrl(await r.text());
    chunk.order.forEach((key,index)=>assets.set(key,{url,index,cols:chunk.cols,rows:chunk.rows}));
  }

  async function loadAllChunks(){
    const results=await Promise.allSettled(CHUNKS.map(loadChunk));
    results.filter(x=>x.status==='rejected').forEach(x=>console.warn('Could not load wardrobe illustration chunk',x.reason));
    apply();
  }

  async function loadFinalFive(){
    try{
      const r=await fetch(FINAL_SOURCE,{cache:'no-cache'});if(!r.ok)throw new Error(`Final illustrations ${r.status}`);
      finalUrl=base64WebpToUrl(await r.text());apply();
    }catch(e){console.warn('Could not load final Autumn/Winter illustrations',e)}
  }

  let pending=false;
  function sync(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;apply()});
  }

  function attachPanelObserver(){
    const panel=document.querySelector('#fashionPanel');
    if(!panel||panel===observedPanel)return;
    if(panelObserver)panelObserver.disconnect();
    observedPanel=panel;
    panelObserver=new MutationObserver(records=>{
      if(records.some(r=>r.addedNodes.length||r.removedNodes.length))sync();
    });
    panelObserver.observe(panel,{childList:true,subtree:true});
  }

  function start(attempt=0){
    if(started)return;
    if(!document.querySelector('#aw-master-styles')&&attempt<80){setTimeout(()=>start(attempt+1),50);return}
    started=true;
    injectStyles();
    attachPanelObserver();
    document.addEventListener('click',e=>{
      if(e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))setTimeout(()=>{attachPanelObserver();apply()},100);
    },true);
    window.addEventListener('pageshow',apply);
    loadAllChunks();
    loadFinalFive();
    apply();
  }

  start();
})();