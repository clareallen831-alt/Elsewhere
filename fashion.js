(() => {
  const TAB_KEY='elsewhere_fashion_tab_v1';
  const SEASON_KEY='elsewhere_fashion_season_v1';
  const AW_KEY='elsewhere_fashion_capsule_v1';
  const SS_KEY='elsewhere_fashion_capsule_ss_v1';
  const MIGRATION_KEY='elsewhere_fashion_soft_country_20260820_v1';

  const palette=[
    ['#f2ecdf','Cream'],['#d4c7ad','Oatmeal'],['#68715a','Forest'],['#263e53','Navy'],
    ['#b9cfdb','Soft blue'],['#526d86','Indigo'],['#63483e','Chocolate'],['#8d7868','Taupe']
  ];

  const awCapsule=[
    {group:'Outerwear & jackets',id:'barbour-jackets',name:'Barbour jacket(s)',colour:'Olive / navy',status:'own',owned:true},
    {group:'Outerwear & jackets',id:'grey-wool-coat',name:'Long wool coat with oversized collar',colour:'Charcoal / soft grey',status:'own',owned:true},
    {group:'Outerwear & jackets',id:'stone-trench',name:'Stone / cream trench coat',colour:'Warm stone',status:'own',owned:true},
    {group:'Outerwear & jackets',id:'blue-pinstripe-blazer',name:'Soft blue pinstripe blazer',colour:'Soft blue',status:'own',owned:true},
    {group:'Outerwear & jackets',id:'cream-striped-blazer',name:'Cream striped blazer',colour:'Cream / fine dark stripe',status:'own',owned:true},
    {group:'Outerwear & jackets',id:'taupe-fleece',name:'Taupe teddy fleece pullover',colour:'Taupe',status:'practical',owned:true},
    {group:'Outerwear & jackets',id:'olive-quilted-coat',name:'Long quilted hooded coat',colour:'Muted olive',status:'practical',owned:true},

    {group:'Knitwear',id:'charcoal-rollneck',name:'Oversized roll-neck jumper',colour:'Charcoal',status:'own',owned:true},
    {group:'Knitwear',id:'navy-relaxed-knit',name:'Relaxed everyday knit',colour:'Navy',status:'own',owned:true},
    {group:'Knitwear',id:'cream-textured-knit',name:'Textured knit jumper',colour:'Cream',status:'own',owned:true},
    {group:'Knitwear',id:'speckled-oatmeal-knit',name:'Speckled crew-neck knit',colour:'Oatmeal / soft grey',status:'own',owned:true},
    {group:'Knitwear',id:'navy-cardigan',name:'Chunky cardigan',colour:'Navy',status:'own',owned:true},
    {group:'Knitwear',id:'forest-green-knit',name:'Crew-neck knit',colour:'Forest green',status:'own',owned:true},
    {group:'Knitwear',id:'chocolate-rollneck',name:'Roll-neck knit',colour:'Dark chocolate',status:'own',owned:true},
    {group:'Knitwear',id:'cream-navy-breton-knit',name:'Breton knit with shoulder buttons',colour:'Cream / navy',status:'own',owned:true},

    {group:'Soft shirts & light layers',id:'cream-soft-shirt',name:'Textured relaxed shirt',colour:'White / cream',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'blue-rust-soft-shirt',name:'Soft striped shirt',colour:'Pale blue / rust',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'denim-overshirt',name:'Washed denim overshirt',colour:'Mid blue',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'pale-blue-soft-shirt',name:'Soft chambray / linen shirt',colour:'Pale blue',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'cream-ribbed-rollneck',name:'Ribbed layering roll-neck',colour:'Cream',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'navy-white-threequarter',name:'Three-quarter sleeve striped top',colour:'Navy / white with pink trim',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'fine-navy-stripe-layer',name:'Fitted fine-stripe long-sleeve top',colour:'Navy / white',status:'own',owned:true},
    {group:'Soft shirts & light layers',id:'navy-loose-layer',name:'Loose-fit long-sleeve top',colour:'Navy',status:'own',owned:true},

    {group:'Bottoms',id:'navy-chinos',name:'Straight / slim chinos',colour:'Navy',status:'own',owned:true},
    {group:'Bottoms',id:'smart-navy-trousers',name:'Smart cotton trousers, straight leg',colour:'Navy',status:'own',owned:true},
    {group:'Bottoms',id:'carrot-wash-jeans',name:'Carrot-leg washed denim jeans',colour:'Washed blue',status:'wildcard',owned:true},
    {group:'Bottoms',id:'light-ankle-jeans',name:'Straight ankle-grazer jeans',colour:'Light wash',status:'own',owned:true},
    {group:'Bottoms',id:'dark-skinny-welly-jeans',name:'Skinny jeans for wellies',colour:'Dark wash',status:'practical',owned:true},
    {group:'Bottoms',id:'brown-wide-trousers',name:'Wide-leg cotton trousers',colour:'Chocolate / brown',status:'wildcard',owned:true},
    {group:'Bottoms',id:'indigo-slim-ankle-jeans',name:'Slim-straight ankle-grazer jeans',colour:'Dark indigo',status:'start',owned:false},

    {group:'Dresses',id:'blue-floral-wrap-dress',name:'Blue & white floral wrap-style midi dress',colour:'Blue / white',status:'own',owned:true},

    {group:'Shoes & accessories',id:'ariat-wellies',name:'Ariat wellies',colour:'Existing',status:'practical',owned:true},
    {group:'Shoes & accessories',id:'barbour-short-wellies',name:'Barbour short wellies',colour:'Existing',status:'practical',owned:true},
    {group:'Shoes & accessories',id:'tan-chelsea-boots',name:'Leather / suede ankle boots',colour:'Tan / brown',status:'own',owned:true},
    {group:'Shoes & accessories',id:'leather-belt',name:'Simple leather belt',colour:'Tan / brown',status:'own',owned:true},
    {group:'Shoes & accessories',id:'everyday-bag',name:'Leather / suede everyday bag',colour:'Tan / chocolate',status:'own',owned:true},
    {group:'Shoes & accessories',id:'wool-scarf',name:'Wool scarf',colour:'Muted tartan / neutral',status:'own',owned:true},
    {group:'Shoes & accessories',id:'loafers',name:'Leather loafers',colour:'Tan / chocolate',status:'start',owned:false},
    {group:'Shoes & accessories',id:'knee-boots',name:'Knee-high leather boots',colour:'Chocolate',status:'later',owned:false}
  ];

  const ssCapsule=[
    {group:'Soft tops & light layers',id:'ss-pale-blue-soft-shirt',name:'Soft chambray / linen shirt',colour:'Pale blue',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-cream-soft-shirt',name:'Textured relaxed shirt',colour:'White / cream',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-blue-rust-shirt',name:'Soft striped shirt',colour:'Pale blue / rust',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-denim-overshirt',name:'Washed denim overshirt',colour:'Mid blue',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-navy-white-threequarter',name:'Three-quarter sleeve striped top',colour:'Navy / white with pink trim',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-fine-navy-stripe',name:'Fine-stripe fitted long-sleeve top',colour:'Navy / white',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-navy-loose-layer',name:'Loose-fit long-sleeve top',colour:'Navy',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-cream-knit',name:'Lightweight cream knit',colour:'Cream',status:'own',owned:true},
    {group:'Soft tops & light layers',id:'ss-cream-soft-tee',name:'Soft draped short-sleeve top',colour:'Cream / ivory',status:'start',owned:false},
    {group:'Soft tops & light layers',id:'ss-ivory-blouse',name:'Soft draped blouse',colour:'Ivory / muted blue',status:'later',owned:false},
    {group:'Soft tops & light layers',id:'ss-soft-navy-top',name:'Soft summer top',colour:'Navy',status:'later',owned:false},

    {group:'Bottoms',id:'ss-light-ankle-jeans',name:'Straight ankle-grazer jeans',colour:'Light wash',status:'own',owned:true},
    {group:'Bottoms',id:'ss-navy-chinos',name:'Straight / slim chinos',colour:'Navy',status:'own',owned:true},
    {group:'Bottoms',id:'ss-smart-navy-trousers',name:'Smart cotton trousers, straight leg',colour:'Navy',status:'own',owned:true},
    {group:'Bottoms',id:'ss-indigo-slim-ankle',name:'Slim-straight ankle-grazer jeans',colour:'Dark indigo',status:'start',owned:false},
    {group:'Bottoms',id:'ss-ecru-slim-jeans',name:'Slim / straight ankle-grazer jeans',colour:'Ecru / soft white',status:'later',owned:false},
    {group:'Bottoms',id:'ss-brown-wide-trousers',name:'Wide-leg cotton trousers',colour:'Chocolate / brown',status:'wildcard',owned:true},
    {group:'Bottoms',id:'ss-tailored-shorts',name:'Simple tailored shorts',colour:'Stone / navy',status:'later',owned:false},

    {group:'Dresses',id:'ss-blue-floral-wrap',name:'Blue & white floral wrap-style midi dress',colour:'Blue / white',status:'own',owned:true},
    {group:'Dresses',id:'ss-soft-navy-midi',name:'Soft, simple midi dress',colour:'Navy',status:'later',owned:false},
    {group:'Dresses',id:'ss-soft-linen-midi',name:'Soft linen midi dress',colour:'Cream / muted blue / sage',status:'later',owned:false},

    {group:'Layers',id:'ss-stone-trench',name:'Stone / cream trench coat',colour:'Warm stone',status:'own',owned:true},
    {group:'Layers',id:'ss-blue-pinstripe-blazer',name:'Soft blue pinstripe blazer',colour:'Soft blue',status:'own',owned:true},
    {group:'Layers',id:'ss-cream-striped-blazer',name:'Cream striped blazer',colour:'Cream / fine dark stripe',status:'own',owned:true},
    {group:'Layers',id:'ss-barbour',name:'Barbour jacket',colour:'Olive / navy',status:'own',owned:true},

    {group:'Shoes & accessories',id:'ss-ariat',name:'Ariat wellies',colour:'Existing',status:'practical',owned:true},
    {group:'Shoes & accessories',id:'ss-tan-boots',name:'Tan / brown ankle boots',colour:'Tan / brown',status:'own',owned:true},
    {group:'Shoes & accessories',id:'ss-loafers',name:'Leather loafers',colour:'Tan / brown',status:'start',owned:false},
    {group:'Shoes & accessories',id:'ss-trainers',name:'Simple leather trainers',colour:'Cream / off-white',status:'later',owned:false},
    {group:'Shoes & accessories',id:'ss-sandals',name:'Flat leather sandals',colour:'Tan',status:'later',owned:false},
    {group:'Shoes & accessories',id:'ss-belt',name:'Simple leather belt',colour:'Tan / cognac',status:'own',owned:true},
    {group:'Shoes & accessories',id:'ss-crossbody',name:'Leather crossbody / everyday bag',colour:'Tan / chocolate',status:'own',owned:true}
  ];

  const awOutfits=[
    {title:'Farm, but pulled together',use:'Ordinary country day',pieces:'Cream textured knit · Light or mid-wash slim jeans · Barbour · Brown ankle boots',palette:['#eee5d3','#5d7890','#68715a','#63483e']},
    {title:'Easy workday',use:'Work without office dressing',pieces:'Soft pale-blue shirt · Smart navy trousers · Stone trench · Brown loafers',palette:['#bdd1dc','#263e53','#d2c5ae','#63483e']},
    {title:'Cold-day favourite',use:'Home, farm and errands',pieces:'Forest-green knit · Dark skinny welly jeans · Olive quilted coat · Ariat wellies',palette:['#536448','#2e4050','#68715a','#5b493e']},
    {title:'Quietly smart',use:'Lunch, appointment or pub supper',pieces:'Cream ribbed roll-neck · Navy trousers · Blue pinstripe blazer · Brown loafers',palette:['#eee8dc','#263e53','#a9c0cd','#63483e']},
    {title:'Soft country classic',use:'Weekend or a day out',pieces:'Cream/navy Breton knit · Light ankle-grazer jeans · Stone trench · Tan ankle boots',palette:['#ece6d9','#66829a','#d2c5ae','#8b654b']},
    {title:'Warm and polished',use:'Dinner or somewhere nicer',pieces:'Chocolate roll-neck · Navy trousers · Long grey coat · Brown boots',palette:['#63483e','#263e53','#787a78','#5a4034']},
    {title:'Relaxed layers',use:'Low-effort, still intentional',pieces:'Navy loose top · Denim overshirt · Navy chinos · Cream trainers',palette:['#263e53','#7692a6','#2f4355','#ece8dc']},
    {title:'The wildcard',use:'Trying the brown trousers without feeling frumpy',pieces:'Fitted cream roll-neck · Brown wide-leg trousers · Blue blazer · Sleek brown shoe',palette:['#eee8dc','#735748','#a9c0cd','#63483e']}
  ];

  const ssOutfits=[
    {title:'Everyday soft country',use:'Errands, farm or coffee',pieces:'Pale-blue soft shirt · Light ankle-grazer jeans · Tan belt · Loafers',palette:['#bdd1dc','#7692a6','#b07d55','#6d4b39']},
    {title:'Warm-day Breton',use:'Easy weekend',pieces:'Navy/white striped top · Ecru slim jeans · Stone trench · Tan loafers',palette:['#ece6d9','#e8e2d6','#d2c5ae','#6d4b39']},
    {title:'Work, softly',use:'Smart without a structured shirt',pieces:'Soft ivory blouse · Navy straight trousers · Blue blazer · Brown loafers',palette:['#efe9dc','#263e53','#a9c0cd','#6d4b39']},
    {title:'Summer dress',use:'Lunch, garden party or day out',pieces:'Blue floral wrap dress · Denim overshirt · Tan sandals · Brown bag',palette:['#7692a6','#6688a0','#b07d55','#6d4b39']},
    {title:'Simple and light',use:'Warm ordinary day',pieces:'Soft cream top · Navy chinos · Cream trainers · Tan belt',palette:['#eee8dc','#263e53','#ece8dc','#b07d55']},
    {title:'Pub-garden evening',use:'When it cools down',pieces:'Cream lightweight knit · Light jeans · Stone trench · Brown ankle boots',palette:['#eee5d3','#7692a6','#d2c5ae','#63483e']}
  ];

  const awShop=[
    {tier:'START HERE',title:'Dark indigo ankle-grazer jeans',colour:'Dark indigo',note:'Slim-straight rather than wide or bootcut. The hem should look deliberately cropped, not accidentally short.'},
    {tier:'START HERE',title:'Brown leather loafers',colour:'Tan / chocolate',note:'A useful way to make slim jeans and navy trousers feel more polished without becoming formal.'},
    {tier:'LATER',title:'Soft ivory blouse',colour:'Ivory / cream',note:'Fluid fabric, soft neckline and no stiff collar. This is the dressier alternative to a structured shirt.'},
    {tier:'LATER',title:'Soft cream short-sleeve top',colour:'Cream / ivory',note:'A draped warm-weather basic that skims rather than clings.'}
  ];

  const ssShop=[
    {tier:'START HERE',title:'Soft cream short-sleeve top',colour:'Cream / ivory',note:'A fluid everyday top for jeans, chinos and under the blazers.'},
    {tier:'START HERE',title:'Dark indigo slim ankle-grazer jeans',colour:'Dark indigo',note:'The all-season denim gap: clean, slim-straight and clearly ankle length.'},
    {tier:'LATER',title:'Ecru slim / straight jeans',colour:'Ecru',note:'Only if the shape feels as streamlined as your blue denim. No wide-leg purchase just to follow a trend.'},
    {tier:'LATER',title:'Soft ivory blouse',colour:'Ivory / muted blue',note:'Choose drape and movement over crisp poplin or Oxford cotton.'},
    {tier:'LATER',title:'Flat leather sandals',colour:'Tan',note:'Simple enough to wear with the blue floral dress, chinos and ankle-grazer denim.'}
  ];

  const currentSeason=()=>localStorage.getItem(SEASON_KEY)==='ss'?'ss':'aw';
  const currentTab=()=>localStorage.getItem(TAB_KEY)||'capsule';
  const currentItems=()=>currentSeason()==='ss'?ssCapsule:awCapsule;
  const currentKey=()=>currentSeason()==='ss'?SS_KEY:AW_KEY;

  function safeIds(key){
    try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}
  }
  function saveIds(key,ids){localStorage.setItem(key,JSON.stringify(ids))}

  function migrate(){
    if(localStorage.getItem(MIGRATION_KEY))return;
    [[AW_KEY,awCapsule],[SS_KEY,ssCapsule]].forEach(([key,items])=>{
      const valid=new Set(items.map(x=>x.id));
      const next=new Set(safeIds(key).filter(id=>valid.has(id)));
      items.filter(x=>x.owned).forEach(x=>next.add(x.id));
      saveIds(key,[...next]);
    });
    localStorage.setItem(MIGRATION_KEY,'1');
  }

  function getOwned(){
    const key=currentKey();
    const items=currentItems();
    const ids=safeIds(key);
    if(ids.length)return ids;
    return items.filter(x=>x.owned).map(x=>x.id);
  }

  function statusTag(item){
    const map={
      own:['own','Already own'],
      start:['start','Gap to fill'],
      practical:['practical','Practical'],
      wildcard:['wildcard','Wildcard'],
      later:['later','Later']
    };
    const [cls,label]=map[item.status]||map.later;
    return `<span class="fashionTag ${cls}">${label}</span>`;
  }

  function lookBoard(o){
    return `<div class="softCountryBoard" aria-hidden="true">
      <div class="softCountryBoardLine"></div>
      <div class="softCountrySwatches">${o.palette.map(c=>`<span style="--look:${c}"></span>`).join('')}</div>
      <strong>SOFT COUNTRY</strong><small>soft top · clean line · country layer</small>
    </div>`;
  }

  function injectStyles(){
    if(document.querySelector('#soft-country-fashion-styles'))return;
    const style=document.createElement('style');
    style.id='soft-country-fashion-styles';
    style.textContent=`
      .fashionSeasonTabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:4px 0 14px;padding:5px;background:rgba(255,253,248,.72);border:1px solid var(--line);border-radius:18px}
      .fashionSeasonTabs button{border:0;background:transparent;border-radius:14px;padding:12px 8px;color:var(--muted);font-weight:800;font-size:.78rem}
      .fashionSeasonTabs button.selected{background:var(--forest);color:#fff;box-shadow:0 5px 14px rgba(52,75,60,.14)}
      .fashionStyleGuide{margin:0 0 14px;padding:17px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,rgba(255,253,248,.94),rgba(237,233,220,.82))}
      .fashionStyleGuide h2{font-family:var(--serif);font-weight:400;font-size:1.5rem;margin:4px 0 8px}.fashionStyleGuide p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.55}.fashionStyleGuide strong{color:var(--ink)}
      .fashionStyleFormula{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:7px;margin-top:13px;font-size:.72rem;font-weight:800;text-align:center;color:var(--forest)}
      .fashionStyleFormula i{font-style:normal;color:var(--muted)}
      .fashionTag.practical{background:#e8efe7;color:#405844}.fashionTag.wildcard{background:#eee6d8;color:#745d43}
      .softCountryBoard{aspect-ratio:4/3;border-radius:22px;background:#f5f1e8;border:1px solid rgba(87,76,62,.08);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:9px;padding:18px;overflow:hidden;position:relative}
      .softCountryBoardLine{position:absolute;width:140%;height:1px;background:rgba(83,75,63,.13);transform:rotate(-18deg)}
      .softCountrySwatches{display:flex;gap:8px;z-index:1}.softCountrySwatches span{width:36px;height:36px;border-radius:50%;background:var(--look);border:3px solid rgba(255,255,255,.7);box-shadow:0 3px 10px rgba(64,55,44,.08)}
      .softCountryBoard strong{font-family:var(--serif);font-weight:400;letter-spacing:.08em;font-size:.82rem;z-index:1}.softCountryBoard small{color:var(--muted);font-size:.68rem;z-index:1}
      .fashionShopTarget{margin:0 0 10px;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:18px}.fashionShopTarget h3{margin:5px 0 4px;font-family:var(--serif);font-weight:400}.fashionShopTarget p{margin:0;color:var(--muted);line-height:1.5;font-size:.82rem}.fashionShopTargetTop{display:flex;justify-content:space-between;gap:8px;align-items:center}.fashionShopTargetTop span:first-child{font-size:.65rem;font-weight:900;letter-spacing:.08em;color:var(--forest)}.fashionShopTargetTop span:last-child{font-size:.72rem;color:var(--muted)}
      @media(max-width:420px){.fashionStyleFormula{grid-template-columns:1fr;gap:3px}.fashionStyleFormula i{transform:rotate(90deg)}}
    `;
    document.head.appendChild(style);
  }

  function fashionSectionHtml(){
    return `<section class="view fashionView" id="fashion">
      <div class="sectionIntro fashionIntro">
        <p class="eyebrow">MY WARDROBE</p>
        <h1><i>Soft British Country,</i> built around what you actually wear.</h1>
        <p>Relaxed, feminine and practical: soft tops, clean slim lines below, and the countryside feeling coming from colour, texture and outerwear.</p>
      </div>
      <div class="fashionSeasonTabs" role="tablist" aria-label="Wardrobe season">
        <button data-fashion-season="aw">Autumn / Winter</button><button data-fashion-season="ss">Spring / Summer</button>
      </div>
      <div class="fashionPalette" aria-label="Wardrobe colour palette">
        ${palette.map(([c,n])=>`<div><span style="--swatch:${c}"></span><small>${n}</small></div>`).join('')}
      </div>
      <div class="fashionTabs" role="tablist" aria-label="Fashion sections">
        <button data-fashion-tab="capsule">Capsule</button>
        <button data-fashion-tab="outfits">Outfits</button>
        <button data-fashion-tab="shop">Gaps</button>
      </div>
      <div id="fashionPanel"></div>
    </section>`;
  }

  function renderCapsule(){
    const panel=document.querySelector('#fashionPanel');if(!panel)return;
    const items=currentItems();
    const owned=new Set(getOwned());
    const groups=[...new Set(items.map(x=>x.group))];
    const done=items.filter(x=>owned.has(x.id)).length;
    const pct=Math.round(done/items.length*100);
    const seasonName=currentSeason()==='ss'?'SPRING / SUMMER':'AUTUMN / WINTER';
    panel.innerHTML=`
      <div class="fashionStyleGuide">
        <p class="eyebrow">YOUR STYLE RULE</p>
        <h2>Soft British Country</h2>
        <p><strong>Softness on top, a cleaner line below, structure from the outer layer.</strong> Choose drape, washed cotton, linen, jersey and fine knits over crisp Oxford or poplin shirts. Slim, straight-slim and deliberate ankle-grazer bottoms are the default; wider shapes only stay when you genuinely enjoy wearing them.</p>
        <div class="fashionStyleFormula"><span>SOFT / FLUID TOP</span><i>+</i><span>SLIM / CLEAN BOTTOM</span><i>+</i><span>COUNTRY LAYER</span></div>
      </div>
      <div class="fashionProgress card"><div><p class="eyebrow">${seasonName}</p><h2>${done} of ${items.length} pieces sorted</h2><p>This is your real wardrobe first. Gaps are deliberately small and only there when they add something useful.</p></div><div class="fashionProgressRing" style="--pct:${pct}"><strong>${pct}%</strong></div></div>
      ${groups.map(g=>`<section class="fashionGroup"><div class="fashionGroupHead"><h2>${g}</h2><span>${items.filter(x=>x.group===g).length}</span></div><div class="fashionChecklist">${items.filter(x=>x.group===g).map(item=>`<label class="fashionCheck ${owned.has(item.id)?'isOwned':''}"><input type="checkbox" data-fashion-item="${item.id}" ${owned.has(item.id)?'checked':''}><span class="fashionFakeCheck"></span><span class="fashionCheckCopy"><strong>${item.name}</strong><small>${item.colour}</small></span>${statusTag(item)}</label>`).join('')}</div></section>`).join('')}`;

    panel.querySelectorAll('[data-fashion-item]').forEach(input=>input.addEventListener('change',e=>{
      const ids=new Set(getOwned());
      e.target.checked?ids.add(e.target.dataset.fashionItem):ids.delete(e.target.dataset.fashionItem);
      saveIds(currentKey(),[...ids]);
      renderCapsule();
    }));
  }

  function renderOutfits(){
    const panel=document.querySelector('#fashionPanel');if(!panel)return;
    const looks=currentSeason()==='ss'?ssOutfits:awOutfits;
    panel.innerHTML=`<div class="fashionSectionLead"><p class="eyebrow">OUTFIT FORMULAS</p><h2>Country, but only a little.</h2><p>The aim is to feel like yourself first. Colour, texture and outerwear do the countryside work; the silhouette stays clean.</p></div><div class="fashionOutfitGrid">${looks.map(o=>`<article class="fashionOutfitCard">${lookBoard(o)}<div class="fashionOutfitCopy"><p class="eyebrow">${o.use}</p><h3>${o.title}</h3><p>${o.pieces}</p></div></article>`).join('')}</div>`;
  }

  function renderShop(){
    const panel=document.querySelector('#fashionPanel');if(!panel)return;
    const gaps=currentSeason()==='ss'?ssShop:awShop;
    panel.innerHTML=`<div class="fashionSectionLead"><p class="eyebrow">GENUINE GAPS</p><h2>Only buy what solves a real wardrobe problem.</h2><p>No shopping to satisfy a generic capsule checklist. These are the few pieces that would add something your current wardrobe does not already do.</p></div><div class="fashionShopRule"><span>THE RULE</span><strong>Do not buy crisp shirts, wide-leg trousers or bootcut jeans because a mood board says you should.</strong><small>Drape on top. Clean slim lines below. Brown leather and textured outerwear for the country note.</small></div>${gaps.map(p=>`<article class="fashionShopTarget"><div class="fashionShopTargetTop"><span>${p.tier}</span><span>${p.colour}</span></div><h3>${p.title}</h3><p>${p.note}</p></article>`).join('')}`;
  }

  function renderTab(){
    const tab=currentTab();
    document.querySelectorAll('[data-fashion-tab]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionTab===tab));
    document.querySelectorAll('[data-fashion-season]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionSeason===currentSeason()));
    if(tab==='outfits')renderOutfits();else if(tab==='shop')renderShop();else renderCapsule();
  }

  function navigateFashion(){
    if(typeof window.go==='function')window.go('fashion');
    else{
      document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='fashion'));
      document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.go==='fashion'));
      window.scrollTo(0,0);
    }
    renderTab();
  }

  function init(){
    if(document.querySelector('#fashion'))return;
    migrate();
    injectStyles();
    const main=document.querySelector('main');if(!main)return;
    const settings=document.querySelector('#settings');
    const wrapper=document.createElement('div');wrapper.innerHTML=fashionSectionHtml().trim();
    const section=wrapper.firstElementChild;
    if(settings)main.insertBefore(section,settings);else main.appendChild(section);

    const nav=document.querySelector('.bottomNav');
    const myLife=nav?.querySelector('.nav[data-go="things"]');
    if(nav&&!nav.querySelector('[data-go="fashion"]')){
      const btn=document.createElement('button');
      btn.className='nav fashionNav';btn.dataset.go='fashion';
      btn.innerHTML='<span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.4c0-1.8 1.1-3.2 3-3.2s3 1.2 3 2.8c0 1.1-.6 2-1.8 2.6l-1.2.7v1.4" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="currentColor" opacity=".15"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg></span><span class="navLabel">Fashion</span>';
      btn.addEventListener('click',navigateFashion);
      myLife?nav.insertBefore(btn,myLife):nav.appendChild(btn);
    }

    const thingGrid=document.querySelector('#things .thingGrid');
    if(thingGrid&&!thingGrid.querySelector('[data-fashion-link]')){
      const btn=document.createElement('button');
      btn.className='thing fashionThing';btn.dataset.fashionLink='true';
      btn.innerHTML='<b class="fashionThingIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.4c0-1.8 1.1-3.2 3-3.2s3 1.2 3 2.8c0 1.1-.6 2-1.8 2.6l-1.2.7v1.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></b><span><strong>My Wardrobe</strong><small>Soft British Country capsule, outfits and genuine gaps.</small></span>';
      btn.addEventListener('click',navigateFashion);
      const ideas=thingGrid.querySelector('[data-go="ideas"]');
      ideas?thingGrid.insertBefore(btn,ideas):thingGrid.appendChild(btn);
    }

    const homeCopy=document.querySelector('.homeHero > p:last-child');
    if(homeCopy&&!/fashion/i.test(homeCopy.textContent))homeCopy.textContent='Food, health, Hugo, sewing, fashion and the things that feel like yours.';

    section.querySelectorAll('[data-fashion-tab]').forEach(b=>b.addEventListener('click',()=>{
      localStorage.setItem(TAB_KEY,b.dataset.fashionTab);renderTab();
    }));
    section.querySelectorAll('[data-fashion-season]').forEach(b=>b.addEventListener('click',()=>{
      localStorage.setItem(SEASON_KEY,b.dataset.fashionSeason==='ss'?'ss':'aw');renderTab();
    }));

    renderTab();
    const params=new URLSearchParams(location.search);
    if(params.get('fashion'))navigateFashion();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();