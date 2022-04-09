import React, { useState, useEffect, useRef } from 'react';
import './Login.scss';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import axios from "axios";
// import ApiDataService from '../../services/ApiDataService';
import { connect } from "react-redux";
import LaddaButton from 'react-ladda';
import { LOGIN_USER_INFO, LOGIN_AUTH_TOKEN } from '../Redux-Config/Action/ActionType';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Login(props) {
  //alert(SERVER_URL)
  const qs = require('qs');
  const { register, handleSubmit, setError, errors } = useForm();
  const [apiError, setApiError] = useState();
  const [loading_btn, setLoading_btn] = useState(false);
  const [loginMode, setLoginMode] = useState({
    btncaption:'Forgot Password',
    titlecaption:'Log In',
    steps:'L'
  });
  const [siteLovList, setsiteLovList] = useState(<option value="100001">Sedarglobal</option>);
  const _isMounted = useRef(true);
  // errors('sadhasd');
  const onSubmit = (post_data) => {
    console.log(post_data);
    setLoading_btn(true);
    if (loginMode.steps == 'L') {
      axios.post(`${SERVER_URL}admin/login`, qs.stringify(post_data)).then(response => {
        setLoading_btn(false);
        let res_data = response.data;
        if (res_data.error_message === 'Success' && res_data.return_status === "0") {
          console.log(res_data);
          let user_info = res_data.result.user_site_detail[0];
          localStorage.setItem('USER_INFO', JSON.stringify(user_info));
          localStorage.setItem('AUTH_TOKEN', res_data.result.auth_token);
          localStorage.setItem('USER_ID', user_info.user_id);
          localStorage.setItem('USER_EMAIL', user_info.user_email);
          props.loginInfo(LOGIN_USER_INFO, user_info);
          props.loginInfo(LOGIN_AUTH_TOKEN, res_data.result.auth_token);
          sessionStorage.setItem('AUTH_TOKEN1', res_data.result.auth_token);
          sessionStorage.setItem('USER_ID1', user_info.user_id);
          sessionStorage.setItem('SITE_ID1', user_info.site_id);
          sessionStorage.setItem('LANG_CODE1', user_info.lang_code);
        } else if (res_data.return_status === -212) {
          console.log(res_data);
          setApiError(res_data.error_message);
        }
        else {
          console.log(res_data);
          if (res_data.result.user_id) {
            setError('user_id', res_data.result.user_id);
          }
          if (res_data.result.pass_word) {
            setError('pass_word', res_data.result.pass_word);
          }
          if (res_data.result.site_id) {
            setError('site_id', res_data.result.site_id);
          }
          setApiError(res_data.error_message);
        }

      }).catch(e => {
        setLoading_btn(false);
        //console.log(e);
        setApiError(e.message);
      });
    }else if (loginMode.steps == 'P') {
      setLoginMode({ titlecaption: 'Enter Code', steps: 'C' });
    }else if (loginMode.steps == 'C') {
      setLoginMode({ titlecaption: 'Reset Password', steps: 'R' });
    }else if (loginMode.steps == 'R') {

    }
    console.log(loginMode.steps,"SDFSDF");
  }

  useEffect(() => {
    setLoginMode({ steps: 'L', btncaption: 'Forgot Password', titlecaption:'Log In',steps:'L'});
    setLoading_btn(true);
    axios.get(`${SERVER_URL}admin/fetch/sitelov?lang=en`).then(response => {
      if (_isMounted.current) {
      setLoading_btn(false);

      let site_lov = response.data.result.map((data, i) =>
        <option value={data.site_id} key={i}>{data.site_desc}</option>
      );

      setsiteLovList(site_lov);
      }
    }).catch(e => {
      if (_isMounted.current) {
      setLoading_btn(false);
      //console.log(e);
      setApiError(e.message);
      }
      _isMounted.current = false;
    });
    return () => { _isMounted.current = false; }
  }, []);

  const forgotPassword=()=>{
    setLoading_btn(false);
    if (loginMode.steps=='L'){
      setLoginMode({ btncaption: 'Back to login', titlecaption: 'Forgot Password', steps:'P' });
    }else{
      setLoginMode({ btncaption: 'Forgot Password', titlecaption: 'Log In', steps: 'L' });
    }
  }
  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <h2 className="h2">{loginMode.titlecaption}</h2>
        <span className="text-danger">{apiError}</span>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {loginMode.steps==='L' && <div>
            <div className="form-group">
              <input type="text" className="inputText" name="user_id" placeholder="User ID" ref={register({ required: true })} />
              <span className="text-danger "> {errors.user_id && "Email/User Id is required"}</span>
            </div>
            <div className="form-group">
              <input type="password" className="inputText" name="pass_word" placeholder="Password" ref={register({ required: true })} />
              <span className="text-danger">  {errors.pass_word && "Password is required"}</span>
            </div>

            <div className="form-group">
              <select className="inputText" name="site_id" ref={register({ required: true })}>
                {siteLovList}
              </select>
              <span className="text-danger">  {errors.site_id && "Site Id is required"}</span>
            </div>
            <div className="form-group" style={{ clear: "both" }}>
              <LaddaButton loading={loading_btn} className="fadeIn submit_btn" type="submit">
                Log In
              </LaddaButton>
            </div>
          </div>
          }
          {loginMode.steps === 'P' && <div>
            <div className="form-group">
              <input type="text" className="inputText" name="emailid" placeholder="Enter Register Email Id" ref={register({ required: true })} />
              <span className="text-danger "> {errors.user_id && "Email/User Id is required"}</span>
            </div>
            <div className="form-group" style={{ clear: "both" }}>
              <LaddaButton loading={loading_btn} className="fadeIn submit_btn" type="submit">
                Send
              </LaddaButton>
            </div>
            </div>
          }
          {loginMode.steps === 'C' && <div>
            <div className="form-group">
              <input type="text" className="inputText" name="entercode" placeholder="Enter Code" ref={register({ required: true })} />
              <span className="text-danger "> {errors.user_id && "Email/User Id is required"}</span>
            </div>
            <div className="form-group" style={{ clear: "both" }}>
              <LaddaButton loading={loading_btn} className="fadeIn submit_btn" type="submit">
                Confirm
              </LaddaButton>
            </div>
          </div>
          }
          {loginMode.steps === 'R' && <div>
            <div className="form-group">
              <input type="password" className="inputText" name="newpassword" placeholder="New Password" ref={register({ required: true })} />
              <span className="text-danger "> {errors.user_id && "Email/User Id is required"}</span>
            </div>
            <div className="form-group">
              <input type="password" className="inputText" name="oldpassword" placeholder="Confirm Password" ref={register({ required: true })} />
              <span className="text-danger "> {errors.user_id && "Email/User Id is required"}</span>
            </div>
            <div className="form-group" style={{ clear: "both" }}>
              <LaddaButton loading={loading_btn} className="fadeIn submit_btn" type="submit">
                Save
              </LaddaButton>
            </div>
          </div>
          }
        </Form>
        {(loginMode.steps === 'L' || loginMode.steps === 'P') &&
          <div id="formFooter">
            <a className="underlineHover" onClick={forgotPassword} href="javascript:;">{loginMode.btncaption}</a>
          </div>
        }
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginInfo: (action_type, data_info) => { dispatch({ type: action_type, payload: data_info }) }
  }
}

export default connect(null, mapDispatchToProps)(Login);