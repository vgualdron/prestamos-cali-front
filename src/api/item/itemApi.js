import { http } from '../../helpers/http';

export default {
  fetchItemsByArea: (idArea) => http({
    url: `${process.env.URL_API}/api/item/area/${idArea}`,
    method: 'GET',
  }),
};
