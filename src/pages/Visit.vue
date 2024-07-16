<template>
  <q-page class="">
    <q-btn
      round
      icon="west"
      class="q-ml-md q-mt-md"
      color="primary"
      @click="$router.go(-1)">
    </q-btn>
    <q-btn
      round
      icon="refresh"
      class="q-ml-md q-mt-md"
      color="primary">
    </q-btn>
    <StepperVisit :id="newId"/>
  </q-page>
</template>

<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import StepperVisit from 'components/visit/StepperVisit.vue';
import commonTypes from '../store/modules/common/types';
import diaryTypes from '../store/modules/diary/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  components: {
    StepperVisit,
  },
  data() {
    return {
      newId: null,
    };
  },
  name: 'PageVisit',
  async mounted() {
    const { id } = this.$route.params;
    this.newId = id;
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
        items.forEach((item) => {
          const dateItem = new Date(item.date);
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 2);
          if (dateItem.getTime() > currentDate.getTime() && dateItem.getTime() < endDate.getTime()) {
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
      listDiariesDayByDay: diaryTypes.actions.LIST_DIARIES_DAY_BY_DAY,
      saveDiary: diaryTypes.actions.SAVE_DIARY,
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

      if (this.diaries.length === 0) {
        await this.saveDiary({
          userId: this.userId,
          date: new Moment(new Date()).format('YYYY-MM-DD'),
          moment,
        });
      }
      await this.listDiariesDayByDay({
        userId: this.userId,
        date: new Moment(new Date()).format('YYYY-MM-DD'),
        moment,
      });
      this.showModalDiaryRead = true;
      this.$q.loading.hide();
      this.showNotification(this.diaryResponseMessages, this.diaryStatus, 'top-right', 5000);
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
  },
};
</script>
