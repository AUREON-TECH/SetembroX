const CACHE = 'setembrox-v3-secure-shell';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const SENSITIVE_PARAMS = /(^|_)(token|access_token|refresh_token|password|secret|session|auth|code)(_|$)/i;
const PRIVATE_PATHS = /\/(api|auth|login|logout|session|sessions|account|profile|admin)(\/|$)/i;

function requestIsPrivate(request) {
  if (request.method !== 'GET') return true;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return true;
  if (/supabase/i.test(url.hostname) || PRIVATE_PATHS.test(url.pathname)) return true;
  for (const key of url.searchParams.keys()) if (SENSITIVE_PARAMS.test(key)) return true;
  const headers = request.headers;
  return Boolean(headers.get('authorization') || headers.get('cookie') || headers.get('range') || headers.get('if-range'));
}

function responseIsCacheable(response) {
  if (!response || !response.ok || response.status === 206 || response.type === 'opaque') return false;
  const cacheControl = (response.headers.get('cache-control') || '').toLowerCase();
  if (cacheControl.includes('no-store') || cacheControl.includes('private')) return false;
  if (response.headers.get('set-cookie') || response.headers.get('content-range')) return false;
  const vary = (response.headers.get('vary') || '').toLowerCase();
  if (vary === '*' || /(^|,|\s)(authorization|cookie|range|if-range)(,|\s|$)/i.test(vary)) return false;
  return true;
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('setembrox-') && key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (requestIsPrivate(request)) return;
  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate' || url.pathname.endsWith('/index.html');

  if (isNavigation) {
    event.respondWith(fetch(request).then(async (response) => {
      if (responseIsCacheable(response)) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then(async (cached) => {
    const network = fetch(request).then(async (response) => {
      if (responseIsCacheable(response)) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cached || Response.error());
    return cached || network;
  }));
});
