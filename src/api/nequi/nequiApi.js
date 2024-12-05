import { http } from '../../helpers/http';

export default {
  fetchNequi: (idList) => http({
    url: `${process.env.URL_API}/api/nequi/listing/${idList}`,
    method: 'GET',
  }),
};
