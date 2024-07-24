import { register } from 'register-service-worker';
import { Notify } from 'quasar';
import { messaging, getToken, onMessage } from '../src/firebaseConfig';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },
  ready(/* registration */) {
    console.log('Service worker is active');
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
  },
  registered(/* registration */) {
    console.log('Service worker has been registered.');
  },
  cached(/* registration */) {
    console.log('Content has been cached for offline use.');
  },
  updatefound(/* registration */) {
    console.log('New content is downloading.');
  },
  updated(/* registration */) {
    console.log('New content is available; please refresh.');
    Notify.create({
      message: `Hay una versión más reciente que la ${process.env.LATEST_VERSION_APP}, se actualizará automaticamente en un momento`,
      icon: 'cloud_download',
      color: 'green',
      timeout: 5000,
      textColor: 'white',
      classes: 'glossy',
      progress: true,
      onDismiss() {
        window.location.reload(true);
      },
    });
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.');
  },
  error(err) {
    console.error('Error during service worker registration:', err);
  },
});
