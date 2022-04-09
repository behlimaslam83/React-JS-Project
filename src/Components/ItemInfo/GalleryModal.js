
import React, { Component } from 'react';
import './ProductInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";

const insertUrl = 'admin/portal/productinfo/gallery';

const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class GalleryModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      prod_gy_desc:'',
      prod_gy_tooltip:'',
      prod_gy_ordering:'',
      prod_gy_active_yn:'N',
      errors: {},
      prod_gy_info_id:null,
      
      
      galleryModalShow: false,
      mode: '',
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      galleryrenderTable:false,
	    page: 1,

      avatar: '',
      imagePreviewUrl: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalRef = React.createRef();
    this.galleryModalRef = React.createRef();
  }


  
  setModalShow = () => {
    this.setState({
      galleryModalShow: true,
      mode: 'IS'
    });
  }

  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ galleryModalShow: false });
  }

  galleryrenderTable = () => {
    this.setState({ galleryrenderTable:true
    },() => {
      this.setState({ galleryrenderTable: false });
    });
  }

  editRecord=(id)=>{
    this.modalRef.current.editModalRecord(id);
    this.setState({ galleryModalShow: true,mode: 'UP' });
  }


  deletRecord = (id) => {
    this.setState({ deletedialog: true, prod_gy_info_id: id });
  }

  proceedDelete = (params) => {
    if (params) {
      this.modalRef.current.deleteModalRecord(this.state.prod_gy_info_id);
    }else{

    }

  }
  snapclose = () => {
    this.setState({ snapopen: false });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
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

  

  
  galleryModalRecord=(id)=>{
    localStorage.setItem('PRODUCT_INFO_ID', id);
    this.setState({ prod_gy_info_id : id, mode: 'IS'});
  }

  editgalleryModalRecord=(id)=>{
    this.state.mode = 'UP';
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
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
        this.props.render();
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
	if (name === 'prod_gy_active_yn'){
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
       
    if (!fields['prod_gy_desc']){
      errors["prod_gy_desc"] = "Description is required";
      formIsValid = false;
    }
    if (!fields['prod_gy_ordering']) {
      errors["prod_gy_ordering"] = "Gallery ordering is required";
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
      serverSet = ApiDataService.post;
      url = insertUrl;
    }else{
      serverSet = ApiDataService.update;
      url = `${insertUrl}/update/${this.state.prod_gy_id}`;
    }

    serverSet(url, formData).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.props.errorMessage(response.data.result, "ERR-OBJ");
        } else {
          this.props.errorMessage(response.data.error_message, "ERR");
        }
      }else{
        this.props.errorMessage(response.data.error_message, "DONE");
        this.galleryrenderTable();
      }
    }).catch((error) => {
      console.log(error);
      this.props.errorMessage(error.message, "ERR");
    });
  }


  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        avatar: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }


  render(){

    const setValue = this.state;

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} style={{width:'100%'}}/>);
    } else {
      $imagePreview = (<div className="previewText"></div>);
    }

    let self = this;
    const url = `admin/portal/productinfo/gallery`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={ this.setModalShow }>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no', 
      'prod_gy_desc',
      'prod_gy_ordering',
      'prod_gy_active_yn',
      'prod_gy_image_path',
      'actions'
    ];
	
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        prod_gy_desc: 'Description',
        prod_gy_ordering: 'Ordering',
        prod_gy_active_yn: 'Active ?',
        prod_gy_image_path: 'Image',
        
      },
	    search_key: {
        prod_gy_desc: 'Description',
        prod_gy_ordering: 'Ordering',
        prod_gy_active_yn: 'Active ?'
      },
      sortable: ['prod_gy_desc'],
      requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order' },
      columnsAlign: { actions: 'center' },
      responseAdapter: function (resp_data) {
        self.setState({ page: resp_data.page });
        return { data: resp_data.result, total: resp_data.row_count }
      },
      texts: {
        show: ''
      }
    };


   
    
    
    return (
      <div>
        <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Gallery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={4}>
              <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                
                <Form.Row>          
                  <Col>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.prod_gy_desc} type="text" name="prod_gy_desc" placeholder="Description" />
                        {this.state.errors["prod_gy_desc"] &&
                          <span className='custError'>{this.state.errors["prod_gy_desc"]}</span>
                        }
                    </Form.Group>
                  </Col>
                </Form.Row> 

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Tooltip</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.prod_gy_tooltip} type="text" name="prod_gy_tooltip" placeholder="Tooltip" />
                        {this.state.errors["prod_gy_tooltip"] &&
                          <span className='custError'>{this.state.errors["prod_gy_tooltip"]}</span>
                        }
                    </Form.Group>
                  </Col>
                </Form.Row>
               

                 
                <Form.Group>
                  <Form.Label>Ordering</Form.Label>
                    <Form.Control onChange={this.stateChanges} value={setValue.prod_gy_ordering} type="text" name="prod_gy_ordering" placeholder="Ordering" />
                    {this.state.errors["prod_gy_ordering"] &&
                      <span className='custError'>{this.state.errors["prod_gy_ordering"]}</span>
                    }
                </Form.Group>
              
                <Form.Row>
                  <Col>
                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check onChange={this.stateChanges} checked={setValue.prod_gy_active_yn==='Y' ? true : false} type="checkbox" name="prod_gy_active_yn" label="Active" />
                    </Form.Group>
                  </Col>
                </Form.Row>

                <Form.Row>
                  <Col>   
                    <Form.Label>Image Upload</Form.Label>
                    <Form.Group>
                      <div className="previewComponent">
                        <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                        <div className="imgPreview">
                          {$imagePreview}
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Form.Row>

                <button type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.state.mode === 'IS' ? 'Save' : 'Update'}</button>
              </Form>
            </Col>

            <Col sm={8}>

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
                    <ServerTable renderView={this.state.galleryrenderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
                    {
                      function (row, column, index) {
                        switch (column) {
                            case 'sr_no':
                              return (
                                (index+1)+(PER_PAGE*((self.state.page)-1))
                              );
                            case 'prod_gy_image_path':
                              return (
                                <img src={row.prod_gy_image_path} width="50" className="table-image" alt="" />
                              );	
                            case 'actions':
                              return (
                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                  <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                  <Dropdown.Item onClick={() => self.editgalleryModalRecord(row.prod_gy_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                  <Dropdown.Item onClick={() => self.deletRecord(row.prod_gy_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
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

export default GalleryModal;