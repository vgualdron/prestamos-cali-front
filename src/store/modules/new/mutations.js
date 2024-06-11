import types from './types';

export default {
  [types.mutations.SET_NEWS](state, payload) {
    state.news = payload;
  },
  [types.mutations.SET_NEW](state, payload) {
    state.new = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
