if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
    console.log('SW fmc -> Service Worker registrado con éxito:', registration);
  }).catch((error) => {
    console.error('SW fmc -> Error al registrar el Service Worker:', error);
  });
}
