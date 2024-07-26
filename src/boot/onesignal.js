export default async () => {
  if (process.env.NODE_ENV === 'production') {
    /* const loadOneSignalSDK = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
    await loadOneSignalSDK; */
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId: '987c3bae-b888-435d-9809-8f4342661d8c',
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
      });
    });
  }
};
