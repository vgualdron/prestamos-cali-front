<template>
  <q-page class="">
    <table-expenses-office />
  </q-page>
</template>

<script>
import TableExpensesOffice from 'components/expense/TableExpensesOffice.vue';

export default {
  components: { TableExpensesOffice },
  data() {
    return {
    };
  },
  name: 'PageExpenseOffice',
};
</script>
