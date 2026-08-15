(() => {
  const PHOTO_DB='elsewhere_images_v1',PHOTO_STORE='photos';
  const $b=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function injectStyles(){
    if($b('#elsewhereBackupStyles'))return;
    const s=document.createElement('style');s.id='elsewhereBackupStyles';s.textContent=`
      .elsewhereBackupBox{margin-top:22px;padding-top:18px;border-top:1px solid #e1e2dc}.elsewhereBackupBox h2{font-family:Georgia,serif;font-weight:400;margin:5px 0 7px}.elsewhereBackupBox p{font-size:.84rem;line-height:1.5;color:#707a73}.elsewhereBackupActions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}.elsewhereBackupActions button{width:100%}.elsewhereBackupStatus{font-size:.75rem;color:#718078;min-height:1.2em;margin:9px 2px 0}@media(max-width:420px){.elsewhereBackupActions{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function ensureUi(){
    injectStyles();const card=$b('#settings .activityCard');if(!card||$b('#elsewhereBackupBox'))return;
    const box=document.createElement('div');box.id='elsewhereBackupBox';box.className='elsewhereBackupBox';box.innerHTML=`<p class="eyebrow">BACKUP & RESTORE</p><h2>Keep a copy of Elsewhere.</h2><p>Your backup includes your food log, saved meals and recipes, memories, places, sewing, Hugo progress and saved photos. It stays as a file you control.</p><div class="elsewhereBackupActions"><button class="secondary" id="elsewhereBackupBtn">Back up Elsewhere</button><button class="secondary" id="elsewhereRestoreBtn">Restore a backup</button></div><input type="file" id="elsewhereRestoreFile" accept="application/json,.json" hidden><div class="elsewhereBackupStatus" id="elsewhereBackupStatus"></div>`;card.appendChild(box);
    box.querySelector('#elsewhereBackupBtn').onclick=makeBackup;box.querySelector('#elsewhereRestoreBtn').onclick=()=>box.querySelector('#elsewhereRestoreFile').click();box.querySelector('#elsewhereRestoreFile').onchange=restoreBackup;
  }

  function openPhotoDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(PHOTO_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(PHOTO_STORE))req.result.createObjectStore(PHOTO_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
  function blobToData(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob)})}
  async function collectPhotos(){
    try{
      const db=await openPhotoDb();const rows=await new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readonly'),store=tx.objectStore(PHOTO_STORE),keysReq=store.getAllKeys(),valsReq=store.getAll();let keys,vals;const done=()=>{if(keys&&vals)resolve(keys.map((key,i)=>({key,blob:vals[i]})))};keysReq.onsuccess=()=>{keys=keysReq.result;done()};valsReq.onsuccess=()=>{vals=valsReq.result;done()};keysReq.onerror=valsReq.onerror=()=>reject(keysReq.error||valsReq.error)});db.close();
      const out=[];for(const row of rows){if(row.blob instanceof Blob)out.push({key:String(row.key),type:row.blob.type||'image/jpeg',data:await blobToData(row.blob)})}return out;
    }catch{return[]}
  }
  function dataToBlob(dataUrl){const [head,body]=String(dataUrl||'').split(',');if(!body)return null;const type=(head.match(/data:([^;]+)/)||[])[1]||'application/octet-stream';const bytes=atob(body),arr=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)arr[i]=bytes.charCodeAt(i);return new Blob([arr],{type})}
  async function restorePhotos(rows){
    const db=await openPhotoDb();await new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
    for(const row of rows||[]){const blob=dataToBlob(row.data);if(!blob)continue;await new Promise((resolve,reject)=>{const tx=db.transaction(PHOTO_STORE,'readwrite');tx.objectStore(PHOTO_STORE).put(blob,row.key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}db.close();
  }

  async function makeBackup(){
    const btn=$b('#elsewhereBackupBtn'),status=$b('#elsewhereBackupStatus');btn.disabled=true;btn.textContent='Preparing…';status.textContent='Gathering your Elsewhere data and photos.';
    try{
      const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('elsewhere_'))storage[k]=localStorage.getItem(k)}
      const photos=await collectPhotos();const payload={app:'Elsewhere',version:1,exportedAt:new Date().toISOString(),storage,photos};const json=JSON.stringify(payload);const blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a'),date=new Date().toISOString().slice(0,10);a.href=url;a.download=`Elsewhere-backup-${date}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent=`Backup ready · ${Object.keys(storage).length} data sections${photos.length?` · ${photos.length} photos`:''}.`;
    }catch(e){console.error(e);status.textContent='I could not create the backup. Nothing has been changed.'}
    finally{btn.disabled=false;btn.textContent='Back up Elsewhere'}
  }

  async function restoreBackup(e){
    const input=e.target,file=input.files&&input.files[0],status=$b('#elsewhereBackupStatus');if(!file)return;
    try{
      const payload=JSON.parse(await file.text());if(payload.app!=='Elsewhere'||!payload.storage||typeof payload.storage!=='object')throw new Error('Not an Elsewhere backup');
      const when=payload.exportedAt?new Date(payload.exportedAt).toLocaleString('en-GB'):'an earlier date';if(!confirm(`Restore your Elsewhere backup from ${when}?\n\nThis will replace the Elsewhere data currently stored on this device.`)){input.value='';return}
      status.textContent='Restoring your Elsewhere data…';
      [...Array(localStorage.length)].forEach(()=>{});const remove=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('elsewhere_'))remove.push(k)}remove.forEach(k=>localStorage.removeItem(k));
      Object.entries(payload.storage).forEach(([k,v])=>{if(k.startsWith('elsewhere_')&&typeof v==='string')localStorage.setItem(k,v)});await restorePhotos(Array.isArray(payload.photos)?payload.photos:[]);status.textContent='Restored. Elsewhere will reopen now.';setTimeout(()=>location.reload(),700);
    }catch(err){console.error(err);status.textContent='That file could not be restored as an Elsewhere backup.'}
    finally{input.value=''}
  }

  const settings=$b('#settings');if(settings)new MutationObserver(ensureUi).observe(settings,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest?.('[data-go="settings"],#settingsBtn'))setTimeout(ensureUi,20)},true);setTimeout(ensureUi,100);
})();
