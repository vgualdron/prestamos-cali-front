import types from './types';

export default {
  [types.mutations.SET_USERS](state, payload) {
    state.users = payload;
  },
  [types.mutations.SET_USERS_OPTIONS](state, payload) {
    state.usersOptions = payload;
  },
  [types.mutations.SET_USER](state, payload) {
    state.user = payload;
  },
  [types.mutations.SET_INFO](state, payload) {
    state.info = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
