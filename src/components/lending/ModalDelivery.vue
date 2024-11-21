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
        <q-card-section style="max-height: 80vh" class="scroll">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-markup-table
                  class="markup-table"
                  separator="cell"
                  dense
                >
                  <tbody>
                    <tr class="bg-yellow-3">
                      <td class="text-bold" colspan="4">
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        CARTERA
                      </td>
                      <td class="" colspan="3">
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
                        TRANSFERENCIA
                      </td>
                      <td class="text-bold" colspan="1">
                        {{ delivery.itemTransfer.amount }}
                      </td>
                      <td class="text-bold" colspan="2">
                        {{ formatPrice(delivery.itemTransfer.total) }}
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        RENOVADAS
                      </td>
                      <td class="text-bold" colspan="1">
                      </td>
                      <td class="text-bold" colspan="2">
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        NUEVOS
                      </td>
                      <td class="text-bold" colspan="1">
                      </td>
                      <td class="text-bold" colspan="2">
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        GASTOS
                      </td>
                      <td class="text-bold" colspan="3">
                      </td>
                    </tr>
                    <tr class="">
                      <td class="" colspan="1">
                        SUBTOTAL
                      </td>
                      <td class="text-bold" colspan="1">
                      </td>
                      <td class="text-bold" colspan="2">
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <!-- <q-btn
            label="Transferir"
            color="primary"
            class="col q-ml-sm"
          /> -->
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
// import { showLoading } from '../../helpers/showLoading';
import listingTypes from '../../store/modules/listing/types';

export default {
  data() {
    return {
      date: new Date().toISOString().split('T')[0],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      required: false,
    },
    list: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    await this.fetchDelivery({ date: this.date, idList: this.list.value });
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
  },
  methods: {
    ...mapActions(listingTypes.PATH, {
      fetchDelivery: listingTypes.actions.FETCH_DELIVERY,
    }),
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
