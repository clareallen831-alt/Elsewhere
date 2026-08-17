(() => {
  const SPRITE='./illustrations/fashion/aw-final-five.webp?v=20260817-final5';
  const POS={
    'barbour-wax':[0,0],
    'olive-barn':[1,0],
    'tweed-blazer':[2,0],
    'heeled-chelsea-boots':[0,1],
    'loafers':[1,1]
  };

  function injectStyles(){
    if(document.querySelector('#aw-final-five-styles'))return;
    const style=document.createElement('style');
    style.id='aw-final-five-styles';
    style.textContent=`
      .awFinalFiveArt{display:block;width:62px;height:62px;flex:0 0 62px;border-radius:14px;border:1px solid rgba(92,82,69,.08);background-image:url("${SPRITE}");background-repeat:no-repeat;background-size:300% 200%;background-color:#faf6ef;box-shadow:0 3px 9px rgba(67,57,45,.045)}
      @media(max-width:480px){.awFinalFiveArt{width:56px;height:56px;flex-basis:56px}}
    `;
    document.head.appendChild(style);
  }

  function position(el,key){
    const p=POS[key];if(!p)return;
    el.style.backgroundPosition=`${p[0]/2*100}% ${p[1]*100}%`;
  }

  function apply(){
    injectStyles();
    if(localStorage.getItem('elsewhere_fashion_season_v1')==='ss')return;
    const tab=localStorage.getItem('elsewhere_fashion_tab_v1')||'capsule';
    if(tab!=='capsule')return;
    document.querySelectorAll('[data-aw-master-item]').forEach(input=>{
      const key=input.dataset.awMasterItem;
      if(!POS[key])return;
      const row=input.closest('.fashionCheck');if(!row)return;
      let art=row.querySelector('.awFinalFiveArt');
      if(!art){
        art=document.createElement('span');
        art.className='awFinalFiveArt';
        art.setAttribute('aria-hidden','true');
        const fake=row.querySelector('.fashionFakeCheck');
        row.insertBefore(art,fake||row.firstChild);
      }
      position(art,key);
    });
  }

  let pending=false;
  function sync(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-fashion-tab],[data-fashion-season],.nav[data-go="fashion"],[data-fashion-link]'))setTimeout(apply,90);
  },true);
  window.addEventListener('pageshow',apply);
  apply();
})();