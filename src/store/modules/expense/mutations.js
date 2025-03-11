import types from './types';

export default {
  [types.mutations.SET_EXPENSES](state, payload) {
    state.expenses = payload;
  },
  [types.mutations.SET_EXPENSES_PENDINGS](state, payload) {
    state.expensesPendings = payload;
  },
  [types.mutations.SET_EXPENSE](state, payload) {
    state.expense = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
