export default {
  PATH: '@module/news',
  actions: {
    LIST_NEWS: '@actions/listNews',
    GET_NEW: '@actions/getNew',
    SAVE_NEW: '@actions/saveNew',
    UPDATE_NEW: '@actions/updateNew',
    COMPLETE_DATA_NEW: '@actions/completeDataNew',
    UPDATE_STATUS_NEW: '@actions/updateStatusNew',
    DELETE_NEW: '@actions/deleteNew',
  },
  getters: {
  },
  mutations: {
    SET_NEWS: '@mutations/setNews',
    SET_NEW: '@mutations/setNew',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
