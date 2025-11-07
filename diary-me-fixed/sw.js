// sw.js - Service Worker for DiaryMe PWA

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Basic caching (optional, can be expanded)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('diaryme-cache-v1').then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          // Optionally cache new requests
          // cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// Listen for push notifications (requires backend integration)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'DiaryMe Reminder';
  const options = {
    body: data.body || 'Don’t forget to write your diary entry!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
