export default {
  PATH: '@module/reddirection',
  actions: {
    SAVE_REDDIRECTION: '@actions/saveReddirection',
    UPDATE_REDDIRECTION: '@actions/updateReddirection',
    GET_CURRENT_BY_USER: '@actions/getCurrentByUser',
    GET_BY_LENDING: '@actions/getByLending',
    DELETE_REDDIRECTION: '@actions/deleteReddirection',
  },
  getters: {
  },
  mutations: {
    SET_REDDIRECTION: '@mutations/setRedDirection',
    SET_REDDIRECTIONS: '@mutations/setRedDirections',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
