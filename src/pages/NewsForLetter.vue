<template>
  <q-page class="">
    <table-news-for-letter />
  </q-page>
</template>

<script>
import TableNewsForLetter from 'src/components/new/TableNewsForLetter.vue';

export default {
  components: { TableNewsForLetter },
  data() {
    return {
    };
  },
  name: 'PageNewsForLetter',
};
</script>
