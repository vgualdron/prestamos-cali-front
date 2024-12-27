import types from './types';
import lendingApi from '../../../api/lending/lendingApi';

export default {
  async [types.actions.FETCH_LENDINGS]({ commit }, payload) {
    try {
      const response = await lendingApi.fetchLendingsByList(payload);
      commit(types.mutations.SET_LENDINGS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LENDINGS, error.response.data);
    }
  },
  async [types.actions.FETCH_LENDINGS_CLOSED]({ commit }, payload) {
    try {
      const response = await lendingApi.fetchLendingsForSale(payload);
      commit(types.mutations.SET_LENDINGS_CLOSED, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LENDINGS_CLOSED, error.response.data);
    }
  },
  async [types.actions.GET_LENDING]({ commit }, payload) {
    try {
      const response = await lendingApi.getLending(payload);
      commit(types.mutations.SET_LENDING, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_LENDING, error.response.data);
    }
  },
  async [types.actions.ADD_LENDING]({ commit }, payload) {
    try {
      const response = await lendingApi.addLending(payload);
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
  async [types.actions.UPDATE_LENDING]({ commit }, payload) {
    try {
      const response = await lendingApi.updateLending(payload);
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
  async [types.actions.DELETE_LENDING]({ commit }, id) {
    try {
      const response = await lendingApi.deleteLending(id);
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
  async [types.actions.RENOVATE_LENDING]({ commit }, payload) {
    try {
      const response = await lendingApi.renovateLending(payload);
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
  async [types.actions.FETCH_HISTORY]({ commit }, payload) {
    try {
      const response = await lendingApi.fetchHistoryByNewId(payload);
      commit(types.mutations.SET_HISTORY, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_HISTORY, error.response.data);
    }
  },
};
