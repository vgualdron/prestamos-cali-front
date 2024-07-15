<template>
  <div class="q-pa-md">
    <q-stepper
      v-if="id > 0"
      v-model="step"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="BLOQUE DE DATOS DE CLIENTE"
        icon="settings"
        :done="step > 1"
      >
        <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA CLIENTE</p>
        <camera-photo
          :config="{
            name: 'FOTO_CASA_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">VIDEO TOCANDO CASA CLIENTE</p>
        <camera-video
          :config="{
            name: 'VIDEO_TOCANDO_CASA_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO CLIENTE</p>
        <camera-photo
          :config="{
            name: 'FOTO_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE FRONTAL</p>
        <camera-photo
          :config="{
            name: 'FOTO_CEDULA_CLIENTE_FRONTAL',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE POSTERIOR</p>
        <camera-photo
          :config="{
            name: 'FOTO_CEDULA_CLIENTE_POSTERIOR',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO LETRA</p>
        <camera-photo
          :config="{
            name: 'FOTO_LETRA',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO FIRMANDO LETRA CLIENTE</p>
        <camera-photo
          :config="{
            name: 'FOTO_FIRMANDO_LETRA_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO CERTIFICADO DE TRABAJO CLIENTE</p>
        <camera-photo
          :config="{
            name: 'FOTO_CERTIFICADO_TRABAJO_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <p class="text-subtitle1 text-weight-bold text-center">FOTO RECIBO CASA CLIENTE</p>
        <camera-photo
          :config="{
            name: 'FOTO_RECIBO_CASA_CLIENTE',
            storage: 'news',
            modelName: 'news',
            modelId: id
          }"
          @savedFile="savedFile"
        />
        <hr>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Siguiente" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of keywords.

        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Siguiente" />
          <q-btn flat @click="step = 1" color="primary" label="Anterior" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
      >
        This step won't show up because it is disabled.
      </q-step>

      <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finalizar" />
          <q-btn flat @click="step = 2" color="primary" label="Anterior" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>
<script>
import moment from 'moment';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import { showNotifications } from '../../helpers/showNotifications';
// import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      step: 1,
    };
  },
  props: {
    id: {
      require: true,
    },
  },
  computed: {
  },
  methods: {
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDateToDay(date) {
      moment.locale('es');
      return moment(date).format('dddd');
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatHour(date) {
      return moment(date).format('hh:mm A');
    },
    savedFile(value) {
      console.log(value);
    },
  },
  components: {
    CameraPhoto,
    CameraVideo,
  },
};
</script>
<style scoped>
  p {
    display: block;
    max-width: 640px;
    margin: auto;
  }
</style>
