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
    <div class="row q-mt-md justify-center">
      <div class="col-6 text-center">
        <q-select
          outlined
          dense
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :readonly="!this.validatedPermissions.allCities.status"
          v-model="userSelected"
          :options="optionsUsers"/>
      </div>
    </div>
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
          class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 grid-style-transition"
        >
          <q-card>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Código
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.district_order}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Cliente
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.new_name}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Nombre Ref
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.description_ref}} - {{ props.row.type_ref}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Fecha
                    </q-item-label>
                    <q-item-label>
                      {{ formatDate(props.row.lending_first_date) }} - {{ formatDate(props.row.lending_end_date) }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Deuda
                    </q-item-label>
                    <q-item-label>
                      {{ formatPrice(props.row.value) }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Ruta
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.listing_name }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item >
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Dirección
                    </q-item-label>
                    <q-item-label>
                      <a v-if="props.row.address_latitude" @click="generateLinkGoogleMaps(props.row)" class="link-style">
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </a>
                      <p v-else>
                        {{ props.row.address }}, {{ props.row.district_name }}, {{ props.row.sector_name }}
                      </p>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Nota
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.new_observation }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Quien atendió de la visita?
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.attended }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Observación de la visita
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.observation }}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn
                    :disabled="props.row.file2_id"
                    class="q-mt-sm"
                    label="Foto de la casa"
                    color="primary"
                    @click="openModal('photo1', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Agregar pago"
                    color="green"
                    :disabled="!props.row.file_id || props.row.file2_id"
                    @click="openModal('payment', props.row)"
                  ></q-btn>
                  <!-- <q-btn
                    class="q-mt-sm"
                    label="Agregar pago con articulo"
                    color="green"
                    :disabled="!props.row.file_id || props.row.file2_id"
                    @click="openModal('article', props.row)"
                  ></q-btn> -->
                  <q-btn
                    class="q-mt-sm"
                    label="Agregar aviso"
                    color="black"
                    :disabled="!props.row.file_id || props.row.file2_id"
                    @click="openModal('warning', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Agregar video"
                    color="black"
                    :disabled="!props.row.file_id"
                    @click="openModal('video', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver cuentas para pagar"
                    color="primary"
                    @click="openModal('nequis', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver pdf"
                    color="primary"
                    @click="openModal('cv', props.row)"
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
      :collector="getLastCollectorId()"
      type="nequi"
      @addPayment="onAddPayment"/>
    <modal-add-payment
      v-if="showModalPaymentArticle"
      v-model="showModalPaymentArticle"
      :valuePayment="reddirection.value"
      :row="itemSelected"
      :isStreet="true"
      :collector="getLastCollectorId()"
      type="articulo"
      @addPayment="onAddPayment"/>
    <modal-photo
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
    <modal-photo
      v-if="showModalPhotoWarning"
      v-model="showModalPhotoWarning"
      :config="{
        name: 'FOTO_AVISO_REDDIRECTION',
        storage: 'reddirections',
        modelName: 'reddirections',
        modelId: reddirection.id
      }"
      @savedFile="updateDataWarning"
    />
    <modal-video
      v-if="showModalVideo"
      v-model="showModalVideo"
      :config="{
        name: 'VIDEO_SOLUCION_REDDIRECTION',
        storage: 'reddirections',
        modelName: 'reddirections',
        modelId: reddirection.id
      }"
      @savedFile="updateDataVideo"
    />
    <cv
      v-model="showModalCv"
      v-if="showModalCv"
      :showTable="false"
      :hidePages="[1]"
      :row="{ id: reddirection.new_id, type_cv: reddirection.new_type_cv }" />
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import Cv from 'components/new/Cv.vue';
import ModalListNequi from 'components/nequi/ModalListNequi.vue';
import ModalPhoto from 'src/components/red/ModalPhoto.vue';
import ModalVideo from 'src/components/red/ModalVideo.vue';
import ModalAddPayment from 'components/payment/ModalAddPayment.vue';
import lendingTypes from '../../store/modules/lending/types';
import reddirectionTypes from '../../store/modules/reddirection/types';
import zoneTypes from '../../store/modules/zone/types';
import userTypes from '../../store/modules/user/types';
import commonTypes from '../../store/modules/common/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  components: {
    ModalListNequi,
    ModalPhoto,
    ModalVideo,
    ModalAddPayment,
    Cv,
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
      showModalPhotoWarning: false,
      showModalPaymentArticle: false,
      showModalVideo: false,
      showModalCv: false,
      location: null,
      citySelected: 0,
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
      this.$q.loading.hide();
    },
    async userSelected(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.getCurrentByUser(value);
      this.$q.loading.hide();
    },
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
    }),
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
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    optionsZones() {
      const isAll = this.validatedPermissions.allCities.status;
      let cities = [...this.zones];
      if (!isAll) {
        cities = this.zones.filter((zone) => zone.id === this.citySelected);
      }
      return cities.map(({ name, id }) => {
        const label = name;
        return {
          label,
          value: id,
        };
      });
    },
    optionsUsers() {
      return this.users.map(({ name, id, sector_name_collector }) => {
        const label = `${name} (${sector_name_collector || 'X'})`;
        return {
          label,
          name,
          value: id,
        };
      });
    },
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
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
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
      }, 120000);
    },
    getLastCollectorId() {
      let id = null;
      if (this.user) {
        id = this.user;
      }
      return id;
    },
    async openModal(action, row) {
      this.itemSelected = { ...row };
      if (action === 'nequis') {
        this.showModalNequis = true;
      } else if (action === 'payment') {
        this.itemSelected.id = row.lending_id;
        this.showModalPaymentNequi = true;
      } else if (action === 'article') {
        this.itemSelected.id = row.lending_id;
        this.showModalPaymentArticle = true;
      } else if (action === 'photo1') {
        this.showModalPhotoHouse = true;
      } else if (action === 'warning') {
        this.showModalPhotoWarning = true;
      } else if (action === 'video') {
        this.showModalVideo = true;
      } else if (action === 'cv') {
        this.showModalCv = true;
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
      await this.listZones();
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      const u = parseInt(localStorage.getItem('userMC'), 10);
      if (u) {
        const hasUser = this.optionsUsers.find((us) => us.value === u);
        if (hasUser) {
          this.userSelected = u;
        }
      }
      await this.getCurrentByUser(this.userSelected);
      this.$q.loading.hide();
    },
    async updateData(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      console.log(value);
      const data = {
        id: this.reddirection.id,
        file_id: value.id,
        start_date: Moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await this.updateReddirection(data);
      await this.initData();
      this.$q.loading.hide();
    },
    async updateDataWarning(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      const data = {
        id: this.reddirection.id,
        file2_id: value.id,
        attended: 'vacio',
        solution: 'aviso',
        end_date: Moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await this.updateReddirection(data);
      await this.initData();
      this.$q.loading.hide();
    },
    async updateDataVideo(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      const data = {
        id: this.reddirection.id,
        file3_id: value.id,
        end_date: Moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await this.updateReddirection(data);
      await this.initData();
      this.$q.loading.hide();
    },
    async onAddPayment(value) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      const data = {
        id: this.reddirection.id,
        file2_id: value.idFile,
        solution: 'pago',
        end_date: Moment().format('YYYY-MM-DD HH:mm:ss'),
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
