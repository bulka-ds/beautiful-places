// sw.js — Service Worker для кэширования сайта

const CACHE_NAME = 'beautiful-places-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.php',
  '/russia.html',
  '/world.html',
  '/stylee.css',
  '/icon.png'
];

// Установка: кэшируем основные файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
});

// Обработка запросов: сначала из кэша, если нет — с сервера
self.addEventListener('fetch', (event) => {
  // Не кэшируем запросы к PHP (чтобы форма работала)
  if (event.request.url.includes('.php') && event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если есть в кэше — возвращаем
        if (response) {
          return response;
        }

        // Иначе — загружаем с сервера
        return fetch(event.request).then(
          (networkResponse) => {
            // Не кэшируем POST-запросы
            if (event.request.method === 'POST') {
              return networkResponse;
            }

            // Кэшируем клон ответа
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });

            return networkResponse;
          }
        );
      })
  );
});