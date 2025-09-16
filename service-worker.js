const CACHE = 'salon-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
  // agrega icon-192.png e icon-512.png si los usas
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const {request} = e;
  if(request.method!=='GET') return;
  e.respondWith(
    caches.match(request).then(cached=>{
      return cached || fetch(request).then(resp=>{
        const copy = resp.clone();
        caches.open(CACHE).then(c=> c.put(request, copy)).catch(()=>{});
        return resp;
      }).catch(()=> cached);
    })
  );
});
