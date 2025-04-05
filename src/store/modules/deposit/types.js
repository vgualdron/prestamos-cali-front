export default {
  PATH: '@module/deposit',
  actions: {
    LIST_DEPOSITS: '@actions/listDeposits',
    SAVE_DEPOSIT: '@actions/saveDeposit',
    UPDATE_DEPOSIT: '@actions/updateDeposit',
    DELETE_DEPOSIT: '@actions/deleteDeposit',
  },
  getters: {
  },
  mutations: {
    SET_DEPOSIT: '@mutations/setDeposit',
    SET_DEPOSITS: '@mutations/setDeposits',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
