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
  async [types.actions.FETCH_DELIVERY]({ commit }, payload) {
    try {
      const response = await listingApi.fetchDelivery(payload);
      commit(types.mutations.SET_DELIVERY, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_DELIVERY, error.response.data);
    }
  },
  async [types.actions.FETCH_MINE_LISTINGS]({ commit }, payload) {
    try {
      const response = await listingApi.fetchMineListings(payload);
      commit(types.mutations.SET_LISTINGS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LISTINGS, error.response.data);
    }
  },
  async [types.actions.ADD_LISTING]({ commit }, payload) {
    try {
      const response = await listingApi.addListing(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
  async [types.actions.UPDATE_LISTING]({ commit }, payload) {
    try {
      const response = await listingApi.updateListing(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
  async [types.actions.DELETE_LISTING]({ commit }, id) {
    try {
      const response = await listingApi.deleteListing(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
};
