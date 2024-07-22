// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js');
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
// Configura la precaché y la ruta
precacheAndRoute(self.__WB_MANIFEST || []);

const firebaseConfig = {
  apiKey: 'AIzaSyCyjlzgtUlFwYGf7s5iq7DLYXiiMPKwvjE',
  authDomain: 'prestamos-cali.firebaseapp.com',
  projectId: 'prestamos-cali',
  storageBucket: 'prestamos-cali.appspot.com',
  messagingSenderId: '305627145746',
  appId: '1:305627145746:web:e4e5f7808eb9452ef91acb',
  measurementId: 'G-C26N9YLJCL',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
clientsClaim();