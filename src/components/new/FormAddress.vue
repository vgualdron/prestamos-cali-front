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
            <q-select
              v-model="user.city"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Ciudad"
              :disable="disableInputs"
              :options="optionsZones"
              option-label="name"
              option-value="id"
              @filter="filterCities"
               @input="changeCity"
              lazy-rules
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
              outlined
              v-model.trim="user.address"
              label="Dirección *"
              lazy-rules
              :rules="rules.address"
              :disable="disableInputs"
              hide-bottom-space
              autocomplete="off"
            />
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
import zoneTypes from '../../store/modules/zone/types';
import yardTypes from '../../store/modules/yard/types';
import districtTypes from '../../store/modules/district/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      title: 'Dirección',
      isLoading: false,
      optionsYards: [],
      optionsZones: [],
      optionsDistricts: [],
      user: {
        id: null,
        address: '',
        city: null,
        sector: null,
        district: null,
      },
      copyUser: {
        id: null,
        address: '',
        city: null,
        sector: null,
        district: null,
      },
      rules: {
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
      },
      isSetValues: true,
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
    console.log(this.obj);
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.initData();
    this.$q.loading.hide();
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
    /* eslint-disable no-unused-expressions */
    'user.city': {
      async handler(newVal, oldVal) {
        console.log('change city', oldVal);
        this.user.sector = null;
        this.user.district = null;
        showLoading('Cargando sectores ...', 'Por favor, espere', true);
        await this.listYardsByZone({ id: newVal, displayAll: 1 });
        if (this.isSetValues) {
          this.setValues();
        }
        this.$q.loading.hide();
      },
      immediate: false, // Otras opciones si las necesitas
      deep: false, // Otras opciones si las necesitas
    },
    /* eslint-disable no-unused-expressions */
    'user.sector': {
      async handler() {
        this.user.district = null;
        showLoading('Cargando barrios ...', 'Por favor, espere', true);
        await this.listDistricts();
        if (this.isSetValues) {
          this.setValues();
        }
        this.optionsDistricts = [...this.districts.filter((district) => district.sector === this.user.sector)];
        this.$q.loading.hide();
      },
      immediate: false, // Otras opciones si las necesitas
      deep: false, // Otras opciones si las necesitas
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
    ...mapState(districtTypes.PATH, {
      districts: 'districts',
      districtStatus: 'status',
      districtResponseMessages: 'responseMessages',
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
      return false;
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      saveNew: newTypes.actions.SAVE_NEW,
      updateNew: newTypes.actions.UPDATE_NEW,
      deleteNew: newTypes.actions.DELETE_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(yardTypes.PATH, {
      listYardsByZone: yardTypes.actions.LIST_YARDS_BY_ZONE,
    }),
    ...mapActions(districtTypes.PATH, {
      listDistricts: districtTypes.actions.FETCH_DISTRICTS,
    }),
    changeCity() {
      this.isSetValues = false;
    },
    changeSector() {
      this.isSetValues = false;
    },
    async initData() {
      await Promise.all([
        this.listZones(),
      ]);
      this.setValues();
    },
    setValues() {
      if (this.type === 'house') {
        this.user.id = this.obj.id;
        this.user.city = this.obj.cityHouse;
        this.user.sector = this.obj.sectorHouse;
        this.user.address = this.obj.address_house;
        this.user.district = this.obj.address_house_district;
      } else if (this.type === 'work') {
        this.user.id = this.obj.id;
        this.user.city = this.obj.cityWork;
        this.user.sector = this.obj.sectorWork;
        this.user.address = this.obj.address_work;
        this.user.district = this.obj.address_work_district;
      } else if (this.type === 'ref1') {
        this.user.id = this.obj.id;
        this.user.city = this.obj.cityRef1;
        this.user.sector = this.obj.sectorRef1;
        this.user.address = this.obj.family_reference_address;
        this.user.district = this.obj.family_reference_district;
      } else if (this.type === 'ref2') {
        this.user.id = this.obj.id;
        this.user.city = this.obj.cityRef2;
        this.user.sector = this.obj.sectorRef2;
        this.user.address = this.obj.family2_reference_address;
        this.user.district = this.obj.family2_reference_district;
      } else if (this.type === 'guarantor') {
        this.user.id = this.obj.id;
        this.user.city = this.obj.cityGuarantor;
        this.user.sector = this.obj.sectorGuarantor;
        this.user.address = this.obj.guarantor_address;
        this.user.district = this.obj.guarantor_district;
      }
    },
    async onSubmit() {
      let obj = {};
      if (this.type === 'house') {
        obj = {
          id: this.obj.id,
          address_house: this.user.address,
          address_house_district: this.user.district,
        };
      } else if (this.type === 'work') {
        obj = {
          id: this.obj.id,
          address_work: this.user.address,
          address_work_district: this.user.district,
        };
      } else if (this.type === 'ref1') {
        obj = {
          id: this.obj.id,
          family_reference_address: this.user.address,
          family_reference_district: this.user.district,
        };
      } else if (this.type === 'ref2') {
        obj = {
          id: this.obj.id,
          family2_reference_address: this.user.address,
          family2_reference_district: this.user.district,
        };
      } else if (this.type === 'guarantor') {
        obj = {
          id: this.obj.id,
          guarantor_address: this.user.address,
          guarantor_district: this.user.district,
        };
      }
      showLoading('Actualizando ...', 'Por favor, espere', true);
      await this.completeDataNew(obj);
      if (this.status === true) {
        this.user = { ...this.copyUser };
        this.$emit('refreshList');
        this.showDialog = false;
      }

      // this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
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
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    hideModal() {
    },
  },
};
</script>
