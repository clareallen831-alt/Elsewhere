const CACHE='elsewhere-v5-health';
const ASSETS=['./','./index.html','./styles.css','./app.js','./photos.js','./health.js','./health.css','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function withHealth(response){
  if(!response||!response.ok)return response;
  const type=response.headers.get('content-type')||'';if(!type.includes('text/html'))return response;
  let text=await response.text();
  if(!text.includes('health.js'))text=text.replace('</body>','<script src="./health.js"></script></body>');
  const headers=new Headers(response.headers);headers.set('content-type','text/html; charset=utf-8');
  return new Response(text,{status:response.status,statusText:response.statusText,headers});
}
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{const raw=await fetch(event.request);const enhanced=await withHealth(raw);const copy=enhanced.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return enhanced}
      catch{const cached=await caches.match('./index.html');return cached||Response.error()}
    })());return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return r})));
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