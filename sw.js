const CACHE = 'carnet-461c8d71b771';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('carnet-') === 0 && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const cle = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(CACHE).then(c => c.match(cle, { ignoreSearch: true }).then(enCache => {
    const reseau = fetch(req).then(r => { if (r && r.ok) c.put(cle, r.clone()); return r; }).catch(() => enCache);
    return enCache || reseau;
  })));
});
