import { http } from '../../helpers/http';

export default {
  fetchListings: () => http({
    url: `${process.env.URL_API}/api/listing`,
    method: 'GET',
  }),
  getListing: (id) => http({
    url: `${process.env.URL_API}/api/listing/${id}`,
    method: 'GET',
  }),
  fetchMineListings: () => http({
    url: `${process.env.URL_API}/api/listing/mine`,
    method: 'GET',
  }),
  addListing: (data) => http({
    url: `${process.env.URL_API}/api/listing`,
    method: 'POST',
    data,
  }),
  updateListing: (data) => http({
    url: `${process.env.URL_API}/api/listing/${data.id}`,
    method: 'PUT',
    data,
  }),
  deleteListing: (id) => http({
    url: `${process.env.URL_API}/api/listing/${id}`,
    method: 'DELETE',
  }),
  fetchDelivery: ({ idList, date }) => http({
    url: `${process.env.URL_API}/api/listing/delivery/listing/${idList}/date/${date}`,
    method: 'GET',
  }),
  fetchWithDeliveries: ({ date }) => http({
    url: `${process.env.URL_API}/api/listing/list-with-deliveries/${date}`,
    method: 'GET',
  }),
  getInfo: (id) => http({
    url: `${process.env.URL_API}/api/listing/get-info/${id}`,
    method: 'GET',
  }),
  addCapitalListing: (data) => http({
    url: `${process.env.URL_API}/api/capitallisting`,
    method: 'POST',
    data,
  }),
};
