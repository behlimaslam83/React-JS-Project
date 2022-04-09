
import React, { Component } from 'react';
import './FilterType.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';


const insertUrl = 'admin/portal/filtertype';
const Api_Filterlov = 'admin/portal/filtertype/filter_type_lov';
const Api_Langlov = 'admin/portal/filtertype/lang/lov';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class FilterTypeModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      filter_active_yn:'N',
      filter_desc:'',
      filter_type:'',
      filter_ordering:'',
      errors: {},
      filter_id:'',
      filterlov: [],
      isValid : false,
      modalShow: false,
      langDrop: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setInput_value(){
    this.setState({
      filter_type:'',
      filter_desc:'',
      filter_ordering:'',
      filter_active_yn:'N',
      errors: {},
      mode: '',
    });
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

  

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show && !prevProps.show) {
      this.setInput_value();
        ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Filterlov)
        .then(response => {	
        this.setState({
              filterlov: response.data.result
            });
        }).catch(function(error){			
          
        });

        if(this.props.language != 'en'){
          ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Langlov, null).then(response => {
            let data = response.data.result;
            this.setState({
              langDrop: data
            });
          });
        }

    }  
  }


  editModalRecord=(id, desc, lang)=>{
    this.state.mode = 'UP';
    ApiDataService.get(`${insertUrl}/${id}/edit?language=` + lang).then(response => {
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
      });
    }).catch((error)=>{

    });

    this.setState({ desc: desc});

    
  }

 
  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	  if (name === 'filter_active_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }else{
      values = value;
    }
    this.setState({ [name]: values });
    console.log(this.state);
  }

  validation = () => {
    let fields = this.state;
    let errors={};
    let formIsValid = true;
	
    if (!fields["filter_desc"]) {
		errors["filter_desc"] = "Filter Type is required";
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
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }else{
      url = `${insertUrl}/update/${this.state.filter_id}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        }else{
          this.props.errorMessage(response.data.error_message, "DONE");
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }
   
  }

  filterDesc = (e) => {
	const { name, value } = e.target;
	let fields = this.state;
	let errors={};
	let formIsValid = true;

	ApiDataService.get(`${insertUrl}/filtersearch/${this.state.filter_type}/${value}`).then(response => {
		let resp = response.data.result[0];
		if(resp.row == 0){
			this.setState({ name: value, errors: errors, isValid : false });
			return formIsValid;
		}else{
			//this.setState({ name: '' });

			errors["filter_desc"] = "Filter already exists";
			formIsValid = false;
			this.setState({ errors: errors, isValid : true });
    		return formIsValid;
		}
		
	  }).catch((error)=>{
  
	  });
  }


 
  render(){

    const setValue = this.state;
    let {filterlov, langDrop} = this.state;
    
    return (
      <div>
        <Modal animation={false} size="sm" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Filter 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                <Form.Row>
                  <Col className={this.props.language == 'en' ? 'd-none' : ''}>
                    
                    <Form.Group> 
                      <Form.Label>Language</Form.Label>
                      <Form.Control as="select" value={setValue.language} name="language" onChange={this.stateChanges}>
                        <option>Select Language</option>
                        {langDrop.map((data,i) => (
                          <option value={data.code} key={i}>{data.desc}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group> 
                      <Form.Label>Filter Type</Form.Label>
                      <Form.Control as="select" value={setValue.filter_type} name="filter_type" onChange={this.stateChanges} disabled={this.props.language != 'en'}>
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
                      <Form.Label>Description</Form.Label>
                        <Form.Control onBlur={this.filterDesc} onChange={this.stateChanges} value={setValue.filter_desc} type="text" name="filter_desc" placeholder="Description" />
                        {this.state.errors["filter_desc"] &&
                          <span className='custError'>{this.state.errors["filter_desc"]}</span>
                        }
                    </Form.Group>
                  </Col>
				        </Form.Row>
                
                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Ordering</Form.Label>
                        <Form.Control  onChange={this.stateChanges} value={setValue.filter_ordering} type="text" name="filter_ordering" placeholder="Ordering" disabled={this.props.language != 'en'}/>
                        {this.state.errors["filter_ordering"] &&
                          <span className='custError'>{this.state.errors["filter_ordering"]}</span>
                        }
                    </Form.Group>
                  </Col>
				        </Form.Row>
								
                <Form.Row>
                  <Col>
                    <Form.Group controlId="formBasicCheckbox">
                    <Form.Label>Active ?</Form.Label>
                      <Form.Check onChange={this.stateChanges} checked={setValue.filter_active_yn==='Y' ? true : false} type="checkbox" name="filter_active_yn"/>
                    </Form.Group>
                  </Col>
                </Form.Row>
          
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

export default FilterTypeModal;