import { httpPush } from '../../helpers/httpPush';

export default {
  send: (data) => httpPush({
    headers: {
      Authorization: 'Basic NDc1MjRjOTUtYjgzNy00OGVjLWJkMjAtYjE1ZGEzODk0OWU4',
      'Content-Type': 'application/json',
    },
    url: 'https://onesignal.com/api/v1/notifications',
    method: 'POST',
    data,
  }),
};
