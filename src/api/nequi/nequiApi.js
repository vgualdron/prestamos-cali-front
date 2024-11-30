import { http } from '../../helpers/http';

export default {
  fetchNequi: () => http({
    url: `${process.env.URL_API}/api/nequi`,
    method: 'GET',
  }),
};
