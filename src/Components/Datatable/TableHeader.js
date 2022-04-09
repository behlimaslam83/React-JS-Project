import React from 'react';
import includes from 'lodash/includes';
import style from './style';
import { Form,Col, InputGroup,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
export default function TableHeader(props){
    if(props.config.show_length_menu === true 
        || props.config.show_filter === true
        || props.config.button.excel === true
        || props.config.button.csv === true
        || props.config.button.print === true){
      return (
        <div className="row table-head asrt-table-head" id={(props.id) ? props.id + "-table-head" : ""}>
          <div className="col-md-1 pr-0">
            {(props.config.show_length_menu) ? (
              <div className="input-group asrt-page-length">
                {(includes(props.config.language.length_menu, '_MENU_')) ? (
                      <Form.Control size="sm" as="select" onChange={props.changePageSize}>
                      {props.config.length_menu.map((value, key) => {
                        return (<option key={key} value={value}>{value}</option>)
                      })}
                      <option value={props.recordLength}>All</option>
                  </Form.Control>
                ) : null}
                
              </div>
            ) : null}
          </div>
          <div className="col-md-2 pl-1">
            <div className="input-group-addon input-group-prepend">
              <span className="input-group-text" style={style.table_size}>
                {(props.lengthMenuText[1]) ? props.lengthMenuText[1] : ''}
              </span>
            </div>
          </div>
          <div className="col-md-9 float-right text-right">
            <Col sm="4" style={style.flexClass}>
              {props.dropdown}
            </Col>
            <Col sm="3" style={style.flexClass}>
              {props.dropdownslug}
            </Col>
            {(props.config.show_filter) ? (
              <div className="table_filter" style={style.table_filter}>
                <InputGroup className="mb-3">
                  <select size="sm" onClick={props.filterType} style={style.custdropdown} className="browser-default custom-select">
                    <option defaultValue value="hp_desc">Description</option>
                    <option value="hp_parent_desc">Parent</option>
                    <option value="hp_slug_url">Slug Url</option>
                    <option value="hp_ordering">Ordering</option>
                    <option value="hp_from_date">From Date</option>
                    <option value="hp_upto_date">Upto Date</option>
                    <option value="hp_active_yn">Active</option>
                  </select>
                  <Form.Control size="sm" type="text" placeholder="Search"  id="standard-full-width" label={props.config.language.filter} onChange={props.filterRecords} />
                  <Button size="sm" onClick={props.filterClick} variant="primary"><FontAwesomeIcon icon={faFilter} /></Button>
                </InputGroup>
              </div>
            ) : null}
            <div className="table_tools" style={style.table_tool}>
              {(props.config.button.excel) ? (
                <button className="btn btn-primary buttons-excel"
                  tabIndex="0"
                  aria-controls="configuration_tbl"
                  title="Export to Excel"
                  style={style.table_tool_btn}
                  onClick={props.exportToExcel}>
                  <span>
                    <i className="fa fa-file-excel-o" aria-hidden="true"></i>
                  </span>
                </button>
              ) : null}
              {(props.config.button.csv) ? (
                <button className="btn btn-primary buttons-csv"
                  tabIndex="0"
                  aria-controls="configuration_tbl"
                  title="Export to CSV"
                  style={style.table_tool_btn}
                  onClick={props.exportToCSV}>
                  <span>
                    <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  </span>
                </button>
              ) : null}
              {(props.config.button.print) ? (
                <button className="btn btn-primary buttons-pdf"
                  tabIndex="0"
                  aria-controls="configuration_tbl"
                  title="Export to PDF"
                  style={style.table_tool_btn}
                  onClick={props.exportToPDF}>
                  <span>
                    <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
                  </span>
                </button>
              ) : null}
              {(props.config.button.extra===true) ? (
                props.extraButtons.map((elem,index)=>{
                    elem.clickCount=0;
                    elem.singleClickTimer='';
                    return (
                        <button className={elem.className ? elem.className : "btn btn-primary buttons-pdf"}
                          tabIndex="0"
                          aria-controls="configuration_tbl"
                          title={elem.title?elem.title:"Export to PDF"}
                          style={style.table_tool_btn}
                          onClick={(event)=>{
                            elem.onClick(event);
                          }}
                          key={index}>
                            {elem.children}
                        </button>
                    )
                })
              ) : null}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
}