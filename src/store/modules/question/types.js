export default {
  PATH: '@module/question',
  actions: {
    LIST_QUESTIONS: '@actions/listQuestions',
    GET_QUESTION: '@actions/getQuestion',
    GET_STATUS_QUESTION: '@actions/getStatusQuestion',
    SAVE_QUESTION: '@actions/saveQuestion',
    UPDATE_QUESTION: '@actions/updateQuestion',
    DELETE_QUESTION: '@actions/deleteQuestion',
  },
  getters: {
  },
  mutations: {
    SET_QUESTIONS: '@mutations/setQuestions',
    SET_QUESTION: '@mutations/setQuestion',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
