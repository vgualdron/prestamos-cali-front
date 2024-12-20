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
  update: (data) => http({
    url: `${process.env.URL_API}/api/reddirections/${data.id}`,
    method: 'PUT',
    data,
  }),
};
