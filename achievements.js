(() => {
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  function decorate(containerId,items,label,onToggle){
    const cards=[...document.querySelectorAll(`#${containerId} > .listItem`)];
    cards.forEach((card,index)=>{
      const item=items[index];
      if(!item)return;
      card.classList.toggle('achievementDone',!!item.done);
      if(card.querySelector('.achievementTick'))return;
      const wrap=document.createElement('label');
      wrap.className='achievementTick';
      const input=document.createElement('input');
      input.type='checkbox';
      input.checked=!!item.done;
      input.setAttribute('aria-label',`${label}: ${item.name||item.title||'item'}`);
      input.onchange=()=>onToggle(item,index,input.checked);
      wrap.appendChild(input);
      card.appendChild(wrap);
    });
  }

  function enhanceCook(){
    const state=read('elsewhere_meals',{rated:{},ideas:[]});
    decorate('foodIdeas',state.ideas,'Made this',(item,index,done)=>{
      const current=read('elsewhere_meals',{rated:{},ideas:[]});
      const target=current.ideas.find(x=>x.id===item.id)||current.ideas[index];
      if(!target)return;
      target.done=done;
      write('elsewhere_meals',current);
      renderCook();
    });
  }

  function enhanceHugo(){
    const state=read('elsewhere_hugo_confidence',{done:[],places:[]});
    decorate('hugoPlaces',state.places,'Been here',(item,index,done)=>{
      const current=read('elsewhere_hugo_confidence',{done:[],places:[]});
      const target=current.places.find(x=>x.id===item.id)||current.places[index];
      if(!target)return;
      target.done=done;
      write('elsewhere_hugo_confidence',current);
      renderHugo();
    });
  }

  function enhanceSew(){
    const state=read('elsewhere_sewing',{equipment:[],wishlist:[],projects:[]});
    decorate('sewWishlist',state.wishlist,'Made this',(item,index,done)=>{
      const current=read('elsewhere_sewing',{equipment:[],wishlist:[],projects:[]});
      const target=current.wishlist.find(x=>x.id===item.id)||current.wishlist[index];
      if(!target)return;
      target.done=done;
      write('elsewhere_sewing',current);
      renderSew();
    });
  }

  function enhanceExplore(){
    const state=read('elsewhere_places',{found:[],wish:[]});
    decorate('wishPlaces',state.wish,'Been here',(item,index,done)=>{
      const current=read('elsewhere_places',{found:[],wish:[]});
      const target=current.wish.find(x=>x.id===item.id)||current.wish[index];
      if(!target)return;
      target.done=done;
      write('elsewhere_places',current);
      renderExplore();
    });
  }

  function injectStyles(){
    const style=document.createElement('style');
    style.textContent=`
      .listItem:has(.achievementTick){position:relative;padding-right:54px}
      .achievementTick{position:absolute;right:15px;top:14px;display:flex;align-items:center;justify-content:center}
      .achievementTick input{width:24px;height:24px;margin:0;accent-color:var(--forest);cursor:pointer}
      .listItem.achievementDone{background:var(--sage2);border-color:#cbd6c5}
      .listItem.achievementDone strong{text-decoration:line-through;color:var(--muted)}
      .listItem.achievementDone small{opacity:.76}
    `;
    document.head.appendChild(style);
  }

  const baseCook=typeof renderCook==='function'?renderCook:null;
  if(baseCook)renderCook=function(){baseCook();enhanceCook()};

  const baseHugo=typeof renderHugo==='function'?renderHugo:null;
  if(baseHugo)renderHugo=function(){baseHugo();enhanceHugo()};

  const baseSew=typeof renderSew==='function'?renderSew:null;
  if(baseSew)renderSew=function(){baseSew();enhanceSew()};

  const baseExplore=typeof renderExplore==='function'?renderExplore:null;
  if(baseExplore)renderExplore=function(){baseExplore();enhanceExplore()};

  injectStyles();
})();
