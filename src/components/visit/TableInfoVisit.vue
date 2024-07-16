<template>
  <div class="table-container">
    <q-markup-table class="markup-table q-mt-md" separator="cell" dense>
      <tbody>
        <tr class="tr-table">
          <td class="td-table">
            <p class="text-subtitle1 text-weight-bold text-center">Nombre:</p>
            {{ item.name }}
          </td>
        </tr>
        <tr class="tr-table">
          <td class="td-table">
            <p class="text-subtitle1 text-weight-bold text-center">Ocupación:</p>
            {{ item.occupation }}
          </td>
        </tr>
        <tr class="tr-table">
          <td class="td-table">
            <p class="text-subtitle1 text-weight-bold text-center">Tipo de vivienda:</p>
            {{ item.type_house }}
          </td>
        </tr>
        <tr class="tr-table">
          <td class="td-table">
            <p class="text-subtitle1 text-weight-bold text-center">Tipo de trabajo:</p>
            {{ item.type_work }}
          </td>
        </tr>
        <tr class="tr-table">
          <td class="td-table">
            <p class="text-subtitle1 text-weight-bold text-center">Estado:</p>
            <q-badge :color="item.status === 'aprobado' ? 'green' : 'blue'">
              {{ item.status }}
            </q-badge>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  props: [
    'item',
  ],
  computed: {
  },
  methods: {
  },
};
</script>
<style scoped>
  p {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  .table-container {
    text-align: center;
  }
  .markup-table {
    display: block;
    max-width: 640px;
    margin: auto;
    border: solid 1px black;
  }
</style>
