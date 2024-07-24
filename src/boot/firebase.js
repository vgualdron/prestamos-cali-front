// src/boot/firebase.js
import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import userApi from '../api/user/userApi';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCyjlzgtUlFwYGf7s5iq7DLYXiiMPKwvjE',
  authDomain: 'prestamos-cali.firebaseapp.com',
  projectId: 'prestamos-cali',
  storageBucket: 'prestamos-cali.appspot.com',
  messagingSenderId: '305627145746',
  appId: '1:305627145746:web:e4e5f7808eb9452ef91acb',
  measurementId: 'G-C26N9YLJCL',
};
console.log('Bot Firebase ...', firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
export default boot(({ app }) => {
  // Inicializa Firebase
  console.log(app);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        // messaging.useServiceWorker(registration);
        console.log(registration);
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            getToken(messaging, {
              vapidKey: 'BF5ukQnwtL2YN7onGRxABMcxQRj3kWIaVjChoNp_6EqtPM_DQlF-uvhf5HwYDzN-BHNi8VoBr_ZQyLy_R4LDHoI',
            }).then((currentToken) => {
              if (currentToken) {
                console.log('FCM Token:', currentToken);
                userApi.updatePushToken({ pushToken: currentToken });
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
      }).catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
    /* navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
      console.log('FIREBASE BOOT Service Worker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      console.log('FIREBASE BOOT Service Worker registration failed: ', err);
    }); */
  }
});
