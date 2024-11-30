<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      full-width
    >
      <q-card>
        <q-card-section class="row q-pb-none">
          <div class="text-h6">HOJA DE VIDA</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-pb-none">
          <cv-app v-if="row.type_cv === 'app'" :id="row.id"/>
          <cv-pdf v-else :id="row.id"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import CvApp from './cv/CvApp.vue';
import CvPdf from './cv/CvPdf.vue';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
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
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
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
  async created() {
    // await this.getItem();
  },
  methods: {
  },
  components: {
    CvApp,
    CvPdf,
  },
};
</script>
<style scoped>
  p {
    display: block;
    max-width: 640px;
    margin: auto;
  }
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
