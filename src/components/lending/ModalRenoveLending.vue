<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Renovar préstamo
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll" v-if="row && row.id">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-banner v-if="row.has_double_interest" dense class="bg-info text-white text-center q-mb-md">
                El préstamo tiene aplicado el doble interés.
              </q-banner>
            </div>
            <div class="col-12 text-center">
              <q-form class="q-gutter-md">
                <q-input
                  outlined
                  v-model.trim="inputValue.date"
                  label="Fecha *"
                  lazy-rules
                  type="date"
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                  autocomplete="off"
                  readonly
                />
                <q-input
                  outlined
                  v-model.trim="inputValue.amount"
                  label="Valor *"
                  lazy-rules
                  :rules="[val => val && val > 0 && val < row.amount || `El valor debe ser mayor a $100.000 y menor o igual a ${formatPrice(row.amount)}`]"
                  type="number"
                  hide-bottom-space
                  autocomplete="off"
                  :disable="inputValue.isOlder"
                  :max="row.amount"
                />
                <q-checkbox
                  left-label
                  v-model="inputValue.isOlder"
                  text-h6
                  color="green"
                  label="Va a renovar por un monto adicional mayor?"
                />
                <q-select
                  v-if="inputValue.isOlder"
                  label="Valor adicional a solicitar *"
                  outlined
                  v-model.trim="inputValue.amountNew"
                  :disable="!inputValue.isOlder"
                  :options="[{
                    label: '$100.000',
                    value: 100000,
                  },
                  {
                    label: '$200.000',
                    value: 200000,
                  },
                  {
                    label: '$300.000',
                    value: 300000,
                  }]"/>
              </q-form>
              Total valor a renovar: {{ formatPrice(totalAmount) }}
            </div>
          </div>
          <!-- <div class="row text-center">
            <img :src="formatLink(row)" class="inherit-width"/>
          </div> -->
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Renovar"
            color="primary"
            class="col q-ml-sm"
            :disabled="!inputValue.date || inputValue.amount <= 0 || inputValue.amount > row.amount"
            @click="renoveLending"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import moment from 'moment';
// import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      inputValue: {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        amountNew: 0,
        isOlder: false,
      },
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
    this.inputValue.amount = this.row.amount;
    if (this.row.has_double_interest) {
      const [date] = new Date(this.row.doubleDate).toISOString().split('T');
      this.inputValue.date = date;
    }
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
    totalAmount() {
      let newValue = 0;
      if (this.inputValue.amountNew) {
        newValue = this.inputValue.amountNew.value;
      }
      return parseInt(this.inputValue.amount, 10) + parseInt(newValue, 10);
    },
  },
  methods: {
    formatLink(row) {
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
    renoveLending() {
      const data = {
        ...this.row,
        ...this.inputValue,
      };
      this.$emit('renoveLending', data);
      this.showDialog = false;
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
