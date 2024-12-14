<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-12 text-center">
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
      v-if="columns && columns.length > 0"
      :data="data"
      :columns="columns"
      row-key="id"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      separator="cell"
      class="q-mt-md"
      :row-class="'bg-purple'"
      dense>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="actions" :props="props">
            <q-btn
              icon="visibility"
              type="reset"
              color="black"
              size="sm"
              class="col q-ml-sm"
              @click="openModal(props.row)"
              flat/>
          </q-td>
          <q-td key="order" :props="props">
            {{ props.row.order }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <modal-report-dinamic
      v-if="showModal"
      v-model="showModal"
      :nameReport="nameReport"
      :data="reportData"
      :fields="fields"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ModalReportDinamic from 'components/reportDinamic/ModalReportDinamic.vue';
import reportTypes from '../../store/modules/report/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      isLoadingTable: false,
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Ver',
          align: 'center',
          style: 'width: 80px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'order',
          required: true,
          label: 'Orden',
          align: 'center',
          style: 'width: 50px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'center',
          style: 'width: 50px',
          headerStyle: 'height: 50px',
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      listingSelected: null,
      fields: [],
      nameReport: '',
    };
  },
  async mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    await this.listReport();
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(reportTypes.PATH, {
      reports: 'reports',
      reportData: 'data',
    }),
    data() {
      return this.reports.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
    },
  },
  methods: {
    ...mapActions(reportTypes.PATH, {
      listReport: reportTypes.actions.LIST_REPORTS,
      executeReport: reportTypes.actions.EXECUTE_REPORT,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    getColumns() {
      if (this.reportData.length === 0) {
        return [];
      }

      const firstItem = this.reportData[0];
      const fields = Object.keys(firstItem).map((key) => ({
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        align: 'left',
        field: key,
        sortable: true,
      }));
      return fields;
    },
    async openModal(row) {
      showLoading('Consultando ...', 'Por favor, espere', true);
      this.nameReport = row.name;
      await this.executeReport(row.id);
      this.fields = this.getColumns();
      this.$q.loading.hide();
      this.showModal = true;
    },
  },
  components: {
    ModalReportDinamic,
  },
};
</script>
