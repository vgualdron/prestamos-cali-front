<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll" v-if="row && row.id">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
              <q-input
                outlined
                v-model="amount"
                label="Valor *"
                type="number"
                step="1000"
                :max="row.remaining"
                :hint="formattedPrice(amount)"
                :readonly="type === 'renovacion'"/>
            </div>
          </div>
          <div class="row q-mt-md" v-if="(amount > 0) && (amount <= row.remaining)">
            <div class="col-12 text-center">
              <p class="text-subtitle1 text-weight-bold text-center">AGREGAR FOTO DE SOPORTE DE PAGO</p>
              <upload-image
                :config="{
                  name: 'FOTO_DEPOSIT_LOAN',
                  storage: 'deposits',
                  modelName: 'deposits',
                  modelId: idDeposit,
                  labelBtn: null,
                }"
                @savedFile="saveAddPayment"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import UploadImage from 'components/common/UploadImage.vue';
import depositTypes from '../../store/modules/deposit/types';
import fileTypes from '../../store/modules/file/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      amount: 0,
      idDeposit: 0,
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
    type: {
      type: String,
      required: false,
      default: 'nequi',
    },
    valuePayment: {
      required: true,
    },
  },
  mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    this.amount = parseInt(this.valuePayment, 10);
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(depositTypes.PATH, {
      depositStatus: 'status',
      depositResponseMessages: 'responseMessages',
    }),
    ...mapState(fileTypes.PATH, {
      file: 'file',
      fileStatus: 'status',
      fileResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    columns() {
      return this.fields;
    },
    title() {
      return 'Agregar pago';
    },
  },
  methods: {
    ...mapActions(depositTypes.PATH, {
      addDeposit: depositTypes.actions.SAVE_DEPOSIT,
      updateDeposit: depositTypes.actions.UPDATE_DEPOSIT,
      deleteDeposit: depositTypes.actions.DELETE_DEPOSIT,
    }),
    ...mapActions(fileTypes.PATH, {
      updateFile: fileTypes.actions.UPDATE_FILE,
    }),
    async saveAddPayment() {
      const { id } = this.row;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addDeposit({
        loan_id: id,
        amount: this.amount,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        observation: '',
        status: 'creado',
        file_id: this.file.id,
      });
      this.$q.loading.hide();
      console.log(this.depositResponseMessages);
      if (this.depositResponseMessages && this.depositResponseMessages.data) {
        this.idDeposit = this.depositResponseMessages.data.id;
        await this.updateFile({
          ...this.file,
          model_id: this.idDeposit,
        });
        this.$q.loading.hide();
        this.showDialog = false;
        this.$emit('updateTable', this.row.loan_id);
        this.$emit('addDeposit', { idFile: this.file.id });
      }
    },
    formattedPrice(value) {
      if (!value) return '';
      return value
        .toString()
        .replace(/\D/g, '') // Elimina caracteres no numéricos
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega puntos como separadores
    },
  },
  components: {
    UploadImage,
  },
};
</script>
