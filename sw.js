const CACHE='setembrox-v2.0.1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const isPage=event.request.mode==='navigate'||new URL(event.request.url).pathname.endsWith('/index.html');
  event.respondWith(fetch(event.request).then(async response=>{
    if(isPage&&response.ok){
      let text=await response.text();
      text=text.replace('cap.innerHTML=',"document.getElementById('cap').innerHTML=");
      const headers=new Headers(response.headers);headers.delete('content-length');headers.set('cache-control','no-cache');
      const out=new Response(text,{status:response.status,statusText:response.statusText,headers});
      caches.open(CACHE).then(cache=>cache.put(event.request,out.clone())).catch(()=>{});return out;
    }
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
});