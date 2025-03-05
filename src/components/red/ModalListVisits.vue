<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Lista de visitas</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll">
          <div class="text-center w-100">
            <q-markup-table
              v-if="items && items.length > 0"
              class="markup-table"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="">
                  <td class="td-table">
                    <b>FINALIZAR</b>
                  </td>
                  <td class="td-table">
                    <b>FECHAS</b>
                  </td>
                  <td class="td-table">
                    <b>DIRECCIÓN</b>
                  </td>
                  <td class="td-table">
                    <b>REF</b>
                  </td>
                  <td class="td-table">
                    <b>COBRADOR</b>
                  </td>
                  <td class="td-table">
                    <b>QUIEN ABRIÓ</b>
                  </td>
                  <td class="td-table">
                    <b>QUE PASÓ</b>
                  </td>
                  <td class="td-table">
                    <b>OBSERVACIÓN</b>
                  </td>
                  <td class="td-table">
                    <b>FOTO CASA</b>
                  </td>
                  <td class="td-table">
                    <b>FOTO SOLUCIÓN</b>
                  </td>
                  <td class="td-table">
                    <b>VIDEO</b>
                  </td>
                </tr>
                <tr :class="getRowClass(item)" v-for="item in items" :key="`tr_td_${item.id}`">
                  <td class="td-table wrap-text">
                    <q-btn
                      v-if="item.status === 'activo' && showEndVist"
                      round
                      icon="do_not_touch"
                      class="q-ml-none"
                      color="primary"
                      title="Click para finalizar"
                      @click="endVisit(item)">
                    </q-btn>
                  </td>
                  <td class="td-table wrap-text text-left">
                    <div>
                      <b>ASIGNADO:</b> {{ formatDate(item.registered_date) }}
                    </div>
                    <div>
                      <b>INICIO:</b> {{ formatDate(item.start_date) }}
                    </div>
                    <div v-if="item.end_date">
                      <b>FIN:</b> {{ formatDate(item.end_date) }}
                    </div>
                    <div v-else>
                      {{ formatDate(nowDate()) }}
                    </div>
                    <b v-if="item.end_date">
                      {{ calculateTimeDifference(item.start_date, item.end_date) }}
                    </b>
                    <b v-else>
                      {{ calculateTimeDifference(item.start_date, nowDate()) }}
                    </b>
                  </td>
                  <td class="td-table wrap-text">
                    {{ item.address }}, {{ item.district_name }}, {{ item.sector_name }}
                  </td>
                  <td class="td-table">
                    {{ item.description_ref }}
                  </td>
                  <td class="td-table">
                    {{ item.collector_name }}
                  </td>
                  <td class="td-table">
                    {{ item.attended }}
                  </td>
                  <td class="td-table">
                    {{ item.solution }}
                  </td>
                  <td class="td-table wrap-text">
                    {{ item.observation }}
                  </td>
                  <td class="td-table">
                    <camera-photo
                      :config="{
                        name: 'FOTO_CASA_REDDIRECTION',
                        storage: 'reddirections',
                        modelName: 'reddirections',
                        modelId: item.id
                      }"
                      type="read"
                      :showApprove="false"
                    />
                  </td>
                  <td class="td-table">
                    <q-btn
                      v-if="item.file2_url"
                      color="primary"
                      icon="photo"
                      class=""
                      @click="getUrlFile(item, 'file2_url')" />
                    <camera-photo
                      :config="{
                        name: 'FOTO_AVISO_REDDIRECTION',
                        storage: 'reddirections',
                        modelName: 'reddirections',
                        modelId: item.id
                      }"
                      type="read"
                      :showApprove="false"
                    />
                  </td>
                  <td class="td-table">
                    <camera-video
                      :config="{
                        name: 'VIDEO_SOLUCION_REDDIRECTION',
                        storage: 'reddirections',
                        modelName: 'reddirections',
                        modelId: item.id
                      }"
                      type="read"
                      :showApprove="false"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-banner v-else class="bg-primary text-white w-100">
              No se han realizado ninguna visita de cobro al cliente.
            </q-banner>
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </q-dialog>
    <modal-preview-file
      v-if="showModalPreview"
      v-model="showModalPreview"
      :url="urlFile"
      type="image"
      :showBtnCancel="false"/>
    <modal-preview-file
      v-if="showModalPreviewVideo"
      v-model="showModalPreviewVideo"
      :url="urlFile"
      type="video"
      :showBtnCancel="false"/>
  </div>
</template>
<script>
import moment from 'moment';
import ModalPreviewFile from 'components/common/ModalPreviewFile.vue';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
      showModalPreview: false,
      showModalPreviewVideo: false,
      urlFile: '',
    };
  },
  components: {
    ModalPreviewFile,
    CameraPhoto,
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
    showEndVist: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    nowDate() {
      return moment();
    },
    getRowClass(row) {
      console.log(row);
      let c = 'bg-white';
      if (row.start_date && this.isToday(row.start_date) && row.status === 'activo') {
        c = 'bg-blue-2';
      } else if (row.start_date && this.isToday(row.start_date) && row.status === 'finalizado') {
        c = 'bg-orange-2';
      }
      return c;
    },
    calculateTimeDifference(startDate, endDate) {
      if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
        return { error: 'Invalid dates' };
      }

      const start = moment(startDate);
      const end = moment(endDate);

      const duration = moment.duration(end.diff(start));

      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      return `${hours}h:${minutes}m:${seconds}s`;
    },
    endVisit(item) {
      this.$emit('endVisit', item);
    },
    onSavedFile(value) {
      this.$emit('savedFile', value);
      this.showDialog = false;
    },
    getUrlFile(row, field) {
      this.urlFile = `${process.env.URL_FILES}${row[field]}`;
      this.showModalPreview = true;
    },
    getUrlFileVideo(row, field) {
      this.urlFile = `${process.env.URL_FILES}${row[field]}`;
      this.showModalPreviewVideo = true;
    },
    isToday(date) {
      return moment(date).isSame(moment(), 'day');
    },
  },
};
</script>
<style scoped>
  .inherit-width {
    width: inherit;
  }
  .markup-table {
    display: block;
    border: solid 1px black;
    width: 100%;
  }
  .markup-table td {
    border: solid 1px black;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    max-width: 300px;
  }
</style>
