export default {
  PATH: '@module/workplan',
  actions: {
    FETCH_WORKPLANS: '@actions/fetchWorkplan',
    ADD_WORKPLAN: '@actions/addWorkplan',
    UPDATE_WORKPLAN: '@actions/updateWorkplan',
    DELETE_WORKPLAN: '@actions/deleteWorkplan',
  },
  getters: {
  },
  mutations: {
    SET_WORKPLANS: '@mutations/setWorkplans',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
