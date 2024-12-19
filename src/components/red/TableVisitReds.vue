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
              <q-item v-ripple>
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
              <q-item v-ripple>
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
              <q-item v-ripple>
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
              <q-item v-ripple>
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
              <q-item v-ripple>
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
              <q-item v-ripple>
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
              <q-item v-ripple>
                <q-item-section>
                  <template>
                    <q-item-label>
                      Dirección
                    </q-item-label>
                    <q-item-label caption>
                      <a v-if="props.row.address_latitude" :href="generateLinkGoogleMaps(props.row)" target="_blank">
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </a>
                      <b v-else target="_blank">
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </b>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
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
                    label="Ver nequis"
                    size="xs"
                    color="primary"
                    @click="openModal('nequis', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    icon="delete"
                    size="xs"
                    color="red"
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
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalListNequi from 'components/nequi/ModalListNequi.vue';
import lendingTypes from '../../store/modules/lending/types';
import reddirectionTypes from '../../store/modules/reddirection/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  components: {
    ModalListNequi,
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
          name: 'collector_name',
          label: 'Cobrador',
          align: 'center',
          field: 'collector_name',
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
          style: 'max-width: 300px',
          visible: true,
        },
        {
          name: 'total_value',
          align: 'center',
          label: 'Valor',
          field: 'total_value',
          visible: true,
        },
        {
          name: 'firstDate',
          align: 'center',
          label: 'Fecha ini',
          field: 'firstDate',
          visible: true,
        },
        {
          name: 'endDate',
          align: 'center',
          label: 'Fecha fin',
          field: 'endDate',
          visible: true,
        },
        {
          name: 'remaining_balance',
          align: 'center',
          label: 'Deuda',
          field: 'remaining_balance',
          visible: true,
        },
        {
          name: 'listing_name',
          align: 'center',
          label: 'Ruta',
          field: 'listing_name',
          visible: true,
        },
        {
          name: 'address_name',
          align: 'left',
          label: 'Nombre REF',
          field: 'address_name',
          style: 'max-width: 300px',
          visible: true,
        },
        {
          name: 'address_type',
          align: 'center',
          label: 'Tipo',
          field: 'address_type',
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
          style: 'max-width: 300px',
          visible: true,
        },
        {
          name: 'news_observation',
          align: 'center',
          label: 'Nota',
          field: 'news_observation',
          visible: true,
        },
      ],
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
      if (action === 'nequis') {
        this.showModalNequis = true;
      }
    },
    async getLocation() {
      try {
        if (navigator.geolocation) {
          // Usamos una promesa para envolver el método getCurrentPosition
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          // Almacenamos la latitud y longitud
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          this.error = 'Unable to retrieve location. Please allow access.';
        }
      } catch (err) {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    async generateLinkGoogleMaps(row) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.getLocation();
      const {
        latitude,
        longitude,
      } = this.location;

      const latIni = latitude;
      const lngIni = longitude;
      const latEnd = row.address_latitude;
      const lngEnd = row.address_longitude;

      const baseUrl = 'https://www.google.com/maps/dir/?api=1';
      const url = `${baseUrl}&origin=${latIni},${lngIni}&destination=${latEnd},${lngEnd}`;
      this.$q.loading.hide();
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
    async addRedcollector() {
      this.$q.dialog({
        title: 'Asignar',
        message: 'Está seguro que desea asignar el sector al cobrador?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.saveRedcollector({
          collector_id: this.userSelected,
        });
        this.showNotification(this.redcollectorResponseMessages, this.redcollectorStatus, 'top-right', 5000);
        await this.initData();
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
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
