(() => {
  const SEASON_KEY='elsewhere_fashion_season_v1';
  const TAB_KEY='elsewhere_fashion_tab_v1';
  const CARD_ID='fashion-owned-navy-chinos';

  function injectStyle(){
    if(document.querySelector('#fashion-owned-outfit-styles'))return;
    const style=document.createElement('style');
    style.id='fashion-owned-outfit-styles';
    style.textContent=`
      .fashionOutfitCard.fashionOwnedOutfit::before{display:none!important}
      .fashionOwnedOutfitImage{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:#f7efe2}
    `;
    document.head.appendChild(style);
  }

  function addNavyChinosOutfit(){
    if(localStorage.getItem(SEASON_KEY)==='ss')return;
    if((localStorage.getItem(TAB_KEY)||'capsule')!=='outfits')return;
    const grid=document.querySelector('#fashionPanel .fashionOutfitGrid:not(.springSummer)');
    if(!grid||grid.querySelector(`#${CARD_ID}`))return;

    const card=document.createElement('article');
    card.className='fashionOutfitCard fashionOwnedOutfit';
    card.id=CARD_ID;
    card.innerHTML=`
      <img class="fashionOwnedOutfitImage" src="./illustrations/outfit-navy-chinos.webp" alt="Illustration of a cream knit, olive overshirt, navy straight-leg chinos and tan loafers" loading="lazy">
      <div class="fashionOutfitCopy">
        <p class="eyebrow">Already in your wardrobe</p>
        <h3>Navy chinos, quietly polished</h3>
        <p>Cream lightweight knit · Olive overshirt · Navy straight-leg chinos · Cognac belt · Tan leather loafers</p>
      </div>`;
    grid.appendChild(card);
  }

  injectStyle();
  const observer=new MutationObserver(()=>requestAnimationFrame(addNavyChinosOutfit));
  observer.observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    if(!e.target.closest?.('[data-fashion-tab="outfits"],[data-fashion-season="aw"],.nav[data-go="fashion"],[data-fashion-link]'))return;
    setTimeout(addNavyChinosOutfit,80);
  },true);

  window.addEventListener('pageshow',addNavyChinosOutfit);
  addNavyChinosOutfit();
})();