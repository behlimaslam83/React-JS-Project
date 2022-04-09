
import React, { Component } from 'react';
import './ItemInfo.scss';
import { useForm, Controller } from "react-hook-form";
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import DatePicker from "react-datepicker";
import moment from 'moment';


const insertUrl = 'admin/portal/iteminfo/price';
const api_country_lov = 'admin/portal/iteminfo/country_lov';
const api_item_product = 'admin/portal/iteminfo/item_product';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;
const Inputwidth = { width: '100%' };

class PriceModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      ccy_code: '',
      currency:'',
      price:'',
      old_price:'',
      offer_price: '', 
      offer_yn: 'N',
      active_yn:'Y',
      offer_pct: '',
      from_dt: '',
      upto_dt: '',
      price_band: '',
      errors: {},
      item_info_id:'',
      country_lov: [],
      item_product:[],
      selectedFlag: [],
      set:[],
      modalShow: false,
      priceModalShow: false,
      mode: '',
      dataview: [],
      totaldata: '',
      snapopen: false,
      snapcolor: '',
      error: '',
      deletedialog: false,
      proceed: false,
      priceRenderTable:false,
      page: 1,
      from_date: new Date(),
      upto_date: new Date() 
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalRef = React.createRef();
    this.pricemodalRef = React.createRef();
  }

  
 
  setModalShow = () => {
    this.setState({
      priceModalShow: true,
      mode: 'IS'
    });
  }

  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ priceModalShow: false });
  }

  priceRenderTable = () => {
    this.setState({ priceRenderTable:true
    },() => {
      this.setState({ 
        priceRenderTable: false        
       });
    });
  }

  editRecord=(id)=>{
    this.modalRef.current.editModalRecord(id);
    this.setState({ modalShow: true,mode: 'UP' });
  }


  deletRecord = (product, id) => {
    this.setState({ deletedialog: true, item_info_id: id, product_code: product});
  }

  proceedDelete = (params) => {
    if (params) {
      this.deleteModalRecord(this.state.product_code, this.state.item_info_id);
    }else{

    }

  }

  deleteModalRecord = (product,id)=>{
    ApiDataService.delete(`${insertUrl}/${product}/`,id).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.errorThrough(response.data.result, "ERR-OBJ");
        } else {
          this.errorThrough(response.data.error_message, "ERR");
        }
      } else {
        this.errorThrough(response.data.error_message, "DONE");
        this.priceRenderTable();
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
    ApiDataService.get(process.env.REACT_APP_SERVER_URL + api_country_lov)
			.then(response => {	
			  this.setState({
          country_lov: response.data.result
        });
    }).catch(function(error){			
      
    });

    

  }

  
  priceModalRecord=(id)=>{
    ApiDataService.get(process.env.REACT_APP_SERVER_URL + api_item_product + '/' + id)
    .then(response => {	
      this.setState({
        item_product: response.data.result
      });
    }).catch(function(error){			
      
    });

    this.setState({ item_info_id : id, mode: ''});
  }

  editpriceModalRecord=(id, ccy_code, product)=>{
    this.state.mode = 'UP';
    var flag = [];
    var setIndex = [];
    ApiDataService.get(`${insertUrl}/${id}/${ccy_code}/${product}/edit`).then(response => {
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        if (key == 'from_dt') {
          this.setState({ from_dt: value != '' ? moment(value, 'DD-MMM-YYYY').toDate() : '', from_date: value })
        } else if (key == 'upto_dt') {
          this.setState({ upto_dt: value != '' ? moment(value, 'DD-MMM-YYYY').toDate() : '', upto_date: value })
        }else if (key === 'applicable_countries') {

          this.state.country_lov.forEach(function (val, key) {
            value.filter(function (e) {
              if (e == val.ref_iso) {
                setIndex[key] = Number(key);
                flag[key] = val.ref_iso;
              }
            });
          });

          this.setState({
            set: setIndex,
            selectedFlag: flag,
          })
        } else {
          this.setState({ [key]: value });

        }


        
         
      });
    }).catch((error)=>{

    });
    
  }


  stateChanges = (e) => {
    const { name, value } = e.target;
    var values = '';
	  if (name === 'offer_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'active_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }else{
      values = value;
    }
    this.setState({ [name]: values });
  }
  
  validation = () => {
    let formIsValid = true;
    return formIsValid;
  }
  
  handleSubmit(event) {
    console.log(event);
    event.preventDefault();
    if(!this.validation()){
      return false;
    }

    
    console.log('dfdfdfsdfsdfsdfdsfsd');
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
      url = insertUrl;
      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        }else{
          this.errorThrough(response.data.error_message, "DONE");
          this.priceRenderTable();
          //this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });
    }else{
     // serverSet = ApiDataService.update;
      url = `${insertUrl}/update/${this.state.item_info_id}/${this.state.ccy_code}/${this.state.product_code}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        }else{
          this.errorThrough(response.data.error_message, "DONE");
          this.priceRenderTable();
          //this.props.closeModal();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });
    }
    
  }

  changeDate = (data, mode) => {
    var format = moment(data).format('DD-MMM-YYYY');
   // var end_format = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
  
    if (mode == 'FD') {
      this.setState({ from_dt: data, from_date: format })
    }
    if (mode == 'UD') {
      this.setState({ upto_dt: data, upto_date: format })
    }
   
  }

  selectFlag = (e, ind, param) => {
    let checkFlagExist = this.state.selectedFlag;
    let checkActive = this.state.set;

    if (checkFlagExist.indexOf(param) != -1) {
      checkFlagExist.splice(checkFlagExist.indexOf(param), 1);
      checkActive[ind] = 'N';
    } else {
      checkFlagExist.push(param);
      checkActive[ind] = ind;
    }
    this.setState({
      set: checkActive,
      selectedFlag: checkFlagExist
    });
    console.log(this.state);
  }

  render(){

    const setValue = this.state;
    let {country_lov, item_product} = this.state;
    let self = this;
    const url = `admin/portal/iteminfo/price`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={ this.setModalShow }>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no', 
      'product_desc',
      'ccy_code',
      'price',			
      'old_price',
      'offer_yn',
      'active_yn',
      'actions'
    ];
	
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        product_desc: 'Product',
        ccy_code: 'Currency',
        price: 'Price',			
        old_price: 'Old Price',
        offer_yn: 'Offer Y/N',
        from_dt: 'From Date',
        upto_dt: 'Upto Date',
        active_yn: 'Active ?',
        
      },
      search_key: {
        product_desc: 'Product',
        ccy_code: 'Currency',
        price: 'Price',
        old_price: 'Old Price',
        offer_yn: 'Offer Y/N',
        from_dt: 'From Date',
        upto_dt: 'Upto Date',
        active_yn: 'Active ?',
      },
      sortable: ['product_desc', 'ccy_code', 'price', 'old_price', 'offer_yn', 'from_dt', 'upto_dt', 'active_yn'],
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


    let theis = this;
    return (
      <div>
        <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Price
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className={this.state.mode === '' ? "d-none" : 'col-sm-4'}>
              <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                <Form.Row>
                  <Col>
                    <Form.Group> 
                      <Form.Label>Currency</Form.Label>
                        <Form.Control as="select" value={setValue.currency} name="currency" onChange={this.stateChanges}>
                        <option>Select Currency</option>
                        {country_lov.map((data,i) => (
                          <option value={data.currency_code} key={i} >{`${data.iso_code} - ${data.desc}`}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Form.Row> 

                <Form.Row>          
                <Col>
                  <Form.Group> 
                    <Form.Label>Product</Form.Label>
                      <Form.Control as="select" value={setValue.product_code} name="product_code" onChange={this.stateChanges}>
                        <option>Select Product</option>
                        {item_product.map((data,i) => (
                          <option value={data.code} key={i}>{data.desc}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                </Col>

                
              </Form.Row>

                <Form.Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.price} type="text" name="price" placeholder="Price" />
                        {this.state.errors["price"] &&
                          <span className='custError'>{this.state.errors["price"]}</span>
                        }
                    </Form.Group>
                  </Col>            
                  
                    <Col>
                      <Form.Group>
                        <Form.Label>Price Band</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.price_band} type="text" name="price_band" placeholder="Price Band" />
                        {this.state.errors["price_band"] &&
                          <span className='custError'>{this.state.errors["price_band"]}</span>
                        }
                      </Form.Group>
                    </Col>

                  </Form.Row>

                  <Form.Row>
                    <Col>
                      {/* <Form.Group>
                        <Form.Label>Service Applicable Countries</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.service_countries} type="text" name="service_countries" placeholder="Old Price" />
                        {this.state.errors["service_countries"] &&
                          <span className='custError'>{this.state.errors["service_countries"]}</span>
                        }
                      </Form.Group> */}

                      <div className="countryParent">
                        {country_lov.map(function (data, index) {
                          return (
                            <div title={data.desc} key={index} onClick={(e) => theis.selectFlag(e, index, data.ref_iso)} className={`countryFlag ${setValue.set != '' ? setValue.set[index] === index ? 'activeFlag' : '' : ''}`}>
                              <img alt={data.ref_iso} src={data.image_path} />
                              <span className="flagName"> {data.ref_iso}</span>
                            </div>
                          )
                        })
                        }
                      </div>
                    </Col>

                  </Form.Row>


                  <Form.Row>
                    <Col className="text-rigth">
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Label>Offer ?</Form.Label>
                        <Form.Check onChange={this.stateChanges} checked={setValue.offer_yn === 'Y' ? true : false} type="checkbox" name="offer_yn" />
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row className={setValue.offer_yn !== 'Y' ? 'd-none' : ''}>
                    <Col md={9}>
                      <Form.Group>
                        <Form.Label>Offer Price</Form.Label>
                          <Form.Control onChange={this.stateChanges} value={setValue.offer_price} type="text" name="offer_price" placeholder="Offer Price" />
                          {this.state.errors["offer_price"] &&
                            <span className='custError'>{this.state.errors["offer_price"]}</span>
                          }
                      </Form.Group>
                    </Col>            
                
                      <Col md={3}>
                      <Form.Group>
                        <Form.Label>Offer Pct</Form.Label>
                          <Form.Control onChange={this.stateChanges} value={setValue.offer_pct} type="text" name="offer_pct" placeholder="%" />
                          {this.state.errors["offer_pct"] &&
                            <span className='custError'>{this.state.errors["offer_pct"]}</span>
                          }
                      </Form.Group>
                    </Col>            
                  </Form.Row>
                  
                
                  <Form.Row className={setValue.offer_yn !== 'Y' ? 'd-none' : ''}>
                  <Col>
                    <Form.Group>
                      <Form.Label>Old Price</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.old_price} type="text" name="old_price" placeholder="Old Price" />
                        {this.state.errors["old_price"] &&
                          <span className='custError'>{this.state.errors["old_price"]}</span>
                        }
                    </Form.Group>
                  </Col>

                  </Form.Row>

                  <Form.Row className={setValue.offer_yn !== 'Y' ? 'd-none' : ''}>
                    <Col>
                      <Form.Group>
                        <Form.Label>From Date</Form.Label>
                        <DatePicker selected={setValue.from_dt} className="form-control form-control-sm" name="from_dt" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'FD')} />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Upto Date</Form.Label>

                        <DatePicker selected={setValue.upto_dt} className="form-control form-control-sm" name="upto_dt" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'UD')} />
                      </Form.Group>
                    </Col>

                  </Form.Row>

          
                  <Form.Row>

                  <Col className="text-rigth">
                    <Form.Group controlId="formBasicCheckbox">
                    <Form.Label>Active ?</Form.Label>
                        <Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn"/>
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
                    <ServerTable renderView={this.state.priceRenderTable} columns={columns} url={`${url + `?item_info_id=` + this.state.item_info_id}`} options={options} addme={$button} bordered hover updateUrl>
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
                            <Dropdown.Item onClick={() => self.editpriceModalRecord(row.item_code, row.ccy_code, row.product_code)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => self.deletRecord(row.product_code, row.item_code)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
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

export default PriceModal;