(() => {
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const makeId=()=>typeof uid==='function'?uid():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const MEMORY_KEY='elsewhere_memories';

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

  function achievementRef(config,item,index){
    return `${config.storageKey}:${item.id||index}:${config.containerId}`;
  }

  function addToLookAtMeNow(config,item,index,offer){
    const current=read(config.storageKey,config.fallback);
    const items=config.items(current);
    const target=items.find(x=>item.id&&x.id===item.id)||items[index];
    if(!target)return;
    const memories=read(MEMORY_KEY,[]);
    const ref=achievementRef(config,target,index);
    let memory=target.memoryId?memories.find(x=>x.id===target.memoryId):null;
    if(!memory)memory=memories.find(x=>x.source==='achievement'&&x.achievementRef===ref);
    if(!memory){
      memory={id:makeId(),date:new Date().toISOString(),category:config.category,title:config.memoryTitle(target),note:target.note||'',feeling:null,again:null,safe:false,source:'achievement',achievementRef:ref};
      memories.unshift(memory);
      write(MEMORY_KEY,memories.slice(0,250));
    }
    target.memoryId=memory.id;
    target.loggedAt=memory.date;
    write(config.storageKey,current);
    offer.classList.add('saved');
    offer.innerHTML='<span>✓ Added to Look at me now</span>';
  }

  function offerMemory(config,item,index){
    if(!item.done||item.memoryId)return;
    const cards=[...document.querySelectorAll(`#${config.containerId} > .listItem`)];
    const card=cards[index];
    if(!card||card.querySelector('.achievementOffer'))return;
    const offer=document.createElement('div');
    offer.className='achievementOffer';
    offer.innerHTML='<span>That counts. Add it to <strong>Look at me now</strong>?</span><div><button type="button" class="achievementAdd">Add it</button><button type="button" class="achievementSkip">Not now</button></div>';
    card.appendChild(offer);
    offer.querySelector('.achievementAdd').onclick=()=>addToLookAtMeNow(config,item,index,offer);
    offer.querySelector('.achievementSkip').onclick=()=>offer.remove();
  }

  const cookConfig={containerId:'foodIdeas',storageKey:'elsewhere_meals',fallback:{rated:{},ideas:[]},items:s=>s.ideas,category:'cook',memoryTitle:x=>`Cooked ${x.title}`};
  const hugoConfig={containerId:'hugoPlaces',storageKey:'elsewhere_hugo_confidence',fallback:{done:[],places:[]},items:s=>s.places,category:'hugo',memoryTitle:x=>`Went to ${x.name} with Hugo`};
  const sewConfig={containerId:'sewWishlist',storageKey:'elsewhere_sewing',fallback:{equipment:[],wishlist:[],projects:[]},items:s=>s.wishlist,category:'sew',memoryTitle:x=>`Made ${x.name}`};
  const exploreConfig={containerId:'wishPlaces',storageKey:'elsewhere_places',fallback:{found:[],wish:[]},items:s=>s.wish,category:'explore',memoryTitle:x=>`Visited ${x.name}`};

  function enhanceCook(){const state=read(cookConfig.storageKey,cookConfig.fallback);decorate(cookConfig.containerId,state.ideas,'Made this',(item,index,done)=>{const current=read(cookConfig.storageKey,cookConfig.fallback),target=current.ideas.find(x=>x.id===item.id)||current.ideas[index];if(!target)return;target.done=done;write(cookConfig.storageKey,current);renderCook();if(done)offerMemory(cookConfig,target,index);});}
  function enhanceHugo(){const state=read(hugoConfig.storageKey,hugoConfig.fallback);decorate(hugoConfig.containerId,state.places,'Been here',(item,index,done)=>{const current=read(hugoConfig.storageKey,hugoConfig.fallback),target=current.places.find(x=>x.id===item.id)||current.places[index];if(!target)return;target.done=done;write(hugoConfig.storageKey,current);renderHugo();if(done)offerMemory(hugoConfig,target,index);});}
  function enhanceSew(){const state=read(sewConfig.storageKey,sewConfig.fallback);decorate(sewConfig.containerId,state.wishlist,'Made this',(item,index,done)=>{const current=read(sewConfig.storageKey,sewConfig.fallback),target=current.wishlist.find(x=>x.id===item.id)||current.wishlist[index];if(!target)return;target.done=done;write(sewConfig.storageKey,current);renderSew();if(done)offerMemory(sewConfig,target,index);});}
  function enhanceExplore(){const state=read(exploreConfig.storageKey,exploreConfig.fallback);decorate(exploreConfig.containerId,state.wish,'Been here',(item,index,done)=>{const current=read(exploreConfig.storageKey,exploreConfig.fallback),target=current.wish.find(x=>x.id===item.id)||current.wish[index];if(!target)return;target.done=done;write(exploreConfig.storageKey,current);renderExplore();if(done)offerMemory(exploreConfig,target,index);});}

  function injectStyles(){const style=document.createElement('style');style.textContent=`
    .listItem:has(.achievementTick){position:relative;padding-right:54px}
    .achievementTick{position:absolute;right:15px;top:14px;display:flex;align-items:center;justify-content:center}
    .achievementTick input{width:24px;height:24px;margin:0;accent-color:var(--forest);cursor:pointer}
    .listItem.achievementDone{background:var(--sage2);border-color:#cbd6c5}
    .listItem.achievementDone strong{text-decoration:line-through;color:var(--muted)}
    .listItem.achievementDone small{opacity:.76}
    .achievementOffer{grid-column:1/-1;margin:12px -38px 0 0;padding:12px 13px;background:var(--card);border:1px solid #cbd6c5;border-radius:14px;color:var(--ink);font-size:.82rem;line-height:1.4}
    .achievementOffer>span{display:block}.achievementOffer>span strong{text-decoration:none;color:var(--forest)}
    .achievementOffer>div{display:flex;gap:7px;margin-top:9px;flex-wrap:wrap}.achievementOffer button{border:0;border-radius:999px;padding:8px 11px;font-weight:750;font-size:.76rem}
    .achievementAdd{background:var(--forest);color:white}.achievementSkip{background:var(--sage);color:var(--forest)}
    .achievementOffer.saved{background:var(--sage);color:var(--forest);font-weight:750}.achievementOffer.saved span{display:block}
  `;document.head.appendChild(style);}

  const baseCook=typeof renderCook==='function'?renderCook:null;if(baseCook)renderCook=function(){baseCook();enhanceCook()};
  const baseHugo=typeof renderHugo==='function'?renderHugo:null;if(baseHugo)renderHugo=function(){baseHugo();enhanceHugo()};
  const baseSew=typeof renderSew==='function'?renderSew:null;if(baseSew)renderSew=function(){baseSew();enhanceSew()};
  const baseExplore=typeof renderExplore==='function'?renderExplore:null;if(baseExplore)renderExplore=function(){baseExplore();enhanceExplore()};
  injectStyles();
})();
