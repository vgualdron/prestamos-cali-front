<template>
  <q-page class="">
    <table-diary
      v-if="diaries && diaries.length > 0"
      :data="diaries"
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
      const a = [];
      this.diariesDayByDay.forEach(({ date, items }) => {
        const b = {
          date,
          items: [],
        };

        const now = new Moment().subtract(1, 'days');
        const startDate = now.startOf('day');
        const end = new Moment().add(0, 'days');
        const endDate = end.endOf('day');

        items.forEach((item) => {
          const dateItem = new Moment(item.date);
          const isInRangeExclusive = dateItem.isBetween(startDate, endDate);
          if (isInRangeExclusive) {
            b.items.push(item);
          }
        });
        a.push(b);
      });
      return a;
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
