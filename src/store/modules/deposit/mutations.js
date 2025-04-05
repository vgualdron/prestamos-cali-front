import types from './types';

export default {
  [types.mutations.SET_DEPOSITS](state, payload) {
    state.deposits = payload;
  },
  [types.mutations.SET_DEPOSIT](state, payload) {
    state.deposit = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
