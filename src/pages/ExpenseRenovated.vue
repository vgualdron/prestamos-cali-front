<template>
  <q-page class="">
    <table-expenses-renovated />
  </q-page>
</template>

<script>
import TableExpensesRenovated from 'components/expense/TableExpensesRenovated.vue';

export default {
  components: { TableExpensesRenovated },
  data() {
    return {
    };
  },
  name: 'PageExpenseRenovated',
};
</script>
