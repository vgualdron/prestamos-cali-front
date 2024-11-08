<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div
        class="col-3
        text-center"
      >
        <q-btn
          color="primary"
          label="Agregar"
          @click="addRow"
          :disable="isDiabledAdd"
        />
      </div>
    </div>
    <q-table
      :grid="$q.screen.xs"
      :data="data"
      :columns="columns"
      row-key="name"
      :selected.sync="selected"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      separator="cell"
      class="q-mt-md"
      dense>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn icon="delete" type="reset" color="primary" flat size="sm"
              class="col q-ml-sm" @click="openModal('delete', props.row)" />
          </q-td>
          <q-td key="name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.name }}
            <q-popup-edit :value="props.row.name" v-slot="scope" buttons
              @input="val => save('name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="cityName" :props="props">
            {{ props.row.cityName }}
          </q-td>
          <q-td key="sector" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.sectorName }}
            <q-popup-edit :value="props.row.sectorName" v-slot="scope" buttons
              @input="val => save('sector', val)">
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsSectors"/>
            </q-popup-edit>
          </q-td>
          <q-td key="group" :props="props">
            <q-icon size="xs" name="edit" />
            <q-badge
              :color="getColorBadge(props.row.group)"
              :text-color="getColorText(props.row.group)">
              {{ props.row.group }}
            </q-badge>
            <q-popup-edit :value="props.row.group" v-slot="scope" buttons
              @input="val => save('group', val)">
              <q-input v-model="scope.value" dense autofocus type="number"/>
            </q-popup-edit>
          </q-td>
          <q-td key="order" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.order }}
            <q-popup-edit :value="props.row.order" v-slot="scope" buttons
              @input="val => save('order', val)">
              <q-input v-model="scope.value" dense autofocus/>
            </q-popup-edit>
          </q-td>
          <q-td key="status" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.status }}
            <q-popup-edit :value="props.row.status" v-slot="scope" buttons
              @input="val => save('status', val)">
              <q-select
                outlined
                v-model="scope.value"
                :options="[
                  {
                    label: 'activo',
                    value: 'activo',
                  },
                  {
                    label: 'inactivo',
                    value: 'inactivo',
                  },
                ]"/>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <form-district v-if="showModal" v-model="showModal"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormDistrict from 'components/district/FormDistrict.vue';
import districtTypes from '../../store/modules/district/types';
import yardTypes from '../../store/modules/yard/types';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'left',
          style: 'width: 100px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre barrio',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'cityName',
          align: 'left',
          label: 'Ciudad',
          field: 'cityName',
          sortable: true,
        },
        {
          name: 'sector',
          align: 'left',
          label: 'Sector',
          field: 'sector',
          sortable: true,
        },
        {
          name: 'group',
          align: 'left',
          label: 'Zona',
          field: 'group',
          sortable: true,
        },
        {
          name: 'order',
          align: 'left',
          label: 'Orden',
          field: 'order',
          sortable: true,
        },
        {
          name: 'status',
          align: 'left',
          label: 'Estado',
          field: 'status',
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.fetchDistricts();
    await this.listYards({ id: 0, displayAll: 1 });
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(districtTypes.PATH, [
      'districts',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
    optionsSectors() {
      return this.yards.map(({ id, name }) => ({ label: name, value: id }));
    },
    data() {
      return [...this.districts];
    },
  },
  methods: {
    ...mapActions(districtTypes.PATH, {
      fetchDistricts: districtTypes.actions.FETCH_DISTRICTS,
      updateDistrict: districtTypes.actions.UPDATE_DISTRICT,
      deleteDistrict: districtTypes.actions.DELETE_DISTRICT,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    getColorBadge(i) {
      const colors = [
        'white',
        'black',
        'yellow',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
        'black',
        'yellow',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
        'black',
        'yellow',
        'red',
        'green',
        'blue',
        'purple',
        'orange',
      ];
      return colors[i];
    },
    getColorText(i) {
      const colors = [
        'white',
        'white',
        'black',
        'white',
        'white',
        'white',
        'white',
        'white',
        'white',
        'black',
        'white',
        'white',
        'white',
        'white',
        'white',
        'white',
        'black',
        'white',
        'white',
        'white',
        'white',
        'white',
      ];
      return colors[i];
    },
    async save(field, value) {
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value ? value.value : value;
      await this.updateDistrict(this.itemSelected);
      await this.fetchDistricts();
      this.isLoadingTable = false;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
    },
    openModal(action, row) {
      if (action === 'delete') {
        this.$q.dialog({
          title: 'Eliminar',
          message: 'Está seguro que desea eliminar el barrio?',
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
          this.isLoadingTable = true;
          await this.deleteDistrict(row.id);
          await this.fetchDistricts();
          this.isLoadingTable = false;
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      }
    },
  },
  components: {
    FormDistrict,
  },
};
</script>
