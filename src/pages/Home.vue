<template>
  <q-page class="">
    <home />
    <div class="row">
      <div class="col-12 text-center">
        <q-btn
          label="Agregar"
          color="primary"
          icon="camera"
          ref="camera"
          @click="showModalCamera = true" />
      </div>
    </div>
    <camera
      v-if="showModalCamera"
      v-model="showModalCamera"
      />
  </q-page>
</template>

<script>
import Home from 'components/home/Home.vue';
import Camera from 'components/common/Camera.vue';

export default {
  components: { Home, Camera },
  data() {
    return {
      showModalCamera: false,
    };
  },
  name: 'PageHome',
  computed: {
  },
};
</script>
