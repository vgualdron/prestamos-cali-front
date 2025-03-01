<template>
  <div class="q-pa-md w-100">
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
              <q-card
                v-for="(task, index) in getTasks(area.id)"
                :key="`d-card-task_${task.id}`"
                :class="index === 0 ? 'my-card border-priority' : 'my-card'"
                outline
                bordered
                @click="setItem(task)">
                <q-card-section>
                  <div class="text-bold text-subtitle2 text-wrap">
                    <q-icon size="xs" name="edit" v-if="task.status === 'creado' && hasPermission('task.edit')" />
                    {{ task.name }}
                    <q-popup-edit
                      v-show="task.status === 'open' && hasPermission('task.edit')"
                      :value="task.name"
                      v-slot="scope" buttons
                      @input="val => changeRow('name', val)">
                      <q-input v-model="scope.value" dense autofocus type="text" />
                    </q-popup-edit>
                  </div>
                  <div class="text-grey text-subtitle2 text-wrap">
                    <q-icon size="xs" name="edit" v-if="task.status === 'creado' && hasPermission('task.edit')" />
                    Prioridad: {{ task.priority }}
                    <q-popup-edit
                      v-show="task.status === 'open' && hasPermission('task.edit')"
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
                    v-if="hasPermission('task.delete')"
                    outline
                    size="sm"
                    color="dark"
                    label="Eliminar"
                    @click="changeStatus(task, 'eliminado')"/>
                  <q-btn
                    v-if="hasPermission('task.finalize')"
                    outline
                    size="sm"
                    color="primary"
                    label="Finalizar"
                    @click="changeStatus(task, 'finalizado')"/>
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
              <q-btn
                v-if="hasPermission('task.add')"
                icon="add"
                class="q-ml-sm q-mt-sm"
                size="sm"
                color="primary"
                title="Click para agregar un nuevo egreso"
                @click="addRow(area.id)">
              </q-btn>
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
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.listAreas();
    await this.list();
    this.$q.loading.hide();
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
    getColorStatus(value) {
      let color = 'primary';
      if (value === 'finalizado') {
        color = 'green';
      } else if (value === 'borrado') {
        color = 'red';
      }
      return color;
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
      await this.listTask('creado');

      // Asegurar que cada tarea tenga `expanded` como propiedad reactiva
      this.ts = this.tasks.map((task) => ({
        ...task,
        expanded: false, // Inicialmente, todas las tareas están colapsadas
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
    max-width: 250px;
    border: solid 2px gray;
    margin-top: 10px;
  }
  .text-wrap {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
  }
  .border-priority {
    border: solid 2px rgb(240, 8, 58);
  }
</style>
