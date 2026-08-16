(() => {
  const STORAGE_KEY = 'elsewhere_fashion_capsule_v1';
  const TAB_KEY = 'elsewhere_fashion_tab_v1';

  const capsule = [
    {group:'Outerwear', id:'barbour-wax', name:'Olive Barbour wax jacket', colour:'Olive / khaki', status:'own'},
    {group:'Outerwear', id:'barbour-second', name:'Second Barbour or quilted jacket', colour:'Navy / olive', status:'own'},
    {group:'Outerwear', id:'tweed-blazer', name:'Relaxed Harris Tweed or herringbone blazer', colour:'Shale / stone / muted olive', status:'start'},
    {group:'Outerwear', id:'wool-coat', name:'Long wool coat', colour:'Navy', status:'invest'},

    {group:'Knitwear', id:'cream-cable', name:'Chunky cable or fisherman jumper', colour:'Cream', status:'start'},
    {group:'Knitwear', id:'oatmeal-lambswool', name:'Lambswool crew-neck jumper', colour:'Oatmeal', status:'start'},
    {group:'Knitwear', id:'navy-merino', name:'Fine merino crew-neck jumper', colour:'Navy', status:'start'},
    {group:'Knitwear', id:'blue-knit', name:'Soft merino or cashmere knit', colour:'Powder blue', status:'later'},
    {group:'Knitwear', id:'olive-cardigan', name:'Relaxed ribbed cardigan', colour:'Olive / khaki', status:'later'},
    {group:'Knitwear', id:'cream-halfzip', name:'Knitted polo or half-zip', colour:'Cream / warm stone', status:'later'},

    {group:'Shirts & tops', id:'white-oxford', name:'Relaxed Oxford shirt', colour:'White', status:'later'},
    {group:'Shirts & tops', id:'blue-oxford', name:'Oxford shirt', colour:'Pale blue', status:'start'},
    {group:'Shirts & tops', id:'stripe-oxford', name:'Striped Oxford or poplin shirt', colour:'Blue / white', status:'start'},
    {group:'Shirts & tops', id:'chambray-shirt', name:'Chambray shirt', colour:'Washed blue', status:'later'},
    {group:'Shirts & tops', id:'breton', name:'Breton long-sleeve top', colour:'Cream / navy', status:'later'},
    {group:'Shirts & tops', id:'cream-tee', name:'Heavyweight T-shirt', colour:'Cream', status:'later'},

    {group:'Bottoms', id:'dark-straight-jeans', name:'Straight-leg jeans', colour:'Dark indigo', status:'start'},
    {group:'Bottoms', id:'mid-straight-jeans', name:'Relaxed straight-leg jeans', colour:'Mid blue', status:'later'},
    {group:'Bottoms', id:'wide-jeans', name:'Wide-leg jeans', colour:'Dark indigo', status:'later'},
    {group:'Bottoms', id:'olive-cords', name:'Cord trousers', colour:'Olive', status:'start'},
    {group:'Bottoms', id:'wool-trousers', name:'Tailored wool trousers', colour:'Chocolate / taupe', status:'later'},
    {group:'Bottoms', id:'chinos', name:'Chinos', colour:'Stone / khaki', status:'later'},
    {group:'Bottoms', id:'wool-midi', name:'Wool midi skirt or kilt', colour:'Oatmeal / taupe / Black Watch', status:'later'},

    {group:'Dresses', id:'navy-shirt-dress', name:'Midi shirt dress', colour:'Navy', status:'later'},
    {group:'Dresses', id:'muted-print-dress', name:'Soft country-print midi dress', colour:'Navy / cream or sage / blue', status:'later'},

    {group:'Shoes', id:'ariat-wellies', name:'Ariat wellies', colour:'Existing', status:'own'},
    {group:'Shoes', id:'chelsea-boots', name:'Leather or suede Chelsea boots', colour:'Dark chocolate', status:'start'},
    {group:'Shoes', id:'loafers', name:'Leather penny or saddle loafers', colour:'Tan / chocolate', status:'start'},
    {group:'Shoes', id:'cream-trainers', name:'Simple leather trainers', colour:'Cream / off-white', status:'later'},
    {group:'Shoes', id:'knee-boots', name:'Knee-high leather boots', colour:'Chocolate', status:'invest'},

    {group:'Accessories', id:'leather-belt', name:'Simple leather belt', colour:'Cognac / tan', status:'start'},
    {group:'Accessories', id:'everyday-bag', name:'Leather or suede everyday bag', colour:'Tan / chocolate', status:'invest'},
    {group:'Accessories', id:'wool-scarf', name:'Wool or cashmere scarf', colour:'Cream / navy / olive', status:'later'},
    {group:'Accessories', id:'silk-scarf', name:'Silk square scarf', colour:'Navy / cream / khaki', status:'later'}
  ];

  const defaultOwned = ['barbour-wax','barbour-second','ariat-wellies'];

  const outfits = [
    {title:'Farm, but polished', use:'Ordinary farm day', top:'Cream cable knit', bottom:'Dark straight jeans', outer:'Olive Barbour', shoe:'Chocolate Chelsea boots', palette:['#efe8d5','#2f4355','#65705b','#64483a']},
    {title:'Village errands', use:'Coffee, errands, casual lunch', top:'Pale-blue Oxford', bottom:'Mid-blue jeans', outer:'Cognac belt', shoe:'Brown loafers', palette:['#c5d5df','#5f7890','#b67d50','#654638']},
    {title:'Cold ordinary day', use:'Home, farm and popping out', top:'Oatmeal lambswool', bottom:'Olive cords', outer:'Navy Barbour', shoe:'Chocolate Chelsea boots', palette:['#d8cdb9','#66705a','#293f53','#5b4034']},
    {title:'Lunch or work', use:'When jeans need to look intentional', top:'Blue-striped Oxford', bottom:'Dark wide-leg denim', outer:'Herringbone blazer', shoe:'Brown loafers', palette:['#dbe4e8','#243b52','#989182','#6b4b39']},
    {title:'Quietly smart', use:'Work, appointment or pub supper', top:'Cream fine knit', bottom:'Chocolate wool trousers', outer:'Olive Barbour', shoe:'Brown loafers', palette:['#f0eadc','#654d45','#65705b','#6b4a37']},
    {title:'Soft colour', use:'Easy but a little more feminine', top:'Powder-blue knit', bottom:'Dark indigo denim', outer:'Tweed blazer', shoe:'Brown ankle boots', palette:['#b9ceda','#273e53','#9e9584','#664739']},
    {title:'Spring Dorset', use:'A dry day, town or garden centre', top:'Chambray shirt', bottom:'Stone chinos', outer:'Cognac belt', shoe:'Cream trainers', palette:['#7897aa','#d5c9b3','#a36f48','#eee9dc']},
    {title:'A bit feminine', use:'Lunch, weekend or somewhere nice', top:'Navy merino', bottom:'Wool midi skirt', outer:'Olive Barbour', shoe:'Chocolate knee boots', palette:['#263c50','#aaa08f','#66715c','#5f4034']},
    {title:'Easy weekend', use:'Low-effort, still put together', top:'Cream/navy Breton', bottom:'Olive cords', outer:'Navy quilted Barbour', shoe:'Brown loafers', palette:['#e9e4d7','#69745e','#30465a','#694a39']},
    {title:'Actually dressed', use:'Dinner, family plans or a day out', top:'Navy shirt dress', bottom:'Cognac belt', outer:'Olive Barbour', shoe:'Chocolate knee boots', palette:['#263c50','#a46f47','#65705b','#5e4034']}
  ];

  const shop = [
    {for:'tweed-blazer', tier:'INVEST', title:'Walker Slater Iona Harris Tweed Jacket', colour:'Herringbone Shale', price:'£345', note:'The hero blazer: proper Harris Tweed, quiet colour and easy with denim.', url:'https://www.walkerslater.com/iona-jacket-harris-tweed-herringbone-shale'},
    {for:'wool-coat', tier:'MID', title:'M&S Autograph Wool Blend Longline Tailored Coat', colour:'Choose navy if available', price:'£150', note:'A sensible mid-price route to the long wool coat rather than starting with designer.', url:'https://www.marksandspencer.com/l/women/coats-and-jackets/fs5/wool'},

    {for:'cream-cable', tier:'MID', title:'Barbour Hartland Crew Neck Jumper', colour:'Cloud', price:'£64', was:'was £79.95', note:'A soft cream cable knit that reads country without becoming costume.', url:'https://www.barbour.com/gb/hartland-crew-neck-jumper-LKN1630WH71.html'},
    {for:'oatmeal-lambswool', tier:'INVEST', title:'Celtic & Co Lambswool Shawl Collar Jumper', colour:'Oatmeal', price:'£119', note:'100% lambswool with a relaxed longer-line shape; buy this for texture and warmth.', url:'https://www.celticandco.com/product/lambswool-shawl-collar-jumper'},
    {for:'navy-merino', tier:'SAVE', title:'UNIQLO 100% Merino Crew Neck Jumper', colour:'Navy', price:'£34.90', note:'Exactly where I would save: fine 100% merino that layers under Barbour and tailoring.', url:'https://www.uniqlo.com/uk/en/products/E473154-000/00?colorDisplayCode=69'},
    {for:'blue-knit', tier:'SAVE', title:'UNIQLO 100% Merino Crew Neck Jumper', colour:'Soft blue', price:'£34.90', note:'The same useful merino formula in blue; some colourways are periodically reduced.', url:'https://www.uniqlo.com/uk/en/products/E469410-000/01'},
    {for:'olive-cardigan', tier:'MID', title:'Seasalt Cornwall Merino Wool Rich Crew Neck Cardigan at M&S', colour:'Green', price:'£69.95', note:'A neat, soft green layer for shirts, dresses and your Breton top.', url:'https://www.marksandspencer.com/merino-wool-rich-crew-neck-cardigan/p/clp23059563?color=GREEN'},
    {for:'cream-halfzip', tier:'MID', title:'Barbour International Rae Quarter-Zip Jumper', colour:'Bone White', price:'£76', was:'was £109', note:'A relaxed 100% cotton moss-stitch half zip for the sportier side of the capsule.', url:'https://www.barbour.com/gb/rae-quarter-zip-jumper-LKN1737CR7112.html'},

    {for:'white-oxford', tier:'INVEST', title:'With Nothing Underneath Classic Oxford', colour:'White', price:'£95', note:'A relaxed white Oxford worth considering once you know this is a silhouette you wear often.', url:'https://www.withnothingunderneath.com/products/the-classic-oxford-white'},
    {for:'blue-oxford', tier:'INVEST', title:'With Nothing Underneath Classic Oxford', colour:'Celeste Blue', price:'£95', note:'The more luxurious version of the relaxed pale-blue shirt in the capsule.', url:'https://www.withnothingunderneath.com/products/the-classic-oxford-celeste-blue'},
    {for:'stripe-oxford', tier:'INVEST', title:'With Nothing Underneath Classic Fine Poplin', colour:'Royal Blue Stripe', price:'£95', note:'Beautiful if the striped shirt becomes one of your most-worn pieces.', url:'https://www.withnothingunderneath.com/products/the-classic-fine-poplin-royal-blue-stripe'},
    {for:'stripe-oxford', tier:'SAVE', title:'M&S Striped Shirt Edit', colour:'Blue / white', price:'Around £22+', note:'Try the shape cheaply first before deciding whether the £95 shirt earns its place.', url:'https://www.marksandspencer.com/l/women/tops/fs5/striped-shirt'},
    {for:'chambray-shirt', tier:'MID', title:'French Connection Pure Cotton Chambray Shirt at M&S', colour:'Blue', price:'£65', note:'Relaxed, collared and 100% cotton; an easy washed-blue layer without leaning into denim-on-denim.', url:'https://www.marksandspencer.com/pure-cotton-shirt/p/clp23068532'},
    {for:'breton', tier:'SAVE', title:'Seasalt Cornwall Sailor Shirt', colour:'Cream / navy stripe', price:'£29.95', note:'A proper everyday Breton in organic cotton jersey; useful with cords, chinos and denim.', url:'https://www.seasaltcornwall.com/sailor-striped-breton-top'},
    {for:'cream-tee', tier:'SAVE', title:'UNIQLO Crew Neck T-Shirt', colour:'Off-white / natural', price:'£14.90', note:'Heavyweight-feeling cotton basic; this is not a piece that needs a luxury label.', url:'https://www.uniqlo.com/uk/en/products/E424873-000/00'},

    {for:'dark-straight-jeans', tier:'MID', title:'Boden High Rise Straight Jeans', colour:'Indigo Rinse', price:'£89', note:'A clean dark straight leg that works with loafers, boots and the tweed blazer.', url:'https://www.boden.com/products/women-high-rise-straight-jeans-indigo-rinse-r1012ddn'},
    {for:'mid-straight-jeans', tier:'MID', title:'Boden Mid Rise Relaxed Jeans', colour:'Indigo', price:'£99', note:'Your softer everyday denim: relaxed without becoming baggy or scruffy.', url:'https://www.boden.com/products/women-mid-rise-relaxed-jeans-indigo-r0729ind'},
    {for:'wide-jeans', tier:'MID', title:'Boden High Rise Wide Leg Jeans', colour:'Indigo Rinse', price:'£99', note:'The jean that changes the silhouette most while keeping you in familiar denim.', url:'https://www.boden.com/products/women-high-rise-wide-leg-jeans-indigo-rinse-r0657ddn'},
    {for:'olive-cords', tier:'SAVE', title:'M&S Cord Trousers', colour:'Choose olive / green', price:'£28–£36', note:'The easiest route away from wearing jeans every day without feeling dressed up.', url:'https://www.marksandspencer.com/l/women/trousers/fs5/cords'},
    {for:'wool-trousers', tier:'INVEST', title:'Walker Slater Westray Wool / Cashmere Trousers', colour:'Brown, navy or muted check', price:'from £99', was:'usually £165', note:'Proper heritage tailoring for the quiet-smart side of the capsule; current sale fabrics vary.', url:'https://www.walkerslater.com/sale/westray'},
    {for:'chinos', tier:'SAVE', title:'M&S Stretch Straight Leg Chinos', colour:'Dark Sage or stone', price:'£28', note:'An inexpensive spring and summer alternative to denim with multiple leg lengths.', url:'https://www.marksandspencer.com/cotton-rich-straight-leg-chinos/p/clp60634040?color=DARKSAGE'},
    {for:'wool-midi', tier:'INVEST', title:'Celtic & Co Midi Celt Kilt', colour:'Cairngorm Black Watch', price:'£155', note:'Heritage, but modern once you keep the knit and boots plain.', url:'https://www.celticandco.com/products/midi-celt-kilt'},

    {for:'navy-shirt-dress', tier:'MID', title:'Boden Alexa Cotton Midi Shirt Dress', colour:'Navy', price:'£129', note:'A practical way into dresses: sleeves, structure, pockets and a waist without feeling fussy.', url:'https://www.boden.com/products/women-alexa-cotton-midi-shirt-dress-navy-d1511nst'},
    {for:'muted-print-dress', tier:'SALE FIND', title:'Boden Alexa Cotton Midi Shirt Dress', colour:'Navy Petal Terrace', price:'£97.30', was:'was £139', note:'The patterned dress slot: navy-based, muted enough to sit happily with brown boots and olive outerwear.', url:'https://www.boden.com/products/women-alexa-cotton-midi-shirt-dress-navy-petal-terrace-d1511nvy'},

    {for:'chelsea-boots', tier:'SALE FIND', title:'Penelope Chilvers Rove Suede Chelsea Boots at Next', colour:'Chocolate', price:'£125', was:'was £259', note:'A particularly strong current buy: polished country shape without looking like riding boots.', url:'https://www.next.co.uk/style/su516173/at5516'},
    {for:'loafers', tier:'SAVE', title:'M&S Leather Loafers', colour:'Brown', price:'£65', note:'A small switch that makes jeans look like an outfit rather than a default.', url:'https://www.marksandspencer.com/leather-saddle-slip-on-loafer/p/clp60720328?color=BROWN'},
    {for:'cream-trainers', tier:'SAVE', title:'M&S Leather Stripe Trainers', colour:'Cream Mix', price:'£50', note:'Leather, neutral and practical for the casual end of the capsule.', url:'https://www.marksandspencer.com/leather-stripe-trainers/p/clp60713051?color=CREAMMIX'},
    {for:'knee-boots', tier:'INVEST', title:'Jones Bootmaker Leather Block Heel Knee High Boots at M&S', colour:'Brown', price:'£180', note:'A later purchase for skirts and dresses; real leather and simple enough not to date quickly.', url:'https://www.marksandspencer.com/leather-block-heel-knee-high-boots/p/clp22548720'},

    {for:'leather-belt', tier:'SAVE', title:'M&S Leather Casual Belt', colour:'Tan', price:'£22', note:'Simple real leather; exactly the kind of quiet finishing piece this wardrobe needs.', url:'https://www.marksandspencer.com/leather-casual-belt/p/clp60587140?color=TAN'},
    {for:'everyday-bag', tier:'LATER', title:'Fairfax & Favor Windsor', colour:'Tan', price:'£395', note:'A later investment, not a first purchase. Let the wardrobe earn this one.', url:'https://www.fairfaxandfavor.com/products/the-windsor-tan'},
    {for:'wool-scarf', tier:'SAVE', title:'Barbour Tartan Lambswool Scarf', colour:'Black Watch', price:'£31.95', note:'100% lambswool and enough heritage detail to finish a plain cream/navy outfit.', url:'https://www.barbour.com/gb/womens/accessories/scarves-wraps'},
    {for:'silk-scarf', tier:'MID', title:'Jaeger Pure Silk Geometric Scarf at M&S', colour:'Blue', price:'£59', note:'Use this sparingly at the neck, on a bag handle or tucked into a shirt collar.', url:'https://www.marksandspencer.com/pure-silk-geometric-scarf/p/clp60780621?color=BLUE'}
  ];

  function getOwned(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [...defaultOwned];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...defaultOwned];
    } catch { return [...defaultOwned]; }
  }
  function setOwned(ids){ localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); }

  function statusLabel(item){
    if(item.status==='own') return '<span class="fashionTag own">Already own</span>';
    if(item.status==='start') return '<span class="fashionTag start">Start here</span>';
    if(item.status==='invest') return '<span class="fashionTag invest">Invest</span>';
    return '<span class="fashionTag later">Later</span>';
  }

  function outfitArt(o){
    const [a,b,c,d]=o.palette;
    return `<svg class="fashionOutfitArt" viewBox="0 0 360 220" role="img" aria-label="Illustrated outfit board for ${o.title}">
      <rect x="0" y="0" width="360" height="220" rx="24" fill="#f5f1e8"/>
      <path d="M55 36l28-14 28 14 23 30-17 12-12-16v87H61V62L49 78 32 66z" fill="${a}" stroke="#756f64" stroke-width="1.4"/>
      <path d="M71 32c6 11 18 11 24 0" fill="none" stroke="#756f64" stroke-width="1.4"/>
      <path d="M152 42h51l12 108h-29l-8-68-8 68h-30z" fill="${b}" stroke="#68665f" stroke-width="1.4"/>
      <path d="M233 37l29-12 29 12 19 30-14 9-11-17v88h-48V59l-11 17-14-9z" fill="${c}" opacity=".94" stroke="#68665f" stroke-width="1.4"/>
      <path d="M238 49l23 25 24-25" fill="none" stroke="#f4f0e8" stroke-width="1.3" opacity=".7"/>
      <path d="M58 173c17-1 30 2 39 10l-4 14H52c-7-5-5-18 6-24z" fill="${d}" stroke="#62584e" stroke-width="1.4"/>
      <path d="M110 173c17-1 30 2 39 10l-4 14h-41c-7-5-5-18 6-24z" fill="${d}" stroke="#62584e" stroke-width="1.4"/>
      <circle cx="326" cy="36" r="6" fill="${a}"/><circle cx="326" cy="56" r="6" fill="${b}"/><circle cx="326" cy="76" r="6" fill="${c}"/><circle cx="326" cy="96" r="6" fill="${d}"/>
      <text x="326" y="132" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#7a776e">DORSET</text>
      <text x="326" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#7a776e">CAPSULE</text>
    </svg>`;
  }

  function fashionSectionHtml(){
    return `<section class="view fashionView" id="fashion">
      <div class="sectionIntro fashionIntro">
        <p class="eyebrow">MY WARDROBE</p>
        <h1>A Dorset country capsule that feels like <i>you.</i></h1>
        <p>Cream, khaki, olive, navy, soft blues and good brown leather. Practical enough for farm life, polished enough for everywhere else.</p>
      </div>
      <div class="fashionPalette" aria-label="Wardrobe colour palette">
        ${[['#f2ecdf','Cream'],['#d4c7ad','Oatmeal'],['#85846b','Khaki'],['#68715a','Olive'],['#263e53','Navy'],['#b9cfdb','Soft blue'],['#526d86','Indigo'],['#63483e','Chocolate']].map(([c,n])=>`<div><span style="--swatch:${c}"></span><small>${n}</small></div>`).join('')}
      </div>
      <div class="fashionTabs" role="tablist" aria-label="Fashion sections">
        <button data-fashion-tab="capsule">Capsule</button>
        <button data-fashion-tab="outfits">Outfits</button>
        <button data-fashion-tab="shop">Shop</button>
      </div>
      <div id="fashionPanel"></div>
    </section>`;
  }

  function renderCapsule(){
    const panel=document.querySelector('#fashionPanel'); if(!panel) return;
    const owned=new Set(getOwned());
    const total=capsule.length, done=capsule.filter(x=>owned.has(x.id)).length;
    const groups=[...new Set(capsule.map(x=>x.group))];
    panel.innerHTML=`
      <div class="fashionProgress card">
        <div><p class="eyebrow">BUILD IT SLOWLY</p><h2>${done} of ${total} pieces sorted</h2><p>Tick what you already own or buy. Your checklist stays saved on this device.</p></div>
        <div class="fashionProgressRing" style="--pct:${Math.round(done/total*100)}"><strong>${Math.round(done/total*100)}%</strong></div>
      </div>
      <div class="fashionNote"><strong>Your first eight:</strong> cream knit, dark straight jeans, pale/striped Oxford, chocolate Chelsea boots, brown loafers, cognac belt, olive cords and a tweed blazer.</div>
      ${groups.map(g=>`<section class="fashionGroup"><div class="fashionGroupHead"><h2>${g}</h2><span>${capsule.filter(x=>x.group===g).length}</span></div><div class="fashionChecklist">${capsule.filter(x=>x.group===g).map(item=>`<label class="fashionCheck ${owned.has(item.id)?'isOwned':''}"><input type="checkbox" data-fashion-item="${item.id}" ${owned.has(item.id)?'checked':''}><span class="fashionFakeCheck"></span><span class="fashionCheckCopy"><strong>${item.name}</strong><small>${item.colour}</small></span>${statusLabel(item)}</label>`).join('')}</div></section>`).join('')}`;
    panel.querySelectorAll('[data-fashion-item]').forEach(input=>input.addEventListener('change',e=>{
      const ids=new Set(getOwned());
      e.target.checked?ids.add(e.target.dataset.fashionItem):ids.delete(e.target.dataset.fashionItem);
      setOwned([...ids]); renderCapsule();
    }));
  }

  function renderOutfits(){
    const panel=document.querySelector('#fashionPanel'); if(!panel) return;
    panel.innerHTML=`<div class="fashionSectionLead"><p class="eyebrow">OUTFIT BOARDS</p><h2>What getting dressed can look like.</h2><p>These are deliberately normal-day outfits — not costumes for a life you don't actually live.</p></div><div class="fashionOutfitGrid">${outfits.map(o=>`<article class="fashionOutfitCard">${outfitArt(o)}<div class="fashionOutfitCopy"><p class="eyebrow">${o.use}</p><h3>${o.title}</h3><p>${o.top} · ${o.bottom} · ${o.outer} · ${o.shoe}</p></div></article>`).join('')}</div>`;
  }

  function renderShop(){
    const panel=document.querySelector('#fashionPanel'); if(!panel) return;
    const firstIds=new Set(['tweed-blazer','cream-cable','blue-oxford','stripe-oxford','dark-straight-jeans','olive-cords','chelsea-boots','loafers','leather-belt']);
    panel.innerHTML=`
      <div class="fashionSectionLead"><p class="eyebrow">SHOP THE CAPSULE</p><h2>Spend where it matters. Cheat where it doesn't.</h2><p>Shortlist checked 16 August 2026. Prices and stock can change, so retailer pages are the source of truth when you buy.</p></div>
      <div class="fashionShopRule"><span>My rule for this wardrobe</span><strong>Investment: blazer, boots, coat and eventually the bag.</strong><small>Save on shirts, basic merino, cords and loafers until you know which shapes you genuinely wear.</small></div>
      <h2 class="fashionShopHeading">Start here</h2>
      <div class="fashionShopGrid">${shop.filter(p=>firstIds.has(p.for)).map(shopCard).join('')}</div>
      <h2 class="fashionShopHeading">The rest of the capsule</h2>
      <div class="fashionShopGrid">${shop.filter(p=>!firstIds.has(p.for)).map(shopCard).join('')}</div>`;
  }

  function shopCard(p){
    return `<article class="fashionProduct"><div class="fashionProductTop"><span class="fashionTier">${p.tier}</span><span class="fashionPrice">${p.price}${p.was?` <small>${p.was}</small>`:''}</span></div><h3>${p.title}</h3><p class="fashionProductColour">${p.colour}</p><p>${p.note}</p><a href="${p.url}" target="_blank" rel="noopener noreferrer">View at retailer <span>↗</span></a></article>`;
  }

  function setTab(tab){
    localStorage.setItem(TAB_KEY,tab);
    document.querySelectorAll('[data-fashion-tab]').forEach(b=>b.classList.toggle('selected',b.dataset.fashionTab===tab));
    if(tab==='outfits') renderOutfits(); else if(tab==='shop') renderShop(); else renderCapsule();
  }

  function navigateFashion(){
    if(typeof window.go==='function') window.go('fashion');
    else {
      document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='fashion'));
      document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.go==='fashion'));
      window.scrollTo(0,0);
    }
    setTab(localStorage.getItem(TAB_KEY)||'capsule');
  }

  function init(){
    if(document.querySelector('#fashion')) return;
    const main=document.querySelector('main'); if(!main) return;
    const settings=document.querySelector('#settings');
    const wrapper=document.createElement('div'); wrapper.innerHTML=fashionSectionHtml().trim();
    const section=wrapper.firstElementChild;
    if(settings) main.insertBefore(section,settings); else main.appendChild(section);

    const nav=document.querySelector('.bottomNav');
    const myLife=nav?.querySelector('.nav[data-go="things"]');
    if(nav && !nav.querySelector('[data-go="fashion"]')){
      const btn=document.createElement('button');
      btn.className='nav fashionNav'; btn.dataset.go='fashion';
      btn.innerHTML='<span class="navIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.4c0-1.8 1.1-3.2 3-3.2s3 1.2 3 2.8c0 1.1-.6 2-1.8 2.6l-1.2.7v1.4" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="currentColor" opacity=".15"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg></span><span class="navLabel">Fashion</span>';
      btn.addEventListener('click',navigateFashion);
      myLife?nav.insertBefore(btn,myLife):nav.appendChild(btn);
    }

    const thingGrid=document.querySelector('#things .thingGrid');
    if(thingGrid && !thingGrid.querySelector('[data-fashion-link]')){
      const btn=document.createElement('button');
      btn.className='thing fashionThing'; btn.dataset.fashionLink='true';
      btn.innerHTML='<b class="fashionThingIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.4c0-1.8 1.1-3.2 3-3.2s3 1.2 3 2.8c0 1.1-.6 2-1.8 2.6l-1.2.7v1.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 9.7 3.8 16.1c-.9.7-.4 2.1.8 2.1h14.8c1.2 0 1.7-1.4.8-2.1L12 9.7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></b><span><strong>My Wardrobe</strong><small>Capsule checklist, outfit boards and shopping shortlist.</small></span>';
      btn.addEventListener('click',navigateFashion);
      const ideas=thingGrid.querySelector('[data-go="ideas"]');
      ideas?thingGrid.insertBefore(btn,ideas):thingGrid.appendChild(btn);
    }

    const homeCopy=document.querySelector('.homeHero > p:last-child');
    if(homeCopy && !/fashion/i.test(homeCopy.textContent)) homeCopy.textContent='Food, health, Hugo, sewing, fashion and the things that feel like yours.';

    document.querySelectorAll('[data-fashion-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.fashionTab)));
    setTab(localStorage.getItem(TAB_KEY)||'capsule');

    const params=new URLSearchParams(location.search);
    if(params.get('fashion')) navigateFashion();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();