import { http } from '../../helpers/http';

export default {
  fetchDistricts: () => http({
    url: `${process.env.URL_API}/api/district`,
    method: 'GET',
  }),
  addDistrict: (data) => http({
    url: `${process.env.URL_API}/api/district`,
    method: 'POST',
    data,
  }),
  updateDistrict: (data) => http({
    url: `${process.env.URL_API}/api/district/${data.id}`,
    method: 'PUT',
    data,
  }),
  deleteDistrict: (id) => http({
    url: `${process.env.URL_API}/api/district/${id}`,
    method: 'DELETE',
  }),
};
