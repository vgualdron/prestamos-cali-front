import { http } from '../../helpers/http';

export default {
  save: (data) => http({
    url: `${process.env.URL_API}/api/reddirections`,
    method: 'POST',
    data,
  }),
  getCurrentByUser: (id) => http({
    url: `${process.env.URL_API}/api/reddirections/get-current-by-user/${id}`,
    method: 'GET',
  }),
  getByUserAndDate: ({ user, date }) => http({
    url: `${process.env.URL_API}/api/reddirections/get-by-user-and-date/${user}/${date}`,
    method: 'GET',
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/reddirections/${data.id}`,
    method: 'PUT',
    data,
  }),
  getByLending: (id) => http({
    url: `${process.env.URL_API}/api/reddirections/get-by-lending/${id}`,
    method: 'GET',
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/reddirections/${id}`,
    method: 'DELETE',
  }),
};
