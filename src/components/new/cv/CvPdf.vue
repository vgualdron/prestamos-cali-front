<template>
  <q-page>
    <pdf
      :src="pdfUrl"
      style="width: 100%; height: 100vh;"
    ></pdf>
  </q-page>
</template>
<script>
import pdf from 'vue-pdf';
import { havePermission } from '../../../helpers/havePermission';

export default {
  data() {
    return {
      pdfUrl: 'https://micomercio.com.co/api-prestamos/storage/app/public/news/3/PDF-CV-3.pdf',
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    row: {
      require: true,
    },
  },
  computed: {
    validatedPermissions() {
      const statusReview = havePermission('visit.review');
      const statusVoucher = havePermission('visit.voucher');
      return {
        review: {
          title: statusReview ? 'Revisar visita' : 'No tiene permisos para revisar visitas',
          status: statusReview,
        },
        voucher: {
          title: statusVoucher ? 'Agregar voucher' : 'No tiene permisos para agregar voucher',
          status: statusVoucher,
        },
      };
    },
  },
  created() {
  },
  methods: {
  },
  components: {
    pdf,
  },
};
</script>
<style scoped>
  .table-container {
    text-align: center;
  }
  .markup-table {
    display: block;
    max-width: 250px;
    min-width: 250px;
    margin: auto;
  }
  .z-index-btn {
    z-index: 20;
  }
  .q-card__section > .text-h6 {
    border: none;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .div-container {
    border: solid 1px rgb(145, 140, 140);
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    width: 300px;
  }
  .q-banner {
    display: none !important;
  }
</style>
