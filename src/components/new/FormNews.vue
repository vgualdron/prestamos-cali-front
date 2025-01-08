<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      @hide="hideModal"
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
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
        <q-card-section
          style="max-height: 60vh"
          class="scroll"
        >
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model.trim="user.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.phone"
              label="Teléfono *"
              lazy-rules
              type="number"
              :rules="rules.phone"
              :disable="disableInputs"
              hide-bottom-space
              autocomplete="off"
            />
            <q-select
              v-model="user.city"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Ciudad *"
              :disable="disableInputs"
              :options="optionsZones"
              option-label="name"
              option-value="id"
              @filter="filterCities"
              @input="changeCity"
              lazy-rules
              :rules="rules.city"
              hide-bottom-space
              map-options
              emit-value
              autocomplete="off"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-if="type !== 'V'"
              v-model="user.sector"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Sector *"
              :disable="disableInputs"
              :options="optionsYards"
              option-label="name"
              option-value="id"
              @filter="filterSectors"
              @input="changeSector"
              lazy-rules
              :rules="rules.sector"
              hide-bottom-space
              map-options
              emit-value
              autocomplete="off"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-if="type !== 'V'"
              v-model="user.district"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Barrio *"
              :disable="disableInputs"
              :options="optionsDistricts"
              option-label="name"
              option-value="id"
              @filter="filterDistricts"
              lazy-rules
              :rules="rules.district"
              hide-bottom-space
              map-options
              emit-value
              autocomplete="off"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              v-if="type !== 'V'"
              outlined
              v-model.trim="user.address"
              label="Dirección *"
              lazy-rules
              :rules="rules.address"
              :disable="disableInputs"
              hide-bottom-space
              autocomplete="off"
            />
            <q-input
              v-if="type !== 'V'"
              outlined
              v-model.trim="user.occupation"
              label="Ocupación *"
              lazy-rules
              :rules="rules.occupation"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-select
              v-if="type !== 'V'"
              v-show="showUserSend"
              v-model="user.userSend"
              class="q-mt-md"
              use-input
              clearable
              outlined
              input-debounce="0"
              label="Enviado por"
              :disable="disableInputs"
              :options="optionsUsers"
              option-label="name"
              option-value="id"
              @filter="filterUsers"
              lazy-rules
              hide-bottom-space
              map-options
              emit-value
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-separator />
            <div v-if="type !== 'V'" class="row text-center">
              <q-btn label="cancelar"
                type="reset"
                color="primary"
                outline class="col"
                v-close-popup
                @click="showDialog = false"
              />
              <q-btn
                label="Aceptar"
                type="submit"
                color="primary"
                class="col q-ml-sm"
              />
            </div>
          </q-form>
          <q-btn
            v-if="question.status === 'aprobado' && type === 'V'"
            label="Autorizado, haz click para guardar y continuar con el proceso"
            color="green"
            class="col q-ml-sm q-mt-sm"
            @click="onSubmitQuestion('save')"
          />
          <q-btn
            v-if="question.status === 'pendiente' && type === 'V'"
            label="Pendiente de autorización, haz click para cerrar el cuadro"
            color="orange"
            class="col q-ml-sm q-mt-sm"
            @click="onSubmitQuestion('close')"
          />
          <q-btn
            v-if="question.status === 'rechazado' && type === 'V'"
            label="No fué autorizado, haz click para eliminar el registro"
            color="red"
            class="col q-ml-sm q-mt-sm"
            @click="onSubmitQuestion('delete')"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import newTypes from '../../store/modules/new/types';
