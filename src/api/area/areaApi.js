import { http } from '../../helpers/http';

export default {
  fetchAreas: () => http({
    url: `${process.env.URL_API}/api/area`,
    method: 'GET',
  }),
};
