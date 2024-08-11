<template>
  <div class="q-pa-md">
    <q-btn
      round
      icon="refresh"
      class="q-ml-xl q-mb-md fixed z-index-btn"
      color="primary"
      @click="reloadStatusFiles">
    </q-btn>
    <q-btn
      round
      icon="west"
      class="q-mr-xs q-mb-md fixed z-index-btn"
      color="primary"
      @click="$router.go(-1)">
    </q-btn>
    <TableInfoVisit class="q-mt-xl" :item="item"/>
    <q-stepper
      v-if="id > 0"
      v-model="step"
      color="primary"
      class="q-mt-md"
      ref="stepper"
      animated
      vertical
      header-nav
    >
      <template v-slot:message>
        <q-stepper-navigation class="text-center q-mb-xl">
          <q-btn
            v-if="step < 4 && step > 0"
            @click="$refs.stepper.next()"
            color="primary"
            icon="chevron_right"
            class="float-right"/>
          <q-btn
            v-if="step == 0"
            @click="$refs.stepper.next()"
            color="primary"
            label="Iniciar"
            class=""/>
          <q-btn
            v-if="step > 1"
            color="primary"
            @click="$refs.stepper.previous()"
            icon="chevron_left"
            class="float-left"
            outline />
        </q-stepper-navigation>
      </template>
      <q-step
        :name="1"
        title="DATOS DE CLIENTE"
        prefix="1"
        caption="Cargar datos, videos y fotos"
        :done="step > 1"
       >
        <div class="block-container">
          <div class="div-container">
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
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Dirección casa:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.address_house }}
                      <q-popup-edit :value="item.address_house" v-slot="scope" buttons
                        @input="val => saveDateNew('address_house', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Dirección trabajo:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.address_work }}
                      <q-popup-edit :value="item.address_work" v-slot="scope" buttons
                        @input="val => saveDateNew('address_work', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
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
              @savedFile="savedFileCasaCliente({ name: 'FOTO_CASA_CLIENTE' })"
            />
          </div>
          <div class="div-container">
            <p class="text-subtitle1 text-weight-bold text-center">VIDEO TOCANDO CASA CLIENTE</p>
            <camera-video
              :config="{
                name: 'VIDEO_TOCANDO_CASA_CLIENTE',
                storage: 'news',
                modelName: 'news',
                modelId: id
              }"
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="DATOS DE REFERENCIA FAMILIAR 1"
        prefix="2"
        caption="Cargar datos y video"
        :done="step > 2"
      >
      <div class="block-container">
        <div class="div-container">
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
                    <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.family_reference_name }}
                    <q-popup-edit :value="item.family_reference_name" v-slot="scope" buttons
                      @input="val => saveDateNew('family_reference_name', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.family_reference_address }}
                    <q-popup-edit :value="item.family_reference_address" v-slot="scope" buttons
                      @input="val => saveDateNew('family_reference_address', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.family_reference_phone }}
                    <q-popup-edit :value="item.family_reference_phone" v-slot="scope" buttons
                      @input="val => saveDateNew('family_reference_phone', val)">
                      <q-input v-model="scope.value" type="number" dense autofocus />
                    </q-popup-edit>
                  </td>
                </tr>
                <tr class="tr-table">
                  <td class="td-table">
                    <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                    <q-icon size="xs" name="edit" />
                    {{ item.family_reference_relationship }}
                    <q-popup-edit :value="item.family_reference_relationship" v-slot="scope" buttons
                      @input="val => saveDateNew('family_reference_relationship', val)">
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
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
            @savedFile="sendNotificationPush"
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
            @savedFile="sendNotificationPush"
          />
        </div>
      </div>
      </q-step>

      <q-step
        :name="3"
        title="DATOS DE REFERENCIA FAMILIAR 2"
        prefix="3"
        caption="Cargar datos y video"
        :done="step > 3"
      >
        <div class="block-container">
          <div class="div-container">
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
                      <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.family2_reference_name }}
                      <q-popup-edit :value="item.family2_reference_name" v-slot="scope" buttons
                        @input="val => saveDateNew('family2_reference_name', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.family2_reference_address }}
                      <q-popup-edit :value="item.family2_reference_address" v-slot="scope" buttons
                        @input="val => saveDateNew('family2_reference_address', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.family2_reference_phone }}
                      <q-popup-edit :value="item.family2_reference_phone" v-slot="scope" buttons
                        @input="val => saveDateNew('family2_reference_phone', val)">
                        <q-input v-model="scope.value" type="number" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.family2_reference_relationship }}
                      <q-popup-edit :value="item.family2_reference_relationship" v-slot="scope" buttons
                        @input="val => saveDateNew('family2_reference_relationship', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
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
            @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="4"
        title="DATOS DE FIADOR"
        prefix="4"
        caption="Cargar datos, videos y fotos"
        :done="step > 4"
       >
        <div class="block-container">
          <div class="div-container">
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
                      <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.guarantor_name }}
                      <q-popup-edit :value="item.guarantor_name" v-slot="scope" buttons
                        @input="val => saveDateNew('guarantor_name', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Dirección:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.guarantor_address }}
                      <q-popup-edit :value="item.guarantor_address" v-slot="scope" buttons
                        @input="val => saveDateNew('guarantor_address', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Teléfono:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.guarantor_phone }}
                      <q-popup-edit :value="item.guarantor_phone" v-slot="scope" buttons
                        @input="val => saveDateNew('guarantor_phone', val)">
                        <q-input v-model="scope.value" type="number" dense autofocus />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <p class="text-subtitle1 text-weight-bold text-center">Parentesco:</p>
                      <q-icon size="xs" name="edit" />
                      {{ item.guarantor_relationship }}
                      <q-popup-edit :value="item.guarantor_relationship" v-slot="scope" buttons
                        @input="val => saveDateNew('guarantor_relationship', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
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
              @savedFile="sendNotificationPush"
            />
          </div>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="text-center q-mb-xl">
          <q-btn
            v-if="step < 4 && step > 0"
            @click="$refs.stepper.next()"
            color="primary"
            icon="chevron_right"
            class="float-right"/>
          <q-btn
            v-if="step == 0"
            @click="$refs.stepper.next()"
            color="primary"
            label="Iniciar"
            class=""/>
          <q-btn
            v-if="step > 1"
            color="primary"
            @click="$refs.stepper.previous()"
            icon="chevron_left"
            class="float-left"
            outline />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import TableInfoVisit from 'components/visit/TableInfoVisit.vue';
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
      users: 'users',
    }),
  },
  async mounted() {
    this.listUsersReviews();
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
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async listUsersReviews() {
      await this.listUsersByNameRole({
        roleName: 'Revisor de datos visita',
        status: 1,
        // city: localStorage.getItem('cityMC'),
        city: 0,
      });
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
      await this.sendNotificationPush({ name: 'DATOS' });
      this.$q.loading.hide();
    },
    async savedFileCasaCliente(name) {
      console.log('saved filed casa cliente');
      this.sendNotificationPush({ name });
      if (!this.item.visit_start_date) {
        await this.saveDateNew('visit_start_date', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      }
    },
    async sendNotificationPush({ name }) {
      await this.listUsersReviews();
      const players = this.users.map((user) => user.pushToken);
      const data = {
        app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
        headings: { en: `Se ha cargado ${name} para una visita` },
        contents: { en: 'Haz click aquí y revisa' },
        include_player_ids: players,
        url: `${process.env.URL_FRONT}/review-visit/${this.id}`,
      };
      await this.sendNotification(data);
    },
  },
  components: {
    CameraPhoto,
    CameraVideo,
    TableInfoVisit,
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
    padding: 0px;
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
  .q-stepper__step-inner {
    padding: 0 24px 32px 33px !important;
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
  .block-container {
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    margin-left: -30px;
  }
  [role="tabpanel"] > div {
    padding: 12px;
  }
</style>
