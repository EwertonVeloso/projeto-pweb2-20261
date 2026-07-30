const CACHE_STATIC = 'static-data-v2';
const CACHE_TRANSACTIONS = 'transactions-v2';
const CACHE_OFFLINE = 'offline-v2';

const PRECACHE_URLS = ['/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_OFFLINE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_STATIC, CACHE_TRANSACTIONS, CACHE_OFFLINE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !validCaches.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function shouldCacheFirst(url) {
  return url.includes('/api/categories');
}

function shouldNetworkFirst(url) {
  return url.includes('/api/transactions');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (shouldCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (shouldNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match('/offline.html');
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_TRANSACTIONS);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('/offline.html');
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;

    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'spending-limit-alert',
      requireInteraction: true,
    });
  }
});
