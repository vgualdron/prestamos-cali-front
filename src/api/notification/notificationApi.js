import { http } from '../../helpers/http';

export default {
  send: (data) => http({
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic MGM2OTI2NzYtM2ExMy00MGI4LWIwZWMtMjYxNzRkNDI0NGRj',
    },
    url: `https://onesignal.com/api/v1/notifications`,
    method: 'POST',
    data,
  }),
};
