<template>
  <div class="q-pa-md text-center">
    <q-btn color="orange" :label="`Egresos pendientes (${dataTable.length})`" style="width: 280px;">
      <q-menu
        fit
        transition-show="rotate"
        transition-hide="rotate"
        :offset="[500, 10]">
        <q-list style="min-width: 100px">
          <q-item clickable>
            <q-item-section>
              <q-table
                :data="dataTable"
                :columns="columns"
                :filter="filter"
                :pagination="pagination"
                separator="cell"
                class="q-mt-md"
                dense
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-badge :color="getColorBadge(props.row)">
                      {{ props.row.status }}
                    </q-badge>
                  </q-td>
                </template>
              </q-table>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Moment from 'moment';
import expenseTypes from '../../store/modules/expense/types';
import notificationTypes from '../../store/modules/notification/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  components: {
  },
  data() {
    return {
      showModal: false,
      obj: {},
      type: 'C',
      route: '/expense',
      columns: [
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
          label: 'Persona',
          field: 'user_name',
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
          name: 'description',
          align: 'left',
          label: 'Descripción',
          field: 'description',
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
      itemSelected: {},
    };
  },
  async mounted() {
    this.listMounted();
    this.pollData();
  },
  computed: {
    ...mapState(expenseTypes.PATH, [
      'expensesPendings',
      'responseMessages',
      'status',
    ]),
    dataTable() {
      const data = this.expensesPendings.map((element) => ({
        ...element,
        date: this.formatDateHour(element.date),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(expenseTypes.PATH, {
      listExpensesPendings: expenseTypes.actions.LIST_EXPENSES_PENDINGS,
    }),
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    getColorBadge(row) {
      let color = 'black';
      if (row.status === 'creado') {
        color = 'blue';
      } else if (row.status === 'rechazado') {
        color = 'red';
      }
      return color;
    },
    formatLink(row) {
      if (row.file_url) {
        return `${process.env.URL_FILES}${row.file_url}`;
      }
      return '';
    },
    clickRow(row) {
      this.itemSelected = { ...row };
      console.log(this.itemSelected);
    },
    formatDateHour(date) {
      return Moment(date).format('YYYY-MM-DD hh:mm A');
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
      await this.listExpensesPendings({
        status: ['creado', 'borrador'],
        items: [0],
      });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
