<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos ... <br> {{ versionApp }} <br>
      <q-input
        outlined
        v-model.trim="userId"
        label="Token *"
        hint="Escriba el token"
        class="q-mt-sm"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
      />
      <q-input
        outlined
        v-model.trim="title"
        label="Titulo *"
        hint="Escriba el titulo"
        class="q-mt-sm"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
      />
      <q-input
        outlined
        v-model.trim="content"
        label="Contenido *"
        hint="Escriba el contenido"
        class="q-mt-sm"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
      />
      <q-input
        outlined
        v-model.trim="url"
        label="URL *"
        hint="Escriba la url"
        class="q-mt-sm"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
      />
    </div>
    <!-- <q-btn @click="subscribeToNotifications" label="Subscribe to Notifications" />
    <q-btn @click="unsubscribeFromNotifications" label="Unsubscribe from Notifications" />
    <q-btn @click="sendNotificationPush" label="Send Push Notification" />
    <q-btn @click="getUser" label="GET USER" /> -->
    <div class='onesignal-customlink-container'></div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import notificationTypes from '../../store/modules/notification/types';

export default {
  data() {
    return {
      userId: 'f2f506fe-1afa-46ad-a60c-299f17c2a6ea',
      title: 'Titulo',
      content: 'Contenido',
      url: 'https://documentation.onesignal.com/docs/permission-requests',
    };
  },
  props: [],
  computed: {
    ...mapState(notificationTypes.PATH, [
      'status',
      'responseMessages',
    ]),
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
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
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
          // window.OneSignal.registerForPushNotifications();
          console.log('subscribeToNotifications 4');
          window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            console.log('subscribeToNotifications 5', isEnabled);
            if (!isEnabled) {
              console.log('subscribeToNotifications 6');
              window.OneSignal.registerForPushNotifications();
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
    async sendNotificationPush() {
      const data = {
        app_id: 'da2c1da8-0e9d-4fd0-b66d-522fa6a77841',
        headings: { en: this.title },
        contents: { en: this.content },
        include_player_ids: [this.userId],
        url: [this.url],
      };
      await this.sendNotification(data);
    },
    getUser() {
      console.log('getUser 1');
      window.OneSignal.push(() => {
        console.log('getUser 2');
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
          console.log('getUser 3');
          if (isEnabled) {
            console.log('getUser 4');
            console.log('Push notifications are enabled!');
            window.OneSignal.getUserId((userId) => {
              console.log('OneSignal User ID:', userId);
              // Asegúrate de guardar este userId en tu base de datos para usarlo más tarde
            });
          } else {
            console.log('getUser 5');
            console.log('Push notifications are not enabled.');
          }
        });
      });
    },
  },
};
</script>
