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
        @click="listNewsMounted">
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
            x
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import newTypes from '../../store/modules/new/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
  },
  data() {
    return {
      showModal: false,
      obj: {},
      type: 'C',
      route: '/new',
      name: 'Información de nuevos',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        /* {
          name: 'documentNumber',
          label: 'Documento',
          align: 'left',
          field: 'documentNumber',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        }, */
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'phone',
          align: 'left',
          label: 'Teléfono',
          field: 'phone',
          sortable: true,
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
          sortable: true,
          visible: true,
        },
        {
          name: 'city',
          align: 'left',
          label: 'Cuidad',
          field: 'cityName',
          sortable: true,
          visible: true,
        },
        {
          name: 'sector',
          align: 'left',
          label: 'Sector',
          field: 'sectorName',
          sortable: true,
          visible: true,
        },
        {
          name: 'districtName',
          align: 'left',
          label: 'Barrio',
          field: 'districtName',
          sortable: true,
          visible: true,
        },
        {
          name: 'occupation',
          align: 'left',
          label: 'Ocupación',
          field: 'occupation',
          sortable: true,
          visible: true,
        },
        {
          name: 'userSendName',
          align: 'left',
          label: 'Enviado por',
          field: 'userSendName',
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
    ...mapState(newTypes.PATH, [
      'news',
      'responseMessages',
      'status',
      'new',
    ]),
    dataTable() {
      const data = this.news.map((element) => ({
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
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        await this.listNewsMounted();
      }, 60000);
    },
    async listNewsMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listNews(['aprobado']);
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
        await this.listNewsMounted();
      }
      this.$q.loading.hide();
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listNewsMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
