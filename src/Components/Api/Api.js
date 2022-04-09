import React, { Component } from 'react';
import axios from 'axios';
import { fetchRequest, fetchResponse, errorHandler } from "../Redux-Config/Action/Action";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BASEURL = SERVER_URL+'admin/';
const FETCH_MENU_API = BASEURL +'menu/list?logged_user_id=admin@spineweb&auth_token=$2y$10$otxo5yor7GetqtYFl/7HaOi.Vuuf9im/hn7Pfr1bq17Fi6E7JM8HK&logged_site_id=100001&lang_code=en';

class ApiStructure{
  fetchMenus = () =>{
    return function(dispatch) {
      dispatch(fetchRequest())
      axios.get(FETCH_MENU_API).then(response=>{
        const json = response.data;
        dispatch(fetchResponse(json))
      }).catch(error=>{
        dispatch(errorHandler(error.message))
      })
    } 
  }
  insertForm = (data) =>{
    return function(dispatch) {
      dispatch(fetchRequest())
      axios.get(FETCH_MENU_API,data).then(response=>{
        const json = response.data;
        dispatch(fetchResponse(json))
      }).catch(error=>{
        dispatch(errorHandler(error.message))
      })
    } 
  }
}
export default new ApiStructure();
