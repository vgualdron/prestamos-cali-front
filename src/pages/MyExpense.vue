<template>
  <q-page class="">
    <table-my-expenses />
  </q-page>
</template>

<script>
import TableMyExpenses from 'components/expense/TableMyExpenses.vue';

export default {
  components: { TableMyExpenses },
  data() {
    return {
    };
  },
  name: 'PageMyExpenses',
};
</script>
