<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-11 text-center">
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
        class="col-1
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
      <template v-slot:body-cell-cv="props">
        <q-td :props="props">
          <q-btn
            class=""
            color="primary"
            icon="plagiarism"
            title="Click para ver la hoja de vida"
            @click="openCv(props.row)" />
        </q-td>
      </template>
      <template v-slot:body-cell-video="props">
        <q-td :props="props">
          <video
            v-if="props.row.file_auth_url"
            :src="getUrlFile(props.row)"
            width="100rem"
            controls>
          </video>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <upload-image
              :config="{
                name: 'FOTO_EXPENSE',
                storage: 'expenses',
                modelName: 'expenses',
                modelId: props.row.id
              }"
            />
          </div>
        </q-td>
      </template>
    </q-table>
    <cv
      v-model="showModalCv"
      v-if="showModalCv"
      :row="newSelected" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import UploadImage from 'components/common/UploadImage.vue';
import Cv from 'components/new/Cv.vue';
import expenseTypes from '../../store/modules/expense/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    UploadImage,
    Cv,
  },
  data() {
    return {
      showModal: false,
      showModalCv: false,
      obj: {},
      newSelected: {},
      type: 'C',
      route: '/expense',
      columns: [
        {
          name: 'cv',
          label: 'Hoja de vida',
          align: 'center',
          visible: false,
        },
        {
          name: 'video',
          label: 'Video de Aut',
          align: 'center',
          visible: false,
        },
        {
          name: 'actions',
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
          label: 'Secretaria',
          field: (row) => `${row.listing_name} - ${row.user_name}`,
          sortable: true,
          visible: true,
        },
        {
          name: 'new_name',
          align: 'left',
          label: 'Cliente',
          field: 'new_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'account',
          align: 'left',
          label: 'Cuenta',
          field: (row) => row,
          format: (row) => `${row.account_active === 'principal' ? row.account_type : row.account_type_third}: ${row.account_active === 'principal' ? row.account_number : row.account_number_third}`,
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
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      polling: null,
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
        date: formatDateWithTime(element.date),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(expenseTypes.PATH, {
      listExpensesByItem: expenseTypes.actions.LIST_EXPENSES_BY_ITEM,
      updateExpense: expenseTypes.actions.UPDATE_EXPENSE,
    }),
    getUrlFile(row) {
      return `${process.env.URL_FILES}${row.file_auth_url}`;
    },
    openCv(row) {
      this.newSelected = {
        id: row.new_id,
        type_cv: row.new_type_cv,
      };
      this.showModalCv = true;
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
      await this.listExpensesByItem({ status: 'creado', item: 1 });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    async changeStatus(obj, type) {
      this.obj = obj;
      this.type = type;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updateStatusNew({
        ...obj,
        status: 'creado',
      });

      if (this.status === true) {
        this.user = { ...this.copyUser };
        await this.listMounted();
      }
      this.$q.loading.hide();
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
