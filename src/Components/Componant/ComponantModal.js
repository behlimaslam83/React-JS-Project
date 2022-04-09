
import React, { Component } from 'react';
import './Componant.scss';
import { Form, Modal } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
const insertUrl = 'admin/portal/component';
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};
class ComponantModal extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      cm_from_date:'',
      cm_upto_date:'',
      cm_desc:'',
      cm_unique_id:'',
      cm_active_yn:'N',
      errors: {},
      sysid:null,
      parentlov:[],
      pageselected:[],
      editpageselect:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount(){
  //   var format = moment(new Date()).format('DD-MMM-YYYY');
  //   this.setState({ cm_from_date: format });
  //   this.setState({ cm_upto_date: format });
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.show !== this.props.show) {
      if (this.props.show){
        var format = moment(new Date()).format('DD-MMM-YYYY');
          this.setState({
            cm_from_date: format,
            cm_upto_date: format,
            cm_desc: '',
            cm_unique_id: '',
            cm_active_yn: 'N',
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
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      console.log(response.data.result,"eresr");
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
        if (key === 'cm_from_date'){
          let fdate = moment(value, 'DD-MMM-YYYY').toDate();
          this.setState({ startDate: fdate });
        } else if (key === 'cm_upto_date'){
          let udate = moment(value, 'DD-MMM-YYYY').toDate();
          this.setState({ endDate: udate })
        }
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
        editpageselect: objectArray,
        sysid: id
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

  changeDate = (data, mode) => {
    console.log(data);
    var format = moment(data).format('DD-MMM-YYYY');
    (mode === 'FD' ? this.setState({ startDate: data }) : this.setState({ endDate: data }));
    (mode === 'FD' ? this.setState({ cm_from_date: format }) : this.setState({ cm_upto_date: format }));
  }

  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	if (name === 'cm_active_yn'){
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
            Component
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="formAction">
            <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
            <Form.Group >
              <Form.Label>Description</Form.Label>
                <Form.Control size="sm" onChange={this.stateChanges} value={setValue.cm_desc} type="text" name="cm_desc" placeholder="Description" />
                {this.state.errors["cm_desc"] &&
                  <span className='custError'>{this.state.errors["cm_desc"]}</span>
                }
            </Form.Group>
            <Form.Group>
              <Form.Label>Unique ID</Form.Label>
                <Form.Control size="sm" onChange={this.stateChanges} value={setValue.cm_unique_id} type="text" name="cm_unique_id" placeholder="Unique ID" />
                {this.state.errors["cm_unique_id"] &&
                  <span className='custError'>{this.state.errors["cm_unique_id"]}</span>
                }
            </Form.Group>
            <Form.Group >
              <Form.Label>Url</Form.Label>
                <Form.Control size="sm" type="text" value={setValue.cm_url} onChange={this.stateChanges} name="cm_url" placeholder="Url" />
                {this.state.errors["cm_url"] &&
                  <span className='custError'>{this.state.errors["cm_url"]}</span>
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
            <Form.Group >
              <Form.Label>From Date</Form.Label>
                <DatePicker selected={this.state.startDate} className="form-control form-control-sm" name="cm_from_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'FD')} />
            </Form.Group>
            <Form.Group >
            <Form.Label>Upto Date</Form.Label>
                <DatePicker selected={this.state.endDate} className="form-control form-control-sm" name="cm_upto_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'UD')} />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check onChange={this.stateChanges} checked={setValue.cm_active_yn==='Y' ? true : false} type="checkbox" name="cm_active_yn" label="Active" />
            </Form.Group>
              <button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default ComponantModal;