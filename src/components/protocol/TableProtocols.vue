<template>
  <div class="q-pa-md w-100">
    <div class="row q-mt-md">
      <div class="col-6 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="date"
          class="q-ml-xs"
          placeholder="Buscar"
          type="date"
          clearable
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-2 text-center">
        <q-btn
          round
          icon="refresh"
          class=""
          color="primary"
          title="Click para refrescar la tabla"
          @click="getWorkplans(date)">
        </q-btn>
      </div>
    </div>
    <q-markup-table
      v-if="workplans && workplans.length > 0"
      class="markup-table"
      separator="cell"
      dense
    >
      <thead>
        <tr>
          <th v-for="(value, key) in Object.keys(workplans[0])" :key="`th_${key}`">
            {{ value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="workplan in workplans" :key="`tr_step_${workplan.step_id}`">
          <td
            v-for="(value, key) in workplan"
            :key="`td_${key}_${workplan.step_id}`"
            :class="getClassTd(value.toString())"
            @click="updateTd(value.toString())">
            {{ getValueTd(value) }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import commonTypes from '../../store/modules/common/types';
import workplanTypes from '../../store/modules/workplan/types';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      location: null,
      polling: null,
    };
  },
  props: {
  },
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.getWorkplans(this.date);
    this.pollData();
    this.$q.loading.hide();
  },
  watch: {
    async date(val) {
      await this.getWorkplans(val);
    },
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    ...mapState(workplanTypes.PATH, [
      'workplans',
    ]),
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(workplanTypes.PATH, {
      fetchWorkplans: workplanTypes.actions.FETCH_WORKPLANS,
      updateWorkplan: workplanTypes.actions.UPDATE_WORKPLAN,
    }),
    hasPermission(value) {
      return havePermission(value);
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getWorkplans(this.date);
      }, 180000);
    },
    getClassTd(value) {
      let c = '';
      if (value.includes('realizado')) {
        c = 'cursor-pointer bg-blue-4';
      } else if (value.includes('aprobado')) {
        c = 'cursor-pointer bg-green-4';
      }
      return c;
    },
    formatLink(row) {
      if (row.file) {
        return `${process.env.URL_FILES}${row.file.url}`;
      }
      return '';
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async getWorkplans(date) {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.fetchWorkplans(date);
      this.$q.loading.hide();
    },
    async updateTd(value) {
      let status = 'none';
      if (value.includes('realizado')) {
        status = 'aprobado';
      } else if (value.includes('aprobado')) {
        status = 'realizado';
      }
      if (status !== 'none') {
        const data = value.split('-');
        await this.saveWorkPlan(data[0], status);
      }
    },
    getValueTd(value) {
      let status = '';
      if (value.toString().includes('realizado')) {
        status = 'realizado';
      } else if (value.toString().includes('aprobado')) {
        status = 'aprobado';
      }
      if (status === '') {
        const data = value.toString().split('-');
        [status] = data;
      }
      return status !== '0' ? status : '';
    },
    async saveWorkPlan(id, status) {
      this.$q.dialog({
        title: 'Aprobar protocolo',
        message: 'Está seguro que desea aprobar el protocolo?',
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
        await this.updateWorkplan({
          id,
          status,
          approved_date: moment().format('YYYY-MM-DD HH:mm:ss'),
          approved_by: this.user,
        });
        this.$q.loading.hide();
        await this.getWorkplans(this.date);
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
  },
  components: {
  },
};
</script>
<style scoped>
  .markup-table {
    display: block;
    border: solid 1px black;
    width: 95%;
    margin: 20px;
  }
  .markup-table td, th {
    text-align: center;
    border: solid 1px black;
  }
  .markup-table .cursor-pointer {
    cursor: pointer;
  }
</style>
