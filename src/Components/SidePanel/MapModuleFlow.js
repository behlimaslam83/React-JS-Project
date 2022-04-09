import React, { useEffect, useState  } from 'react';
import './SidePanel.scss';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
const MapModuleFlow = (props) =>{
  const [menuData, setMenuData] = useState({
    menuParent: null,
    menuChild: true,
    menuSub: null,
  });
  useEffect(() => {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    let menu = localStorage.getItem(menuname);
    if (menu==null){ return false; }
    let jsonParse = JSON.parse(menu);
    console.log(jsonParse,"jsonParse");
    let menuList = props.menudata;
    var menuParent='';
    var menuChild = '';
    var menuSub = '';
    var stop = false;
    if (menuList!==''){
      for (var i = 0; i < menuList.length;i++){
        if (stop){
          break;
        }
        menuParent = menuList[i].menu_desc;
        let childTree = menuList[i].child;
        for (var j = 0; j < childTree.length; j++) {
          if (stop) {
            break;
          }
          if (jsonParse.menucode === childTree[j].menu_code) {
            menuChild = childTree[j].menu_desc;
            stop = true;
            break;
          }else{
            menuChild = childTree[j].menu_desc;
          }
          let subChildTree = childTree[j].sub_child;
          if (typeof subChildTree != 'undefined') {
            for (var k = 0; k < subChildTree.length; k++) {
              console.log(jsonParse.menucode, subChildTree[k].menu_code, "subChildTree[k].menu_code...");
              if (jsonParse.menucode === subChildTree[k].menu_code) {
                menuSub = subChildTree[k].menu_desc;
                stop = true;
                break;
              }
            }
          }
        }
      }
    }
    console.log(menuParent, menuChild, menuSub, "menuSub...");
    setMenuData(() => ({
      menuParent: menuParent,
      menuChild: menuChild,
      menuSub: menuSub
    }));
    // setMenuData({
    //   ...menuData,
    //   menuParent: menuParent,
    //   menuChild: menuChild,
    //   menuSub: menuSub
    // });
  }, [props.menudata, props.menucode]);
  
    return (
      <div className={props.headSwap ? "moduleFlowMin" : "moduleFlow"}>
        <div className="PanelHeader">
          <h6 className="rm-Mrg">Navigate</h6>
          <div className="mapPageTree">
            <ul className="list-inline list-unstyled rm-Mrg">
              <li className="list-inline-item">{menuData.menuParent}</li>
              <li className="list-inline-item"><FontAwesomeIcon icon={faCaretRight} /> {menuData.menuChild}</li>
              { menuData.menuSub && <li className="list-inline-item"><FontAwesomeIcon icon={faCaretRight} /> {menuData.menuSub}</li> }
            </ul>
          </div>
        </div>
      </div>
    );
}

const mapStateToProps = state => {
  return {
    headSwap: state.Reducers.swipPanel.head,
    menudata: state.Reducers.menuData,
    menucode: state.Reducers.menucode

  }
}
export default connect(mapStateToProps, null)(MapModuleFlow);