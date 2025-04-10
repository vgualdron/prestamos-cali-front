<template>
  <div class="q-pa-md">
    {{ onlyOneItem }}
    <q-markup-table
      class="markup-table q-mt-none"
      separator="cell"
      dense>
      <thead>
        <tr>
          <th v-for="(el, index) in elements" :key="`th_${el.date}_${index}`" class="text-center">
            <span>
              <b>{{ formatDateToDay(el.date) }}</b>
              <br>
              <b>{{ formatDate(el.date) }}</b>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(el, i) in elements" :key="`td_${el.date}_${i}`" class="text-center">
            <p v-for="(item, j) in el.items" :key="`item_${item.date}_${j}`" class="text-center">
              <q-card :class="{ 'glowing-border' : onlyOneItem && onlyOneItem.id === item.id }">
                <q-card-section class="bg-teal-2 text-black q-pa-none">
                  <div class="text-subtitle1 text-bold wrap-text">
                    {{ item.new_name }}
                  </div>
                  <div class="text-subtitle2 wrap-text">
                    {{ item.new_occupation }}
                  </div>
                  <div v-if="type !== 'visitor'" class="text-subtitle2 wrap-text">
                    <q-btn
                      v-if="item.status === 'agendado' && isDateAllowed(item.date)"
                      class="q-mb-xs"
                      color="orange"
                      size="md"
                      @click="itemSelected = { ...item }"
                    >
                      {{ item.priority }}
                      <q-popup-edit
                        :value="item.priority"
                        v-slot="scope"
                        @input="val => editDiary('priority', val)"
                        type="date"
                        buttons>
                        <q-input v-model="scope.value" type="number" dense autofocus />
                      </q-popup-edit>
                    </q-btn>
                  </div>
                  <div v-if="type !== 'visitor'" class="text-subtitle2 wrap-text">
                    <q-btn
                      v-if="item.status === 'agendado' && isDateAllowed(item.date)"
                      class="q-mb-xs"
                      color="black"
                      icon="edit_calendar"
                      size="sm"
                      @click="itemSelected = { ...item }"
                      round
                    >
                      <q-popup-edit
                        :value="item.date"
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
                    </q-btn>
                    {{ formatDate(item.date) }}
                  </div>
                  <div v-if="type !== 'visitor'" class="text-subtitle2 wrap-text">
                    <q-btn
                      v-if="item.status === 'agendado' && isDateAllowed(item.date)"
                      class="q-mb-xs"
                      color="black"
                      icon="manage_accounts"
                      size="sm"
                      @click="itemSelected = { ...item }"
                      round
                    >
                      <q-popup-edit
                        :value="item.user_id"
                        v-slot="scope"
                        @input="val => editDiary('user_id', val)"
                        buttons>
                        <q-select
                          v-model="scope.value"
                          class="q-mt-md"
                          input-debounce="0"
                          label="Seleccionar asesor"
                          :options="optionsUsers"
                          option-label="label"
                          option-value="value"
                          map-options
                          emit-value
                          outlined
                        >
                        </q-select>
                      </q-popup-edit>
                    </q-btn>
                    {{ userSelected }}
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="text-black">
                  <div class="wrap-text">
                    <div class="text-subtitle3 text-bold wrap-text">
                      {{ item.site_visit === 'trabajo' ? item.sectorNameWork : item.sectorNameHouse }}
                    </div>
                    <div class="text-subtitle3 text-bold wrap-text">
                      <span>
                        Lugar de visita: <b>{{ item.site_visit }}</b>
                      </span>
                    </div>
                    <div class="text-subtitle3 wrap-text">
                      {{ item.site_visit === 'trabajo' ? item.address_work : item.address_house }}
                      {{ item.site_visit === 'trabajo' ? item.new_districtWorkName : item.new_districtHouseName }}
                    </div>
                    <div class="text-subtitle3 wrap-text">
                      <q-badge color="pink">
                        {{ item.site_visit === 'trabajo' ? item.new_districtWorkOrder : item.new_districtHouseOrder }}
                      </q-badge>
                    </div>
                    <div class="text-subtitle3 wrap-text">
                      Estado visita:
                      <q-badge :color="getColorStatus(item.status)">
                        {{ item.status }}
                      </q-badge>
                      <br>
                      Estado cliente:
                      <q-badge :color="getColorStatus(item.new_status)">
                        {{ item.new_status }}
                      </q-badge>
                    </div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions>
                  <q-icon name="event" size="sm" class="q-mr-sm"/>
                  <span outline>
                    <b v-if="item.visit_start_date">
                      {{ formatHour(item.visit_start_date) }} - {{ formatDate(item.visit_start_date) }}
                    </b>
                    <b v-else>
                      -
                    </b>
                  </span>
                  <span class="q-ml-md">
                    <b v-if="item.visit_end_date">
                      {{ formatHour(item.visit_end_date) }} - {{ formatDate(item.visit_end_date) }}
                    </b>
                    <b v-else>
                      -
                    </b>
                  </span>
                  <q-btn
                    v-if="type === 'visitor'"
                    color="primary"
                    class="q-ml-md"
                    icon="arrow_forward"
                    :disable="item.status === 'finalizada'"
                    @click="goVisit(item)">
                    Entrar a visita
                  </q-btn>
                </q-card-actions>
              </q-card>
            </p>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
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
      name: 'TableDiary',
      tdSelected: {},
      itemSelected: {},
    };
  },
  props: {
    data: {
      type: Array,
    },
    optionsUsers: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  computed: {
    ...mapState(diaryTypes.PATH, {
      diaryStatus: 'status',
      diaryResponseMessages: 'responseMessages',
    }),
    userSelected() {
      let name = 'x';
      if (this.optionsUsers) {
        const user = this.optionsUsers.find((u) => u.value === this.data[0].user_id);
        if (user) {
          name = user.label;
        }
      }
      return name;
    },
    elements() {
      const groupedByDate = Object.entries(
        this.data.reduce((groups, item) => {
          if (item.new_id !== null) { // Filtrar solo los que tienen new_id no null
            const date = item.date.split(' ')[0]; // Extraer solo la fecha
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(item); // Agregar al grupo correspondiente
          }
          return groups;
        }, {}),
      ).map(([date, items]) => ({
        date,
        items,
      }));
      groupedByDate.sort((a, b) => new Date(a.date) - new Date(b.date));
      return groupedByDate;
    },
    onlyOneItem() {
      const today = new Date().toISOString().slice(0, 10);

      const items = this.elements.filter((obj) => obj.date === today).flatMap((obj) => obj.items);

      console.log(items);
      const visiting = items.find((item) => item.status === 'visitando');
      if (visiting) {
        return visiting;
      }
      const scheduled = items.find((item) => item.status === 'agendado');
      return scheduled;
    },
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      updateDiary: diaryTypes.actions.UPDATE_DIARY,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
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

      await this.updateDiary(data);
      this.$emit('refreshDiary');
      this.$q.loading.hide();
    },
    isDateAllowed(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
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
    getColorStatus(status) {
      let color = 'black';
      if (status === 'aprobado' || status === 'consignado' || status === 'finalizada') {
        color = 'green';
      } else if (status === 'agendado') {
        color = 'grey';
      } else if (status === 'visitando') {
        color = 'blue';
      } else if (status === 'rechazado') {
        color = 'red';
      }
      return color;
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
    min-width: 300px;
    max-width: 160px;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .markup-table {
    display: block;
    border: solid 1px black;
    width: 100%;
  }
  .markup-table th {
    border: solid 1px black;
  }
  .markup-table td {
    border: solid 1px black;
  }
  .glowing-border {
    border: 5px solid #00ff00;
    box-shadow: 0 0 15px #00ff00;
  }
</style>
