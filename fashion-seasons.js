(() => {
  const SEASON_KEY='elsewhere_fashion_season_v1';
  const TAB_KEY='elsewhere_fashion_tab_v1';
  const SS_STORAGE_KEY='elsewhere_fashion_capsule_ss_v1';

  const ssCapsule=[
    {group:'Tops',id:'ss-cream-knit',name:'Lightweight knit jumper',colour:'Cream',status:'start'},
    {group:'Tops',id:'ss-breton',name:'Breton striped top',colour:'Cream / navy',status:'start'},
    {group:'Tops',id:'ss-blue-linen-shirt',name:'Relaxed linen shirt',colour:'Pale blue',status:'start'},
    {group:'Tops',id:'ss-white-blouse',name:'White cotton blouse',colour:'White',status:'later'},
    {group:'Tops',id:'ss-cream-tee',name:'Good heavyweight T-shirt',colour:'Cream / white',status:'later'},
    {group:'Tops',id:'ss-khaki-tee',name:'Simple T-shirt',colour:'Muted khaki',status:'later'},
    {group:'Tops',id:'ss-sleeveless-linen',name:'Sleeveless linen top',colour:'Cream / stone',status:'later'},
    {group:'Bottoms',id:'ss-light-jeans',name:'Straight-leg jeans',colour:'Light wash',status:'start'},
    {group:'Bottoms',id:'ss-ecru-jeans',name:'Ecru or white jeans',colour:'Ecru / soft white',status:'start'},
    {group:'Bottoms',id:'ss-khaki-chinos',name:'Khaki chinos',colour:'Khaki / sage',status:'start'},
    {group:'Bottoms',id:'ss-linen-trousers',name:'Linen trousers',colour:'Oatmeal / stone',status:'start'},
    {group:'Bottoms',id:'ss-denim-shorts',name:'Tailored denim shorts',colour:'Mid blue',status:'later'},
    {group:'Bottoms',id:'ss-midi-skirt',name:'Cotton or linen midi skirt',colour:'Cream / neutral',status:'later'},
    {group:'Dresses',id:'ss-striped-dress',name:'Striped shirt dress',colour:'Blue / white',status:'later'},
    {group:'Dresses',id:'ss-linen-dress',name:'Linen midi dress',colour:'Cream / oatmeal',status:'start'},
    {group:'Dresses',id:'ss-floral-dress',name:'Soft floral midi dress',colour:'Muted blue / sage / blush',status:'later'},
    {group:'Layers',id:'ss-denim-jacket',name:'Classic denim jacket',colour:'Light / mid blue',status:'later'},
    {group:'Layers',id:'ss-quilted-jacket',name:'Lightweight quilted jacket',colour:'Navy / olive',status:'later'},
    {group:'Layers',id:'ss-linen-blazer',name:'Relaxed linen blazer',colour:'Stone / oatmeal',status:'later'},
    {group:'Layers',id:'ss-barbour',name:'Barbour jacket',colour:'Olive / navy',status:'own'},
    {group:'Shoes',id:'ss-trainers',name:'Leather trainers',colour:'White / cream',status:'start'},
    {group:'Shoes',id:'ss-sandals',name:'Flat leather sandals',colour:'Tan',status:'start'},
    {group:'Shoes',id:'ss-loafers',name:'Leather loafers',colour:'Tan / brown',status:'later'},
    {group:'Shoes',id:'ss-espadrilles',name:'Espadrilles',colour:'Cream / natural',status:'later'},
    {group:'Shoes',id:'ss-ariat',name:'Ariat wellies',colour:'Existing',status:'own'},
    {group:'Accessories',id:'ss-belt',name:'Simple leather belt',colour:'Cognac / tan',status:'later'},
    {group:'Accessories',id:'ss-crossbody',name:'Leather crossbody bag',colour:'Tan',status:'later'},
    {group:'Accessories',id:'ss-basket',name:'Woven tote or basket bag',colour:'Natural',status:'start'},
    {group:'Accessories',id:'ss-hat',name:'Straw hat or cap',colour:'Natural / neutral',status:'later'},
    {group:'Accessories',id:'ss-sunglasses',name:'Classic sunglasses',colour:'Tortoiseshell / brown',status:'later'},
    {group:'Accessories',id:'ss-jewellery',name:'Simple gold jewellery',colour:'Gold',status:'later'}
  ];

  const ssOutfits=[
    {title:'Everyday polished',use:'Farm, errands or an ordinary day',pieces:'Pale-blue linen shirt · Light-wash straight jeans · Brown leather belt · White trainers',image:'./illustrations/fashion/ss-01.webp'},
    {title:'Village lunch',use:'Lunch, market or a day in town',pieces:'White cotton blouse · Khaki chinos · Tan crossbody bag · Tan sandals',image:'./illustrations/fashion/ss-02.webp'},
    {title:'Countryside classic',use:'An easy, timeless weekend',pieces:'Cream/navy Breton · Ecru jeans · Simple gold jewellery · Brown loafers',image:'./illustrations/fashion/ss-03.webp'},
    {title:'Practical pretty',use:'Garden centre, lunch or pottering',pieces:'Cream T-shirt · Neutral midi skirt · Denim jacket · White trainers',image:'./illustrations/fashion/ss-04.webp'},
    {title:'Relaxed summer feminine',use:'Pub lunch, local event or weekend',pieces:'Cream linen midi dress · Woven basket bag · Sunglasses · Tan sandals',image:'./illustrations/fashion/ss-05.webp'},
    {title:'Dorset day out',use:'Warm day, coast or countryside',pieces:'Sleeveless stone linen top · Oatmeal linen trousers · Light knit over shoulders · Tan sandals',image:'./illustrations/fashion/ss-06.webp'},
    {title:'Smarter natural',use:'Work, appointment or somewhere nicer',pieces:'Pale-blue shirt · White jeans · Stone linen blazer · Loafers',image:'./illustrations/fashion/ss-07.webp'},
    {title:'Casual weekend',use:'Practical summer day',pieces:'Muted khaki T-shirt · Tailored denim shorts · Olive Barbour · White trainers',image:'./illustrations/fashion/ss-08.webp'},
    {title:'Pub garden evening',use:'When the temperature drops',pieces:'Cream lightweight knit · Ecru jeans · Simple gold jewellery · Tan sandals',image:'./illustrations/fashion/ss-09.webp'},
    {title:'Garden to town',use:'Feminine without feeling dressed up',pieces:'Soft floral midi dress · Woven basket bag · Denim jacket · Espadrilles',image:'./illustrations/fashion/ss-10.webp'}
  ];

  const ssShop=[
    {for:'ss-blue-linen-shirt',tier:'START HERE',title:'Pale-blue linen shirt',colour:'Pale blue',note:'Relaxed rather than fitted. M&S, Uniqlo, Boden and With Nothing Underneath are good places to look.',url:'https://www.marksandspencer.com/l/women/tops/fs5/linen-shirt'},
    {for:'ss-cream-knit',tier:'START HERE',title:'Lightweight cream knit',colour:'Cream / ivory',note:'Fine cotton, merino or a linen blend for cool mornings and summer evenings.',url:'https://www.uniqlo.com/uk/en/women/jumpers/jumpers'},
    {for:'ss-breton',tier:'SAVE',title:'Classic Breton top',colour:'Cream / navy',note:'A useful everyday stripe that works with ecru denim, chinos, shorts and under a jacket.',url:'https://www.seasaltcornwall.com/womens/clothing/tops/breton-tops'},
    {for:'ss-light-jeans',tier:'MID',title:'Light-wash straight jeans',colour:'Light denim',note:'Straight rather than skinny; a relaxed cuff works beautifully with trainers and sandals.',url:'https://www.boden.com/collections/womens-jeans'},
    {for:'ss-ecru-jeans',tier:'START HERE',title:'Ecru jeans',colour:'Soft white / ecru',note:'One of the highest-impact summer swaps: they make your existing tops immediately feel lighter.',url:'https://www.marksandspencer.com/l/women/jeans/fs5/white-jeans'},
    {for:'ss-khaki-chinos',tier:'SAVE',title:'Khaki chinos',colour:'Khaki / sage',note:'A practical non-denim option. Look for cotton with a little stretch and a straight leg.',url:'https://www.marksandspencer.com/l/women/trousers/fs5/chinos'},
    {for:'ss-linen-trousers',tier:'MID',title:'Linen trousers',colour:'Oatmeal / stone',note:'Softly tailored rather than beachy: full length, good waistband and a clean leg.',url:'https://www.marksandspencer.com/l/women/trousers/fs5/linen'},
    {for:'ss-linen-dress',tier:'MID',title:'Linen midi dress',colour:'Cream / oatmeal / soft blue',note:'Simple shape, a little waist definition and a length that works with flat sandals.',url:'https://www.boden.com/collections/womens-linen-dresses'},
    {for:'ss-denim-jacket',tier:'SAVE',title:'Classic denim jacket',colour:'Mid blue',note:'This is a layer rather than the hero piece, so there is no need to overspend.',url:'https://www.marksandspencer.com/l/women/coats-and-jackets/fs5/denim-jackets'},
    {for:'ss-linen-blazer',tier:'MID',title:'Relaxed linen blazer',colour:'Stone / oatmeal',note:'The summer equivalent of the tweed blazer: it makes white jeans or linen trousers feel intentional.',url:'https://www.marksandspencer.com/l/women/blazers/fs5/linen'},
    {for:'ss-trainers',tier:'SAVE',title:'Simple leather trainers',colour:'White / cream',note:'Keep them minimal so they work with dresses as well as jeans and chinos.',url:'https://www.marksandspencer.com/l/women/footwear/fs5/trainers'},
    {for:'ss-sandals',tier:'MID',title:'Flat leather sandals',colour:'Tan',note:'Simple leather straps and no heavy embellishment. They should work with every summer outfit.',url:'https://www.dunelondon.com/womens-sandals/'},
    {for:'ss-basket',tier:'SAVE',title:'Woven tote or basket bag',colour:'Natural / tan',note:'A useful summer texture that still sits comfortably inside the neutral palette.',url:'https://www.marksandspencer.com/l/women/bags/fs5/straw-bags'}
  ];

  const defaults=['ss-barbour','ss-ariat'];
  const currentSeason=()=>localStorage.getItem(SEASON_KEY)==='ss'?'ss':'aw';
  const currentTab=()=>localStorage.getItem(TAB_KEY)||'capsule';

  function injectStyles(){
    if(document.querySelector('#fashion-season-styles')) return;
    const style=document.createElement('style');
    style.id='fashion-season-styles';
    style.textContent=`
      .fashionSeasonTabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:4px 0 14px;padding:5px;background:rgba(255,253,248,.72);border:1px solid var(--line);border-radius:18px}
      .fashionSeasonTabs button{border:0;background:transparent;border-radius:14px;padding:12px 8px;color:var(--muted);font-weight:800;font-size:.78rem}
      .fashionSeasonTabs button.selected{background:var(--forest);color:#fff;box-shadow:0 5px 14px rgba(52,75,60,.14)}
      .fashionOutfitGrid.springSummer .fashionOutfitCard::before{display:none}
      .fashionOutfitImage{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:#f7efe2}
      @media(max-width:370px){.fashionSeasonTabs button{font-size:.7rem;padding:10px 5px}}
    `;
    document.head.appendChild(style);
  }

  function getOwned(){
    try{
      const raw=localStorage.getItem(SS_STORAGE_KEY);
      if(!raw) return [...defaults];
      const parsed=JSON.parse(raw);
      return Array.isArray(parsed)?parsed:[...defaults];
    }catch{return [...defaults]}
  }
  function setOwned(ids){localStorage.setItem(SS_STORAGE_KEY,JSON.stringify(ids))}

  function tag(item){
    if(item.status==='own') return '<span class="fashionTag own">Already own</span>';
    if(item.status==='start') return '<span class="fashionTag start">Start here</span>';
    return '<span class="fashionTag later">Later</span>';
  }

  function renderCapsule(){
    const panel=document.querySelector('#fashionPanel'); if(!panel)return;
    const owned=new Set(getOwned());
    const total=ssCapsule.length,done=ssCapsule.filter(x=>owned.has(x.id)).length;
    const groups=[...new Set(ssCapsule.map(x=>x.group))];
    panel.innerHTML=`
      <div class="fashionProgress card"><div><p class="eyebrow">SPRING / SUMMER</p><h2>${done} of ${total} pieces sorted</h2><p>Tick what you already own or buy. This checklist is saved separately from Autumn/Winter.</p></div><div class="fashionProgressRing" style="--pct:${Math.round(done/total*100)}"><strong>${Math.round(done/total*100)}%</strong></div></div>
      <div class="fashionNote"><strong>Start with eight:</strong> pale-blue linen shirt, cream lightweight knit, ecru jeans, khaki chinos, linen trousers, linen midi dress, white trainers and tan sandals.</div>
      ${groups.map(g=>`<section class="fashionGroup"><div class="fashionGroupHead"><h2>${g}</h2><span>${ssCapsule.filter(x=>x.group===g).length}</span></div><div class="fashionChecklist">${ssCapsule.filter(x=>x.group===g).map(item=>`<label class="fashionCheck ${owned.has(item.id)?'isOwned':''}"><input type="checkbox" data-ss-fashion-item="${item.id}" ${owned.has(item.id)?'checked':''}><span class="fashionFakeCheck"></span><span class="fashionCheckCopy"><strong>${item.name}</strong><small>${item.colour}</small></span>${tag(item)}</label>`).join('')}</div></section>`).join('')}`;
    panel.querySelectorAll('[data-ss-fashion-item]').forEach(input=>input.addEventListener('change',e=>{
      const ids=new Set(getOwned());
      e.target.checked?ids.add(e.target.dataset.ssFashionItem):ids.delete(e.target.dataset.ssFashionItem);
      setOwned([...ids]);renderCapsule();
    }));
  }

  function renderOutfits(){
    const panel=document.querySelector('#fashionPanel');if(!panel)return;
    panel.innerHTML=`<div class="fashionSectionLead"><p class="eyebrow">SPRING / SUMMER OUTFITS</p><h2>Lighter days, same Dorset style.</h2><p>Ten easy combinations built around cream, pale blue, ecru, khaki and tan.</p></div><div class="fashionOutfitGrid springSummer">${ssOutfits.map(o=>`<article class="fashionOutfitCard"><img class="fashionOutfitImage" src="${o.image}" alt="Illustration of ${o.title}" loading="lazy"><div class="fashionOutfitCopy"><p class="eyebrow">${o.use}</p><h3>${o.title}</h3><p>${o.pieces}</p></div></article>`).join('')}</div>`;
  }

  function shopCard(p){return `<article class="fashionProduct"><div class="fashionProductTop"><span class="fashionTier">${p.tier}</span><span class="fashionPrice">Shop target</span></div><h3>${p.title}</h3><p class="fashionProductColour">${p.colour}</p><p>${p.note}</p><a href="${p.url}" target="_blank" rel="noopener noreferrer">View retailer <span>↗</span></a></article>`}

  function renderShop(){
    const panel=document.querySelector('#fashionPanel');if(!panel)return;
    const first=new Set(['ss-blue-linen-shirt','ss-cream-knit','ss-light-jeans','ss-ecru-jeans','ss-khaki-chinos','ss-linen-trousers','ss-linen-dress','ss-trainers','ss-sandals']);
    panel.innerHTML=`<div class="fashionSectionLead"><p class="eyebrow">SPRING / SUMMER SHOP</p><h2>Light layers, useful neutrals, no holiday-costume dressing.</h2><p>A shopping map for building the warmer-weather capsule slowly.</p></div><div class="fashionShopRule"><span>THE RULE</span><strong>Spend on linen that hangs well and shoes you will walk in.</strong><small>Save on tees, Breton tops and denim layers until you know what you wear most.</small></div><h2 class="fashionShopHeading">Start here</h2><div class="fashionShopGrid">${ssShop.filter(p=>first.has(p.for)).map(shopCard).join('')}</div><h2 class="fashionShopHeading">The rest of the capsule</h2><div class="fashionShopGrid">${ssShop.filter(p=>!first.has(p.for)).map(shopCard).join('')}</div>`;
  }

  function renderSpringSummer(tab=currentTab()){
    document.querySelectorAll('[data-fashion-tab]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionTab===tab));
    if(tab==='outfits')renderOutfits();else if(tab==='shop')renderShop();else renderCapsule();
  }

  function setSeason(value){
    localStorage.setItem(SEASON_KEY,value==='ss'?'ss':'aw');
    document.querySelectorAll('[data-fashion-season]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionSeason===currentSeason()));
    if(currentSeason()==='ss'){
      renderSpringSummer();
    }else{
      const b=document.querySelector(`[data-fashion-tab="${currentTab()}"]`)||document.querySelector('[data-fashion-tab="capsule"]');
      b?.click();
    }
  }

  function init(){
    injectStyles();
    const section=document.querySelector('#fashion');
    const palette=section?.querySelector('.fashionPalette');
    if(!section||!palette){setTimeout(init,60);return}
    if(section.querySelector('.fashionSeasonTabs'))return;

    const tabs=document.createElement('div');
    tabs.className='fashionSeasonTabs';
    tabs.setAttribute('role','tablist');
    tabs.setAttribute('aria-label','Wardrobe season');
    tabs.innerHTML='<button data-fashion-season="aw">Autumn / Winter</button><button data-fashion-season="ss">Spring / Summer</button>';
    palette.parentNode.insertBefore(tabs,palette);
    tabs.querySelectorAll('[data-fashion-season]').forEach(b=>b.addEventListener('click',()=>setSeason(b.dataset.fashionSeason)));

    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('[data-fashion-tab]');
      if(!btn||currentSeason()!=='ss')return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const tab=btn.dataset.fashionTab;
      localStorage.setItem(TAB_KEY,tab);
      renderSpringSummer(tab);
    },true);

    document.querySelectorAll('[data-fashion-season]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionSeason===currentSeason()));
    if(currentSeason()==='ss')renderSpringSummer();
  }

  init();
})();