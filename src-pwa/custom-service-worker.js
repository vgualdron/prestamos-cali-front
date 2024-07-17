self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
  self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push received: ', data);
  
    const options = {
      body: data.body,
      icon: 'icons/icon-192x192.png',
      badge: 'icons/icon-128x128.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://your-app-url.com')
    );
  });