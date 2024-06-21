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
          <div class="row q-mb-md">
            <div class="col-12 text-center">
              <q-select
                v-model="selectedDeviceId"
                :options="videoInputDevices"
                label="Seleccione la camara"
                option-value="deviceId"
                option-label="label"
                @input="startRecording"
                color="primary"
                outlined />
            </div>
          </div>
          <div class="video-recorder">
            <div v-show="!videoURL || isRecording" class="col-12 text-center video-container">
              <video autoplay width="250rem" ref="video" id="video"></video>
              <div class="overlay-square"></div>
            </div>
            <div v-if="videoURL && !isRecording">
              <video width="250rem" :src="videoURL" controls></video>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            :disabled="isRecording"
            @click="startRecording(selectedDeviceId)"
            color="primary">
              Iniciar
          </q-btn>
          <q-btn
            @click="stopRecording"
            :disabled="!isRecording"
            color="primary"
            class="q-ml-sm"
            outline>
              Parar
          </q-btn>
          <q-btn
            :disabled="isRecording || !videoURL"
            label="Guardar"
            color="primary"
            class="q-ml-sm"
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
      videoInputDevices: [],
      selectedDeviceId: null,
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
  async mounted() {
    await this.initCamera();
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
    link() {
      if (this.responseMessages && this.responseMessages.length > 0) {
        return `${process.env.URL_FILES}${this.responseMessages[0].text}`;
      }
      return '';
    },
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const e = [{
          text: 'Error al acceder a la camara',
          detail: 'getUserMedia is not supported in this browser.',
        }];
        this.showNotification(e, false, 'top-right', 5000);
      } else {
        await this.getVideoInputDevices();
      }
    },
    async getVideoInputDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
        if (this.videoInputDevices.length > 0) {
          this.selectedDeviceId = this.videoInputDevices.length === 2 ? this.videoInputDevices[1] : this.videoInputDevices[0];
        }
      } catch (error) {
        console.error('Error fetching video input devices', error);
      }
    },
    async startRecording(deviceId) {
      try {
        this.videoURL = null;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: deviceId && deviceId.deviceId ? deviceId.deviceId : deviceId,
            },
          },
          audio: true,
        });
        this.isRecording = true;
        this.$refs.video.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = this.handleStop;

        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.$refs.video.srcObject.getTracks().forEach((track) => track.stop());
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
      const { name, storage, modelId, modelName } = this.config;
      await this.saveFile({
        name,
        storage,
        modelName,
        modelId,
        type: 'video',
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

  .video-container {
    position: relative;
    display: inline-block;
  }
  video {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  .overlay-square {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 2px solid red;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Make sure the square doesn't block interactions with the video */
  }
</style>
