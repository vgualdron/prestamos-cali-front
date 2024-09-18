import types from './types';
import paymentApi from '../../../api/payment/paymentApi';

export default {
  async [types.actions.FETCH_PAYMENTS]({ commit }, payload) {
    try {
      const response = await paymentApi.fetchPayments(payload);
      commit(types.mutations.SET_PAYMENTS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LENDINGS, error.response.data);
    }
  },
  async [types.actions.FETCH_PAYMENTS_BY_LENDING]({ commit }, payload) {
    try {
      const response = await paymentApi.fetchPaymentsByLending(payload);
      commit(types.mutations.SET_PAYMENTS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LENDINGS, error.response.data);
    }
  },
  async [types.actions.ADD_PAYMENT]({ commit }, payload) {
    try {
      const response = await paymentApi.addPayment(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
  async [types.actions.UPDATE_PAYMENT]({ commit }, payload) {
    try {
      const response = await paymentApi.updatePayment(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
  async [types.actions.DELETE_PAYMENT]({ commit }, id) {
    try {
      const response = await paymentApi.deletePayment(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
};
