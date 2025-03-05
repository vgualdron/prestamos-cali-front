<template>
  <q-page class="">
    <table-news-change-pdf />
  </q-page>
</template>

<script>
import TableNewsChangePdf from 'src/components/new/TableNewsChangePdf.vue';

export default {
  components: { TableNewsChangePdf },
  data() {
    return {
    };
  },
  name: 'PageChangePdfNews',
};
</script>
