import { http } from '../../helpers/http';

export default {
  fetchListings: () => http({
    url: `${process.env.URL_API}/api/listing`,
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
};
