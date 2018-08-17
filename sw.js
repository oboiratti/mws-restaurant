var staticCacheName = 'restaurant-static-v8';
var contentImgsCache = 'restaurant-content-imgs';
var allCaches = [
    staticCacheName,
    contentImgsCache
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll([
                'css/styles.css',
                'index.html',
                'restaurant.html',
                'js/main.js',
                'js/restaurant_info.js',
                'js/dbhelper.js'
            ])
        })
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('restaurant-') && !allCaches.includes(cacheName)
                }).map((cacheName) => {
                    return caches.delete(cacheName)
                })
            )
        })
    )
})

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url)

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('index.html'))
            return
        }

        // if (requestUrl.pathname === '/restaurant') {
        //     event.respondWith(caches.match('restaurant.html', {ignoreSearch: true}))
        //     return
        // }

        // if (requestUrl.pathname.startsWith('/img/')) {
        //     event.respondWith(servePhoto(event.request));
        //     return;
        // }

        event.respondWith(
            caches.match(event.request, {ignoreSearch: true}).then((response) => {
                return response || fetch(event.request)
            })
        )
    }
})

// function servePhoto(request) {
//     var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

//     return caches.open(contentImgsCache).then(function (cache) {
//         return cache.match(storageUrl).then(function (response) {
//             if (response) return response;

//             return fetch(request).then(function (networkResponse) {
//                 cache.put(storageUrl, networkResponse.clone());
//                 return networkResponse;
//             });
//         });
//     });
// }