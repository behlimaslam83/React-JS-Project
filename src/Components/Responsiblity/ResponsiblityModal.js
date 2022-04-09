import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import './Responsiblity.scss';
import { Row, Col, Form, Modal, Table, Button} from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';

const moment = require('moment');
const querystring = require('querystring');
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};
const url = 'admin/portal/resp/resphead';
const urll = 'admin/portal/resp/respline';
function ResponsiblityModal(props) {
  const [formData, setFormData] = useState({
    checkBox: 'N',
    headsysid: "",
    formDate: "",
    uptoDate: "",
    editClick: false,
    lineCondition:false,
    headmode:'',
    lineMode:'',
    menuTree:[],
    selectMenu:[],
    creatMenu:[],
    lineDelete:[]
  });
  const Inputwidth = { width: '100%' };
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    const checkMenuCode = [];
    const checkInsert = [];
    const checkUpdate = [];
    const checkDelete = [];
    const checkAmend = [];
    const checkPrint = [];
    const checkExport = [];
    const checkLanguage = [];
    const checkSeo = [];
    const checkActive = [];
    const checkApprove = [];
    const checkApproFValue = [];
    const checkApproUValue = [];
    const checkfromDate = [];
    const checkuptoDate = [];
    const mode = [];
    let respHeadCode = getValues("rsph_code");
    formData.creatMenu.forEach(function(data, indx) {
      checkMenuCode.push(data.menucode[0]);
      mode.push(data.lmode[0]);
      checkInsert.push(data.checkInsert[0]);
      checkUpdate.push(data.checkUpdate[0]);
      checkDelete.push(data.checkDelete[0]);
      checkAmend.push(data.checkAmend[0]);
      checkPrint.push(data.checkPrint[0]);
      checkExport.push(data.checkExport[0]);
      checkLanguage.push(data.checkLanguage[0]);
      checkSeo.push(data.checkSeo[0]);
      checkActive.push(data.checkActive[0]);
      checkApprove.push(data.checkApprove[0]);
      checkApproFValue.push(data.rspl_apr_val_from[0]);
      checkApproUValue.push(data.rspl_apr_val_upto[0]);
      checkfromDate.push(data.rspl_from_date[0]);
      checkuptoDate.push(data.rspl_upto_date[0]);
    });
    let nullDelete = (formData.lineDelete.length === 0 ? [''] : formData.lineDelete);
    let real = {
      ...data,
      'rsph_mode': formData.headmode,
      'rspl_rsph_code': respHeadCode,
      'rspl_menu_code[]': checkMenuCode,
      'rspl_mode[]': mode,
      'rspl_insert_yn[]': checkInsert,
      'rspl_update_yn[]': checkUpdate,
      'rspl_delete_yn[]': checkDelete,
      'rspl_amend_yn[]': checkAmend,
      'rspl_print_yn[]': checkPrint,
      'rspl_export_yn[]': checkExport,
      'rspl_lang_yn[]': checkLanguage,
      'rspl_seo_yn[]': checkSeo,
      'rspl_active_yn[]': checkActive,
      'rspl_approve_yn[]': checkApprove,
      'rspl_apr_val_from[]': checkApproFValue,
      'rspl_apr_val_upto[]': checkApproUValue,
      'rspl_from_date[]': checkfromDate,
      'rspl_upto_date[]': checkuptoDate,
      'delete_menu_code_list[]': nullDelete
    };
    ApiDataService.post(url, querystring.stringify(real)).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          props.errorMessage(response.data.error_message, "DONE");
          props.renderTable();
          props.closeModal();
        }
      }).catch((error) => {
      console.log(error);
      props.errorMessage(error.message, "ERR");
    });
  }

  const validation = {
    rsph_code: { required: "Resp Code is required" },
    page_info_desc: { required: "Info Description is required" }
  };

  useEffect(() => {
    let storeMenu = props.reduxStore.menuData;
    if (storeMenu === '') {
      ApiDataService.getAll('admin/menu/list', '').then(response => {
        storeMenu = response.data.result.parent;
        setFormData((date) => ({
          ...formData,
          menuTree: storeMenu,
        }));
        console.log(storeMenu, "<AJAX API");
      }).catch((error) => {

      });
    }else{
      setFormData((date) => ({
        ...formData,
        menuTree: storeMenu,
      }));
    }
  }, [])
  useEffect(() => {
    if (props.show) {
      let sysid = props.sysid;
      let defaultStart = moment(new Date(), 'DD-MMM-YYYY').toDate();
      let defaultEnd = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
      let dbStart = moment(new Date()).format('DD-MMM-YYYY');
      let dbEnd = moment("31/Dec/2099").format('DD-MMM-YYYY');
      // let storeMenu = props.reduxStore.menuData;
      let modeHead = (props.mode=='IS' ? 'ADD' : 'EDIT');
      // console.log(storeMenu,"<PDDMODDD");
      setFormData((date) => ({
        ...formData,
        headmode: modeHead,
        formDate: defaultStart,
        uptoDate: defaultEnd,
        editClick: false,
        selectMenu: [],
        creatMenu: [],
        lineDelete:[]
      }));
      setValue('rsph_from_date', dbStart);
      setValue('rsph_upto_date', dbEnd);
    // initial setup end
      if (sysid !== '' && sysid !== null) {
        setValue('rspl_rsph_code', sysid);
        ApiDataService.get(`${url}/${sysid}/edit`).then(response => {
          let data = response.data.result[0];
          setValue('rsph_code', data.rsph_code);
          setValue('rsph_desc', data.rsph_desc);
          setValue('rsph_active_yn', data.rsph_active_yn);
          setValue('rsph_from_date', data.rsph_from_date);
          setValue('rsph_upto_date', data.rsph_upto_date);
          var from_date = moment(data.rsph_from_date, 'DD-MMM-YYYY').toDate();
          var upto_date = moment(data.rsph_upto_date, 'DD-MMM-YYYY').toDate();
          const menuArray=[];
          const menuSelect = [];
          let count=0;
          data.lines.forEach(function (data, indx) {
            let lfrom_date = moment(data.rspl_from_date, 'DD-MMM-YYYY').toDate();
            let lupto_date = moment(data.rspl_upto_date, 'DD-MMM-YYYY').toDate();
            menuSelect.push(data.rspl_menu_code);
            if (data.rspl_menu_type!=='M'){
              count++;
              let create = {
                menuname: [data.rspl_menu_desc],
                menucode: [data.rspl_menu_code],
                lmode: ['EDIT'],
                checkInsert: [data.rspl_insert_yn],
                checkUpdate: [data.rspl_update_yn],
                checkDelete: [data.rspl_delete_yn],
                checkAmend: [data.rspl_amend_yn],
                checkPrint: [data.rspl_print_yn],
                checkExport: [data.rspl_export_yn],
                checkLanguage: [data.rspl_lang_yn],
                checkSeo: [data.rspl_seo_yn],
                checkActive: [data.rspl_active_yn],
                checkApprove: [data.rspl_approve_yn],
                rspl_apr_val_from: [data.rspl_apr_val_from],
                rspl_apr_val_upto: [data.rspl_apr_val_upto],
                checkFromDate: [lfrom_date],
                checkUptoDate: [lupto_date],
                rspl_from_date: [data.rspl_from_date],
                rspl_upto_date: [data.rspl_upto_date]
              }
              menuArray.push(create);
            }
          });
          setFormData({
            ...formData,
            // menuTree: storeMenu,
            headmode: modeHead,
            checkBox: data.rsph_active_yn,
            formDate: from_date,
            uptoDate: upto_date,
            headsysid: sysid,
            creatMenu: menuArray,
            selectMenu: menuSelect,
            lineDelete: []
          });
        });
      }
    }
    if (props.sysid && props.mode === 'IS') {
      let id = props.sysid;
      ApiDataService.delete(`${url}/`, id).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          props.errorMessage(response.data.error_message, "DONE");
          props.renderTable();
        }
        props.closeDelete();
      }).catch((error) => {
        props.errorMessage(error.message, "ERR");
        props.closeDelete();
      });
    }
  }, [props.show, props.sysid]);

  const changeDate = (data, mode) => {
    var format = moment(data).format('DD-MMM-YYYY');
    (mode === 'FD' ? setFormData({ ...formData, formDate: data }) : setFormData({ ...formData, uptoDate: data }));
    (mode === 'FD' ? setValue('rsph_from_date', format) : setValue('rsph_upto_date', format));
  }

  const changeDatel = (data,ind, mode) => {
    var format = moment(data).format('DD-MMM-YYYY');
    let treeUpdate = [...formData.creatMenu];
    if (mode === 'LFD'){
      treeUpdate[ind] = { ...treeUpdate[ind], checkFromDate: [data], rspl_from_date: [format] };
      setFormData({
        ...formData, creatMenu: treeUpdate
      });
    }else{
      treeUpdate[ind] = { ...treeUpdate[ind], checkUptoDate: [data], rspl_upto_date: [format] };
      setFormData({
        ...formData, creatMenu: treeUpdate
      });
    }
  }

  const AutoCheck = (event, param) => {
    var checked = event.target.checked;
    if (param == 'AC') {
      if (checked) {
        setFormData({ ...formData, checkBox: "Y" });
      } else {
        setFormData({ ...formData, checkBox: "N" });
      }
    } else {
      if (checked) {
        setFormData({ ...formData, checkBoxM: "Y" });
      } else {
        setFormData({ ...formData, checkBoxM: "N" });
      }
    }
  }

  const AutoCheckl = (event, ind) => {
    let checked = event.target.checked;
    let treeUpdate = [...formData.creatMenu];
    if (checked) {
      treeUpdate[ind] = { ...treeUpdate[ind], [event.target.name]: ["Y"] };
      setFormData({
        ...formData, creatMenu: treeUpdate
      });
    } else {
      treeUpdate[ind] = { ...treeUpdate[ind], [event.target.name]: ["N"] };
      setFormData({
        ...formData, creatMenu: treeUpdate
      });
    }
  }

  const ApproVal = (event,ind)=>{
    let value = event.target.value;
    let treeUpdate = [...formData.creatMenu];
    treeUpdate[ind] = { ...treeUpdate[ind], [event.target.name]: value };
    setFormData({
      ...formData, creatMenu: treeUpdate
    });
  }

  const menutree=(e,param)=>{
    let menucode = e.target.getAttribute('menucode');
    let menudesc = e.target.getAttribute('menudesc');
    let storeArray = formData.selectMenu;
    if (e.target.checked){      
      let menuTree = formData.menuTree;
      var parentCode = '';
      menuTree.forEach((parent, i) => {
        parentCode = parent.menu_code;
        parent.child.forEach(function (child, ci) {          
          if (child.menu_code === menucode && typeof child.sub_child==='undefined') {
            if (!storeArray.includes(child.menu_code)) {
              storeArray.push(child.menu_code);
              console.log(child.sub_child, child.menu_desc,"GOOGLES");
              createLines(child.menu_desc, child.menu_code);
              if (!storeArray.includes(child.menu_parent_code)) {
                storeArray.push(child.menu_parent_code);
              }
            }
          }else{
            if (typeof child.sub_child != 'undefined') {
              child.sub_child.forEach(function (subchild, sci) {
                if (subchild.menu_code === menucode){
                  if (!storeArray.includes(subchild.menu_code)) {
                    if (!storeArray.includes(subchild.menu_parent_code)) {
                      storeArray.push(subchild.menu_parent_code); // child parent
                    }
                    storeArray.push(subchild.menu_code); // child
                    createLines(subchild.menu_desc, subchild.menu_code);
                  }
                  if (!storeArray.includes(parentCode)) {
                    storeArray.push(parentCode); // main parent
                  }
                }
              });
            }
          }
        });
      });
    }else{
      let filteredArray = [];
      let menuArray = [];
      filteredArray = storeArray.filter(item => item !== menucode);
      menuArray = removeIndex(menudesc,menucode);
        let menuTree = formData.menuTree;
        menuTree.forEach((parent, i) => {
          if (parent.menu_code === menucode) {
            parent.child.forEach(function (child, ci) {
              filteredArray = filteredArray.filter(item => item !== child.menu_code)
              menuArray = removeIndex(child.menu_desc, child.menu_code);
              if (typeof child.sub_child != 'undefined') {
                child.sub_child.forEach(function (subchild, sci) {
                  filteredArray = filteredArray.filter(item => item !== subchild.menu_code)
                  menuArray = removeIndex(subchild.menu_desc, subchild.menu_code);
                });
              }
            })  
          }
          parent.child.forEach(function (child, ci) {
            if (child.menu_code === menucode) {
              if (typeof child.sub_child != 'undefined') {
                child.sub_child.forEach(function (subchild, sci) {
                  filteredArray = filteredArray.filter(item => item !== subchild.menu_code)
                  menuArray = removeIndex(subchild.menu_desc, subchild.menu_code);
                });
              }
            }else{
              if (typeof child.sub_child != 'undefined') {
                child.sub_child.forEach(function (subchild, sci) {
                  if (subchild.menu_code === menucode){
                    let removeChildParent=0;
                    let checkSubChild = child.sub_child.length;
                    for (var i = 0; i < checkSubChild;i++){
                      let value = child.sub_child[i].menu_code;
                      if(!filteredArray.includes(value)){
                        removeChildParent++;
                      }
                    }
                    if (checkSubChild === removeChildParent){
                      filteredArray = filteredArray.filter(item => item !== subchild.menu_parent_code)
                    }
                  }
                });
              }
            }
          })
        });
      console.log(menuArray,"testing");
      setFormData({ ...formData, selectMenu: filteredArray, creatMenu: menuArray[0], lineDelete: menuArray[1] });
    }
  }
  const removeIndex=(menu,menucode)=>{
    let lineDelete = formData.lineDelete;
    let menuData = formData.creatMenu;
    menuData.forEach((data,ind) => {
      if(data.menuname[0] === menu){
        menuData.splice(ind, 1);
        if (data.lmode[0] === 'EDIT') {
          if (!lineDelete.includes(menucode)) {
            lineDelete.push(menucode);
          }
        }
      }
      
    });
    return Array(menuData, lineDelete);
  }

  const createLines = async (menudesc, menucode) => {
    let defaultStart = moment(new Date(), 'DD-MMM-YYYY').toDate();
    let defaultEnd = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
    let dbStart = moment(new Date()).format('DD-MMM-YYYY');
    let dbEnd = moment("31/Dec/2099").format('DD-MMM-YYYY');
    let formArray = {
      menuname: [menudesc],
      menucode: [menucode],
      lmode:['ADD'],
      checkInsert: ['N'],
      checkUpdate: ['N'],
      checkDelete: ['N'],
      checkAmend: ['N'],
      checkPrint: ['N'],
      checkExport: ['N'],
      checkLanguage: ['N'],
      checkSeo: ['N'],
      checkActive: ['N'],
      checkApprove: ['N'],
      rspl_apr_val_from:['0'],
      rspl_apr_val_upto: ['0'],
      checkFromDate: [defaultStart],
      checkUptoDate: [defaultEnd],
      rspl_from_date: [dbStart],
      rspl_upto_date: [dbEnd]
    };  
    setFormData({ ...formData, creatMenu: [...formData.creatMenu, formArray] });
    console.log(formData,"TING TINGS");
  }
  const dummy = () => {}
  return (
    <div>
      <Modal animation={false} className="full-width" show={props.show} onHide={props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Menu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <Form noValidate className="rightForm" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Responsibility Code</Form.Label>
                  <Form.Control ref={register(validation.rsph_code)} type="text" size="sm" name="rsph_code" placeholder="Resp Code" />
                  <small className="text-danger">
                    {errors.rsph_code && errors.rsph_code.message}
                  </small>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Responsibility Description</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="rsph_desc" placeholder="Resp Description" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Controller
                    control={control}
                    name="rsph_from_date"
                    render={(onChange) => (
                      <DatePicker className="form-control form-control-sm" selected={formData.formDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'FD')} />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Upto Date</Form.Label>
                  <Controller
                    control={control}
                    name="rsph_upto_date"
                    render={(onChange) => (
                      <DatePicker className="form-control form-control-sm" selected={formData.uptoDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'UP')} />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={(formData.checkBox == 'Y' ? true : false)} onChange={(e) => AutoCheck(e, 'AC')} type="checkbox" />
                  <label>Active ?</label>
                  <input type="hidden" name="rsph_active_yn" ref={register} value={formData.checkBox} />
                </div>   
                <div className="d-grid gap-2">
                  <button type="submit" variant="primary" size="sm" className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="2">
              <div className="treeForm">
                <ul className="parentul">
                    {formData.menuTree.length!==0 ?
                    formData.menuTree.map(function (parent, ind) {
                      return (
                        <li key={ind}><span>
                          <Form.Check type="checkbox" menucode={parent.menu_code} menudesc={parent.menu_desc} checked={
                            (formData.selectMenu.indexOf(parent.menu_code) !== -1 ? true : false)
                          } onChange={(e) => menutree(e, 'P')} name="checkActive" />{parent.menu_desc}</span>
                          <ul className="childul">
                            {parent.child.map(function (child, inx) {
                              return (
                                <li key={inx}><span><Form.Check menucode={child.menu_code} menudesc={child.menu_desc} checked={
                                  (formData.selectMenu.indexOf(child.menu_code) !== -1 ? true : false)
                                } type="checkbox" onChange={(e) => menutree(e, 'C')} name="checkActive" />{child.menu_desc}</span>
                                  {typeof child.sub_child != 'undefined' ?
                                    <ul className="subul">
                                      {child.sub_child.map(function (sub_child, inde) {
                                        return (
                                          <li key={inde}><span><Form.Check menucode={sub_child.menu_code} menudesc={sub_child.menu_desc} checked={
                                            (formData.selectMenu.indexOf(sub_child.menu_code) !== -1 ? true : false)
                                          } type="checkbox" onChange={(e) => menutree(e, 'SC')} name="checkActive" />{sub_child.menu_desc}
                                          </span>
                                          </li>
                                        )
                                      })}
                                    </ul> : ''}
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    })
                  :''}
                </ul>
              </div>
              </Col>
              <Col>
                <div className="scrollTable">
                  <Table striped bordered hover className="table-responsive">
                  <thead>
                      <tr className="custom-header-style">
                      <th>Menu Name</th>
                      <th>Insert</th>
                      <th>Update</th>
                      <th>Delete</th>
                      <th>Amend</th>
                      <th>Print</th>
                      <th>Export</th>
                      <th >Language</th>
                      <th >Seo</th>
                      <th>Active</th>
                      <th>Approve</th>
                      <th>App. Val From</th>
                      <th>App. Val Upto</th>
                      <th>From Date</th>
                      <th>Upto Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.creatMenu.length !==0 ?
                      formData.creatMenu.map(function (format, ind) {
                    return(
                    <tr key={ind}>
                        <td><Form.Control value={format.menuname[0]} onChange={dummy} readOnly type="text" size="sm" name="rspl_rsph_code" placeholder="Menu Name" /></td>
                        <td><Form.Check type="switch" className="switchzindx" checked={(format.checkInsert[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkInsert" id={`checkInsert_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkUpdate[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkUpdate" id={`rspl_update_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkDelete[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkDelete" id={`rspl_delete_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkAmend[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkAmend" id={`rspl_amend_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkPrint[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkPrint" id={`rspl_print_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkExport[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkExport" id={`rspl_export_yn` + ind}  /></td>
                        
                        <td ><Form.Check type="switch" className="switchzindx" checked={(format.checkLanguage[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkLanguage" id={`rspl_lang_yn` + ind} /></td>
                        <td ><Form.Check type="switch" className="switchzindx" checked={(format.checkSeo[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkSeo" id={`rspl_seo_yn` + ind} /></td>

                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkActive[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkActive" id={`rspl_active_yn` + ind}  /></td>
                        <td><Form.Check type="switch" className="switchzindx"  checked={(format.checkApprove[0] === 'Y' ? true : false)} onChange={(e) => AutoCheckl(e, ind)} name="checkApprove" id={`rspl_approve_yn` + ind}  /></td>
                        <td><Form.Control ref={register} type="number" onChange={(e) => ApproVal(e, ind)} defaultValue={(format.rspl_apr_val_from[0] === '' ? 0 : format.rspl_apr_val_from[0])} size="sm" name="rspl_apr_val_from" placeholder="From Value" /></td>
                        <td><Form.Control ref={register} type="number" onChange={(e) => ApproVal(e, ind)} defaultValue={(format.rspl_apr_val_upto[0] === '' ? 0 : format.rspl_apr_val_upto[0])} size="sm" name="rspl_apr_val_upto" placeholder="Upto Value" /></td>
                        <td><DatePicker className="form-control form-control-sm datesize" name="rspl_from_date" selected={format.checkFromDate[0]} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDatel(date,ind, 'LFD')} /></td>
                        <td><DatePicker className="form-control form-control-sm datesize" name="rspl_upto_date" selected={format.checkUptoDate[0]} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDatel(date,ind,'LUP')} /></td>
                    </tr>
                    )
                    }) : <tr><td className="text-center" colSpan="15">No Data Found</td></tr>
                }
                  </tbody>
                </Table>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    reduxStore: state.Reducers
  };
}
export default connect(mapStateToProps, null)(ResponsiblityModal);