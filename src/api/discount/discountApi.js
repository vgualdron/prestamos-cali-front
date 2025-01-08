import { http } from '../../helpers/http';

export default {
  addDiscount: (data) => http({
    url: `${process.env.URL_API}/api/discount`,
    method: 'POST',
    data,
  }),
  deleteDiscount: (id) => http({
    url: `${process.env.URL_API}/api/discount/${id}`,
    method: 'DELETE',
  }),
};
