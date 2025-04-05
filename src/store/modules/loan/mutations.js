import types from './types';

export default {
  [types.mutations.SET_LOANS](state, payload) {
    state.loans = payload;
  },
  [types.mutations.SET_LOAN](state, payload) {
    state.loan = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
