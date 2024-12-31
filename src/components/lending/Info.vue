<template>
  <div class="q-pa-sm w-100">
    <q-markup-table
      class="markup-table"
      separator="cell"
      dense
      v-if="info && info.yellowUp"
      >
        <tbody>
          <tr class="">
            <td class="">
              <q-icon name="swap_vert" color="orange-4" size="sm"/>
              {{ info.yellow.total_count }}
              ({{ formatPrice(info.yellow.total_pendiente) }})
            </td>
            <td class="">
              <q-icon name="publish" color="orange-4" size="sm"/>
              {{ info.yellowUp.total_count }}
              ({{ formatPrice(info.yellowUp.total_pendiente) }})
            </td>
            <td class="">
              <q-icon name="download" color="orange-4" size="sm"/>
              {{ info.yellowDown.total_count }}
              ({{ formatPrice(info.yellowDown.total_pendiente) }})
            </td>
            <td class="">
              <q-icon name="swap_vert" color="blue" size="sm"/>
              {{ info.blue.total_count }}
              ({{ formatPrice(info.blue.total_pendiente) }})
            </td>
            <td class="">
              <q-icon name="publish" color="blue" size="sm"/>
              {{ info.blueUp.total_count }}
              ({{ formatPrice(info.blueUp.total_pendiente) }})
            </td>
            <td class="">
              <q-icon name="download" color="blue" size="sm"/>
              {{ info.blueDown.total_count }}
              ({{ formatPrice(info.blueDown.total_pendiente) }})
            </td>
            <td class="">
              <q-icon label="download" color="orange" size="xs">R</q-icon>
              {{ info.renove.total_count }}
            </td>
          </tr>
        </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import moment from 'moment';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      location: null,
    };
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    showLoading('Cargando ...', 'Por favor, espere', true);
    this.$q.loading.hide();
  },
  watch: {
  },
  computed: {
  },
  methods: {
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
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
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
  .markup-table td {
    border: solid 1px black;
  }
</style>
