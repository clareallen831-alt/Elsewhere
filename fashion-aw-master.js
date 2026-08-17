(() => {
  const SEASON_KEY='elsewhere_fashion_season_v1';
  const TAB_KEY='elsewhere_fashion_tab_v1';
  const STORAGE_KEY='elsewhere_fashion_capsule_v1';
  const MIGRATION_KEY='elsewhere_fashion_aw_master_20260817';
  const SPRITE_SOURCE='./illustrations/fashion/aw-master-sprite-b64.txt?v=20260817-master';
  const COLS=6, ROWS=6;
  let sprite='';

  const items=[
    {group:'Outerwear',id:'barbour-wax',name:'Navy Barbour wax jacket',colour:'Navy',status:'own'},
    {group:'Outerwear',id:'olive-barn',name:'Olive barn jacket',colour:'Olive',status:'own'},
    {group:'Outerwear',id:'tweed-blazer',name:'Relaxed Harris Tweed or herringbone blazer',colour:'Brown / olive / oatmeal',status:'invest'},
    {group:'Outerwear',id:'wool-coat',name:'Long wool coat',colour:'Olive / brown',status:'own',art:'wool-coat'},

    {group:'Knitwear',id:'cream-cable',name:'Chunky cable or fisherman jumper',colour:'Cream',status:'own',art:'cream-cable'},
    {group:'Knitwear',id:'oatmeal-lambswool',name:'Lambswool crew-neck jumper',colour:'Oatmeal',status:'own',art:'oatmeal-lambswool'},
    {group:'Knitwear',id:'navy-merino',name:'Fine merino wool crew-neck jumper',colour:'Navy',status:'start',art:'navy-merino'},
    {group:'Knitwear',id:'blue-knit',name:'Soft merino or cashmere knit',colour:'Powder blue',status:'later',art:'blue-knit'},
    {group:'Knitwear',id:'olive-cardigan',name:'Relaxed ribbed cardigan',colour:'Olive / khaki',status:'later',art:'olive-cardigan'},
    {group:'Knitwear',id:'cream-halfzip',name:'Knitted polo or half zip',colour:'Cream / warm stone',status:'later',art:'cream-halfzip'},

    {group:'Shirts, tops & layers',id:'white-oxford',name:'Relaxed Oxford shirt',colour:'White',status:'start',art:'white-oxford'},
    {group:'Shirts, tops & layers',id:'blue-oxford',name:'Oxford shirt',colour:'Pale blue',status:'start',art:'blue-oxford'},
    {group:'Shirts, tops & layers',id:'stripe-oxford',name:'Striped Oxford or poplin shirt',colour:'Blue / white',status:'start',art:'stripe-oxford'},
    {group:'Shirts, tops & layers',id:'chambray-shirt',name:'Chambray shirt',colour:'Washed blue',status:'own',art:'chambray-shirt'},
    {group:'Shirts, tops & layers',id:'breton',name:'Breton long-sleeve top',colour:'Cream / navy',status:'own',art:'breton'},
    {group:'Shirts, tops & layers',id:'cream-tee',name:'Heavyweight T-shirt',colour:'Cream',status:'later',art:'cream-tee'},

    {group:'Bottoms',id:'dark-straight-jeans',name:'Straight-leg jeans',colour:'Dark indigo',status:'own',art:'dark-straight-jeans'},
    {group:'Bottoms',id:'mid-straight-jeans',name:'Relaxed straight-leg jeans',colour:'Mid blue',status:'own',art:'mid-straight-jeans'},
    {group:'Bottoms',id:'wide-jeans',name:'Wide-leg jeans',colour:'Dark indigo',status:'later',art:'wide-jeans'},
    {group:'Bottoms',id:'olive-cords',name:'Cord trousers',colour:'Olive',status:'start',art:'olive-cords'},
    {group:'Bottoms',id:'wool-trousers',name:'Tailored wool trousers',colour:'Chocolate / taupe',status:'invest',art:'wool-trousers'},
    {group:'Bottoms',id:'chinos',name:'Chinos',colour:'Stone / khaki',status:'later',art:'chinos'},
    {group:'Bottoms',id:'wool-midi',name:'Wool midi skirt',colour:'Oatmeal / taupe / Black Watch',status:'later',art:'wool-midi'},

    {group:'Shoes',id:'ariat-wellies',name:'Ariat wellies',colour:'Owned',status:'own',art:'ariat-wellies'},
    {group:'Shoes',id:'barbour-short-wellies',name:'Barbour short wellies',colour:'Owned',status:'own',art:'barbour-short-wellies'},
    {group:'Shoes',id:'tan-chelsea-boots',name:'Leather or suede Chelsea boots',colour:'Tan',status:'own',art:'tan-chelsea-boots'},
    {group:'Shoes',id:'heeled-chelsea-boots',name:'Leather Chelsea boots with small heel',colour:'Brown',status:'later'},
    {group:'Shoes',id:'loafers',name:'Leather penny or saddle loafers',colour:'Tan / chocolate',status:'start'},
    {group:'Shoes',id:'knee-boots',name:'Knee-high leather boots',colour:'Chocolate',status:'invest',art:'knee-boots'},

    {group:'Accessories',id:'leather-belt',name:'Simple leather belt',colour:'Brown',status:'own',art:'leather-belt'},
    {group:'Accessories',id:'everyday-bag',name:'Leather or suede everyday bag',colour:'Tan / chocolate',status:'own',art:'everyday-bag'},
    {group:'Accessories',id:'wool-scarf',name:'Wool or cashmere scarf',colour:'Tartan',status:'own',art:'wool-scarf'},
    {group:'Accessories',id:'silk-scarf',name:'Silk square scarf',colour:'Navy / cream or khaki',status:'later',art:'silk-scarf'}
  ];

  const defaultOwned=items.filter(x=>x.status==='own').map(x=>x.id);
  const artOrder=[
    'tee-white','tee-cream','breton','tee-olive','tee-blue','tee-navy',
    'cream-cable','oatmeal-lambswool','navy-merino','blue-knit','olive-cardigan','cream-halfzip',
    'white-oxford','blue-oxford','stripe-oxford','chambray-shirt','cream-tee','dark-straight-jeans',
    'mid-straight-jeans','wide-jeans','olive-cords','wool-trousers','chinos','wool-midi',
    'ariat-wellies','barbour-short-wellies','tan-chelsea-boots','knee-boots','leather-belt','everyday-bag',
    'wool-scarf','silk-scarf','stone-trench','wool-coat'
  ];
  const artPos=Object.fromEntries(artOrder.map((k,i)=>[k,[i%COLS,Math.floor(i/COLS)]]));

  function currentSeason(){return localStorage.getItem(SEASON_KEY)==='ss'?'ss':'aw'}
  function currentTab(){return localStorage.getItem(TAB_KEY)||'capsule'}
  function getOwned(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      const ids=raw?JSON.parse(raw):[];
      return Array.isArray(ids)?ids:[];
    }catch{return []}
  }
  function setOwned(ids){localStorage.setItem(STORAGE_KEY,JSON.stringify(ids))}
  function migrate(){
    if(localStorage.getItem(MIGRATION_KEY))return;
    const valid=new Set(items.map(x=>x.id));
    const old=new Set(getOwned().filter(id=>valid.has(id)));
    defaultOwned.forEach(id=>old.add(id));
    setOwned([...old]);
    localStorage.setItem(MIGRATION_KEY,'1');
  }

  function statusTag(item){
    if(item.status==='own')return '<span class="fashionTag own">Already own</span>';
    if(item.status==='invest')return '<span class="fashionTag invest">Invest</span>';
    if(item.status==='start')return '<span class="fashionTag start">Start here</span>';
    return '<span class="fashionTag later">Later</span>';
  }
  function artStyle(key){
    if(!sprite||!artPos[key])return '';
    const [x,y]=artPos[key];
    const xp=x/(COLS-1)*100, yp=y/(ROWS-1)*100;
    return `background-image:url("${sprite}");background-position:${xp}% ${yp}%;`;
  }
  function artHTML(item){
    if(!item.art||!artPos[item.art])return '';
    return `<span class="awMasterArt" data-aw-art="${item.art}" style="${artStyle(item.art)}" aria-hidden="true"></span>`;
  }

  function injectStyles(){
    if(document.querySelector('#aw-master-styles'))return;
    const style=document.createElement('style');
    style.id='aw-master-styles';
    style.textContent=`
      #fashionPanel[data-aw-master="1"] .fashionCheck{align-items:center;gap:10px;padding:9px 10px}
      .awMasterArt,.awCoreTeeArt{display:block;background-repeat:no-repeat;background-size:600% 600%;background-color:#faf6ef;border:1px solid rgba(92,82,69,.08);box-shadow:0 3px 9px rgba(67,57,45,.045)}
      .awMasterArt{width:62px;height:62px;flex:0 0 62px;border-radius:14px}
      .awMasterIntro{margin:0 0 14px;padding:16px 17px;border:1px solid var(--line);border-radius:20px;background:rgba(255,253,248,.82)}
      .awMasterIntro h2{font-family:var(--serif);font-weight:400;font-size:1.45rem;margin:3px 0 7px}.awMasterIntro p{margin:0;color:var(--muted);font-size:.84rem;line-height:1.5}
      .awMasterOwnedNote{margin-top:9px!important;color:var(--ink)!important}.awMasterOwnedNote strong{font-weight:800}
      .awCoreTeeArt{width:72px;height:72px;border-radius:13px;margin:auto}
      .fashionCoreTeeVisual .fashionCoreTeeShape{display:none!important}
      @media(max-width:480px){.awMasterArt{width:56px;height:56px;flex-basis:56px}}
    `;
    document.head.appendChild(style);
  }

  function renderCapsule(){
    if(currentSeason()!=='aw'||currentTab()!=='capsule')return;
    const panel=document.querySelector('#fashionPanel');
    if(!panel)return;
    const owned=new Set(getOwned());
    const groups=[...new Set(items.map(x=>x.group))];
    const done=items.filter(x=>owned.has(x.id)).length;
    const pct=Math.round(done/items.length*100);
    panel.dataset.awMaster='1';
    panel.innerHTML=`
      <div class="fashionProgress card"><div><p class="eyebrow">AUTUMN / WINTER</p><h2>${done} of ${items.length} pieces sorted</h2><p>Your definitive Dorset capsule: what you already own first, then only the gaps worth filling.</p></div><div class="fashionProgressRing" style="--pct:${pct}"><strong>${pct}%</strong></div></div>
      <div class="awMasterIntro"><p class="eyebrow">YOUR MASTER LIST</p><h2>Built around what is already in your wardrobe.</h2><p>The illustrated pieces are the exact visual references we have created together. Owned items are pre-ticked; anything you add or remove here saves on this device.</p><p class="awMasterOwnedNote"><strong>15 pieces already owned.</strong> No need to shop for replacements unless something genuinely stops working for you.</p></div>
      ${groups.map(g=>`<section class="fashionGroup"><div class="fashionGroupHead"><h2>${g}</h2><span>${items.filter(x=>x.group===g).length}</span></div><div class="fashionChecklist">${items.filter(x=>x.group===g).map(item=>`<label class="fashionCheck ${owned.has(item.id)?'isOwned':''}"><input type="checkbox" data-aw-master-item="${item.id}" ${owned.has(item.id)?'checked':''}>${artHTML(item)}<span class="fashionFakeCheck"></span><span class="fashionCheckCopy"><strong>${item.name}</strong><small>${item.colour}</small></span>${statusTag(item)}</label>`).join('')}</div></section>`).join('')}`;
    panel.querySelectorAll('[data-aw-master-item]').forEach(input=>input.addEventListener('change',e=>{
      const ids=new Set(getOwned());
      e.target.checked?ids.add(e.target.dataset.awMasterItem):ids.delete(e.target.dataset.awMasterItem);
      setOwned([...ids]);
      renderCapsule();
      setTimeout(applyCoreTeeArt,20);
    }));
  }

  const teeMap={'tee-white':'tee-white','tee-cream':'tee-cream','tee-breton':'breton','tee-olive':'tee-olive','tee-blue':'tee-blue','tee-navy':'tee-navy'};
  function applyCoreTeeArt(){
    if(!sprite)return;
    document.querySelectorAll('[data-core-tee]').forEach(input=>{
      const key=teeMap[input.dataset.coreTee];
      if(!key||!artPos[key])return;
      const visual=input.closest('.fashionCoreTee')?.querySelector('.fashionCoreTeeVisual');
      if(!visual)return;
      let art=visual.querySelector('.awCoreTeeArt');
      if(!art){visual.innerHTML='';art=document.createElement('span');art.className='awCoreTeeArt';visual.appendChild(art)}
      const [x,y]=artPos[key];
      art.style.backgroundImage=`url("${sprite}")`;
      art.style.backgroundPosition=`${x/(COLS-1)*100}% ${y/(ROWS-1)*100}%`;
    });
  }
  function repaint(){
    if(!sprite)return;
    document.querySelectorAll('[data-aw-art]').forEach(el=>{
      const key=el.dataset.awArt;if(!artPos[key])return;
      const [x,y]=artPos[key];
      el.style.backgroundImage=`url("${sprite}")`;
      el.style.backgroundPosition=`${x/(COLS-1)*100}% ${y/(ROWS-1)*100}%`;
    });
    applyCoreTeeArt();
  }

  let pending=false;
  function sync(){
    if(pending)return;pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      const panel=document.querySelector('#fashionPanel');
      if(currentSeason()==='aw'&&currentTab()==='capsule'&&panel&&!panel.dataset.awMaster)renderCapsule();
      repaint();
    });
  }

  async function loadSprite(){
    try{
      const r=await fetch(SPRITE_SOURCE,{cache:'no-cache'});
      if(!r.ok)throw new Error('Autumn/Winter illustrations could not load');
      const b64=(await r.text()).trim();
      sprite=`data:image/webp;base64,${b64}`;
      repaint();
      if(currentSeason()==='aw'&&currentTab()==='capsule')renderCapsule();
    }catch(e){console.warn(e)}
  }

  migrate();
  injectStyles();
  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(!e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))return;
    setTimeout(()=>{
      const panel=document.querySelector('#fashionPanel');
      if(panel)delete panel.dataset.awMaster;
      sync();
    },70);
  },true);
  window.addEventListener('pageshow',sync);
  sync();
  loadSprite();
})();