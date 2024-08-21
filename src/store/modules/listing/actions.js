import types from './types';
import listingApi from '../../../api/listing/listingApi';

export default {
  async [types.actions.FETCH_LISTINGS]({ commit }, payload) {
    try {
      const response = await listingApi.fetchListings(payload);
      commit(types.mutations.SET_LISTINGS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LISTINGS, error.response.data);
    }
  },
  async [types.actions.ADD_LISTING]({ commit }, payload) {
    try {
      const response = await listingApi.addListing(payload);
      commit(types.mutations.SET_STATUS_ADD_LISTING, response.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_STATUS_ADD_LISTING, error.response.data);
    }
  },
  async [types.actions.UPDATE_LISTING](context, payload) {
    try {
      await listingApi.updateListing(payload);
    } catch (error) {
      console.error(error);
    }
  },
  async [types.actions.DELETE_LISTING](context, id) {
    try {
      await listingApi.deleteListing(id);
    } catch (error) {
      console.error(error);
    }
  },
};
