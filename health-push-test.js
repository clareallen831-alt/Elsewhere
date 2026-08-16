(() => {
  const PUSH_URL='https://ctzepbgcxtmmeugvwnkd.supabase.co/functions/v1/elsewhere-push';
  const INSTALL_KEY='elsewhere_push_install';
  const DIAG_DB='elsewhere_push_diag_v1', STORE='events';

  function creds(){try{return JSON.parse(localStorage.getItem(INSTALL_KEY)||'null')}catch{return null}}
  function status(message,kind=''){const el=document.querySelector('#reminderStatus');if(!el)return;el.textContent=message;el.dataset.kind=kind}
  function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
  function openDiag(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DIAG_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
  async function lastReceipt(){try{const db=await openDiag();return await new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get('lastPush');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}catch{return null}}

  async function serverTest(){
    const c=creds();
    if(!c?.id||!c?.secret){status('Enable the daily reminder first, then try the test again.','error');return}
    if(!('Notification' in window)){status('Notifications are not supported by this browser.','error');return}
    if(Notification.permission!=='granted'){
      const p=await Notification.requestPermission();
      if(p!=='granted'){status('Notifications are blocked on this phone.','error');return}
    }
    const before=await lastReceipt();
    const beforeTime=before?.receivedAt||0;
    status('Sending a real server push…','working');
    try{
      const r=await fetch(PUSH_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'test',installId:c.id,installSecret:c.secret})});
      const body=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(body.error||'Server push test failed');
      status('Push service accepted it. Checking whether this phone received it…','working');
      let receipt=null;
      for(let i=0;i<8;i++){await sleep(750);receipt=await lastReceipt();if(receipt?.receivedAt>beforeTime)break}
      if(receipt?.receivedAt>beforeTime){
        status('✓ The server push reached this phone. If no notification appeared, check Samsung/Chrome notification display settings.','ok');
      }else{
        status('The push service accepted the message, but this phone has not recorded receiving it yet. Re-enable the reminder to refresh the push subscription.','error');
      }
    }catch(e){status(e.message||'Could not send the server test.','error')}
  }

  document.addEventListener('click',e=>{
    const target=e.target.closest?.('#testReminder');
    if(!target)return;
    e.preventDefault();e.stopImmediatePropagation();
    serverTest();
  },true);

  const style=document.createElement('style');
  style.textContent=`#reminderStatus[data-kind="error"]{color:#8b4a42}#reminderStatus[data-kind="ok"]{color:#344b3c;font-weight:700}#reminderStatus[data-kind="working"]{opacity:.75}`;
  document.head.appendChild(style);

  function loadFashionSeasons(){
    if(document.querySelector('script[data-elsewhere-fashion-seasons]'))return;
    const seasons=document.createElement('script');
    seasons.src='./fashion-seasons.js?v=20260816-seasons';
    seasons.dataset.elsewhereFashionSeasons='true';
    document.body.appendChild(seasons);
  }

  // Load the Fashion area without disturbing the existing Elsewhere page structure.
  if(!document.querySelector('link[data-elsewhere-fashion]')){
    const fashionStyle=document.createElement('link');
    fashionStyle.rel='stylesheet';
    fashionStyle.href='./fashion.css?v=20260816-seasons';
    fashionStyle.dataset.elsewhereFashion='true';
    document.head.appendChild(fashionStyle);
  }
  if(!document.querySelector('script[data-elsewhere-fashion]')){
    const fashionScript=document.createElement('script');
    fashionScript.src='./fashion.js?v=20260816-seasons';
    fashionScript.dataset.elsewhereFashion='true';
    fashionScript.addEventListener('load',loadFashionSeasons,{once:true});
    document.body.appendChild(fashionScript);
  }else{
    loadFashionSeasons();
  }
})();