import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
function AccessSecurity(props) {
  const [accessSecuity, setAccessSecurity] = useState({
    MENU_NAME:"",
    INSERT_YN: "",
    UPDATE_YN: "",
    DELETE_YN: "",
    PRINT_YN: "",
    APPROVE_YN: "",
    AMEND_YN: "",
    EXPORT_YN: "",
    LANGUAGE_YN: "",
    SEO_YN: "",
    APPROVE_VALUE_FROM: "",
    APPROVE_VALUE_UPTO: "",
    USER_ROLE: ""
  });
 
  useEffect(() => {
    let ACCESS_JSON_STRING = sessionStorage.getItem("ACCESS_SECURITY");
    console.log(ACCESS_JSON_STRING,"GOGL SDFSD");
    if (ACCESS_JSON_STRING!==null){
      let ACCESS_SECURITY = JSON.parse(ACCESS_JSON_STRING);
      //setuserinfo({...user_info, MENUUU_NAME : 'dsdsddd'});
      setAccessSecurity({
        ...accessSecuity,
        MENU_NAME: ACCESS_SECURITY.menu_desc,
        INSERT_YN: ACCESS_SECURITY.insert_yn,
        UPDATE_YN: ACCESS_SECURITY.update_yn,
        DELETE_YN: ACCESS_SECURITY.delete_yn,
        PRINT_YN: ACCESS_SECURITY.print_yn,
        APPROVE_YN: ACCESS_SECURITY.approve_yn,
        AMEND_YN: ACCESS_SECURITY.amend_yn,
        EXPORT_YN: ACCESS_SECURITY.export_yn,
        LANGUAGE_YN: ACCESS_SECURITY.lang_yn,
        SEO_YN: ACCESS_SECURITY.seo_yn,
        APPROVE_VALUE_FROM: ACCESS_SECURITY.approve_val_from,
        APPROVE_VALUE_UPTO: ACCESS_SECURITY.approve_val_upto,
        USER_ROLE: props.user_info.user_role
      });
    }
  }, [props.access_security]);
  useEffect(() => {
    props.accessecurity(accessSecuity);
  }, [accessSecuity]);
  return (<></>);
}

const mapStateToProps = (state, ownProps) => {
  return {
    access_security: state.Reducers.access_security,
    user_info: JSON.parse(state.Reducers.user_info),
  }
}

export default connect(mapStateToProps, null)(AccessSecurity);