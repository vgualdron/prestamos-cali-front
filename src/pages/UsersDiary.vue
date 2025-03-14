<template>
  <q-page class="q-ma-md">
    <div class="row justify-center">
      <div class="col-8">
        <q-btn-toggle
          v-if="zones && zones.length > 0"
          v-model="citySelected"
          class="my-custom-toggle"
          :options="optionsZones"
          toggle-color="primary"
          color="white"
          text-color="primary"
          spread
        />
      </div>
    </div>
    <div class="row q-mt-md justify-center">
      <div class="col-8 text-center">
        <q-select
          v-model="userSelected"
          class="q-mt-md"
          input-debounce="0"
          label="Seleccionar asesor"
          :options="optionsUsers"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          outlined
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay coincidencias
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-4 text-center">
        <q-btn
          v-if="userSelected"
          color="primary"
          field="edit"
          icon="location_on"
          class="q-mt-md"
          round
          @click="openInGoogleMaps(userSelected)"
        />
        {{ getDateLocation(userSelected) }}
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <table-diary
          v-if="diaries && diaries.length > 0"
          :data="diaries"
          :optionsUsers="optionsUsers"
          @addVisit="addVisit"
          @refreshDiary="viewDiary('current')"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableDiary from 'components/diary/TableDiary.vue';
import diaryTypes from '../store/modules/diary/types';
import userTypes from '../store/modules/user/types';
import zoneTypes from '../store/modules/zone/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  components: { TableDiary },
  data() {
    return {
      citySelected: 0,
      userSelected: null,
    };
  },
  name: 'PageUsersDiary',
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.listZones();
    this.citySelected = parseInt(localStorage.getItem('cityMC'), 10);
    this.$q.loading.hide();
  },
  watch: {
    async citySelected() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listUsersByRoleName({ roleName: 'Asesor', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const [userId] = this.optionsUsers;
        this.userSelected = userId.value;
      }
    },
    async userSelected() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.viewDiary('current');
      this.$q.loading.hide();
    },
  },
  computed: {
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(diaryTypes.PATH, {
      diaries: 'diaries',
      diariesDayByDay: 'diariesDayByDay',
      diaryStatus: 'status',
      diaryResponseMessages: 'responseMessages',
    }),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
    }),
    optionsZones() {
      return this.zones.map(({ name, id }) => {
        const label = ` ${name}`;
        return {
          label,
          value: id,
        };
      });
    },
    optionsUsers() {
      return this.users.map(({
        name,
        id,
        latitude,
        longitude,
        date_location,
      }) => {
        const label = `${name}`;
        return {
          label,
          value: id,
          latitude,
          longitude,
          date_location,
        };
      });
    },
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      listDiaries: diaryTypes.actions.LIST_DIARIES,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    getDateLocation(userId) {
      console.log(userId);
      const user = this.optionsUsers.find((u) => u.value === userId);
      if (user) {
        return user.date_location;
      }
      return 'X';
    },
    openInGoogleMaps(userId) {
      const user = this.optionsUsers.find((u) => u.value === userId);
      if (user) {
        const googleMapsUrl = `https://www.google.com/maps?q=${user.latitude},${user.longitude}`;
        window.open(googleMapsUrl, '_blank');
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async viewDiary(moment) {
      showLoading('Consultando diario ...', 'Por favor, espere', true);
      await this.listDiaries({
        userId: this.userSelected,
        date: new Moment(new Date()).format('YYYY-MM-DD'),
        moment,
      });
      this.$q.loading.hide();
      this.showNotification(this.diaryResponseMessages, this.diaryStatus, 'top-right', 5000);
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
  },
};
</script>
