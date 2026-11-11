/* Learn to Draw offline shell. Gameplay and saves are self-contained in /.
   Network-first when connected, cached HTML fallback when disconnected. */
const CACHE_NAME = 'learn-to-draw-offline-v1';
const CACHE_PREFIX = 'learn-to-draw-offline-';
const SHELL_URL = new URL('/', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const response = await fetch(new Request(SHELL_URL, { cache: 'reload' }));
    if (!response.ok || (response.headers.get('content-type') || '').indexOf('text/html') === -1) {
      throw new Error('Cannot cache Learn to Draw HTML');
    }
    const cache = await caches.open(CACHE_NAME);
    await cache.put(SHELL_URL, response.clone());
    // Optional app metadata; unavailable metadata must not disable offline play.
    try {
      const manifestURL = new URL('manifest.webmanifest', self.registration.scope).href;
      const manifest = await fetch(manifestURL, {cache: 'reload'});
      if (manifest.ok) await cache.put(manifestURL, manifest);
    } catch {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const all = await caches.keys();
    await Promise.all(all.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Updating the game while online updates the cache. In airplane mode, any
  // navigation (including /index.html) falls back to the installed home page.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok && (response.headers.get('content-type') || '').indexOf('text/html') !== -1) {
          await cache.put(SHELL_URL, response.clone());
        }
        return response;
      } catch (error) {
        const offline = await cache.match(SHELL_URL);
        if (offline) return offline;
        throw error;
      }
    })());
    return;
  }

  // Static app metadata can be served offline as well.
  if (url.pathname === '/manifest.webmanifest') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
  }
});

self.addEventListener('message', event => {
  if ((event.data && event.data.type) !== 'CHECK_OFFLINE') return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    let ready = !!(await cache.match(SHELL_URL));
    // iOS 12 Home Screen apps may have separate CacheStorage from Safari.
    // Repair that cache from inside the installed app while still online,
    // rather than reporting ready based on Safari's storage.
    if (!ready) {
      try {
        const response = await fetch(SHELL_URL, {cache:'reload'});
        if (response.ok && (response.headers.get('content-type') || '').indexOf('text/html') !== -1) {
          await cache.put(SHELL_URL, response.clone());
          ready = true;
        }
      } catch (error) {}
    }
    if (event.source) event.source.postMessage({type:'OFFLINE_STATUS', ready});
  })());
});
