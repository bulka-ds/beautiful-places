const CACHE_NAME = 'beautiful-places-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/russia.html',
  '/world.html',
  '/stylee.css',
  '/icon.png'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(urlsToCache)

});

self.addEventListener('activate', event => {})
  


self.addEventListener('fetch', event => {
  console.log('Fetch', event.request.url)

  event.respondWith(cacheFirst(event.request))
});

async function cacheFirst(request) {
    const cached = await caches.match(request)
    return cached ?? await fetch(request)
}