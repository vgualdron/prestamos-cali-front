<template>
  <div class="q-px-md">
    <div class="row q-mt-md">
      <div class="col-12 text-center">
        <q-btn
          round
          icon="refresh"
          class="q-ml-md"
          color="primary"
          title="Click para refrescar la tabla"
          @click="initData()">
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
      row-key="order"
      striped
      grid
    >
    <!--items for small screens-->
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        >
          <q-card>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Código
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.district_order}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Cliente
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.new_name}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Nombre Ref
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.description_ref}} - {{ props.row.type_ref}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Fecha
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatDate(props.row.lending_first_date) }} - {{ formatDate(props.row.lending_end_date) }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Deuda
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatPrice(props.row.value) }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Ruta
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.listing_name }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item >
                <q-item-section>
                  <template>
                    <q-item-label>
                      Dirección
                    </q-item-label>
                    <q-item-label caption>
                      <a v-if="props.row.address_latitude" @click="generateLinkGoogleMaps(props.row)" class="link-style">
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </a>
                      <b v-else>
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </b>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Nota
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.new_observation }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn
                    class="q-mt-sm"
                    label="Foto de la casa"
                    color="primary"
                    @click="openModal('photo1', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Agregar pago"
                    color="green"
                    :disabled="!props.row.file_id"
                    @click="openModal('payment', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver nequis"
                    color="primary"
                    :disabled="!props.row.file_id"
                    @click="openModal('nequis', props.row)"
                  ></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
           </q-card>
        </div>
      </template>
    </q-table>
    <modal-list-nequi
      v-if="showModalNequis"
      v-model="showModalNequis"
      :listing="itemSelected.listing_id"/>
    <modal-add-payment
      v-if="showModalPaymentNequi"
      v-model="showModalPaymentNequi"
      :valuePayment="reddirection.value"
      :row="itemSelected"
      :isStreet="true"
      type="nequi"
      @updateTable="console.log('updateTable')"/>
    <modal-photo-house
      v-if="showModalPhotoHouse"
      v-model="showModalPhotoHouse"
      :config="{
        name: 'FOTO_CASA_REDDIRECTION',
        storage: 'reddirections',
        modelName: 'reddirections',
        modelId: reddirection.id
      }"
      @savedFile="updateData"
    />
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalListNequi from 'components/nequi/ModalListNequi.vue';
import ModalPhotoHouse from 'components/red/ModalPhotoHouse.vue';
import ModalAddPayment from 'components/payment/ModalAddPayment.vue';
import lendingTypes from '../../store/modules/lending/types';
import reddirectionTypes from '../../store/modules/reddirection/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  components: {
    ModalListNequi,
    ModalPhotoHouse,
    ModalAddPayment,
  },
  data() {
    return {
      typeDiary: 'readwrite',
      showModalDiary: false,
      obj: {},
      type: 'C',
      route: '/review',
      name: 'Revisión de información',
      columns: [],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      itemSelected: {},
      userSelected: 0,
      showModalFormNews: false,
      objSelected: {},
      typeActionFormNew: 'house',
      polling: null,
      showModalCardBoard: false,
      showModalCardBoardDouble: false,
      showModalHistory: false,
      showModalNequis: false,
      showModalPaymentNequi: false,
      showModalPhotoHouse: false,
      location: null,
    };
  },
  props: {
  },
  async mounted() {
    this.userSelected = parseInt(localStorage.getItem('userMC'), 10);
    await this.initData();
    this.pollData();
  },
  watch: {
  },
  computed: {
    ...mapState(lendingTypes.PATH, {
      lending: 'lending',
      lendings: 'lendings',
      history: 'history',
      lendingStatus: 'status',
      lendingResponseMessages: 'responseMessages',
    }),
    ...mapState(reddirectionTypes.PATH, {
      reddirection: 'reddirection',
      reddirectionStatus: 'status',
      reddirectionResponseMessages: 'responseMessages',
    }),
    dataTable() {
      if (!this.reddirection) {
        return [];
      }
      return [this.reddirection];
    },
    validatedPermissions() {
      const statusAllCities = havePermission('red.allCities');
      return {
        allCities: {
          title: statusAllCities ? 'Todas las ciudades' : 'No tiene permisos',
          status: statusAllCities,
        },
      };
    },
    title() {
      return '';
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(reddirectionTypes.PATH, {
      getCurrentByUser: reddirectionTypes.actions.GET_CURRENT_BY_USER,
      updateReddirection: reddirectionTypes.actions.UPDATE_REDDIRECTION,
    }),
    ...mapActions(lendingTypes.PATH, {
      getLending: lendingTypes.actions.GET_LENDING,
      fetchLendings: lendingTypes.actions.FETCH_LENDINGS,
      fetchHistory: lendingTypes.actions.FETCH_HISTORY,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    getRowClass(row) {
      let c = 'bg-white';
      if (row.is_current) {
        c = 'bg-blue-2';
      } else if (row.has_visited) {
        c = 'bg-grey-5';
      }
      return c;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.initData();
      }, 180000);
    },
    async openModal(action, row) {
      this.itemSelected = { ...row };
      console.log(this.itemSelected);
      if (action === 'nequis') {
        this.showModalNequis = true;
      } else if (action === 'payment') {
        this.itemSelected.id = row.lending_id;
        this.showModalPaymentNequi = true;
      } else if (action === 'photo1') {
        this.showModalPhotoHouse = true;
      }
    },
    async generateLinkGoogleMaps(row) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      const latIni = row.user_latitude;
      const lngIni = row.user_longitude;
      const latEnd = row.address_latitude;
      const lngEnd = row.address_longitude;

      const baseUrl = 'https://www.google.com/maps/dir/?api=1';
      const url = `${baseUrl}&origin=${latIni},${lngIni}&destination=${latEnd},${lngEnd}`;
      this.$q.loading.hide();
      window.open(url, '_blank');
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
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    formatDate(date) {
      return Moment(date).format('DD/MM/YYYY');
    },
    async initData() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.getCurrentByUser(this.userSelected);
      this.$q.loading.hide();
    },
    async updateData(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      const data = {
        ...this.reddirection,
        file_id: value.id,
        start_date: Moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await this.updateReddirection(data);
      await this.initData();
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
  .link-style {
    color: #1976D2; /* Color azul */
    text-decoration: underline; /* Subrayado */
    cursor: pointer; /* Cambio de cursor a mano */
  }
  .link-style:hover {
    text-decoration: none; /* Sin subrayado cuando el cursor pasa sobre el enlace */
  }
</style>
