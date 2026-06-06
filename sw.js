// sw.js — Service Worker для EMHelp PWA
// Версия: v97 (улучшенная оффлайн-поддержка + Persistent Storage)

const CACHE_NAME = 'emhelp-v97';

const urlsToCache = [
  // Главная
  '/SMP/',
  '/SMP/index.html',
  
  // Оффлайн-заглушка
  '/SMP/offline.html',
  
  // Основные страницы навигации
  '/SMP/install-instruction.html',
  '/SMP/grify.html',
  '/SMP/status.html',
  '/SMP/calculators.html',
  '/SMP/templates.html',
  '/SMP/consilium.html',
  '/SMP/prikaz.html',
  '/SMP/kody.html',
  '/SMP/stations.html',
  
  // Коды МКБ (20 страниц)
  '/SMP/Kody_1.html',
  '/SMP/Kody_2.html',
  '/SMP/Kody_3.html',
  '/SMP/Kody_4.html',
  '/SMP/Kody_5.html',
  '/SMP/Kody_6.html',
  '/SMP/Kody_7.html',
  '/SMP/Kody_8.html',
  '/SMP/Kody_9.html',
  '/SMP/Kody_10.html',
  '/SMP/Kody_11.html',
  '/SMP/Kody_12.html',
  '/SMP/Kody_13.html',
  '/SMP/Kody_14.html',
  '/SMP/Kody_15.html',
  '/SMP/Kody_16.html',
  '/SMP/Kody_17.html',
  '/SMP/Kody_18.html',
  '/SMP/Kody_19.html',
  '/SMP/Kody_20.html',
  
  // STATUS LOCALIS
  '/SMP/other_local_status.html',
  '/SMP/status2.html',
  '/SMP/trauma_manual.html',
  '/SMP/exanthema_manual.html',
  '/SMP/surgery_symptoms.html',
  '/SMP/vascular_symptoms.html',
  '/SMP/dorsalgia_symptoms.html',
  '/SMP/itls-trauma.html',
  '/SMP/incubation-periods.html',
  
  // Шаблоны карт (15 разделов)
  '/SMP/obstetrics.html',
  '/SMP/anesthesiology.html',
  '/SMP/infectious.html',
  '/SMP/cardiology.html',
  '/SMP/constatation.html',
  '/SMP/neurology.html',
  '/SMP/otolaryngology.html',
  '/SMP/ophthalmology.html',
  '/SMP/pediatrics.html',
  '/SMP/dentistry.html',
  '/SMP/therapy.html',
  '/SMP/toxicology.html',
  '/SMP/traumatology.html',
  '/SMP/urology.html',
  '/SMP/surgery.html',
  
  // Калькуляторы
  '/SMP/algovera-shock.html',
  '/SMP/glasgow-scale.html',
  '/SMP/lams-scale.html',
  '/SMP/news2-scale.html',
  '/SMP/odn-kassil.html',
  '/SMP/pain-vas.html',
  '/SMP/burn-area.html',
  '/SMP/gastric-lavage-adult.html',
  '/SMP/rass-scale.html',
  '/SMP/shocks-scale.html',
  '/SMP/pediatric-norms.html',
  '/SMP/fontanelle.html',
  '/SMP/gastric-lavage-child.html',
  '/SMP/dobutamine-adult.html',
  '/SMP/dobutamine-child.html',
  '/SMP/dopamine-adult.html',
  '/SMP/dopamine-child.html',
  '/SMP/nitroglycerin-infusion.html',
  '/SMP/norepinephrine-adult.html',
  '/SMP/norepinephrine-child.html',
  '/SMP/epinephrine-adult.html',
  '/SMP/epinephrine-child.html',
  '/SMP/burn-shock-infusion.html',
  '/SMP/mg-conversion.html',
  '/SMP/iv-infusion-rate.html',
  '/SMP/ett-size.html',
  '/SMP/laryngeal-tube-size.html',
  '/SMP/ventilation-parameters.html',
  '/SMP/ventilation-modes.html',
  '/SMP/intubation.html',
  '/SMP/oxylog-modes.html',
  '/SMP/due-date.html',
  '/SMP/fundal-height.html',
  '/SMP/dental-formula.html',
  '/SMP/qt-interval-norms.html',
  
  // Консилиумы
  '/SMP/responsible-doctor.html',
  '/SMP/diagnosis-change.html',
  '/SMP/obstetrician.html',
  '/SMP/psychiatrist.html',
  '/SMP/toxicologist.html',
  '/SMP/resuscitator.html',
  
  // Приказы
  '/SMP/ekp.html',
  '/SMP/alcohol.html',
  '/SMP/methods.html',
  '/SMP/antivich.html',
  '/SMP/vitals.html',
  '/SMP/routing.html',
  '/SMP/nsipv.html',
  
  // Папка prochee
  '/SMP/prochee/coma_diff.html',
  '/SMP/prochee/four-scale.html',
  '/SMP/prochee/oxybutyrate_poisoning.html',
  '/SMP/prochee/marijuana_consumption.html',
  '/SMP/prochee/unspecified_toxic_effect.html',
  '/SMP/prochee/fracture_metacarpal.html',
  '/SMP/prochee/algorithmsSMP-lor.html',
  '/SMP/prochee/algorithmsSMP-travma.html',
  '/SMP/prochee/algorithmsSMP-hirurg.html',
  '/SMP/prochee/algorithmsSMP-urolog.html',
  '/SMP/prochee/algorithmsSMP-ginecol.html',
  '/SMP/prochee/algorithmsSMP-oftalmo.html',
  '/SMP/prochee/algorithmsSMP-toxic.html',
  '/SMP/prochee/Шкалы оценки боли взрослая.png',
  '/SMP/prochee/Шкалы оценки боли детская.png',
  
  // CSS и основные файлы
  '/SMP/style.css',
  '/SMP/manifest.json',
  '/SMP/icon-192.png',
  '/SMP/icon-512.png',
  '/SMP/1712743647196.png',
  '/SMP/55_swipe.png',
  '/SMP/2026-03-21 18.08.19.jpg',
  
  // Скриншоты PWA
  '/SMP/screenshot-mobile-1.png',
  '/SMP/screenshot-mobile-2.png',
  '/SMP/screenshot-desktop-1.png'
];

// ============================================
// УСТАНОВКА: кэшируем все файлы по одному
// ============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэширование ' + urlsToCache.length + ' файлов...');
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
      console.log('✅ Service Worker активирован (v97)');
      return self.clients.claim();
    })
  );
});

// ============================================
// ЗАПРОСЫ: Stale-While-Revalidate + оффлайн-заглушка
// ============================================
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        
        const networkPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            console.log('📡 Оффлайн:', event.request.url);
            return null;
          });
        
        // Есть в кэше — возвращаем мгновенно
        if (cachedResponse) {
          event.waitUntil(networkPromise);
          return cachedResponse;
        }
        
        // Нет в кэше — ждём сеть
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
