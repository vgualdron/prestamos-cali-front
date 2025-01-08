import { http } from '../../helpers/http';

export default {
  list: ({ status, items }) => http({
    url: `${process.env.URL_API}/api/expense/${status}/exclude-items/${items}`,
    method: 'GET',
  }),
  listByUser: ({ user, status, items }) => http({
    url: `${process.env.URL_API}/api/expense/list-by-user/${user}/${status}/exclude-items/${items}`,
    method: 'GET',
  }),
  listByItem: ({ status, item }) => http({
    url: `${process.env.URL_API}/api/expense/item/${status}/${item}`,
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
