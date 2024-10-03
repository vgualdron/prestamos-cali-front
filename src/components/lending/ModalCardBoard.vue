<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-height>
      <q-card style="width: 700px; max-width: 80vw;" id="div-container-lendings">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll">
          <div class="row q-mt-xs">
            <div
              class="col-12 text-center"
              v-for="lending in lendings"
              :key="`div-table-lending-${lending.id}`">
              <q-markup-table
                class="markup-table"
                separator="cell"
                dense
              >
                <tbody>
                  <tr class="tr-table">
                    <td class="td-table">
                      <div class="text-subtitle1 text-weight-bold text-center">Valor:</div>
                    </td>
                    <td class="td-table">
                      {{ hasDoubleInterest ? formatPrice(valueWithDoubleInterest(lending)) : formatPrice(valueWithInterest(lending)) }}
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <div class="text-subtitle1 text-weight-bold text-center">Saldo:</div>
                    </td>
                    <td class="td-table">
                      {{ formatPrice(getBalance(lending)) }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
                <q-markup-table
                  class="markup-table q-mt-xs"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr
                      v-for="(payment, j) in getDaysArray(lending)"
                      :key="`tr-payment-${j}`"
                      class="tr-table">
                      <td class="td-table">
                        {{ j + 1 }}
                      </td>
                      <td class="td-table">
                        {{ formatDate(payment.date) }}
                      </td>
                      <td class="td-table">
                        <strong>{{ formatPrice(payment.amountNequi) }}</strong>
                        <br>
                        <strong v-if="payment.amountRenovation > 0">{{ formatPrice(payment.amountRenovation) }}</strong>
                      </td>
                      <td class="td-table">
                        {{ payment.typeNequi }}
                        <br>
                        {{ payment.typeRenovation }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <div class="row text-center q-pa-md">
                  <q-btn
                    v-if="showBtnDownload"
                    label="Descargar"
                    color="green"
                    @click="captureImage" />
                  <q-btn
                    v-if="showBtnApplyDoubleInterest && !lending.has_double_interest"
                    class="q-ml-sm"
                    label="Aplicar doble interés"
                    color="primary"
                    @click="applyDoubleInterest(lending)" />
                </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import domtoimage from 'dom-to-image';
import lendingTypes from '../../store/modules/lending/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      isLoadingTable: false,
      itemSelected: {},
      isDiabledAdd: false,
      showModal: false,
      listingSelected: null,
      valuePayment: 0,
      typeAction: 'aimage',
      imageData: '',
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    lendings: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: 'Title',
    },
    showBtnDownload: {
      type: Boolean,
      required: false,
      default: false,
    },
    showBtnApplyDoubleInterest: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDoubleInterest: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
  },
  watch: {
  },
  mounted() {
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
    whatsappLink() {
      return `https://wa.me/?text=${encodeURIComponent(this.imageData)}`;
    },
    totalNequi() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentToday(lending);
        if (value) {
          total += value.amount;
        }
      });
      return total;
    },
    totalUnitsNequi() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentToday(lending);
        if (value) {
          total += 1;
        }
      });
      return total;
    },
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      updateLending: lendingTypes.actions.UPDATE_LENDING,
      deleteLending: lendingTypes.actions.DELETE_LENDING,
    }),
    captureImage() {
      const element = document.getElementById('div-container-lendings');

      // Captura el elemento como imagen
      domtoimage.toPng(element).then((dataUrl) => {
        // Crear un enlace para descargar la imagen
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'captura.png';
        link.click();
      }).catch((error) => {
        console.error('Error al generar la imagen:', error);
      });
    },
    getDaysArray(lending) {
      const { firstDate, endDate, payments } = lending;
      const dates = [];
      const currentDate = new Date(firstDate);
      currentDate.setDate(currentDate.getDate() + 1);

      // Incrementa un día a la fecha actual hasta que sea igual a la fecha final
      while (currentDate < new Date(endDate)) {
        const date = new Date(currentDate);
        const {
          amountNequi,
          amountRenovation,
          typeNequi,
          typeRenovation,
        } = this.getPaymentByDate(payments, date);

        dates.push({
          date,
          amountNequi,
          amountRenovation,
          typeNequi,
          typeRenovation,
        });
        currentDate.setDate(currentDate.getDate() + 1); // Incrementa un día
      }

      return dates;
    },
    getPaymentByDate(payments, date) {
      const pays = payments.filter((pay) => this.formatDate(pay.date) === this.formatDate(date));
      if (pays) {
        const paymentNequi = pays.find((pay) => pay.type === 'nequi');
        const paymentRenovation = pays.find((pay) => pay.type === 'renovacion');
        return {
          amountNequi: paymentNequi ? paymentNequi.amount : 0,
          amountRenovation: paymentRenovation ? paymentRenovation.amount : 0,
          typeNequi: paymentNequi ? paymentNequi.type : '',
          typeRenovation: paymentRenovation ? paymentRenovation.type : '',
        };
      }
      return {
        amountNequi: 0,
        amountRenovation: 0,
      };
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async applyDoubleInterest(row) {
      showLoading('aplicando ...', 'Por favor, espere', true);
      await this.updateLending({
        ...row,
        has_double_interest: true,
      });
      this.$q.loading.hide();
      this.showDialog = false;
      this.$emit('updateTable', row.listing_id);
    },
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    valueWithDoubleInterest(row) {
      const val = row.amount + (row.amount * ((row.percentage * 2) / 100));
      return (val);
    },
    feeWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val / row.amountFees);
    },
    getAmountfeesPaid(row) {
      const valueFee = this.feeWithInterest(row);
      let totalPayments = 0;
      let valueAmuntFeesPaid = 0;
      if (row.payments && row.payments.length > 0) {
        totalPayments = row.payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        valueAmuntFeesPaid = (parseInt(totalPayments, 10) / parseInt(valueFee, 10));
      }
      return Math.floor(valueAmuntFeesPaid);
    },
    getBalance(row) {
      const total = this.hasDoubleInterest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);

      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        totalPayments = row.payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
    hasPaymentToday(row) {
      let has = false;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day')) {
            has = true;
          }
        });
      }
      return has;
    },
    getPaymentToday(row) {
      let pay = null;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day')) {
            pay = payment;
          }
        });
      }
      return pay;
    },
    async save(field, value) {
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value ? value.value : value;
      await this.updateListing(this.itemSelected);
      this.isLoadingTable = false;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addPayment(row) {
      this.valuePayment = this.feeWithInterest(row);
      this.showModal = true;
    },
  },
};
</script>
<style scoped>
  .bg-light-red {
    background-color: #f8d7da !important;
  }
  .bg-light-green {
    background-color: #d4edda !important;
  }
</style>
