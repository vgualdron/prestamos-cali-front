<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos <br> {{ versionApp }}
    </div>
    <q-btn @click="subscribeToNotifications" label="Subscribe to Notifications" />
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
  },
};
</script>
