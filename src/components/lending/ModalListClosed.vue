<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Lista de clientes retirados
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll">
          <div class="row">
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
          <div class="row w-100 text-center">
            <q-table
              v-if="!isLoadingTable"
              :data="items"
              :columns="columns"
              row-key="id"
              :loading="isLoadingTable"
              :filter="filter"
              :pagination.sync="pagination"
              separator="cell"
              class="q-mt-md"
              style="width: 100%;"
              dense>
              <template v-slot:body="props">
                <q-tr :props="props" @click="clickRow(props.row)">
                  <q-td key="index" :props="props">
                    {{ props.row.index }}
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      v-if="!props.row.question_status"
                      label="Enviar solicitud"
                      color="primary"
                      class="col q-ml-sm"
                      @click="saveQuestionAccount(props.row)"
                    />
                    <div v-else> {{ props.row.question_status }}</div>
                  </q-td>
                  <q-td key="name" :props="props">
                    <p :title="props.row.nameDebtor" class="q-my-auto">
                      {{ formatText(props.row.nameDebtor, 30) }}
                    </p>
                  </q-td>
                  <q-td key="amount" :props="props">
                    <q-icon size="xs" name="edit" />
                    {{ formatPrice(props.row.amount) }}
                    <q-popup-edit :value="props.row.amount" v-slot="scope" buttons
                      @input="val => saveData('amount', val)">
                      <q-option-group
                        v-model="scope.value"
                        :options="[
                          {
                            label: '100.000',
                            value: 100000,
                          },
                          {
                            label: '200.000',
                            value: 200000,
                          },
                          {
                            label: '300.000',
                            value: 300000,
                          },
                          {
                            label: '400.000',
                            value: 400000,
                          },
                          {
                            label: '500.000',
                            value: 500000,
                          },
                          {
                            label: '600.000',
                            value: 600000,
                          },
                        ]"
                        color="primary"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="period" :props="props">
                    <q-icon size="xs" name="edit" />
                    {{ props.row.period }}
                    <q-popup-edit :value="props.row.period" v-slot="scope" buttons
                      @input="val => saveData('period', val)">
                      <q-option-group
                        v-model="scope.value"
                        :options="[
                          {
                            label: 'diario',
                            value: 'diario'
                          },
                          {
                            label: 'semanal',
                            value: 'semanal'
                          },
                          {
                            label: 'quincenal',
                            value: 'quincenal'
                          },
                        ]"
                        color="primary"
                      />
                    </q-popup-edit>
                  </q-td>
                  <!-- <q-td key="firstDate" :props="props">
                    {{ formatDate(props.row.firstDate) }}
                  </q-td>
                  <q-td key="endDate" :props="props">
                    {{ formatDate(props.row.endDate) }}
                  </q-td> -->
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
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { showLoading } from '../../helpers/showLoading';
import { showNotifications } from '../../helpers/showNotifications';
import lendingTypes from '../../store/modules/lending/types';
import questionTypes from '../../store/modules/question/types';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      itemSelected: null,
      isLoadingTable: false,
      filter: '',
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: 'index',
          required: true,
          label: '',
          align: 'center',
          style: 'width: 80px',
          headerStyle: 'height: 50px',
        },
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
        /* {
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
        }, */
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
    ...mapState(questionTypes.PATH, {
      question: 'question',
      questionStatus: 'status',
      questionResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    items() {
      return this.lendingsClosed.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
    },
  },
  methods: {
    ...mapActions(questionTypes.PATH, {
      saveQuestion: questionTypes.actions.SAVE_QUESTION,
      getStatusQuestion: questionTypes.actions.GET_STATUS_QUESTION,
    }),
    ...mapActions(lendingTypes.PATH, {
      fetchLendingsClosed: lendingTypes.actions.FETCH_LENDINGS_CLOSED,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
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
    async saveData(field, value) {
      this.isLoadingTable = true;
      showLoading('Editando ...', 'Por favor, espere', true);
      this.items[this.itemSelected.index - 1][field] = value.value ? value.value : value;
      console.log(this.items);
      setTimeout(() => {
        this.isLoadingTable = false;
        this.$q.loading.hide();
      }, 200);
    },
    async saveQuestionAccount(row) {
      console.log(row);
      const text = `Solicitar prestamo para nuevo antiguo: ${row.nameDebtor}. Por el valor de: ${this.formatPrice(row.amount)}, Por el periodo: ${row.period}, para la ruta: ${row.listing_name}.`;
      this.$q.dialog({
        title: text,
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Solicitando ...', 'Por favor, espere', true);
        const value = {
          amount: row.amount,
          period: row.period,
          new_id: row.new_id,
          lending_id: row.id,
        };
        const data = {
          model_id: row.new_id,
          model_name: 'news',
          area_id: 3, // nuevos
          type: 'nuevo-antiguo',
          status: 'pendiente',
          observation: text,
          value: JSON.stringify(value),
        };
        await this.saveQuestion(data);
        // await this.getStatusQuestionAccount(row);
        this.showNotification(this.questionResponseMessages, this.questionStatus, 'top-right', 5000);
        await this.fetchLendingsClosed(this.idList);
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
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
  .text-wrap {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
  }
</style>
