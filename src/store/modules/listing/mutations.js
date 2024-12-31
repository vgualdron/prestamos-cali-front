import types from './types';

export default {
  [types.mutations.SET_LISTINGS](state, payload) {
    state.listings = payload;
  },
  [types.mutations.SET_LISTING](state, payload) {
    state.listing = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
  [types.mutations.SET_DELIVERY](state, payload) {
    state.delivery = payload;
  },
  [types.mutations.SET_INFO_LISTING](state, payload) {
    state.info = payload;
  },
};
