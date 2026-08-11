const CACHE='elsewhere-v9-push-receipts';
const ASSETS=['./','./index.html','./styles.css','./app.js','./photos.js','./health-v2.js','./health-v2.css','./health-dates.js','./health-push-test.js','./manifest.json','./icon.svg'];
const DIAG_DB='elsewhere_push_diag_v1', DIAG_STORE='events';
function openDiagDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DIAG_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(DIAG_STORE))req.result.createObjectStore(DIAG_STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function recordPush(data){try{const db=await openDiagDb();await new Promise((resolve,reject)=>{const tx=db.transaction(DIAG_STORE,'readwrite');tx.objectStore(DIAG_STORE).put({receivedAt:Date.now(),tag:data?.tag||'elsewhere-reminder'},'lastPush');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch{}}
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function withHealth(response){
  if(!response||!response.ok)return response;
  const type=response.headers.get('content-type')||'';if(!type.includes('text/html'))return response;
  let text=await response.text();
  text=text.replace(/<script src="\.\/health\.js"><\/script>/g,'');
  if(!text.includes('health-v2.js'))text=text.replace('</body>','<script src="./health-v2.js"></script></body>');
  if(!text.includes('health-dates.js'))text=text.replace('</body>','<script src="./health-dates.js"></script></body>');
  if(!text.includes('health-push-test.js'))text=text.replace('</body>','<script src="./health-push-test.js"></script></body>');
  const headers=new Headers(response.headers);headers.set('content-type','text/html; charset=utf-8');
  return new Response(text,{status:response.status,statusText:response.statusText,headers});
}
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{try{const raw=await fetch(event.request);const enhanced=await withHealth(raw);const copy=enhanced.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return enhanced}catch{const cached=await caches.match('./index.html');return cached||Response.error()}})());return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return r})));
});
self.addEventListener('push',event=>{
  let data={};try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text()||'Time for your pill.'}}
  event.waitUntil(Promise.all([
    recordPush(data),
    self.registration.showNotification(data.title||'Elsewhere reminder',{
      body:data.body||'Time for your daily pill.',
      icon:'./icon.svg',badge:'./icon.svg',tag:data.tag||'elsewhere-reminder',requireInteraction:true,
      renotify:true,vibrate:[250,120,250],timestamp:Date.now(),
      data:{url:data.url||'./index.html?health=medication'}
    })
  ]));
});
self.addEventListener('notificationclick',event=>{
 const action=event.action||'open';event.notification.close();
 let target;
 if(event.notification.data?.url)target=new URL(event.notification.data.url,self.registration.scope);
 else {target=new URL('./index.html',self.registration.scope);target.searchParams.set('result',action)}
 event.waitUntil((async()=>{const all=await clients.matchAll({type:'window',includeUncontrolled:true});for(const client of all){if('navigate'in client)await client.navigate(target.href);return client.focus()}if(clients.openWindow)return clients.openWindow(target.href)})());
});