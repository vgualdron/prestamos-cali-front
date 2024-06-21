<template>
  <div class="q-pa-md">
    <q-dialog v-model="showModal" persistent>
      <q-card style="max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Tomar foto</div>
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
                @input="openCamera"
                color="primary"
                outlined />
            </div>
          </div>
          <div class="row">
            <div v-show="showVideo" class="col-12 text-center video-container">
              <video autoplay width="250rem" ref="video" id="video"></video>
              <div class="overlay-square"></div>
            </div>
            <div v-if="!showVideo" class="col-12 text-center">
              <img src="" ref="imgTakePhoto" width="250rem" />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-12 text-center">
              <q-btn
                v-if="!cameraStart"
                label="Dar permiso de camara"
                color="primary"
                icon="camera"
                ref="camera"
                :disabled="!enableCamera"
                @click="startCamera" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Tomar"
            color="primary"
            :disabled="!showVideo || !cameraStart"
            @click="takePhoto" />
          <q-btn
            label="Cambiar"
            color="primary"
            class="col q-ml-sm"
            @click="showVideo = true"
            :disabled="showVideo"
            outline
          />
          <q-btn
            label="Guardar"
            color="primary"
            class="col q-ml-sm"
            :disabled="showVideo"
            @click="sendImage"
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
  name: 'CameraPhoto',
  data() {
    return {
      videoInputDevices: [],
      selectedDeviceId: null,
      enableCamera: false,
      cameraStart: false,
      imageCapture: null,
      track: null,
      image: null,
      blob: null,
      showVideo: true,
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
      const f = this.image.split('base64,');
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
  async mounted() {
    await this.initCamera();
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
    }),
    async initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const e = [{
          text: 'Error al acceder a la camara',
          detail: 'getUserMedia is not supported in this browser.',
        }];
        this.showNotification(e, false, 'top-right', 5000);
      } else {
        this.enableCamera = true;
        await this.getVideoInputDevices();
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async getVideoInputDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
        if (this.videoInputDevices.length > 0) {
          this.selectedDeviceId = this.videoInputDevices.length === 2 ? this.videoInputDevices[1] : this.videoInputDevices[0];
          this.openCamera(this.selectedDeviceId);
        }
      } catch (error) {
        console.error('Error fetching video input devices', error);
      }
    },
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        window.location.reload();
      } catch (error) {
        const e = [{
          text: 'Error al acceder a la camara',
          detail: error.message,
        }];
        this.showNotification(e, false, 'top-right', 5000);
      }
    },
    async openCamera(deviceId) {
      this.showModal = true;
      navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId && deviceId.deviceId ? deviceId.deviceId : deviceId,
          },
        },
      }).then((mediaStream) => {
        this.cameraStart = true;
        this.$refs.video.srcObject = mediaStream;
        this.track = mediaStream.getVideoTracks();
        this.imageCapture = new ImageCapture(this.track[0]);
      });
    },
    async takePhoto() {
      showLoading('Tomando foto ...', 'Por favor, espere', true);
      this.showVideo = false;
      await this.imageCapture.takePhoto()
        .then((blob) => {
          createImageBitmap(blob);
          this.blob = blob;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            this.image = reader.result;
            this.$refs.imgTakePhoto.src = this.image;
          };
        }).catch((error) => console.log(error));
      this.$q.loading.hide();
    },
    async sendImage() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const { name, storage, modelId, modelName } = this.config;
      await this.saveFile({
        name,
        storage,
        modelName,
        modelId,
        type: 'image',
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
