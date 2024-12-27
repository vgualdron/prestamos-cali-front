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
      options: [
        { label: 'cliente bueno', value: 'cliente bueno' },
        { label: 'cliente regular', value: 'cliente regular' },
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
    console.log(this.idList);
    await this.fetchLendingsClosed(this.idList);
    this.$q.loading.hide();
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
