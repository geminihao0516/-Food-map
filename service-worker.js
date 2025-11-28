const CACHE_NAME = 'food-radar-v2.5';
const urlsToCache = [
  '/',
  '/index.html',
  '/index-optimized.html',
  '/food-radar-bilingual.html',
  '/food-radar-chinese.html',
  '/food-radar-thai.html'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截請求並從緩存返回
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在緩存中找到，返回緩存的版本
        if (response) {
          return response;
        }
        // 否則發起網絡請求
        return fetch(event.request);
      }
    )
  );
});

// 清理舊緩存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
