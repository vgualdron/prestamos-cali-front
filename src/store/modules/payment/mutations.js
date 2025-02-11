import types from './types';

export default {
  [types.mutations.SET_PAYMENT](state, payload) {
    state.payment = payload;
  },
  [types.mutations.SET_PAYMENTS](state, payload) {
    state.payments = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
