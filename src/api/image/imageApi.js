import { http } from '../../helpers/http';

export default {
  save: (data) => http({
    url: `${process.env.URL_API}/api/image/create`,
    method: 'POST',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/image/delete/${id}`,
    method: 'DELETE',
  }),
};
