<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            Cuentas autorizadas
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <div class="row">
            <div class="col-12 text-center">
              <q-markup-table
                class="markup-table q-mt-md"
                separator="cell"
                dense
              >
                <tbody>
                  <tr :class="row.account_active === 'principal' ? 'bg-green-4' : ''">
                    <td class="td-table" colspan="2">
                      <b>Cuenta principal</b>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      Número
                    </td>
                    <td class="td-table">
                      Tipo
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      {{ row.account_number }}
                    </td>
                    <td class="td-table">
                      {{ row.account_type }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-markup-table
                v-if="row.account_type_third"
                class="markup-table q-mt-lg"
                separator="cell"
                dense
              >
                <tbody>
                  <tr :class="row.account_active === 'tercero' ? 'bg-green-4' : ''">
                    <td class="td-table" colspan="3">
                      <b>Cuenta de tercero</b>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      Número
                    </td>
                    <td class="td-table">
                      Nombre
                    </td>
                    <td class="td-table">
                      Tipo
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      {{ row.account_number_third }}
                    </td>
                    <td class="td-table">
                      {{ row.account_name_third }}
                    </td>
                    <td class="td-table">
                      {{ row.account_type_third }}
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-markup-table
                class="markup-table q-mt-lg"
                separator="cell"
                dense
              >
                <tbody>
                  <tr class="bg-blue-4">
                    <td class="td-table" colspan="3">
                      <b>Solicitar agregar o cambiar cuenta de tercero</b>
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      Número
                    </td>
                    <td class="td-table">
                      Nombre
                    </td>
                    <td class="td-table">
                      Tipo
                    </td>
                  </tr>
                  <tr class="tr-table">
                    <td class="td-table">
                      <q-icon v-if="!question || (question && question.status !== 'pendiente')" size="xs" name="edit" />
                      {{ accountNumber }}
                      <q-popup-edit :value="accountNumber" v-slot="scope" buttons
                        @input="val => accountNumber = val">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                    <td class="td-table">
                      <q-icon v-if="!question || (question && question.status !== 'pendiente')" size="xs" name="edit" />
                      {{ accountName }}
                      <q-popup-edit :value="accountName" v-slot="scope" buttons
                        @input="val => accountName = val">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </td>
                    <td class="td-table">
                      <q-icon v-if="!question || (question && question.status !== 'pendiente')" size="xs" name="edit" />
                      {{ accountType }}
                      <q-popup-edit :value="accountType" v-slot="scope" buttons
                        @input="val => accountType = val">
                        <q-option-group
                          v-model="scope.value"
                          :options="[
                            {
                              label: 'nequi',
                              value: 'nequi'
                            },
                            {
                              label: 'bancolombia',
                              value: 'bancolombia',
                            },
                            {
                              label: 'ahorro a la mano',
                              value: 'ahorro a la mano',
                            },
                            {
                              label: 'daviplata',
                              value: 'daviplata',
                            },
                          ]"
                          color="primary"
                        />
                      </q-popup-edit>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <div v-if="!question || (question && question.status !== 'pendiente')" class="col-3 is-flex">
                        <div class="div-container">
                          <p class="text-subtitle1 text-weight-bold text-center">VIDEO AUTORIZA CUENTA TERCERO</p>
                          <q-btn
                            v-if="hasFile && hasFile.data && hasFile.data.id && hasPermission('lending.deleteFileAccountThird')"
                            label="Borrar video"
                            color="red"
                            class="col q-my-none"
                            @click="deleteFileVideo()"
                          />
                          <upload-video
                            :config="{
                              name: 'VIDEO_AUTORIZA_CUENTA_TERCERO',
                              storage: 'news',
                              modelName: 'news',
                              modelId: row.id
                            }"
                          />
                        </div>
                        <q-btn
                          label="Enviar solicitud"
                          color="primary"
                          class="col q-my-sm"
                          :disabled="!accountName || !accountNumber || !accountType"
                          @click="saveQuestionAccount(row)"
                        />
                      </div>
                      <div v-else-if="question.status === 'pendiente'" class="col-3 is-flex">
                        <q-btn
                          label="Consultar estado de la solicitud"
                          color="primary"
                          class="col-2"
                          icon="refresh"
                          title="Actualizar el estado de la solicitud de permiso para aumentar el valor del prestamo"
                          @click="getStatusQuestionAccount(row)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import UploadVideo from 'components/common/UploadVideo.vue';
import questionTypes from '../../store/modules/question/types';
import fileTypes from '../../store/modules/file/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      hasFile: false,
      accountNumber: '',
      accountName: '',
      accountType: '',
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      required: false,
    },
  },
  async mounted() {
    await this.getStatusQuestionAccount(this.row);
    this.fetchFile();
  },
  watch: {
  },
  computed: {
    ...mapState(questionTypes.PATH, {
      question: 'question',
      questionStatus: 'status',
      questionResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    ...mapActions(questionTypes.PATH, {
      saveQuestion: questionTypes.actions.SAVE_QUESTION,
      getStatusQuestion: questionTypes.actions.GET_STATUS_QUESTION,
    }),
    ...mapActions(fileTypes.PATH, {
      deleteFile: fileTypes.actions.DELETE_FILE,
      getFile: fileTypes.actions.GET_FILE,
    }),
    hasPermission(value) {
      return havePermission(value);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async fetchFile() {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      const response = await this.getFile({
        name: 'VIDEO_AUTORIZA_CUENTA_TERCERO',
        modelName: 'news',
        modelId: this.row.id,
      });

      this.hasFile = response;
    },
    async saveQuestionAccount(row) {
      console.log(row);
      showLoading('Solicitando ...', 'Por favor, espere', true);
      const value = {
        account_active: 'tercero',
        account_type_third: this.accountType,
        account_number_third: this.accountNumber,
        account_name_third: this.accountName,
      };
      const data = {
        model_id: row.id,
        model_name: 'news',
        area_id: 1, // nequi
        type: 'cuenta',
        status: 'pendiente',
        observation: `Agregar cuenta para el cliente ${row.name}, TIPO: ${value.account_type_third}, NUMERO: ${value.account_number_third}, NOMBRE: ${value.account_name_third}.`,
        value: JSON.stringify(value),
      };
      await this.saveQuestion(data);
      await this.getStatusQuestionAccount(row);
      this.showNotification(this.questionResponseMessages, this.questionStatus, 'top-right', 5000);
      this.showDialog = false;
      this.$q.loading.hide();
    },
    async getStatusQuestionAccount(row) {
      showLoading('Consultando ...', 'Por favor, espere', true);
      const data = {
        model_id: row.id,
        model_name: 'news',
        area_id: 1, // nequi
        type: 'cuenta',
      };
      await this.getStatusQuestion(data);
      if (this.question && this.question.status === 'pendiente') {
        const value = JSON.parse(this.question.value);
        this.accountNumber = value.account_number_third;
        this.accountType = value.account_type_third;
      }
      this.$q.loading.hide();
    },
    async deleteFileVideo() {
      this.$q.dialog({
        title: 'Eliminar video',
        message: 'Está seguro que desea eliminar el video?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Guardando ...', 'Por favor, espere', true);
        this.showDialog = false;
        this.deleteFile(this.hasFile.data.id);
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
  },
  components: {
    UploadVideo,
  },
};
</script>
<style scoped>
  .markup-table {
    display: block;
    border: solid 1px black;
  }
  .markup-table td {
    border: solid 1px black;
  }
</style>
