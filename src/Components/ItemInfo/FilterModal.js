
import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './ItemInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";

const insertUrl = 'admin/portal/iteminfo/filter';
const Api_Filterlov = 'admin/portal/iteminfo/filter/filter_type_lov';
const Api_Taglov = 'admin/portal/iteminfo/filter/tag_lov';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class FilterModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      item_filter_type:'',
      item_filter_tags:'',
      item_filter_ordering:'',
      item_filter_active_yn:'N',
      errors: {},
      item_filter_info_id:'',
      filterlov: [],
      taglov:[],
      
      modalShow: false,
      filterModalShow: false,
      mode: '',
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      filterRenderTable:false,
	    page: 1,
      valueArray : [],
      item_tags : []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalRef = React.createRef();
    this.filtermodalRef = React.createRef();
    this.onChange = this.onChange.bind(this);
  }


  setInput_value(){
    this.setState({
      item_filter_type:'',
      item_filter_tags:'',
      item_filter_ordering:'',
      item_filter_active_yn:'N',
      errors: {},
      mode: '',
    });
  }

  onChange(value, { action, removedValue }) {
    this.state.valueArray = [];

    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        value = this.state.taglov.filter(v => v.isFixed);
        break;
    }
    
    this.setState({ value: value });
    
    for (var i = 0; i < value.length;i++){
      this.state.valueArray.push(value[i].value);
    }
      
    this.setState({ item_filter_tags: this.state.valueArray.join(',') });

  }

  setModalShow = () => {
    this.setInput_value();
    this.setState({
      filterModalShow: true,
      mode: 'IS'
    });
  }

  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ modalShow: false });
    this.setState({ filterModalShow: false });
  }

  filterRenderTable = () => {
    this.setState({ filterRenderTable:true
    },() => {
      this.setState({ 
        filterRenderTable: false        
       });
    });
  }

  editRecord=(id)=>{
    this.modalRef.current.editModalRecord(id);
    this.setState({ modalShow: true,mode: 'UP' });
  }


  deletRecord = (id) => {
    this.setState({ deletedialog: true, item_filter_info_id: id });
  }

  proceedDelete = (params) => {
    if (params) {
      this.deleteModalRecord(this.state.item_filter_info_id);
    }else{

    }

  }

  deleteModalRecord=(id)=>{
    ApiDataService.delete(`${insertUrl}/`,id).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.errorThrough(response.data.result, "ERR-OBJ");
        } else {
          this.errorThrough(response.data.error_message, "ERR");
        }
      } else {
        this.errorThrough(response.data.error_message, "DONE");
        this.filterRenderTable();
      }
      this.closedialog();
    }).catch((error) => {
      this.errorThrough(error.message, "ERR");
      this.closedialog();
    });
  }


  snapclose = () => {
    this.setState({ snapopen: false });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  errorThrough = (error, argu) => {
    console.log(error,"RULING");
	var erroMessage = '';
    if (argu === 'ERR-OBJ') {
        erroMessage = Object.keys(error).map(function (key) {
			return <ul key={key} className="mrgnone list-unstyled"><li>{error[key]}</li></ul>;
        });
    } else {
       erroMessage = <ul className="mrgnone list-unstyled"><li>{error}</li></ul>;
    }
    var backColor = ((argu === 'ERR' || argu === 'ERR-OBJ') ? '#ff4c4ceb' : '#20bb20eb');
    this.setState({ snapopen: true, snapcolor: backColor });
    this.setState({ error: erroMessage });
  }

  componentWillMount(){
    ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Filterlov)
			.then(response => {	
			  this.setState({
          filterlov: response.data.result
        });
    }).catch(function(error){			
      
    });

  }

  
  filterModalRecord=(id)=>{
    //localStorage.setItem('PRODUCT_INFO_ID', id);
    this.setState({ item_filter_info_id : id, mode: ''});
  }

  editfilterModalRecord=(id)=>{
    this.state.mode = 'UP';
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
        if(key == 'item_filter_type'){
          this.filterTypeTag(value);
        }  
      });
    }).catch((error)=>{

    });
    
  }

  filterTypeTag =(desc) => {
    ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Taglov + '/' + desc)
			.then(response => {	
			  this.setState({
          taglov: response.data.result
        });
    }).catch(function(error){			
      
    });
  }
  
  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	  if (name === 'item_filter_active_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }else if(name === 'item_filter_type'){
      this.filterTypeTag(value);
      values = value;
    }else{
      values = value;
    }
    this.setState({ [name]: values });
  }
  validation = () => {
    let fields = this.state;
    let errors={};
    let formIsValid = true;
    //console.log(item_info_desc, "test");
    //let errors = this.state.errors;

    // if (!fields['item_filter_type']) {
    //   errors["item_filter_type"] = "Filter type is required";
    //   formIsValid = false;
    // }
    // if (!fields['item_filter_tags']){
    //   errors["item_filter_tags"] = "Tag is required";
    //   formIsValid = false;
    // }
    if (!fields['item_filter_ordering']) {
      errors["item_filter_ordering"] = "Tag ordering is required";
      formIsValid = false;
    }
    this.setState({ errors: errors });
    return formIsValid;
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
	var serverSet = '';
    var url = '';
	  if (this.state.mode==='IS'){
      //serverSet = ApiDataService.post;
      url = insertUrl + '?item_filter_info_id='+this.state.item_filter_info_id;
      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        }else{
          this.errorThrough(response.data.error_message, "DONE");
          this.filterRenderTable();
          this.setInput_value();
          //this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });
    }else{
     // serverSet = ApiDataService.update;
      url = `${insertUrl}/update/${this.state.item_filter_id}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        }else{
          this.errorThrough(response.data.error_message, "DONE");
          this.filterRenderTable();
          this.setInput_value();
          //this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });
    }
    // serverSet(url, formData).then(response => {
    //   if (response.data.return_status !== "0") {
    //     if (response.data.error_message === 'Error') {
    //       this.errorThrough(response.data.result, "ERR-OBJ");
    //     } else {
    //       this.errorThrough(response.data.error_message, "ERR");
    //     }
    //   }else{
    //     this.errorThrough(response.data.error_message, "DONE");
    //     this.filterRenderTable();
    //     //this.props.closeModal();
    //   }
    // }).catch((error) => {
    //   console.log(error);
    //   this.errorThrough(error.message, "ERR");
    // });
  }


  render(){

    const setValue = this.state;
    let {filterlov, taglov} = this.state;

    let self = this;
    const url = `admin/portal/iteminfo/filter`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={ this.setModalShow }>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no', 
      'item_filter_type',
      'item_filter_tags',			
      'item_filter_ordering',
      'item_filter_active_yn',
      'actions'
    ];
	
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        item_filter_type: 'Type',
        item_filter_tags: 'Tags',			
        item_filter_ordering: 'Ordering',
        item_filter_active_yn: 'Active ?',
        
      },
	    search_key: {
        item_filter_type: 'Type',
        item_filter_tags: 'Tags',			
        item_filter_ordering: 'Ordering',
        item_filter_active_yn: 'Active ?'
      },
      sortable: ['item_filter_type', 'item_filter_tags', 'item_info_from_date', 'item_info_upto_date'],
      requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order' },
      columnsAlign: { actions: 'center' },
      responseAdapter: function (resp_data) {
        self.setState({ page: resp_data.page });
        return { data: resp_data.result, total: resp_data.row_count }
      },
      texts: {
        show: ''
      },
	  search_lov: {
		pages:[]
	  }
    };


    // var taglovArray=[];
    // for (var i = 0; i < taglov.length;i++){
    //   taglovArray.push({ value: taglov[i].id, label: taglov[i].desc});
    // }
    
    // var prodFilterTags = this.state.item_filter_tags.split(',');
    // var prodFilterTagValue = [];
    // for (var i = 0; i < prodFilterTags.length;i++){
    //   prodFilterTagValue.push(taglovArray.filter((item) => item.value === prodFilterTags[i])[0]);
    // }
    return (
      <div>
        <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Filter
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className={this.state.mode === '' ? "d-none" : 'col-sm-4'}>
              <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                <Form.Row>
                  <Col>
                    <Form.Group> 
                      <Form.Label>Filter Type</Form.Label>
                      <Form.Control as="select" value={setValue.item_filter_type} name="item_filter_type" onChange={this.stateChanges}>
                        <option>Select Product</option>
                        {filterlov.map((data,i) => (
                          <option value={data.id} key={i}>{data.desc}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row> 

                <Form.Row>          
                <Col>
                  <Form.Group> 
                    <Form.Label>Tag</Form.Label>
                      <Form.Control as="select" value={setValue.item_filter_tags} name="item_filter_tags" onChange={this.stateChanges}>
                        <option>Select Tag</option>
                        {taglov.map((data,i) => (
                          <option value={data.id} key={i}>{data.desc}</option>
                        ))}
                      </Form.Control>
                        
                      {/* <Select
                        value={prodFilterTagValue}
                        isMulti
                        name="item_filter_tags"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.onChange}
                        options={taglovArray}
                      /> */}

                    </Form.Group>
                </Col>

                
              </Form.Row>
                
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ordering</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.item_filter_ordering} type="text" name="item_filter_ordering" placeholder="Ordering" />
                        {this.state.errors["item_filter_ordering"] &&
                          <span className='custError'>{this.state.errors["item_filter_ordering"]}</span>
                        }
                    </Form.Group>
                  </Col>
                  <Col sm={3} className="text-rigth">
                    <Form.Group controlId="formBasicCheckbox">
                    <Form.Label>Active ?</Form.Label>
                      <Form.Check onChange={this.stateChanges} checked={setValue.item_filter_active_yn==='Y' ? true : false} type="checkbox" name="item_filter_active_yn"/>
                    </Form.Group>
                  </Col>
                </Form.Row>
                
                <button type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.state.mode === 'IS' ? 'Save' : 'Update'}</button>
              </Form>
            </Col>

            <Col className={this.state.mode === '' ? "col-sm-12" : 'col-sm-8'}>

            <SnapBarError 
              message={this.state.error}
              snapopen={this.state.snapopen}
              snapcolor={this.state.snapcolor}
              snapclose={this.snapclose} />
                <ConfirmationDialog
                  dialogopen={this.state.deletedialog}
                  dialogclose={this.closedialog}
                  agreeProcess={this.proceedDelete}
                />
        <WindowPanel rawHtml={
          <div className="windowContent">
            <ServerTable renderView={this.state.filterRenderTable} columns={columns} url={`${url+`?item_filter_info_id=`+this.state.item_filter_info_id}`} options={options} addme={$button} bordered hover updateUrl>
            {
              function (row, column, index) {
                switch (column) {
                  	case 'sr_no':
                      return (
                        (index+1)+(PER_PAGE*((self.state.page)-1))
                      );
                    case 'actions':
                      return (
                        <div className="form-control-sm" style={{ textAlign: 'center' }}>
                          <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                          <Dropdown.Item onClick={() => self.editfilterModalRecord(row.item_filter_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.deletRecord(row.item_filter_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                          </DropdownButton>
                        </div>
                      );
                    default:
                      return (row[column]);
                  }
                }
              }
            </ServerTable>
            
          </div> 
        }/>

            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default FilterModal;