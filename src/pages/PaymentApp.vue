<template>
  <q-page class="">
    <table-payment-app />
  </q-page>
</template>

<script>
import TablePaymentApp from 'components/payment/TablePaymentApp.vue';

export default {
  components: { TablePaymentApp },
  data() {
    return {
    };
  },
  name: 'PagePaymentApp',
  computed: {
  },
};
</script>
