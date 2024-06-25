export default {
  PATH: '@module/zip',
  actions: {
    LIST_ZIPS: '@actions/listZips',
    CREATE_ZIP: '@actions/createZip',
  },
  getters: {
  },
  mutations: {
    SET_ZIPS: '@mutations/setZips',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
