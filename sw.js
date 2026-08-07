const CACHE='elsewhere-v4-pages';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response})));
});
self.addEventListener('notificationclick',event=>{
 const action=event.action||'open';
 event.notification.close();
 const target=new URL('./index.html',self.registration.scope);
 target.searchParams.set('result',action);
 event.waitUntil((async()=>{
   const all=await clients.matchAll({type:'window',includeUncontrolled:true});
   for(const client of all){if('navigate'in client)await client.navigate(target.href);return client.focus()}
   if(clients.openWindow)return clients.openWindow(target.href);
 })());
});