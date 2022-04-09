import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import './SidePanel.scss';
import {  Image } from 'react-bootstrap';
import face from '../../Assets/images/face.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronDown, faChess } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { headerNav } from "../Redux-Config/Action/Action";
import { Scrollbars } from 'react-custom-scrollbars';
import ApiDataService from '../../services/ApiDataService';
import { Link } from "react-router-dom";

  function SidePanel(props){
    const dispatch = useDispatch();
    const [mouseOver, setmouseOver] = useState(false);
    const [menuParent, setMenuParent] = useState({
      activeParent:null,
      activeClick:true,
      activeChild: null,
      activeSub: null,
      activeSubchild:null,
      flipChild: false
    });
    const [menuData, setMenuData] = useState([]);
    const _isMounted = useRef(true);
    const getMenuCodes = useCallback((menuData) => {
      var stop = false;
      var menuUrl = window.location.pathname;
      var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
      var jsonParse = localStorage.getItem(menuname);
      var selectMenu = JSON.parse(jsonParse);
      console.log(selectMenu,"HAKK IN");
      menuData.forEach((parent, i) => {
        if (stop) {
          return false;
        }
        parent.child.forEach(function (child, ci) {
          if (stop) {
            return false;
          }
          if (selectMenu.menucode === child.menu_code) {
            stop = true;
            // if (param ==='SECURITY'){
              userSecurityAccess(child.menu_def_api);
            // }else{
              setMenuParent((menuParent) => ({
                activeParent: parent.menu_code,
                activeChild: child.menu_code,
              }));
            // }
            return true;
          }
          if (typeof child.sub_child != 'undefined') {
            child.sub_child.forEach(function (subchild, sci) {
              if (selectMenu.menucode === subchild.menu_code) {
                stop = true;
                // if (param === 'SECURITY') {
                  userSecurityAccess(subchild.menu_def_api);
                // } else {
                  setMenuParent((menuParent) => ({
                    activeParent: parent.menu_code,
                    activeChild: null,
                    activeSub: child.menu_code,
                    activeSubchild: subchild.menu_code
                  }));
                // }
                return true;
              }
            });
          }
        });
      });
    }, []);

  useEffect(() => {
    refreshMenuData('');
  }, [dispatch, getMenuCodes]);

  useEffect(() => { }, [menuParent]);
  // useEffect(() => { refreshMenuData('SECURITY');  }, []);

  const refreshMenuData=(param)=>{
    ApiDataService.getAll('admin/menu/list', '').then(response => {
      console.log(response.data.result,"MARIGES");
      if (_isMounted.current) {
        // if (param ==='SECURITY'){
          // alert("ME");
          // getMenuCodes(response.data.result.parent, param);
        // }else{
          // alert("YOU");
          // console.log(response.data.result, "HAKKIM CHEKCING");
          setMenuData(response.data.result.parent);
          getMenuCodes(response.data.result.parent);
          dispatch({ type: 'MENUDATA', payload: response.data.result.parent });
        // }
      } else {
        _isMounted.current = false;
      }
    }).catch((error) => {
      _isMounted.current = false;
    });
    return () => { _isMounted.current = false; }
  }
  const sideMenuParent= (e,key) =>{
    var parentKey=key;
    if (!menuParent.activeClick && e.currentTarget.classList.contains('activeClass')) {
      parentKey=null;
    }
    setMenuParent({ ...menuParent, activeParent: parentKey, activeClick: !menuParent.activeClick});   
  }

  const handleClick = (e, key,param) => {
    e.stopPropagation();
    let menuCode = e.currentTarget.getAttribute('link-menucode');
    let menudesc = e.currentTarget.getAttribute('menudesc');
    let menudefapi = e.currentTarget.getAttribute('menudefapi');
    var menuName = e.currentTarget.getAttribute('menuname');
    menuName = menuName.replace(/\//g, '').toUpperCase()+'_CHID';
    props.setMenucode(menuCode);
    let jsonArray = { "menuname": menudesc, "menucode": menuCode};
    localStorage.setItem(menuName, JSON.stringify(jsonArray));
      var keyChild = key;
      var keySubChild = key;
      var flipBoolen = false;
      if (e.currentTarget.childElementCount > 1){
        keyChild = null;
        if (menuParent.flipChild && e.currentTarget.childNodes[1].childNodes[0].classList.contains('subChildShow')){
          keySubChild=null;
          flipBoolen =false;
        }else{
          flipBoolen = true;
        }
      }else{
        flipBoolen = false;
      }
    if (param !== 'SUB-CH') {
      setMenuParent({ ...menuParent, activeSub: keySubChild, flipChild: flipBoolen, activeChild: keyChild, activeSubchild: keySubChild });
    }else{
      setMenuParent({ ...menuParent, flipChild: flipBoolen, activeSubchild: keySubChild });
    }
    userSecurityAccess(menudefapi);
  }
  const userSecurityAccess = async (menuname) => {
    await ApiDataService.getAll(`admin/portal/${menuname}/menu_access`, '').then(response => {
      let rawdata = response.data.result[0];
      let accessSecuity = JSON.stringify(rawdata);
      sessionStorage.setItem("ACCESS_SECURITY", accessSecuity);
      dispatch({ type: 'ACCESS_SECURITY', payload: "SECURITY" });
    }).catch((error) => {
      console.log(error,"esttet");
    });
  }
  const onMouseEnterHandler = () =>{
    if (props.headerClick){
      props.changePanel(true);
      setmouseOver(true);
    }
  }
  const onMouseLeaveHandler = () => {
    if (props.headerClick) {
      setmouseOver(false);
      props.changePanel(false);
    }
  } 
  return (
    <div onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} className={(props.headerClick && !mouseOver) ? 'sidePanelWind panelMiniz' : 'sidePanelWind'}>
      <Scrollbars autoHide style={{ height: 100 + '%' }}>
        <div className="sidePanelMenu">
            <ul className="list-group list-unstyled">
              <li className="sidePanel-backimg">
                <div className="imageCircle"><Image src={face} rounded /></div>
                <div className={"imageName " + ((props.headerClick && !mouseOver) ? 'minimicon' : '')}><h6>{props.user_info.user_desc}</h6>
                </div>
              </li>
              {menuData==='' ? 'Loading...' : 
                menuData.map(function(parentmenu,inx){
                if (parentmenu.menu_desc === 'NODATA') {
                  <li>No Record Found</li>; return true;
                }
                return(
                  <li className={`sidePanel-pd ` + ((menuParent.activeParent === parentmenu.menu_code) ? ' activeClass' : 'sidePanel-pd')} onClick={(e) => sideMenuParent(e, parentmenu.menu_code)} key={inx}>
                    <div className="parentA">
                      <FontAwesomeIcon className="sideiconSet" icon={faChess} />{' '}
                      <span className="ChildText">{parentmenu.menu_desc}</span>
                      <span className="arrowMenu">
                        <FontAwesomeIcon icon={menuParent.activeParent === parentmenu.menu_code ? faChevronDown :faChevronLeft}/>
                      </span>
                    </div>
                    <div className="minimicon">
                      <ul className={"list-unstyled childMenu " + ((menuParent.activeParent === parentmenu.menu_code) ? 'childShow' : '')}>
						            {menuData[inx].child.map((childMenu, cinx) =>{
                          var subChildExist = menuData[inx].child[cinx].sub_child;
                          return (<li onClick={(e) => handleClick(e, childMenu.menu_code)} menudesc={childMenu.menu_desc} menuname={childMenu.menu_definition} menudefapi={childMenu.menu_def_api} link-menucode={childMenu.menu_code} className={"childList " + ((menuParent.activeChild === childMenu.menu_code)? 'activeChild ' : '') + (typeof subChildExist != 'undefined' ? 'nohover' : '')} key={cinx}>
                            <Link onContextMenu={(e) => handleClick(e, childMenu.menu_code)} menudesc={childMenu.menu_desc} menuname={childMenu.menu_desc} menudefapi={childMenu.menu_def_api} link-menucode={childMenu.menu_code} className="childLink" to={typeof subChildExist !== 'undefined' ? '#' : { pathname:childMenu.menu_definition, params:childMenu.menu_code}}>
                            <span className="SubchildText">{childMenu.menu_desc}</span>
                              {typeof subChildExist !== 'undefined' ?
                              <span className="arrowMenu">
                                  <FontAwesomeIcon icon={menuParent.activeSub === childMenu.menu_code ? faChevronDown : faChevronLeft} />
                              </span> : '' }
                            </Link>
                            {typeof subChildExist != 'undefined' ?
                            <div>
                                <div className="">
                                  <ul className={"list-unstyled subchildMenu " + ((menuParent.activeSub === childMenu.menu_code) ? 'subChildShow' : '')}>
                                    { subChildExist.map((subchildMenu, sinx) => (
                                      <li onClick={(e) => handleClick(e, subchildMenu.menu_code, 'SUB-CH')} menudesc={subchildMenu.menu_desc} menudefapi={subchildMenu.menu_def_api} menuname={subchildMenu.menu_definition} link-menucode={subchildMenu.menu_code} className={"childList " + ((menuParent.activeSubchild === subchildMenu.menu_code) ? 'activeSubchild' : '')} key={sinx}>
                                        <Link onContextMenu={(e) => handleClick(e, subchildMenu.menu_code, 'SUB-CH')} menudesc={subchildMenu.menu_desc} menudefapi={subchildMenu.menu_def_api} menuname={subchildMenu.menu_desc} link-menucode={subchildMenu.menu_code} className="linkcss" to={{ pathname: subchildMenu.menu_definition, params: subchildMenu.menu_code}}>{subchildMenu.menu_desc}</Link>
                                      </li>
                                  )) }
                                </ul>
                              </div>
                              </div>
                              : ''}
                          </li>)
                        } )}
                      </ul>
                    </div>
                  </li>
                )})
              }
            </ul>
          </div>
      </Scrollbars>
    </div>
  );
}

const menuFilter = (state)=>{
  return state.serverApiReducer
}
// const menuData = (state) => {
//   let serverApi = state.serverApiReducer;
//   if (serverApi.apiData!=''){
//       return serverApi.apiData.result.parent;
//   }else{
//     var object = [{'menu_desc':'NODATA'}];
//     return object;
//   }
// }

const mapStateToProps = (state, ownProps) => {
  return {
    headerClick: state.Reducers.swipPanel.head,
    menus: menuFilter(state),
    user_info: JSON.parse(state.Reducers.user_info),
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changePanel: (boolen) => {
      let object = { head: true, sidepan: boolen }
      dispatch(headerNav(object));
    },
    setMenucode: (params) => {
      dispatch({ type: 'MENUCODE', payload: params});
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);