<template>
  <q-page class="">
    <table-time-advisors />
  </q-page>
</template>

<script>
import TableTimeAdvisors from 'src/components/diary/TableTimeAdvisors.vue';

export default {
  components: { TableTimeAdvisors },
  data() {
    return {
    };
  },
  name: 'PageReportTimeAdvisors',
};
</script>
