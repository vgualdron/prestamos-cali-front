<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Ya existe un pago con esa referencia
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll" v-if="row && row.id">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <b>Nombre nequi:</b> {{ row.nequi }}
            </div>
            <div class="col-12 text-center">
              <b>Referencia:</b> {{ row.reference }}
            </div>
            <div class="col-12 text-center">
              <b>Valor:</b> {{ formatPrice(row.amount)}}
            </div>
            <div class="col-12 text-center">
              <b>Fecha de ingreso de pago:</b> {{ formatDate(row.date)}}
            </div>
            <div class="col-12 text-center">
              <b>Fecha de transacción:</b> {{ formatDate(row.date_transaction)}}
            </div>
          </div>
          <div class="row text-center">
            <img :src="formatLink(row)" class="inherit-width"/>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Cerrar"
            color="primary"
            class="col q-ml-sm"
            @click="showDialog = false"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import { showLoading } from '../../helpers/showLoading';

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
      type: Object,
      required: true,
    },
  },
  mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    this.$q.loading.hide();
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
  },
  methods: {
    formatLink(row) {
      console.log(row);
      if (row.file) {
        return `${process.env.URL_FILES}${row.file.url}`;
      }
      return '';
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
  },
  components: {
  },
};
</script>
<style scoped>
  .inherit-width {
    width: -webkit-fill-available;;
  }
</style>
