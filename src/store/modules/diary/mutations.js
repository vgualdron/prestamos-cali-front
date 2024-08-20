import types from './types';

export default {
  [types.mutations.SET_DIARIES](state, payload) {
    state.diaries = payload;
  },
  [types.mutations.SET_DIARIES_DAY_BY_DAY](state, payload) {
    state.diariesDayByDay = payload;
  },
  [types.mutations.SET_DIARY](state, payload) {
    state.diary = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
  [types.mutations.SET_STATUS_CASES](state, payload) {
    state.statusCases = payload;
  },
};
