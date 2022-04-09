
import React, { Component } from 'react';
import ReactExport from "react-data-export";
import * as XLSX from "xlsx";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './ProductInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import moment from 'moment';

const insertUrl = 'admin/portal/productinfo/';
const Api_countrylov = 'admin/portal/productinfo/country_access/list';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;



const multiDataSet = [
  {
    columns: [
        {title: "Currency", width: {wpx: 80}, editable: true},//pixels width 
        {title: "Product_Code", width: {wch: 15}},//char width 
        {title: "Product_Description", width: {wch: 40}},
        {title: "Price", width: {wpx: 90}},
        {title: "Offer_Price", width: {wpx: 90}},
        {title: "Offer_Pct", width: {wpx: 90}},
        {title: "Offer_From_Date", width: {wch: 20}},
        {title: "Offer_Upto_Date", width: {wch: 20}},
        {title: "Old_Price", width: {wpx: 90}},
    ],
    data: []
  }
];



class PriceModal extends Component {
  
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      priceModalShow: false,
      mode: '',
      product_desc: '',
      countrylov: [],
      countryValue : '',
      file: '',
      ccy_code : ''
    };

    this.handleClick = this.handleClick.bind(this);

  }
  setInput_value(){
    this.setState({
      countryValue : '',
      file: '',
      ccy_code: ''
    });
  }

  setModalShow = () => {
    this.setInput_value();
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show && !prevProps.show) {
      this.setInput_value();
      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_countrylov)
        .then(response => {	
          this.setState({
            countrylov: response.data.result
          });
      }).catch(function(error){			
        
      });
    }

    
  }
  
  PriceModalRecord=(id, desc)=>{
    this.setState({ mode: '', product_desc: ''});
  }

  convertToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

        var formData = new FormData();
        formData.append('key', JSON.stringify(result));

        ApiDataService.post('admin/portal/productinfo/excel', formData).then(response => {
          if (response.data.return_status !== "0") {
            if (response.data.error_message === 'Error') {
              this.props.errorMessage(response.data.result, "ERR-OBJ");
            } else {
              this.props.errorMessage(response.data.error_message, "ERR");
            }
          } else {
            this.props.errorMessage(response.data.error_message, "DONE");
            this.props.closeModal();
          }

        }).catch((error) => {
          this.props.errorMessage(error.message, "ERR");
        });
  }

  readFile() {
    var f = this.state.file;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      //console.log("Data>>>" + data);// shows that excel data is read
      this.convertToJson(data); // shows data in json format
    };
    reader.readAsBinaryString(f);
  }

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log(file);
    this.setState({ file });

    console.log(this.state.file);
  }


  stateChanges = (e) => {
    
    const { name, value } = e.target;

    if(name == 'country'){
      const ccy_code = e.target.selectedOptions[0].dataset.ccy_code;
      this.setState({ countryValue :  value, ccy_code: ccy_code });

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + insertUrl + 'products/'+ value + '/' + ccy_code)
        .then(response => {	
          
          Object.entries(response.data.result).forEach(([key, value]) => {
            multiDataSet[0].data[key] = [
                {value : value.ccy_code},
                {value : value.id},
                {value : value.desc},
                {value : value.price},
                {value : value.offer_price},
                {value : value.offer_pct},
                {value : value.from_date},
                {value : value.upto_date},
                {value : value.old_price}
              ];
          });

        }).catch(function(error){
          
      });
    }
  }

  render(){
    
    const {countrylov} = this.state;
    
    return (
      <div>
        <Modal animation={false} size="md" show={this.props.show} onHide={this.props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Price {this.state.product_desc != '' ? '('+this.state.product_desc+')'  : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Row>
                <Col sm={12}>
                  <Form.Group> 
                    <Form.Label>Country</Form.Label>
                    <Form.Control as="select"  name="country" required onChange={this.stateChanges}>
                      <option value="">Select Country</option>
                      {countrylov.map((data,i) => (
                        <option data-ccy_code={data.ccy_code} value={data.code} key={i}>{data.desc}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">Category is a required field</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {this.state.countryValue != '' && (      
                  <Col sm={12}> 
                    <Row>
                    <Col sm={8} className="mb-4">
                      <Form.Control type="file" id="file" ref="fileUploader" onChange={this.filePathset.bind(this)}/>
                    </Col>
                    <Col sm={4}>
                      <button onClick={() => { this.readFile(); }}> Upload File </button>
                    </Col>
                    </Row>
                    <Row>
                      <Col>
                       
                        <ExcelFile filename={`${'Product_Price_'+ this.state.ccy_code}`} element={<button>Export Excel</button>}>
                            <ExcelSheet dataSet={multiDataSet} name="Organization"/>
                        </ExcelFile>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>  
                
            </Col>

            
          </Row>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default PriceModal;