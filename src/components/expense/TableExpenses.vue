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
        <q-btn
          icon="add"
          class="q-ml-sm"
          color="primary"
          title="Click para agregar un nuevo egreso"
          @click="showModal = true">
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
            v-if="props.row.file_url && (props.row.status === 'borrador' || props.row.status === 'rechazado')"
            icon="delete"
            class="q-mb-sm"
            color="red"
            title="Click para eliminar el egreso"
            size="sm"
            @click="remove(props.row)">
          </q-btn>
          <br>
          <q-btn
            v-if="props.row.file_url && props.row.status === 'borrador'"
            icon="check"
            class="q-mt-sm"
            color="green"
            title="Click para guardar el egreso"
            size="sm"
            @click="changeStatus(props.row)">
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-voucher="props">
        <q-td :props="props" @click="clickRow(props.row)">
          <img
            v-if="props.row.file_url && props.row.status !== 'borrador'"
            :src="formatLink(props.row)"
            width="220rem" />
          <upload-image
            v-else
            :config="{
              name: 'FOTO_EXPENSE',
              storage: 'expenses',
              modelName: 'expenses',
              modelId: props.row.id
            }"
            @savedFile="saveFileExpense"
          />
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
    <form-expense
      v-if="showModal"
      v-model="showModal"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import UploadImage from 'components/common/UploadImage.vue';
import FormExpense from 'components/expense/FormExpense.vue';
import Moment from 'moment';
import expenseTypes from '../../store/modules/expense/types';
import notificationTypes from '../../store/modules/notification/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
// import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    UploadImage,
    FormExpense,
  },
  data() {
    return {
      showModal: false,
      obj: {},
      type: 'C',
      route: '/expense',
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
          name: 'amount',
          align: 'left',
          label: 'Valor',
          sortable: true,
          visible: true,
          field: (row) => row.amount,
          format: (val) => this.formatPrice(val),
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
          name: 'area_name',
          align: 'left',
          label: 'Grupo',
          field: 'area_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'item_name',
          align: 'left',
          label: 'Item',
          field: 'item_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'description',
          align: 'left',
          label: 'Descripción',
          field: 'description',
          sortable: true,
          visible: true,
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
        rowsPerPage: 50,
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
    ...mapState(expenseTypes.PATH, [
      'expenses',
      'responseMessages',
      'status',
      'expense',
    ]),
    dataTable() {
      const data = this.expenses.map((element) => ({
        ...element,
        date: this.formatDateHour(element.date),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(expenseTypes.PATH, {
      listExpenses: expenseTypes.actions.LIST_EXPENSES,
      updateExpense: expenseTypes.actions.UPDATE_EXPENSE,
      deleteExpense: expenseTypes.actions.DELETE_EXPENSE,
    }),
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    getColorBadge(row) {
      let color = 'black';
      if (row.status === 'creado') {
        color = 'blue';
      } else if (row.status === 'rechazado') {
        color = 'red';
      }
      return color;
    },
    formatLink(row) {
      if (row.file_url) {
        return `${process.env.URL_FILES}${row.file_url}`;
      }
      return '';
    },
    clickRow(row) {
      this.itemSelected = { ...row };
      console.log(this.itemSelected);
    },
    formatDateHour(date) {
      return Moment(date).format('YYYY-MM-DD hh:mm A');
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
      await this.listExpenses({
        status: ['creado', 'borrador', 'rechazado'],
        items: [1, 8],
      });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    async changeStatus(obj) {
      this.$q.dialog({
        title: 'Guardar',
        message: 'Está seguro que desea guardar?',
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
        await this.updateExpense({
          ...obj,
          status: 'creado',
        });

        if (this.status === true) {
          this.user = { ...this.copyUser };
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
    async remove(row) {
      this.$q.dialog({
        title: 'Eliminar',
        message: 'Está seguro que desea eliminar?',
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
        showLoading('Eliminando ...', 'Por favor, espere', true);
        await this.deleteExpense(row.id);

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
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async saveFileExpense(obj) {
      await this.updateExpense({
        ...this.itemSelected,
        file_id: obj.id,
      });
      await this.listMounted();
    },
  },
};
</script>
