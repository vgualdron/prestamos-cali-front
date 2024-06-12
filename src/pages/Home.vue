<template>
  <q-page class="">
    <home />
    <camera/>
  </q-page>
</template>

<script>
import Home from 'components/home/Home.vue';
import Camera from 'components/common/Camera.vue';

export default {
  components: { Home, Camera },
  data() {
    return {
    };
  },
  name: 'PageHome',
  computed: {
  },
};
</script>
