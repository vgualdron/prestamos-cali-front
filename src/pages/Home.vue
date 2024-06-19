<template>
  <q-page class="">
    <home />
    <div class="row">
      <div class="col-12 text-center">
        <q-btn
          label="Agregar foto"
          color="primary"
          icon="camera"
          ref="camera"
          @click="showModalCameraPhoto = true" />
      </div>
    </div>
    <div class="row q-ma-md">
      <div class="col-12 text-center">
        <q-btn
          label="Agregar video"
          color="primary"
          icon="camera"
          ref="camera"
          @click="showModalCameraVideo = true" />
      </div>
    </div>
    <camera-photo
      v-if="showModalCameraPhoto"
      :config="configCamera"
      v-model="showModalCameraPhoto"
      />
    <camera-video
      v-if="showModalCameraVideo"
      :config="configCamera"
      v-model="showModalCameraVideo"
      />
  </q-page>
</template>

<script>
import Home from 'components/home/Home.vue';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';

export default {
  components: {
    Home,
    CameraPhoto,
    CameraVideo,
  },
  data() {
    return {
      showModalCameraPhoto: false,
      showModalCameraVideo: false,
      configCamera: {
        type: 'photo',
      },
    };
  },
  name: 'PageHome',
  computed: {
  },
};
</script>
