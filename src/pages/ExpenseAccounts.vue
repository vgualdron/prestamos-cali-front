<template>
  <q-page class="">
    <table-expenses-accounts />
  </q-page>
</template>

<script>
import TableExpensesAccounts from 'components/expense/TableExpensesAccounts.vue';

export default {
  components: { TableExpensesAccounts },
  data() {
    return {
    };
  },
  name: 'PageExpenseAccounts',
};
</script>
