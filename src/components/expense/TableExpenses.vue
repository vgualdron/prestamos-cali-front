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
      :grid="$q.screen.xs"
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
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import UploadImage from 'components/common/UploadImage.vue';
import expenseTypes from '../../store/modules/expense/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    UploadImage,
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
          name: 'amount',
          align: 'left',
          label: 'Valor',
          field: 'amount',
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
    };
  },
  async mounted() {
    this.validateLogin();
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
    validatedPermissions() {
      const statusCreate = havePermission('new.create');
      const statusEdit = havePermission('new.update');
      const statusDelete = havePermission('new.delete');
      const statuschangeStatus = havePermission('new.changeStatus');
      return {
        create: {
          title: statusCreate ? 'Registrar nuevos' : 'No tiene permisos para registrar nuevos',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar nuevo' : 'No tiene permisos para editar nuevos',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar nuevo' : 'No tiene permisos para eliminar nuevos',
          status: statusDelete,
        },
        changeStatus: {
          title: statuschangeStatus ? 'Guardar el registro' : 'No tiene permisos',
          status: statuschangeStatus,
        },
      };
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(expenseTypes.PATH, {
      listExpenses: expenseTypes.actions.LIST_EXPENSES,
      updateExpense: expenseTypes.actions.UPDATE_EXPENSE,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        await this.listMounted();
      }, 60000);
    },
    async listMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listExpenses(['creado']);
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
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
