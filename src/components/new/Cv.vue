<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      full-width
    >
      <q-card>
        <q-card-section class="row q-pb-none">
          <div class="text-h6">HOJA DE VIDA</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-pb-none">
          <q-card v-if="id" class="q-mt-lg">
            <q-card-section class="row q-pb-none">
              <div class="text-h6">DATOS DE CLIENTE</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll flex">
              <div class="div-container">
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
                          <p class="text-subtitle1 text-weight-bold text-center">Dirección de casa:</p>
                          {{ item.address_house }}
                        </td>
                      </tr>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Dirección de trabajo:</p>
                          {{ item.address_work }}
                        </td>
                      </tr>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Ocupación:</p>
                          {{ item.occupation }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
              <div class="div-container">
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
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Referencia Extra:</p>
                          {{ item.extra_reference }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">DATOS DE CUENTA:</p>
                <div class="table-container">
                  <q-markup-table
                    class="markup-table q-mt-md"
                    separator="cell"
                    dense
                  >
                    <tbody>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Tipo de cuenta:</p>
                          {{ item.account_type }}
                        </td>
                      </tr>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Número de cuenta:</p>
                          {{ item.account_number }}
                        </td>
                      </tr>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Tipo de cuenta de tercero:</p>
                          {{ item.account_type_third }}
                        </td>
                      </tr>
                      <tr class="tr-table">
                        <td class="td-table">
                          <p class="text-subtitle1 text-weight-bold text-center">Número de cuenta:</p>
                          {{ item.account_number_third }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CASA_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="wrap-text text-subtitle1 text-weight-bold text-center">VIDEO TOCANDO CASA CLIENTE</p>
                <camera-video
                  :config="{
                    name: 'VIDEO_TOCANDO_CASA_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE FRONTAL</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_CLIENTE_FRONTAL',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA CLIENTE POSTERIOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_CLIENTE_POSTERIOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO LETRA CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_LETRA_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO FIRMANDO LETRA CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_FIRMANDO_LETRA_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CERTIFICADO DE TRABAJO CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CERTIFICADO_TRABAJO_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO RECIBO CASA CLIENTE</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_RECIBO_CASA_CLIENTE',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO RED SOCIAL</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_RED_SOCIAL',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">VIDEO AUTORIZA CUENTA TERCERO</p>
                <camera-video
                  :config="{
                    name: 'VIDEO_AUTORIZA_CUENTA_TERCERO',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container" v-if="validatedPermissions.voucher.status && (item.status === 'aprobado' || item.status === 'consignado')">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO VOUCHER</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_VOUCHER',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-card v-if="id" class="q-mt-lg">
            <q-card-section class="row q-pb-none">
              <div class="text-h6">DATOS DE REFERENCIA FAMILIAR 1</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll flex">
              <div class="div-container">
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
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA REF FAMILIAR 1</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CASA_REFERENCIA_FAMILIAR_1',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">VIDEO REFERENCIA FAMILIAR 1</p>
                <camera-video
                  :config="{
                    name: 'VIDEO_REFERENCIA_FAMILIAR_1',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FRONTAL REF FAMILIAR 1</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_FRONTAL_REFERENCIA_FAMILIAR_1',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA POSTERIOR REF FAMILIAR 1</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_POSTERIOR_REFERENCIA_FAMILIAR_1',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-card v-if="id" class="q-mt-lg">
            <q-card-section class="row q-pb-none">
              <div class="text-h6">DATOS DE REFERENCIA FAMILIAR 2</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll flex">
              <div class="div-container">
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
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA REF FAMILIAR 2</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CASA_REFERENCIA_FAMILIAR_2',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">VIDEO REFERENCIA FAMILIAR 2</p>
                <camera-video
                  :config="{
                    name: 'VIDEO_REFERENCIA_FAMILIAR_2',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FRONTAL REF FAMILIAR 2</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_FRONTAL_REFERENCIA_FAMILIAR_2',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA POSTERIOR REF FAMILIAR 2</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_POSTERIOR_REFERENCIA_FAMILIAR_2',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-card v-if="id" class="q-mt-lg">
            <q-card-section class="row q-pb-none">
              <div class="text-h6">DATOS DE FIADOR</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="scroll flex">
              <div class="div-container">
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
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CASA FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CASA_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FIADOR FRONTAL</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_FIADOR_FRONTAL',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CEDULA FIADOR POSTERIOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CEDULA_FIADOR_POSTERIOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO LETRA FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_LETRA_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO FIRMANDO LETRA FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_FIRMANDO_LETRA_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO CERTIFICADO DE TRABAJO FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_CERTIFICADO_TRABAJO_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
              <div class="div-container">
                <p class="text-subtitle1 text-weight-bold text-center">FOTO RECIBO CASA FIADOR</p>
                <camera-photo
                  :config="{
                    name: 'FOTO_RECIBO_CASA_FIADOR',
                    storage: 'news',
                    modelName: 'news',
                    modelId: id
                  }"
                  type="read"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import newTypes from '../../store/modules/new/types';
import userTypes from '../../store/modules/user/types';
import { showNotifications } from '../../helpers/showNotifications';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      step: 0,
      stepTmp: 0,
      showStateCases: true,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
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
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    validatedPermissions() {
      const statusReview = havePermission('visit.review');
      const statusVoucher = havePermission('visit.voucher');
      return {
        review: {
          title: statusReview ? 'Revisar visita' : 'No tiene permisos para revisar visitas',
          status: statusReview,
        },
        voucher: {
          title: statusVoucher ? 'Agregar voucher' : 'No tiene permisos para agregar voucher',
          status: statusVoucher,
        },
      };
    },
  },
  async created() {
    await this.getItem();
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
    }),
    ...mapActions(userTypes.PATH, {
      getUser: userTypes.actions.GET_USER,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
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
      await this.getNew(this.id);
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
    max-width: 250px;
    min-width: 250px;
    margin: auto;
  }
  .z-index-btn {
    z-index: 20;
  }
  .q-card__section > .text-h6 {
    border: none;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .div-container {
    border: solid 1px rgb(145, 140, 140);
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    width: 300px;
  }
  .q-banner {
    display: none !important;
  }
</style>
