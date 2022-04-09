
import React, { Component } from 'react';
import './Showroom.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from 'prop-types';

const insertUrl = 'admin/portal/showroom';
const Api_Countrylov = 'admin/portal/showroom/country_access/list';
const Api_Langlov = 'admin/portal/showroom/lang/lov';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class ShowroomModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      active_yn:'Y',
      address_desc: '',
      city_name: '',
      address_title: '',
      phone_no: '',
      manager_email_id: '',
      latitude: '',
      longitude: '',
      geo_location: '',
      locn_code: '',
      ordering: '',
      shipping_yn: 'N',
      distr_centre_yn: 'N',
      click_collect_yn:'N',
      scn_iso:'',
      avtar:'',
      errors: {},
      id:'',
      countrylov: [],
      isValid : false,
      modalShow: false,
      imagePreviewUrl: '',
      editor: EditorState.createEmpty(),
      editorHTML: '',
      editorState: '',
      language: 'en',
      langDrop:[]
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    editorState: PropTypes.instanceOf(EditorState),
    onEditorStateChange: PropTypes.func
  }


  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ modalShow: false });
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

  setform_input() {
    this.setState({
      active_yn: 'Y',
      city_name: '',
      address_title: '',
      phone_no: '',
      manager_email_id: '',
      latitude: '',
      longitude: '',
      geo_location: '',
      locn_code: '',
      ordering: '',
      shipping_yn: 'N',
      distr_centre_yn: 'N',
      click_collect_yn: 'N',
      scn_iso: '',
      errors: {},
      id: '',
      editorHTML: '',
      editorState: '',
      language: 'en',
      langDrop: []
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show && !prevProps.show) {
      this.setform_input();
      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Countrylov)
        .then(response => {
          this.setState({ countrylov: response.data.result });
        }).catch(function (error) {
        
        });
      if (this.props.language != 'en') {
        ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Langlov, null).then(response => {
          let data = response.data.result;
          this.setState({
            langDrop: data
          });
        });
      }
    }
  }

  editModalRecord = (id, desc, lang) => {
    this.state.mode = 'UP';
    ApiDataService.get(`${insertUrl}/${id}/edit?language=` + lang).then(response => {
     
      let resp = response.data.result[0];
      
      Object.entries(resp).forEach(([key, value]) => {
        if (key === 'address_desc') {
          this.setState({ value, editorState: ShowroomModal.generateEditorStateFromValue(value) })
        }
        this.setState({ [key]: value });
      });

      this.setState({ sysid: id, product_desc: desc, language: lang });

    }).catch((error)=>{

    });
    
    
  }

 
  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	  if (name === 'active_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'shipping_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'distr_centre_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'click_collect_yn') {
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
	
    if (!fields["city_name"]) {
		errors["city_name"] = "City Name is required";
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

    let Properties = this.state;
    for (var key in Properties) {
      formData.append(key, Properties[key]);
    }
	var serverSet = '';
    var url = '';
	  if (this.props.mode==='IS'){
      url = insertUrl;
      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        }else{
          this.props.errorMessage(response.data.error_message, "DONE");
          this.props.renderTable();
          this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }else{
      url = `${insertUrl}/update/${this.state.id}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        }else{
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

 

  _imageChange(e) {
    e.preventDefault();

    if(e.target.name == 'image'){
      let reader = new FileReader();
      let image_path = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          avatar : image_path,
          imagePreviewUrl: reader.result
        });
      }
      reader.readAsDataURL(image_path);

    }
  }


  onEditorStateChange = editorState => {
    console.log(editorState)
    this.setState(
      {
        editorState,
        address_desc: draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        )
      }
    )
  }


  static generateEditorStateFromValue(value) {
    const contentBlock = htmlToDraft(value || '')
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    )
    return EditorState.createWithContent(contentState)
  }

  render(){

    const setValue = this.state;
    let { countrylov, imagePreviewUrl, langDrop} = this.state;

    let $imagePreview = (<div className="previewText"><center><img className="imgWidth" src={this.state.no_image_path}/></center></div>);

    let $imagePreviewUrl =   imagePreviewUrl ? (<center><img className="imgWidth" src={imagePreviewUrl} /></center>) : $imagePreview;
    
    return (
      <div>
        <Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
              Showroom {this.state.address_title ? this.state.address_title : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                <Form.Row>
                    <Col className={this.state.language == 'en' ? 'd-none' : ''}>

                      <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as="select" value={setValue.language} name="language" onChange={this.stateChanges}>
                          <option>Select Language</option>
                          {langDrop.map((data, i) => (
                            <option value={data.code} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.address_title} type="text" name="address_title" placeholder="Title" />
                        {this.state.errors["address_title"] &&
                          <span className='custError'>{this.state.errors["address_title"]}</span>
                      }
                    </Form.Group>
                  </Col>
                
                    <Col className={this.state.language == 'ar' ? 'd-none' : ''}>
                    <Form.Group> 
                      <Form.Label>Country</Form.Label>
                        <Form.Control as="select" value={setValue.scn_iso} name="scn_iso" onChange={this.stateChanges}>
                          <option>Select Country</option>
                        {countrylov.map((data,i) => (
                          <option value={data.ref_cn_iso} key={i}>{data.desc}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row> 
                  <Form.Row className={this.state.language == 'ar' ? 'd-none' : ''}>
                    <Col>
                      <Form.Group>
                        <Form.Label>Ordering</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.ordering} type="text" name="ordering" placeholder="Ordering" />
                        {this.state.errors["ordering"] &&
                          <span className='custError'>{this.state.errors["ordering"]}</span>
                        }
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.phone_no} type="text" name="phone_no" placeholder="Phone Number" />
                        {this.state.errors["phone_no"] &&
                          <span className='custError'>{this.state.errors["phone_no"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col className={this.state.language == 'ar' ? 'd-none' : ''}>
                      <Form.Group>
                        <Form.Label>Google Location</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.geo_location} type="text" name="geo_location" placeholder="Google Location" />
                        {this.state.errors["geo_location"] &&
                          <span className='custError'>{this.state.errors["geo_location"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  
                    <Col className={this.state.language == 'ar' ? 'd-none' : ''}>
                      <Form.Group>
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.latitude} type="text" name="latitude" placeholder="Latitude" />
                        {this.state.errors["latitude"] &&
                          <span className='custError'>{this.state.errors["latitude"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  
                    <Col className={this.state.language == 'ar' ? 'd-none' : ''}>
                      <Form.Group>
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.longitude} type="text" name="longitude" placeholder="Longitude" />
                        {this.state.errors["longitude"] &&
                          <span className='custError'>{this.state.errors["longitude"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  </Form.Row>
                
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.city_name} type="text" name="city_name" placeholder="City Name" />
                        {this.state.errors["city_name"] &&
                          <span className='custError'>{this.state.errors["city_name"]}</span>
                        }
                    </Form.Group>
                  </Col>
				        </Form.Row>
                
				
                  <Form.Row className={this.state.language == 'ar' ? 'd-none' : ''}>
                  <Col>
                    <Form.Group controlId="formBasicCheckbox">
                    <Form.Label>Active ?</Form.Label>
                      <Form.Check onChange={this.stateChanges} checked={setValue.active_yn==='Y' ? true : false} type="checkbox" name="active_yn"/>
                    </Form.Group>
                  </Col>
                    
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Label>Shipping Y/N ?</Form.Label>
                        <Form.Check onChange={this.stateChanges} checked={setValue.shipping_yn === 'Y' ? true : false} type="checkbox" name="shipping_yn" />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Label>Click & Collect Y/N ?</Form.Label>
                        <Form.Check onChange={this.stateChanges} checked={setValue.click_collect_yn === 'Y' ? true : false} type="checkbox" name="click_collect_yn" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Label>Distr Centre Y/N ?</Form.Label>
                        <Form.Check onChange={this.stateChanges} checked={setValue.distr_centre_yn === 'Y' ? true : false} type="checkbox" name="distr_centre_yn" />
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  
                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Feature
                        </Form.Label>
                        <Editor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange} required />

                        <Form.Control.Feedback type="invalid">Feature is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                
                  {/* <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Image Upload</Form.Label>
                    <Form.Control type="file" name="image" onChange={(e)=>this._imageChange(e)} />
                      <div className="previewComponent">
                        <div className="imgPreview">
                          {$imagePreviewUrl}
                        </div>
                      </div>
                  </Form.Group> */}

                <button type="submit" disabled={this.state.isValid} className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
              </Form>
            </Col>

		      </Row>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default ShowroomModal;