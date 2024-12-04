<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <b>Copiar y Pegar desde Excel</b>
        <q-input
          filled
          type="textarea"
          label="Pega aquí los datos del Excel"
          v-model="rawData"
          @input="processData"
          hint="Selecciona las filas en Excel, cópialas (Ctrl+C) y pégalas aquí (Ctrl+V)."
          style="height: 200px;"
        />
      </q-card-section>

      <q-separator />

      <q-card-section style="overflow: scroll;max-height: 602px;">
        <b>Vista Previa de los Datos</b>
        <q-table
          :data="tableData"
          :columns="tableColumns"
          row-key="id"
          :pagination="pagination"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Guardar Datos"
          color="primary"
          @click="sendTableData"
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      rawData: '', // Datos sin procesar del textarea
      tableData: [], // Datos procesados para la tabla
      tableColumns: [], // Columnas de la tabla
      pagination: {
        rowsPerPage: 0,
      },
      loading: false,
    };
  },
  methods: {
    processData() {
      if (!this.rawData) {
        this.tableData = [];
        this.tableColumns = [];
        return;
      }

      // Separar filas por salto de línea
      const rows = this.rawData.trim().split('\n');

      // Verificar si hay datos para procesar
      if (rows.length === 0) {
        this.tableData = [];
        this.tableColumns = [];
        return;
      }

      // Convertir cada fila en columnas separadas por tabulaciones
      const parsedData = rows.map((row) => row.split('\t'));

      // Configurar las columnas de la tabla (encabezados)
      this.tableColumns = parsedData[0].map((col, index) => ({
        name: 'value',
        label: col || `Columna ${index + 1}`,
        field: 'value',
        align: 'left',
      }));

      // Agregar los datos (omitimos la primera fila si es encabezado)
      this.tableData = parsedData.slice(0).map((row, rowIndex) => {
        const rowData = {};
        row.forEach((cell) => {
          rowData.value = cell || ''; // Evitar valores nulos
        });
        rowData.id = rowIndex + 1; // Agregar clave única
        return rowData;
      });

      console.log('Datos procesados:', this.tableData);
    },
    async sendTableData() {
      this.loading = true; // Mostrar el loader

      try {
        const url = 'https://micomercio.com.co/api-prestamos/public/index.php/api/upload-data-payments';

        const response = await axios.post(url, { data: this.tableData });

        // Mostrar notificación de éxito
        this.$q.notify({
          type: 'positive',
          message: '¡Datos enviados correctamente!',
        });

        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        // Mostrar notificación de error
        this.$q.notify({
          type: 'negative',
          message: 'Hubo un problema al enviar los datos.',
        });

        console.error('Error al enviar los datos:', error);
      } finally {
        this.loading = false; // Ocultar el loader
      }
    },
  },
};
</script>
<style scoped>
.q-card {
  max-width: 800px;
  margin: 0 auto;
}
.q-card-section {
  margin-bottom: 16px;
}
</style>
