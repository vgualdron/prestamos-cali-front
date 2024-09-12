export default {
  PATH: '@module/district',
  actions: {
    FETCH_DISTRICTS: '@actions/fetchDistricts',
    ADD_DISTRICT: '@actions/addDistrict',
    UPDATE_DISTRICT: '@actions/updateDistrict',
    DELETE_DISTRICT: '@actions/deleteDistrict',
  },
  getters: {
  },
  mutations: {
    SET_DISTRICTS: '@mutations/setDistricts',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
