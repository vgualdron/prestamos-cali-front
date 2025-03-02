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
          class="q-mr-md"
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
            <q-btn
              class="q-ml-xs"
              color="green"
              field="changeStatus"
              icon="check"
              size="xs"
              title="Activar como pendiente"
              @click="changeStatus(props.row, 'CS')"
              round
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'rechazado' ? 'red' : 'blue'">
            {{  props.row.status }}
          </q-badge>
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
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
  },
  data() {
    return {
      obj: {},
      type: 'C',
      route: '/new',
      name: 'Lista de nuevos rechazados',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          style: 'max-width: 200px',
          classes: 'wrap-text',
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
          style: 'max-width: 200px',
          classes: 'wrap-text',
          field: 'address',
          sortable: true,
          visible: true,
        },
        {
          name: 'observation',
          align: 'left',
          label: 'Observación',
          style: 'max-width: 200px',
          classes: 'wrap-text',
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
    this.listNewsMounted();
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
      await this.listNews(['rechazado']);
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    async changeStatus(obj, type) {
      this.$q.dialog({
        title: 'Volver a activar',
        message: 'Está seguro que desea activar como pendente al nuevo?',
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
        this.type = type;
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.updateStatusNew({
          ...obj,
          status: 'pendiente',
          attempts: 1,
        });

        if (this.status === true) {
          this.user = { ...this.copyUser };
          await this.listNewsMounted();
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
  },
};
</script>
<style scoped>
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
