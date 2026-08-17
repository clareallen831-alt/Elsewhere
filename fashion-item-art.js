(() => {
  let SPRITE='';
  const SPRITE_SOURCE='./illustrations/fashion/item-sprite-b64.txt';
  const POS={"tee-white":[0,0],"tee-cream":[1,0],"tee-breton":[2,0],"tee-olive":[3,0],"tee-blue":[0,1],"tee-navy":[1,1],"aw-cream-knit":[2,1],"aw-navy-knit":[3,1],"aw-olive-overshirt":[0,2],"aw-blue-oxford":[1,2],"aw-striped-shirt":[2,2],"aw-dark-jeans":[3,2],"aw-navy-chinos":[0,3],"aw-stone-trench":[1,3],"aw-charcoal-coat":[2,3],"aw-chelsea-boots":[3,3],"aw-loafers":[0,4]};
  const CHECK_MAP={
    'cream-cable':'aw-cream-knit',
    'navy-merino':'aw-navy-knit',
    'blue-oxford':'aw-blue-oxford',
    'stripe-oxford':'aw-striped-shirt',
    'dark-straight-jeans':'aw-dark-jeans',
    'wool-coat':'aw-charcoal-coat',
    'chelsea-boots':'aw-chelsea-boots',
    'loafers':'aw-loafers',
    'breton':'tee-breton',
    'cream-tee':'tee-cream'
  };
  const EXTRAS=[
    {key:'aw-stone-trench',title:'Light stone trench',note:'Already own · useful transitional layer'},
    {key:'aw-navy-chinos',title:'Navy straight-leg chinos',note:'Already own · smart-casual alternative to jeans'},
    {key:'aw-olive-overshirt',title:'Olive overshirt',note:'Useful light layer · only add if it earns its place'}
  ];

  function pos(key){
    const p=POS[key]||[0,0];
    return `${p[0]*33.333333}% ${p[1]*25}%`;
  }
  function paint(el){
    if(!SPRITE||!el?.dataset?.artKey)return;
    el.style.backgroundImage=`url("${SPRITE}")`;
    el.style.backgroundPosition=pos(el.dataset.artKey);
  }
  function art(key,cls='fashionMiniArt'){
    const el=document.createElement('span');
    el.className=cls;
    el.dataset.artKey=key;
    paint(el);
    return el;
  }
  function injectStyles(){
    if(document.querySelector('#fashion-item-art-styles'))return;
    const style=document.createElement('style');
    style.id='fashion-item-art-styles';
    style.textContent=`
      .fashionMiniArt,.fashionTeeSpriteArt,.fashionExtraArt,.fashionProductArt{display:block;background-repeat:no-repeat;background-size:400% 500%;background-color:#faf6ef}
      .fashionMiniArt{width:52px;height:52px;flex:0 0 52px;border-radius:12px;border:1px solid rgba(92,82,69,.08);box-shadow:0 3px 10px rgba(67,57,45,.05)}
      .fashionCheck.hasMiniArt{gap:9px}.fashionCheck.hasMiniArt .fashionFakeCheck{margin-left:1px}
      .fashionTeeSpriteArt{width:72px;height:72px;border-radius:13px;margin:auto}
      .fashionCoreTeeVisual{height:78px!important}.fashionCoreTeeShape{display:none!important}
      .fashionAwExtras{margin:14px 0 22px}.fashionAwExtrasHead{display:flex;align-items:end;justify-content:space-between;margin:0 3px 9px}
      .fashionAwExtrasHead h2{font-family:var(--serif);font-weight:400;margin:0;font-size:1.35rem}.fashionAwExtrasHead small{color:var(--muted);font-size:.68rem}
      .fashionAwExtraGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
      .fashionAwExtra{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:9px;text-align:center}
      .fashionExtraArt{width:100%;aspect-ratio:1;border-radius:12px;margin-bottom:8px}
      .fashionAwExtra strong,.fashionAwExtra small{display:block}.fashionAwExtra strong{font-size:.78rem;line-height:1.25}.fashionAwExtra small{font-size:.65rem;color:var(--muted);line-height:1.3;margin-top:3px}
      .fashionProductArt{width:86px;height:86px;border-radius:14px;margin:0 0 10px;border:1px solid rgba(92,82,69,.08)}
      @media(max-width:480px){.fashionAwExtraGrid{grid-template-columns:repeat(3,1fr)}.fashionMiniArt{width:48px;height:48px;flex-basis:48px}}
    `;
    document.head.appendChild(style);
  }

  function applyTees(){
    document.querySelectorAll('[data-core-tee]').forEach(input=>{
      const id=input.dataset.coreTee;
      if(!POS[id])return;
      const visual=input.closest('.fashionCoreTee')?.querySelector('.fashionCoreTeeVisual');
      if(!visual)return;
      if(!visual.querySelector('.fashionTeeSpriteArt')){
        visual.innerHTML='';
        visual.appendChild(art(id,'fashionTeeSpriteArt'));
      }
    });
  }

  function applyChecklist(){
    document.querySelectorAll('.fashionCheck input[data-fashion-item]').forEach(input=>{
      const key=CHECK_MAP[input.dataset.fashionItem];
      if(!key)return;
      const row=input.closest('.fashionCheck');
      if(!row||row.querySelector('.fashionMiniArt'))return;
      row.classList.add('hasMiniArt');
      const fake=row.querySelector('.fashionFakeCheck');
      row.insertBefore(art(key),fake||row.firstChild);
    });
  }

  function addExtras(){
    const season=localStorage.getItem('elsewhere_fashion_season_v1')==='ss'?'ss':'aw';
    const tab=localStorage.getItem('elsewhere_fashion_tab_v1')||'capsule';
    const panel=document.querySelector('#fashionPanel');
    document.querySelector('#fashionAwVisualExtras')?.remove();
    if(!panel||season!=='aw'||tab!=='capsule')return;
    const section=document.createElement('section');
    section.id='fashionAwVisualExtras';
    section.className='fashionAwExtras';
    section.innerHTML='<div class="fashionAwExtrasHead"><h2>Useful pieces already in the picture</h2><small>3 pieces</small></div><div class="fashionAwExtraGrid"></div>';
    const grid=section.querySelector('.fashionAwExtraGrid');
    EXTRAS.forEach(x=>{
      const card=document.createElement('article');
      card.className='fashionAwExtra';
      card.appendChild(art(x.key,'fashionExtraArt'));
      const strong=document.createElement('strong');strong.textContent=x.title;card.appendChild(strong);
      const small=document.createElement('small');small.textContent=x.note;card.appendChild(small);
      grid.appendChild(card);
    });
    const core=panel.querySelector('#fashionCoreTees');
    if(core)core.insertAdjacentElement('afterend',section);
    else {
      const note=panel.querySelector('.fashionNote');
      note?note.insertAdjacentElement('afterend',section):panel.prepend(section);
    }
  }

  function productKey(card){
    const title=(card.querySelector('h3')?.textContent||'').toLowerCase();
    const colour=(card.querySelector('.fashionProductColour')?.textContent||'').toLowerCase();
    if(title.includes('hartland')||title.includes('lambswool shawl'))return 'aw-cream-knit';
    if(title.includes('uniqlo 100% merino')&&colour.includes('navy'))return 'aw-navy-knit';
    if(title.includes('classic oxford')&&colour.includes('celeste'))return 'aw-blue-oxford';
    if(title.includes('fine poplin')||title.includes('striped shirt edit'))return 'aw-striped-shirt';
    if(title.includes('high rise straight jeans'))return 'aw-dark-jeans';
    if(title.includes('rove suede chelsea'))return 'aw-chelsea-boots';
    if(title.includes('leather loafers'))return 'aw-loafers';
    if(title.includes('crew neck t-shirt'))return 'tee-cream';
    return null;
  }
  function applyProducts(){
    document.querySelectorAll('.fashionProduct').forEach(card=>{
      if(card.querySelector('.fashionProductArt'))return;
      const key=productKey(card);if(!key)return;
      card.insertBefore(art(key,'fashionProductArt'),card.firstChild);
    });
  }

  function repaint(){
    document.querySelectorAll('[data-art-key]').forEach(paint);
  }
  function render(){
    injectStyles();
    applyTees();
    applyChecklist();
    applyProducts();
    addExtras();
    repaint();
  }
  async function loadSprite(){
    try{
      const response=await fetch(SPRITE_SOURCE,{cache:'no-cache'});
      if(!response.ok)throw new Error('Fashion illustrations could not load');
      const raw=(await response.text()).trim();
      SPRITE=`data:image/webp;base64,${raw}`;
      render();
    }catch(err){console.warn(err)}
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(!e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))return;
    setTimeout(render,90);
  },true);
  window.addEventListener('pageshow',render);
  render();
  loadSprite();
})();