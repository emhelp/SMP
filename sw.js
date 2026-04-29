const CACHE_NAME = 'emhelp-v53';

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
  
  // STATUS LOCALIS - основные страницы
  '/SMP/other_local_status.html',
  '/SMP/dislocations.html',
  '/SMP/fractures_upper_limb.html',
  '/SMP/fractures_lower_limb.html',
  '/SMP/fractures_ribs.html',
  '/SMP/spine_fractures.html',
  '/SMP/facial_fractures.html',
  '/SMP/ligament_muscle_injuries.html',
  '/SMP/contusions_and_abrasions.html',
  '/SMP/wounds_including_infected.html',
  '/SMP/head_injury.html',
  
  // Калькуляторы
  '/SMP/algovera-shock.html',
  '/SMP/glasgow-scale.html',
  '/SMP/itls-trauma.html',
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
  '/SMP/norepinephrine-adult.html',
  '/SMP/norepinephrine-child.html',
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
  
  // Шаблоны карт
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
  
  // CSS и основные файлы
  '/SMP/style.css',
  '/SMP/manifest.json',
  '/SMP/icon-512.png',
  '/SMP/1712743647196.png',
  '/SMP/55_swipe.png',
  '/SMP/2026-03-21 18.08.19.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэширование файлов...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Все файлы закэшированы');
        self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ Ошибка кэширования:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/SMP/offline.html');
            }
            return new Response('Нет соединения с интернетом', { status: 503 });
          });
      })
  );
});

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
      console.log('✅ Новый сервис-воркер активирован');
      return self.clients.claim();
    })
  );
});
