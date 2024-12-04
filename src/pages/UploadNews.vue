<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn
        label="Nuevo"
        color="primary"
        :loading="loading"
        :disable="loading"
        class="q-ma-md"
        @click="showDialog = true"
      />
      <q-card>
        <q-card-section>
          <q-table
            :data="items"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            separator="cell"
            :pagination="{
              rowsPerPage: 0,
            }"
          >
            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <upload-pdf
                  :config="{
                    name: 'CV_PFD',
                    storage: 'news',
                    modelName: 'news',
                    modelId: props.row.id
                  }"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-separator />
      </q-card>
      <!-- MODAL DE CARGA DE NEW -->
      <q-dialog
        v-model="showDialog"
        persistent
        @hide="hideModal"
        full-width
        full-height
      >
        <q-card style="width: 500px; max-width: 80vw;">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Crear nuevo</div>
            <q-space />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
            />
          </q-card-section>
          <q-separator />
          <q-card-section
            style="max-height: 60vh"
            class="scroll"
          >
            <q-form
              @submit="saveNew"
              class="q-gutter-md"
            >
              <div class="row">
                <div class="col-4 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.document_number"
                    label="Num. doc. *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
                <div class="col-4 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.name"
                    label="Nombre *"
                    lazy-rules
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    :dense="dense"
                  />
                </div>
                <div class="col-4 q-pa-xs">
                  <q-input
                    outlined
                    v-model.trim="item.phone"
                    label="Teléfono *"
                    lazy-rules
                    type="number"
                    :rules="[(val) => (!!val) || '']"
                    hide-bottom-space
                    autocomplete="off"
                    :dense="dense"
                  />
                </div>
              </div>
              <q-separator />
              <div class="row full-width justify-end">
                <div class="col-6">
                  <q-btn label="cancelar"
                    type="reset"
                    color="primary"
                    outline class="col"
                    v-close-popup
                    @click="showDialog = false"
                  />
                  <q-btn
                    label="Aceptar"
                    type="submit"
                    color="primary"
                    class="col q-ml-sm"
                    :loading="loading"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios';
import UploadPdf from 'components/common/UploadPdf.vue';

export default {
  components: {
    UploadPdf,
  },
  data() {
    return {
      dense: true,
      loading: false,
      items: [],
      columns: [],
      item: {},
      showDialog: false,
      user: {
        document_number: '',
        name: '',
        phone: '',
        address: '',
        sector: 3,
        district: null,
        address_work: '',
        address_work_sector: 3,
        address_work_district: null,
        site_visit: 'casa',
        occupation: '',
        user_send: null,

        observation: '',
        status: 'consignado',
        attempts: 1,
        type_cv: 'pdf',
      },
    };
  },
  async mounted() {
    this.clearItem();
    await this.getNews();
    if (this.items.length) {
      this.columns = Object.keys(this.items[0]).map((key) => ({
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza los nombres
        align: 'center',
        field: key,
        sortable: true,
      }));
    }
  },
  methods: {
    hideModal() {
      this.clearItem();
    },
    clearItem() {
      this.item = { ...this.user };
    },
    async getNews() {
      this.loading = true;
      try {
        const url = 'https://micomercio.com.co/api-prestamos/public/index.php/api/list-news';
        const response = await axios.get(url);
        this.items = [...response.data.data];
        console.log(this.items);
        this.$q.notify({
          type: 'positive',
          message: '¡Datos enviados correctamente!',
        });
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Hubo un problema al enviar los datos.',
        });
        console.error('Error al enviar los datos:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveNew() {
      this.loading = true;
      try {
        const url = 'https://micomercio.com.co/api-prestamos/public/index.php/api/create-new';
        const response = await axios.post(url, this.item);
        console.log(response.data);
        this.$q.notify({
          type: 'positive',
          message: '¡Datos enviados correctamente!',
        });
        this.showDialog = false;
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Hubo un problema al enviar los datos.',
        });
        console.error('Error al enviar los datos:', error);
      } finally {
        this.loading = false;
        await this.getNews();
      }
    },
  },
};
</script>
<style scoped>
.q-card {
  margin: 0 auto;
}
.q-card-section {
  margin-bottom: 16px;
}
</style>
