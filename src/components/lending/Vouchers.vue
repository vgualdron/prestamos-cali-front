<template>
  <div>
    <q-btn-dropdown
      class="glossy"
      color="primary"
      label="Vouchers"
    >
      <q-list>
        <q-item v-for="(item, index) in items" :key="index" class="q-mb-md" clickable v-close-popup @click="onItemClick(item)">
          <q-item-section>
            <q-item-label>
              {{ formatPrice(item.amount) }} - {{ formatDate(item.date) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <modal-preview-file
      v-if="showModalPreview"
      v-model="showModalPreview"
      :url="urlFile"
      :type="'image'"
      :showBtnCancel="false"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import ModalPreviewFile from 'components/common/ModalPreviewFile.vue';
import fileTypes from '../../store/modules/file/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  components: {
    ModalPreviewFile,
  },
  data() {
    return {
      urlFile: null,
      showModalPreview: false,
    };
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState(fileTypes.PATH, [
      'responseMessages',
      'status',
    ]),
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      getFile: fileTypes.actions.GET_FILE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
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
    async onItemClick(row) {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      const response = await this.getFile({
        name: 'FOTO_TRANSFERENCIA_CUOTA',
        modelName: 'payments',
        modelId: row.id,
      });

      this.$q.loading.hide();
      if (response.data) {
        const item = response.data;
        this.urlFile = `${process.env.URL_FILES}${item.url}`;
        this.showModalPreview = true;
      } else {
        this.showNotification([{ tex: 'Error', detail: 'No hay imagen asociada al voucher' }], this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
  },
};
</script>

<style scoped>
.q-checkbox {
  display: flex;
  align-items: center;
}
</style>
