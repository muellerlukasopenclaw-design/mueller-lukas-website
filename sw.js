/**
 * Lukas Müller - Personal Website Service Worker
 * Cache-First Strategie für schnelle Performance
 * Version: 1.0.0
 */

const CACHE_NAME = 'lukas-mueller-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/wordcloud.js',
  '/404.html',
  '/favicon.svg'
];

// Install: Cache statische Assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Caching failed:', err);
      })
  );
});

// Activate: Alte Caches aufräumen
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Cache-First Strategie
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          // Cache-Hit
          return cached;
        }
        
        // Cache-Miss: Fetch vom Netzwerk
        return fetch(request)
          .then((response) => {
            if (!response || !response.ok) {
              return response;
            }
            
            // Nur statische Assets cachen
            const url = new URL(request.url);
            if (isCacheable(request, url)) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            
            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            // Offline-Fallback
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/404.html');
            }
            throw error;
          });
      })
  );
});

function isCacheable(request, url) {
  const cacheableExtensions = ['.css', '.js', '.svg', '.png', '.jpg', '.woff', '.woff2', '.json'];
  return cacheableExtensions.some((ext) => url.pathname.endsWith(ext));
}
