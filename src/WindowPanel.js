import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
export function WindowPanel(props) {
  const [menuDesc, setMenuDesc] = useState('');
  useEffect(() => {
    var menuUrl = window.location.pathname;
    var menuname = menuUrl.replace(/\//g, '').toUpperCase() + '_CHID';
    let menu = localStorage.getItem(menuname);
    if (menu != null) {
      let jsonParse = JSON.parse(menu);
      setMenuDesc(jsonParse.menuname);
    }
  }, []);
  return (
    <div className="windowPanel">
      <div className="windowHead inline-css">
        <h6 className="rm-Mrg">{menuDesc}</h6>
        <ul className="list-inline list-unstyled rm-Mrg">
          <li className="list-inline-item"><FontAwesomeIcon icon={faTimes} /></li>
        </ul>
      </div>
      {props.rawHtml}
    </div>);
}
