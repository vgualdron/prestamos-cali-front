<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Renovar préstamo a {{ row.nameDebtor }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll" v-if="row && row.id">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-banner v-if="row.has_double_interest" dense class="bg-info text-white text-center q-mb-md">
                El préstamo tiene aplicado el doble interés.
              </q-banner>
            </div>
            <div class="col-12 text-center">
              <q-form class="q-gutter-md">
                <q-input
                  outlined
                  v-model.trim="date"
                  label="Fecha *"
                  lazy-rules
                  type="date"
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                  autocomplete="off"
                  :readonly="false"
                />
                <q-input
                  outlined
                  :value="formatPrice(amount)"
                  label-color="blue"
                  bg-color="white"
                  label="Prestamo actual *"
                  lazy-rules
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                  autocomplete="off"
                  readonly
                />
                <q-input
                  outlined
                  :value="formatPrice(getBalance(row))"
                  label-color="blue"
                  bg-color="white"
                  label="Saldo actual*"
                  lazy-rules
                  hide-bottom-space
                  autocomplete="off"
                  readonly
                />
                <div class="row">
                  <q-option-group
                    class="col-9"
                    label="Desea subir, bajar o mantener el mismo valor de credito?"
                    v-model="action"
                    :options="optionsActions"
                    color="primary"
                    inline
                  />
                  <div v-if="!question" class="col-3 is-flex">
                    <q-btn
                      color="primary"
                      icon="call_made"
                      title="Solicitar permiso para aumentar el valor del prestamo"
                      @click="saveQuestionLending(row)"
                    />
                    <div class="q-display-inline">
                      <q-icon size="xs" name="edit" class="q-ml-sm" />
                      <b>{{ formatPrice(amountGet) }}</b>
                      <q-popup-edit :value="amountGet" v-slot="scope" buttons
                        @input="val => amountGet = val">
                        <q-option-group
                          v-model="scope.value"
                          :options="[
                            {
                              label: '$100.000',
                              value: 100000,
                              disable: 100000 <= amount
                            },
                            {
                              label: '$200.000',
                              value: 200000,
                              disable: 200000 <= amount
                            },
                            {
                              label: '$300.000',
                              value: 300000,
                              disable: 300000 <= amount
                            },
                            {
                              label: '$400.000',
                              value: 400000,
                              disable: 400000 <= amount
                            },
                            {
                              label: '$500.000',
                              value: 500000,
                              disable: 500000 <= amount
                            },
                            {
                              label: '$600.000',
                              value: 600000,
                              disable: 600000 <= amount
                            },
                          ]"
                          color="primary"
                        />
                      </q-popup-edit>
                    </div>
                  </div>
                  <div v-else-if="question.status === 'pendiente'" class="col-3 is-flex">
                    <q-btn
                      color="primary"
                      class="col-2"
                      icon="refresh"
                      title="Actualizar el estado de la solicitud de permiso para aumentar el valor del prestamo"
                      @click="getStatusQuestionLending(row)"
                    />
                    <b class="q-ml-sm">{{ formatPrice(question.observation) }}</b>
                  </div>
                  <template v-else-if="question.status === 'rechazado'">
                    <q-badge
                      color="red"
                      class="">
                      {{ question.status }}
                    </q-badge>
                  </template>
                  <template v-else-if="question.status === 'aprobado'">
                    <q-badge
                      color="green"
                      class="">
                      {{ formatPrice(question.value) }}
                    </q-badge>
                  </template>
                </div>
                <q-select
                  :readonly="action === 'equal'"
                  label="Valor a solicitar *"
                  outlined
                  v-model.trim="amountNew"
                  :options="optionsValues"/>
                <q-input
                  outlined
                  :value="formatPrice(repayment)"
                  label="Devolución *"
                  label-color="green"
                  bg-color="white"
                  lazy-rules
                  hide-bottom-space
                  autocomplete="off"
                  readonly
                />
              </q-form>
              <div class="q-mt-sm">
                Valor nuevo a pagar:
                {{ formatPrice(valueWithInterest({ amount: amountNew ? amountNew.value : 0, percentage: row.percentage })) }}
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn-dropdown
            color="primary"
            label="Transferir"
            :disabled="!date || amount <= 0 || amount > row.amount || repayment === 0"
          >
            <div class="row no-wrap q-pa-md" v-if="newItem">
              <div class="column">
                <div class="text-h6 q-mb-sm">Seleccionar cuenta</div>
                  <q-option-group
                  v-model="accountSelected"
                  :options="[
                    {
                      label: `${newItem.account_type}: ${newItem.account_number}`,
                      value: 'principal'
                    },
                    {
                      label: `${newItem.account_type_third}: ${newItem.account_number_third}`,
                      value: 'tercero',
                      disable: !newItem.account_type_third,
                    },
                  ]"
                  color="primary"
                />
                <q-btn
                  color="primary"
                  label="TRANSFERIR"
                  push
                  size="sm"
                  @click="saveAccountActive"
                  :disabled="!accountSelected"
                />
              </div>
            </div>
          </q-btn-dropdown>
          <q-btn
            label="Adelantar"
            color="primary"
            class="col q-ml-sm"
            :disabled="!date || amount <= 0 || amount > row.amount || action === 'up' || repayment === 0"
            @click="renoveLending('repayment')"
          />
          <q-btn
            label="Renovar"
            color="primary"
            class="col q-ml-sm"
            :disabled="repayment > 0"
            @click="renoveLending('renove')"
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
import questionTypes from '../../store/modules/question/types';
import newTypes from '../../store/modules/new/types';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      amount: 0,
      amountNew: null,
      amountGet: 600000,
      action: 'equal',
      optionsValues: [],
      optionsActions: [{
        label: 'Mantener credito',
        value: 'equal',
      },
      {
        label: 'Bajar credito',
        value: 'down',
      },
      {
        label: 'Subir credito',
        value: 'up',
        disable: true,
      }],
      optionsValuesTmp: [
        {
          label: '$50.000',
          value: 50000,
        },
        {
          label: '$75.000',
          value: 75000,
        },
        {
          label: '$100.000',
          value: 100000,
        },
        {
          label: '$125.000',
          value: 125000,
        },
        {
          label: '$150.000',
          value: 150000,
        },
        {
          label: '$175.000',
          value: 175000,
        },
        {
          label: '$200.000',
          value: 200000,
        },
        {
          label: '$225.000',
          value: 225000,
        },
        {
          label: '$250.000',
          value: 250000,
        },
        {
          label: '$275.000',
          value: 275000,
        },
        {
          label: '$300.000',
          value: 300000,
        },
        {
          label: '$325.000',
          value: 325000,
        },
        {
          label: '$350.000',
          value: 350000,
        },
        {
          label: '$375.000',
          value: 375000,
        },
        {
          label: '$400.000',
          value: 400000,
        },
        {
          label: '$425.000',
          value: 425000,
        },
        {
          label: '$450.000',
          value: 450000,
        },
        {
          label: '$475.000',
          value: 475000,
        },
        {
          label: '$500.000',
          value: 500000,
        },
        {
          label: '$550.000',
          value: 550000,
        },
        {
          label: '$600.000',
          value: 600000,
        },
        {
          label: '$650.000',
          value: 650000,
        },
        {
          label: '$700.000',
          value: 700000,
        },
        {
          label: '$750.000',
          value: 750000,
        },
        {
          label: '$800.000',
          value: 800000,
        },
        {
          label: '$850.000',
          value: 850000,
        },
        {
          label: '$900.000',
          value: 900000,
        },
        {
          label: '$950.000',
          value: 950000,
        },
        {
          label: '$1.000.000',
          value: 1000000,
        },
        {
          label: '$1.100.000',
          value: 1100000,
        },
        {
          label: '$1.200.000',
          value: 1200000,
        },
        {
          label: '$1.300.000',
          value: 1300000,
        },
        {
          label: '$1.400.000',
          value: 1400000,
        },
        {
          label: '$1.500.000',
          value: 1500000,
        },
      ],
      accountSelected: null,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    this.optionsValues = [...this.optionsValuesTmp];
    this.amount = this.row.amount;
    this.amountNew = this.optionsValues.find((option) => option.value === this.row.amount);
    if (this.row.has_double_interest) {
      const [date] = new Date(this.row.doubleDate).toISOString().split('T');
      this.date = date;
    }
    await this.getStatusQuestionLending(this.row);
    await this.getNew(this.row.new_id);
    this.accountSelected = this.newItem.account_active;
  },
  watch: {
    action(value) {
      console.log(value);
      const options = [...this.optionsValuesTmp];
      if (value === 'down') {
        this.optionsValues = options.filter((option) => option.value <= this.amount && option.value >= this.getBalance(this.row));
      } else if (value === 'up') {
        let max = 1000000;
        if (this.question && this.question.status === 'aprobado' && this.question.value > 0) {
          max = parseInt(this.question.value, 10);
        }
        this.optionsValues = options.filter((option) => option.value >= this.amount && option.value <= max);
      } else {
        this.optionsValues = options.filter((option) => option.value === this.amount);
      }
      [this.amountNew] = this.optionsValues;
    },
  },
  computed: {
    ...mapState(questionTypes.PATH, {
      question: 'question',
      questionStatus: 'status',
      questionResponseMessages: 'responseMessages',
    }),
    ...mapState(newTypes.PATH, {
      newItem: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    totalAmount() {
      let newValue = 0;
      if (this.amountNew) {
        newValue = this.amountNew.value;
      }
      return parseInt(this.amountNew, 10) + parseInt(newValue, 10);
    },
    repayment() {
      let total = 0;
      if (this.amountNew) {
        total = parseInt(this.amountNew.value, 10) - parseInt(this.getBalance(this.row), 10);
      }
      return total;
    },
  },
  methods: {
    ...mapActions(questionTypes.PATH, {
      saveQuestion: questionTypes.actions.SAVE_QUESTION,
      getStatusQuestion: questionTypes.actions.GET_STATUS_QUESTION,
    }),
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    async saveAccountActive() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.completeDataNew({
        id: this.row.new_id,
        account_active: this.accountSelected,
      });

      if (!this.newStatus) {
        this.showNotification(this.newResponseMessages, this.newStatus, 'top-right', 5000);
      } else {
        await this.renoveLending('transfer');
        this.showModal = false;
      }
      this.$q.loading.hide();
    },
    async saveQuestionLending(row) {
      showLoading('Solicitando ...', 'Por favor, espere', true);
      const data = {
        model_id: row.id,
        model_name: 'lendings',
        area_id: 1, // nequi
        type: 'renovacion',
        status: 'pendiente',
        observation: this.amountGet,
        value: '',
      };
      await this.saveQuestion(data);
      await this.getStatusQuestionLending(row);
      this.$q.loading.hide();
    },
    async getStatusQuestionLending(row) {
      showLoading('Consultando ...', 'Por favor, espere', true);
      const data = {
        model_id: row.id,
        model_name: 'lendings',
        area_id: 1, // nequi
        type: 'renovacion',
      };
      await this.getStatusQuestion(data);
      if (this.question && this.question.status === 'aprobado') {
        this.optionsActions[2].disable = false;
      }
      this.$q.loading.hide();
    },
    formatLink(row) {
      if (row.file) {
        return `${process.env.URL_FILES}${row.file.url}`;
      }
      return '';
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    valueWithInterest(row) {
      const val = row.amount + (row.amount * (row.percentage / 100));
      return (val);
    },
    valueWithDoubleInterest(row) {
      const val = row.amount + (row.amount * ((row.percentage * 2) / 100));
      return (val);
    },
    getBalance(row) {
      const total = row.hasDoubleInterest ? this.valueWithDoubleInterest(row) : this.valueWithInterest(row);
      let totalPayments = 0;
      if (row.payments && row.payments.length > 0) {
        const payments = row.payments.filter((payment) => payment.type === 'nequi' && payment.is_valid);
        totalPayments = payments.reduce((result, payment) => (parseInt(result, 10) + parseInt(payment.amount, 10)), 0);
      }
      return (total - totalPayments);
    },
    renoveLending(action) {
      const {
        id,
      } = this.row;

      this.$q.dialog({
        title: 'Confirmar',
        message: 'Está seguro?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(async () => {
        this.$emit('renoveLending', {
          id,
          date: this.date,
          amount: this.amountNew.value,
          repayment: this.repayment,
          action,
          status: 'renovated',
        });
        this.showDialog = false;
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
  .inherit-width {
    width: -webkit-fill-available;;
  }
  .q-display-inline {
    display: inline;
  }
</style>
