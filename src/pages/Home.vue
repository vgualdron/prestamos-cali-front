<template>
  <q-page class="">
    <home />
    <camera2/>
  </q-page>
</template>

<script>
import Home from 'components/home/Home.vue';
import Camera2 from 'components/common/Camera2.vue';

export default {
  components: { Home, Camera2 },
  data() {
    return {
    };
  },
  name: 'PageHome',
  computed: {
  },
};
</script>
