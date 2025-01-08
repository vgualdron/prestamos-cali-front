<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar Nuevo Egreso</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-select
              v-model="area_id"
              class="q-mt-md"
              outlined
              input-debounce="0"
              label="Area *"
              :options="optionsAreas"
              option-label="name"
              option-value="id"
              lazy-rules
              :rules="[
                (val) => (!!val) || 'El campo es requerido',
              ]"
              hide-bottom-space
              map-options
              emit-value
              autocomplete="off"
              @input="changeArea"
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
              v-model="item_id"
              class="q-mt-md"
              outlined
              input-debounce="0"
              label="Item *"
              :options="optionsItems"
              option-label="name"
              option-value="id"
              lazy-rules
              :rules="[
                (val) => (!!val) || 'El campo es requerido',
              ]"
              hide-bottom-space
              map-options
              emit-value
              autocomplete="off"
              @input="changeItem"
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
              v-model="user_id"
              class="q-mt-md"
              use-input
              outlined
              clearable
              input-debounce="0"
              label="Persona"
              :options="optionsUsers"
              option-label="name"
              option-value="id"
              lazy-rules
              :rules="[]"
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
              v-model="amount"
              label="Valor *"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
              :hint="formattedPrice(amount)"
              type="number"/>
            <q-input
              outlined
              v-model="description"
              label="Descripción"
              lazy-rules
              type="text"/>
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
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import expenseTypes from '../../store/modules/expense/types';
import userTypes from '../../store/modules/user/types';
import areaTypes from '../../store/modules/area/types';
import itemTypes from '../../store/modules/item/types';
import notificationTypes from '../../store/modules/notification/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      isLoading: false,
      optionsUsers: [],
      optionsAreas: [],
      optionsItems: [],
      rules: {
        user: [
          (val) => (!!val) || 'El campo es requerido',
        ],
      },
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      amount: null,
      status: 'borrador',
      area_id: null,
      item_id: null,
      user_id: null,
      description: '',
    };
  },
  async mounted() {
    await this.listAreas();
  },
  watch: {
    users(val) {
      this.optionsUsers = [...val];
    },
    areas(val) {
      this.optionsAreas = [...val];
    },
    items(val) {
      this.optionsItems = val.filter((v) => v.name !== 'NUEVOS' && v.name !== 'RENOVACIONES');
    },
  },
  computed: {
    ...mapState(expenseTypes.PATH, {
      expenses: 'expenses',
      expenseStatus: 'status',
      expenseResponseMessages: 'responseMessages',
    }),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(areaTypes.PATH, {
      areas: 'areas',
    }),
    ...mapState(itemTypes.PATH, {
      items: 'items',
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
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    ...mapActions(expenseTypes.PATH, {
      listExpenses: expenseTypes.actions.LIST_EXPENSES,
      addExpense: expenseTypes.actions.SAVE_EXPENSE,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByArea: userTypes.actions.LIST_USERS_BY_AREA,
    }),
    ...mapActions(areaTypes.PATH, {
      listAreas: areaTypes.actions.LIST_AREAS,
    }),
    ...mapActions(itemTypes.PATH, {
      listItems: itemTypes.actions.LIST_ITEMS,
    }),
    formattedPrice(value) {
      if (!value) return '';
      return value
        .toString()
        .replace(/\D/g, '') // Elimina caracteres no numéricos
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega puntos como separadores
    },
    formatDateHour(date) {
      return moment(date).format('YYYY-MM-DD hh:mm A');
    },
    async changeArea(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listItems(value);
      await this.listUsersByArea({
        area: value,
      });
      this.$q.loading.hide();
    },
    async changeItem(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      console.log(value);
      this.$q.loading.hide();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    filterUsers(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsUsers = this.users.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    async onSubmit() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.addExpense({
        date: this.date,
        amount: this.amount,
        status: this.status,
        description: this.description,
        user_id: this.user_id,
        item_id: this.item_id,
      });
      this.showNotification(this.expenseResponseMessages, this.expenseStatus, 'top-right', 5000);

      if (this.expenseStatus) {
        this.showDialog = false;
        await this.listExpenses({
          status: ['creado', 'borrador', 'rechazado'],
          items: [1, 8],
        });

        if (this.user_id) {
          const user = this.optionsUsers.find((u) => u.id === this.user_id);
          if (user) {
            const data = {
              app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
              contents: { en: 'Se ha registrado en gasto a tu nombre' },
              headings: { en: 'Haz click aquí y revisa' },
              include_player_ids: [user.pushToken],
              url: `${process.env.URL_FRONT}/my-expenses`,
            };
            await this.sendNotification(data);
          }
        }
      }
      this.$q.loading.hide();
    },
  },
};
</script>
