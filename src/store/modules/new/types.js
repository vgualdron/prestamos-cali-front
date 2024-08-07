export default {
  PATH: '@module/new',
  actions: {
    UPDATE_USER_SELECTED_REVIEW: '@actions/updateUserSelectedReview',
    UPDATE_SECTOR_SELECTED_REVIEW: '@actions/updateSectorSelectedReview',
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
    SET_USER_SELECTED_REVIEW: '@mutations/setUserSelectedReview',
    SET_SECTOR_SELECTED_REVIEW: '@mutations/setSectorSelectedReview',
    SET_NEWS: '@mutations/setNews',
    SET_NEW: '@mutations/setNew',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
