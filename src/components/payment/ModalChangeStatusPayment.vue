<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="row text-center">
            <div class="col-8 text-center">
              <img v-if="url" :src="url" class="inherit-width"/>
            </div>
            <div class="col-4 text-center q-mt-md">
              <q-form class="q-gutter-md">
                <q-input
                  outlined
                  v-model.trim="inputValue.nameNequi"
                  label="Nombre de nequi *"
                  lazy-rules
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                />
                <q-input
                  outlined
                  v-model.trim="inputValue.dateTransaction"
                  label="Fecha de transacción *"
                  lazy-rules
                  type="date"
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                  autocomplete="off"
                />
                <q-input
                  outlined
                  v-model.trim="inputValue.reference"
                  label="Referencia de pago *"
                  lazy-rules
                  :rules="[(val) => (!!val) || '']"
                  hide-bottom-space
                  autocomplete="off"
                />
                <q-input
                  outlined
                  v-model.trim="inputValue.observation"
                  label="Observación"
                  lazy-rules
                  hide-bottom-space
                />
              </q-form>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section
          v-if="showBtnCancel || showBtnAccept"
          class="row items-center float-right">
          <div class="row text-center">
            <q-btn
              v-if="showBtnCancel"
              :label="labelBtnCancel"
              type="reset"
              color="primary"
              class="col"
              outline
              :disabled="!inputValue.observation"
              @click="clickBtnCancel"/>
            <q-btn
              v-if="showBtnAccept"
              :label="labelBtnAccept"
              type="submit"
              color="primary"
              class="col q-ml-sm"
              :disabled="showInputValue && (!inputValue.nameNequi || !inputValue.dateTransaction || !inputValue.reference)"
              @click="clickBtnAccept"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
      inputValue: {
        nameNequi: '',
        dateTransaction: new Date().toISOString().split('T')[0],
        reference: '',
        observation: '',
      },
    };
  },
  mounted() {
  },
  watch: {
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
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      default: 'Previsualizdor',
    },
    showBtnAccept: {
      type: Boolean,
      require: false,
      default: false,
    },
    showBtnCancel: {
      type: Boolean,
      require: false,
      default: false,
    },
    showInputValue: {
      type: Boolean,
      require: false,
      default: false,
    },
    labelBtnAccept: {
      type: String,
      require: false,
      default: 'Aceptar',
    },
    labelBtnCancel: {
      type: String,
      require: false,
      default: 'Cancelar',
    },
  },
  methods: {
    clickBtnAccept() {
      this.$emit('clickBtnAccept', this.inputValue);
    },
    clickBtnCancel() {
      this.$emit('clickBtnCancel', this.inputValue);
    },
  },
};
</script>
<style scoped>
  .inherit-width {
    width: inherit;
  }
</style>
