<template>
  <q-page class="q-pa-md">
    <q-select
      v-model="selectedDeviceId"
      :options="videoInputDevices"
      label="Select Camera"
      option-value="deviceId"
      option-label="label"
      @input="openCamera"
      color="primary"
    />
    <q-btn label="Open Camera" @click="openCamera" color="primary" />
    <video v-if="showVideo" ref="video" autoplay class="q-mt-md"></video>
    <canvas ref="canvas" style="display:none;"></canvas>
    <img v-if="photo" :src="photo" alt="Captured Photo" class="q-mt-md" />
    <q-btn v-if="showVideo" label="Capture Photo" @click="capturePhoto" color="secondary" class="q-mt-md" />
  </q-page>
</template>

<script>
export default {
  name: 'CameraPage',
  data() {
    return {
      videoInputDevices: [],
      selectedDeviceId: null,
      showVideo: false,
      photo: null,
    };
  },
  async mounted() {
    await this.getVideoInputDevices();
  },
  methods: {
    async getVideoInputDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
        if (this.videoInputDevices.length > 0) {
          this.selectedDeviceId = this.videoInputDevices[0].deviceId;
          this.openCamera(this.selectedDeviceId);
        }
      } catch (error) {
        console.error('Error fetching video input devices', error);
      }
    },
    stopVideo() {
      const { video } = this.$refs;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      this.showVideo = false;
    },
    async openCamera(deviceId) {
      try {
        if (this.showVideo) {
          this.stopVideo();
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
        this.showVideo = true;
        this.$refs.video.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    },
    capturePhoto() {
      const { video, canvas } = this.$refs;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.photo = canvas.toDataURL('image/png');
      this.stopVideo();
    },
  },
};
</script>
<style scoped>
  video {
    width: 100%;
    max-width: 300px;
  }
  img {
    width: 100%;
    max-width: 300px;
  }
</style>
