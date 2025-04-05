<template>
  <q-page class="">
    <table-loans />
  </q-page>
</template>

<script>
import TableLoans from 'components/loan/TableLoans.vue';

export default {
  components: { TableLoans },
  data() {
    return {
    };
  },
  name: 'PageLoan',
};
</script>
