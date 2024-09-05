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
      <!-- <template v-slot:body="props">
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
          <q-td key="collector" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.user_collector.name }}
            <q-popup-edit :value="props.row.user_collector.name" v-slot="scope" buttons
              @input="val => save('user_id_collector', val)">
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsUsers"/>
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
                    label: 'activa',
                    value: 'activa',
                  },
                  {
                    label: 'inactiva',
                    value: 'inactiva',
                  },
                ]"/>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template> -->
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import lendingTypes from '../../store/modules/lending/types';
import userTypes from '../../store/modules/user/types';

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
          label: 'Nombre deudor',
          align: 'left',
          field: (row) => row.nameDebtor,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'amount',
          required: true,
          label: 'Monto prestado',
          align: 'left',
          field: (row) => row.amount,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'period',
          align: 'left',
          label: 'periodo',
          field: 'period',
          sortable: true,
        },
        {
          name: 'amountFees',
          align: 'left',
          label: '# de cuotas',
          field: 'amountFees',
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.getLendings();
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(lendingTypes.PATH, [
      'lendings',
    ]),
    ...mapState(userTypes.PATH, {
      users: 'users',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    optionsUsers() {
      return this.users.map(({ id, name }) => ({ label: name, value: id }));
    },
    data() {
      return [...this.lendings];
    },
  },
  methods: {
    ...mapActions(lendingTypes.PATH, {
      fetchLendings: lendingTypes.actions.FETCH_LENDINGS,
      updateLending: lendingTypes.actions.UPDATE_LENDING,
      deleteLending: lendingTypes.actions.DELETE_LENDING,
    }),
    ...mapActions(userTypes.PATH, {
      listUsersByNameRole: userTypes.actions.LIST_USERS_BY_NAME_ROLE,
    }),
    async getLendings() {
      await this.fetchLendings({
        idList: 1,
      });
    },
    async save(field, value) {
      console.log(value);
      this.isLoadingTable = true;
      this.itemSelected[field] = value.value ? value.value : value;
      await this.updateListing(this.itemSelected);
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
          message: 'Está seguro que desea eliminar la ruta?',
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
          await this.deleteListing(row.id);
          await this.getLendings();
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
  },
};
</script>
