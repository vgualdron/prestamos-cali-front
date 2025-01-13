<template>
  <q-page class="">
    <table-diary
      v-if="dataTable && dataTable.length > 0"
      :data="dataTable"
      type="visitor"
      @addVisit="addVisit"/>
  </q-page>
</template>

<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableDiary from 'components/diary/TableDiary.vue';
import commonTypes from '../store/modules/common/types';
import diaryTypes from '../store/modules/diary/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  components: { TableDiary },
  data() {
    return {
    };
  },
  name: 'PageMyDiary',
  async mounted() {
    await this.viewDiary('current');
  },
  computed: {
    ...mapState(commonTypes.PATH, {
      userId: 'user',
    }),
    ...mapState(diaryTypes.PATH, {
      diaries: 'diaries',
      diariesDayByDay: 'diariesDayByDay',
      diaryStatus: 'status',
      diaryResponseMessages: 'responseMessages',
    }),
    dataTable() {
      const today = Moment().format('YYYY-MM-DD'); // Obtiene la fecha actual en formato 'YYYY-MM-DD'

      return this.diaries.filter((item) => {
        const itemDate = Moment(item.date).format('YYYY-MM-DD'); // Convierte la fecha del objeto al mismo formato
        return itemDate === today; // Compara si es igual a la fecha actual
      });
    },
    onlyOneItem() {
      const visiting = this.dataTable.find((item) => item.status === 'visitando');
      if (visiting) {
        return [visiting];
      }
      const scheduled = this.dataTable.find((item) => item.status === 'agendado');
      // Si no hay 'visitando', busca el primer objeto con status 'agendado'
      return scheduled ? [scheduled] : [];
    },
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      listDiaries: diaryTypes.actions.LIST_DIARIES,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async viewDiary(moment) {
      showLoading('Consultando ...', 'Por favor, espere', true);
      await this.listDiaries({
        userId: this.userId,
        date: new Moment(new Date()).format('YYYY-MM-DD'),
        moment,
      });
      this.$q.loading.hide();
      this.showNotification(this.diaryResponseMessages, this.diaryStatus, 'top-right', 5000);
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
  },
};
</script>
