<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-10 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div
        class="col-2
        text-center"
      >
        <q-btn
          round
          icon="refresh"
          class=""
          color="primary"
          title="Click para refrescar la tabla"
          @click="listMounted">
        </q-btn>
      </div>
    </div>
    <q-table
      :data="dataTable"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      separator="cell"
      class="q-mt-md"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="Aprobar"
            class="q-mb-sm"
            color="green"
            title="Click para aprobar un pago"
            size="sm"
            @click="changeStatus(props.row, 'aprobado')">
          </q-btn>
          <br>
          <q-btn
            label="Rechazar"
            class="q-mt-none"
            color="red"
            title="Click para rechazar el pago"
            size="sm"
            @click="changeStatus(props.row, 'rechazado')">
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-voucher="props">
        <q-td :props="props" @click="clickRow(props.row)">
          <img
            :src="formatLink(props.row.deposit_file_url)"
            width="220rem" />
        </q-td>
      </template>
      <template v-slot:body-cell-fee="props">
        <q-td :props="props" @click="clickRow(props.row)">
          <q-icon size="xs" name="edit" />
          {{ formatPrice(props.row.fee) }}
          <q-popup-edit :value="props.row.fee" v-slot="scope" buttons
            @input="val => editField('fee', val)">
            <q-input v-model="scope.value" type="number" step="5000" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getColorBadge(props.row)">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
    <modal-add-deposit
      v-if="showModalDeposit"
      v-model="showModalDeposit"
      :row="itemSelected"
      :valuePayment="itemSelected.fee"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Moment from 'moment';
import ModalAddDeposit from 'components/loan/ModalAddDeposit.vue';
import depositTypes from '../../store/modules/deposit/types';
import notificationTypes from '../../store/modules/notification/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  components: {
    ModalAddDeposit,
  },
  data() {
    return {
      showModalDeposit: false,
      obj: {},
      type: 'C',
      route: '/deposit',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'voucher',
          label: 'Voucher',
          align: 'center',
          visible: false,
        },
        {
          name: 'area_name',
          align: 'left',
          label: 'Grupo',
          field: 'area_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'user_name',
          align: 'left',
          label: 'Persona',
          field: 'user_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'loan_amount',
          align: 'left',
          label: 'Se le prestó',
          sortable: true,
          visible: true,
          field: (row) => row.loan_amount,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'amount',
          align: 'left',
          label: 'Abono de',
          sortable: true,
          visible: true,
          field: (row) => row.amount,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'total_paid',
          align: 'left',
          label: 'Total Abonado',
          sortable: true,
          visible: true,
          field: (row) => row.total_paid,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'remaining',
          align: 'left',
          label: 'Debe',
          sortable: true,
          visible: true,
          field: (row) => row.remaining,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'status',
          align: 'left',
          label: 'Estado',
          field: 'status',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      polling: null,
      itemSelected: {},
    };
  },
  async mounted() {
    this.listMounted();
    this.pollData();
  },
  computed: {
    ...mapState(depositTypes.PATH, [
      'deposits',
      'responseMessages',
      'status',
      'deposit',
    ]),
    dataTable() {
      const data = this.deposits.map((element) => ({
        ...element,
        date: this.formatDateHour(element.deposit_created_at),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(depositTypes.PATH, {
      listDeposits: depositTypes.actions.LIST_DEPOSITS,
      updateDeposit: depositTypes.actions.UPDATE_DEPOSIT,
    }),
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    getColorBadge(row) {
      let color = 'blue';
      if (row.status === 'aprobado') {
        color = 'green';
      } else if (row.status === 'rechazado') {
        color = 'red';
      }
      return color;
    },
    formatLink(url) {
      if (url) {
        return `${process.env.URL_FILES}${url}`;
      }
      return '';
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    formatDateHour(date) {
      return Moment(date).format('DD/MM/YYYY hh:mm A');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.listMounted();
      }, 60000);
    },
    async listMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listDeposits({
        status: ['creado'],
      });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    async editField(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const item = {
        ...this.itemSelected,
      };
      item[field] = (value && value.value) ? value.value : value;
      await this.updateDeposit(item);
      await this.listMounted();
      this.$q.loading.hide();
    },
    async changeStatus(obj, status) {
      this.$q.dialog({
        title: 'Cambiar de estado',
        message: `Está seguro que desea cambiar a ${status}?`,
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
        this.obj = obj;
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.updateDeposit({
          ...obj,
          status,
        });

        if (this.status === true) {
          await this.listMounted();
        }
        this.$q.loading.hide();
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    async addDeposit(row) {
      this.clickRow(row);
      this.showModalDeposit = true;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
