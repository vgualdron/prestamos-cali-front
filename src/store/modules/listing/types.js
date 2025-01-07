export default {
  PATH: '@module/listing',
  actions: {
    FETCH_LISTINGS: '@actions/fetchListings',
    GET_LISTING: '@actions/getListing',
    FETCH_DELIVERY: '@actions/fetchDelivery',
    FETCH_WITH_DELIVERIES: '@actions/fetchWithDeliveries',
    FETCH_MINE_LISTINGS: '@actions/fetchMineListings',
    ADD_LISTING: '@actions/addListing',
    UPDATE_LISTING: '@actions/updateListing',
    DELETE_LISTING: '@actions/deleteListing',
    GET_INFO_LISTING: '@actions/getInfoListing',
    ADD_DELIVERY_LISTING: '@actions/addDeliveryListing',
  },
  getters: {
  },
  mutations: {
    SET_LISTING: '@mutations/setListing',
    SET_LISTINGS: '@mutations/setListings',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_DELIVERY: '@mutations/setDelivery',
    SET_INFO_LISTING: '@mutations/setInfoListing',
  },
};
