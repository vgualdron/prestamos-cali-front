<template>
  <q-page class="">
    <table-diary
      v-if="diariesDayByDay && diariesDayByDay.length > 0"
      :data="diariesDayByDay"
      @addVisit="addVisit"/>
  </q-page>
</template>

<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableDiary from 'components/diary/TableDiary.vue';
import commonTypes from '../store/modules/common/types';
import diaryTypes from '../store/modules/diary/types';
// import { showNotifications } from '../helpers/showNotifications';
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
  },
  methods: {
    ...mapActions(diaryTypes.PATH, {
      listDiaries: diaryTypes.actions.LIST_DIARIES,
      listDiariesDayByDay: diaryTypes.actions.LIST_DIARIES_DAY_BY_DAY,
      saveDiary: diaryTypes.actions.SAVE_DIARY,
    }),
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
    },
    addVisit(item) {
      this.$emit('addVisit', item);
    },
  },
};
</script>
