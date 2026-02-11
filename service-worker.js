const CACHE_NAME = "hello-kitty-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  // adiciona aqui outros assets que quiseres cachear, como CSS, JS e imagens
];

// Evento de instalação
self.addEventListener("install", event => {
  // Forçar ativação imediata
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })

