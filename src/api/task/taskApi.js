import { http } from '../../helpers/http';

export default {
  list: (status) => http({
    url: `${process.env.URL_API}/api/task/${status}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/task/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/task`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/task/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/task/${id}`,
    method: 'DELETE',
  }),
};
