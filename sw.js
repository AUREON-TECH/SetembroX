const APP_PREFIX='esteticagyr-';
const CACHE='esteticagyr-v4-png-safe-shell';
const CORE=['./','./index.html','./manifest.json','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const SENSITIVE_QUERY=/^(token|access_token|refresh_token|auth|session|password|senha|code|key|api_key)$/i;
const SENSITIVE_PATH=/(\/auth\b|\/login\b|\/logout\b|\/session\b|\/token\b|\/api\b)/i;
function hasSensitiveHeaders(req){return req.headers.has('authorization')||req.headers.has('cookie')||req.headers.has('range')||req.headers.has('if-range')}
function hasSensitiveQuery(url){for(const [k] of url.searchParams){if(SENSITIVE_QUERY.test(k)) return true}return false}
function safeRequest(req){const url=new URL(req.url);return req.method==='GET'&&url.origin===self.location.origin&&!hasSensitiveHeaders(req)&&!hasSensitiveQuery(url)&&!SENSITIVE_PATH.test(url.pathname)}
function safeResponse(res){if(!res||!res.ok||res.type==='opaque') return false;const cc=(res.headers.get('cache-control')||'').toLowerCase();if(cc.includes('private')||cc.includes('no-store')) return false;if(res.headers.has('set-cookie')||res.headers.has('content-range')) return false;const vary=(res.headers.get('vary')||'').toLowerCase().split(',').map(v=>v.trim());return !vary.some(v=>v==='*'||v==='cookie'||v==='authorization'||v==='range')}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(APP_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const req=event.request;if(!safeRequest(req)) return;const url=new URL(req.url);if(req.mode==='navigate'){event.respondWith(fetch(req).then(async res=>{if(safeResponse(res)) await caches.open(CACHE).then(c=>c.put('./index.html',res.clone()));return res}).catch(()=>caches.match('./index.html')));return}event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(async res=>{if(safeResponse(res)&&url.search==='') await caches.open(CACHE).then(c=>c.put(req,res.clone()));return res}))) });
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING') self.skipWaiting()});
