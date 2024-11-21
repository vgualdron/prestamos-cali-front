export default {
  PATH: '@module/listing',
  actions: {
    FETCH_LISTINGS: '@actions/fetchListings',
    FETCH_DELIVERY: '@actions/fetchDelivery',
    FETCH_MINE_LISTINGS: '@actions/fetchMineListings',
    ADD_LISTING: '@actions/addListing',
    UPDATE_LISTING: '@actions/updateListing',
    DELETE_LISTING: '@actions/deleteListing',
  },
  getters: {
  },
  mutations: {
    SET_LISTINGS: '@mutations/setListings',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_DELIVERY: '@mutations/setDelivery',
  },
};
