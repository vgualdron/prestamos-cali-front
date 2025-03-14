import types from './types';

export default {
  [types.mutations.SET_AREAS](state, payload) {
    state.areas = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
