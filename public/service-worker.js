// public/service-worker.js
const CACHE_NAME = 'offline-app-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/api/offline-data',
  // Adicione outros recursos que devem ser cacheados
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Retorna uma resposta offline personalizada
      return caches.match('/offline.html');
    })
  );
});