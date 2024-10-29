<template>
  <q-page class="">
    <table-expenses />
  </q-page>
</template>

<script>
import TableExpenses from 'components/expense/TableExpenses.vue';

export default {
  components: { TableExpenses },
  data() {
    return {
    };
  },
  name: 'PageExpense',
};
</script>
