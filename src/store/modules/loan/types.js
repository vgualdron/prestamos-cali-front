export default {
  PATH: '@module/loan',
  actions: {
    LIST_LOANS: '@actions/listLoans',
    GET_LOAN: '@actions/getLoan',
    SAVE_LOAN: '@actions/saveLoan',
    UPDATE_LOAN: '@actions/updateLoan',
    DELETE_LOAN: '@actions/deleteLoan',
  },
  getters: {
  },
  mutations: {
    SET_LOANS: '@mutations/setLoans',
    SET_LOAN: '@mutations/setLoan',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
