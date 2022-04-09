import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const instance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Accept": "multipart/form-data",
    "Content-type": "application/x-www-form-urlencoded;multipart/form-data; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  }
});

instance.interceptors.request.use((config) => {
  let params = config.params || {};
  let browserData = localStorage.getItem('USER_INFO');
  if (browserData != null) {
    let jsonAccess = JSON.parse(browserData);
    let authToken = localStorage.getItem('AUTH_TOKEN');
    config.params = {
      ...params,
      logged_user_id: jsonAccess.user_id,
      logged_site_id: jsonAccess.site_id,
      auth_token: authToken
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;