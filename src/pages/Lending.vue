<template>
  <q-page class="">
    <!-- <div class="row q-mt-md justify-center">
      <div class="col-8 text-center">
        <q-select
          v-model="userSelected"
          class="q-mt-md"
          input-debounce="0"
          label="Seleccionar usuario"
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
    </div> -->
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <table-lending />
      </div>
    </div>
  </q-page>
</template>

<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableLending from 'components/lending/TableLending.vue';
import lendingTypes from '../store/modules/lending/types';
import userTypes from '../store/modules/user/types';
import zoneTypes from '../store/modules/zone/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  components: { TableLending },
  data() {
    return {
      userSelected: null,
    };
  },
  name: 'PageLending',
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.listZones();
    this.$q.loading.hide();
  },
  watch: {
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
    ...mapState(lendingTypes.PATH, {
      lendings: 'lendings',
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
      return this.users.map(({ name, id }) => {
        const label = `${name}`;
        return {
          label,
          value: id,
        };
      });
    },
  },
  methods: {
    /* ...mapActions(diaryTypes.PATH, {
      listDiaries: diaryTypes.actions.LIST_DIARIES,
      listDiariesDayByDay: diaryTypes.actions.LIST_DIARIES_DAY_BY_DAY,
      saveDiary: diaryTypes.actions.SAVE_DIARY,
    }), */
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
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

      if (this.diaries.length === 0) {
        await this.saveDiary({
          userId: this.userSelected,
          date: new Moment(new Date()).format('YYYY-MM-DD'),
          moment,
        });
      }
      await this.listDiariesDayByDay({
        userId: this.userSelected,
        date: new Moment(new Date()).format('YYYY-MM-DD'),
        moment,
      });
      this.showModalDiaryRead = true;
      this.$q.loading.hide();
      this.showNotification(this.diaryResponseMessages, this.diaryStatus, 'top-right', 5000);
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
  },
};
</script>
