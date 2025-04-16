<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
          outlined
          @keyup.enter="listNewsMounted"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
          <q-td key="letter" :props="props">
              ¿TENEMOS LA LETRA?: {{ props.row.has_letter === 1 ? 'SI' : 'NO' }} <br>
              FECHA DE RECEPCIÓN: {{ formatDateHour(props.row.date_received_letter) }}
              <camera-photo
                v-if="props.row.who_received_letter"
                :config="{
                  name: 'FOTO_RECEPCION_LETRA',
                  storage: 'news',
                  modelName: 'news',
                  modelId: props.row.id
                }"
                type="read"
                :showApprove="true"
                @updateStatus="savedFileLetterClient"
              />
          </q-td>
          <q-td key="name" :props="props" class="wrap-text">
            {{ props.row.name }}
          </q-td>
          <q-td key="status" :props="props" class="wrap-text">
            {{ props.row.status }}
          </q-td>
          <q-td key="who_received_letter" :props="props">
            {{ props.row.who_received_letter_name }}
          </q-td>
          <q-td key="address_house" :props="props" class="wrap-text">
            {{ props.row.address_house }}
            <br><b v-if="props.row.districtHouseName">Barrio: </b> {{ props.row.districtHouseName }}
          </q-td>
          <q-td key="address_work" :props="props" class="wrap-text">
            {{ props.row.address_work }}
            <br><b v-if="props.row.districtWorkName">Barrio: </b> {{ props.row.districtWorkName }}
          </q-td>
          <q-td key="observation" :props="props" class="wrap-text">
            {{ props.row.observation }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <form-address
      v-if="showModalFormNews"
      v-model="showModalFormNews"
      :type="typeActionFormNew"
      :obj="objSelected"
      @refreshList="listNewsMounted"
    />
    <cv
      v-model="showModalCv"
      v-if="showModalCv"
      :showTable="true"
      :hidePages="[]"
      :row="{ id: itemSelected.id, type_cv: itemSelected.type_cv }" />
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import FormAddress from 'src/components/new/FormAddress.vue';
import Cv from 'components/new/Cv.vue';
import commonTypes from '../../store/modules/common/types';
import newTypes from '../../store/modules/new/types';
import userTypes from '../../store/modules/user/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    FormAddress,
    CameraPhoto,
    Cv,
  },
  data() {
    return {
      obj: {},
      type: 'C',
      route: '/review',
      name: 'Revisión de información',
      columns: [
        {
          name: 'letter',
          label: 'Recepción letra',
          align: 'center',
          visible: false,
        },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          style: 'width: 200px',
          classes: 'ellipsis',
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
          name: 'who_received_letter',
          required: true,
          label: 'Recibido por',
          align: 'left',
          sortable: true,
        },
        {
          name: 'address_house',
          align: 'left',
          label: 'Dirección casa',
          field: 'address_house',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'address_work',
          align: 'left',
          label: 'Dirección trabajo',
          field: 'address_work',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'observation',
          align: 'left',
          label: 'Observación',
          field: 'observation',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      itemSelected: {},
      showModalFormNews: false,
      objSelected: {},
      typeActionFormNew: 'house',
      showModalCv: false,
    };
  },
  props: {
  },
  async mounted() {
    await this.listUsersByNameRole(({ roleName: 'Aprobador de recepcion de letras', status: 1, city: 0 }));
    await this.listNewsMounted();
  },
  watch: {
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    ...mapState(userTypes.PATH, [
      'users',
    ]),
    ...mapState(newTypes.PATH, [
      'news',
      'responseMessages',
      'status',
      'new',
    ]),
    dataTable() {
      const data = this.news.map((element) => ({
        ...element,
        date: formatDateWithTime(element.approved_date),
      }));
      return data.filter((d) => d.who_received_letter === this.user);
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
    title() {
      return '';
    },
    optionsUsers() {
      return Array.isArray(this.users)
        ? this.users.map(({ id, name }) => ({ label: name, value: id }))
        : [];
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNewsForLetter: newTypes.actions.LIST_NEWS_FOR_LETTER,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatDateHour(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    async openModal(action, row) {
      this.itemSelected = { ...row };
      if (action === 'cv') {
        this.showModalCv = true;
      }
    },
    isDateAllowed(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    clickEditAddress(row, type) {
      this.typeActionFormNew = type;
      this.objSelected = { ...row };
      this.showModalFormNews = true;
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
      showLoading('Consultando ...', 'Por favor, espere', true);
      await this.listNewsForLetter({
        status: ['consignado'],
      });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async save(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const item = {
        id: this.itemSelected.id,
      };
      item[field] = value.value ? value.value : value;
      await this.completeDataNew(item);
      await this.listNewsMounted();
      this.$q.loading.hide();
    },
    async savedFileLetterClient(data) {
      console.log(data);
      if (data.name) {
        showLoading('Guardando ...', 'Por favor, espere', true);
        /* const item = {
          id: this.itemSelected.id,
          has_letter: 1,
          who_received_letter: this.user,
          date_received_letter: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        };
        await this.completeDataNew(item); */
        await this.listNewsMounted();
        this.$q.loading.hide();
      }
    },
  },
};
</script>
<style scoped>
  .q-banner {
    width: 95% !important;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
