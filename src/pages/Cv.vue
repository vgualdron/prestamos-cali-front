<template>
  <div class="q-pa-md">
    <div class="text-h6">HOJA DE VIDA</div>
    <q-space />
    <cv-app v-if="row.type_cv === 'pdf' && onlyTable" :id="row.id" :onlyTable="onlyTable"/>
    <cv-app v-if="row.type_cv === 'app'" :id="row.id"/>
    <cv-pdf v-else-if="row.id" :id="row.id"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import newTypes from '../store/modules/new/types';
import CvApp from '../components/new/cv/CvApp.vue';
import CvPdf from '../components/new/cv/CvPdf.vue';

export default {
  data() {
    return {
      onlyTable: false,
    };
  },
  props: {
  },
  computed: {
    ...mapState(newTypes.PATH, {
      row: 'new',
      newStatus: 'status',
      newResponseMessages: 'responseMessages',
    }),
  },
  async created() {
    await this.getItem();
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      getNew: newTypes.actions.GET_NEW,
    }),
    async getItem() {
      const { id } = this.$route.params;
      await this.getNew(id);
    },
  },
  components: {
    CvApp,
    CvPdf,
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
    max-width: 250px;
    min-width: 250px;
    margin: auto;
  }
  .z-index-btn {
    z-index: 20;
  }
  .q-card__section > .text-h6 {
    border: none;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .div-container {
    border: solid 1px rgb(145, 140, 140);
    margin: 10px;
    padding: 5px;
    border-radius: 10px;
    width: 300px;
  }
  .q-banner {
    display: none !important;
  }
</style>
