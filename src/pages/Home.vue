<template>
  <q-page class="">
    <home />
  </q-page>
</template>

<script>
import Home from 'components/home/Home.vue';

export default {
  components: {
    Home,
  },
  data() {
    return {
      configCamera: {
        type: 'photo',
      },
    };
  },
  name: 'PageHome',
  computed: {
  },
};
</script>
