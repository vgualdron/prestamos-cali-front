<template>
  <div class="q-pa-md">
    <q-card v-if="id" class="q-mt-lg">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">DATOS DE CLIENTE</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll flex">
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">DATOS:</p>
          <div class="table-container">
            <q-markup-table
              class="markup-table q-mt-md"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                    {{ item.name }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Número de doc:</p>
                    {{ item.documentNumber }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Ocupación:</p>
                    {{ item.occupation }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Tipo de vivienda:</p>
                    {{ item.type_house }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Tipo de trabajo:</p>
                    {{ item.type_work }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Cantidad préstamo:</p>
                    {{ item.quantity }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Período:</p>
                    {{ item.period }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_CASA_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CASA_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">VIDEO TOCANDO CASA CLIENTE</p>
          <camera-video
            :config="{
              name: 'VIDEO_TOCANDO_CASA_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('VIDEO_TOCANDO_CASA_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE FRONTAL</p>
          <camera-photo
            :config="{
              name: 'FOTO_CEDULA_CLIENTE_FRONTAL',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CEDULA_CLIENTE_FRONTAL')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE POSTERIOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_CEDULA_CLIENTE_POSTERIOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CEDULA_CLIENTE_POSTERIOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO LETRA CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_LETRA_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_LETRA_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO FIRMANDO LETRA CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_FIRMANDO_LETRA_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_FIRMANDO_LETRA_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CERTIFICADO DE TRABAJO CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_CERTIFICADO_TRABAJO_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CERTIFICADO_TRABAJO_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO RECIBO CASA CLIENTE</p>
          <camera-photo
            :config="{
              name: 'FOTO_RECIBO_CASA_CLIENTE',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_RECIBO_CASA_CLIENTE')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO FACEBOOK</p>
          <camera-photo
            :config="{
              name: 'FOTO_FACEBOOK',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_FACEBOOK')"
          />
        </div>
      </q-card-section>
    </q-card>
    <br><hr>
    <q-card v-if="id" class="q-mt-lg">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">DATOS DE REFERENCIA FAMILIAR 1</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll flex">
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">DATOS:</p>
          <div class="table-container">
            <q-markup-table
              class="markup-table q-mt-md"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                    {{ item.family_reference_name }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                    {{ item.family_reference_address }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                    {{ item.family_reference_phone }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                    {{ item.family_reference_relationship }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">VIDEO REFERENCIA FAMILIAR 1</p>
          <camera-video
            :config="{
              name: 'VIDEO_REFERENCIA_FAMILIAR_1',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('VIDEO_REFERENCIA_FAMILIAR_1')"
          />
        </div>
      </q-card-section>
    </q-card>
    <br><hr>
    <q-card v-if="id" class="q-mt-lg">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">DATOS DE REFERENCIA FAMILIAR 2</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll flex">
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">DATOS:</p>
          <div class="table-container">
            <q-markup-table
              class="markup-table q-mt-md"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                    {{ item.family2_reference_name }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                    {{ item.family2_reference_address }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                    {{ item.family2_reference_phone }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                    {{ item.family2_reference_relationship }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">VIDEO REFERENCIA FAMILIAR 2</p>
          <camera-video
            :config="{
              name: 'VIDEO_REFERENCIA_FAMILIAR_2',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('VIDEO_REFERENCIA_FAMILIAR_2')"
          />
        </div>
      </q-card-section>
    </q-card>
    <br><hr>
    <q-card v-if="id" class="q-mt-lg">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">DATOS DE FIADOR</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll flex">
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">DATOS:</p>
          <div class="table-container">
            <q-markup-table
              class="markup-table q-mt-md"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                    {{ item.guarantor_name }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                    {{ item.guarantor_address }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                    {{ item.guarantor_phone }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                    {{ item.guarantor_relationship }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_CASA_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CASA_FIADOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_FIADOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FIADOR FRONTAL</p>
          <camera-photo
            :config="{
              name: 'FOTO_CEDULA_FIADOR_FRONTAL',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CEDULA_FIADOR_FRONTAL')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FIADOR POSTERIOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_CEDULA_FIADOR_POSTERIOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CEDULA_FIADOR_POSTERIOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO LETRA FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_LETRA_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_LETRA_FIADOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO FIRMANDO LETRA FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_FIRMANDO_LETRA_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_FIRMANDO_LETRA_FIADOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO CERTIFICADO DE TRABAJO FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_CERTIFICADO_TRABAJO_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_CERTIFICADO_TRABAJO_FIADOR')"
          />
        </div>
        <div style="width: fit-content;">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO RECIBO CASA FIADOR</p>
          <camera-photo
            :config="{
              name: 'FOTO_RECIBO_CASA_FIADOR',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush('FOTO_RECIBO_CASA_FIADOR')"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
// import TableInfoVisit from 'components/visit/TableInfoVisit.vue';
import { showNotifications } from '../../helpers/showNotifications';
import newTypes from '../../store/modules/new/types';
import notificationTypes from '../../store/modules/notification/types';
import userTypes from '../../store/modules/user/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      step: 0,
      stepTmp: 0,
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
    ...mapState(userTypes.PATH, {
      user: 'user',
      users: 'users',
    }),
  },
  async mounted() {
    await this.getItem();
    if (this.item.status !== 'aprobado') {
      await this.updateStatusNew({
        ...this.item,
        status: 'visitando',
      });
    }
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    ...mapActions(userTypes.PATH, {
      getUser: userTypes.actions.GET_USER,
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
    reloadStatusFiles() {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      this.stepTmp = this.step;
      this.step = 0;
      setTimeout(() => {
        this.$q.loading.hide();
        this.step = this.stepTmp;
      }, 3000);
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
    async sendNotificationPush(name) {
      await this.getItem();
      const players = [this.item.userVisitToken];
      const data = {
        app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
        headings: { en: 'Se ha actualizado el estado un archivo' },
        contents: { en: `Haz click aquí y revisa el estado del archivo ${name}` },
        include_player_ids: players,
        url: `${process.env.URL_FRONT}/visit/${this.id}`,
      };
      await this.sendNotification(data);
    },
  },
  components: {
    CameraPhoto,
    CameraVideo,
    // TableInfoVisit,
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
  .z-index-btn {
    z-index: 20;
  }
  .q-card__section > .text-h6 {
    border: none;
  }
  .q-card__section > div {
    border: solid 1px rgb(145, 140, 140);
    margin: 10px;
    padding: 15px;
    border-radius: 10px;
  }
</style>
