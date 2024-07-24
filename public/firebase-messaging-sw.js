// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js');
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// Configura la precaché y la ruta
const firebaseConfig = {
  apiKey: 'AIzaSyCyjlzgtUlFwYGf7s5iq7DLYXiiMPKwvjE',
  authDomain: 'prestamos-cali.firebaseapp.com',
  projectId: 'prestamos-cali',
  storageBucket: 'prestamos-cali.appspot.com',
  messagingSenderId: '305627145746',
  appId: '1:305627145746:web:e4e5f7808eb9452ef91acb',
  measurementId: 'G-C26N9YLJCL',
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    getToken(messaging, {
      vapidKey: 'BCNW0_ZWMaTUoLCp-h-oQgYj7OZaX6kbOPeymnZT79sJPNlU5RY7jqqIWSAa4leByqHM_v6Ejrkwkg__htRTRRI',
    }).then((currentToken) => {
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Envía este token a tu servidor para guardar y usar en notificaciones push
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Muestra una notificación usando payload.notification
    });
  } else {
    console.log('Unable to get permission to notify.');
  }
}).catch((err) => {
  console.log('Unable to get permission to notify.', err);
});
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});