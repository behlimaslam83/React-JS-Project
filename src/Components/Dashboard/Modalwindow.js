
import React, { Component, useRef,useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import './Dashboard.scss';
import { Col, Row, Modal } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from 'draft-js-import-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const querystring = require('querystring');

function Modalwindow(props) {
  const initalDate = {
    startDate: new Date(),
    endDate: new Date()
  };
  let contentState = stateFromHTML('<p>Hello</p>');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const Api_Insert = 'admin/portal/homepage';
  const Api_Update = 'admin/portal/homepage/update/';
  const Api_Parentlov = 'admin/portal/homepage/parent/fetch';
  const Api_Edit = 'admin/portal/homepage/';
  const [date, setDate] = useState(initalDate);
  const [checkBox, setCheckBox] = useState({
    parentYn:"N",
    activeYn: "N",
    autoYn: "N",
    checkPrnt:false,
    checkActive:false,
    checkAuto:false
  });
  const [sysid, setSysid] = useState(null);
  const [parentlov, setParentlov] = useState([]);
  const [showParent, setShowParent] = useState(true);
  const [file, setFile] = useState({
    validate:"image is required",
    image:''
  });

  const { register, handleSubmit, control, reset , getValues, setValue, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    console.log(data,"testt");
    var formData = new FormData();
    let image = file.image;
    formData.append("avatar", image);
    const hp_html = stateToHTML(editorState.getCurrentContent());
    formData.append("hp_html", hp_html);
    let real = {
      ...data
    };
    for (var key in real) {
      formData.append(key, real[key]);
    }
    if(props.mode=='IS'){
      ApiDataService.post(Api_Insert, formData).then(response => {
        if(response.data.return_status!=0){ 
          if (response.data.error_message=='Error'){
            props.errorMessage(response.data.result, "ERR-OBJ");
          }else{
            props.errorMessage(response.data.error_message, "ERR");
          }
        }else{
          props.errorMessage(response.data.error_message,"DONE");
          props.renderTable();
          props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        props.errorMessage(error, "ERR");
      });
    }else{
      ApiDataService.update(Api_Update + sysid, formData).then(response => {
        if (response.data.return_status != 0) {
          if (response.data.error_message == 'Error') {
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
        props.errorMessage(error, "ERR");
      });
    }
  }
  const editModalWindow =  () =>{
      ApiDataService.get(Api_Edit + props.sysid + '/edit').then(response => {
      console.log(response.data, "rest");
      let data = response.data.result[0];
      let valid = (data.hp_file_path != null ? false : 'image is required');
      var hp_from_date = moment(data.hp_from_date, 'DD-MMM-YYYY').toDate();
      var hp_upto_date = moment(data.hp_upto_date, 'DD-MMM-YYYY').toDate();
      if (data.hp_html !=null){
        var hp_html = stateFromHTML(data.hp_html);
        var createHtml = EditorState.createWithContent(hp_html);
        setEditorState(createHtml);
      }else{
        setEditorState('');
      }
      setDate({ ...date, startDate: hp_from_date, endDate: hp_upto_date });
      setValue("hp_parent_id", data.hp_parent_id);  
      setValue("hp_desc", data.hp_desc);
      setValue("hp_ordering", data.hp_ordering);
      setValue("hp_link_url", data.hp_link_url);
      setValue("hp_link_title", data.hp_link_title);
      setValue("hp_timer", data.hp_timer);
      setFile({ ...file, image: data.hp_file_path, validate: valid });
      setSysid(data.hp_id);
      var parentBox ='';
        if (data.hp_parent_yn == 'Y'){
        setShowParent(false);
        parentBox = true;
      }else{
        setShowParent(true);
        parentBox = false;
      }
      // let parentBox = (data.hp_parent_yn == 'Y' ? true : false );
      let activeBox = (data.hp_active_yn == 'Y' ? true : false);
      let autoBox = (data.hp_auto_play == 'Y' ? true : false);
      setCheckBox({ parentYn: data.hp_parent_yn, activeYn: data.hp_active_yn, autoYn: data.hp_auto_play, checkPrnt: parentBox, checkActive: activeBox, checkAuto: autoBox});
    }).catch({

    });
  }
  const parentDropdown = async () =>{
    await ApiDataService.post(Api_Parentlov, null).then(response => {
      setParentlov(response.data.result);
      console.log("AM RUN FIRST");
      }).catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setShowParent(true);
    var format = moment(new Date()).format('DD-MMM-YYYY');
    setValue('hp_from_date', format);
    setValue('hp_upto_date', format);
    reset({});
    setCheckBox({ ...checkBox, parentYn: "N", activeYn: "N", autoYn: "N", checkPrnt: false, checkActive: false, checkAuto: false });
    setDate({ ...initalDate});
    if (props.show && props.sysid==null){
      parentDropdown();
    }
    if (props.sysid){
        Promise.all([parentDropdown()]).then((result) => {
          editModalWindow()
        }
      )
    }
  }, [props.show]);

  useEffect(() => () => [props.show, props.mode]); // unmount exiting data...
  const Inputwidth = { width: '100%' };
  const dropDown = { width: '100%',margin: '6px 0px 28px 0px'};
  const validation ={
    hp_desc: { required: "Description is required" },
    hp_ordering: { required: "Ordering is required" },
    image: { required: file.validate },
  };
  const changeDate = (data, mode) => {
    console.log(data);
    var format = moment(data).format('DD-MMM-YYYY');
    (mode == 'FD' ? setDate({ ...date, startDate: data }) : setDate({ ...date, endDate: data }));
    (mode == 'FD' ? setValue('hp_from_date', format) : setValue('hp_upto_date', format));
  }
  const fileUpload = (e) => {
    console.log(e.target.files[0]);
    setFile({ ...file, image: e.target.files[0]});
  }
  const parentCheck = (event)=>{
    let checked = event.target.checked;
    if (checked){
      setCheckBox({ ...checkBox, parentYn: "Y", checkPrnt: true });
      setShowParent(false);
    }else{
      setCheckBox({ ...checkBox, parentYn: "N", checkPrnt: false});
      setShowParent(true);
    }
  }
  const ActiveCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, activeYn: "Y", checkActive: true });
    } else {
      setCheckBox({ ...checkBox, activeYn: "N", checkActive: false});
    }
  }
  const AutoCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, autoYn: "Y", checkAuto: true });
    } else {
      setCheckBox({ ...checkBox, autoYn: "N", checkAuto: false });
    }
  }
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  return (
    <>
      <Modal animation={false} size="lg" show={props.show} onHide={props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Home Page
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <Row>
              <Col>
                <div className="form-group">
                  <label>Section</label>
                  <input type="text" className="form-control form-control-sm" ref={register(validation.hp_desc)} id="hp_desc" name="hp_desc" placeholder="Section"/>
                  <small className="text-danger">
                    {errors.hp_desc && errors.hp_desc.message}
                  </small>
              </div>
                {/* <TextField
                  inputRef={register(validation.hp_desc)}
                  className="textMrg"
                  id="standard-full-width"
                  label="Description"
                  style={Inputwidth}
                  placeholder="Description"
                  margin="normal"
                  name="hp_desc"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <small className="text-danger">
                  {errors.hp_desc && errors.hp_desc.message}
                </small> */}
              </Col>
            </Row>{' '}
            <Row>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" onChange={parentCheck} checked={checkBox.checkPrnt} type="checkbox" id="inlineCheckbox1"/>
                  <label className="form-check-label">Parent ?</label>
                  <input type="hidden" name="hp_parent_yn" ref={register} value={checkBox.parentYn} />
                </div>
               
                {/* <div className="text-left"> */}
                  {/* <span className="textcap">Parent ?</span> */}
                  
                  {/* <input className="form-check-input" type="checkbox" onChange={parentCheck} checked={checkBox.checkPrnt} id="defaultCheck1"></input>
                  <label class="form-check-label" for="defaultCheck1">Parent ?</label> */}
                  {/* <Checkbox
                    checked={checkBox.checkPrnt}
                    onChange={parentCheck}
                    color="primary"
                    className="rmpadding"
                  /> */}
                  {/* <input type="hidden" name="hp_parent_yn" ref={register} value={checkBox.parentYn} /> */}
                {/* </div> */}
              </Col>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkActive} onChange={ActiveCheck} type="checkbox" id="inlineCheckbox1" />
                  <label className="form-check-label">Active ?</label>
                  <input type="hidden" name="hp_active_yn" ref={register} value={checkBox.activeYn} />
                </div>
                {/* <div className="text-right felxDiv">
                  <span className="textcap">Active ?</span>
                  <Checkbox
                    checked={checkBox.checkActive}
                    color="primary"
                    className="rmpadding"
                    onChange={ActiveCheck}
                  />
                  <input type="hidden" name="hp_active_yn" ref={register} value={checkBox.activeYn} />
                </div>
                <small className="text-danger">
                  {errors.checkedB && errors.checkedB.message}
                </small> */}
              </Col>
            </Row>{' '}
            {showParent && 
            <Row>
              <Col>
                <label>Parent Name</label>
                <select id="hp_parent_id" name="hp_parent_id" ref={register} className="form-control form-control-sm">
                  <option value="">Select</option>
                  {parentlov.map(function (data, i) {
                    return <option key={i} value={data.parent_id}>{data.parent_desc}</option>;
                  })}
                </select>
                {/* <FormControl style={dropDown}>
                  <InputLabel shrink >Parent Name</InputLabel>
                  <Controller
                    as={<NativeSelect
                        inputProps={{ 
                          id: 'uncontrolled-native',
                        }}>
                        <option value="">Select</option>
                        {parentlov.map(function (data, i){
                          return <option key={i} value={data.parent_id}>{data.parent_desc}</option>;
                        })}
                      </NativeSelect>}
                    name="hp_parent_id"
                    control={control}
                    inputRef={register}
                  />
                </FormControl> */}
              </Col>
            </Row> }
            <Row>
              <Col>
                <div className="form-group">
                  <label>Ordering</label>
                  <input type="text" className="form-control form-control-sm" ref={register} id="hp_ordering" name="hp_ordering" placeholder="Ordering" />
                  {/* <small className="text-danger">
                    {errors.hp_desc && errors.hp_desc.message}
                  </small> */}
                </div>
                {/* <FormGroup>
                <TextField
                  id="standard-full-width"
                  label="Ordering"
                  className="textMrg"
                  style={{ margin: 7 }}
                  placeholder="Ordering"
                  style={Inputwidth}
                  inputRef={register(validation.hp_ordering)}
                  margin="normal"
                  name="hp_ordering"
                  InputLabelProps={{
                    shrink: true,
                  }} />
                <small className="text-danger">
                    {errors.hp_ordering && errors.hp_ordering.message}
                </small>
                </FormGroup> */}
              </Col>
              <Col>
                <div className="input-group input-group-sm p-0 mt-4">
                  <div className="custom-file p-0">
                    <input type="file" onChange={fileUpload} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                    <label className="custom-file-label">Upload file</label>
                  </div>
                </div>
                {/* <Button variant="contained" className="blocksize" size="small" component="label">
                  Upload File
                  <input onChange={fileUpload} ref={register(validation.image)} type="file" name="image" hidden />
                </Button> */}
                {/* <small className="text-danger">
                  {errors.image && errors.image.message}
                </small> */}
              </Col>
            </Row>{' '}
            <Row>
              <Col className="checkBox">
                <label>From Date</label>
                <Controller
                  control={control}
                  name="hp_from_date"
                  valueName="selected"
                  render={(onChange) => (
                    <DatePicker className="" name="hp_from_date" selected={date.startDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'FD')} />
                  )}
                />
              </Col>
              <Col className="checkBox">
                <label>Upto Date</label>
                <Controller
                  control={control}
                  name="hp_upto_date"
                  valueName="selected"
                  render={(onChange) => (
                    <DatePicker className="" selected={date.endDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'UD')} />
                  )}
                />
              </Col>
            </Row>{' '}
            <Row>
              <Col>
                <div className="form-group">
                  <label >Link Url</label>
                  <input type="text" ref={register} className="form-control form-control-sm" id="hp_link_url" name="hp_link_url" placeholder="Link Url"/>
                </div>
                {/* <FormGroup>
                  <TextField
                    id="standard-full-width"
                    label="Link Url"
                    className="textMrg"
                    style={{ margin: 7 }}
                    placeholder="Link Url"
                    style={Inputwidth}
                    inputRef={register}
                    margin="normal"
                    name="hp_link_url"
                    InputLabelProps={{
                      shrink: true,
                    }} />
                </FormGroup> */}
              </Col>
              <Col>
                <div className="form-group">
                  <label >Link Title</label>
                  <input type="text" ref={register} className="form-control form-control-sm" id="hp_link_title" name="hp_link_title" placeholder="Link Title" />
                </div>
                {/* <FormGroup>
                  <TextField
                    id="standard-full-width"
                    label="Link Title"
                    className="textMrg"
                    style={{ margin: 7 }}
                    placeholder="Link Title"
                    style={Inputwidth}
                    inputRef={register}
                    margin="normal"
                    name="hp_link_title"
                    InputLabelProps={{
                      shrink: true,
                    }} />
                </FormGroup> */}
              </Col>
            </Row>{' '}
            <Row>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkAuto} onChange={AutoCheck} type="checkbox" id="inlineCheckbox1" />
                  <label className="form-check-label">Auto Play ?</label>
                  <input type="hidden" name="hp_auto_play" ref={register} value={checkBox.autoYn} />
                </div>
                {/* <div className="text-right felxDiv">
                  <span className="textcap">Auto Play ?</span>
                  <Checkbox
                    checked={checkBox.checkAuto}
                    onChange={AutoCheck}
                    color="primary"
                    className="rmpadding"
                  />
                  <input type="hidden" name="hp_auto_play" ref={register} value={checkBox.autoYn} />
                </div> */}
              </Col>
              <Col>
                <div className="form-group">
                  <label >Timer</label>
                  <input className="form-control form-control-sm" ref={register} type="number" defaultValue="0" id="hp_timer" name="hp_timer" />
                  </div>
                {/* <FormGroup>
                  <TextField
                    id="standard-full-width"
                    label="Timer"
                    className="textMrg"
                    style={{ margin: 7 }}
                    placeholder="Timer"
                    style={Inputwidth}
                    inputRef={register}
                    margin="normal"
                    name="hp_timer"
                    type="number"
                    defaultValue="0"
                    InputLabelProps={{
                      shrink: true,
                      max: 100, min: 10
                    }} />
                </FormGroup> */}
              </Col>
            </Row>
            <Row>
              <Col>
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                {/* <Button variant="contained" type="submit" size="small" color={props.mode == 'IS' ? "primary" : "secondary"} className="test">{props.mode == 'IS' ? 'Save':'Update'}</Button> */}
                <button type="submit" className={props.mode == 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode == 'IS' ? 'Save' : 'Update'}</button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Modalwindow;