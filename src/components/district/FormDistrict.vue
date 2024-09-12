<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar nuevo barrio</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-select
              v-model="sector"
              class="q-mt-md"
              outlined
              clearable
              input-debounce="0"
              label="Sector *"
              :options="optionsSectors"
              option-label="name"
              option-value="id"
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
            <q-input outlined v-model="name" label="Nombre *" hint="Escriba el nombre"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
            <q-input outlined v-model="group" label="Grupo *" hint="Escriba el grupo" type="number"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
            <q-input outlined v-model="order" label="Orden *" hint="Escriba el orden" type="number"
              lazy-rules :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']" />
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
import districtTypes from '../../store/modules/district/types';
import yardTypes from '../../store/modules/yard/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
// import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
      name: '',
      order: null,
      group: null,
      sector: null,
      optionsSectors: [],
      rules: {
        sector: [
          (val) => (!!val) || 'El campo es requerido',
        ],
      },
    };
  },
  async mounted() {
    await this.listYards({ id: 0, displayAll: 1 });
  },
  watch: {
    yards(val) {
      this.optionsSectors = [...val];
    },
  },
  computed: {
    ...mapState(districtTypes.PATH, {
      districts: 'districts',
      districtStatus: 'status',
      districtResponseMessages: 'responseMessages',
    }),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
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
    ...mapActions(districtTypes.PATH, {
      fetchDistricts: districtTypes.actions.FETCH_DISTRICTS,
      addDistrict: districtTypes.actions.ADD_DISTRICT,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async onSubmit() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addDistrict({
        name: this.name,
        group: this.group,
        order: this.order,
        status: 'activo',
        sector: this.sector,
      });
      await this.fetchDistricts();
      this.showNotification(this.districtResponseMessages, this.districtStatus, 'top-right', 5000);
      this.$q.loading.hide();
      this.showDialog = false;
    },
  },
};
</script>
