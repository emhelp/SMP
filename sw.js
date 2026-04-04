const CACHE_NAME = 'emhelp-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/templates.html',
  '/status.html',
  '/calculators.html',
  '/consilium.html',
  '/prikaz.html',
  '/stations.html',
  '/icon-512.png',
  '/1712743647196.png'
];

// Установка сервис-воркера и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Ошибка кэширования:', err);
      })
  );
});

// Перехват запросов: сначала пытаемся из сети, если нет - из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Кэшируем только успешные ответы с того же домена
        if (response && response.status === 200 && event.request.url.includes(window.location.origin)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Обновление: удаляем старый кэш, когда активируется новый воркер
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
