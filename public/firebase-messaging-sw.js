import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

// Configura la precaché y la ruta
const app = initializeApp({
  apiKey: 'AIzaSyCyjlzgtUlFwYGf7s5iq7DLYXiiMPKwvjE',
  authDomain: 'prestamos-cali.firebaseapp.com',
  projectId: 'prestamos-cali',
  storageBucket: 'prestamos-cali.appspot.com',
  messagingSenderId: '305627145746',
  appId: '1:305627145746:web:e4e5f7808eb9452ef91acb',
  measurementId: 'G-C26N9YLJCL',
});
const messaging = getMessaging(app);
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido ', payload);
  const notificationTitle = 'Título del Mensaje en Segundo Plano';
  const notificationOptions = {
    body: 'Cuerpo del Mensaje en Segundo Plano.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});