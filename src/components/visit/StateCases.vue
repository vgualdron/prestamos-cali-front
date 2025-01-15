<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="formatData"
      node-key="label"
      class="markup-table q-mt-md"
      accordion
    >
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <div>
            <b>{{ prop.node.label }}</b>
            <br>Nombre:
            <b>
              {{ item.name }}
            </b>
            <br>Estado:
            <q-badge :color="getColorStatus(item)">
              {{ item.status }}
            </q-badge>
            <br>Fecha inicio:
            <q-badge color="black">
              {{ formatDate(item.visit_start_date) }}
            </q-badge>
            <br>Pasos Completados:
            <q-badge :color="prop.node.completed > 2 ? 'green' : 'red'">
              {{ prop.node.completed }}
            </q-badge>
          </div>
        </div>
      </template>

      <template v-slot:header-generic="prop">
        <div class="row items-center" v-if="prop.node.check">
          <q-icon name="circle" color="green" size="12px" class="q-mr-sm" />
          <div class="text-weight-bold text-primary">
            {{ prop.node.label }}
            <q-icon name="check" color="green" />
          </div>
        </div>
        <div class="row items-center" v-else>
          <q-icon name="circle" color="red" size="12px" class="q-mr-sm" />
          <div class="text-black">
            {{ prop.node.label }}
          </div>
        </div>
      </template>

      <template v-slot:body-story="prop">
        <span class="text-weight-thin">The story is:</span> {{ prop.node.header }}
      </template>

      <template v-slot:body-toggle="prop">
        <p class="text-caption">{{ prop.node.caption }}</p>
      </template>
    </q-tree>
    <q-input
      :disable="type !== 'review' || item.status === 'rechazado'"
      outlined
      v-model.trim="novel_observation"
      label="Observación"
      lazy-rules
      hide-bottom-space
      hint="Debe poner una observación para poder rechazar la visita, la observación minimo debe tener 5 caracteres"
      autocomplete="off"
    />
    <br>
    <q-btn
      v-if="type === 'review' && approvable && item.status != 'aprobado' && item.status != 'consignado'"
      label="APROBAR VISITA"
      class="q-mt-xs text-center"
      color="green"
      size="md"
      @click="approve('aprobado')">
    </q-btn>
    <q-btn
      v-if="type === 'review' && item.status == 'visitando'"
      label="RECHAZAR VISITA"
      class="q-ml-sm q-mt-xs text-center"
      color="red"
      size="md"
      :disable="!novel_observation || novel_observation.length < 5"
      @click="approve('rechazado')">
    </q-btn>
    <q-btn
      v-if="type === 'review' && item.status == 'visitando'"
      label="RECHAZAR VISITA"
      class="q-ml-sm q-mt-xs text-center"
      color="red"
      size="md"
      :disable="!novel_observation || novel_observation.length < 5">
    </q-btn>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import diaryTypes from '../../store/modules/diary/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      novel_observation: '',
    };
  },
  props: [
    'item',
    'id',
    'type',
  ],
  computed: {
    ...mapState(diaryTypes.PATH, [
      'responseMessages',
      'status',
      'statusCases',
    ]),
    formatData() {
      const data = {
        label: 'DETALLE DE LA VISITA',
        header: 'root',
        completed: 0,
        children: [],
      };
      const arrayA = [];
      Object.keys(this.statusCases).forEach((i) => {
        const arrayB = [];
        let check = true;
        let completed = 0;
        let total = 0;
        Object.keys(this.statusCases[i]).forEach((j) => {
          total += 1;
          if (this.statusCases[i][j] === false) {
            check = false;
          } else {
            completed += 1;
          }
          arrayB.push({
            label: j.replaceAll('_', ' '),
            header: 'generic',
            check: this.statusCases[i][j],
          });
        });
        arrayA.push({
          label: `${i} (${completed}/${total})`,
          header: 'generic',
          children: arrayB,
          check,
          completed,
          total,
        });
        if (check) {
          data.completed += 1;
        }
      });

      data.children = arrayA;
      return [data];
    },
    approvable() {
      const data = [...this.formatData];
      if (data && data.length > 0) {
        const array = data[0].children;
        if (array && array.length > 0) {
          if ((array[0].check && array[1].check) && (array[2].check || array[3].check || array[4].check || array[5].check)) {
            return true;
          }
        }
      }
      return false;
    },
  },
  async mounted() {
    this.novel_observation = this.item.observation;
    await this.getStatus();
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      getStatusCases: diaryTypes.actions.GET_STATUS_CASES,
      approveVisit: diaryTypes.actions.APPROVE_VISIT,
    }),
    getColorStatus(item) {
      let color = 'red';
      if (item.status === 'aprobado' || item.status === 'consignado') {
        color = 'green';
      } else if (item.status === 'visitando') {
        color = 'blue';
      }
      return color;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    async getStatus() {
      await this.getStatusCases({ id: this.id });
    },
    async approve(status) {
      this.$q.dialog({
        title: 'Guardar',
        message: `Está seguro que desea pasar a ${status}?`,
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
        await this.approveVisit({
          ...this.item,
          novel_status: status,
          novel_observation: this.novel_observation,
        });
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        await this.getStatus();
        // window.location.reload();
        this.$router.go(-1);
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
  p {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  .table-container {
    text-align: center;
  }
  .markup-table {
    display: block;
    max-width: 640px;
    margin: auto;
    border: solid 1px black;
  }
</style>
