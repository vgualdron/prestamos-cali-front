import { http } from '../../helpers/http';

export default {
  fetchLendings: () => http({
    url: `${process.env.URL_API}/api/lending`,
    method: 'GET',
  }),
  getLending: (id) => http({
    url: `${process.env.URL_API}/api/lending/${id}`,
    method: 'GET',
  }),
  fetchLendingsByList: (data) => http({
    url: `${process.env.URL_API}/api/lending/list/${data.idList}/payments/current-date`,
    method: 'GET',
  }),
  fetchLendingsForSale: (data) => http({
    url: `${process.env.URL_API}/api/lending/list-for-sale/${data}`,
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
  renovateLending: (data) => http({
    url: `${process.env.URL_API}/api/lending/renovate/${data.id}`,
    method: 'POST',
    data,
  }),
  renewOldLending: (data) => http({
    url: `${process.env.URL_API}/api/lending/renew-old`,
    method: 'POST',
    data,
  }),
  fetchHistoryByNewId: (newId) => http({
    url: `${process.env.URL_API}/api/lending/history/${newId}`,
    method: 'GET',
  }),
};
