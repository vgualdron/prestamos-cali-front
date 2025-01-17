<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Cerrar prestamo
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <div>
                <p>Calificación del cliente:</p>
                <q-option-group
                  v-model="selectedReason"
                  :options="options"
                  type="radio"
                />
              </div>
            </div>
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
    row: {
      type: Object,
      required: false,
    },
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    ...mapState(lendingTypes.PATH, {
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
    }),
    ...mapActions(newTypes.PATH, {
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    formatLink(row) {
      if (row.file) {
        return `${process.env.URL_FILES}${row.file.url}`;
      }
      return '';
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
    async closedLending() {
      showLoading('cerrando ...', 'Por favor, espere', true);
      await this.updateLending({
        id: this.row.id,
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
