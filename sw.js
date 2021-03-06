self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('video-store').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/wave.js',
                '/mediaPolyfill.js',
                '/hearplus.svg',
                '/manifest.json',
                '/manifest.webmanifest',
                '/side.png',
                '/icons/android-icon-144x144.png',
                '/icons/android-icon-192x192.png',
                '/icons/android-icon-36x36.png',
                '/icons/android-icon-48x48.png',
                '/icons/android-icon-72x72.png',
                '/icons/android-icon-96x96.png',
                '/icons/apple-icon-114x114.png',
                '/icons/apple-icon-120x120.png',
                '/icons/apple-icon-144x144.png',
                '/icons/apple-icon-152x152.png',
                '/icons/apple-icon-180x180.png',
                '/icons/apple-icon-57x57.png',
                '/icons/apple-icon-60x60.png',
                '/icons/apple-icon-72x72.png',
                '/icons/apple-icon-76x76.png',
                '/icons/apple-icon-precomposed.png',
                '/icons/apple-icon.png',
                '/icons/favicon-16x16.png',
                '/icons/favicon-32x32.png',
                '/icons/favicon-96x96.png',
                '/icons/favicon.ico',
                '/icons/ms-icon-144x144.png',
                '/icons/ms-icon-150x150.png',
                '/icons/ms-icon-310x310.png',
                '/icons/ms-icon-70x70.png',
                '/icons//icons/hearplus1024.png',
            ]);
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
