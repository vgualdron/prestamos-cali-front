<template>
  <div class="">
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
        <b>Asesor:</b>
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
      :data="dataTable"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      :title="title"
      separator="cell"
      class="q-mt-md"
      dense
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn
              v-if="props.row.status"
              class="q-ml-xs"
              color="green"
              field="changeStatus"
              icon="edit_calendar"
              size="sm"
              :disabled="!validatedPermissions.changeStatus.status || disabledBtnAddVisit(props.row)"
              :title="validatedPermissions.changeStatus.title"
              @click="openModalVisit(props.row)"
              round
            />
            <q-btn
              v-if="props.row.status === 'creado' && tab === 'one'"
              class="q-ml-xs"
              color="orange"
              field="changeStatus"
              icon="pending_actions"
              size="sm"
              :disabled="!validatedPermissions.changeStatusPending.status || disabledBtnPending(props.row)"
              :title="validatedPermissions.changeStatusPending.title"
              @click="changeStatus(props.row, 'pendiente')"
              round
            />
            <q-btn
              v-if="props.row.status"
              class="q-ml-xs"
              color="red"
              field="changeStatus"
              icon="do_disturb_alt"
              size="sm"
              :disabled="!validatedPermissions.changeStatusReject.status || disabledBtnDenied(props.row)"
              :title="validatedPermissions.changeStatusReject.title"
              @click="changeStatus(props.row, 'rechazado')"
              round
            />
          </q-td>
          <q-td key="address_house" :props="props" @click="clickEditAddress(props.row, 'house')">
            <q-icon size="xs" name="edit"/>
            {{ props.row.address_house }}
            <br><b v-if="props.row.districtHouseName">Barrio: </b> {{ props.row.districtHouseName }}
          </q-td>
          <q-td key="address_work" :props="props" @click="clickEditAddress(props.row, 'work')">
            <q-icon size="xs" name="edit" />
            {{ props.row.address_work }}
            <br><b v-if="props.row.districtWorkName">Barrio: </b> {{ props.row.districtWorkName }}
          </q-td>
          <q-td key="site_visit" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.site_visit }}
            <q-popup-edit :value="props.row.site_visit" v-slot="scope" buttons
              @input="val => save('site_visit', val)">
              <q-option-group
                v-model="scope.value"
                :options="[
                  {
                    label: 'casa',
                    value: 'casa'
                  },
                  {
                    label: 'trabajo',
                    value: 'trabajo',
                    disable: !props.row.address_work
                  },
                ]"
                color="primary"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="observation" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.observation }}
            <q-popup-edit :value="props.row.observation" v-slot="scope" buttons
              @input="val => save('observation', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <!-- <q-td key="documentNumber" :props="props">
           {{ props.row.documentNumber }}
          </q-td> -->
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
            <br><b>Barrio: </b> {{ props.row.districtName }}
          </q-td>
          <q-td key="cityName" :props="props">
            {{ props.row.cityName }}
          </q-td>
          <q-td key="sectorName" :props="props">
            {{ props.row.sectorName }}
          </q-td>
          <q-td key="districtGroup" :props="props">
            <q-badge
              :color="getColorBadge(props.row.districtGroup)"
              :text-color="getColorText(props.row.districtGroup)">
              {{ props.row.districtGroup }}
            </q-badge>
          </q-td>
          <q-td key="districtOrder" :props="props">
            {{ props.row.districtOrder }}
          </q-td>
          <!-- <q-td key="districtName" :props="props">
            {{ props.row.districtName }}
          </q-td> -->
          <q-td key="occupation" :props="props">
            {{ props.row.occupation }}
          </q-td>
          <q-td key="userSendName" :props="props">
            {{ props.row.userSendName }}
          </q-td>
          <q-td key="status" :props="props">
           {{ props.row.status }}
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
        </q-tr>
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
import { formatDateWithTime } from '../../helpers/formatDate';

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
          name: 'address_house',
          align: 'left',
          label: 'Dirección casa',
          field: 'address_house',
          sortable: true,
          visible: true,
        },
        {
          name: 'address_work',
          align: 'left',
          label: 'Dirección trabajo',
          field: 'address_work',
          sortable: true,
          visible: true,
        },
        {
          name: 'site_visit',
          align: 'left',
          label: 'Lugar de visita',
          field: 'site_visit',
          sortable: true,
          visible: true,
        },
        {
          name: 'observation',
          align: 'left',
          label: 'Observación',
          field: 'observation',
          sortable: true,
          visible: true,
        },
        /* {
          name: 'documentNumber',
          label: 'Documento',
          align: 'left',
          field: 'documentNumber',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        }, */
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'phone',
          align: 'left',
          label: 'Teléfono',
          field: 'phone',
          sortable: true,
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
          sortable: true,
          visible: true,
        },
        {
          name: 'cityName',
          align: 'left',
          label: 'Cuidad',
          field: 'cityName',
          sortable: true,
          visible: true,
        },
        {
          name: 'sectorName',
          align: 'left',
          label: 'Sector',
          field: 'sectorName',
          sortable: true,
          visible: true,
        },
        {
          name: 'districtGroup',
          align: 'left',
          label: 'Grupo',
          field: 'districtGroup',
          sortable: true,
          visible: true,
        },
        {
          name: 'districtOrder',
          align: 'left',
          label: 'Orden',
          field: 'districtOrder',
          sortable: true,
          visible: true,
        },
        /* {
          name: 'districtName',
          align: 'left',
          label: 'Barrio',
          field: 'districtName',
          sortable: true,
          visible: true,
        }, */
        {
          name: 'occupation',
          align: 'left',
          label: 'Ocupación',
          field: 'occupation',
          sortable: true,
          visible: true,
        },
        {
          name: 'userSendName',
          align: 'left',
          label: 'Enviado por',
          field: 'userSendName',
          sortable: true,
          visible: true,
        },
        {
          name: 'status',
          align: 'left',
          label: 'Estado',
          field: 'status',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
        },
      ],
      pagination: {
        rowsPerPage: 50,
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
    tab: {
      type: String,
      default: 'one',
    },
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
      await this.listUsersByRoleName({ roleName: 'Asesor', status: 1, city: this.citySelected });
      /* if (this.optionsSectors && this.optionsSectors.length > 0) {
        const hasItem = this.optionsSectors.some((sectors) => this.sectorSelected.includes(sectors.value));
        if (!hasItem) {
          this.sectorSelected = [];
        }
      } */
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
      'news',
      'responseMessages',
      'status',
      'new',
      'userSelectedReview',
      'sectorSelectedReview',
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
      let data = this.news.map((element) => ({
        ...element,
        date: formatDateWithTime(element.date),
        showEdit: element.status === 'creado',
        showDelete: element.status === 'creado',
        showChangeStatus: element.status === 'creado',
      }));
      if (this.citySelected > 0) {
        data = data.filter((item) => item.city === this.citySelected);
      }
      if (this.sectorSelected && this.sectorSelected.length > 0) {
        data = data.filter((item) => this.sectorSelected.includes(item.sector));
      }
      return data;
    },
    validatedPermissions() {
      const statusCreate = havePermission('new.create');
      const statusEdit = havePermission('new.update');
      const statusDelete = havePermission('new.delete');
      const statuschangeStatus = havePermission('new.changeStatus');
      const statusAllCities = havePermission('new.allCities');
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
        const items = this.news.filter(({ city }) => id === city);
        const label = `[ ${items.length} ] ${name}`;
        return {
          label,
          value: id,
        };
      });
    },
    optionsSectors() {
      return this.yards.map(({ name, id }) => {
        const items = this.news.filter(({ sector }) => id === sector);
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
        return this.userSelectedReview;
      },
      set(newValue) {
        this.updateUserSelectedReview(parseInt(newValue, 10));
      },
    },
    sectorSelected: {
      get() {
        return this.sectorSelectedReview;
      },
      set(newValue) {
        this.updateSectorSelectedReview(newValue);
      },
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
      updateUserSelectedReview: newTypes.actions.UPDATE_USER_SELECTED_REVIEW,
      updateSectorSelectedReview: newTypes.actions.UPDATE_SECTOR_SELECTED_REVIEW,
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
      this.typeActionFormNew = type;
      this.objSelected = { ...row };
      this.showModalFormNews = true;
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
      await this.listNews(this.tab === 'one' ? ['creado'] : ['pendiente']);
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
        attempts: this.tab === 'one' ? 1 : 2,
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
      await this.listZones();
      await this.listUsersByRoleName({ roleName: 'Asesor', status: 1, city: this.citySelected });
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
