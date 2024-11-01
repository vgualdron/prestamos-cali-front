import types from './types';
import itemApi from '../../../api/item/itemApi';

export default {
  async [types.actions.LIST_ITEMS]({ commit }, payload) {
    try {
      const response = await itemApi.fetchItemsByArea(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_ITEMS, response.data.data);
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
