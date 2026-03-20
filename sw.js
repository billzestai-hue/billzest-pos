// BillZest Service Worker v1.0
var CACHE_NAME = 'billzest-v1';
var URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/billzest-complete-pos.html',
  '/billzest-sales-dashboard.html',
  '/billzest-advanced.html',
  '/billzest-mega.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Cache first, network fallback
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).catch(function() {
        return caches.match('/index.html');
      });
    })
  );
});
