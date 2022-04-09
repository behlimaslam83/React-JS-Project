
import { Component } from 'react';
import http from "../services/http-common";
const querystring = require('querystring');

class ApiDataService extends Component{
  getAll(path, param) {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    var menu = localStorage.getItem(menuname);
    let config = this.setUpConfiguartion(menu);
    return http.get(`${path}${param}`, config);
  }
  get(path,lang) {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    var menu = localStorage.getItem(menuname);
    let config = this.setUpConfiguartion(menu, lang);
    return http.get(`${path}`, config);
  }
  post(path, data) {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    var menu = localStorage.getItem(menuname);
    let config = this.setUpConfiguartion(menu);
    return http.post(path, data, config);
  }
  update(path, data) {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    var menu = localStorage.getItem(menuname);
    let config = this.setUpConfiguartion(menu);
    return http.post(`${path}`, data, config);
  }
  delete(path,id,params) {
    let browserData = localStorage.getItem('USER_INFO');
    let jsonAccess = JSON.parse(browserData);
    let authToken = localStorage.getItem('AUTH_TOKEN');
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    var menu = localStorage.getItem(menuname);
    var jsonParse = JSON.parse(menu);
    let menucode = jsonParse.menucode;
    let commonParam = {
      lang_code: jsonAccess.lang_code,
      logged_user_id: jsonAccess.user_id,
      logged_site_id: jsonAccess.site_id,
      channel_id: menucode,
      auth_token: authToken
    };
    return http.delete(`${path}${id}`, { data: querystring.stringify(commonParam)});
  }

  setUpConfiguartion(menu,paramlang=null){
    let browserData = localStorage.getItem('USER_INFO');
    let jsonAccess = JSON.parse(browserData);
    var config = {};
    var defaultLanguage = (paramlang ? paramlang : jsonAccess.lang_code);
    if (menu != null) {
      var jsonParse = JSON.parse(menu);
      config = { params: { channel_id: jsonParse.menucode, lang_code: defaultLanguage } };
    }else{
      config = { params: { lang_code: defaultLanguage } };
    }
    console.log(config,"CONFIG")
    return config;
  }
}

export default new ApiDataService();