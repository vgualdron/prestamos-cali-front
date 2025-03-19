<template>
  <div class="q-px-md">
    <div class="row q-mt-md justify-center">
      <div class="col-8">
        <q-btn-toggle
          v-if="zones && zones.length > 0"
          v-model="citySelected"
          class="my-custom-toggle"
          :options="optionsZones"
          toggle-color="primary"
          toggle-text-color="white"
          color="white"
          text-color="primary"
          spread
          rounded
        />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-2 text-center">
        <q-input
          outlined
          v-model.trim="date"
          label="Fecha *"
          lazy-rules
          type="date"
          :min="minDate"
          :rules="[(val) => (!!val) || '']"
          hide-bottom-space
          autocomplete="off"
          :disabled="false"
          dense
        />
      </div>
      <div class="col-8 text-center">
        <b>Cobrador:</b>
        <q-radio
          v-for="user in optionsUsers"
          v-model="userSelected"
          checked-icon="task_alt"
          :val="user.value"
          :label="user.name"
          :key="user.value"
          class="q-ml-lg">
        </q-radio>
      </div>
      <div class="col-2 text-center">
        <q-btn
          round
          icon="refresh"
          class="q-ml-md"
          color="primary"
          title="Click para refrescar la tabla"
          @click="initData()">
        </q-btn>
        <q-btn
          v-if="userSelected"
          color="primary"
          field="edit"
          icon="location_on"
          class="q-mt-none q-ml-sm"
          round
          @click="openInGoogleMaps(userSelected)"
        />
      </div>
    </div>
    <q-table
      :data="dataTable"
      :columns="columns"
      :pagination="pagination"
      :title="title"
      separator="cell"
      class="q-mt-md"
      row-key="order"
      striped
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td :props="props" key="actions">
            <q-badge :color="props.row.file_status === 'aprobado' ? 'green' : 'blue'">
              {{ props.row.file_status }}
            </q-badge>
            <q-btn
              v-if="props.row.file_url"
              color="primary"
              field="edit"
              icon="location_on"
              size="sm"
              class="q-mb-sm q-ml-sm"
              round
              @click="openInGoogleMapsFile(props.row)"
            />
            <br>
            <img
              v-if="props.row.file_url"
              :src="getUrlFile(props.row.file_url)"
              width="200rem" />
          </q-td>
          <q-td :props="props" key="start_date">
            {{ formatDate(props.row.start_date) }}
          </q-td>
          <q-td :props="props" key="end_date">
            {{ formatDate(props.row.end_date) }}
          </q-td>
          <q-td :props="props" key="time_visit">
            {{ props.row.time_visit }} min
          </q-td>
          <q-td :props="props" key="displacement">
            {{ props.row.displacement }} min
          </q-td>
          <q-td :props="props" key="order">
            {{ props.row.order }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="address">
            {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="type_ref">
            {{ props.row.type_ref }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="description_ref">
            {{ props.row.description_ref }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="nameDebtor">
            {{ props.row.nameDebtor }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="solution">
            {{ props.row.solution }}
          </q-td>
          <q-td :props="props" class="text-wrap" key="observation">
            {{ props.row.observation }}
          </q-td>
        </q-tr>
      </template>
      <template v-slot:bottom-row>
        <q-tr class="bg-blue-2 text-primary">
          <q-td class="text-center" colspan="3"><strong>Total {{ formatMinutesToHours(totalTimeVisit + totalTimeDisplacement) }}</strong></q-td>
          <q-td class="text-center"><strong>{{ formatMinutesToHours(totalTimeVisit) }}</strong></q-td>
          <q-td class="text-center"><strong>{{ formatMinutesToHours(totalTimeDisplacement) }}</strong></q-td>
          <q-td colspan="7"></q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import zoneTypes from '../../store/modules/zone/types';
import userTypes from '../../store/modules/user/types';
import reddirectionTypes from '../../store/modules/reddirection/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
// import { havePermission } from '../../helpers/havePermission';

export default {
  components: {
  },
  data() {
    return {
      route: '/report-time-collectors',
      columns: [
        {
          name: 'actions',
          label: 'Foto',
          align: 'center',
          visible: false,
        },
        {
          name: 'start_date',
          align: 'center',
          label: 'Fecha ini',
          field: 'start_date',
          visible: true,
        },
        {
          name: 'end_date',
          align: 'center',
          label: 'Fecha fin',
          field: 'end_date',
          visible: true,
        },
        {
          name: 'time_visit',
          align: 'center',
          label: 'Duración',
          field: 'time_visit',
          visible: true,
        },
        {
          name: 'displacement',
          align: 'center',
          label: 'Desplazamiento',
          field: 'displacement',
          visible: true,
        },
        {
          name: 'order',
          align: 'center',
          label: 'Código',
          field: 'order',
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
          style: 'max-width: 200px',
          visible: true,
        },
        {
          name: 'type_ref',
          align: 'center',
          label: 'Tipo',
          field: 'type_ref',
          visible: true,
        },
        {
          name: 'description_ref',
          align: 'center',
          label: 'Referencia',
          field: 'description_ref',
          style: 'max-width: 200px',
          visible: true,
        },
        {
          name: 'nameDebtor',
          align: 'center',
          label: 'Cliente',
          field: 'nameDebtor',
          style: 'max-width: 200px',
          visible: true,
        },
        {
          name: 'solution',
          align: 'center',
          label: 'Solución',
          field: 'solution',
          style: 'max-width: 200px',
          visible: true,
        },
        {
          name: 'observation',
          align: 'center',
          label: 'Observación',
          field: 'observation',
          style: 'max-width: 200px',
          visible: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      itemSelected: {},
      citySelected: 0,
      polling: null,
      sectorSelected: 0,
      userSelected: 0,
      date: Moment().format('YYYY-MM-DD'),
      minDate: '2025-03-18',
    };
  },
  props: {
  },
  async mounted() {
    this.citySelected = parseInt(localStorage.getItem('cityMC'), 10);
    await this.initData();
    this.pollData();
  },
  watch: {
    async citySelected() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      this.sectorSelected = null;
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const users = this.optionsUsers.filter((user) => parseInt(user.value, 10) === parseInt(this.userSelected, 10));
        if (users.length === 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
      }
      await this.listMounted();
      this.$q.loading.hide();
    },
    async userSelected() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.initData();
      this.$q.loading.hide();
    },
  },
  computed: {
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
    }),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(reddirectionTypes.PATH, {
      reddirection: 'reddirection',
      reddirections: 'reddirections',
      reddirectionStatus: 'status',
      reddirectionResponseMessages: 'responseMessages',
    }),
    hasReddirectionActive() {
      return (this.reddirection && this.reddirection.status === 'activo');
    },
    dataTable() {
      const data = this.reddirections.map((element) => ({
        ...element,
      }));
      return data;
    },
    optionsZones() {
      return this.zones.map(({ name, id }) => {
        const label = `${name}`;
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
        sector_name_collector,
        latitude,
        longitude,
      }) => {
        const label = `${name} (${sector_name_collector || 'X'})`;
        return {
          label,
          name,
          value: id,
          latitude,
          longitude,
        };
      });
    },
    title() {
      return `${this.dataTable.length} visitas`;
    },
    totalTimeVisit() {
      return this.dataTable.reduce((sum, row) => sum + (row.time_visit || 0), 0);
    },
    totalTimeDisplacement() {
      return this.dataTable.reduce((sum, row) => sum + (row.displacement || 0), 0);
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(reddirectionTypes.PATH, {
      getByUserAndDate: reddirectionTypes.actions.GET_BY_USER_AND_DATE,
      getByLending: reddirectionTypes.actions.GET_BY_LENDING,
      saveReddirection: reddirectionTypes.actions.SAVE_REDDIRECTION,
      updateReddirection: reddirectionTypes.actions.UPDATE_REDDIRECTION,
      deleteReddirection: reddirectionTypes.actions.DELETE_REDDIRECTION,
    }),
    formatMinutesToHours(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    openInGoogleMapsFile(row) {
      const googleMapsUrl = `https://www.google.com/maps?q=${row.file_latitude},${row.file_longitude}`;
      window.open(googleMapsUrl, '_blank');
    },
    openInGoogleMaps(userId) {
      const user = this.optionsUsers.find((u) => u.value === userId);
      if (user) {
        const googleMapsUrl = `https://www.google.com/maps?q=${user.latitude},${user.longitude}`;
        window.open(googleMapsUrl, '_blank');
      }
    },
    getFirstName(fullName) {
      if (!fullName || typeof fullName !== 'string') {
        return '';
      }
      const parts = fullName.trim().split(/\s+/);
      return parts[0];
    },
    getUrlFile(url) {
      return `${process.env.URL_FILES}${url}`;
    },
    isDeleted(row) {
      return (row && !row.reddirection_start_date && row.is_current);
    },
    getRowClass(row) {
      let c = 'bg-white';
      if (this.reddirection && this.reddirection.id === row.is_current) {
        c = 'bg-blue-2';
      } else if (row.has_visited) {
        c = 'bg-grey-5';
      } else if (row.reddirection_start_date && (this.isToday(row.latest_date) || this.isToday(row.reddirection_start_date))) {
        c = 'bg-orange-2';
      }
      return c;
    },
    isToday(fecha) {
      if (!Moment) {
        console.error('Moment.js no está disponible');
        return false;
      }
      return Moment(fecha).isSame(Moment(), 'day');
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.initData();
      }, 300000);
    },
    generateLinkGoogleMaps(row) {
      const latEnd = row.address_latitude;
      const lngEnd = row.address_longitude;
      let latIni = '';
      let lngIni = '';
      const user = this.users.find((item) => item.id === this.userSelected);
      if (user) {
        latIni = user.latitude;
        lngIni = user.longitude;
      }
      const baseUrl = 'https://www.google.com/maps/dir/?api=1';
      const url = `${baseUrl}&origin=${latIni},${lngIni}&destination=${latEnd},${lngEnd}`;
      return url;
    },
    getColorBadge(i) {
      const colors = [
        'black',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
        'yellow',
      ];
      return colors[i];
    },
    getColorText(i) {
      const colors = [
        'white',
        'white',
        'white',
        'white',
        'white',
        'white',
        'black',
      ];
      return colors[i];
    },
    viewAll() {
      this.sectorSelected = null;
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    formatDate(date) {
      return Moment(date).format('DD/MM/YYYY hh:mm A');
    },
    async listMounted() {
      await this.getByUserAndDate({ user: this.userSelected, date: this.date });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
    },
    async initData() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listZones();
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const users = this.optionsUsers.filter((user) => parseInt(user.value, 10) === parseInt(this.userSelected, 10));
        if (users.length === 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
        await this.listMounted();
      }
      this.$q.loading.hide();
    },
  },
};
</script>
<style scoped>
  .text-wrap {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
  }
</style>
