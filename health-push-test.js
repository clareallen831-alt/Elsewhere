(() => {
  const PUSH_URL='https://ctzepbgcxtmmeugvwnkd.supabase.co/functions/v1/elsewhere-push';
  const INSTALL_KEY='elsewhere_push_install';

  function creds(){try{return JSON.parse(localStorage.getItem(INSTALL_KEY)||'null')}catch{return null}}
  function status(message,kind=''){const el=document.querySelector('#reminderStatus');if(!el)return;el.textContent=message;el.dataset.kind=kind}

  async function serverTest(){
    const c=creds();
    if(!c?.id||!c?.secret){status('Enable the daily reminder first, then try the test again.','error');return}
    if(!('Notification' in window)){status('Notifications are not supported by this browser.','error');return}
    if(Notification.permission!=='granted'){
      const p=await Notification.requestPermission();
      if(p!=='granted'){status('Notifications are blocked on this phone.','error');return}
    }
    status('Sending a real test push…','working');
    try{
      const r=await fetch(PUSH_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'test',installId:c.id,installSecret:c.secret})});
      const body=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(body.error||'Server push test failed');
      status('Test push accepted by the push service. Check your notification shade / lock screen now.','ok');
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
})();