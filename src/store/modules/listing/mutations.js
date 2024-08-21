import types from './types';

export default {
  [types.mutations.SET_LISTINGS](state, payload) {
    state.listings = payload;
  },
  [types.mutations.SET_STATUS_ADD_LISTING](state, payload) {
    state.statusAddListing = payload;
  },
};
