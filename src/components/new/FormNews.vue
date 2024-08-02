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
              v-model.trim="user.documentNumber"
              label="Número de Documento"
              outlined
              lazy-rules
              :disable="disableInputs"
              type="number"
              hide-bottom-space
            />
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
            <q-input
              outlined
              v-model.trim="user.address"
              label="Dirección *"
              lazy-rules
              :rules="rules.address"
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
            <q-input
              outlined
              v-model.trim="user.district"
              label="Barrio *"
              lazy-rules
              :rules="rules.district"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.occupation"
              label="Ocupación *"
              lazy-rules
              :rules="rules.occupation"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-select
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
            <div class="row text-center">
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
      user: {
        id: null,
        documentNumber: '',
        name: '',
        address: '',
        phone: '',
        city: null,
        sector: null,
        district: '',
        occupation: '',
        userSend: null,
        observation: '',
      },
      copyUser: {
        id: null,
        documentNumber: '',
        name: '',
        address: '',
        phone: '',
        city: null,
        sector: null,
        district: '',
        occupation: '',
        userSend: null,
        observation: '',
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
          (val) => (val.length >= 3) || 'El campo debe tener un mínimo de 3 caracteres',
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
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    disableInputs() {
      return this.type === 'D';
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
    changeCity(cityValue) {
      showLoading('Cargando sectores ...', 'Por favor, espere', true);
      this.listYardsByZone({ id: cityValue, displayAll: 1 });
      this.$q.loading.hide();
    },
    async initData() {
      await Promise.all([
        this.listZones(),
        this.listUsers({ displayAll: 0 }),
      ]);
      if (this.zoneStatus === true && this.userStatus === true) {
        this.title = this.type === 'C' ? 'Agregar' : (this.type === 'E' ? 'Editar' : 'Eliminar');
        this.user = this.type === 'C' ? { ...this.copyUser } : { ...this.obj };
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
        this.listNews(['borrador', 'creado']);
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
