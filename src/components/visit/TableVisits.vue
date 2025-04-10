<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-11 text-center">
        <q-input
          dense
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-1 text-center">
        <q-btn
          round
          icon="refresh"
          class="q-my-xs"
          color="primary"
          title="Click para refrescar la tabla"
          @click="listMounted()">
        </q-btn>
      </div>
    </div>
    <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      class="q-mt-md"
      separator="cell"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            field="edit"
            label="Revisar"
            size="sm"
            :disabled="!validatedPermissions.review.status"
            :title="validatedPermissions.review.title"
            @click="showVisit(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-date="props">
        <q-td :props="props" @click="itemSelected = { ...props.row }">
          <q-icon size="xs" name="edit" />
          <q-popup-edit
            :value="props.row.date"
            v-slot="scope"
            @input="val => editDiary('date', val)"
            type="date"
            buttons>
            <q-date
              v-model="scope.value"
              mask="YYYY-MM-DD"
              dense
              default-view="Calendar"
              :options="isDateAllowed"
            />
          </q-popup-edit>
          {{ props.row.date }}
        </q-td>
      </template>
      <template v-slot:body-cell-new_status="props">
        <q-td :props="props">
          <q-badge :color="getColorStatus(props.row)">
            {{ props.row.new_status }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-new_name="props">
        <q-td class="wrap-text" :props="props">
          {{ props.row.new_name }}
        </q-td>
      </template>
      <template v-slot:body-cell-new_observation="props">
        <q-td class="wrap-text" :props="props">
          {{ props.row.new_observation }}
        </q-td>
      </template>
      <template v-slot:body-cell-address_house="props">
        <q-td class="wrap-text" :props="props">
          {{ props.row.address_house }}
        </q-td>
      </template>
      <template v-slot:body-cell-address_work="props">
        <q-td class="wrap-text" :props="props">
          {{ props.row.address_work }}
        </q-td>
      </template>
      <template v-slot:body-cell-new_occupation="props">
        <q-td class="wrap-text" :props="props">
          {{ props.row.new_occupation }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import diaryTypes from '../../store/modules/diary/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/list-visit',
      name: 'Lista de Visitas',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'new_status',
          align: 'left',
          label: 'Estado prestamo',
          field: 'new_status',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'status',
          align: 'left',
          label: 'Estado visita',
          field: 'status',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'new_name',
          align: 'left',
          label: 'Nombre',
          field: 'new_name',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'new_observation',
          align: 'left',
          label: 'Observación',
          field: 'new_observation',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'site_visit',
          align: 'left',
          label: 'Lugar visita',
          field: 'site_visit',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'address_house',
          align: 'left',
          label: 'Dir. Casa',
          field: 'address_house',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'address_work',
          align: 'left',
          label: 'Dir. Trabajo',
          field: 'address_work',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'new_occupation',
          align: 'left',
          label: 'Ocupación',
          field: 'new_occupation',
          sortable: true,
          visible: true,
          style: 'width: 200px',
        },
        {
          name: 'new_phone',
          align: 'left',
          label: 'Teléfono',
          field: 'new_phone',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'userName',
          align: 'left',
          label: 'Asesor',
          field: 'userName',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      data: [],
      polling: null,
      itemSelected: {},
    };
  },
  async mounted() {
    await this.listMounted();
    this.pollData();
  },
  computed: {
    ...mapState(diaryTypes.PATH, [
      'diaries',
      'responseMessages',
      'status',
      'diary',
    ]),
    validatedPermissions() {
      const statusReview = havePermission('visit.review');
      const statusVoucher = havePermission('visit.voucher');
      return {
        review: {
          title: statusReview ? 'Revisar visita' : 'No tiene permisos para revisar visitas',
          status: statusReview,
        },
        voucher: {
          title: statusVoucher ? 'Agregar voucher' : 'No tiene permisos para agregar voucher',
          status: statusVoucher,
        },
      };
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      listVisitsReview: diaryTypes.actions.LIST_VISITS_REVIEW,
      updateDiary: diaryTypes.actions.UPDATE_DIARY,
    }),
    isDateAllowed(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.listMounted();
      }, 60000);
    },
    getColorStatus(item) {
      let color = 'grey';
      if (item.new_status === 'aprobado' || item.new_status === 'consignado') {
        color = 'green';
      } else if (item.new_status === 'visitando') {
        color = 'blue';
      }
      return color;
    },
    async listMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listVisitsReview({
        date: new Moment(new Date()).format('YYYY-MM-DD'),
      });
      if (this.status === true) {
        this.data = this.diaries.map((element) => ({
          ...element,
          showEdit: true,
          showDelete: true,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    showVisit(row) {
      this.$router.push(`/review-visit/${row.new_id}`);
    },
    async editDiary(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);

      const data = {
        id: this.itemSelected.id,
        user_id: this.itemSelected.user_id,
        new_id: this.itemSelected.new_id,
        date: this.itemSelected.date,
        status: this.itemSelected.status,
        priority: this.itemSelected.priority,
      };

      data[field] = value.value ? value.value : value;
      console.log(data);
      await this.updateDiary(data);
      this.listMounted();
      this.$q.loading.hide();
    },
  },
  components: {
  },
};
</script>
<style scoped>
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