import userTypes from '../../store/modules/user/types';
import zoneTypes from '../../store/modules/zone/types';
import yardTypes from '../../store/modules/yard/types';
import districtTypes from '../../store/modules/district/types';
import questionTypes from '../../store/modules/question/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      title: '',
      isLoading: false,
      optionsYards: [],
      optionsUsers: [],
      optionsZones: [],
      optionsDistricts: [],
      user: {
        id: null,
        documentNumber: null,
        name: '',
        address: '',
        phone: '',
        city: null,
        sector: null,
        district: null,
        occupation: '',
        userSend: null,
        observation: '',
        status: 'borrador',
      },
      copyUser: {
        id: null,
        documentNumber: null,
        name: '',
        address: '',
        phone: '',
        city: null,
        sector: null,
        district: null,
        occupation: '',
        userSend: null,
        observation: '',
        status: 'borrador',
      },
      rules: {
        documentNumber: [
          (val) => (!!val) || 'El campo de documento es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El campo debe tener un máximo de 15 caracteres',
        ],
        name: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 50) || 'El campo debe tener un máximo de 50 caracteres',
        ],
        phone: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El campo debe tener un máximo de 15 caracteres',
        ],
        address: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
        ],
        city: [
          (val) => (!!val) || 'El campo es requerido',
        ],
        sector: [
          (val) => (!!val) || 'El campo es requerido',
        ],
        district: [
          (val) => (!!val) || 'El campo es requerido',
        ],
        occupation: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 3) || 'El campo debe tener un mínimo de 3 caracteres',
        ],
      },
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    obj: {
      type: Object,
    },
    type: {
      type: String,
    },
    userSend: {
      require: false,
    },
    showUserSend: {
      type: Boolean,
      default: true,
      require: false,
    },
  },
  async mounted() {
    await this.initData();
  },
  watch: {
    yards(val) {
      this.optionsYards = [...val];
    },
    zones(val) {
      this.optionsZones = [...val];
    },
    districts(val) {
      this.optionsDistricts = [...val.filter((district) => district.sector === this.user.sector)];
    },
    users(val) {
      this.optionsUsers = [...val];
    },
  },
  computed: {
    ...mapState(newTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
    }),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(districtTypes.PATH, {
      districts: 'districts',
      districtStatus: 'status',
      districtResponseMessages: 'responseMessages',
    }),
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
    disableInputs() {
      return this.type === 'D' || this.type === 'V';
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      saveNew: newTypes.actions.SAVE_NEW,
      updateNew: newTypes.actions.UPDATE_NEW,
      deleteNew: newTypes.actions.DELETE_NEW,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(yardTypes.PATH, {
      listYardsByZone: yardTypes.actions.LIST_YARDS_BY_ZONE,
    }),
    ...mapActions(userTypes.PATH, {
      listUsers: userTypes.actions.LIST_USERS,
    }),
    ...mapActions(districtTypes.PATH, {
      listDistricts: districtTypes.actions.FETCH_DISTRICTS,
    }),
    ...mapActions(questionTypes.PATH, {
      getStatusQuestion: questionTypes.actions.GET_STATUS_QUESTION,
    }),
    async getStatusQuestionNew(row) {
      if (this.type === 'V') {
        const data = {
          model_id: row.id,
          model_name: 'news',
          area_id: 3, // nuevos
          type: 'nuevo',
        };
        await this.getStatusQuestion(data);
      }
    },
    changeCity(cityValue) {
      this.user.sector = null;
      this.user.district = null;
      showLoading('Cargando sectores ...', 'Por favor, espere', true);
      this.listYardsByZone({ id: cityValue, displayAll: 1 });
      this.$q.loading.hide();
    },
    async changeSector() {
      this.user.district = null;
      showLoading('Cargando barrios ...', 'Por favor, espere', true);
      await this.listDistricts();
      this.optionsDistricts = [...this.districts.filter((district) => district.sector === this.user.sector)];
      this.$q.loading.hide();
    },
    async initData() {
      await Promise.all([
        this.listZones(),
        this.getStatusQuestionNew(this.obj),
        await this.listUsers({ displayAll: 0 }),
      ]);
      if (this.zoneStatus === true && this.userStatus === true) {
        this.title = this.type === 'C' ? 'Agregar' : (this.type === 'E' ? 'Editar' : 'Eliminar');
        this.user = this.type === 'C' ? { ...this.copyUser } : { ...this.obj };
        if (this.type === 'V') {
          this.title = 'Ver estado de aprobación';
        }
        if (this.userSend) {
          this.user.userSend = this.userSend;
          this.user.status = 'borrador';
        }
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        if (this.zoneStatus === false) {
          this.showNotification(this.zoneResponseMessages, this.yardStatus, 'top-right', 5000);
        }
        if (this.userStatus === false) {
          this.showNotification(this.usersResponseMessages, this.yardStatus, 'top-right', 5000);
        }
      }
    },
    async onSubmit() {
      if (this.type === 'C') {
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.saveNew(this.user);
      } else if (this.type === 'E') {
        showLoading('Actualizando ...', 'Por favor, espere', true);
        await this.updateNew(this.user);
      } else if (this.type === 'D') {
        showLoading('Eliminando ...', 'Por favor, espere', true);
        await this.deleteNew(this.user.id);
      }
      if (this.status === true) {
        this.user = { ...this.copyUser };
        this.listNews(['borrador', 'creado', 'analizando']);
        this.showDialog = false;
      }

      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();
    },
    async onSubmitQuestion(action) {
      if (action === 'close') {
        this.showDialog = false;
      } else if (action === 'save') {
        showLoading('Actualizando ...', 'Por favor, espere', true);
        this.user.status = 'creado';
        await this.updateNew(this.user);
      } else if (action === 'delete') {
        showLoading('Eliminando ...', 'Por favor, espere', true);
        await this.deleteNew(this.user.id);
      }
      if (this.status === true) {
        this.user = { ...this.copyUser };
        this.listNews(['borrador', 'creado', 'analizando']);
        this.showDialog = false;
      }

      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();
    },
    filterCities(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsZones = this.zones.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    filterSectors(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsYards = this.yards.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    filterDistricts(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsDistricts = this.districts.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
        this.optionsDistricts = [...this.optionsDistricts.filter((district) => district.sector === this.user.sector)];
      });
    },
    filterUsers(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsUsers = this.users.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    hideModal() {
    },
  },
};
</script>
