self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/sw/',
        '/sw/index.html',
        '/sw/style.css',
        '/sw/app.js',
        '/sw/image-list.js',
        '/sw/star-wars-logo.jpg',
        '/sw/gallery/bountyHunters.jpg',
        '/sw/gallery/myLittleVader.jpg',
        '/sw/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw/gallery/myLittleVader.jpg');
      });
    }
  }));
});
