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
