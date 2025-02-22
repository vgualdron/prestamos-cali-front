import { http } from '../../helpers/http';

export default {
  list: (date) => http({
    url: `${process.env.URL_API}/api/workplan/${date}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/workplan/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/workplan`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/workplan/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/workplan/${id}`,
    method: 'DELETE',
  }),
};
