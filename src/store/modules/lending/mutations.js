import types from './types';

export default {
  [types.mutations.SET_LENDINGS](state, payload) {
    state.lendings = payload;
  },
  [types.mutations.SET_LENDING](state, payload) {
    state.lending = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
  [types.mutations.SET_HISTORY](state, payload) {
    state.history = payload;
  },
};
