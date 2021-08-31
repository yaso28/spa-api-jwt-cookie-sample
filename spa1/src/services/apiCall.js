import myAxios from './myAxios';

const get = (url) => myAxios.get(url);
const post = (url, data = {}) => myAxios.post(url, data);

const apiCall = {
  getIndex: () => get('/'),
  login: (data = {}) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  getPointList: () => get('/point/list'),
  getPoint: (id) => get(`/point/get/${id}`),
};

export default apiCall;
