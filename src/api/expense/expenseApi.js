import { http } from '../../helpers/http';

export default {
  list: (status) => http({
    url: `${process.env.URL_API}/api/expense/list/${status}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/expense/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/expense`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/expense/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/expense/${id}`,
    method: 'DELETE',
  }),
};
