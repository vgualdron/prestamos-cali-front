<template>
  <div class="q-px-md">
    <q-btn
      round
      icon="refresh"
      class="q-my-xs"
      color="primary"
      title="Click para refrescar la tabla"
      @click="getPayments()">
    </q-btn>
    <div class="row q-mt-md">
      <div class="col-12 text-center">
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
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :selected.sync="selected"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      separator="cell"
      class="q-mt-md"
      dense>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn
              icon="assignment"
              type="reset"
              color="primary"
              size="sm"
              class="col"
              title="Revisar voucher"
              @click="openModalPreview(props.row)" />
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="date" :props="props">
            {{ formatDate(props.row.date) }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ formatPrice(props.row.amount) }}
          </q-td>
          <q-td key="type" :props="props">
            {{ props.row.type }}
          </q-td>
          <q-td key="nameDebtor" :props="props">
            {{ props.row.nameDebtor }}
          </q-td>
          <q-td key="listName" :props="props">
            {{ props.row.listName }}
          </q-td>
          <q-td key="userName" :props="props">
            {{ props.row.userName }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <modal-change-status-payment
      v-if="showModal"
      v-model="showModal"
      :url="formatLink(itemSelected)"
      :type="itemSelected.type"
      :idList="itemSelected.listId"
      :title="`Valor: ${formatPrice(itemSelected.amount)}`"
      :showBtnCancel="true"
      :showBtnAccept="true"
      labelBtnCancel="Rechazar"
      labelBtnAccept="Aprobar"
      :showInputValue="true"
      labelInputValue="Referencia de pago:"
      @clickBtnCancel="rejectPayment"
      @clickBtnAccept="approvePayment"
      />
    <modal-exist-reference
      v-if="showModalExistReference"
      v-model="showModalExistReference"
      :row="payment"
    />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalChangeStatusPayment from 'components/payment/ModalChangeStatusPayment.vue';
import ModalExistReference from 'components/payment/ModalExistReference.vue';
import paymentTypes from '../../store/modules/payment/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          style: 'width: 50px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'id',
          align: 'center',
          label: 'ID',
          field: 'date',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'date',
          align: 'center',
          label: 'Fecha',
          field: 'date',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'amount',
          required: true,
          label: 'Valor',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row.amount,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'type',
          required: true,
          label: 'Tipo',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row.type,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'nameDebtor',
          required: true,
          label: 'Cliente',
          align: 'center',
          style: 'width: 150px',
          field: (row) => row.nameDebtor,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'listName',
          required: true,
          label: 'Ruta',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row.listName,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'userName',
          required: true,
          label: 'Cobrador',
          align: 'center',
          style: 'width: 150px',
          field: (row) => row.userName,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      showModalExistReference: false,
      polling: null,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.getPayments();
    this.pollData();
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(paymentTypes.PATH, {
      payment: 'payment',
      payments: 'payments',
      paymentStatus: 'status',
      paymentResponseMessages: 'responseMessages',
    }),
    data() {
      return [...this.payments];
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(paymentTypes.PATH, {
      getPaymentByReference: paymentTypes.actions.GET_PAYMENT_BY_REFERENCE,
      fetchPayments: paymentTypes.actions.FETCH_PAYMENTS,
      updatePayment: paymentTypes.actions.UPDATE_PAYMENT,
      deletePayment: paymentTypes.actions.DELETE_PAYMENT,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getPayments();
      }, 60000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatLink(row) {
      if (row.urlFile) {
        return `${process.env.URL_FILES}${row.urlFile}`;
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
    getColorBadge(i) {
      const colors = [
        'white',
        'black',
        'yellow',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
      ];
      return colors[i];
    },
    getColorText(i) {
      const colors = [
        'white',
        'white',
        'black',
        'white',
        'white',
        'white',
        'white',
        'white',
      ];
      return colors[i];
    },
    async getPayments() {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.fetchPayments('creado');
      this.$q.loading.hide();
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
    },
    openModalPreview(row) {
      this.itemSelected = row;
      this.showModal = true;
    },
    async approvePayment(value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.getPaymentByReference(value.reference);
      this.$q.loading.hide();
      if (this.payment && this.payment.reference) {
        this.showModalExistReference = true;
      } else {
        await this.updateStatusPayment({
          status: 'aprobado',
          value,
        });
      }
    },
    rejectPayment(value) {
      this.updateStatusPayment({
        status: 'rechazado',
        value,
      });
    },
    async updateStatusPayment({ status, value }) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updatePayment({
        ...this.itemSelected,
        status,
        reference: value.reference,
        nequi: value.nameNequi,
        date_transaction: value.dateTransaction,
        observation: value.observation,
        is_valid: status === 'aprobado' ? 1 : 0,
      });
      this.$q.loading.hide();
      this.showModal = false;
      this.showNotification(this.paymentResponseMessages, this.paymentStatus, 'top-right', 5000);
      this.getPayments();
    },
  },
  components: {
    ModalChangeStatusPayment,
    ModalExistReference,
  },
};
</script>
