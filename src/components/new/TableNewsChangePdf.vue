<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <q-banner class="bg-info text-white">
        Escribe alguna parte del nombre del cliente. Se mostraran máximo 5 registros para tener un buen rendimiento en la funcionalidad.
      </q-banner>
    </div>
    <div class="row q-mt-md">
      <div class="col-10 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="query"
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
      <div
        class="col-2
        text-center"
      >
        <q-btn
          round
          icon="search"
          class="q-mr-md"
          color="primary"
          :disabled="!query"
          title="Click para buscar"
          @click="listNewsMounted">
        </q-btn>
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
              class="q-mt-sm"
              label="Ver pdf"
              color="primary"
              @click="openModal('cv', props.row)"
            ></q-btn>
            <upload-pdf
              v-if="props.row.type_cv === 'pdf'"
              :config="{
              name: 'PDF_CV',
              storage: 'news',
              modelName: 'news',
              modelId: props.row.id
            }"
            />
          </q-td>
          <q-td key="letter" :props="props">
            ¿TENEMOS LA LETRA?: {{ props.row.has_letter === 1 ? 'SI' : 'NO' }} <br>
            FECHA DE RECEPCIÓN: {{ formatDateHour(props.row.date_received_letter) }}
            <upload-image
              :config="{
                name: 'FOTO_RECEPCION_LETRA',
                storage: 'news',
                modelName: 'news',
                modelId: props.row.id
              }"
              @savedFile="savedFileLetterClient"
            />
          </q-td>
          <q-td key="type_cv" :props="props">
            {{ props.row.type_cv }}
          </q-td>
          <q-td key="name" :props="props" class="wrap-text">
            {{ props.row.name }}
          </q-td>
          <q-td key="address_house" :props="props" @click="clickEditAddress(props.row, 'house')" class="wrap-text">
            <q-icon size="xs" name="edit"/>
            {{ props.row.address_house }}
            <br><b v-if="props.row.districtHouseName">Barrio: </b> {{ props.row.districtHouseName }}
          </q-td>
          <q-td key="address_work" :props="props" @click="clickEditAddress(props.row, 'work')" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.address_work }}
            <br><b v-if="props.row.districtWorkName">Barrio: </b> {{ props.row.districtWorkName }}
          </q-td>
          <q-td key="family_reference_address" :props="props" @click="clickEditAddress(props.row, 'ref1')" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.family_reference_address }}
            <br><b v-if="props.row.districtRef1Name">Barrio: </b> {{ props.row.districtRef1Name }}
          </q-td>
          <q-td key="family2_reference_address" :props="props" @click="clickEditAddress(props.row, 'ref2')" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.family2_reference_address }}
            <br><b v-if="props.row.districtRef2Name">Barrio: </b> {{ props.row.districtRef2Name }}
          </q-td>
          <q-td key="guarantor_address" :props="props" @click="clickEditAddress(props.row, 'guarantor')" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.guarantor_address }}
            <br><b v-if="props.row.districtGuarantorName">Barrio: </b> {{ props.row.districtGuarantorName }}
          </q-td>
          <q-td key="observation" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.observation }}
            <q-popup-edit :value="props.row.observation" v-slot="scope" buttons
              @input="val => save('observation', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.phone }}
            <q-popup-edit :value="props.row.phone" v-slot="scope" buttons
              @input="val => save('phone', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="occupation" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.occupation }}
            <q-popup-edit :value="props.row.occupation" v-slot="scope" buttons
              @input="val => save('occupation', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
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
import UploadPdf from 'components/common/UploadPdf.vue';
import UploadImage from 'components/common/UploadImage.vue';
import FormAddress from 'src/components/new/FormAddress.vue';
import Cv from 'components/new/Cv.vue';
import commonTypes from '../../store/modules/common/types';
import newTypes from '../../store/modules/new/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    FormAddress,
    UploadPdf,
    UploadImage,
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
          name: 'actions',
          label: 'PDF',
          align: 'center',
          visible: false,
        },
        {
          name: 'letter',
          label: 'Recepción letra',
          align: 'center',
          visible: false,
        },
        {
          name: 'type_cv',
          label: 'Tipo CV',
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
          name: 'family_reference_address',
          align: 'left',
          label: 'Dirección Ref 1',
          field: 'family_reference_address',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'family2_reference_address',
          align: 'left',
          label: 'Dirección Ref 2',
          field: 'family2_reference_address',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'guarantor_address',
          align: 'left',
          label: 'Dirección Fiador',
          field: 'guarantor_address',
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
        {
          name: 'phone',
          align: 'left',
          label: 'Teléfono',
          field: 'phone',
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
      query: 'a',
      showModalCv: false,
    };
  },
  props: {
  },
  async mounted() {
    await this.listNewsMounted();
  },
  watch: {
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    ...mapState(newTypes.PATH, [
      'news',
      'responseMessages',
      'status',
      'new',
      'userSelectedReview',
    ]),
    dataTable() {
      const data = this.news.map((element) => ({
        ...element,
        date: formatDateWithTime(element.date),
        showEdit: element.status === 'creado',
        showDelete: element.status === 'creado',
        showChangeStatus: element.status === 'creado',
      }));
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
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNewsForUpdate: newTypes.actions.LIST_NEWS_FOR_UPDATE,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
      completeDataNew: newTypes.actions.COMPLETE_DATA_NEW,
      updateUserSelectedReview: newTypes.actions.UPDATE_USER_SELECTED_REVIEW,
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
    openInGoogleMaps(userId) {
      const user = this.optionsUsers.find((u) => u.value === userId);
      if (user) {
        const googleMapsUrl = `https://www.google.com/maps?q=${user.latitude},${user.longitude}`;
        window.open(googleMapsUrl, '_blank');
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
      await this.listNewsForUpdate({
        status: ['consignado'],
        query: this.query,
      });
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
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
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async save(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      this.itemSelected[field] = value.value ? value.value : value;
      await this.completeDataNew(this.itemSelected);
      await this.listNewsMounted();
      this.$q.loading.hide();
    },
    async savedFileLetterClient(data) {
      console.log(data);
      console.log(moment);
      if (data.id) {
        showLoading('Guardando ...', 'Por favor, espere', true);
        const item = {
          id: this.itemSelected.id,
          has_letter: 1,
          who_received_letter: this.user,
          date_received_letter: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        };
        await this.completeDataNew(item);
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
