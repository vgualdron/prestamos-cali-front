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
              <q-badge color="blue">
                {{ e.new_name }}
              </q-badge>
              <br>
              <span>
                {{ e.new_phone }}
              </span>
              <br>
              <div class="wrap-text">
                {{ e.new_address }}, {{ e.new_district }}, {{ e.sectorName }}
              </div>
              <span>
                {{ e.new_occupation }}
              </span>
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
      console.log(item);
      this.tdSelected = { ...item };
    },
    addVisit(item) {
      this.$emit('addVisit', item);
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
    max-width: 60px;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
