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
      <div class="col-6 text-center">
        <q-select
          outlined
          dense
          v-model="listingSelected"
          :options="optionsListings"/>
      </div>
      <div class="col-6 text-center">
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
          <q-td key="nequiName" :props="props">
            {{ props.row.nequiName }}
          </q-td>
          <q-td key="reference" :props="props">
            {{ props.row.reference }}
          </q-td>
          <q-td key="date_transaction" :props="props">
            {{ formatDateDate(props.row.date_transaction) }}
          </q-td>
          <q-td key="date" :props="props">
            {{ formatDate(props.row.date) }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ formatPrice(props.row.amount) }}
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
          <q-td :props="props" key="observation">
            <q-btn-dropdown
              v-if="props.row.observation"
              color="black"
              size="12px"
              :auto-close="false"
              outline
            >
              <q-list>
                <q-item v-close-popup>
                  <q-item-section>
                    <q-item-label>
                      {{ props.row.observation }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <modal-preview-file
      v-if="showModal"
      v-model="showModal"
      :url="formatLink(itemSelected)"
      :type="itemSelected.typeFile"
      :title="`Valor: ${formatPrice(itemSelected.amount)} - Referencia: ${itemSelected.reference}`"
      :showBtnCancel="true"
      :showBtnAccept="true"
      labelBtnCancel="Rechazar"
      labelBtnAccept="Marcar como verificado"
      @clickBtnCancel="rejectPayment"
      @clickBtnAccept="approvePayment"
      />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalPreviewFile from 'components/common/ModalPreviewFile.vue';
import paymentTypes from '../../store/modules/payment/types';
import listingTypes from '../../store/modules/listing/types';
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
          name: 'nequiName',
          align: 'center',
          label: 'Nequi',
          field: 'nequiName',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'reference',
          align: 'center',
          label: 'Referencia',
          field: 'reference',
          style: 'width: 100px',
          sortable: true,
        },
        {
          name: 'date_transaction',
          align: 'center',
          label: 'Fecha transacción',
          field: 'date_transaction',
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
        {
          name: 'observation',
          required: true,
          label: 'Observación',
          align: 'center',
          style: 'width: 150px',
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
        sortBy: 'listName',
        descending: false,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      polling: null,
      listingSelected: {
        label: 'TODAS',
        value: 0,
      },
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.fetchListings();
    console.log(this.listingSelected);
    await this.getPayments();
    this.pollData();
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(paymentTypes.PATH, {
      payments: 'payments',
      paymentStatus: 'status',
      paymentResponseMessages: 'responseMessages',
    }),
    ...mapState(listingTypes.PATH, [
      'listings',
    ]),
    optionsListings() {
      const options = [{
        label: 'TODAS',
        value: 0,
      }];
      const array = this.listings.map(({ id, name }) => ({ label: name, value: id }));
      options.push(...array);
      return options;
    },
    data() {
      const cond = this.listingSelected.value > 0;
      let items = [...this.payments];
      if (cond) {
        items = this.payments.filter((pay) => pay.listId === this.listingSelected.value);
      }
      return items;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(paymentTypes.PATH, {
      fetchPayments: paymentTypes.actions.FETCH_PAYMENTS,
      updatePayment: paymentTypes.actions.UPDATE_PAYMENT,
      deletePayment: paymentTypes.actions.DELETE_PAYMENT,
    }),
    ...mapActions(listingTypes.PATH, {
      fetchListings: listingTypes.actions.FETCH_LISTINGS,
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
    formatDateDate(date) {
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
      await this.fetchPayments('aprobado');
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
    approvePayment() {
      this.updateStatusPayment({
        status: 'verificado',
      });
    },
    async rejectPayment() {
      this.$q.dialog({
        title: 'Rechazar',
        message: 'Está seguro?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Rechazando ...', 'Por favor, espere', true);
        await this.deletePayment(this.itemSelected.id);
        this.showModal = false;
        this.$q.loading.hide();
        this.getPayments();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    async updateStatusPayment({ status }) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updatePayment({
        ...this.itemSelected,
        status,
      });
      this.$q.loading.hide();
      this.showModal = false;
      this.showNotification(this.paymentResponseMessages, this.paymentStatus, 'top-right', 5000);
      this.getPayments();
    },
  },
  components: {
    ModalPreviewFile,
  },
};
</script>
