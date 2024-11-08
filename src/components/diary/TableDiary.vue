<template>
  <div class="q-pa-md">
    <q-markup-table class="col-12" separator="cell">
      <thead>
        <tr>
          <th v-for="(el, index) in data[0].items" :key="`th_${el.date}_${index}`" class="text-center">
            <span v-if="index != 0">
              <b>{{ formatDateToDay(el.date) }}</b>
              <br>
              <b>{{ formatDate(el.date) }}</b>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(el, index) in data" :key="`tr_${el.date}_${index}`">
          <td class="text-center" v-for="(e, i) in el.items" :key="`td_${el.id}_${i}`">
            <span v-if="i === 0">
              <b>{{ formatHour(e.date) }}</b>
            </span>
            <template v-else-if="e.new_id">
              <div :class="e.status === 'visitando' ? 'bg-green-3 q-py-xs q-px-xs' : ''">
                <b>
                  {{ e.new_name }}
                </b>
                <br>
                <span>
                  Lugar de visita: <b>{{ e.site_visit }}</b>
                </span>
                <br>
                <div class="wrap-text">
                  {{ e.site_visit === 'trabajo' ? e.address_work : e.address_house }}
                  {{ e.site_visit === 'trabajo' ? e.new_districtWorkName : e.new_districtHouseName }}
                </div>
                <span>
                  {{ e.new_occupation }}
                </span>
                <br>
                Estado visita:
                <q-badge :color="e.status === 'aprobado' ? 'green' : 'blue'">
                  {{ e.status }}
                </q-badge>
                <br>
                Estado nuevo:
                <q-badge :color="e.new_status === 'aprobado' ? 'green' : 'blue'">
                  {{ e.new_status }}
                </q-badge>
                <p>
                  <q-btn
                    v-if="type === 'visitor'"
                    label="visita"
                    color="black"
                    class="q-mt-sm"
                    icon="arrow_forward"
                    @click="goVisit(e)"
                    outline
                  />
                </p>
              </div>
            </template>
            <template v-else-if="e.id === tdSelected.id">
              <div class="td-selected">
                <q-btn
                  class="q-ml-xs"
                  color="primary"
                  label="Agendar"
                  size="md"
                  @click="addVisit(tdSelected)"
                />
              </div>
            </template>
            <template v-else-if="type === 'readwrite'">
              <div @click="clickTd(e)" class="td-selecteable"></div>
            </template>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import moment from 'moment';
import { showNotifications } from '../../helpers/showNotifications';
// import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      name: 'TableDiary',
      tdSelected: {},
    };
  },
  props: {
    data: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  computed: {
  },
  methods: {
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDateToDay(date) {
      moment.locale('es');
      return moment(date).format('dddd');
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatHour(date) {
      return moment(date).format('hh:mm A');
    },
    clickRow(item) {
      console.log(item);
    },
    clickTd(item) {
      const fecha1 = new Date();
      const fecha2 = new Date(item.date);
      if (fecha1.getTime() > fecha2.getTime()) {
        this.showNotification(
          [
            {
              text: 'No puedes asignar visitas a fechas inferiores a la actual',
              detail: 'Prueba con alguna fecha superior a la actual',
            },
          ],
          false,
        );
      } else {
        this.tdSelected = { ...item };
      }
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
    goVisit(item) {
      this.$router.push(`/visit/${item.new_id}`);
    },
  },
  components: {
  },
};
</script>
<style scoped>
  .td-selected {
    height: 100%;
    background-color: cornflowerblue;
    padding: 8px;
  }
  .td-selecteable {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .td-selecteable:hover {
    background-color: lightblue;
  }
  tr > td {
    min-width: 160px;
    max-width: 160px;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
