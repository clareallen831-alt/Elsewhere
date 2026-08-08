(() => {
  const DB_NAME='elsewhere_images_v1', STORE='photos';
  const objectUrls=new Set();
  const photoUid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
  const html=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function openDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async function putPhoto(key,blob){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(blob,key);tx.oncomplete=()=>resolve(key);tx.onerror=()=>reject(tx.error)})}
  async function getPhoto(key){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
  async function deletePhoto(key){if(!key)return;const db=await openDb();return new Promise(resolve=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=resolve;tx.onerror=resolve})}
  function clearPhotoDb(){return new Promise(resolve=>{const req=indexedDB.deleteDatabase(DB_NAME);req.onsuccess=req.onerror=req.onblocked=()=>resolve()})}

  async function compressPhoto(file){
    if(!file)return null;
    return new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(file),img=new Image();
      img.onload=()=>{
        try{
          const max=1200,scale=Math.min(1,max/Math.max(img.width,img.height));
          const canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
          canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
          canvas.toBlob(blob=>{URL.revokeObjectURL(url);blob?resolve(blob):reject(new Error('Could not prepare photo'))},'image/jpeg',0.78);
        }catch(e){URL.revokeObjectURL(url);reject(e)}
      };
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not read photo'))};img.src=url;
    });
  }
  async function saveFileAsPhoto(file,key){if(!file)return null;const blob=await compressPhoto(file);await putPhoto(key,blob);return key}
  async function hydratePhotos(root=document){
    const imgs=[...root.querySelectorAll('img[data-photo-key]:not([data-photo-loaded])')];
    await Promise.all(imgs.map(async img=>{try{const blob=await getPhoto(img.dataset.photoKey);if(!blob)return;const url=URL.createObjectURL(blob);objectUrls.add(url);img.src=url;img.dataset.photoLoaded='1';img.onclick=()=>openLightbox(url)}catch{}}));
    root.querySelectorAll('img.memoryPhoto:not([data-lightbox])').forEach(img=>{if(img.src){img.dataset.lightbox='1';img.onclick=()=>openLightbox(img.src)}});
  }
  function openLightbox(src){
    let box=document.querySelector('#elsewherePhotoLightbox');if(box)box.remove();
    box=document.createElement('div');box.id='elsewherePhotoLightbox';box.className='photoLightbox';box.innerHTML=`<button aria-label="Close photo">×</button><img src="${src}" alt="Elsewhere photo">`;
    box.onclick=e=>{if(e.target===box||e.target.tagName==='BUTTON')box.remove()};document.body.appendChild(box);
  }
  function pickPhoto(cb){
    const input=document.createElement('input');input.type='file';input.accept='image/*';input.style.display='none';document.body.appendChild(input);
    input.onchange=async()=>{const file=input.files&&input.files[0];if(file)await cb(file);input.remove()};input.click();
  }
  function addPreview(input){
    if(!input||input.dataset.previewReady)return;input.dataset.previewReady='1';
    const label=input.closest('.photoPick');if(label&&label.firstChild)label.firstChild.textContent='📷 Add a photo from camera or gallery ';
    const preview=document.createElement('div');preview.className='selectedPhotoPreview hidden';preview.innerHTML='<img alt="Selected photo preview"><span>Photo ready to save</span>';
    (label||input).insertAdjacentElement('afterend',preview);
    input.addEventListener('change',()=>{const file=input.files&&input.files[0];if(!file){preview.classList.add('hidden');return}const url=URL.createObjectURL(file);const img=preview.querySelector('img');img.onload=()=>URL.revokeObjectURL(url);img.src=url;preview.classList.remove('hidden')});
  }

  async function migrateLegacyPhotos(){
    try{
      const list=JSON.parse(localStorage.getItem('elsewhere_memories')||'[]');let changed=false;
      for(const item of list){if(item.photo&&String(item.photo).startsWith('data:image')&&!item.photoKey){item.id=item.id||photoUid();const blob=await (await fetch(item.photo)).blob();item.photoKey=`memory:${item.id}`;await putPhoto(item.photoKey,blob);delete item.photo;changed=true}}
      if(changed)localStorage.setItem('elsewhere_memories',JSON.stringify(list));
    }catch{}
  }

  function newMemoryMarkup(x){
    const icon=(typeof catIcon!=='undefined'&&catIcon[x.category])||'✦';const date=new Date(x.date).toLocaleDateString();
    const image=x.photoKey?`<img class="memoryPhoto" data-photo-key="${html(x.photoKey)}" alt="Saved Elsewhere memory">`:x.photo?`<img class="memoryPhoto" src="${x.photo}" alt="Saved Elsewhere memory">`:'';
    return `<div class="listItem"><small>${icon} ${(x.category||'other').toUpperCase()} · ${date}</small><strong>${html(x.title)}</strong>${x.note?`<p>${html(x.note)}</p>`:''}${image}</div>`;
  }
  if(typeof memoryHTML==='function')memoryHTML=newMemoryMarkup;

  async function saveCompletionWithIndexedPhoto(){
    if(!S.current)return;const id=photoUid();let photoKey=null;
    try{const file=$('#completionPhoto').files[0];if(file)photoKey=await saveFileAsPhoto(file,`memory:${id}`)}catch(e){console.warn(e)}
    const m=memories();m.unshift({id,date:new Date().toISOString(),category:S.current.cat,title:S.current.title,note:$('#completionNote').value.trim(),feeling:S.feeling,again:S.again,safe:$('#completionSafe').checked,source:'prompt',activityId:S.current.id,photoKey});saveMemories(m);
    if(S.current.cat==='cook')upsertMealFromMemory(S.current.title,S.again);resetCompletion();go('look');
  }
  async function saveFreeWithIndexedPhoto(){
    const title=$('#freeTitle').value.trim();if(!S.freeCat||!title)return;const id=photoUid();let photoKey=null;
    try{const file=$('#freePhoto').files[0];if(file)photoKey=await saveFileAsPhoto(file,`memory:${id}`)}catch(e){console.warn(e)}
    const m=memories();m.unshift({id,date:new Date().toISOString(),category:S.freeCat,title,note:$('#freeNote').value.trim(),feeling:S.freeFeeling,again:S.freeAgain,safe:$('#freeSafe').checked,source:'free',photoKey});saveMemories(m);
    if(S.freeCat==='cook')upsertMealFromMemory(title,S.freeAgain);resetFree();go('look');
  }

  function findMemoryIndex(all,item){if(item.id)return all.findIndex(x=>x.id===item.id);return all.findIndex(x=>x.date===item.date&&x.title===item.title&&x.category===item.category)}
  function enhanceMemoryCards(){
    const all=JSON.parse(localStorage.getItem('elsewhere_memories')||'[]'),recent=all.slice(0,30),cards=[...document.querySelectorAll('#memoryList > .listItem')];
    cards.forEach((card,i)=>{const item=recent[i];if(!item||card.querySelector('.photoEdit'))return;const button=document.createElement('button');button.className='photoEdit';button.textContent=item.photoKey||item.photo?'📷 Change photo':'📷 Add photo';button.onclick=()=>pickPhoto(async file=>{const full=JSON.parse(localStorage.getItem('elsewhere_memories')||'[]'),idx=findMemoryIndex(full,item);if(idx<0)return;full[idx].id=full[idx].id||photoUid();if(full[idx].photoKey)await deletePhoto(full[idx].photoKey);const key=`memory:${full[idx].id}`;await saveFileAsPhoto(file,key);full[idx].photoKey=key;delete full[idx].photo;localStorage.setItem('elsewhere_memories',JSON.stringify(full));renderLook()});card.appendChild(button)});
    hydratePhotos(document.querySelector('#look'));
  }

  function placeStateLocal(){try{return JSON.parse(localStorage.getItem('elsewhere_places')||'{"found":[],"wish":[]}')}catch{return {found:[],wish:[]}}}
  function savePlacesLocal(v){localStorage.setItem('elsewhere_places',JSON.stringify(v))}
  function enhanceFoundPlaces(){
    const ps=placeStateLocal(),cards=[...document.querySelectorAll('#foundPlaces > .listItem')];
    cards.forEach((card,i)=>{const p=ps.found[i];if(!p)return;if(p.photoKey&&!card.querySelector('[data-photo-key]')){const img=document.createElement('img');img.className='placePhoto';img.dataset.photoKey=p.photoKey;img.alt=`${p.name} photo`;card.insertBefore(img,card.firstChild)}if(!card.querySelector('.photoEdit')){const b=document.createElement('button');b.className='photoEdit';b.textContent=p.photoKey?'📷 Change photo':'📷 Add photo';b.onclick=()=>pickPhoto(async file=>{const current=placeStateLocal(),x=current.found.find(v=>v.id===p.id)||current.found[i];x.id=x.id||photoUid();if(x.photoKey)await deletePhoto(x.photoKey);x.photoKey=`place:${x.id}`;await saveFileAsPhoto(file,x.photoKey);savePlacesLocal(current);renderExplore()});card.appendChild(b)}});hydratePhotos(document.querySelector('#explore'));
  }
  function openFoundPlaceWithPhoto(){
    document.querySelector('#placePhotoModal')?.remove();const box=document.createElement('div');box.id='placePhotoModal';box.className='photoModal';box.innerHTML=`<div class="photoModalCard"><button class="photoModalClose" aria-label="Close">×</button><p class="eyebrow">ADD A PLACE YOU FOUND</p><h2>What do you want to remember?</h2><label class="fieldLabel">Place</label><input id="photoPlaceName" type="text" placeholder="Where did you go?"><label class="fieldLabel">What did you like?</label><textarea id="photoPlaceNote" rows="3" placeholder="The view, the light, how it felt…"></textarea><label class="photoPick">📷 Add a photo from camera or gallery <input id="photoPlaceFile" type="file" accept="image/*"></label><button class="primary" id="savePhotoPlace">Save place</button></div>`;document.body.appendChild(box);addPreview(box.querySelector('#photoPlaceFile'));box.querySelector('.photoModalClose').onclick=()=>box.remove();box.onclick=e=>{if(e.target===box)box.remove()};box.querySelector('#savePhotoPlace').onclick=async()=>{const name=box.querySelector('#photoPlaceName').value.trim();if(!name)return;const id=photoUid(),file=box.querySelector('#photoPlaceFile').files[0];let photoKey=null;try{if(file)photoKey=await saveFileAsPhoto(file,`place:${id}`)}catch(e){console.warn(e)}const ps=placeStateLocal();ps.found.unshift({id,name,note:box.querySelector('#photoPlaceNote').value.trim(),date:new Date().toISOString(),photoKey});savePlacesLocal(ps);box.remove();renderExplore()};
  }

  const baseLook=typeof renderLook==='function'?renderLook:null;if(baseLook)renderLook=function(){baseLook();enhanceMemoryCards();hydratePhotos(document)};
  const baseExplore=typeof renderExplore==='function'?renderExplore:null;if(baseExplore)renderExplore=function(){baseExplore();enhanceFoundPlaces()};
  const baseMake=typeof renderMake==='function'?renderMake:null;if(baseMake)renderMake=function(){baseMake();hydratePhotos(document.querySelector('#make'))};

  function injectStyles(){const s=document.createElement('style');s.textContent=`.selectedPhotoPreview{display:flex;align-items:center;gap:12px;margin:10px 0 18px;padding:10px;background:#f0f3eb;border:1px solid #d7ded1;border-radius:16px}.selectedPhotoPreview.hidden{display:none}.selectedPhotoPreview img{width:70px;height:70px;object-fit:cover;border-radius:12px}.selectedPhotoPreview span{font-size:.82rem;color:#59645c}.memoryPhoto,.placePhoto{display:block;width:100%;max-height:340px;object-fit:cover;border-radius:16px;margin:12px 0 4px;cursor:zoom-in}.placePhoto{max-height:260px}.photoEdit{border:0;background:#eef2e9;color:#344b3c;border-radius:999px;padding:8px 12px;margin-top:10px;font-weight:700}.photoLightbox{position:fixed;z-index:10000;inset:0;background:rgba(25,31,27,.92);display:grid;place-items:center;padding:20px}.photoLightbox img{max-width:100%;max-height:88vh;border-radius:18px}.photoLightbox button{position:absolute;top:20px;right:20px;width:44px;height:44px;border:0;border-radius:50%;font-size:1.8rem;background:#fffdf8;color:#344b3c}.photoModal{position:fixed;z-index:9999;inset:0;background:rgba(34,42,36,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}.photoModalCard{width:min(680px,100%);max-height:92vh;overflow:auto;background:#fffdf8;border-radius:26px;padding:25px;box-shadow:0 20px 70px rgba(0,0,0,.2);position:relative}.photoModalCard h2{font-family:Georgia,serif;font-weight:400;font-size:1.8rem}.photoModalClose{position:absolute;right:16px;top:14px;border:0;background:transparent;font-size:1.8rem;color:#59645c}`;document.head.appendChild(s)}

  async function init(){injectStyles();addPreview(document.querySelector('#completionPhoto'));addPreview(document.querySelector('#freePhoto'));if(document.querySelector('#saveCompletion'))document.querySelector('#saveCompletion').onclick=saveCompletionWithIndexedPhoto;if(document.querySelector('#saveFree'))document.querySelector('#saveFree').onclick=saveFreeWithIndexedPhoto;if(document.querySelector('#addFoundPlace'))document.querySelector('#addFoundPlace').onclick=openFoundPlaceWithPhoto;
    if(document.querySelector('#clearAll'))document.querySelector('#clearAll').onclick=async()=>{if(confirm('Clear all saved Elsewhere data from this device?')){Object.values(LS).forEach(k=>localStorage.removeItem(k));localStorage.removeItem('elsewhere_evening_plan');await clearPhotoDb();location.reload()}};
    await migrateLegacyPhotos();enhanceMemoryCards();enhanceFoundPlaces();hydratePhotos(document);
  }
  window.addEventListener('beforeunload',()=>objectUrls.forEach(URL.revokeObjectURL));
  init();
})();