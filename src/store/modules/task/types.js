export default {
  PATH: '@module/task',
  actions: {
    FETCH_TASKS: '@actions/fetchTasks',
    ADD_TASK: '@actions/addTask',
    UPDATE_TASK: '@actions/updateTask',
    DELETE_TASK: '@actions/deleteTask',
  },
  getters: {
  },
  mutations: {
    SET_TASKS: '@mutations/setTasks',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
