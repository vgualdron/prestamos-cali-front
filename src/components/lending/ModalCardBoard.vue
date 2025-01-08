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
              class="text-center div-relative"
              v-for="lending in lendings"
              :key="`div-table-lending-${lending.id}`">
              <div>
                <q-markup-table
                  class="markup-table"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="bg-green-3">
                      <td class="text-bold" colspan="2">
                        {{ getPeriod(lending) }}
                      </td>
                      <td class="text-bold" colspan="2">
                        RECLAMOS {{ getParamLocalStorage('NUMERO_DE_RECLAMOS').value }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="bg-green-3">
                        FECHA INICIO
                      </td>
                      <td class="">
                        {{ hasDoubleInterest ? formatDate(lending.doubleDate) : formatDate(lending.firstDate) }}
                      </td>
                      <td class="">
                        FECHA TERMINO
                      </td>
                      <td class="">
                      </td>
                    </tr>
                    <tr class="">
                      <td class="bg-green-3" colspan="1">
                        NOMBRE
                      </td>
                      <td class="text-red text-bold" colspan="3">
                        {{ lending.nameDebtor.toUpperCase() }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="bg-green-3">
                        VALOR
                      </td>
                      <td class="">
                        {{ hasDoubleInterest ? formatPrice(valueWithDoubleInterest(lending)) : formatPrice(valueWithInterest(lending)) }}
                      </td>
                      <td class="">
                        SALDO
                      </td>
                      <td class="">
                        {{ formatPrice(getBalance(lending)) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="bg-green-3">
                        CUOTA
                      </td>
                      <td class="">
                        {{ formatPrice(feeWithInterest(lending)) }}
                      </td>
                      <td class="">
                        PRESTADO
                      </td>
                      <td class="text-red text-bold">
                        {{ formatPrice(lending.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row div-relative">
                <q-markup-table
                  class="markup-table col-6"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="">
                      <td class="bg-green-3">
                        #
                      </td>
                      <td class="bg-green-3">
                        FECHA
                      </td>
                      <td class="bg-green-3">
                        ABONO
                      </td>
                      <td class="bg-green-3">
                        SALDO
                      </td>
                    </tr>
                    <tr
                      v-for="(payment) in filterDaysArray(getDaysArray(lending), 1, 15)"
                      :key="`tr-payment-${payment.date}-${lending.id}`"
                      class="">
                      <td class="bg-green-3">
                        {{ payment.index }}
                      </td>
                      <td :class="payment.classes">
                        {{ formatDate(payment.date) }}
                      </td>
                      <td :class="payment.classes">
                        <strong v-if="payment.amountNequi > 0 || payment.amountRenovation > 0">
                          {{ formatPrice(parseInt(payment.amountNequi, 10) + parseInt(payment.amountRenovation, 10)) }}
                        </strong>
                      </td>
                      <td :class="payment.classes">
                        {{ payment.balance > 0 ? formatPrice(payment.balance) : '' }}
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
                    <tr class="">
                      <td class="bg-green-3">
                        #
                      </td>
                      <td class="bg-green-3">
                        FECHA
                      </td>
                      <td class="bg-green-3">
                        ABONO
                      </td>
                      <td class="bg-green-3">
                        SALDO
                      </td>
                    </tr>
                    <tr
                      v-for="(payment) in filterDaysArray(getDaysArray(lending), 16, 30)"
                      :key="`tr-payment-${payment.index}`"
                      class="">
                      <td class="bg-green-3">
                        {{ payment.index }}
                      </td>
                      <td :class="payment.classes">
                        {{ formatDate(payment.date) }}
                      </td>
                      <td :class="payment.classes">
                        <strong v-if="payment.amountNequi > 0 || payment.amountRenovation > 0">
                          {{ formatPrice(parseInt(payment.amountNequi, 10) + parseInt(payment.amountRenovation, 10)) }}
                        </strong>
                      </td>
                      <td :class="payment.classes">
                        {{ formatPrice(payment.balance) }}
                      </td>
                    </tr>
                    <tr v-if="lending.period === 'semanal' && !lending.has_double_interest">
                      <td colspan="4">
                        <b>LAS FECHAS DE PAGO SON:</b>
                        <div v-for="date in datesPaymentsWeek(lending.firstDate, lending.amountFees)" :key="date">
                          {{ date }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <img
                  v-for="(image, index) in images"
                  :key="index"
                  :src="image.src"
                  :style="getImageStyle(image)"
                  class="draggable-image"
                  @mousedown="startDrag(index, $event)"
                />
              </div>
              <div class="div-relative">
                <q-markup-table
                  class="markup-table"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class=" text-red text-bold">
                      <td class="">
                        {{ getParamLocalStorage('TEXTO_ATRASO_DIARIO_EN_CARTULINA').value }}
                      </td>
                    </tr>
                    <tr class=" text-red text-bold">
                      <td class="">
                        {{ getParamLocalStorage('TEXTO_ATRASO_SEMANAL_EN_CARTULINA').value }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row text-center q-py-md">
                <vouchers v-if="showBtnPayments" :items="lending.payments" class="q-ml-sm" />
                <!-- <q-btn
                  v-if="isDoubleInterest(lending)"
                  class="q-ml-sm"
                  label="Aplicar doble interés"
                  color="primary"
                  @click="applyDoubleInterest(lending)" /> -->
              </div>
              <div class="divider"></div>
            </div>
            <div class="row text-center">
              <q-btn
                v-if="showBtnDownload"
                icon="content_copy"
                color="primary"
                @click="captureImage" />
              <stikers v-if="showStikers" v-model="images" class="q-ml-sm" />
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
import Stikers from './Stikers.vue';
import Vouchers from './Vouchers.vue';
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
      images: [],
      isDragging: false,
      draggedImageIndex: null,
      startMousePosition: { x: 0, y: 0 },
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
    showStikers: {
      type: Boolean,
      required: false,
      default: true,
    },
    showBtnPayments: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    Stikers,
    Vouchers,
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
    datesPaymentsWeek(startDate, n) {
      const dates = [];
      const currentDate = moment(startDate);
      currentDate.add(7, 'days');

      for (let i = 0; i < n; i += 1) {
        dates.push(currentDate.format('DD-MM-YYYY')); // Formato deseado de fecha
        currentDate.add(7, 'days');
      }

      return dates;
    },
    isDoubleInterest(row) {
      return this.showBtnApplyDoubleInterest && !row.has_double_interest && this.daysSinceGivenDate(row.firstDate) > 13 && this.getBalance(row) > row.amount;
    },
    daysSinceGivenDate(givenDate) {
      // Asegúrate de que la fecha dada esté en formato Date
      givenDate = new Date(givenDate);
      // Obtén la fecha actual
      const today = new Date();
      // Establece la hora de ambos objetos en medianoche para evitar problemas con la hora
      today.setHours(0, 0, 0, 0);
      givenDate.setHours(0, 0, 0, 0);
      // Calcula la diferencia en milisegundos
      const differenceInMillis = today - givenDate;
      // Convierte la diferencia a días
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor(differenceInMillis / millisecondsInADay);
      return daysPassed;
    },
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
    getImageStyle(image) {
      return {
        position: 'absolute',
        top: `${image.top}px`,
        left: `${image.left}px`,
        cursor: 'move',
        transition: this.isDragging ? 'none' : 'transform 0.2s',
      };
    },
    startDrag(index, event) {
      this.isDragging = true;
      this.draggedImageIndex = index;
      this.startMousePosition = { x: event.clientX, y: event.clientY };
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(event) {
      if (this.isDragging && this.draggedImageIndex !== null) {
        const deltaX = event.clientX - this.startMousePosition.x;
        const deltaY = event.clientY - this.startMousePosition.y;
        this.images[this.draggedImageIndex].top += deltaY;
        this.images[this.draggedImageIndex].left += deltaX;
        this.startMousePosition = { x: event.clientX, y: event.clientY };
      }
    },
    stopDrag() {
      this.isDragging = false;
      this.draggedImageIndex = null;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
    captureImage() {
      const divsToExclude = document.querySelectorAll('#div-container-lendings button');
      divsToExclude.forEach((div) => { div.style.display = 'none'; });
      const divStikers = document.querySelectorAll('#stikers');
      divStikers.forEach((div) => { div.style.display = 'none'; });

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
          console.log(err);
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
        console.log(error);
      }).finally(() => {
        // Restaura la visibilidad de los elementos
        divsToExclude.forEach((div) => { div.style.display = ''; });
        divStikers.forEach((div) => { div.style.display = ''; });
      });
    },
    getPaymentByDate(payments, date) {
      const pays = payments.filter((pay) => this.formatDate(pay.date) === this.formatDate(date) && pay.is_valid);
      if (pays) {
        let classes = '';
        let totalAmountNequi = 0;
        const paymentsNequi = pays.filter((pay) => pay.type === 'nequi');
        const paymentNequi = pays.find((pay) => pay.type === 'nequi');
        const paymentRenovation = pays.find((pay) => pay.type === 'renovacion');
        const dateDay = new Date(date);
        const currentDate = new Date();
        if (paymentsNequi && paymentsNequi.length > 0) {
          totalAmountNequi = paymentsNequi.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        }
        if (dateDay < currentDate) {
          classes = 'bg-red-3';
        }
        if ((paymentNequi && paymentNequi.amount > 0) || (paymentRenovation && paymentRenovation.amount > 0)) {
          classes = 'bg-orange-4';
        }
        if (date.getDay() === 0) {
          classes = 'bg-yellow';
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
        classes: date.getDay() === 0 ? 'bg-yellow' : '',
      };
    },
    getPaymentPostEndDate(payments, date) {
      return payments.filter((pay) => new Date(pay.date) > new Date(date) && pay.is_valid);
    },
    getPaymentBeforeFirstDate(payments, date) {
      return payments.filter((pay) => (new Date(pay.date) <= new Date(date) || this.formatDate(pay.date) === this.formatDate(date)) && pay.is_valid);
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
      const dateDouble = new Date(row.doubleDate);
      const total = row.amount + (row.amount * ((row.percentage * 2) / 100));
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => (payment.is_valid && new Date(payment.date) < dateDouble));
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      const totalDiscounts = 0;
      /* if (row.discounts && row.discounts.length > 0) {
        totalDiscounts = row.discounts.reduce((result, discount) => (parseInt(result, 10) + parseInt(discount.amount, 10)), 0);
      } */
      return (total - totalPayments - totalDiscounts);
    },
    feeWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val / row.amountFees);
    },
    getBalance(row) {
      const total = this.hasDoubleInterest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0 && !this.hasDoubleInterest) {
        const payments = row.payments.filter((payment) => payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      if (row.payments && row.payments.length > 0 && this.hasDoubleInterest) {
        const dateDouble = new Date(row.doubleDate);
        const payments = row.payments.filter((payment) => (payment.is_valid && dateDouble < new Date(payment.date)));
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      let totalDiscounts = 0;
      if (!this.hasDoubleInterest && row.discounts && row.discounts.length > 0) {
        totalDiscounts = row.discounts.reduce((result, discount) => (parseInt(result, 10) + parseInt(discount.amount, 10)), 0);
      }
      return (total - totalPayments - totalDiscounts);
    },
    getAmountfeesPaid(row) {
      const valueFee = this.feeWithInterest(row);
      let totalPayments = 0;
      let valueAmuntFeesPaid = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        valueAmuntFeesPaid = (parseInt(totalPayments, 10) / parseInt(valueFee, 10));
      }
      return Math.floor(valueAmuntFeesPaid);
    },
    filterDaysArray(array, min, max) {
      return array.filter((item) => item.index >= min && item.index <= max);
    },
    getDaysArray(row) {
      const feesPaid = this.getAmountfeesPaid(row);
      let value = this.hasDoubleInterest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);
      let index = 1;
      let indexFeesPaid = 1;
      const startCount = 1;
      const endCount = 30;
      const {
        firstDate,
        endDate,
        payments,
        doubleDate,
      } = row;
      const dates = [];
      let dateInit = firstDate;
      if (this.hasDoubleInterest) {
        dateInit = doubleDate;
      }
      const startDate = new Date(dateInit);
      const initDay = this.hasDoubleInterest ? 0 : 1;
      startDate.setDate(startDate.getDate() + initDay);
      let finishDate = new Date(endDate);
      if (this.hasDoubleInterest) {
        finishDate = new Date(dateInit);
        finishDate.setDate(finishDate.getDate() + 21);
      }

      const { discounts } = row;
      if (!this.hasDoubleInterest && discounts) {
        discounts.forEach((payment) => {
          value -= parseInt(payment.amount, 10);
        });
      }

      const beforePayments = this.getPaymentBeforeFirstDate(payments, firstDate);
      if (beforePayments) {
        beforePayments.forEach((payment) => {
          value -= parseInt(payment.amount, 10);
          dates.push({
            date: payment.date,
            amountNequi: payment.type === 'nequi' ? parseInt(payment.amount, 10) : 0,
            amountRenovation: payment.type === 'renovacion' ? parseInt(payment.amount, 10) : 0,
            typeNequi: payment.type === 'nequi' ? payment.type : '',
            typeRenovation: payment.type === 'renovacion' ? payment.type : '',
            classes: 'bg-orange-4',
            index,
            balance: value,
          });
          // index += 1;
        });
      }

      // Incrementa un día a la fecha actual hasta que sea igual a la fecha final
      while (startDate < finishDate) {
        const date = new Date(startDate);
        const {
          amountNequi,
          amountRenovation,
          typeNequi,
          typeRenovation,
          classes,
        } = this.getPaymentByDate(payments, date);

        if (index >= startCount && index < endCount) {
          let c = classes;
          value -= (parseInt(amountNequi, 10) + parseInt(amountRenovation, 10));
          if (indexFeesPaid <= feesPaid && classes !== 'bg-yellow' && !this.hasDoubleInterest) {
            c = 'bg-blue-4';
            indexFeesPaid += 1;
          }
          dates.push({
            date,
            amountNequi,
            amountRenovation,
            typeNequi,
            typeRenovation,
            classes: c,
            index,
            balance: value,
          });
        }
        startDate.setDate(startDate.getDate() + 1); // Incrementa un día
        index += 1;
      }
      const postPayments = this.getPaymentPostEndDate(payments, endDate);
      if (postPayments) {
        postPayments.forEach((payment) => {
          value -= parseInt(payment.amount, 10);
          dates.push({
            date: payment.date,
            amountNequi: payment.type === 'nequi' ? parseInt(payment.amount, 10) : 0,
            amountRenovation: payment.type === 'renovacion' ? parseInt(payment.amount, 10) : 0,
            typeNequi: payment.type === 'nequi' ? payment.type : '',
            typeRenovation: payment.type === 'renovacion' ? payment.type : '',
            classes: 'bg-orange-4',
            index,
            balance: value,
          });
          index += 1;
        });
      }
      return dates;
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
  .div-relative {
    position: relative
  }
  .img-absolute {
    position: absolute;
  }
  .draggable-image {
    object-fit: cover;
  }
</style>
