<template>
  <div style="width: 100%; height: auto;">
    <iframe
      :src="urlFile + '#toolbar=0'"
      style="width: 90vw; height: 100vh;"
    ></iframe>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fileTypes from '../../../store/modules/file/types';
import { showLoading } from '../../../helpers/showLoading';

export default {
  components: {
  },
  data() {
    return {
      item: null,
      urlFile: '',
    };
  },
  props: {
    id: {},
  },
  async mounted() {
    await this.fetchFile();
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
    async fetchFile() {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      const response = await this.getFile({
        name: 'PDF_CV',
        modelName: 'news',
        modelId: this.id,
      });

      this.$q.loading.hide();

      if (response.data) {
        this.item = response.data;
        this.urlFile = `${process.env.URL_FILES}${this.item.url}`;
      }
    },
  },
};
</script>

<style scoped>
</style>
