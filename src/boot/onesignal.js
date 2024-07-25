export default async () => {
  if (process.env.NODE_ENV === 'production') {
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId: 'YOUR_ONESIGNAL_APP_ID',
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
      });
    });
  }
};
