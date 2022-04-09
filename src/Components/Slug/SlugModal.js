
import React, { Component } from 'react';
import './Slug.scss';
import { Form, Modal } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
const insertUrl = 'admin/portal/slug';
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};
class SlugModal extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      slug_redirect_url:'',
      slug_desc:'',
      slug_url:'',
      slug_active_yn:'N',
      errors: {},
      sysid:null,
      parentlov:[],
      pageselected:[],
      editpageselect:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    var format = moment(new Date()).format('DD-MMM-YYYY');
    this.setState({ slug_redirect_url: format });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.show !== this.props.show) {
      if (this.props.show){
          this.setState({
            slug_redirect_url: '',
            slug_desc: '',
            slug_url: '',
            slug_active_yn: 'N',
            errors: {},
            sysid: null,
            parentlov: [],
            pageselected: [],
            editpageselect: []
          });
      }
    }
  }

  editModalRecord=(id)=>{
    this.setState({ sysid : id});
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      console.log(response.data.result,"eresr");
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
      });
      let page_list = response.data.result[0].page_list;
      var objectArray = [];
      var selected = [];
      for (var i = 0; i < page_list.length; i++) {
        objectArray.push({ value: page_list[i].unique_id, label: page_list[i].desc });
        selected.push(page_list[i].unique_id);
      }
      this.setState({
        parentlov: objectArray,
        pageselected: selected,
        editpageselect: objectArray
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
	if (name === 'slug_active_yn'){
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
    if (!fields['slug_desc']){
      errors["slug_desc"] = "Description is required";
      formIsValid = false;
    }
    if (!fields['slug_url']) {
      errors["slug_url"] = "Unique is required";
      formIsValid = false;
    }
    if (!fields['slug_url']) {
      errors["slug_url"] = "Url is required";
      formIsValid = false;
    }
    this.setState({ errors: errors });
    return formIsValid;
  }
  handleChange = (e) => {
    let selection = e.map(o => o.value);
    console.log(e,"SDFSDF");
    this.setState({
      pageselected: selection,
      editpageselect: e
    });
  }
  handleSubmit(event){
    event.preventDefault();
    if(!this.validation()){
      return false;
    }
    var formData = new FormData();
    console.log(this.state, "STATE ALL");
    let Properties = this.state;
    for (var key in Properties) {      
      formData.append(key, Properties[key]);
    }
    let pagearray = this.state.pageselected;
    for (var key in pagearray) {
      formData.append('page_id[]', pagearray[key]);
    }
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
  keyupsearch = (e) => {
    this.getPageName();
  }

  getPageName = ()=>{
    let url = `${insertUrl}/page_lov`;
    ApiDataService.get(url).then(response => {
      console.log(response, "USE FOR API");
      let json = response.data.result;
      var objectArray = [];
      objectArray.push({ value: "", label: "Select" });
      for (var i = 0; i < json.length; i++) {
        objectArray.push({ value: json[i].unique_id, label: json[i].desc });
      }
      this.setState({
        parentlov: objectArray
      })
    }).catch((error) => {
      console.log(error);
      this.props.errorMessage(error.message, "ERR");
    });
  }
  render(){
    const setValue = this.state;
    return (
    <div>
        <Modal animation={false} size="sm" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Slug
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="formAction">
            <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
            <Form.Group >
              <Form.Label>Description</Form.Label>
                <Form.Control size="sm" onChange={this.stateChanges} value={setValue.slug_desc} type="text" name="slug_desc" placeholder="Description" />
                {this.state.errors["slug_desc"] &&
                  <span className='custError'>{this.state.errors["slug_desc"]}</span>
                }
            </Form.Group>
            
            <Form.Group >
              <Form.Label>Url</Form.Label>
                <Form.Control size="sm" type="text" value={setValue.slug_url} onChange={this.stateChanges} name="slug_url" placeholder="Url" />
                {this.state.errors["slug_url"] &&
                  <span className='custError'>{this.state.errors["slug_url"]}</span>
                }
            </Form.Group>
              <Form.Group >
                <Form.Label>Page Name</Form.Label>
                <div onKeyUp={(e) => this.keyupsearch(e)}>
                  <Select size="sm"
                    isMulti
                    value={setValue.editpageselect}
                    onChange={(e)=>this.handleChange(e)}
                    options={setValue.parentlov}
                    className="custdropdwn"
                    // styles={customStyles}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label>Redirect Url</Form.Label>
                <Form.Control type="text" name="slug_redirect_url" value={setValue.slug_redirect_url} onChange={this.stateChanges} name="slug_redirect_url" placeholder="Redirect url" />
                {this.state.errors["slug_redirect_url"] &&
                  <span className='custError'>{this.state.errors["slug_redirect_url"]}</span>
                }
              </Form.Group>
              
              <Form.Group controlId="formBasicCheckbox">
                  <Form.Check onChange={this.stateChanges} checked={setValue.slug_active_yn==='Y' ? true : false} type="checkbox" name="slug_active_yn" label="Active" />
              </Form.Group>
              <button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default SlugModal;