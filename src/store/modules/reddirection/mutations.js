import types from './types';

export default {
  [types.mutations.SET_REDDIRECTION](state, payload) {
    state.reddirection = payload;
  },
  [types.mutations.SET_REDDIRECTIONS](state, payload) {
    state.reddirections = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
