<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-height>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll" id="div-container-lendings">
          <div class="q-mt-xs">
            <div
              class="text-center"
              v-for="lending in lendings"
              :key="`div-table-lending-${lending.id}`">
              <div>
                <q-markup-table
                  class="markup-table"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="tr-table bg-pink-3">
                      <td class="td-table text-bold" colspan="2">
                        {{ getPeriod(lending) }}
                      </td>
                      <td class="td-table text-bold" colspan="2">
                        RECLAMOS {{ getParamLocalStorage('NUMERO_DE_RECLAMOS').value }}
                      </td>
                    </tr>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3">
                        FECHA INICIO
                      </td>
                      <td class="td-table">
                        {{ formatDate(lending.firstDate) }}
                      </td>
                      <td class="td-table">
                        FECHA TERMINO
                      </td>
                      <td class="td-table">
                      </td>
                    </tr>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3" colspan="1">
                        NOMBRE
                      </td>
                      <td class="td-table text-red text-bold" colspan="3">
                        {{ lending.nameDebtor.toUpperCase() }}
                      </td>
                    </tr>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3">
                        VALOR
                      </td>
                      <td class="td-table">
                        {{ hasDoubleInterest ? formatPrice(valueWithDoubleInterest(lending)) : formatPrice(valueWithInterest(lending)) }}
                      </td>
                      <td class="td-table">
                        SALDO
                      </td>
                      <td class="td-table">
                        {{ formatPrice(getBalance(lending)) }}
                      </td>
                    </tr>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3">
                        CUOTA
                      </td>
                      <td class="td-table">
                        {{ formatPrice(feeWithInterest(lending)) }}
                      </td>
                      <td class="td-table">
                        PRESTADO
                      </td>
                      <td class="td-table text-red text-bold">
                        {{ formatPrice(lending.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row">
                <q-markup-table
                  class="markup-table col-6"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3">
                        #
                      </td>
                      <td class="td-table bg-pink-3">
                        FECHA
                      </td>
                      <td class="td-table bg-pink-3">
                        ABONO
                      </td>
                      <td class="td-table bg-pink-3">
                        TIPO
                      </td>
                    </tr>
                    <tr
                      v-for="(payment) in getDaysArray(lending, 'one')"
                      :key="`tr-payment-${payment.index}`"
                      class="tr-table">
                      <td class="td-table bg-pink-3">
                        {{ payment.index }}
                      </td>
                      <td :class="payment.classes">
                        {{ formatDate(payment.date) }}
                      </td>
                      <td :class="payment.classes">
                        <strong v-if="payment.amountNequi > 0">
                          {{ formatPrice(payment.amountNequi) }}
                        </strong>
                        <br v-if="payment.amountNequi > 0">
                        <strong v-if="payment.amountRenovation > 0">
                          {{ formatPrice(payment.amountRenovation) }}
                        </strong>
                      </td>
                      <td :class="payment.classes">
                        {{ payment.typeNequi }}
                        <br v-if="payment.amountNequi > 0">
                        {{ payment.typeRenovation }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-markup-table
                  class="markup-table col-6"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="tr-table">
                      <td class="td-table bg-pink-3">
                        #
                      </td>
                      <td class="td-table bg-pink-3">
                        FECHA
                      </td>
                      <td class="td-table bg-pink-3">
                        ABONO
                      </td>
                      <td class="td-table bg-pink-3">
                        TIPO
                      </td>
                    </tr>
                    <tr
                      v-for="(payment) in getDaysArray(lending, 'two')"
                      :key="`tr-payment-${payment.index}`"
                      class="tr-table">
                      <td class="td-table bg-pink-3">
                        {{ payment.index }}
                      </td>
                      <td :class="payment.classes">
                        {{ formatDate(payment.date) }}
                      </td>
                      <td :class="payment.classes">
                        <strong v-if="payment.amountNequi > 0">
                          {{ formatPrice(payment.amountNequi) }}
                        </strong>
                        <br v-if="payment.amountNequi > 0">
                        <strong v-if="payment.amountRenovation > 0">
                          {{ formatPrice(payment.amountRenovation) }}
                        </strong>
                      </td>
                      <td :class="payment.classes">
                        {{ payment.typeNequi }}
                        <br v-if="payment.amountNequi > 0">
                        {{ payment.typeRenovation }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="">
                <q-markup-table
                  class="markup-table"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="tr-table text-red text-bold">
                      <td class="td-table">
                        {{ getParamLocalStorage('TEXTO_ATRASO_DIARIO_EN_CARTULINA').value }}
                      </td>
                    </tr>
                    <tr class="tr-table text-red text-bold">
                      <td class="td-table">
                        {{ getParamLocalStorage('TEXTO_ATRASO_SEMANAL_EN_CARTULINA').value }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row text-center q-py-md">
                <q-btn
                  v-if="showBtnApplyDoubleInterest && !lending.has_double_interest"
                  class="q-ml-sm"
                  label="Aplicar doble interés"
                  color="primary"
                  @click="applyDoubleInterest(lending)" />
              </div>
              <div class="divider"></div>
            </div>
            <div class="row text-center">
              <q-btn
                v-if="showBtnDownload"
                icon="content_copy"
                color="primary"
                @click="captureImage" />
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
import { Notify } from 'quasar';
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
    showBtnRenovate: {
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
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      updateLending: lendingTypes.actions.UPDATE_LENDING,
      deleteLending: lendingTypes.actions.DELETE_LENDING,
    }),
    getPeriod(row) {
      moment.locale('es');
      const format = 'dddd';
      const { period, firstDate } = row;
      const date = moment(firstDate);
      const text = `${period} ${period !== 'diario' ? date.format(format) : ''}`;
      return text.toUpperCase();
    },
    getParamLocalStorage(reference) {
      const configurations = localStorage.getItem('configurations');
      if (configurations) {
        const array = JSON.parse(configurations);
        if (array) {
          const obj = array.find((e) => e.reference === reference);
          if (obj) {
            return obj;
          }
        }
      }
      return {};
    },
    captureImage() {
      const divsToExclude = document.querySelectorAll('#div-container-lendings button');
      divsToExclude.forEach((div) => { div.style.display = 'none'; });

      const element = document.getElementById('div-container-lendings');

      domtoimage.toBlob(element).then((blob) => {
        // Crea un ClipboardItem a partir del blob
        const item = new ClipboardItem({ 'image/png': blob });

        // Copia el item al portapapeles
        navigator.clipboard.write([item]).then(() => {
          Notify.create({
            message: 'Imagen copiada en el portapapeles',
            icon: 'content_copy',
            color: 'green',
            timeout: 5000,
            textColor: 'white',
            classes: 'glossy',
          });
        }).catch((err) => {
          Notify.create({
            message: `Error al copiar la imagen al portapapeles: ${err}`,
            icon: 'content_copy',
            color: 'red',
            timeout: 5000,
            textColor: 'white',
            classes: 'glossy',
          });
        });
      }).catch((error) => {
        Notify.create({
          message: `Error al generar la imagen: ${error}`,
          icon: 'content_copy',
          color: 'red',
          timeout: 5000,
          textColor: 'white',
          classes: 'glossy',
        });
      }).finally(() => {
        // Restaura la visibilidad de los elementos
        divsToExclude.forEach((div) => { div.style.display = ''; });
      });
    },
    getDaysArray(lending, block) {
      let index = 1;
      const startCount = block === 'one' ? 1 : 16;
      const endCount = block === 'one' ? 16 : 30;
      const {
        firstDate,
        endDate,
        payments,
        created_at,
      } = lending;
      const dates = [];
      const startDate = new Date(firstDate);
      startDate.setDate(startDate.getDate() + 1);

      // Incrementa un día a la fecha actual hasta que sea igual a la fecha final
      while (startDate < new Date(endDate)) {
        const date = new Date(startDate);
        const {
          amountNequi,
          amountRenovation,
          typeNequi,
          typeRenovation,
          classes,
        } = this.getPaymentByDate(payments, date);

        if (index >= startCount && index < endCount) {
          dates.push({
            date,
            amountNequi,
            amountRenovation,
            typeNequi,
            typeRenovation,
            classes,
            index,
          });
        }
        startDate.setDate(startDate.getDate() + 1); // Incrementa un día
        index += 1;
      }
      if (block === 'two') {
        const postPayments = this.getPaymentPostEndDate(payments, endDate);
        if (postPayments) {
          postPayments.forEach((payment) => {
            dates.push({
              date: payment.date,
              amountNequi: payment.type === 'nequi' ? parseInt(payment.amount, 10) : 0,
              amountRenovation: payment.type === 'renovacion' ? parseInt(payment.amount, 10) : 0,
              typeNequi: payment.type === 'nequi' ? payment.type : '',
              typeRenovation: payment.type === 'renovacion' ? payment.type : '',
              classes: 'td-table bg-blue-4',
              index,
            });
            index += 1;
          });
        }
        const beforePayments = this.getPaymentBeforeFirstDate(payments, created_at);
        if (beforePayments) {
          beforePayments.forEach((payment) => {
            dates.push({
              date: payment.date,
              amountNequi: payment.type === 'nequi' ? parseInt(payment.amount, 10) : 0,
              amountRenovation: payment.type === 'renovacion' ? parseInt(payment.amount, 10) : 0,
              typeNequi: payment.type === 'nequi' ? payment.type : '',
              typeRenovation: payment.type === 'renovacion' ? payment.type : '',
              classes: 'td-table bg-blue-4',
              index,
            });
            index += 1;
          });
        }
      }
      return dates;
    },
    getPaymentByDate(payments, date) {
      const pays = payments.filter((pay) => this.formatDate(pay.date) === this.formatDate(date) && pay.status === 'aprobado');
      if (pays) {
        let classes = 'td-table';
        let totalAmountNequi = 0;
        const paymentsNequi = pays.filter((pay) => pay.type === 'nequi' && pay.status === 'aprobado');
        const paymentNequi = pays.find((pay) => pay.type === 'nequi');
        const paymentRenovation = pays.find((pay) => pay.type === 'renovacion');
        const dateDay = new Date(date);
        const currentDate = new Date();
        if (paymentsNequi && paymentsNequi.length > 0) {
          totalAmountNequi = paymentsNequi.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        }
        if (dateDay < currentDate) {
          classes = 'td-table bg-red-5';
        }
        if ((paymentNequi && paymentNequi.amount > 0) || (paymentRenovation && paymentRenovation.amount > 0)) {
          classes = 'td-table bg-blue-4';
        }
        if (date.getDay() === 0) {
          classes = 'td-table bg-yellow';
        }
        return {
          amountNequi: paymentNequi ? totalAmountNequi : 0,
          amountRenovation: paymentRenovation ? paymentRenovation.amount : 0,
          typeNequi: paymentNequi ? paymentNequi.type : '',
          typeRenovation: paymentRenovation ? paymentRenovation.type : '',
          classes,
        };
      }
      return {
        amountNequi: 0,
        amountRenovation: 0,
        classes: date.getDay() === 0 ? 'td-table bg-yellow' : 'td-table',
      };
    },
    getPaymentPostEndDate(payments, date) {
      return payments.filter((pay) => new Date(pay.date) > new Date(date) && pay.status === 'aprobado');
    },
    getPaymentBeforeFirstDate(payments, date) {
      return payments.filter((pay) => new Date(pay.date) < new Date(date) && pay.status === 'aprobado');
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
        doubleDate: moment().format('YYYY-MM-DD HH:mm:ss'),
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
    getBalance(row) {
      const total = this.hasDoubleInterest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.status === 'aprobado' && payment.type !== 'adelanto');
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
  },
};
</script>
<style scoped>
  .markup-table {
    display: block;
    border: solid 1px black;
  }
  .markup-table td {
    border: solid 1px black;
  }
  .divider {
    width: 100%;
    height: 3px;
    background-color: white;
    margin: 10px 0px;
  }
</style>
