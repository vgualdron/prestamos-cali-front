<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-6 text-center">
        <q-select
          outlined
          dense
          v-model="listingSelected"
          :options="optionsListings"/>
      </div>
      <div class="col-6 text-center">
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
      :grid="$q.screen.xs"
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
        <q-tr :props="props" :class="rowClass(props.row)" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn-dropdown class="q-px-none" color="black" icon="folder" flat>
              <q-list>
                <q-item clickable v-close-popup @click="openModal('normal', props.row)">
                  <q-item-section>
                    <q-item-label>Ver cartulina</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="getBalance(itemSelected) <= 0" clickable v-close-popup @click="openModal('renove', props.row)">
                  <q-item-section>
                    <q-item-label>Renovar préstamo</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="props.row.has_double_interest" clickable v-close-popup @click="openModal('double', props.row)">
                  <q-item-section>
                    <q-item-label>Cartulina doble interes</q-item-label>
                  </q-item-section>
                </q-item>
                <!-- <q-item clickable v-close-popup @click="openModal('history', props.row)">
                  <q-item-section>
                    <q-item-label>Ver Historial</q-item-label>
                  </q-item-section>
                </q-item> -->
                <q-item v-if="getBalance(itemSelected) <= 0" clickable v-close-popup @click="openModal('close', props.row)">
                  <q-item-section>
                    <q-item-label>Cerrar préstamo</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
          <q-td key="index" :props="props">
            {{ props.row.index }}
          </q-td>
          <q-td key="name" :props="props">
            <p :title="props.row.nameDebtor" class="q-my-auto">
              {{ formatText(props.row.nameDebtor, 20) }}
            </p>
          </q-td>
          <q-td key="amount" :props="props">
            {{ formatPrice(valueWithInterest(props.row)) }}
          </q-td>
          <q-td key="double" :props="props">
            {{ props.row.has_double_interest ? formatPrice(valueWithDoubleInterest(props.row)) : 'x' }}
          </q-td>
          <q-td key="fee" :props="props">
            {{ formatPrice(feeWithInterest(props.row)) }}
          </q-td>
          <q-td key="period" :props="props">
            {{ getPeriod(props.row) }}
          </q-td>
          <q-td key="amountFees" :props="props">
            {{ props.row.amountFees }}
          </q-td>
          <q-td key="renovation" :props="props">
            <b v-if="hasPaymentToday(props.row, 'renovacion')">
              {{ formatPrice(getPaymentTodayRenovation(props.row).amount) }}
            </b>
            <b
              v-else-if="getBalance(props.row) > props.row.amount"
              title="No puede aplicar pago para renovación, si no ha pagado almenos los intereses.">
              x
            </b>
            <b
              v-else-if="getBalance(props.row) === 0"
              title="Ya pagó todo el préstamo">
              x
            </b>
            <b v-else>
              <q-btn
                color="primary"
                label="$"
                size="sm"
                @click="addPaymentRenovation(props.row)"
                :disable="isDiabledAdd"
              />
            </b>
          </q-td>
          <q-td key="collection" :props="props">
            <q-badge
              v-if="hasPaymentToday(props.row, 'nequi')"
              :color="getPaymentTodayNequi(props.row) ? getPaymentTodayNequi(props.row).classes : ''"
              :title="getPaymentTodayNequi(props.row) ? getPaymentTodayNequi(props.row).observation : ''">
              <b>{{ formatPrice(getPaymentTodayNequi(props.row).amount) }}</b>
              <q-icon
                v-if="getPaymentTodayNequi(props.row) && getPaymentTodayNequi(props.row).classes !== 'green'"
                name="close"
                size="14px"
                class="q-ml-xs pointer-cursor"
                @click="deletePayment(getPaymentTodayNequi(props.row))"
              />
            </q-badge>
            <b
              v-else-if="getBalance(props.row) === 0"
              title="Ya pagó todo el préstamo">
              x
            </b>
            <b v-else>
              <q-btn
                color="primary"
                label="$"
                size="sm"
                @click="addPaymentNequi(props.row)"
                :disable="isDiabledAdd"
              />
            </b>
          </q-td>
          <q-td key="daysPassed" :props="props">
            {{ daysSinceGivenDate(props.row.firstDate) }}
          </q-td>
          <q-td key="firstDate" :props="props">
            {{ formatDate(props.row.firstDate) }}
          </q-td>
          <q-td key="endDate" :props="props">
            {{ formatDate(props.row.endDate) }}
          </q-td>
          <q-td key="endPaymentDate" :props="props">
            {{ getLastPaymentDate(props.row) }}
          </q-td>
          <q-td key="amountFeesPaid" :props="props">
            {{ getAmountfeesPaid(props.row) }}
          </q-td>
          <q-td key="balance" :props="props">
            {{ formatPrice(getBalance(props.row)) }}
          </q-td>
          <q-td key="phone" :props="props">
            <q-btn-dropdown
              color="black"
              size="12px"
              :auto-close="false"
              outline
              :label="props.row.phone"
              @click="onDropdownMainClick(props.row.new_id)"
            >
              <q-list>
                <q-item v-close-popup v-if="newItem.family_reference_name">
                  <q-item-section>
                    <q-item-label>Ref 1: {{ newItem.family_reference_name }}</q-item-label>
                    <q-item-label caption>{{ newItem.family_reference_phone }} - {{ newItem.family_reference_relationship }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-close-popup v-if="newItem.family2_reference_name">
                  <q-item-section>
                    <q-item-label>Ref 2: {{ newItem.family2_reference_name }}</q-item-label>
                    <q-item-label caption>{{ newItem.family2_reference_phone }} - {{ newItem.family2_reference_relationship }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-close-popup v-if="newItem.guarantor_name">
                  <q-item-section>
                    <q-item-label>Fiador: {{ newItem.guarantor_name }}</q-item-label>
                    <q-item-label caption>{{ newItem.guarantor_phone }} - {{ newItem.guarantor_relationship }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
      <!-- Fila de totales en el bottom -->
      <template v-slot:bottom-row>
        <q-tr class="bg-blue-2 text-primary">
          <q-td colspan="8"><strong>Total {{ totalUnitsNequi }} cobros</strong></q-td>
          <q-td><strong>{{ formatPrice(totalRenovation) }}</strong></q-td>
          <q-td><strong>{{ formatPrice(totalNequi) }}</strong></q-td>
          <q-td colspan="7"><strong>{{ formatPrice(totalCollection) }}</strong></q-td>
        </q-tr>
      </template>
    </q-table>
    <modal-add-payment
      v-if="showModalPaymentNequi"
      v-model="showModalPaymentNequi"
      :valuePayment="valuePayment"
      :row="itemSelected"
      type="nequi"
      @updateTable="getLendings"/>
    <modal-add-payment
      v-if="showModalPaymentRenovation"
      v-model="showModalPaymentRenovation"
      :valuePayment="valuePayment"
      :row="itemSelected"
      type="renovacion"
      @updateTable="getLendings"/>
    <modal-card-board
      v-if="showModalCardBoard"
      v-model="showModalCardBoard"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="getBalance(itemSelected) > itemSelected.amount"
      :showBtnRenovate="getBalance(itemSelected) === 0"
      title="Cartulina actual"
      :lendings="[itemSelected]"
      @updateTable="getLendings"/>
    <modal-card-board
      v-if="showModalCardBoardDouble"
      v-model="showModalCardBoardDouble"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="true"
      title="Cartulina doble interés"
      :lendings="[itemSelected]"
      @updateTable="getLendings"/>
    <modal-renove-lending
      v-if="showModalRenove"
      v-model="showModalRenove"
      :row="itemSelected"
      @renoveLending="renoveLending"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import ModalAddPayment from 'components/payment/ModalAddPayment.vue';
import ModalCardBoard from 'components/lending/ModalCardBoard.vue';
import ModalRenoveLending from './ModalRenoveLending.vue';
import listingTypes from '../../store/modules/listing/types';
import lendingTypes from '../../store/modules/lending/types';
import paymentTypes from '../../store/modules/payment/types';
import userTypes from '../../store/modules/user/types';
import newTypes from '../../store/modules/new/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  components: {
    ModalAddPayment,
    ModalCardBoard,
    ModalRenoveLending,
  },
  data() {
    return {
      isLoadingTable: false,
      itemSelected: {},
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
          name: 'index',
          required: true,
          label: '#',
          align: 'center',
          style: 'width: 50px',
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
          format: (val) => this.valueWithInterest(val),
          sortable: false,
        },
        {
          name: 'double',
          required: true,
          label: 'Doble interés',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          format: (val) => this.valueWithDoubleInterest(val),
          sortable: false,
        },
        {
          name: 'fee',
          required: true,
          label: 'Couta',
          align: 'center',
          style: 'width: 100px',
          field: (row) => row,
          format: (val) => this.feeWithInterest(val),
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
          name: 'amountFees',
          align: 'center',
          label: '# cuotas',
          field: 'amountFees',
          style: 'width: 80px',
          sortable: false,
        },
        {
          name: 'renovation',
          required: true,
          label: 'Renovación',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'collection',
          required: true,
          label: 'Nequi',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
        },
        {
          name: 'daysPassed',
          required: true,
          label: 'Dias',
          align: 'center',
          style: 'width: 50px',
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
          name: 'endPaymentDate',
          required: true,
          label: 'Último pago',
          align: 'center',
          style: 'width: 60px',
          sortable: false,
        },
        {
          name: 'amountFeesPaid',
          required: true,
          label: '# C. dadas',
          align: 'center',
          style: 'width: 60px',
          sortable: false,
        },
        {
          name: 'balance',
          required: true,
          label: 'Saldo',
          align: 'center',
          style: 'width: 60px',
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
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModalPaymentNequi: false,
      showModalPaymentRenovation: false,
      listingSelected: null,
      valuePayment: 0,
      showModalCardBoard: false,
      showModalCardBoardDouble: false,
      showModalRenove: false,
    };
  },
  watch: {
    async listingSelected(val) {
      console.log(val);
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.getLendings(val.value);
      this.$q.loading.hide();
    },
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.fetchMineListings();
    if (this.listings && this.listings.length > 0) {
      this.listingSelected = { ...this.optionsListings[0] };
    }
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(lendingTypes.PATH, [
      'lendings',
    ]),
    ...mapState(listingTypes.PATH, [
      'listings',
    ]),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(newTypes.PATH, {
      newItem: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
    ...mapState(paymentTypes.PATH, {
      paymentItem: 'payment',
      paymentStatus: 'status',
      paymentResponseMessages: 'responseMessages',
    }),
    optionsUsers() {
      return this.users.map(({ id, name }) => ({ label: name, value: id }));
    },
    optionsListings() {
      return this.listings.map(({ id, name, user_collector }) => ({ label: `${name} - ${user_collector.name}`, value: id }));
    },
    data() {
      return this.lendings.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
    },
    totalNequi() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentTodayNequi(lending);
        if (value) {
          total += parseInt(value.amount, 10);
        }
      });
      return total;
    },
    totalRenovation() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentTodayRenovation(lending);
        if (value) {
          total += parseInt(value.amount, 10);
        }
      });
      return total;
    },
    totalCollection() {
      return parseInt(this.totalNequi, 10) + parseInt(this.totalRenovation, 10);
    },
    totalUnitsNequi() {
      let total = 0;
      this.lendings.forEach((lending) => {
        const value = this.getPaymentTodayNequi(lending);
        if (value) {
          total += 1;
        }
      });
      return total;
    },
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      fetchLendings: lendingTypes.actions.FETCH_LENDINGS,
      updateLending: lendingTypes.actions.UPDATE_LENDING,
      deleteLending: lendingTypes.actions.DELETE_LENDING,
    }),
    ...mapActions(listingTypes.PATH, {
      fetchMineListings: listingTypes.actions.FETCH_MINE_LISTINGS,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
    }),
    ...mapActions(paymentTypes.PATH, {
      deletePaid: paymentTypes.actions.DELETE_PAYMENT,
    }),
    rowClass(row) {
      let color = 'bg-white';
      const days = this.daysSinceGivenDate(row.firstDate);
      if (days > 22) {
        color = 'bg-red';
      } else if (days >= 15 && days <= 22) {
        color = 'bg-blue';
      } else if (days > 7 && days <= 14) {
        color = 'bg-yellow';
      }
      return color;
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
    daysSinceGivenDate(givenDate) {
      // Asegúrate de que la fecha dada esté en formato Date
      givenDate = new Date(givenDate);
      // Obtén la fecha actual
      const today = new Date();
      // Establece la hora de ambos objetos en medianoche para evitar problemas con la hora
      today.setHours(0, 0, 0, 0);
      givenDate.setHours(0, 0, 0, 0);
      // Calcula la diferencia en milisegundos
      const differenceInMillis = today - givenDate;
      // Convierte la diferencia a días
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor(differenceInMillis / millisecondsInADay);
      return daysPassed;
    },
    getPeriod(row) {
      moment.locale('es');
      const format = 'dddd';
      const { period, firstDate } = row;
      const date = moment(firstDate);
      const text = `${period !== 'diario' ? date.format(format) : 'diario'}`;
      return text;
    },
    getLastPaymentDate(row) {
      const format = 'DD/MM/YYYY';
      const { payments } = row;
      if (payments && payments.length > 0) {
        const lastPayment = payments[payments.length - 1];
        return moment(lastPayment.date).format(format);
      }
      return 'x';
    },
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    valueWithDoubleInterest(row) {
      const val = row.amount + (row.amount * ((row.percentage * 2) / 100));
      return (val);
    },
    feeWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val / row.amountFees);
    },
    getAmountfeesPaid(row) {
      const valueFee = this.feeWithInterest(row);
      let totalPayments = 0;
      let valueAmuntFeesPaid = 0;
      if (row.payments && row.payments.length > 0) {
        totalPayments = row.payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
        valueAmuntFeesPaid = (parseInt(totalPayments, 10) / parseInt(valueFee, 10));
      }
      return Math.floor(valueAmuntFeesPaid);
    },
    getBalance(row) {
      const total = row.has_double_interest ? this.valueWithInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        totalPayments = row.payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
    hasPaymentToday(row, type) {
      let has = false;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === type) {
            has = true;
          }
        });
      }
      return has;
    },
    getPaymentTodayNequi(row) {
      let pay = null;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'nequi') {
            pay = { ...payment };
            let classes = '';
            let observation = '';
            if (pay.status === 'aprobado' || pay.status === 'verificado') {
              classes = 'green';
            } else if (pay.status === 'rechazado') {
              classes = 'red';
              observation = pay.observation;
            } else {
              classes = 'black';
            }
            pay.classes = classes;
            pay.observation = observation;
          }
        });
      }
      return pay;
    },
    getPaymentTodayRenovation(row) {
      let pay = null;
      const currentDate = moment().startOf('day');
      if (row.payments && row.payments.length > 0) {
        row.payments.forEach((payment) => {
          const datePayment = moment(payment.date).startOf('day');
          if (currentDate.isSame(datePayment, 'day') && payment.type === 'renovacion') {
            pay = payment;
          }
        });
      }
      return pay;
    },
    async onDropdownMainClick(id) {
      showLoading('consultando ...', 'Por favor, espere', true);
      await this.getNew(id);
      this.$q.loading.hide();
    },
    async getLendings(idList) {
      await this.fetchLendings({
        idList,
      });
    },
    async save(field, value) {
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value ? value.value : value;
      await this.updateListing(this.itemSelected);
      this.isLoadingTable = false;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addPaymentNequi(row) {
      this.valuePayment = this.feeWithInterest(row);
      this.showModalPaymentNequi = true;
    },
    addPaymentRenovation(row) {
      this.valuePayment = this.getBalance(row);
      this.showModalPaymentRenovation = true;
    },
    async openModal(action, row) {
      if (action === 'normal') {
        this.showModalCardBoard = true;
      } else if (action === 'double') {
        this.showModalCardBoardDouble = true;
      } else if (action === 'renove') {
        console.log(row);
        this.showModalRenove = true;
      } else if (action === 'close') {
        this.$q.dialog({
          title: 'Cerrar préstamo',
          message: 'Está seguro que desea cerrar el préstamo?',
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
          showLoading('cerrando ...', 'Por favor, espere', true);
          await this.updateLending({
            ...row,
            status: 'closed',
          });
          await this.getLendings(this.listingSelected.value);
          this.$q.loading.hide();
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      }
    },
    deletePayment(row) {
      this.$q.dialog({
        title: 'Eliminar',
        message: 'Está seguro que desea eliminar el pago?',
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
        this.isLoadingTable = true;
        await this.deletePaid(row.id);
        await this.getLendings(this.listingSelected.value);
        this.isLoadingTable = false;
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    renoveLending(row) {
      console.log(row);
      console.log(row.list.id);
    },
  },
};
</script>
<style scoped>
  .q-table--dense .q-table th:first-child, .q-table--dense .q-table td:first-child {
    padding-left: 4px;
  }
  .q-table--dense .q-table th, .q-table--dense .q-table td {
    padding: 4px 4px;
  }
  .pointer-cursor {
    cursor: pointer;
  }
</style>
