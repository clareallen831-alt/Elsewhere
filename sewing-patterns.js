(() => {
  const SECTION_ID='sewingBeginnerPatterns';

  const patterns=[
    {
      step:'1',
      name:'Ava Skirt',
      maker:'Sew Over It',
      level:'Absolute beginner',
      make:'Navy or olive midi skirt',
      why:'Only a few pattern pieces and a genuinely wearable first garment. Make it in denim or cotton first, then try wool later.',
      url:'https://sewoverit.com/products/ava-skirt-pdf-sewing-pattern'
    },
    {
      step:'2',
      name:'Samara Top',
      maker:'Tilly and the Buttons',
      level:'Beginner',
      make:'Cream linen or pale-blue cotton top',
      why:'Relaxed, dropped-shoulder shape with straightforward construction. An easy capsule top for chinos, jeans and skirts.',
      url:'https://shop.tillyandthebuttons.com/collections/sewing-patterns/products/samara'
    },
    {
      step:'3',
      name:'The 101 Trousers',
      maker:'Merchant & Mills',
      level:'Beginner',
      make:'Olive needlecord or stone linen trousers',
      why:'A simple trouser pattern with straight, tapered and shorts options. A useful route into making trousers without starting with a zip fly.',
      url:'https://merchantandmills.com/uk/the-101-trouser-pdf'
    },
    {
      step:'4',
      name:'The Top 64',
      maker:'Merchant & Mills',
      level:'Beginner',
      make:'Olive twill, cream heavy linen or soft herringbone',
      why:'Part fisherman top, part relaxed jacket. It fits the quiet British-country feel of the capsule particularly well.',
      url:'https://merchantandmills.com/uk/the-top-64-pdf'
    },
    {
      step:'5',
      name:'Frida Shirt',
      maker:'Tilly and the Buttons',
      level:'Next step',
      make:'Pale-blue Oxford, blue stripe or forest green',
      why:'A relaxed proper shirt with collar, cuffs and button plackets. Save this until the basics feel familiar, then use it to level up.',
      url:'https://tillyandthebuttons.com/products/frida-shirt-sewing-pattern'
    },
    {
      step:'6',
      name:'The Trapeze Dress',
      maker:'Merchant & Mills',
      level:'Beginner',
      make:'Navy linen, chambray or muted wool',
      why:'A simple slip-over dress whose personality changes completely with the fabric. Easy to style with boots, loafers or a Barbour.',
      url:'https://merchantandmills.com/uk/the-trapeze'
    }
  ];

  const later={
    name:'Winnie Trousers',
    maker:'Tilly and the Buttons',
    make:'Try the barrel-leg shape before committing',
    url:'https://shop.tillyandthebuttons.com/products/winnie-trousers-sewing-pattern'
  };

  function injectStyles(){
    if(document.querySelector('#sewing-pattern-styles'))return;
    const style=document.createElement('style');
    style.id='sewing-pattern-styles';
    style.textContent=`
      .sewingPatternCard{margin-top:14px}
      .sewingPatternIntro{color:var(--muted);font-size:.9rem;line-height:1.5;margin:5px 0 15px}
      .sewingPatternRoute{display:grid;gap:9px}
      .sewingPattern{border:1px solid var(--line);background:rgba(255,253,248,.68);border-radius:17px;padding:14px}
      .sewingPatternTop{display:flex;gap:10px;align-items:flex-start}
      .sewingPatternStep{width:28px;height:28px;flex:0 0 28px;border-radius:50%;display:grid;place-items:center;background:var(--sage2);color:var(--forest);font-family:var(--serif);font-size:.9rem}
      .sewingPatternTitle{min-width:0;flex:1}
      .sewingPatternTitle strong,.sewingPatternTitle small{display:block}
      .sewingPatternTitle strong{font-family:var(--serif);font-size:1.08rem;font-weight:400;line-height:1.2}
      .sewingPatternTitle small{color:var(--muted);font-size:.7rem;margin-top:3px}
      .sewingPatternLevel{font-size:.55rem;letter-spacing:.08em;text-transform:uppercase;font-weight:850;padding:5px 7px;border-radius:999px;background:#e9dfce;color:#775c3c;white-space:nowrap}
      .sewingPatternMake{margin:11px 0 5px;font-size:.78rem;font-weight:800;color:#536256}
      .sewingPatternWhy{margin:0;color:var(--muted);font-size:.82rem;line-height:1.47}
      .sewingPatternLink{display:flex;align-items:center;justify-content:space-between;text-decoration:none;margin-top:11px;background:var(--sage);color:var(--forest);border-radius:12px;padding:10px 11px;font-size:.76rem;font-weight:800}
      .sewingLater{margin-top:12px;padding:13px 14px;border-radius:16px;background:#ece7da;color:#5d554b;font-size:.82rem;line-height:1.45}
      .sewingLater strong{display:block;font-family:var(--serif);font-size:1rem;font-weight:400;color:#4d493f;margin-bottom:3px}
      .sewingLater a{color:var(--forest);font-weight:800;text-decoration:none}
    `;
    document.head.appendChild(style);
  }

  function render(){
    const sew=document.querySelector('#sew');
    if(!sew||document.querySelector(`#${SECTION_ID}`))return;
    const wishlist=document.querySelector('#sewWishlist')?.closest('.card');
    const projects=document.querySelector('#sewProjects')?.closest('.card');
    if(!wishlist&&!projects)return;

    const section=document.createElement('div');
    section.className='card sewingPatternCard';
    section.id=SECTION_ID;
    section.innerHTML=`
      <p class="eyebrow">BEGINNER PATTERNS FOR MY CAPSULE</p>
      <h2>Learn by making things I will actually wear.</h2>
      <p class="sewingPatternIntro">A gentle route from a first skirt to a proper shirt. The colours and fabrics are chosen to sit inside the Elsewhere capsule rather than becoming separate “practice” clothes.</p>
      <div class="sewingPatternRoute">
        ${patterns.map(p=>`
          <article class="sewingPattern">
            <div class="sewingPatternTop">
              <span class="sewingPatternStep">${p.step}</span>
              <div class="sewingPatternTitle"><strong>${p.name}</strong><small>${p.maker}</small></div>
              <span class="sewingPatternLevel">${p.level}</span>
            </div>
            <p class="sewingPatternMake">MAKE IT: ${p.make}</p>
            <p class="sewingPatternWhy">${p.why}</p>
            <a class="sewingPatternLink" href="${p.url}" target="_blank" rel="noopener noreferrer">View pattern <span>↗</span></a>
          </article>`).join('')}
      </div>
      <div class="sewingLater"><strong>Later: ${later.name} · ${later.maker}</strong>${later.make}. <a href="${later.url}" target="_blank" rel="noopener noreferrer">View pattern ↗</a></div>`;

    (projects||wishlist).parentNode.insertBefore(section,projects||wishlist.nextSibling);
  }

  injectStyles();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
  window.addEventListener('pageshow',render);
})();