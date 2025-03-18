const CACHE_NAME = 'dyscal-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/images/currency/50.png',
  '/images/currency/50-sm.png',
  '/images/currency/50-md.png',
  '/images/currency/50.webp',
  '/images/currency/50-sm.webp',
  '/images/currency/50-md.webp',
  '/images/currency/20.png',
  '/images/currency/20-sm.png',
  '/images/currency/20-md.png',
  '/images/currency/20.webp',
  '/images/currency/20-sm.webp',
  '/images/currency/20-md.webp',
  '/images/currency/10.png',
  '/images/currency/10-sm.png',
  '/images/currency/10-md.png',
  '/images/currency/10.webp',
  '/images/currency/10-sm.webp',
  '/images/currency/10-md.webp',
  '/images/currency/5.png',
  '/images/currency/5-sm.png',
  '/images/currency/5-md.png',
  '/images/currency/5.webp',
  '/images/currency/5-sm.webp',
  '/images/currency/5-md.webp',
  '/images/currency/2.png',
  '/images/currency/2-sm.png',
  '/images/currency/2-md.png',
  '/images/currency/2.webp',
  '/images/currency/2-sm.webp',
  '/images/currency/2-md.webp',
  '/images/currency/1.png',
  '/images/currency/1-sm.png',
  '/images/currency/1-md.png',
  '/images/currency/1.webp',
  '/images/currency/1-sm.webp',
  '/images/currency/1-md.webp',
  '/images/currency/50p.png',
  '/images/currency/50p-sm.png',
  '/images/currency/50p-md.png',
  '/images/currency/50p.webp',
  '/images/currency/50p-sm.webp',
  '/images/currency/50p-md.webp',
  '/images/currency/20p.png',
  '/images/currency/20p-sm.png',
  '/images/currency/20p-md.png',
  '/images/currency/20p.webp',
  '/images/currency/20p-sm.webp',
  '/images/currency/20p-md.webp',
  '/images/currency/10p.png',
  '/images/currency/10p-sm.png',
  '/images/currency/10p-md.png',
  '/images/currency/10p.webp',
  '/images/currency/10p-sm.webp',
  '/images/currency/10p-md.webp',
  '/images/currency/5p.png',
  '/images/currency/5p-sm.png',
  '/images/currency/5p-md.png',
  '/images/currency/5p.webp',
  '/images/currency/5p-sm.webp',
  '/images/currency/5p-md.webp',
  '/images/currency/2p.png',
  '/images/currency/2p-sm.png',
  '/images/currency/2p-md.png',
  '/images/currency/2p.webp',
  '/images/currency/2p-sm.webp',
  '/images/currency/2p-md.webp',
  '/images/currency/1p.png',
  '/images/currency/1p-sm.png',
  '/images/currency/1p-md.png',
  '/images/currency/1p.webp',
  '/images/currency/1p-sm.webp',
  '/images/currency/1p-md.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 