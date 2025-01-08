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
                v-model.trim="amount"
                label="Valor *"
                type="number"
                step="1000"
                :max="getBalance(row)"
                :hint="formattedPrice(amount)"/>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Guardar"
            color="primary"
            class="col q-ml-sm"
            :disabled="amount <= 0 || amount > valuePayment"
            @click="saveAddDiscount"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import discountTypes from '../../store/modules/discount/types';
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
    valuePayment: {
      required: true,
    },
  },
  mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    // this.amount = parseInt(this.valuePayment, 10);
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(discountTypes.PATH, {
      discountStatus: 'status',
      discountResponseMessages: 'responseMessages',
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
      return 'Agregar descuento';
    },
  },
  methods: {
    ...mapActions(discountTypes.PATH, {
      addDiscount: discountTypes.actions.ADD_DISCOUNT,
    }),
    getBalance(row) {
      const total = row.has_double_interest ? this.valueWithInterest(row) : this.valueWithInterest(row);
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
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    async saveAddDiscount() {
      const { id } = this.row;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addDiscount({
        lending_id: id,
        amount: this.amount,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        observation: '',
        status: 'aprobado',
      });
      this.$q.loading.hide();
      if (this.discountResponseMessages && this.discountResponseMessages.data) {
        this.$q.loading.hide();
        this.showDialog = false;
        this.$emit('updateTable', this.row.listing_id);
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
  },
};
</script>
