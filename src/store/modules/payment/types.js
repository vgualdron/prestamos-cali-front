export default {
  PATH: '@module/payment',
  actions: {
    FETCH_PAYMENTS: '@actions/fetchPayments',
    FETCH_PAYMENTS_BY_LENDING: '@actions/fetchPaymentsByLending',
    ADD_PAYMENT: '@actions/addPayment',
    UPDATE_PAYMENT: '@actions/updatePayment',
    DELETE_PAYMENT: '@actions/deletePayment',
  },
  getters: {
  },
  mutations: {
    SET_PAYMENTS: '@mutations/setPayments',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
