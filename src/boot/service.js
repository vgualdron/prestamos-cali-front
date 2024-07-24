if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('SW -> Service Worker registrado con éxito:', registration);
  }).catch((error) => {
    console.error('SW -> Error al registrar el Service Worker:', error);
  });
}