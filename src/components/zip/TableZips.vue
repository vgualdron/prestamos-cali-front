<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
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
      <div
        class="col-3
        text-center"
      >
        <q-btn
          color="primary"
          label="Exportar datos"
          @click="exportData"
          :disabled="!validatedPermissions.create.status"
          :title="validatedPermissions.create.title"
        />
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
      <!--items for small screens-->
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        >
          <q-card>
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <template
                    v-for="column in columns"
                  >
                    <q-item-label
                      v-if="column.visible"
                      :key="column.name + '-label'"
                    >
                        {{column.label}}
                    </q-item-label>
                    <q-item-label
                      v-if="column.visible"
                      caption
                      :key="column.name + '-value'"
                    >
                      {{ props.row[column.field]}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </q-list>
           </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import zipTypes from '../../store/modules/zip/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/zip',
      name: 'Zips',
      columns: [
        {
          name: 'id',
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          sortable: true,
          visible: true,
        },
        {
          name: 'registered_byname',
          align: 'left',
          label: 'Exportado por',
          field: 'registered_byname',
          sortable: true,
          visible: true,
        },
        {
          name: 'registered_date',
          align: 'left',
          label: 'Fecha de exportación',
          field: 'registered_date',
          sortable: true,
          visible: true,
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
    ...mapState(zipTypes.PATH, [
      'zips',
      'responseMessages',
      'status',
    ]),
    validatedPermissions() {
      const statusCreate = havePermission('zip.create');
      return {
        create: {
          title: statusCreate ? 'Exportar' : 'No tiene permisos para exportar',
          status: statusCreate,
        },
      };
    },
  },
  methods: {
    ...mapActions(zipTypes.PATH, {
      listZips: zipTypes.actions.LIST_ZIPS,
      createZip: zipTypes.actions.CREATE_ZIP,
    }),
    async listZipsMounted() {
      showLoading('Cargando Zips ...', 'Por favor, espere', true);
      await this.listZips();
      if (this.status === true) {
        this.data = this.zips.map((element) => ({
          ...element,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
    },
    async exportData() {
      showLoading('Exportando archivos ...', 'Por favor, espere', true);
      await this.createZip();
      this.openUrlFile();
      this.$q.loading.hide();
    },
    openUrlFile() {
      if (this.responseMessages && this.responseMessages.length > 0) {
        const url = `${process.env.URL_FILES}${this.responseMessages[0].detail}`;
        window.open(url, '_blank');
      }
      return false;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listZipsMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
  components: {
  },
};
</script>
