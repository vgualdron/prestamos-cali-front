<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar nueva Ruta</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input outlined v-model="name" label="Nombre *" hint="Escriba el nombre"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
            <q-select
              v-model="cityId"
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
              v-model="userIdCollector"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Secretaria *"
              :options="optionsUsers"
              option-label="name"
              option-value="id"
              @filter="filterUsers"
              lazy-rules
              :rules="rules.user"
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
            <q-separator />
            <div class="row text-center">
              <q-btn label="cancelar" type="reset" color="primary" :disable="isLoading"
                outline class="col" v-close-popup/>
              <q-btn label="Aceptar" type="submit" color="primary" :loading="isLoading"
                class="col q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import listingTypes from '../../store/modules/listing/types';
import userTypes from '../../store/modules/user/types';
import zoneTypes from '../../store/modules/zone/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
      name: '',
      reference: '',
      dato: '',
      userIdCollector: null,
      cityId: null,
      optionsUsers: [],
      optionsZones: [],
      rules: {
        user: [
          (val) => (!!val) || 'El campo es requerido',
        ],
        city: [
          (val) => (!!val) || 'El campo es requerido',
        ],
      },
    };
  },
  async mounted() {
    this.listZones();
    await this.listUsersByNameRole({
      roleName: 'Secretaria',
      status: 1,
      city: 0,
    });
  },
  watch: {
    users(val) {
      this.optionsUsers = [...val];
    },
    zones(val) {
      this.optionsZones = [...val];
    },
  },
  computed: {
    ...mapState(listingTypes.PATH, {
      listings: 'listings',
      listingStatus: 'status',
      listingResponseMessages: 'responseMessages',
    }),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
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
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(listingTypes.PATH, {
      fetchListings: listingTypes.actions.FETCH_LISTINGS,
      addListing: listingTypes.actions.ADD_LISTING,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    filterUsers(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsUsers = this.users.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    filterCities(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsZones = this.zones.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    async onSubmit() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addListing({
        name: this.name,
        status: 'activa',
        user_id_collector: this.userIdCollector,
        user_id_leader: this.userIdCollector,
        city_id: this.cityId,
      });
      this.showNotification(this.listingResponseMessages, this.listingStatus, 'top-right', 5000);
      this.$q.loading.hide();
      this.showDialog = false;
      await this.fetchListings();
    },
  },
};
</script>
