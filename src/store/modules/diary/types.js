export default {
  PATH: '@module/diary',
  actions: {
    LIST_DIARIES: '@actions/listDiaries',
    LIST_DIARIES_DAY_BY_DAY: '@actions/listDiariesDayByDay',
    GET_DIARY: '@actions/getDiary',
    SAVE_DIARY: '@actions/saveDiary',
    UPDATE_DIARY: '@actions/updateDiary',
    UPDATE_STATUS_DIARY: '@actions/updateStatusDiary',
    DELETE_DIARY: '@actions/deleteDiary',
  },
  getters: {
  },
  mutations: {
    SET_DIARIES: '@mutations/setDiaries',
    SET_DIARIES_DAY_BY_DAY: '@mutations/setDiariesDayByDay',
    SET_DIARY: '@mutations/setDiary',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
