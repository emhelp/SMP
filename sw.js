// sw.js — Service Worker для EMHelp PWA
// Версия: v118 (добавлен график смен)

const CACHE_NAME = 'emhelp-v118';

// Только самые важные страницы (пре-кэш)
const urlsToCache = [
  // Главная
  '/SMP/',
  '/SMP/index.html',
  
  // Оффлайн-заглушка
  '/SMP/offline.html',
  
  // Основные страницы навигации (меню разделов)
  '/SMP/install-instruction.html',
  '/SMP/templates.html',
  '/SMP/status.html',
  '/SMP/calculators.html',
  '/SMP/kody.html',
  '/SMP/algorithmsSMP.html',
  '/SMP/algorithms_apps.html',
  '/SMP/grify.html',
  '/SMP/consilium.html',
  '/SMP/prikaz.html',
  '/SMP/stations.html',
  
  // Страницы кодов МКБ
  '/SMP/prochee/akusherstvo-mkb.html',
  
  // График смен
  '/SMP/prochee/grafik-smen.html',
  
  // CSS, манифест, иконки, скриншоты
  '/SMP/style.css',
  '/SMP/manifest.json',
  '/SMP/icon-192.png',
  '/SMP/icon-512.png',
  '/SMP/1712743647196.png',
  '/SMP/screenshot-mobile-1.png',
  '/SMP/screenshot-mobile-2.png',
  '/SMP/screenshot-desktop-1.png'
];

// ============================================
// УСТАНОВКА: кэшируем только важные файлы
// ============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Пре-кэш ' + urlsToCache.length + ' важных файлов...');
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(err => {
              console.warn('⚠️ Не удалось закэшировать:', url, err);
            })
          )
        );
      })
      .then(() => {
        console.log('✅ Установка завершена');
        return self.skipWaiting();
      })
  );
});

// ============================================
// АКТИВАЦИЯ: удаляем старый кэш
// ============================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Удаляем старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker активирован (v118)');
      return self.clients.claim();
    })
  );
});

// ============================================
// ЗАПРОСЫ: авто-кэш + таймаут 10 сек
// ============================================
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        
        // Сеть с таймаутом 10 секунд
        const networkPromise = Promise.race([
          fetch(event.request)
            .then(networkResponse => {
              // Кэшируем ВСЕ успешные запросы (авто-кэш)
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 10000)
          )
        ]).catch(() => {
          console.log('⏱️ Таймаут или нет сети:', event.request.url);
          return null;
        });
        
        // Есть в кэше — возвращаем мгновенно
        if (cachedResponse) {
          event.waitUntil(networkPromise);
          return cachedResponse;
        }
        
        // Нет в кэше — ждём сеть (но не более 10 секунд)
        return networkPromise.then(networkResponse => {
          if (networkResponse) return networkResponse;
          
          // HTML-запрос без кэша и сети → оффлайн-заглушка
          if (event.request.mode === 'navigate' || 
              event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/SMP/offline.html');
          }
          
          return new Response('Оффлайн — данные недоступны', { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      });
    })
  );
});

// ============================================
// СООБЩЕНИЯ от страниц
// ============================================
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
