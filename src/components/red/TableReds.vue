<template>
  <div class="q-px-md">
    <div class="row q-mt-md justify-center">
      <div class="col-8">
        <q-btn-toggle
          v-if="zones && zones.length > 0"
          v-model="citySelected"
          class="my-custom-toggle"
          :options="optionsZones"
          toggle-color="grey"
          toggle-text-color="white"
          color="white"
          text-color="grey"
          spread
          rounded
        />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-option-group
          v-model="sectorSelected"
          :options="optionsSectors"
          color="primary"
          type="checkbox"
          inline
        />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <b>Cobrador:</b>
        <q-radio
          v-for="user in optionsUsers"
          v-model="userSelected"
          checked-icon="task_alt"
          :val="user.value"
          :label="user.label"
          :key="user.value"
          class="q-ml-lg">
        </q-radio>
      </div>
    </div>
    <q-table
      :grid="$q.screen.xs"
      :data="dataTable"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      :title="title"
      separator="cell"
      class="q-mt-md"
      row-key="order"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
        </q-td>
      </template>
      <template v-slot:body-cell-remaining_balance="props">
        <q-td :props="props">
          {{ formatPrice(props.row.remaining_balance) }}
        </q-td>
      </template>
      <template v-slot:body-cell-address="props">
        <q-td :props="props">
          {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
        </q-td>
      </template>
    </q-table>
    <modal-diary
      v-if="showModalDiary"
      v-model="showModalDiary"
      :type="typeDiary"
      :userId="userSelected"
      @addVisit="addVisit"
    />
    <form-news
      v-if="showModalFormNews"
      v-model="showModalFormNews"
      :type="typeActionFormNew"
      :obj="objSelected"
      @refreshList="listNewsMounted"
    />
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalDiary from 'components/diary/ModalDiary.vue';
import FormNews from 'components/review/FormNews.vue';
import newTypes from '../../store/modules/new/types';
import zoneTypes from '../../store/modules/zone/types';
import yardTypes from '../../store/modules/yard/types';
import userTypes from '../../store/modules/user/types';
import diaryTypes from '../../store/modules/diary/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
// import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    ModalDiary,
    FormNews,
  },
  data() {
    return {
      typeDiary: 'readwrite',
      showModalDiary: false,
      obj: {},
      type: 'C',
      route: '/review',
      name: 'Revisión de información',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'district_order',
          label: 'Codigo',
          align: 'center',
          field: 'district_order',
          visible: false,
        },
        {
          name: 'news_name',
          align: 'left',
          label: 'Cliente',
          field: 'news_name',
          visible: true,
        },
        {
          name: 'remaining_balance',
          align: 'left',
          label: 'Deuda',
          field: 'remaining_balance',
          visible: true,
        },
        {
          name: 'listing_name',
          align: 'left',
          label: 'Ruta',
          field: 'listing_name',
          visible: true,
        },
        {
          name: 'address_name',
          align: 'left',
          label: 'Nombre REF',
          field: 'address_name',
          visible: true,
        },
        {
          name: 'address_type',
          align: 'left',
          label: 'Tipo',
          field: 'address_type',
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
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
      showModalFormNews: false,
      objSelected: {},
      typeActionFormNew: 'house',
    };
  },
  props: {
  },
  async mounted() {
    this.citySelected = parseInt(localStorage.getItem('cityMC'), 10);
    await this.initData();
  },
  watch: {
    async citySelected(newVal) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      this.sectorSelected = [];
      await this.listYardsByZone({ id: newVal, displayAll: 1 });
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const users = this.optionsUsers.filter((user) => parseInt(user.value, 10) === parseInt(this.userSelected, 10));
        if (users.length === 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
      }
      this.$q.loading.hide();
    },
  },
  computed: {
    ...mapState(newTypes.PATH, [
      'newsReds',
      'responseMessages',
      'status',
      'new',
      'userSelectedReds',
      'sectorSelectedReds',
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
    ...mapState(diaryTypes.PATH, {
      diaries: 'diaries',
      diariesDayByDay: 'diariesDayByDay',
      diaryStatus: 'status',
      diaryResponseMessages: 'responseMessages',
    }),
    dataTable() {
      let data = this.newsReds.map((element) => ({
        ...element,
      }));
      if (this.citySelected > 0) {
        data = data.filter((item) => item.city_id === this.citySelected);
      }
      if (this.sectorSelected && this.sectorSelected.length > 0) {
        data = data.filter((item) => this.sectorSelected.includes(item.sector_id));
      }
      return data;
    },
    validatedPermissions() {
      const statusCreate = havePermission('new.create');
      const statusEdit = havePermission('new.update');
      const statusDelete = havePermission('new.delete');
      const statuschangeStatus = havePermission('new.changeStatus');
      const statusAllCities = havePermission('red.allCities');
      return {
        create: {
          title: statusCreate ? 'Registrar nuevos' : 'No tiene permisos para registrar nuevos',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar nuevo' : 'No tiene permisos para editar nuevos',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar nuevo' : 'No tiene permisos para eliminar nuevos',
          status: statusDelete,
        },
        changeStatus: {
          title: statuschangeStatus ? 'Asignar visita' : 'No tiene permisos',
          status: statuschangeStatus,
        },
        changeStatusPending: {
          title: statuschangeStatus ? 'Poner como pendiente' : 'No tiene permisos',
          status: statuschangeStatus,
        },
        changeStatusReject: {
          title: statuschangeStatus ? 'Rechazar' : 'No tiene permisos',
          status: statuschangeStatus,
        },
        allCities: {
          title: statusAllCities ? 'Todas las ciudades' : 'No tiene permisos',
          status: statusAllCities,
        },
      };
    },
    optionsZones() {
      const isAll = this.validatedPermissions.allCities.status;
      let cities = [...this.zones];
      if (!isAll) {
        cities = this.zones.filter((zone) => zone.id === this.citySelected);
      }
      return cities.map(({ name, id }) => {
        const items = this.newsReds.filter(({ city_id }) => id === city_id);
        const label = `[ ${items.length} ] ${name}`;
        return {
          label,
          value: id,
        };
      });
    },
    optionsSectors() {
      return this.yards.map(({ name, id }) => {
        const items = this.newsReds.filter(({ sector_id }) => id === sector_id);
        const label = `[ ${items.length} ] ${name}`;
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
    title() {
      return '';
    },
    userSelected: {
      get() {
        return this.userSelectedReds;
      },
      set(newValue) {
        this.updateUserSelectedReds(parseInt(newValue, 10));
      },
    },
    sectorSelected: {
      get() {
        return this.sectorSelectedReds;
      },
      set(newValue) {
        this.updateSectorSelectedReds(newValue);
      },
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNewsReds: newTypes.actions.LIST_NEWS_REDS,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
      updateUserSelectedReds: newTypes.actions.UPDATE_USER_SELECTED_REDS,
      updateSectorSelectedReds: newTypes.actions.UPDATE_SECTOR_SELECTED_REDS,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(yardTypes.PATH, {
      listYardsByZone: yardTypes.actions.LIST_YARDS_BY_ZONE,
    }),
    ...mapActions(diaryTypes.PATH, {
      listDiaries: diaryTypes.actions.LIST_DIARIES,
      listDiariesDayByDay: diaryTypes.actions.LIST_DIARIES_DAY_BY_DAY,
      updateDiary: diaryTypes.actions.UPDATE_DIARY,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    clickEditAddress(row, type) {
      console.log(row);
      this.typeActionFormNew = type;
      this.objSelected = { ...row };
      this.showModalFormNews = true;
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    getColorBadge(i) {
      const colors = [
        'white',
        'black',
        'yellow',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
      ];
      return colors[i];
    },
    getColorText(i) {
      const colors = [
        'white',
        'white',
        'black',
        'white',
        'white',
        'white',
        'white',
        'white',
      ];
      return colors[i];
    },
    disabledBtnPending(row) {
      return !row.observation;
    },
    disabledBtnDenied(row) {
      return !row.observation;
    },
    disabledBtnAddVisit(row) {
      return !row.address_house || !row.site_visit;
    },
    async listNewsMounted() {
      await this.listNewsReds(this.citySelected);
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
    },
    async openModalVisit() {
      this.typeDiary = 'readwrite';
      this.showModalDiary = true;
    },
    async addVisit(item) {
      await this.changeStatus(this.itemSelected, 'agendado');
      await this.changeStatusDiary({
        ...item,
        userId: item.user_id,
        new_id: this.itemSelected.id,
        status: 'agendado',
      });
      this.typeDiary = 'read';
    },
    async changeStatusDiary(data) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updateDiary(data);

      if (this.diaryStatus === true) {
        await this.listDiariesDayByDay({
          userId: this.userSelected,
          date: new Moment(new Date()).format('YYYY-MM-DD'),
          moment: 'current',
        });
        await this.listNewsMounted();
      }
      this.$q.loading.hide();
      this.showNotification(this.diaryResponseMessages, this.diaryStatus, 'top-right', 5000);
    },
    async changeStatus(obj, type) {
      this.obj = obj;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updateStatusNew({
        ...obj,
        status: type,
        attempts: 1,
      });

      if (this.status === true) {
        this.user = { ...this.copyUser };
        await this.listNewsMounted();
      }
      this.$q.loading.hide();
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async initData() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listNewsMounted();
      console.log(this.newsReds);
      await this.listZones();
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      this.$q.loading.hide();
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const users = this.optionsUsers.filter((user) => parseInt(user.value, 10) === parseInt(this.userSelected, 10));
        if (users.length === 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
      }
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async save(field, value) {
      this.itemSelected[field] = value.value ? value.value : value;
      await this.completeDataNew(this.itemSelected);
      await this.listNewsMounted();
    },
  },
};
</script>
