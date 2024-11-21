import types from './types';

export default {
  [types.mutations.SET_QUESTIONS](state, payload) {
    state.questions = payload;
  },
  [types.mutations.SET_QUESTION](state, payload) {
    state.question = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
