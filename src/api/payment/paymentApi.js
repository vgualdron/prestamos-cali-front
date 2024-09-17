import { http } from '../../helpers/http';

export default {
  fetchPayments: () => http({
    url: `${process.env.URL_API}/api/payment`,
    method: 'GET',
  }),
  fetchPaymentsByLending: (data) => http({
    url: `${process.env.URL_API}/api/payment/lending/${data.idLending}`,
    method: 'GET',
  }),
  addPayment: (data) => http({
    url: `${process.env.URL_API}/api/payment`,
    method: 'POST',
    data,
  }),
  updatePayment: (data) => http({
    url: `${process.env.URL_API}/api/payment/${data.id}`,
    method: 'PUT',
    data,
  }),
  deletePayment: (id) => http({
    url: `${process.env.URL_API}/api/payment/${id}`,
    method: 'DELETE',
  }),
};
