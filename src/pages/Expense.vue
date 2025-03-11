<template>
  <q-page class="">
    <table-resume-expenses-pending />
    <table-expenses />
  </q-page>
</template>

<script>
import TableExpenses from 'components/expense/TableExpenses.vue';
import TableResumeExpensesPending from 'components/expense/TableResumeExpensesPending.vue';

export default {
  components: { TableExpenses, TableResumeExpensesPending },
  data() {
    return {
    };
  },
  name: 'PageExpense',
};
</script>
