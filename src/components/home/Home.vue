<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos ... <br> {{ versionApp }} <br>
      Token: <br> {{ userId }}
      <q-input
          outlined
          v-model.trim="userId"
          label="Token *"
          hint="Escriba el token"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
        />
    </div>
    <q-btn @click="subscribeToNotifications" label="Subscribe to Notifications" />
    <q-btn @click="unsubscribeFromNotifications" label="Unsubscribe from Notifications" />
    <q-btn @click="sendNotification" label="Send Push Notification" />
    <q-btn @click="getUser" label="GET USER" />
  </div>
</template>
<script>

export default {
  data() {
    return {
      userId: null,
    };
  },
  props: [],
  computed: {
    versionApp() {
      return `Version ${process.env.LATEST_VERSION_APP}`;
    },
  },
  components: {
  },
  mounted() {
    this.validateLogin();
  },
  methods: {
    validateLogin() {
      if (!localStorage.getItem('tokenMC')) {
        this.$router.push('/');
      }
    },
    subscribeToNotifications() {
      console.log('subscribeToNotifications 1');
      if (window.OneSignal) {
        console.log('subscribeToNotifications 2');
        window.OneSignal.push(() => {
          window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            console.log('subscribeToNotifications 3', isEnabled);
            if (!isEnabled) {
              console.log('subscribeToNotifications 4');
              window.OneSignal.showNativePrompt();
            } else {
              console.log('Push notifications are already enabled!');
            }
          });
        });
      }
    },
    unsubscribeFromNotifications() {
      console.log('unsubscribeFromNotifications 1');
      if (window.OneSignal) {
        console.log('unsubscribeFromNotifications 2');
        window.OneSignal.push(() => {
          console.log('unsubscribeFromNotifications 3');
          window.OneSignal.setSubscription(false);
        });
      }
    },
    async sendNotification() {
      const sendPushNotification = async (data) => {
        const {
          app_id,
          headings,
          contents,
          include_player_ids,
        } = data;

        const headers = {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic MGM2OTI2NzYtM2ExMy00MGI4LWIwZWMtMjYxNzRkNDI0NGRj',
        };

        const body = JSON.stringify({
          app_id,
          headings,
          contents,
          include_player_ids,
        });

        try {
          const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers,
            body,
          });

          const responseData = await response.json();
          console.log('Notification sent successfully:', responseData);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      };
      // Uso de la función
      await sendPushNotification({
        app_id: 'da2c1da8-0e9d-4fd0-b66d-522fa6a77841',
        headings: { en: 'Título de la notificación' },
        contents: { en: 'Contenido de la notificación' },
        include_player_ids: [this.userId],
      });
    },
    getUser() {
      window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
          if (isEnabled) {
            console.log('Push notifications are enabled!');
            window.OneSignal.getUserId((userId) => {
              console.log('OneSignal User ID:', userId);
              // Asegúrate de guardar este userId en tu base de datos para usarlo más tarde
            });
          } else {
            console.log('Push notifications are not enabled.');
          }
        });
      });
    },
  },
};
</script>
