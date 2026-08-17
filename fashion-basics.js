(() => {
  const STORAGE_KEY='elsewhere_fashion_core_tshirts_v1';
  const SECTION_ID='fashionCoreTees';

  const tees=[
    {id:'tee-white',name:'Soft white crew-neck T-shirt',colour:'Soft white',tone:'#f4f1e9'},
    {id:'tee-cream',name:'Warm cream T-shirt',colour:'Cream / ivory',tone:'#e9e0cc'},
    {id:'tee-breton',name:'Breton striped T-shirt',colour:'Cream / navy',tone:'breton'},
    {id:'tee-olive',name:'Relaxed cotton T-shirt',colour:'Muted olive / khaki',tone:'#777760'},
    {id:'tee-blue',name:'Soft blue T-shirt',colour:'Powder / washed blue',tone:'#bdcfda'},
    {id:'tee-navy',name:'Navy crew-neck T-shirt',colour:'Deep navy',tone:'#24384b'}
  ];

  function owned(){
    try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return []}
  }
  function save(ids){localStorage.setItem(STORAGE_KEY,JSON.stringify(ids))}

  function injectStyles(){
    if(document.querySelector('#fashion-core-tee-styles'))return;
    const style=document.createElement('style');
    style.id='fashion-core-tee-styles';
    style.textContent=`
      .fashionCoreTees{margin:20px 0 24px;padding:17px;background:rgba(255,253,248,.82);border:1px solid var(--line);border-radius:21px}
      .fashionCoreTeesHead{margin-bottom:13px}.fashionCoreTeesHead h2{font-family:var(--serif);font-weight:400;font-size:1.45rem;margin:4px 0 6px}.fashionCoreTeesHead p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.5}
      .fashionCoreTeeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
      .fashionCoreTee{position:relative;display:block;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:11px 8px;text-align:center;cursor:pointer;transition:.15s ease}
      .fashionCoreTee.isOwned{background:var(--sage2);border-color:#c8d4c6}.fashionCoreTee input{position:absolute;opacity:0;pointer-events:none}
      .fashionCoreTeeVisual{height:69px;display:grid;place-items:center;margin-bottom:6px}
      .fashionCoreTeeShape{width:64px;height:58px;background:var(--tee);clip-path:polygon(31% 5%,41% 0,50% 9%,59% 0,69% 5%,97% 25%,81% 45%,69% 35%,69% 97%,31% 97%,31% 35%,19% 45%,3% 25%);filter:drop-shadow(0 2px 2px rgba(65,57,48,.12));box-shadow:inset 0 0 0 1px rgba(60,60,55,.06)}
      .fashionCoreTeeShape.breton{background:repeating-linear-gradient(to bottom,#f3eddf 0,#f3eddf 7px,#31475c 7px,#31475c 10px)}
      .fashionCoreTee strong,.fashionCoreTee small{display:block}.fashionCoreTee strong{font-size:.76rem;line-height:1.25;color:var(--ink)}.fashionCoreTee small{font-size:.64rem;color:var(--muted);margin-top:3px;line-height:1.25}
      .fashionCoreTeeTick{position:absolute;top:7px;right:7px;width:20px;height:20px;border-radius:50%;border:1px solid #a8ad9f;background:#fff;display:grid;place-items:center;font-size:.67rem;color:transparent}.fashionCoreTee.isOwned .fashionCoreTeeTick{background:var(--forest);border-color:var(--forest);color:#fff}
      .fashionCoreTeeRule{margin:12px 0 0;padding-top:11px;border-top:1px solid var(--line);color:var(--muted);font-size:.78rem;line-height:1.45}.fashionCoreTeeRule strong{color:var(--ink)}
      @media(max-width:480px){.fashionCoreTeeGrid{grid-template-columns:repeat(2,1fr)}}
    `;
    document.head.appendChild(style);
  }

  function render(){
    const panel=document.querySelector('#fashionPanel');
    if(!panel)return;
    const isCapsule=(localStorage.getItem('elsewhere_fashion_tab_v1')||'capsule')==='capsule';
    if(!isCapsule){document.querySelector(`#${SECTION_ID}`)?.remove();return}
    if(panel.querySelector(`#${SECTION_ID}`))return;

    const selected=new Set(owned());
    const section=document.createElement('section');
    section.id=SECTION_ID;
    section.className='fashionCoreTees';
    section.innerHTML=`
      <div class="fashionCoreTeesHead">
        <p class="eyebrow">CORE BASICS · BOTH SEASONS</p>
        <h2>The T-shirts that earn their drawer space.</h2>
        <p>Good cotton, a relaxed crew neck and enough weight to skim rather than cling. Tick the versions you already own as you edit your wardrobe.</p>
      </div>
      <div class="fashionCoreTeeGrid">
        ${tees.map(t=>`<label class="fashionCoreTee ${selected.has(t.id)?'isOwned':''}">
          <input type="checkbox" data-core-tee="${t.id}" ${selected.has(t.id)?'checked':''}>
          <span class="fashionCoreTeeTick">✓</span>
          <span class="fashionCoreTeeVisual"><span class="fashionCoreTeeShape ${t.tone==='breton'?'breton':''}" style="${t.tone==='breton'?'':`--tee:${t.tone}`}" aria-hidden="true"></span></span>
          <strong>${t.name}</strong><small>${t.colour}</small>
        </label>`).join('')}
      </div>
      <p class="fashionCoreTeeRule"><strong>Black:</strong> keep one or two excellent black tees/base layers if you genuinely use them, but they do not need to be the default for this capsule.</p>`;

    const note=panel.querySelector('.fashionNote');
    if(note)note.insertAdjacentElement('afterend',section); else panel.prepend(section);

    section.querySelectorAll('[data-core-tee]').forEach(input=>input.addEventListener('change',e=>{
      const ids=new Set(owned());
      e.target.checked?ids.add(e.target.dataset.coreTee):ids.delete(e.target.dataset.coreTee);
      save([...ids]);
      e.target.closest('.fashionCoreTee')?.classList.toggle('isOwned',e.target.checked);
    }));
  }

  injectStyles();
  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(!e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))return;
    setTimeout(render,80);
  },true);
  window.addEventListener('pageshow',render);
  render();
})();