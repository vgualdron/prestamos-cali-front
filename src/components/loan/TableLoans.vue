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
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn
              label="pagar"
              class="q-mb-sm"
              color="blue"
              title="Click para agregar un pago"
              size="sm"
              @click="addDeposit(props.row)">
            </q-btn>
            <q-btn
              v-if="props.row.remaining == 0"
              label="Cerrar"
              class="q-mt-none block"
              color="orange"
              title="Click para cerrar el prestamo"
              size="sm"
              @click="changeStatus(props.row)">
            </q-btn>
            <q-btn
              v-if="props.row.deposits && props.row.deposits.length > 0"
              size="sm"
              class="block"
              :color="props.row.images && props.row.images.length > 0 ? 'primary' : 'grey'"
              @click="props.expand = !props.expand"
              :label="props.expand ? 'Ocultar pagos' : 'Ver pagos'"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'">
            </q-btn>
          </q-td>
          <q-td key="area_name" :props="props">
            {{ (props.row.area_name) }}
          </q-td>
          <q-td key="user_name" :props="props">
            <q-badge v-if="props.row.count_approved > 0" color="green">
              {{ props.row.count_approved }}
            </q-badge>
            <q-badge v-if="props.row.count_created > 0" color="blue" class="q-ml-sm">
              {{ props.row.count_created }}
            </q-badge>
            <q-badge v-if="props.row.count_rejected > 0" color="red" class="q-ml-sm">
              {{ props.row.count_rejected }}
            </q-badge>
            {{ (props.row.user_name) }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ formatPrice(props.row.amount) }}
          </q-td>
          <q-td key="fee" :props="props">
            <q-icon size="xs" name="edit" />
            {{ formatPrice(props.row.fee) }}
            <q-popup-edit :value="props.row.fee" v-slot="scope" buttons
              @input="val => editField('fee', val)">
              <q-input v-model="scope.value" type="number" step="5000" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="total_paid" :props="props">
            {{ formatPrice(props.row.total_paid) }}
          </q-td>
          <q-td key="remaining" :props="props">
            {{ formatPrice(props.row.remaining) }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="getColorBadge(props.row)">
              {{ props.row.status }}
            </q-badge>
          </q-td>
          <q-td key="date" :props="props">
            {{ (props.row.date) }}
          </q-td>
        </q-tr>
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%" class="is-flex">
            <div class="q-pa-md row items-start q-gutter-md">
              <q-card
                class="my-card bg-grey-1 q-pa-md"
                flat
                bordered
                v-for="deposit in props.row.deposits"
                :key="`btn_dropdown_${deposit.id}_${deposit.amount}`">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ formatPrice(deposit.amount) }}</div>
                    <div class="text-subtitle2">
                      <q-badge color="black">
                        {{ formatDateHour(deposit.date_transaction) }}
                      </q-badge><br>
                      <q-badge :color="deposit.status == 'rechazado' ? 'red' : 'green'">
                        {{ (deposit.status) }}
                      </q-badge>
                    </div>
                    <img
                      :src="formatLink(props.row.file_id)"
                      width="220rem" />
                  </div>
                </div>
                <q-card-actions align="right" v-if="deposit.status == 'rechazado'">
                  <q-btn outline color="red" size="sm" @click="removeDeposit(deposit)">
                    Eliminar pago
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </q-td>
        </q-tr>
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
import loanTypes from '../../store/modules/loan/types';
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
      route: '/loan',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
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
          name: 'amount',
          align: 'left',
          label: 'Valor',
          sortable: true,
          visible: true,
          field: (row) => row.amount,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'fee',
          align: 'left',
          label: 'Coutas de',
          sortable: true,
          visible: true,
          field: (row) => row.fee,
          format: (val) => this.formatPrice(val),
        },
        {
          name: 'total_paid',
          align: 'left',
          label: 'Abonado',
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
    ...mapState(loanTypes.PATH, [
      'loans',
      'responseMessages',
      'status',
      'loan',
    ]),
    ...mapState(depositTypes.PATH, {
      responseMessagesDeposit: 'responseMessages',
      statusDeposit: 'status',
    }),
    dataTable() {
      const data = this.loans.map((element) => ({
        ...element,
        date: this.formatDateHour(element.created_at),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(loanTypes.PATH, {
      listLoans: loanTypes.actions.LIST_LOANS,
      updateLoan: loanTypes.actions.UPDATE_LOAN,
      deleteLoans: loanTypes.actions.DELETE_LOAN,
    }),
    ...mapActions(depositTypes.PATH, {
      deleteDeposit: depositTypes.actions.DELETE_DEPOSIT,
    }),
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    getColorBadge(row) {
      let color = 'black';
      if (row.status === 'activo') {
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
      await this.listLoans({
        status: ['activo'],
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
      await this.updateLoan(item);
      await this.listMounted();
      this.$q.loading.hide();
    },
    async changeStatus(obj) {
      this.$q.dialog({
        title: 'Cerrar préstamo',
        message: 'Está seguro que cerrar el préstamo?',
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
        await this.updateLoan({
          ...obj,
          status: 'cerrado',
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
    async removeDeposit(obj) {
      this.$q.dialog({
        title: 'Eliminar pago',
        message: 'Está seguro que desea eliminar el pago?',
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
        await this.deleteDeposit(obj.id);
        if (this.statusDeposit === true) {
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
