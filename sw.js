self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("redditus-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "style.css",
        "main.js",
        "redditus.png",
        "icon-192.png",
        "icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
