<template>
  <q-page class="">
    <table-deposits />
  </q-page>
</template>

<script>
import TableDeposits from 'components/deposit/TableDeposits.vue';

export default {
  components: { TableDeposits },
  data() {
    return {
    };
  },
  name: 'PageDeposit',
};
</script>
