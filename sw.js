/* The game is a single HTML document. Keep an offline copy of this build. */
const BUILD = '2026-11-17.12';
const CACHE_PREFIX = 'learn-to-draw-offline-';
const CACHE_NAME = CACHE_PREFIX + BUILD;
const SHELL_URL = self.registration.scope;
const SHELL_PATH = new URL(SHELL_URL).pathname;
const INDEX_PATH = new URL('index.html', SHELL_URL).pathname;
const CHECK_PATH = new URL('ltd-offline-check', SHELL_URL).pathname;
const BUILD_HEADER = 'X-Learn-To-Draw-Build';

async function cachedGame() {
  const cache = await caches.open(CACHE_NAME);
  return cache.match(SHELL_URL);
}

let cacheWrite;
function cacheGame() {
  if (!cacheWrite) {
    cacheWrite = (async () => {
      const url = new URL(SHELL_URL);
      url.searchParams.set('build', BUILD);
      const response = await fetch(url.href, {cache: 'reload'});
      if (!response.ok || !(response.headers.get('content-type') || '').includes('text/html')) {
        throw new Error('Cannot download Learn to Draw');
      }
      const html = await response.text();
      if (!html.includes('<meta name="ltd-build" content="' + BUILD + '">')) {
        throw new Error('The game and service worker are from different builds');
      }
      const cache = await caches.open(CACHE_NAME);
      await cache.put(SHELL_URL, new Response(html, {headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        [BUILD_HEADER]: BUILD
      }}));
    })().finally(() => { cacheWrite = null; });
  }
  return cacheWrite;
}

self.addEventListener('install', event => {
  event.waitUntil(cacheGame().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
  })());
});

async function offlineCheck() {
  try {
    let game = await cachedGame();
    if (!game) {
      // The browser can evict cached files while keeping the registration.
      await cacheGame();
      game = await cachedGame();
    }
    if (game && game.headers.get(BUILD_HEADER) === BUILD) {
      return new Response(null, {status: 204, headers: {[BUILD_HEADER]: BUILD}});
    }
  } catch (error) {
    // A missing or unwritable shell must never be reported as ready.
  }
  return new Response(null, {status: 503});
}

async function launchGame(request) {
  // Prefer a fresh page online. Fall back promptly on an unusable connection.
  const network = fetch(request).catch(() => null);
  let timer;
  const deadline = new Promise(resolve => { timer = setTimeout(() => resolve(null), 2500); });
  const response = await Promise.race([network, deadline]);
  clearTimeout(timer);
  if (response && (response.ok || response.type === 'opaqueredirect')) return response;
  const game = await cachedGame().catch(() => null);
  return game || response || await network || Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname === CHECK_PATH) {
    event.respondWith(offlineCheck());
  } else if (url.pathname === SHELL_PATH || url.pathname === INDEX_PATH) {
    // Limit the fallback to game launch URLs, including bookmarked queries.
    event.respondWith(launchGame(request));
  }
});
