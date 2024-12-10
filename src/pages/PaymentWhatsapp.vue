<template>
  <q-page class="">
    <table-payment-whatsapp />
  </q-page>
</template>

<script>
import TablePaymentWhatsapp from 'src/components/payment/TablePaymentWhatsapp.vue';

export default {
  components: { TablePaymentWhatsapp },
  data() {
    return {
    };
  },
  name: 'PagePaymentWhatsapp',
  computed: {
  },
};
</script>
