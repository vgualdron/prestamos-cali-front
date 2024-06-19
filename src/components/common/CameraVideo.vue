<template>
  <div class="q-pa-md">
    <q-dialog v-model="showModal" persistent>
      <q-card style="max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Grabar video</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <div class="video-recorder">
            <a v-if="responseMessages && responseMessages.length > 0"
              :href="responseMessages[0].detail"
              target="_blank">
              Abrir
            </a>
            <video ref="video" autoplay></video>
            <div>
              <button @click="startRecording">Start Recording</button>
              <button @click="stopRecording" :disabled="!isRecording">Stop Recording</button>
            </div>
            <div v-if="videoURL">
              <h3>Recorded Video:</h3>
              <video :src="videoURL" controls></video>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Guardar"
            color="primary"
            class="col q-ml-sm"
            @click="send"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fileTypes from '../../store/modules/file/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      mediaRecorder: null,
      chunks: [],
      videoURL: null,
      isRecording: false,
      video: null,
      blob: null,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
    },
  },
  computed: {
    ...mapState(fileTypes.PATH, [
      'responseMessages',
      'status',
    ]),
    showModal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    file() {
      const f = this.video.split('base64,');
      return f.length > 1 ? f[1] : f[0];
    },
    extension() {
      const { type } = this.blob;
      const ext = type.split('/');
      return ext.length > 1 ? ext[1] : ext[0];
    },
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async startRecording() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const e = [{
          text: 'Error al acceder a la camara',
          detail: 'getUserMedia is not supported in this browser.',
        }];
        this.showNotification(e, false, 'top-right', 5000);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;

        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
        this.mediaRecorder.onstop = this.handleStop;

        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.isRecording = false;
    },
    handleStop() {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      this.videoURL = URL.createObjectURL(blob);
      this.blob = blob;
      console.log(this.blob);
      console.log(this.videoURL);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        this.video = reader.result;
        console.log(this.video);
      };
      this.chunks = [];
    },
    async send() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.saveFile({
        file: this.file,
        extension: this.extension,
      });
      this.$q.loading.hide();
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
  },
};
</script>

<style scoped>
.video-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

video {
  width: 100%;
  max-width: 640px;
  border: 1px solid #000;
}

button {
  margin: 10px;
}
</style>
