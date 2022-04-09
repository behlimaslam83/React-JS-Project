
import React, { Component } from 'react';
import './SocialMedia.scss';
import { Form, Modal } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';
const insertUrl = 'admin/portal/social';

class SocialMediaModal extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      social_scn_iso:'',
      social_icon:'',
      social_page_link:'',
      social_active_yn:'',
      errors: {},
      sysid:null,
      filename:'browse..'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  editModalRecord=(id)=>{
    this.setState({ sysid : id});
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      console.log(response.data.result,"eresr");
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        console.log(key,"SDFSDF");
        if (key =='social_icon'){
          key = 'filename';
        }
        this.setState({ [key]: value });
      });
    }).catch((error)=>{

    });
  }

  deleteModalRecord=(id)=>{
    ApiDataService.delete(`${insertUrl}/`,id).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.props.errorMessage(response.data.result, "ERR-OBJ");
        } else {
          this.props.errorMessage(response.data.error_message, "ERR");
        }
      } else {
        this.props.errorMessage(response.data.error_message, "DONE");
        this.props.renderTable();
      }
      this.props.closeDelete();
    }).catch((error) => {
      this.props.errorMessage(error.message, "ERR");
      this.props.closeDelete();
    });
  }


  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	if (name === 'social_active_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }else{
      values = value;
    }
    this.setState({ [name]: values });
  }
  validation = () => {
    let fields = this.state;
    let errors={};
    let formIsValid = true;
    if (!fields['cm_desc']){
      errors["cm_desc"] = "Description is required";
      formIsValid = false;
    }
    if (!fields['cm_unique_id']) {
      errors["cm_unique_id"] = "Unique is required";
      formIsValid = false;
    }
    if (!fields['cm_url']) {
      errors["cm_url"] = "Url is required";
      formIsValid = false;
    }
    this.setState({ errors: errors });
    return formIsValid;
  }
  handleSubmit(event){
    event.preventDefault();
    // if(!this.validation()){
    //   return false;
    // }
    var formData = new FormData();
    console.log(this.state, "STATE ALL");
    let Properties = this.state;
    for (var key in Properties) {
      formData.append(key, Properties[key]);
    }
    console.log(formData,"SDFSDF");
	  var serverSet = '';
    var url = '';
	if (this.props.mode==='IS'){
      // serverSet = ApiDataService.post;
      url = insertUrl;
      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          this.props.errorMessage(response.data.error_message, "DONE");
          this.props.renderTable();
          this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }else{
      // serverSet = ApiDataService.update;
      url = `${insertUrl}/update/${this.state.sysid}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          this.props.errorMessage(response.data.error_message, "DONE");
          this.props.renderTable();
          this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }
  }
  fileUpload = (e) => {
    var name = e.target.files[0].name;
    console.log(e.target.files[0],"SFDf");
    var image = e.target.files[0];
    let fileSize = e.target.files[0].size / 1024 / 1024;
    if (fileSize <= 2) {
      name = name;
      image = image;
    }else{
      name='';
      image='';
    }
    this.setState({
      filename: name,
      avatar: image
    })
  }

  render(){
    const setValue = this.state;
    return (
    <div>
        <Modal animation={false} size="sm" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Social Media
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
            <Form.Group >
              <Form.Label>Social ISO</Form.Label>
                <Form.Control onChange={this.stateChanges} value={setValue.social_scn_iso} type="text" name="social_scn_iso" placeholder="Social ISO" />
                {/* {this.state.errors["cm_desc"] &&
                  <span className='custError'>{this.state.errors["cm_desc"]}</span>
                } */}
            </Form.Group>
            <Form.Group>
              <Form.Label>Social Icon</Form.Label>
                <div className="input-group input-group-sm p-0">
                  <div className="custom-file p-0">
                    <input type="file" accept=".jpg,.jpeg,.png" onChange={e => this.fileUpload(e)} name="images" className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                    <label className="custom-file-label">{this.state.filename}</label>
                  </div>
                </div>
            </Form.Group>
            <Form.Group >
              <Form.Label>Page Link</Form.Label>
                <Form.Control type="text" value={setValue.social_page_link} onChange={this.stateChanges} name="social_page_link" placeholder="Page Link" />
                {/* {this.state.errors["cm_url"] &&
                  <span className='custError'>{this.state.errors["cm_url"]}</span>
                } */}
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check onChange={this.stateChanges} checked={setValue.social_active_yn === 'Y' ? true : false} type="checkbox" name="social_active_yn" label="Active" />
            </Form.Group>
              <button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default SocialMediaModal;