<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Entrega {{ list.label }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll" id="div-container-delivery">
          <div v-if="delivery.itemPaymentRejects && delivery.itemPaymentRejects.total_count > 0" class="row q-mt-none">
            <div class="col-12 text-center">
              <q-banner class="bg-red text-white q-ma-md">
                Tiene {{ delivery.itemPaymentRejects.total_count }} pagos rechazados,
                que suman un total de {{ formatPrice(delivery.itemPaymentRejects.total_amount) }}.
                Debe borrar los pagos rechazados, para poder realizar la entrega.
              </q-banner>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-markup-table
                class="markup-table"
                separator="cell"
                dense
                v-if="delivery.date"
                >
                  <tbody>
                    <tr class="bg-yellow-3">
                      <td class="text-bold" colspan="4">
                        RUTA
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        CARTERA
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ list.label }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        FECHA
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ formatDate(delivery.date) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        PAGOS TRANSFERENCIAS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemPayment.total_count_nequi }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemPayment.total_amount_nequi) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        ADELANTOS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemPayment.total_count_repayment }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemPayment.total_amount_repayment) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        PAGOS ARTICULOS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemPayment.total_count_article }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemPayment.total_amount_article) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        RENOVACIONES
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemRenove.total_count }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemRenove.total_amount) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        NUEVOS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemNovel.total_count }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemNovel.total_amount) }}
                      </td>
                    </tr>
                    <tr class="bg-blue-2">
                      <td class="" colspan="1">
                        <b>SUBTOTAL</b>
                      </td>
                      <td class="" colspan="1">
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ formatPrice(this.subtotal) }}
                      </td>
                    </tr>
                    <tr class="bg-yellow-3">
                      <td class="text-bold" colspan="4">
                        BANCO
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        ADELANTOS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemPayment.total_count_repayment }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemPayment.total_amount_repayment) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        GASTO RENOVACIONES
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemExpense.total_count_renovation }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemExpense.total_amount_renovation) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        GASTO NUEVOS
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemNovel.total_count }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemNovel.total_amount) }}
                      </td>
                    </tr>
                    <tr class="bg-blue-2">
                      <td class="" colspan="1">
                        <b>SUBTOTAL</b>
                      </td>
                      <td class="" colspan="1">
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ formatPrice(this.subtotalExpenses) }}
                      </td>
                    </tr>
                    <tr :class="difference === 0 ? 'bg-green-3' : 'bg-red-3'">
                      <td class="" colspan="1">
                        <b>TOTAL</b>
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ formatPrice(this.total) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="bg-yellow-3" colspan="1">
                        SECRETARIA
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ formatPrice(delivery.itemPayment.total_amount_secre) }}
                      </td>
                      <td class="bg-yellow-3" colspan="1">
                        CALLE
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ formatPrice(delivery.itemPayment.total_amount_street) }}
                      </td>
                    </tr>
                    <tr :class="difference === 0 ? 'bg-green-3' : 'bg-red-3'">
                      <td class="" colspan="1">
                        DIFERENCIA
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ formatPrice(difference) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        CLIENTES
                      </td>
                      <td class="text-bold" colspan="3">
                        {{ delivery.itemPayment.total_clients }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-banner
                  v-if="difference > 0"
                  class="bg-red text-white q-ma-md">
                  No se puede hace entrega por que hay descuadre.
                </q-banner>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div v-if="hasPermission('list.closedDelivery') && !delivery.itemDelivery" class="row text-center q-pa-md">
          <q-btn
            label="Cerrar entrega"
            icon="assignment_returned"
            color="primary"
            :disable="(difference > 0) || (delivery.itemPaymentRejects && delivery.itemPaymentRejects.total_count > 0)"
            @click="captureImage" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import domtoimage from 'dom-to-image';
import moment from 'moment';
import fileTypes from '../../store/modules/file/types';
import listingTypes from '../../store/modules/listing/types';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      location: null,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Object,
      required: true,
    },
    totalAmount: {
      require: true,
    },
    capital: {
      require: true,
    },
  },
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.fetchDelivery({ date: this.date, idList: this.list.value });
    this.$q.loading.hide();
  },
  watch: {
  },
  computed: {
    ...mapState(listingTypes.PATH, {
      delivery: 'delivery',
      questionStatus: 'status',
      questionResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    subtotal() {
      const transfer = this.delivery && this.delivery.itemPayment && this.delivery.itemPayment.total_amount_nequi
        ? parseInt(this.delivery.itemPayment.total_amount_nequi, 10)
        : 0;
      const repayment = this.delivery && this.delivery.itemPayment && this.delivery.itemPayment.total_amount_repayment
        ? parseInt(this.delivery.itemPayment.total_amount_repayment, 10)
        : 0;
      const article = this.delivery && this.delivery.itemPayment && this.delivery.itemPayment.total_amount_article
        ? parseInt(this.delivery.itemPayment.total_amount_article, 10)
        : 0;
      const renove = this.delivery && this.delivery.itemRenove
        ? parseInt(this.delivery.itemRenove.total_amount, 10)
        : 0;
      const novel = this.delivery && this.delivery.itemNovel
        ? parseInt(this.delivery.itemNovel.total_amount, 10)
        : 0;

      return transfer + renove + novel + repayment + article;
    },
    subtotalExpenses() {
      const repayment = parseInt(this.delivery.itemPayment.total_amount_repayment, 10);
      const renove = parseInt(this.delivery.itemExpense.total_amount_renovation, 10);
      const novel = parseInt(this.delivery.itemNovel.total_amount, 10);
      return renove + novel + repayment;
    },
    total() {
      return this.subtotal - this.subtotalExpenses;
    },
    difference() {
      return parseInt(this.totalAmount, 10) - parseInt(this.total, 10);
    },
  },
  methods: {
    ...mapActions(listingTypes.PATH, {
      fetchDelivery: listingTypes.actions.FETCH_DELIVERY,
      addDeliveryListing: listingTypes.actions.ADD_DELIVERY_LISTING,
    }),
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
    }),
    hasPermission(value) {
      return havePermission(value);
    },
    formatLink(row) {
      if (row.file) {
        return `${process.env.URL_FILES}${row.file.url}`;
      }
      return '';
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
    async getLocation() {
      try {
        if (navigator.geolocation) {
          // Usamos una promesa para envolver el método getCurrentPosition
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          // Almacenamos la latitud y longitud
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          this.error = 'Unable to retrieve location. Please allow access.';
        }
      } catch (err) {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    async captureImage() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addDeliveryListing({
        listing_id: this.list.value,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        transfers_count: this.delivery.itemPayment.total_count_nequi,
        transfers_amount: this.delivery.itemPayment.total_amount_nequi,
        advances_count: this.delivery.itemPayment.total_count_repayment,
        advances_amount: this.delivery.itemPayment.total_amount_repayment,
        articles_count: this.delivery.itemPayment.total_count_article,
        articles_amount: this.delivery.itemPayment.total_amount_article,
        renovations_count: this.delivery.itemRenove.total_count,
        renovations_amount: this.delivery.itemRenove.total_amount,
        expenses_news_count: this.delivery.itemNovel.total_count,
        expenses_news_amount: this.delivery.itemNovel.total_amount,
        expenses_renovations_count: this.delivery.itemExpense.total_count_renovation,
        expenses_renovations_amount: this.delivery.itemExpense.total_amount_renovation,
        collection_secre: this.delivery.itemPayment.total_amount_secre,
        collection_street: this.delivery.itemPayment.total_amount_street,
        clients: this.delivery.itemPayment.total_clients,
        capital: this.capital,
      });
      await this.captureImageList();
      await this.captureImageDelivery();
      this.$emit('updateTable', this.list.value);
      this.$q.loading.hide();
      this.showDialog = false;
    },
    async captureImageDelivery() {
      const element = document.getElementById('div-container-delivery');
      await domtoimage.toPng(element).then(async (blob) => {
        await this.sendImage(blob.split(',')[1], 'CAPTURE_DELIVERY');
      }).catch((error) => {
        console.log(error);
      });
    },
    async captureImageList() {
      const element = document.getElementById('div-container-list');
      const divsToExclude = document.querySelectorAll('#div-container-list > div.q-table__middle.scroll');
      divsToExclude.forEach((div) => { div.style.overflow = 'visible'; });
      await domtoimage.toPng(element).then(async (blob) => {
        await this.sendImage(blob.split(',')[1], 'CAPTURE_ROUTE');
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        // Restaura la visibilidad de los elementos
        divsToExclude.forEach((div) => { div.style.overflow = 'auto'; });
      });
    },
    async sendImage(file, name) {
      await this.getLocation();
      const {
        latitude,
        longitude,
      } = this.location;
      showLoading('Guardando ...', 'Por favor, espere', true);

      await this.saveFile({
        name,
        storage: 'listings',
        modelName: 'listings',
        modelId: this.list.value,
        type: 'image',
        file,
        extension: 'png',
        status: 'aprobado',
        latitude,
        longitude,
        maintain: true,
      });
      this.$q.loading.hide();
      /* if (this.responseMessages && this.status) {
        this.showModal = false;
        this.$emit('savedFile', { name });
        await this.fetchFile();
      } */
      // this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
  },
  components: {
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
</style>
