import { http } from '../../helpers/http';

export default {
  save: (data) => http({
    url: `${process.env.URL_API}/api/redcollectors`,
    method: 'POST',
    data,
  }),
};
