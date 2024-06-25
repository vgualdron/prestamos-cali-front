<template>
  <q-page class="">
    <home />
    <camera-photo
      :config="{
        name: '1-casa',
        storage: 'news',
        modelName: 'news',
        modelId: 100}"
      />
    <camera-video
      :config="{
        name: '1-fiador',
        storage: 'news',
        modelName: 'news',
        modelId: 110}"
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
