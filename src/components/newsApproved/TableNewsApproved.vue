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
            <upload-image
              :config="{
                name: 'FOTO_VOUCHER',
                storage: 'news',
                modelName: 'news',
                modelId: props.row.id
              }"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-cv="props">
        <q-td :props="props">
          <q-btn
            class=""
            color="primary"
            label="Ver"
            title="Click para ver la hoja de vida"
            @click="openCv(props.row)">
        </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-quantity="props">
        <q-td :props="props">
          {{ formatPrice(props.row.quantity) }}
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
import newTypes from '../../store/modules/new/types';
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
      obj: {},
      type: 'C',
      route: '/new',
      name: 'Información de nuevos',
      columns: [
        {
          name: 'actions',
          label: 'Cargar voucher',
          align: 'center',
          visible: false,
        },
        {
          name: 'cv',
          align: 'center',
          label: 'Hoja de vida',
          field: 'cv',
          sortable: true,
          visible: true,
        },
        {
          name: 'name',
          align: 'left',
          label: 'Cliente',
          field: 'name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'quantity',
          align: 'left',
          label: 'Valor',
          field: 'quantity',
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
      ],
      pagination: {
        rowsPerPage: 50,
      },
      filter: '',
      data: [],
      polling: null,
      showModalCv: false,
      newSelected: null,
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
    openCv(row) {
      this.newSelected = { ...row };
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
  },
};
</script>
