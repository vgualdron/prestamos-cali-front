import { http } from '../../helpers/http';

export default {
  list: (status) => http({
    url: `${process.env.URL_API}/api/expense/list/${status}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/expense/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/expense/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/expense/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/expense/delete/${id}`,
    method: 'DELETE',
  }),
};
