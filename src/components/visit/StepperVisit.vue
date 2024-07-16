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
        icon="people"
        caption="Cargar datos, videos y fotos"
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
        <p class="text-subtitle1 text-weight-bold text-center">LLENAR LOS SIGUIENTES DATOS:</p>
        <div class="table-container">
          <q-markup-table
            class="markup-table q-mt-md"
            separator="cell"
            dense
          >
            <tbody>
              <tr class="tr-table">
                <td class="td-table">
                  <p class="text-subtitle1 text-weight-bold text-center">Ocupación:</p>
                  <q-icon size="xs" name="edit" />
                  {{ item.occupation }}
                  <q-popup-edit :value="item.occupation" v-slot="scope" buttons
                    @input="val => saveDateNew('occupation', val)">
                    <q-input v-model="scope.value" dense autofocus />
                  </q-popup-edit>
                </td>
              </tr>
              <tr class="tr-table">
                <td class="td-table">
                  <p class="text-subtitle1 text-weight-bold text-center">Cantidad préstamo:</p>
                  <q-icon size="xs" name="edit" />
                  {{ item.quantity }}
                  <q-popup-edit :value="item.quantity" v-slot="scope" buttons
                    @input="val => saveDateNew('quantity', val)">
                    <q-input v-model="scope.value" type="number" dense autofocus />
                  </q-popup-edit>
                </td>
              </tr>
              <tr class="tr-table">
                <td class="td-table">
                  <p class="text-subtitle1 text-weight-bold text-center">Tipo de vivienda:</p>
                  <q-icon size="xs" name="edit" />
                  {{ item.type_house }}
                  <q-popup-edit :value="item.type_house" v-slot="scope" buttons
                    @input="val => saveDateNew('type_house', val)">
                    <q-option-group
                      v-model="scope.value"
                      :options="[
                        {
                          label: 'propia',
                          value: 'propia'
                        },
                        {
                          label: 'arrendada',
                          value: 'arrendada'
                        },
                      ]"
                      color="primary"
                    />
                  </q-popup-edit>
                </td>
              </tr>
              <tr class="tr-table">
                <td class="td-table">
                  <p class="text-subtitle1 text-weight-bold text-center">Tipo de trabajo:</p>
                  <q-icon size="xs" name="edit" />
                  {{ item.type_work }}
                  <q-popup-edit :value="item.type_work" v-slot="scope" buttons
                    @input="val => saveDateNew('type_work', val)">
                    <q-option-group
                      v-model="scope.value"
                      :options="[
                        {
                          label: 'empleado',
                          value: 'empleado'
                        },
                        {
                          label: 'propietario',
                          value: 'propietario'
                        },
                      ]"
                      color="primary"
                    />
                  </q-popup-edit>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <hr>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Siguiente" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="BLOQUE DE DATOS DE REFERENCIA FAMILIAR 1"
        icon="people"
        caption="Cargar datos y video"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of keywords.

        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" label="Siguiente" />
          <q-btn flat @click="step = 1" color="primary" label="Anterior" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="BLOQUE DE DATOS DE REFERENCIA FAMILIAR 2"
        icon="people"
        caption="Cargar datos y video"
        :done="step > 2"
      >
        This step won't show up because it is disabled.
        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Siguiente" />
          <q-btn flat @click="step = 2" color="primary" label="Anterior" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="BLOQUE DE DATOS DE FIADOR"
        icon="people"
        caption="Cargar datos, videos y fotos"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finalizar" />
          <q-btn flat @click="step = 3" color="primary" label="Anterior" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import { showNotifications } from '../../helpers/showNotifications';
import newTypes from '../../store/modules/new/types';
import { showLoading } from '../../helpers/showLoading';

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
    ...mapState(newTypes.PATH, {
      item: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
  },
  async mounted() {
    await this.getItem();
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
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
    async getItem() {
      const { id } = this.$route.params;
      await this.getNew(id);
    },
    async saveDateNew(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const item = { ...this.item };
      item[field] = value.value ? value.value : value;
      await this.completeDataNew(item);
      await this.getItem();
      this.$q.loading.hide();
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
  .table-container {
    text-align: center;
  }
  .markup-table {
    display: block;
    max-width: 640px;
    margin: auto;
    border: solid 1px black;
  }
  .tr-table {
    border-color: black !important;
  }
  .td-table {
    height: 80px;
  }
</style>
