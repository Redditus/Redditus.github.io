// Nome do cache
const CACHE_NAME = "zero-cache-v2";

// Arquivos a guardar para funcionar offline
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instala o Service Worker e armazena os arquivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Z.E.R.O. cache atualizado");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log("🧹 Removendo cache antigo:", key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Intercepta requisições e responde do cache (modo offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// === 💬 Suporte a notificações ===
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      // Se o app já estiver aberto, foca nele
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      // Senão, abre o app novamente
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
