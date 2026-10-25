const CACHE = 'carnet-28143803552b';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icone-803c0797-180.png', './icone-803c0797-192.png', './icone-803c0797-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('carnet-') === 0 && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const cle = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(CACHE).then(c => {
    const reseau = fetch(req).then(r => { if (r && r.ok) c.put(cle, r.clone()); return r; });
    const secours = () => c.match(cle, { ignoreSearch: true }).then(r => r || reseau);
    return new Promise(ok => {
      const t = setTimeout(() => ok(secours()), 5000);
      reseau.then(r => { clearTimeout(t); ok(r); }, () => { clearTimeout(t); ok(secours()); });
    });
  }));
});
