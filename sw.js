// ============================================================
// Billzestpos Service Worker — PWA Offline Support
// ============================================================
const CACHE_NAME = 'billzestpos-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/dashboard.html',
    '/solutions.html',
    '/hardware.html',
    '/pricing.html',
    '/contact.html',
    '/register.html',
    '/forgot-password.html',
    '/offline.html',
    '/404.html',
    '/manifest.json',
    '/favicon.svg',
    '/firebase-config.js',
];

// ── Install: Pre-cache static assets ────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).catch(err => console.warn('[SW] Pre-cache failed:', err))
    );
    self.skipWaiting();
});

// ── Activate: Clean old caches ───────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch: Network-first, fallback to cache ──────────────────
self.addEventListener('fetch', (event) => {
    // Skip non-GET and Firebase/external requests
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('firebaseapp.com') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('gstatic.com') ||
        event.request.url.includes('unpkg.com')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache a fresh copy of the response
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
                return response;
            })
            .catch(() =>
                caches.match(event.request).then(cached =>
                    cached || caches.match('/offline.html')
                )
            )
    );
});
