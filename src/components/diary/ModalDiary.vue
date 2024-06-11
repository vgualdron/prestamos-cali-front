<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      full-width
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
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
          <div class="row">
            <div class="col-12 text-center">
              <q-btn
                class="q-ml-xs"
                color="primary"
                label="Agenda actual"
                size="md"
                @click="viewDiary('current')"
              />
              <q-btn
                class="q-ml-xs"
                color="primary"
                label="Agenda proxima semana"
                size="md"
                @click="viewDiary('next')"
              />
            </div>
          </div>
          <table-diary
            v-if="diariesDayByDay.length > 0" :data="diariesDayByDay" :type="type"
            @addVisit="addVisit"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import Moment from 'moment';
import { mapState, mapActions } from 'vuex';
import TableDiary from 'components/diary/TableDiary.vue';
import diaryTypes from '../../store/modules/diary/types';
// import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
    };
  },
  components: {
    TableDiary,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    userId: {
      required: true,
    },
  },
  async mounted() {
    await this.viewDiary('current');
  },
  computed: {
    ...mapState(diaryTypes.PATH, {
      diaries: 'diaries',
      diariesDayByDay: 'diariesDayByDay',
      diaryStatus: 'status',
      diaryResponseMessages: 'responseMessages',
    }),
    title() {
      if (this.diariesDayByDay && this.diariesDayByDay.length > 0 && this.diariesDayByDay[0].items && this.diariesDayByDay[0].items.length > 0) {
        return `Agenda Semanal de ${this.diariesDayByDay[0].items[0].userName}`;
      }
      return '';
    },
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
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
