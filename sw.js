const CACHE_NAME = 'emhelp-v20';

const urlsToCache = [
  '/SMP/',
  '/SMP/index.html',
  '/SMP/install-instruction.html',
  '/SMP/grify.html',
  '/SMP/status.html',
  '/SMP/calculators.html',
  '/SMP/templates.html',
  '/SMP/consilium.html',
  '/SMP/prikaz.html',
  '/SMP/kody.html',
  
  // Коды МКБ (17 страниц)
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
  
  // ПЕРЕЛОМЫ ПОЗВОНОЧНИКА (spine_fractures.html)
  '/SMP/c4_compression_fracture.html',
  '/SMP/c5_uncomplicated_compression_fracture.html',
  '/SMP/t10_t11_compression_fracture_spinal_cord_rupture.html',
  '/SMP/l1_compression_fracture.html',
  '/SMP/l2_compression_fracture.html',
  '/SMP/l2_spinous_process_fracture.html',
  '/SMP/l2_transverse_process_fracture_right.html',
  '/SMP/senile_spondylopathy_l2.html',
  '/SMP/coccyx_fracture.html',
  
  // ПЕРЕЛОМЫ ЛИЦЕВОГО ЧЕРЕПА (facial_fractures.html)
  '/SMP/nasal_bones_nondisplaced.html',
  '/SMP/nasal_bones_displaced.html',
  '/SMP/zygomatic_bone.html',
  '/SMP/mandible.html',
  
  // ТРАВМЫ СВЯЗОК И МЫШЦ (ligament_muscle_injuries.html)
  '/SMP/lumbar_ligament_capsule_injury.html',
  '/SMP/posttraumatic_cervical_myositis.html',
  '/SMP/supraspinatus_muscle_injury_right.html',
  '/SMP/shoulder_joint_capsule_ligament_injury.html',
  '/SMP/biceps_brachii_long_head_avulsion_right.html',
  '/SMP/biceps_brachii_tendon_rupture.html',
  '/SMP/biceps_brachii_partial_injury.html',
  '/SMP/elbow_ligament_injury.html',
  '/SMP/wrist_ligament_injury.html',
  '/SMP/left_wrist_ligament_sprain.html',
  '/SMP/finger_extensor_tendon_avulsion_distal.html',
  '/SMP/finger_extensor_tendon_avulsion_proximal.html',
  '/SMP/finger_interphalangeal_ligament_injury.html',
  '/SMP/left_hand_extensor_tendon_rupture_iii_finger.html',
  '/SMP/right_hip_capsule_ligament_injury.html',
  '/SMP/left_quadriceps_tendon_rupture.html',
  '/SMP/medial_meniscus_injury_right_block_hemarthrosis.html',
  '/SMP/medial_collateral_ligament_injury.html',
  '/SMP/lateral_collateral_anterior_cruciate_ligament_injury_right_hemarthrosis.html',
  '/SMP/right_medial_meniscus_rupture.html',
  '/SMP/right_medial_collateral_ligament_rupture.html',
  '/SMP/left_anterior_cruciate_ligament_rupture.html',
  '/SMP/right_medial_collateral_ligament_partial_injury.html',
  '/SMP/right_ankle_ligament_injury.html',
  '/SMP/ankle_ligament_sprain.html',
  '/SMP/right_foot_ligament_injury.html',
  
  // CSS и основные файлы
  '/SMP/style.css',
  '/SMP/manifest.json',
  '/SMP/icon-512.png',
  '/SMP/1712743647196.png'
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
              return caches.match('/SMP/index.html');
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
