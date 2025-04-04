<template>
  <div class="q-pa-md w-100 text-center">
    <q-btn
      round
      icon="refresh"
      class="q-mt-none q-mb-sm"
      color="primary"
      title="Click para refrescar la tabla"
      @click="initData()">
    </q-btn>
    <q-markup-table
      class="markup-table"
      separator="cell"
      dense
      v-if="areas && areas.length > 0 && tasks && tasks.length > 0"
      >
        <thead>
          <tr class="">
            <th v-for="(area, index) in cols" :class="colors[index]" :key="`th_area_${area.id}`">
              {{ area.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="">
            <td v-for="(area) in cols" :key="`td_area_${area.id}`">
              <div class="text-center text-bold">{{  getTasks(area.id).length }}</div>
              <q-card
                v-for="(task) in getTasks(area.id)"
                :key="`d-card-task_${task.id}`"
                :class="getClass(task)"
                outline
                bordered
                @click="setItem(task)">
                <q-card-section>
                  <div class="text-bold text-subtitle2 text-wrap">
                    <q-icon size="xs" name="edit" v-if="task.status === 'creado' && hasPermission('task.edit')" />
                    {{ task.name }}
                    <q-popup-edit
                      v-show="task.status === 'creado' && hasPermission('task.edit')"
                      :value="task.name"
                      v-slot="scope" buttons
                      @input="val => changeRow('name', val)">
                      <q-input v-model="scope.value" dense autofocus type="text" />
                    </q-popup-edit>
                  </div>
                  <div class="text-subtitle2 text-wrap">
                    <q-icon size="xs" name="edit" v-if="task.status === 'creado' && hasPermission('task.edit')" />
                    Prioridad: {{ task.priority }}
                    <div v-if="task.status === 'iniciado'">
                      Para finalizar: {{ formatDate(task.end_date) }}
                    </div>
                    <q-popup-edit
                      v-show="task.status === 'creado' && hasPermission('task.edit')"
                      :value="task.priority"
                      v-slot="scope" buttons
                      @input="val => changeRow('priority', val)">
                      <q-input v-model="scope.value" dense autofocus type="number" />
                    </q-popup-edit>
                  </div>
                  <div class="text-grey text-subtitle2 text-wrap">
                    <q-badge :color="getColorStatus(task.status)">
                      {{ task.status }}
                    </q-badge>
                  </div>
                </q-card-section>
                <q-card-actions>
                  <q-btn
                    v-if="hasPermission('task.delete') && task.status == 'creado'"
                    size="sm"
                    color="grey"
                    label="Eliminar"
                    @click="changeStatus(task, 'eliminado')"/>
                  <q-btn
                    v-if="hasPermission('task.finalize') && task.status === 'iniciado'"
                    size="sm"
                    color="primary"
                    label="Finalizar"
                    @click="changeStatus(task, 'finalizado')"/>
                  <q-btn
                    v-if="hasPermission('task.started') && !hasStarted"
                    size="sm"
                    color="green"
                    label="Iniciar"
                    @click="changeStatus(task, 'iniciado')"/>
                  <q-btn
                    v-if="hasPermission('task.next1') && task.status !== 'iniciado' && !hasNext1"
                    size="sm"
                    color="red"
                    label="Siguiente 1"
                    @click="changeStatus(task, 'siguiente1')"/>
                  <q-btn
                    v-if="hasPermission('task.next2') && task.status !== 'iniciado' && !hasNext2"
                    size="sm"
                    color="orange"
                    label="Siguiente 2"
                    @click="changeStatus(task, 'siguiente2')"/>
                  <q-space />
                  <q-btn
                    color="grey"
                    round
                    flat
                    dense
                    :icon="task.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                    @click="task.expanded = !task.expanded"
                  />
                </q-card-actions>
                <q-slide-transition>
                  <div v-show="task.expanded">
                    <q-separator />
                    <q-card-section class="text-subitle2 text-wrap">
                      <q-icon size="xs" name="edit" v-if="task.status === 'creado' && hasPermission('task.edit')" />
                      {{ task.description }}
                      <q-popup-edit
                        v-show="task.status === 'open' && hasPermission('task.edit')"
                        :value="task.description"
                        v-slot="scope" buttons
                        @input="val => changeRow('description', val)">
                        <q-input v-model="scope.value" dense autofocus type="text" />
                      </q-popup-edit>
                    </q-card-section>
                  </div>
                </q-slide-transition>
              </q-card>
              <div class="text-center text-bold">
                <q-btn
                  v-if="hasPermission('task.add')"
                  icon="add"
                  class="q-ml-sm q-mt-sm"
                  size="sm"
                  color="primary"
                  title="Click para agregar un nuevo egreso"
                  @click="addRow(area.id)">
                </q-btn>
              </div>
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
import areaTypes from '../../store/modules/area/types';
import taskTypes from '../../store/modules/task/types';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      location: null,
      itemSelected: {},
      polling: null,
      ts: [],
      colors: [
        'bg-yellow-3',
        'bg-blue-3',
        'bg-green-3',
        'bg-orange-3',
        'bg-pink-3',
        'bg-red-3',
      ],
    };
  },
  props: {
  },
  async mounted() {
    await this.initData();
    await this.pollData();
  },
  watch: {
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
    ...mapState(areaTypes.PATH, [
      'areas',
    ]),
    ...mapState(taskTypes.PATH, [
      'tasks',
    ]),
    cols() {
      return this.areas.filter((a) => a.show_task === 1);
    },
    hasStarted() {
      const ts = this.ts.filter((t) => t.status === 'iniciado');
      return ts && ts.length > 0;
    },
    hasNext1() {
      const ts = this.ts.filter((t) => t.status === 'siguiente1');
      return ts && ts.length > 0;
    },
    hasNext2() {
      const ts = this.ts.filter((t) => t.status === 'siguiente2');
      return ts && ts.length > 0;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(areaTypes.PATH, {
      listAreas: areaTypes.actions.LIST_AREAS,
    }),
    ...mapActions(taskTypes.PATH, {
      listTask: taskTypes.actions.FETCH_TASKS,
      addTask: taskTypes.actions.ADD_TASK,
      updateTask: taskTypes.actions.UPDATE_TASK,
    }),
    async initData() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listAreas();
      await this.list();
      this.$q.loading.hide();
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.initData();
      }, 60000);
    },
    getColorStatus(value) {
      let color = 'primary';
      if (value === 'iniciado') {
        color = 'green';
      } else if (value === 'siguiente1') {
        color = 'red';
      } else if (value === 'siguiente2') {
        color = 'orange';
      }
      return color;
    },
    getClass(row) {
      let c = 'my-card';
      if (row.status === 'iniciado') {
        c = 'my-card border-green';
      } else if (row.status === 'siguiente1') {
        c = 'my-card border-red';
      } else if (row.status === 'siguiente2') {
        c = 'my-card border-orange';
      }
      return c;
    },
    hasPermission(value) {
      return havePermission(value);
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
    setItem(row) {
      this.itemSelected = {
        ...row,
      };
      console.log(this.itemSelected);
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async list() {
      await this.listTask(['creado', 'iniciado', 'siguiente1', 'siguiente2']);

      this.ts = this.tasks.map((task) => ({
        ...task,
        expanded: true,
      }));
    },
    getTasks(area_id) {
      return this.ts.filter((t) => t.area_id === area_id);
    },
    async addRow(area_id) {
      this.$q.dialog({
        title: 'Crear una nueva tarea',
        message: 'Está seguro que desea crear una nueva tarea ?',
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
        await this.addTask({
          area_id,
          registered_by: this.user,
          status: 'creado',
        });
        await this.list();
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    async changeRow(field, value) {
      showLoading('Modificando ...', 'Por favor, espere', true);
      const item = {
        id: this.itemSelected.id,
      };
      item[field] = value.value ? value.value : value;
      await this.updateTask({
        ...item,
      });
      await this.list();
      this.$q.loading.hide();
    },
    async changeStatus(row, status) {
      this.$q.dialog({
        title: 'Cambiar de estado',
        message: 'Está seguro que desea cambiar de estado la tarea ?',
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
        await this.updateTask({
          status,
          id: row.id,
        });
        await this.list();
        this.$q.loading.hide();
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
    width: 100%;
  }
  .markup-table td,
  .markup-table th {
    border: solid 1px black;
  }
  .markup-table td {
    height: 100px;
    vertical-align: top;
  }
  .my-card {
    max-width: 400px;
    border: solid 2px gray;
    margin-top: 10px;
  }
  .text-wrap {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
  }
  .border-green {
    border: solid 4px rgb(8, 240, 58);
    background: rgb(203, 230, 203);
  }

  .border-red {
    border: solid 4px #f00808;
    background: rgb(231, 214, 213);
  }

  .border-orange {
    border: solid 4px #f0b208;
    background: rgb(219, 201, 172);
  }
</style>
