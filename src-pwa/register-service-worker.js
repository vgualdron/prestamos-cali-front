import { register } from 'register-service-worker';
import { Notify } from 'quasar';
import { messaging } from './firebaseConfig';

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
export default async ({ Vue }) => {
  register(process.env.SERVICE_WORKER_FILE, {
    // The registrationOptions object will be passed as the second argument
    // to ServiceWorkerContainer.register()
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

    // registrationOptions: { scope: './' },

    ready(/* registration */) {
      console.log('Service worker is active.');
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

  // Solicitar permiso para notificaciones
  try {
    await messaging.requestPermission()
    const token = await messaging.getToken()
    console.log('FCM Token:', token)
    // Envía este token a tu servidor para almacenarlo
  } catch (error) {
    console.error('Unable to get permission to notify.', error)
  }

  // Manejo de mensajes cuando la aplicación está en primer plano
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload)
    // Aquí puedes manejar la notificación recibida
  });
}
