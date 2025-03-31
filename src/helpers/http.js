import axios from 'axios';
import moment from 'moment-timezone';

export const http = ({ url, method, data }) => {
  const fechaColombia = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
  const token = localStorage.getItem('tokenMC');
  return axios({
    url,
    method,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
      'X-Client-Timestamp': fechaColombia,
    },
  });
};

export default {};
