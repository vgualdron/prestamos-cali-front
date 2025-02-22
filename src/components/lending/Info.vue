<template>
  <div class="q-pa-sm w-100">
    <q-markup-table
      class="markup-table"
      separator="cell"
      dense
      v-if="info && info.yellowUp"
      >
        <tbody>
          <tr class="">
            <td class="bg-yellow-3">
              <b>Total:</b>
              {{ info.yellow.total_count }}
              ({{ formatPrice(info.yellow.total_pendiente) }})
            </td>
            <td class="bg-yellow-3">
              <b>Encima:</b>
              {{ info.yellowUp.total_count }}
              ({{ formatPrice(info.yellowUp.total_pendiente) }})
            </td>
            <td class="bg-yellow-3">
              <b>Debajo:</b>
              {{ info.yellowDown.total_count }}
              ({{ formatPrice(info.yellowDown.total_pendiente) }})
            </td>
            <td class="bg-blue-3">
              <b>Total:</b>
              {{ info.blue.total_count }}
              ({{ formatPrice(info.blue.total_pendiente) }})
            </td>
            <td class="bg-blue-3">
              <b>Encima:</b>
              {{ info.blueUp.total_count }}
              ({{ formatPrice(info.blueUp.total_pendiente) }})
            </td>
            <td class="bg-blue-3">
              <b>Debajo:</b>
              {{ info.blueDown.total_count }}
              ({{ formatPrice(info.blueDown.total_pendiente) }})
            </td>
            <td class="bg-orange-4">
              <b> Renovar:</b>
              {{ info.renove.total_count }}
            </td>
          </tr>
          <tr class="">
            <td class="">
              <b>Meta mes:</b>
              ({{ formatPrice(info.capital.total * this.minPercentage) }})
            </td>
            <td class="">
              <b>Proyección meta:</b>
              ({{ formatPrice((info.payments.total_payments / info.days.days_work) * 24 ) }})
            </td>
            <td class="">
              <b>Cobro lleva:</b>
              ({{ formatPrice(info.payments.total_payments) }})
            </td>
            <td class="">
              <b>Cobro falta:</b>
              ({{ formatPrice((info.capital.total * this.minPercentage) - info.payments.total_payments) }})
            </td>
            <td class="">
              <b>Cobro debe hacer:</b>
              ({{ formatPrice(((info.capital.total * this.minPercentage) - info.payments.total_payments) / (24 - info.days.days_work)) }})
            </td>
            <td :class="(((info.payments.total_payments / info.days.days_work) * 24 ) / info.capital.total).toFixed(2) >= this.minPercentage ? 'bg-green-4' : 'bg-white'">
              <b>Porcentaje:</b>
              ({{ (((info.payments.total_payments / info.days.days_work) * 24 ) / info.capital.total).toFixed(2) }})
            </td>
            <td>
              <b>Cobro hoy:</b>
              ({{ formatPrice(info.paymentsToday.total_payments) }})
            </td>
          </tr>
          <tr class="">
            <td class="">
              <b>Dias trabajados:</b>
              ({{ info.days.days_work }})
            </td>
            <td class="">
            </td>
            <td class="">
              <b>Cobro lleva secre:</b>
              ({{ formatPrice(info.paymentsSecre.total_payments) }})
            </td>
            <td class="">
              <b>Protocolo:</b>
              <b> {{ info.workplan.step_order }}</b>
              <q-btn
                v-if="info.workplan.step_order"
                icon="navigate_next"
                size="sm"
                color="primary"
                class="q-ml-sm"
                :label="info.workplan.step_order + 1"
                :title="`${info.workplan.step_order} - ${info.workplan.step_name}`"
                @click="nextWorkPlan()">
              </q-btn>
              <q-badge color="green" v-else>Finalizado</q-badge>
            </td>
            <td class="">
            </td>
            <td :class="(((info.paymentsSecre.total_payments / info.days.days_work) * 24 ) / info.capital.total).toFixed(2) >= this.minPercentage ? 'bg-green-4' : 'bg-white'">
              <b>Porcentaje secre:</b>
              ({{ (((info.paymentsSecre.total_payments / info.days.days_work) * 24 ) / info.capital.total).toFixed(2) }})
            </td>
            <td>
              <b>Cobro hoy secre:</b>
              ({{ formatPrice(info.paymentsTodaySecre.total_payments) }})
            </td>
          </tr>
        </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import commonTypes from '../../store/modules/common/types';
import workplanTypes from '../../store/modules/workplan/types';
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
    info: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    this.$q.loading.hide();
  },
  watch: {
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    minPercentage() {
      let v = 2;
      const configurations = localStorage.getItem('configurations');
      if (configurations) {
        const configs = JSON.parse(configurations);
        if (configs && configs.length > 0) {
          const c = configs.find((con) => con.reference === 'PORCENTAJE_COBRO_DIARIO');
          if (c) {
            v = parseFloat(c.value);
          }
        }
      }
      return v;
    },
  },
  methods: {
    ...mapActions(workplanTypes.PATH, {
      addWorkplan: workplanTypes.actions.ADD_WORKPLAN,
      updateWorkplan: workplanTypes.actions.UPDATE_WORKPLAN,
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
    async nextWorkPlan() {
      this.$q.dialog({
        title: 'Pasar al siguiente',
        message: 'Está seguro que desea pasar al siguiente paso?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.addWorkplan({
          step_id: this.info.workplan.step_id,
          listing_id: this.info.listing_id,
          registered_date: moment().format('YYYY-MM-DD HH:mm:ss'),
          registered_by: this.user,
        });
        this.$emit('changeStep');
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
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
    width: 100%;
  }
  .markup-table td {
    border: solid 1px black;
  }
</style>
