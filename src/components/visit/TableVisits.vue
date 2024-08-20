<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-input
          dense
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :grid="$q.screen.xs"
      :data="data"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      class="q-mt-md"
      separator="cell"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-btn
              color="primary"
              field="edit"
              icon="east"
              size="xs"
               @click="showVisit(props.row)"
              round
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import diaryTypes from '../../store/modules/diary/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/list-visit',
      name: 'Lista de Visitas',
      columns: [
        {
          name: 'date',
          align: 'left',
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'new_name',
          align: 'left',
          label: 'Nombre',
          field: 'new_name',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'site_visit',
          align: 'left',
          label: 'Lugar visita',
          field: 'site_visit',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'address_house',
          align: 'left',
          label: 'Dir. Casa',
          field: 'address_house',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'address_work',
          align: 'left',
          label: 'Dir. Trabajo',
          field: 'address_work',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'new_occupation',
          align: 'left',
          label: 'Ocupación',
          field: 'new_occupation',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'new_phone',
          align: 'left',
          label: 'Teléfono',
          field: 'new_phone',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'userName',
          align: 'left',
          label: 'Prestador',
          field: 'userName',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'actions',
          label: 'Revisar',
          align: 'center',
          visible: false,
        },
      ],
      pagination: {
        rowsPerPage: 50,
      },
      filter: '',
      data: [],
    };
  },
  async mounted() {
    this.validateLogin();
  },
  computed: {
    ...mapState(diaryTypes.PATH, [
      'diaries',
      'responseMessages',
      'status',
      'diary',
    ]),
    validatedPermissions() {
      const statusCreate = havePermission('visit.list');
      const statusEdit = havePermission('visit.list');
      const statusDelete = havePermission('visit.list');
      return {
        create: {
          title: statusCreate ? 'Registrar' : 'No tiene permisos para registrar',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar' : 'No tiene permisos para editar',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar' : 'No tiene permisos para eliminar',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      listVisitsReview: diaryTypes.actions.LIST_VISITS_REVIEW,
    }),
    async listMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listVisitsReview({
        date: new Moment(new Date()).format('YYYY-MM-DD'),
      });
      if (this.status === true) {
        this.data = this.diaries.map((element) => ({
          ...element,
          showEdit: true,
          showDelete: true,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
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
    showVisit(row) {
      const route = this.$router.resolve({ name: 'Revisar Visita', params: { id: row.new_id } });
      const url = route.href;
      window.open(url, '_blank');
    },
  },
  components: {
  },
};
</script>
