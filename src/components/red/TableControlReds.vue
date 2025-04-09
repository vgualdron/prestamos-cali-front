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
    <div v-show="false" class="row q-mt-md">
      <div class="col-12 text-center">
        <q-option-group
          v-model="sectorSelected"
          :options="optionsSectors"
          color="primary"
          inline
        />
        <q-badge class="cursor-pointer" outline color="primary" label="Ver todos" @click="viewAll"/>
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
      v-if="reddirection && reddirection.id && !isLoading"
      :data="dataTable"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      :title="title"
      separator="cell"
      class="q-mt-md xxx"
      row-key="order"
      striped
      grid
    >
    <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 grid-style-transition">
          <q-card>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Cobrador
                    </q-item-label>
                    <q-item-label>
                      {{ props.row.collector_name}}
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
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
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Quien atendió de la visita?
                    </q-item-label>
                    <q-item-label>
                      <q-icon size="xs" name="edit" />
                      {{ props.row.attended }}
                      <q-popup-edit :value="props.row.attended" v-slot="scope" buttons
                        @input="val => saveDate('attended', val)">
                        <q-option-group
                          v-model="scope.value"
                          :options="[
                            {
                              label: 'vacio',
                              value: 'vacio'
                            },
                            {
                              label: 'cliente',
                              value: 'cliente'
                            },
                            {
                              label: 'fiador',
                              value: 'fiador',
                            },
                            {
                              label: 'familiar',
                              value: 'familiar',
                            },
                            {
                              label: 'otro',
                              value: 'otro',
                            },
                          ]"
                          color="primary"
                        />
                      </q-popup-edit>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Solución
                    </q-item-label>
                    <q-item-label>
                      <q-icon size="xs" name="edit" />
                      {{ props.row.solution }}
                      <q-popup-edit :value="props.row.solution" v-slot="scope" buttons
                        @input="val => saveDate('solution', val)">
                        <q-option-group
                          v-model="scope.value"
                          :options="[
                            {
                              label: 'acuerdo',
                              value: 'acuerdo'
                            },
                            {
                              label: 'pago',
                              value: 'pago'
                            },
                            {
                              label: 'aviso',
                              value: 'aviso',
                            },
                            {
                              label: 'no paga',
                              value: 'no paga',
                            },
                          ]"
                          color="primary"
                        />
                      </q-popup-edit>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Observación de la visita
                    </q-item-label>
                    <q-item-label>
                      <q-icon size="xs" name="edit" />
                      {{ props.row.observation }}
                      <q-popup-edit :value="props.row.observation" v-slot="scope" buttons
                        @input="val => saveDate('observation', val)">
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Foto de la casa
                    </q-item-label>
                    <q-item-label>
                      <camera-photo
                        :config="{
                          name: 'FOTO_CASA_REDDIRECTION',
                          storage: 'reddirections',
                          modelName: 'reddirections',
                          modelId: reddirection.id
                        }"
                        type="read"
                        :showApprove="reddirection.start_date != null"
                        @updateStatus="updateStatusFile"
                      />
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Foto de la solución
                    </q-item-label>
                    <q-item-label>
                      <camera-photo
                        :config="{
                          name: 'FOTO_AVISO_REDDIRECTION',
                          storage: 'reddirections',
                          modelName: 'reddirections',
                          modelId: reddirection.id
                        }"
                        type="read"
                        :showApprove="false"
                      />
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item class="bg-blue-1">
                <q-item-section>
                  <template>
                    <q-item-label class="text-bold">
                      Video
                    </q-item-label>
                    <q-item-label>
                      <camera-video
                        :config="{
                          name: 'VIDEO_SOLUCION_REDDIRECTION',
                          storage: 'reddirections',
                          modelName: 'reddirections',
                          modelId: reddirection.id
                        }"
                        type="read"
                        :showApprove="false"
                      />
                    </q-item-label>
                  </template>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver cartulina"
                    color="primary"
                    @click="openModal('normal', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver cartulina doble interes"
                    color="primary"
                    @click="openModal('double', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver historial de prestamos"
                    color="primary"
                    @click="openModal('history', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver hoja de vida"
                    color="primary"
                    @click="openModal('cv', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver visitas"
                    color="primary"
                    @click="openModal('reddirections', props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-mt-sm"
                    label="Ver cuentas para pagar"
                    color="primary"
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
    <modal-card-board
      v-if="showModalCardBoard"
      v-model="showModalCardBoard"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      title="Cartulina actual"
      :lendings="[lending]"/>
    <modal-card-board
      v-if="showModalCardBoardDouble"
      v-model="showModalCardBoardDouble"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="true"
      title="Cartulina doble interés"
      :lendings="[lending]"/>
    <modal-card-board
      v-if="showModalHistory"
      v-model="showModalHistory"
      :showBtnDownload="true"
      :showBtnApplyDoubleInterest="false"
      :hasDoubleInterest="false"
      title="Historial"
      :lendings="history"/>
    <cv
      v-model="showModalCv"
      v-if="showModalCv"
      :row="itemSelected"
      :onlyTable="true"/>
    <modal-list-visits
      v-model="showModalListVisits"
      v-if="showModalListVisits"
      :items="reddirections"/>
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import ModalListNequi from 'components/nequi/ModalListNequi.vue';
import ModalCardBoard from 'components/lending/ModalCardBoard.vue';
import ModalListVisits from 'components/red/ModalListVisits.vue';
import CameraPhoto from 'components/common/CameraPhoto.vue';
import CameraVideo from 'components/common/CameraVideo.vue';
import Cv from 'components/new/Cv.vue';
import newTypes from '../../store/modules/new/types';
import zoneTypes from '../../store/modules/zone/types';
import yardTypes from '../../store/modules/yard/types';
import userTypes from '../../store/modules/user/types';
import lendingTypes from '../../store/modules/lending/types';
import redcollectorTypes from '../../store/modules/redcollector/types';
import reddirectionTypes from '../../store/modules/reddirection/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  components: {
    ModalListNequi,
    ModalCardBoard,
    ModalListVisits,
    Cv,
    CameraPhoto,
    CameraVideo,
  },
  data() {
    return {
      typeDiary: 'readwrite',
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
        {
          name: 'attended',
          align: 'center',
          label: 'Atendido por',
          field: 'attended',
          visible: true,
        },
        {
          name: 'solution',
          align: 'center',
          label: 'Solución',
          field: 'solution',
          visible: true,
        },
        {
          name: 'observation',
          align: 'center',
          label: 'Observación',
          field: 'observation',
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
      polling: null,
      showModalCardBoard: false,
      showModalCardBoardDouble: false,
      showModalHistory: false,
      showModalNequis: false,
      showModalCv: false,
      showModalListVisits: false,
      isLoading: false,
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
    async citySelected(newVal) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      this.sectorSelected = null;
      await this.listYardsByZone({ id: newVal, displayAll: 1 });
      await this.listUsersByRoleName({ roleName: 'Cobrador', status: 1, city: this.citySelected });
      if (this.optionsUsers && this.optionsUsers.length > 0) {
        const users = this.optionsUsers.filter((user) => parseInt(user.value, 10) === parseInt(this.userSelected, 10));
        if (users.length === 0) {
          this.userSelected = this.optionsUsers[0].value;
        }
      }
      await this.listNewsMounted();
      this.$q.loading.hide();
    },
    async userSelected() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listNewsMounted();
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
    ...mapState(lendingTypes.PATH, {
      lending: 'lending',
      lendings: 'lendings',
      history: 'history',
      lendingStatus: 'status',
      lendingResponseMessages: 'responseMessages',
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
    ...mapState(redcollectorTypes.PATH, {
      redcollectorStatus: 'status',
      redcollectorResponseMessages: 'responseMessages',
    }),
    ...mapState(reddirectionTypes.PATH, {
      reddirection: 'reddirection',
      reddirections: 'reddirections',
      reddirectionStatus: 'status',
      reddirectionResponseMessages: 'responseMessages',
    }),
    labelBtnAsig() {
      let label = 'Asignar';
      const user = this.optionsUsers.find((option) => option.value === this.userSelected);
      const sector = this.optionsSectors.find((option) => option.value === this.sectorSelected);
      if (user && sector) {
        label = `Asignar sector de ${sector.label} a cobrador ${user.label}`;
      }
      return label;
    },
    dataTable() {
      if (!this.reddirection) {
        return [];
      }
      return [this.reddirection];
    },
    validatedPermissions() {
      const statusAllCities = havePermission('red.allCityControl');
      return {
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
        // const items = this.newsReds.filter(({ city_id }) => id === city_id);
        const label = `${name}`;
        return {
          label,
          value: id,
        };
      });
    },
    optionsSectors() {
      return this.yards.map(({ name, id }) => {
        // const items = this.newsReds.filter(({ sector_id }) => id === sector_id);
        const label = `${name}`;
        return {
          label,
          name,
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
        this.updateSectorSelectedReds(parseInt(newValue, 10));
      },
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNewsReds: newTypes.actions.LIST_NEWS_REDS,
      updateUserSelectedReds: newTypes.actions.UPDATE_USER_SELECTED_REDS,
      updateSectorSelectedReds: newTypes.actions.UPDATE_SECTOR_SELECTED_REDS,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    ...mapActions(yardTypes.PATH, {
      listYardsByZone: yardTypes.actions.LIST_YARDS_BY_ZONE,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByRoleName: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    ...mapActions(redcollectorTypes.PATH, {
      saveRedcollector: redcollectorTypes.actions.SAVE_REDCOLLECTOR,
    }),
    ...mapActions(reddirectionTypes.PATH, {
      getByLending: reddirectionTypes.actions.GET_BY_LENDING,
      saveReddirection: reddirectionTypes.actions.SAVE_REDDIRECTION,
      getCurrentByUser: reddirectionTypes.actions.GET_CURRENT_BY_USER,
      updateReddirection: reddirectionTypes.actions.UPDATE_REDDIRECTION,
    }),
    ...mapActions(lendingTypes.PATH, {
      getLending: lendingTypes.actions.GET_LENDING,
      fetchLendings: lendingTypes.actions.FETCH_LENDINGS,
      fetchHistory: lendingTypes.actions.FETCH_HISTORY,
    }),
    openInGoogleMaps(userId) {
      const user = this.optionsUsers.find((u) => u.value === userId);
      if (user) {
        const googleMapsUrl = `https://www.google.com/maps?q=${user.latitude},${user.longitude}`;
        window.open(googleMapsUrl, '_blank');
      }
    },
    getUrlFile(row, field) {
      return `${process.env.URL_FILES}${row[field]}`;
    },
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
      }, 300000);
    },
    async openModal(action, row) {
      this.itemSelected = { ...row };
      if (action === 'normal') {
        showLoading('consultando ...', 'Por favor, espere', true);
        await this.getLending(row.lending_id);
        this.$q.loading.hide();
        this.showModalCardBoard = true;
      } else if (action === 'double') {
        showLoading('consultando ...', 'Por favor, espere', true);
        await this.getLending(row.lending_id);
        this.$q.loading.hide();
        this.showModalCardBoardDouble = true;
      } else if (action === 'history') {
        showLoading('consultando ...', 'Por favor, espere', true);
        await this.fetchHistory(row.new_id);
        this.$q.loading.hide();
        this.showModalHistory = true;
      } else if (action === 'nequis') {
        this.showModalNequis = true;
      } else if (action === 'cv') {
        this.itemSelected = {
          id: row.new_id,
          type_cv: row.new_type_cv,
        };
        this.showModalCv = true;
      } else if (action === 'reddirections') {
        showLoading('consultando ...', 'Por favor, espere', true);
        await this.getByLending(row.lending_id);
        this.$q.loading.hide();
        this.showModalListVisits = true;
      }
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
      return Moment(date).format('DD/MM/YYYY');
    },
    async listNewsMounted() {
      this.isLoading = true;
      await this.getCurrentByUser(this.userSelected);
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.isLoading = false;
    },
    async initData() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listNewsMounted();
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
    async saveDate(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      const item = { id: this.reddirection.id };
      item[field] = (value && value.value) ? value.value : value;
      await this.updateReddirection(item);
      await this.listNewsMounted();
      this.$q.loading.hide();
    },
    async updateStatusFile({ name, field, value }) {
      if (name === 'FOTO_CASA_REDDIRECTION' && field === 'status') {
        if (value === 'rechazado') {
          this.saveDate('start_date', null);
        }
      }
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
