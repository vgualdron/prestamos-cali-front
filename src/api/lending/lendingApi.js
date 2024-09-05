import { http } from '../../helpers/http';

export default {
  fetchLendings: () => http({
    url: `${process.env.URL_API}/api/lending`,
    method: 'GET',
  }),
  fetchLendingsByList: (data) => http({
    url: `${process.env.URL_API}/api/lending/list/${data.idList}/payments/current-date`,
    method: 'GET',
  }),
  addLending: (data) => http({
    url: `${process.env.URL_API}/api/lending`,
    method: 'POST',
    data,
  }),
  updateLending: (data) => http({
    url: `${process.env.URL_API}/api/lending/${data.id}`,
    method: 'PUT',
    data,
  }),
  deleteLending: (id) => http({
    url: `${process.env.URL_API}/api/lending/${id}`,
    method: 'DELETE',
  }),
};
