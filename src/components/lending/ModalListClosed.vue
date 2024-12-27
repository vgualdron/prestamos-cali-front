<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Lista de clientes retirados
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
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
          <div class="row q-mt-md">
            <q-table
              :data="lendingsClosed"
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
                <q-tr :props="props" @click="clickRow(props.row)">
                  <q-td key="actions" :props="props">
                    xx
                  </q-td>
                  <q-td key="name" :props="props">
                    <p :title="props.row.nameDebtor" class="q-my-auto">
                      {{ formatText(props.row.nameDebtor, 30) }}
                    </p>
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ formatPrice(props.row.amount) }}
                  </q-td>
                  <q-td key="period" :props="props">
                    {{ props.row.period }}
                  </q-td>
                  <q-td key="firstDate" :props="props">
                    {{ formatDate(props.row.firstDate) }}
                  </q-td>
                  <q-td key="endDate" :props="props">
                    {{ formatDate(props.row.endDate) }}
                  </q-td>
                  <q-td key="phone" :props="props">
                    <div>
                      <span>{{ processedPhones(props.row.phone)[0] }}</span>
                      <span v-if="processedPhones(props.row.phone)[1] !== null">
                        <br>{{ processedPhones(props.row.phone)[1] }}
                      </span>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Cerrar prestamo"
            color="primary"
            class="col q-ml-sm"
            :disabled="!selectedReason"
            @click="closedLending"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { showLoading } from '../../helpers/showLoading';
import lendingTypes from '../../store/modules/lending/types';
import newTypes from '../../store/modules/new/types';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      selectedReason: null,
      isLoadingTable: false,
      filter: '',
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          style: 'width: 80px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre deudor',
          align: 'center',
          style: 'width: 250px',
          field: (row) => row.nameDebtor,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: 'amount',
          required: true,
          label: 'Valor',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          sortable: false,
        },
        {
          name: 'period',
          align: 'center',
          label: 'periodo',
          field: 'period',
          style: 'width: 80px',
          sortable: false,
        },
        {
          name: 'firstDate',
          required: true,
          label: 'Fecha inicio',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.firstDate,
          format: (val) => this.formatDate(val),
          sortable: false,
        },
        {
          name: 'endDate',
          required: true,
          label: 'Fecha fin',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.endDate,
          format: (val) => this.formatDate(val),
          sortable: false,
        },
        {
          name: 'phone',
          required: true,
          label: 'Teléfonos',
          align: 'center',
          style: 'width: 60px',
          field: (row) => row.phone,
          format: (val) => val,
          sortable: false,
        },
      ],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    idList: {
      required: false,
    },
  },
  async mounted() {
    showLoading('cargando ...', 'Por favor, espere', true);
    this.isLoadingTable = true;
    await this.fetchLendingsClosed(this.idList);
    this.$q.loading.hide();
    this.isLoadingTable = false;
  },
  watch: {
  },
  computed: {
    ...mapState(lendingTypes.PATH, {
      lendingsClosed: 'lendingsClosed',
      lendingStatus: 'status',
      lendingStatusResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      updateLending: lendingTypes.actions.UPDATE_LENDING,
      fetchLendingsClosed: lendingTypes.actions.FETCH_LENDINGS_CLOSED,
    }),
    ...mapActions(newTypes.PATH, {
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    formatText(val, length) {
      let response = val;
      if (val.length > length) {
        response = `${val.substring(0, length)} ...`;
      }
      return response;
    },
    processedPhones(str) {
      const parts = str.split(/\s*\/\s*/);
      return parts.length === 2 ? parts : [parts[0], null];
    },
    async closedLending() {
      showLoading('cerrando ...', 'Por favor, espere', true);
      await this.updateLending({
        ...this.row,
        status: 'closed',
      });
      await this.completeDataNew({
        id: this.row.new_id,
        score: this.selectedReason,
      });
      this.$emit('closedLending');
      this.$q.loading.hide();
      this.showDialog = false;
    },
  },
  components: {
  },
};
</script>
<style scoped>
  .markup-table {
    display: block;
    border: solid 1px black;
  }
  .markup-table td {
    border: solid 1px black;
  }
</style>
