<template>
  <q-page class="">
    <table-news />
  </q-page>
</template>

<script>
import TableNews from 'components/changePdfNews/TableNews.vue';

export default {
  components: { TableNews },
  data() {
    return {
    };
  },
  name: 'PageChangePdfNews',
};
</script>
