export default {
  PATH: '@module/lending',
  actions: {
    FETCH_LENDINGS: '@actions/fetchLendings',
    GET_LENDING: '@actions/getLending',
    ADD_LENDING: '@actions/addLending',
    UPDATE_LENDING: '@actions/updateLending',
    DELETE_LENDING: '@actions/deleteLending',
    RENOVATE_LENDING: '@actions/renovateLending',
    FETCH_HISTORY: '@actions/fetchHistory',
  },
  getters: {
  },
  mutations: {
    SET_LENDINGS: '@mutations/setLendings',
    SET_LENDING: '@mutations/setLending',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_HISTORY: '@mutations/setHistory',
  },
};
