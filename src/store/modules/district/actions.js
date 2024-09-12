import types from './types';
import districtApi from '../../../api/district/districtApi';

export default {
  async [types.actions.FETCH_DISTRICTS]({ commit }, payload) {
    try {
      const response = await districtApi.fetchDistricts(payload);
      commit(types.mutations.SET_DISTRICTS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_DISTRICTS, []);
    }
  },
  async [types.actions.ADD_DISTRICT]({ commit }, payload) {
    try {
      const response = await districtApi.addDistrict(payload);
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
  async [types.actions.UPDATE_DISTRICT]({ commit }, payload) {
    try {
      const response = await districtApi.updateDistrict(payload);
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
  async [types.actions.DELETE_DISTRICT]({ commit }, id) {
    try {
      const response = await districtApi.deleteDistrict(id);
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
