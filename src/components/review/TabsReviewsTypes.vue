<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="bg-white text-grey shadow-2"
        active-color="white"
        indicator-color="white"
        active-bg-color="primary"
        active-class="XXX"
        align="justify"
        narrow-indicator
      >
        <q-tab name="one" :label="labelOne" />
        <q-tab name="two" :label="labelTwo" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one">
          <table-reviews tab="one"/>
        </q-tab-panel>
        <q-tab-panel name="two">
          <table-reviews tab="two"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script>
import TableReviews from 'components/review/TableReviews.vue';
import { mapState, mapActions } from 'vuex';
import newTypes from '../../store/modules/new/types';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      tab: 'one',
      prefixLabelOne: 'Primera vez',
      labelOne: 'Primera vez',
      prefixLabelTwo: 'Segunda vez',
      labelTwo: 'Segunda vez',
      polling: null,
    };
  },
  components: {
    TableReviews,
  },
  props: [
  ],
  watch: {
  },
  computed: {
    ...mapState(newTypes.PATH, [
      'news',
      'responseMessages',
      'status',
    ]),
  },
  created() {
    this.getData();
    this.pollData();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
    }),
    async getData() {
      showLoading('Consultando ...', 'Por favor, espere', true);
      if (this.tab === 'one') {
        await this.listNews(['pendiente']);
        this.labelTwo = `${this.prefixLabelTwo} [ ${this.news.length} ]`;
        await this.listNews(['creado']);
        this.labelOne = `${this.prefixLabelOne} [ ${this.news.length} ]`;
      } else {
        await this.listNews(['creado']);
        this.labelOne = `${this.prefixLabelOne} [ ${this.news.length} ]`;
        await this.listNews(['pendiente']);
        this.labelTwo = `${this.prefixLabelTwo} [ ${this.news.length} ]`;
      }
      this.$q.loading.hide();
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.getData();
      }, 60000);
    },
  },
};
</script>
