import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/deposit/${data.status}`,
    method: 'GET',
    data,
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/deposit`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/deposit/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/deposit/${id}`,
    method: 'DELETE',
  }),
};
