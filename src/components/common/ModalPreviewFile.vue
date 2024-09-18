<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Previsualizador</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <div class="col-12 text-center">
            <img
              v-if="url"
              :src="url"/>
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
              @click="clickBtnCancel"/>
            <q-btn
              v-if="showBtnAccept"
              :label="labelBtnAccept"
              type="submit"
              color="primary"
              class="col q-ml-sm"
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
      this.$emit('clickBtnAccept');
    },
    clickBtnCancel() {
      this.$emit('clickBtnCancel');
    },
  },
};
</script>
