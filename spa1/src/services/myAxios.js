import axios from 'axios';

const myAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

export default myAxios;
