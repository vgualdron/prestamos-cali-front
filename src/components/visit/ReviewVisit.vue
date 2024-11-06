<template>
  <div class="q-pa-md">
    <q-btn
      round
      icon="west"
      class="q-mr-xs q-mb-md fixed z-index-btn btn-back"
      color="primary"
      @click="$router.go(-1)">
    </q-btn>
    <q-btn
      round
      icon="refresh"
      class="q-ml-sm q-mb-md fixed z-index-btn btn-reload"
      color="primary"
      @click="reloadInfo">
    </q-btn>
    <state-cases v-if="id && showStateCases" :item="item" :id="id" type="review"/>
    <q-card v-if="id" class="q-mt-lg">
      <q-card-section class="row items-center q-pb-none">
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
                    <q-icon size="xs" name="edit" />
                    {{ item.name }}
                    <q-popup-edit :value="item.name" v-slot="scope" buttons
                      @input="val => saveDateNew('name', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Número de doc:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.documentNumber }}
                    <q-popup-edit :value="item.documentNumber" v-slot="scope" buttons
                      @input="val => saveDateNew('document_number', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table" @click="clickEditAddress(item, 'house')">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección casa:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.address_house }}
                    <br><b v-if="item.districtHouseName">Barrio: </b> {{ item.districtHouseName }}
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table" @click="clickEditAddress(item, 'work')">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección trabajo:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.address_work }}
                    <br><b v-if="item.districtWorkName">Barrio: </b> {{ item.districtWorkName }}
                  </td>
                </tr>
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
                    <q-icon size="xs" name="edit" />
                    {{ item.type_house }}
                    <q-popup-edit :value="item.type_house" v-slot="scope" buttons
                      @input="val => saveDateNew('type_house', val)">
                      <q-option-group
                        v-model="scope.value"
                        :options="[
                          {
                            label: 'familiar',
                            value: 'familiar'
                          },
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
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Cantidad préstamo:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.quantity }}
                    <q-popup-edit :value="item.quantity" v-slot="scope" buttons
                      @input="val => saveDateNew('quantity', val)">
                      <q-option-group
                        v-model="scope.value"
                        :options="[
                          {
                            label: '100.000',
                            value: 100000,
                          },
                          {
                            label: '200.000',
                            value: 200000,
                          },
                          {
                            label: '300.000',
                            value: 300000,
                          },
                          {
                            label: '400.000',
                            value: 400000,
                            disable: item.type_work !== 'propietario',
                          },
                          {
                            label: '500.000',
                            value: 500000,
                            disable: item.type_work !== 'propietario',
                          },
                          {
                            label: '600.000',
                            value: 600000,
                            disable: item.type_work !== 'propietario',
                          },
                        ]"
                        color="primary"
                      />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Período:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.period }}
                    <q-popup-edit :value="item.period" v-slot="scope" buttons
                      @input="val => saveDateNew('period', val)">
                      <q-option-group
                        v-model="scope.value"
                        :options="[
                          {
                            label: 'diario',
                            value: 'diario'
                          },
                          {
                            label: 'semanal',
                            value: 'semanal'
                          },
                          {
                            label: 'quincenal',
                            value: 'quincenal'
                          },
                        ]"
                        color="primary"
                      />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Referencia extra:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.extra_reference }}
                    <q-popup-edit :value="item.extra_reference" v-slot="scope" buttons
                      @input="val => saveDateNew('extra_reference', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
          />
        </div>
        <div class="div-container">
          <p class="text-subtitle1 text-weight-bold text-center">FOTO FACEBOOK</p>
          <camera-photo
            :config="{
              name: 'FOTO_FACEBOOK',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="sendNotificationPush"
          />
        </div>
        <div class="div-container" v-if="validatedPermissions.voucher.status && (item.status === 'aprobado' || item.status === 'consignado')">
          <p class="text-subtitle1 text-weight-bold text-center">AGREGAR FOTO VOUCHER</p>
          <camera-photo
            :config="{
              name: 'FOTO_VOUCHER',
              storage: 'news',
              modelName: 'news',
              modelId: id
            }"
            type="read"
            @updateStatus="saveVoucher"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
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
            @updateStatus="sendNotificationPush"
          />
        </div>
      </q-card-section>
    </q-card>
    <form-news
      v-if="showModalFormNews"
      v-model="showModalFormNews"
      :type="typeActionFormNew"
      :obj="objSelected"
      @refreshList="getItem"
    />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import StateCases from 'components/visit/StateCases.vue';
import FormNews from 'components/review/FormNews.vue';
import newTypes from '../../store/modules/new/types';
import notificationTypes from '../../store/modules/notification/types';
import userTypes from '../../store/modules/user/types';
import lendingTypes from '../../store/modules/lending/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      step: 0,
      stepTmp: 0,
      showStateCases: true,
      typeActionFormNew: 'house',
      showModalFormNews: false,
      objSelected: {},
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
    ...mapState(lendingTypes.PATH, {
      lending: 'lending',
      lendings: 'lendings',
      lendingStatus: 'status',
      lendingResponseMessages: 'responseMessages',
    }),
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
  async mounted() {
    await this.getItem();
    if (this.item.diary_status !== 'finalizada') {
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
    ...mapActions(lendingTypes.PATH, {
      addLending: lendingTypes.actions.ADD_LENDING,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    clickEditAddress(row, type) {
      this.typeActionFormNew = type;
      this.objSelected = { ...row };
      this.showModalFormNews = true;
    },
    reloadInfo() {
      showLoading('consultando ...', 'Por favor, espere', true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
      this.showStateCases = false;
      setTimeout(() => {
        this.showStateCases = true;
        this.$q.loading.hide();
      }, 3000);
    },
    async getItem() {
      const { id } = this.$route.params;
      await this.getNew(id);
    },
    async saveVoucher(data) {
      console.log(data);
      await this.saveDateNew('status', 'consignado');
      await this.addLending({
        nameDebtor: this.item.name,
        address: this.item.address,
        phone: this.item.phone,
        amount: this.item.quantity,
        percentage: 32,
        period: this.item.period,
        status: 'open',
        new_id: this.item.id,
        type: 'normal',
      });
    },
    async saveDateNew(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const item = { ...this.item };
      item[field] = value.value ? value.value : value;
      await this.completeDataNew(item);
      await this.getItem();
      this.$q.loading.hide();
    },
    async sendNotificationPush({ name, value }) {
      await this.getItem();
      const players = [this.item.userVisitToken];
      const data = {
        app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
        contents: { en: `Se ha ${value} el archivo ${name} de una visita` },
        headings: { en: 'Haz click aquí y revisa' },
        include_player_ids: players,
        url: `${process.env.URL_FRONT}/visit/${this.id}`,
      };
      await this.sendNotification(data);
      this.reloadStatusFiles();
    },
  },
  components: {
    CameraPhoto,
    CameraVideo,
    StateCases,
    FormNews,
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
  .btn-reload {
    margin-top: -10px;
    margin-left: 80%;
  }
  .btn-back {
    margin-left: -10px;
    margin-top: -10px;
  }
</style>
