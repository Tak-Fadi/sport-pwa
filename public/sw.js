const CACHE = "sport-pwa-v1";
// Chemins relatifs à la portée du SW (ex: https://.../sport-pwa/)
const ASSETS = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // network-first pour API éventuelle ; sinon cache-first
  if (url.pathname.includes("/api/")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
