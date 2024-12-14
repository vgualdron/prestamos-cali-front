<template>
  <div class="q-pa-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Cuentas Nequi</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="scroll">
          <div class="row text-center">
            <q-markup-table
              class="markup-table"
              separator="cell"
              dense
            >
              <tbody>
                <tr class="" v-for="nequi in nequis" :key="`tr_td_${nequi.id}`">
                  <td class="td-table" colspan="2">
                    <b>{{ nequi.order }}</b>
                  </td>
                  <td class="td-table" colspan="2">
                    <b>{{ nequi.name }}</b>
                  </td>
                  <td class="td-table" colspan="2">
                    <b>{{ nequi.number }}</b>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import nequiTypes from '../../store/modules/nequi/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      isLoading: false,
      showModal: false,
    };
  },
  async mounted() {
    showLoading('consultando ...', 'Por favor, espere', true);
    await this.listNequis(this.listing);
    this.$q.loading.hide();
  },
  watch: {
  },
  computed: {
    ...mapState(nequiTypes.PATH, [
      'nequis',
      'responseMessages',
      'status',
    ]),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    listing: {
      type: Object,
    },
  },
  methods: {
    ...mapActions(nequiTypes.PATH, {
      listNequis: nequiTypes.actions.LIST_NEQUIS,
    }),
  },
};
</script>
<style scoped>
  .inherit-width {
    width: inherit;
  }
  .markup-table {
    display: block;
    border: solid 1px black;
  }
  .markup-table td {
    border: solid 1px black;
  }
</style>
