<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Responder a la solicitud
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          {{
            row.type === 'renovacion'
            ? `El valor solicitado es: ${formatPrice(row.observation)}`
            : row.observation
          }}
          <q-option-group
            v-if="row.type === 'renovacion'"
            v-model="amount"
            :options="[
              {
                label: '$100.000',
                value: 100000,
                disable: 100000 < row.observation
              },
              {
                label: '$200.000',
                value: 200000,
                disable: 200000 < row.observation
              },
              {
                label: '$300.000',
                value: 300000,
                disable: 300000 < row.observation
              },
              {
                label: '$400.000',
                value: 400000,
                disable: 400000 < row.observation
              },
              {
                label: '$500.000',
                value: 500000,
                disable: 500000 < row.observation
              },
              {
                label: '$600.000',
                value: 600000,
                disable: 600000 < row.observation
              },
            ]"
            color="primary"
          />
          <div v-else-if="row.type === 'cuenta'" class="div-container">
            <p class="text-subtitle1 text-weight-bold text-center">VIDEO AUTORIZA CUENTA TERCERO</p>
            <camera-video
              :config="{
                name: 'VIDEO_AUTORIZA_CUENTA_TERCERO',
                storage: 'news',
                modelName: 'news',
                modelId: row.model_id
              }"
              type="read"
            />
          </div>
          <q-input
            outlined
            v-model.trim="amount"
            label="Observación"
            lazy-rules
            class="q-mt-sm"
            hide-bottom-space
            autocomplete="off"
          />
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Rechazar"
            color="red"
            class="col q-ml-sm"
            @click="changeStatus('rechazado')"
          />
          <q-btn
            label="Aprobar"
            color="green"
            class="col q-ml-sm"
            @click="changeStatus('aprobado')"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import CameraVideo from 'components/common/CameraVideo.vue';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      amount: '',
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
  mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    // this.amount = this.row.type === 'renovacion' ? parseInt(this.row.observation, 10) : '';
    this.$q.loading.hide();
  },
  computed: {
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
    changeStatus(status) {
      const data = {
        ...this.row,
        json: this.row.type === 'cuenta' ? this.row.value : null,
        value: this.amount,
        status,
      };
      this.$emit('updateStatus', data);
    },
  },
  components: {
    CameraVideo,
  },
};
</script>
<style scoped>
  .inherit-width {
    width: -webkit-fill-available;;
  }
</style>
