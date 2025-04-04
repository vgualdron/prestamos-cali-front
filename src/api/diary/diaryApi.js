import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/diary/list/${data.date}/${data.userId}/${data.moment}`,
    method: 'GET',
  }),
  listDayByDay: (data) => http({
    url: `${process.env.URL_API}/api/diary/list-day-by-day/${data.date}/${data.userId}/${data.moment}`,
    method: 'GET',
  }),
  listVisitsReview: (data) => http({
    url: `${process.env.URL_API}/api/diary/list-visits-review/${data.date}`,
    method: 'GET',
  }),
  getByUserAndDate: ({ user, date }) => http({
    url: `${process.env.URL_API}/api/diary/get-by-user-and-date/${user}/${date}`,
    method: 'GET',
  }),
  getStatusCases: (data) => http({
    url: `${process.env.URL_API}/api/diary/get-status-cases/${data.id}`,
    method: 'GET',
  }),
  approveVisit: (data) => http({
    url: `${process.env.URL_API}/api/diary/approve-visit`,
    method: 'POST',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/diary/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/diary/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/diary/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  completeData: (data) => http({
    url: `${process.env.URL_API}/api/diary/complete-data/${data.id}`,
    method: 'PUT',
    data,
  }),
  updateStatus: (data) => http({
    url: `${process.env.URL_API}/api/diary/update-status/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/diary/delete/${id}`,
    method: 'DELETE',
  }),
};
