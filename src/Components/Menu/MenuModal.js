import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import './Menu.scss';
import { Row, Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

const moment = require('moment');
const querystring = require('querystring');
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};

const url = 'admin/portal/menu';
function MenuModal(props) {
  const [formData, setFormData] = useState({
    checkBox:'N',
    checkBoxM:'N',
    headsysid: "",
    formDate: "",
    uptoDate: "",
    modulelov: [],
    parentlov:[],
    menutypelov: [],
    moduleselect: '',
    parentselect: '',
    typeselect: '',
    editClick:false
  });
  const Inputwidth = { width: '100%' }; 
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    if (props.mode === 'IS') {
      ApiDataService.post(url, querystring.stringify(data)).then(response => {
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
    } else {
      ApiDataService.update(`${url}/update/${props.sysid}`, querystring.stringify(data)).then(response => {
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
  }

  const validate = {
    page_info_code: { required: "Info Code is required" },
    page_info_desc: { required: "Info Description is required" }
  };

  useEffect(() => {
    console.log("TOINGS THINGS");
    // initial setup
    let defaultDate = moment(new Date(), 'DD-MMM-YYYY').toDate();
    let dbDate = moment(new Date()).format('DD-MMM-YYYY');
    setFormData((date) => ({
      ...formData, 
      formDate: defaultDate, 
      uptoDate: defaultDate,
      modulelov:[],
      parentlov: [],
      menutypelov: [],
      moduleselect: '',
      parentselect: '',
      typeselect: '',
      editClick: false
    }));
    setValue('menu_from_date', dbDate);
    setValue('menu_upto_date', dbDate);
    // initial setup end
    let sysid = props.sysid;
    if (props.show) {
      Promise.all([menuModuleLov()]).then((result) => {
        var dataSet = result[0];
        if (sysid === '' || sysid === null){
          setFormData({
            ...formData,
            modulelov: dataSet.module,
            menutypelov: dataSet.type
          });
        }
        if (sysid !== '' && sysid !== null) {
          ApiDataService.get(`${url}/${sysid}/edit`).then(response => {
            let data = response.data.result[0];
            setValue('menu_module', data.menu_module);
            setValue('menu_code', data.menu_code);
            setValue('menu_desc', data.menu_desc);
            setValue('menu_parent_code', data.menu_parent_code);
            setValue('menu_type', data.menu_type);
            setValue('menu_disp_seq', data.menu_disp_seq);
            setValue('menu_definition', data.menu_definition);
            setValue('menu_multi_inst_yn', data.menu_multi_inst_yn);
            setValue('menu_txn_code', data.menu_txn_code);
            setValue('menu_active_yn', data.menu_active_yn);
            setValue('menu_from_date', data.menu_from_date);
            setValue('menu_upto_date', data.menu_upto_date);
            var from_date = moment(data.menu_from_date, 'DD-MMM-YYYY').toDate();
            var upto_date = moment(data.menu_upto_date, 'DD-MMM-YYYY').toDate();
            setFormData({...formData,
              modulelov: dataSet.module,
              menutypelov: dataSet.type,
              moduleselect: data.menu_module,
              typeselect: data.menu_type,
              parentselect: data.menu_parent_code,
              checkBox: data.menu_multi_inst_yn,
              checkBoxM: data.menu_active_yn,
              formDate: from_date,
              uptoDate: upto_date,
              editClick:true
            });
          });
        }
      });
    }
    if (props.sysid && props.mode === 'IS') {
      let id = props.sysid;
      ApiDataService.delete(`${url}/`, id).then(response => {
        console.log(response.data, "rest");
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
  
  useEffect(() => {
    var parent = [];
    console.log(formData.editClick,"SDFSDF")
    if (props.sysid !== '' && props.sysid !== null && formData.editClick) {
      ApiDataService.get(`${url}/fetch/parent_menu?module_code=` + formData.moduleselect + '&', null).then(response => {
        let json = response.data.result;
        parent.push({ value: "", label: "Select" });
        for (var i = 0; i < json.length; i++) {
          parent.push({ value: json[i].code, label: json[i].desc });
        }
        setFormData({
          ...formData,
          parentlov: parent
        });
      });
    }
  }, [formData.editClick]);

  const menuModuleLov = async() => {
    var module=[];
    var type = [];
    await ApiDataService.get(`${url}/fetch/module`, null).then(response => {
      let json = response.data.result;      
      module.push({ value: "", label: "Select" });
      for (var i = 0; i < json.length; i++) {
        module.push({ value: json[i].code, label: json[i].desc });
      }
    });
    await ApiDataService.get(`${url}/fetch/menu_type`, null).then(response => {
      let json = response.data.result;
      type.push({ value: "", label: "Select" });
      for (var i = 0; i < json.length; i++) {
        type.push({ value: json[i].code, label: json[i].desc });
      }
    });
    let arrayReturn = { module, type};
    return arrayReturn;
  }

  const changeDate = (data, mode) => {
    console.log(data);
    var format = moment(data).format('DD-MMM-YYYY');
    (mode === 'FD' ? setFormData({ ...formData, formDate: data }) : setFormData({ ...formData, uptoDate: data }));
    (mode === 'FD' ? setValue('menu_from_date', format) : setValue('menu_upto_date', format));
  }

  const keyupChange=async (e,param)=>{
    if (param==='MO'){
      let value = e.value;
      var parent=[];
      await ApiDataService.get(`${url}/fetch/parent_menu?module_code=` + value+'&', null).then(response => {
        let json = response.data.result;
        parent.push({ value: "", label: "Select" });
        for (var i = 0; i < json.length; i++) {
          parent.push({ value: json[i].code, label: json[i].desc });
        }
      });
      setFormData({
        ...formData,
        parentlov: parent,
        moduleselect: value
      });
      setValue('menu_module', value);
    } else if (param === 'MT'){
      let value = e.value;
      setFormData({
        ...formData,
        typeselect: value
      });
      setValue('menu_type', value);
    } else if (param === 'MP') {
      let value = e.value;
      setFormData({
        ...formData,
        parentselect: value
      });
      setValue('menu_parent_code', value);
    }
  }
  const AutoCheck = (event,param) => {
    var checked = event.target.checked;
    if (param=='ML'){
      if (checked) {
        setFormData({ ...formData, checkBox: "Y" });
      } else {
        setFormData({ ...formData, checkBox: "N" });
      }
    }else{
      if (checked) {
        setFormData({ ...formData, checkBoxM: "Y" });
      } else {
        setFormData({ ...formData, checkBoxM: "N" });
      }
    }
  }
  return (
    <div>
      <Modal animation={false} size="md" show={props.show} onHide={props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Menu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Menu Module</Form.Label>
                  <Controller
                    render={() => (
                      <div>
                        <Select
                          value={formData.modulelov.filter(function (option) {
                            return option.value === formData.moduleselect;
                          })}
                          onChange={(e)=>keyupChange(e,'MO')}
                          options={formData.modulelov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="menu_module"
                  />
                  <small className="text-danger">
                    {errors.page_info_code && errors.page_info_code.message}
                  </small>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Menu Code</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="menu_code" placeholder="Menu Code" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Menu Type</Form.Label>
                  <Controller
                    render={() => (
                      <div>
                        <Select
                          value={formData.menutypelov.filter(function (option) {
                            return option.value === formData.typeselect;
                          })}
                          onChange={(e) => keyupChange(e, 'MT')}
                          options={formData.menutypelov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="menu_type"
                  />
                </Form.Group>
                
                <Form.Group>
                  <Form.Label>Txn Code</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="menu_txn_code" placeholder="Txn Code" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Controller
                    control={control}
                    name="menu_from_date"
                    render={(onChange) => (
                      <DatePicker className="form-control form-control-sm" selected={formData.formDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'FD')} />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Menu Parent</Form.Label>
                  <Controller
                    render={() => (
                      <div>
                        <Select
                          value={formData.parentlov.filter(function (option) {
                            return option.value === formData.parentselect;
                          })}
                          onChange={(e) => keyupChange(e, 'MP')}
                          options={formData.parentlov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="menu_parent_code"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Menu Description</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="menu_desc" placeholder="Menu Description" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Menu Definition</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="menu_definition" placeholder="Menu Definition" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Menu Sequence</Form.Label>
                  <Form.Control ref={register} type="text" size="sm" name="menu_disp_seq" placeholder="Menu Sequence" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Upto Date</Form.Label>
                  <Controller
                    control={control}
                    name="menu_upto_date"
                    render={(onChange) => (
                      <DatePicker className="form-control form-control-sm" selected={formData.uptoDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'UP')} />
                    )}
                  />
                </Form.Group>
              </Col>  
            </Row>
            <Row>
              <Col>
                <div className="form-check form-check-inline">
                <input className="form-check-input" checked={(formData.checkBox == 'Y' ? true : false)} onChange={(e) => AutoCheck(e, 'ML')} type="checkbox" />
                <label>Menu Multi ?</label>
                <input type="hidden" name="menu_multi_inst_yn" ref={register} value={formData.checkBox} />
                </div>
              </Col>
              <Col>   
                  <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={(formData.checkBoxM == 'Y' ? true : false)} onChange={(e) => AutoCheck(e, 'AC')} type="checkbox" />
                  <label>Active</label>
                  <input type="hidden" name="menu_active_yn" ref={register} value={formData.checkBoxM} />
                </div>
              </Col>
              <Col xs={12}>
                <button type="submit" className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default MenuModal;