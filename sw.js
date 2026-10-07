// Cache offline: app shell (cache-first, versão) + fontes Google (stale-while-revalidate).
const V = 'sys-v6';
const SHELL = ['System.html', 'System_script.js', 'System_style.css', 'System_sync.js', 'System_mobile.js', 'System_extras.js', 'System_arquiteto.js', 'System_login.js', 'assets/logo.png', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    if (!fonts && url.origin !== location.origin) return; // API (OpenRouter/Supabase) nunca é cacheada
    // Mesma origem: rede primeiro (pega atualização), cai pro cache offline. Fontes: cache primeiro.
    if (fonts) {
        e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); return r; })));
    } else {
        e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); return r; }).catch(() => caches.match(req, { ignoreSearch: true })));
    }
});
