<template>
  <q-page padding>
    <p class="text-h6">Camera</p>
    <div class="row">
      <div class="col-12 text-center">
        <video autoplay width="250rem" ref="videoplay"></video>
      </div>
      <div class="col-12 text-center">
        <q-btn v-if="!cameraStart" label="Acessar Camera" color="primary" icon="camera" :disable="!enableCamera"
          @click="useCamera" />
        <q-btn v-else label="Tirar Foto" color="primary" icon="camera" @click="takePhoto" />
      </div>
      <div class="col-12 text-center">
        {{ responseMessages }}
        <br>
        {{ status }}
        <br>
        {{ image }}
        <img src="" ref="imgTakePhoto" width="250rem" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import imageTypes from '../../store/modules/image/types';

export default {
  name: 'Camera',
  data() {
    return {
      enableCamera: false,
      cameraStart: false,
      imageCapture: null,
      track: null,
      image: null,
    };
  },
  computed: {
    ...mapState(imageTypes.PATH, [
      'responseMessages',
      'status',
    ]),
  },
  mounted() {
    if (navigator.mediaDevices.getUserMedia) {
      this.enableCamera = true;
    }
  },
  methods: {
    ...mapActions(imageTypes.PATH, {
      saveImage: imageTypes.actions.SAVE_IMAGE,
      deleteImage: imageTypes.actions.DELETE_IMAGE,
    }),
    useCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          this.cameraStart = true;
          this.$refs.videoplay.srcObject = mediaStream;
          this.track = mediaStream.getVideoTracks();
          this.imageCapture = new ImageCapture(this.track[0]);
        });
    },
    takePhoto() {
      this.imageCapture.takePhoto()
        .then((blob) => {
          createImageBitmap(blob);
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.image = reader.result;
            this.$refs.imgTakePhoto.src = this.image;
            console.log(this.image);
            this.saveImage({ image: this.image });
          };
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
