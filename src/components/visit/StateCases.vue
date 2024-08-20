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
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" class="q-mr-sm" style="width:50px;height:50px">
          <div>
            <b>{{ prop.node.label }}</b>
            <br>Estado:
            <q-badge :color="item.status === 'aprobado' || item.status != 'consignado' ? 'green' : 'blue'">
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
            <br>
            <q-btn
              v-if="type === 'review' && approvable && item.status != 'aprobado' && item.status != 'consignado'"
              label="APROBAR VISITA"
              class="q-mt-xs text-center"
              color="primary"
              outline
              @click="approve">
            </q-btn>
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
    await this.getStatus();
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      getStatusCases: diaryTypes.actions.GET_STATUS_CASES,
      approveVisit: diaryTypes.actions.APPROVE_VISIT,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY hh:mm A');
    },
    async getStatus() {
      await this.getStatusCases({ id: this.id });
    },
    async approve() {
      showLoading('Aprobando ...', 'Por favor, espere', true);
      await this.approveVisit(this.item);
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      await this.getStatus();
      this.$q.loading.hide();
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
