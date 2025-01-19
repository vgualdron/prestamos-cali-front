<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll" v-if="row && row.id">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-input
                outlined
                v-model="amount"
                label="Valor *"
                type="number"
                step="1000"
                :max="getBalance(row)"
                :hint="formattedPrice(amount)"
                :readonly="type === 'renovacion'"/>
            </div>
          </div>
          <div class="row q-mt-md" v-if="(amount > 0 && (this.type === 'nequi' || this.type === 'articulo') && amount <= getBalance(row)) || (this.isStreet && amount > 0 && amount <= row.value)">
            <div class="col-12 text-center">
              <p class="text-subtitle1 text-weight-bold text-center">AGREGAR FOTO DE SOPORTE DE PAGO</p>
              <upload-image
                :config="{
                  name: 'FOTO_TRANSFERENCIA_CUOTA',
                  storage: 'payments',
                  modelName: 'payments',
                  modelId: idPayment,
                  labelBtn: null,
                }"
                @savedFile="saveAddPayment"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md" v-if="type !=='nequi' && type !=='articulo'">
          <q-btn
            label="Guardar"
            color="primary"
            class="col q-ml-sm"
            :disabled="amount <= 0 || amount > valuePayment"
            @click="saveAddPayment"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import UploadImage from 'components/common/UploadImage.vue';
import paymentTypes from '../../store/modules/payment/types';
import fileTypes from '../../store/modules/file/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      amount: 0,
      idPayment: 0,
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
    type: {
      type: String,
      required: false,
      default: 'nequi',
    },
    isStreet: {
      type: Boolean,
      required: false,
      default: false,
    },
    valuePayment: {
      required: true,
    },
  },
  mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    if (this.type === 'renovacion') {
      this.amount = parseInt(this.valuePayment, 10);
    }
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(paymentTypes.PATH, {
      payments: 'payments',
      paymentStatus: 'status',
      paymentResponseMessages: 'responseMessages',
    }),
    ...mapState(fileTypes.PATH, {
      file: 'file',
      fileStatus: 'status',
      fileResponseMessages: 'responseMessages',
    }),
    isDiabledAdd() {
      return this.amount <= 0;
    },
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    columns() {
      return this.fields;
    },
    title() {
      return `Agregar cobro ${this.type}`;
    },
  },
  methods: {
    ...mapActions(paymentTypes.PATH, {
      fetchPaymentsByLending: paymentTypes.actions.FETCH_PAYMENTS_BY_LENDING,
      addPayment: paymentTypes.actions.ADD_PAYMENT,
      updatePayment: paymentTypes.actions.UPDATE_PAYMENT,
      deletePayment: paymentTypes.actions.DELETE_PAYMENT,
    }),
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
      updateFile: fileTypes.actions.UPDATE_FILE,
      getFile: fileTypes.actions.GET_FILE,
    }),
    getBalance(row) {
      const total = row.has_double_interest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      let totalDiscounts = 0;
      if (row.discounts && row.discounts.length > 0) {
        totalDiscounts = row.discounts.reduce((result, discount) => (parseInt(result, 10) + parseInt(discount.amount, 10)), 0);
      }
      return (total - totalPayments - totalDiscounts);
    },
    valueWithDoubleInterest(row) {
      const val = row.amount + (row.amount * ((row.percentage * 2) / 100));
      return (val);
    },
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    async saveAddPayment() {
      const { id } = this.row;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addPayment({
        lending_id: id,
        amount: this.amount,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        observation: '',
        type: this.type,
        is_valid: this.type === 'renovacion',
        is_street: this.isStreet,
        status: this.type === 'renovacion' ? 'aprobado' : 'creado',
        file_id: this.type === 'renovacion' ? null : this.file.id,
      });
      this.$q.loading.hide();
      if (this.paymentResponseMessages && this.paymentResponseMessages.data) {
        if (this.type === 'nequi' || this.type === 'articulo') {
          this.idPayment = this.paymentResponseMessages.data.id;
          await this.updateFile({
            ...this.file,
            model_id: this.idPayment,
          });
        }
        this.$q.loading.hide();
        this.showDialog = false;
        this.$emit('updateTable', this.row.listing_id);
        this.$emit('addPayment', { idFile: this.file.id });
      }
    },
    formattedPrice(value) {
      if (!value) return '';
      return value
        .toString()
        .replace(/\D/g, '') // Elimina caracteres no numéricos
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega puntos como separadores
    },
  },
  components: {
    UploadImage,
  },
};
</script>
