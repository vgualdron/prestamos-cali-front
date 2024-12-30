<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent full-width full-height>
      <q-card>
        <q-card-section :class="`row items-center q-pb-none ${report.background} ${report.color}`">
          <div class="text-h6">{{ report.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <div class="row q-mt-md">
            <div class="col-12 text-center">
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
            v-if="columns && columns.length > 0"
            :data="data"
            :columns="columns"
            row-key="id"
            :loading="isLoadingTable"
            :filter="filter"
            :pagination.sync="pagination"
            separator="cell"
            class="q-mt-md"
            :row-class="'bg-purple'"
            dense>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in columns" :key="col.name" :props="props">
                  {{ props.row[col.name] }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoadingTable: false,
      itemSelected: {},
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      listingSelected: null,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    report: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    columns() {
      return this.fields;
    },
  },
  methods: {
  },
  components: {
  },
};
</script>
