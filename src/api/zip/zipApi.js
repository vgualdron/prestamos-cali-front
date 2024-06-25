import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/zip/list`,
    method: 'GET',
    data,
  }),
  create: (data) => http({
    url: `${process.env.URL_API}/api/zip/create`,
    method: 'GET',
    data,
  }),
};
