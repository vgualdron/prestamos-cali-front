import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/question/${data.status}/${data.type}`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/question/${id}`,
    method: 'GET',
  }),
  getStatus: (data) => http({
    url: `${process.env.URL_API}/api/question/get-status`,
    method: 'POST',
    data,
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/question`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/question/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/question/${id}`,
    method: 'DELETE',
  }),
};
