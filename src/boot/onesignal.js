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
    window.OneSignal.push(async () => {
      await window.OneSignal.init({
        appId: 'da2c1da8-0e9d-4fd0-b66d-522fa6a77841',
        safari_web_id: 'web.onesignal.auto.212e621b-efc2-4b2a-9d36-9f4cd158ecec',
        notifyButton: {
          enable: true,
        },
        promptOptions: {
          siteName: 'Prestamos Cali',
          actionMessage: 'Quieres recibir notifiaciones?',
          exampleNotificationTitle: 'Example Notification Title .ZZZ',
          exampleNotificationMessage: 'Example Notification Message XXX',
          exampleNotificationCaption: 'You can unsubscribe at any time YYY',
        },
      });
    });
    window.OneSignal.on('subscriptionChange', (isSubscribed) => {
      if (isSubscribed) {
        window.OneSignal.getUserId((userId) => {
          console.log('OneSignal User ID:', userId);
        });
      }
    });
  }
};
