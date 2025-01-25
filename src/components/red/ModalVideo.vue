<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar video</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="row text-center">
            <camera-video
              :config="config"
              state="creado"
              @savedFile="onSavedFile"
            />
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import CameraVideo from 'components/common/CameraVideo.vue';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
    };
  },
  components: {
    CameraVideo,
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
    config: {},
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    onSavedFile(value) {
      this.$emit('savedFile', value);
      this.showDialog = false;
    },
  },
};
</script>
<style scoped>
</style>
