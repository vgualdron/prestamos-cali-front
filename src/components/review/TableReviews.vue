<template>
  <div class="">
    <!-- <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-input
          outlined
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div> -->
    <div class="row q-mt-md justify-center">
      <div class="col-4">
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
        <q-option-group
          v-model="userSelected"
          :options="optionsUsers"
          color="primary"
          type="radio"
          inline
        />
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
              :disabled="!validatedPermissions.changeStatus.status"
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
              :disabled="!validatedPermissions.changeStatusPending.status"
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
              :disabled="!validatedPermissions.changeStatusReject.status"
              :title="validatedPermissions.changeStatusReject.title"
              @click="changeStatus(props.row, 'rechazado')"
              round
            />
          </q-td>
          <q-td key="observation" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.observation }}
            <q-popup-edit :value="props.row.observation" v-slot="scope" buttons
              @input="val => save('observation', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="documentNumber" :props="props">
           {{ props.row.documentNumber }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="cityName" :props="props">
            {{ props.row.cityName }}
          </q-td>
          <q-td key="sectorName" :props="props">
            {{ props.row.sectorName }}
          </q-td>
          <q-td key="district" :props="props">
            {{ props.row.district }}
          </q-td>
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
          <q-td key="family_reference_document_number" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.family_reference_document_number }}
            <q-popup-edit :value="props.row.family_reference_document_number" v-slot="scope" buttons
              @input="val => save('family_reference_document_number', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="family_reference_name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.family_reference_name }}
            <q-popup-edit :value="props.row.family_reference_name" v-slot="scope" buttons
              @input="val => save('family_reference_name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="family_reference_phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.family_reference_phone }}
            <q-popup-edit :value="props.row.family_reference_phone" v-slot="scope" buttons
              @input="val => save('family_reference_phone', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="family_reference_address" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.family_reference_address }}
            <q-popup-edit :value="props.row.family_reference_address" v-slot="scope" buttons
              @input="val => save('family_reference_address', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="personal_reference_document_number" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.personal_reference_document_number }}
            <q-popup-edit :value="props.row.personal_reference_document_number" v-slot="scope" buttons
              @input="val => save('personal_reference_document_number', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="personal_reference_name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.personal_reference_name }}
            <q-popup-edit :value="props.row.personal_reference_name" v-slot="scope" buttons
              @input="val => save('personal_reference_name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="personal_reference_phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.personal_reference_phone }}
            <q-popup-edit :value="props.row.personal_reference_phone" v-slot="scope" buttons
              @input="val => save('personal_reference_phone', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="personal_reference_address" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.personal_reference_address }}
            <q-popup-edit :value="props.row.personal_reference_address" v-slot="scope" buttons
              @input="val => save('personal_reference_address', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="guarantor_document_number" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.guarantor_document_number }}
            <q-popup-edit :value="props.row.guarantor_document_number" v-slot="scope" buttons
              @input="val => save('guarantor_document_number', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="guarantor_name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.guarantor_name }}
            <q-popup-edit :value="props.row.guarantor_name" v-slot="scope" buttons
              @input="val => save('guarantor_name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="guarantor_phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.guarantor_phone }}
            <q-popup-edit :value="props.row.guarantor_phone" v-slot="scope" buttons
              @input="val => save('guarantor_phone', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="guarantor_address" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.guarantor_address }}
            <q-popup-edit :value="props.row.guarantor_address" v-slot="scope" buttons
              @input="val => save('guarantor_address', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
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
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalDiary from 'components/diary/ModalDiary.vue';
import newTypes from '../../store/modules/new/types';
import zoneTypes from '../../store/modules/zone/types';
import yardTypes from '../../store/modules/yard/types';
import userTypes from '../../store/modules/user/types';
import diaryTypes from '../../store/modules/image/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    ModalDiary,
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
          name: 'observation',
          align: 'left',
          label: 'Observación',
          field: 'observation',
          sortable: true,
          visible: true,
        },
        {
          name: 'documentNumber',
          label: 'Documento',
          align: 'left',
          field: 'documentNumber',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
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
          name: 'district',
          align: 'left',
          label: 'Barrio',
          field: 'district',
          sortable: true,
          visible: true,
        },
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
        {
          name: 'family_reference_document_number',
          label: 'Documento ref familiar',
          align: 'left',
          field: 'family_reference_document_number',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'family_reference_name',
          align: 'left',
          label: 'Nombre ref familiar',
          field: 'family_reference_name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'family_reference_phone',
          align: 'left',
          label: 'Teléfono ref familiar',
          field: 'family_reference_phone',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'family_reference_address',
          align: 'left',
          label: 'Dirección ref familiar',
          field: 'family_reference_address',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'personal_reference_document_number',
          label: 'Documento ref personal',
          align: 'left',
          field: 'personal_reference_document_number',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'personal_reference_name',
          align: 'left',
          label: 'Nombre ref personal',
          field: 'personal_reference_name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'personal_reference_phone',
          align: 'left',
          label: 'Teléfono ref personal',
          field: 'personal_reference_phone',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'personal_reference_address',
          align: 'left',
          label: 'Dirección ref personal',
          field: 'personal_reference_address',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'guarantor_document_number',
          label: 'Documento fiador',
          align: 'left',
          field: 'guarantor_document_number',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'guarantor_name',
          align: 'left',
          label: 'Nombre fiador',
          field: 'guarantor_name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'guarantor_phone',
          align: 'left',
          label: 'Teléfono fiador',
          field: 'guarantor_phone',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'guarantor_address',
          align: 'left',
          label: 'Dirección fiador',
          field: 'guarantor_address',
          style: 'max-width: 300px',
          classes: 'ellipsis',
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
      sectorSelected: [],
      userSelected: null,
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
    await this.validateLogin();
  },
  watch: {
    async citySelected(newVal) {
      this.sectorSelected = [];
      this.userSelected = [];
      showLoading('Cargando ...', 'Por favor, espere', true);
      this.listYardsByZone({ id: newVal, displayAll: 1 });
      await this.listUsersByRoleName({ roleName: 'Prestador', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        this.userSelected = this.optionsUsers[0].value;
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
      };
    },
    optionsZones() {
      return this.zones.map(({ name, id }) => {
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
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
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
    async validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        showLoading('Cargando ...', 'Por favor, espere', true);
        await this.listNewsMounted();
        await this.listZones();
        await this.listUsersByRoleName({ roleName: 'Prestador', status: 1, city: this.citySelected });
        this.$q.loading.hide();
        if (this.optionsUsers && this.optionsUsers.length > 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
      } else {
        this.$router.push('/');
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
