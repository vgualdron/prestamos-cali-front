<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos <br> {{ versionApp }}
    </div>
    <q-btn @click="subscribeToNotifications" label="Subscribe to Notifications" />
    <q-btn @click="sendNotification" label="Send Push Notification" />
  </div>
</template>
<script>

export default {
  data() {
    return {};
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
          console.log('subscribeToNotifications 3');
          window.OneSignal.showNativePrompt();
        });
      }
    },
    async sendNotification() {
      const sendPushNotification = async (data) => {
        const {
          app_id,
          headings,
          contents,
          included_segments,
        } = data;

        const headers = {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic Y2Y4ZTM1NTMtYjNjYi00NTg1LThhYzUtNTNiNWRmYThkNWY3',
        };

        const body = JSON.stringify({
          app_id,
          headings,
          contents,
          included_segments,
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
        app_id: '987c3bae-b888-435d-9809-8f4342661d8c',
        headings: { en: 'Título de la notificación' },
        contents: { en: 'Contenido de la notificación' },
        included_segments: ['Subscribed Users'],
      });
    },
  },
};
</script>
