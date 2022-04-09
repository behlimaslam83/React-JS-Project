import React, { Component } from 'react';
import './CountryManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ApiDataService from '../../services/ApiDataService';
//import Config from '../Config';
const moment= require('moment') ;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const apiUrl = `admin/portal/country`;
class AddUpdateCountryManagement extends Component {

	constructor(props) {		
		super(props);
		let $country_id = '';
		var $country_iso = '';
		let $country_desc = '';		
		let $country_ccy_code = '';
		let $country_ccy_symbol = '';
		let $country_ccy_exch_rate = '';
		let $country_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $country_upto_date = moment(new Date(), 'DD-MMM-YYYY').toDate();		
		let $country_active_yn = 'N';
		let $isActiveChecked = '';
		let $old_avatar = '';	
		if(props.countries.return_status==="0"){		
			var $countryObj = props.countries.result[0];
			$country_id = $countryObj.country_iso;
			$country_iso = $countryObj.country_iso;
			$country_desc = $countryObj.country_desc;
			$country_ccy_code = $countryObj.country_ccy_code;
			$country_ccy_symbol = $countryObj.country_ccy_symbol;
			$country_ccy_exch_rate = $countryObj.country_ccy_exch_rate;
			$country_from_date = moment($countryObj.country_from_date, 'DD-MMM-YYYY').toDate();
			$country_upto_date = moment($countryObj.country_upto_date, 'DD-MMM-YYYY').toDate();
			$country_active_yn = $countryObj.country_active_yn;
			$isActiveChecked = ($countryObj.country_active_yn==="Y")?"checked":"";
			$old_avatar = $countryObj.country_image_path;			
		}
					
		this.state = {
			country_id: $country_id, //this.props.match.params.id
			country_iso: $country_iso,
			country_desc: $country_desc,
			country_ccy_code: $country_ccy_code,			
			country_ccy_symbol: $country_ccy_symbol,
			country_ccy_exch_rate: $country_ccy_exch_rate,			
			country_from_date: $country_from_date,
			country_upto_date: $country_upto_date,			
			country_active_yn: $country_active_yn,
			isActiveChecked: $isActiveChecked,
			avatar: '',
			old_avatar: $old_avatar,
			errors: {}
		}
				
		this.handleChange = this.handleChange.bind(this);		
		this.handleActiveCheckboxChange = this.handleActiveCheckboxChange.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
		this.handleFromDateChange = this.handleFromDateChange.bind(this);
		this.handleUptoDateChange = this.handleUptoDateChange.bind(this);
		this.handleCheckIOSKeyup = this.handleCheckIOSKeyup.bind(this);
	}
	
	handleChange(event) {
		const name = event.target.name;
		var value = event.target.value;
		this.setState({
			[name]: value
		})
	}
			
	handleActiveCheckboxChange(event) {
		const name = event.target.name;
		var value = event.target.value;	
		if(value==='Y'){
			value = 'N';			
		}else{
			value = 'Y';			
		}		
		
		let activeChecked = (value==='Y')?'checked':'';
		//this.setState({['isActiveChecked']: activeChecked});
						
		this.setState({
			[name]: value,
			'isActiveChecked': activeChecked
		})
	}
	
	handleFromDateChange(date) {
		if(moment(date).isValid()){
			this.setState({
				'country_from_date': moment(date).toDate()
			});
		}
	}
	
	handleUptoDateChange(date) {
		if(moment(date).isValid()){
			this.setState({
				'country_upto_date': moment(date).toDate()
			});
		}
	}
	
	onFileChangeHandler (e) {		
		//const name = e.target.name;		
        this.setState({
            'avatar': e.target.files[0],
			'old_avatar': URL.createObjectURL(e.target.files[0])
        });
	}
	
	handleCheckIOSKeyup (e) {		
		//const value = e.target.value;		
        //alert(value);		
		const fmData = new FormData();
		//let $iso = this.state.country_iso;
		fmData.append('country_iso', e.target.value);
		
		let $url = `${apiUrl}/checkDuplicateIso`;
		let errors = {}
		let formIsValid = true;
		ApiDataService.post($url,fmData)
		.then(res => {			
			if(res.data.return_status!=="0"){				
				formIsValid = false
				errors['country_iso'] = res.data.error_message;
			}
			this.setState({ errors });
			return formIsValid;
		}).catch(function(error){			
			formIsValid = false
			errors['country_iso'] = error;
			this.setState({ errors });
			return formIsValid;
	    });		
	}
	
	countryHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();
			let $iso = this.state.country_iso;
			fmData.append('country_iso', $iso);
			fmData.append('country_desc', this.state.country_desc);
			fmData.append('country_ccy_code', this.state.country_ccy_code);
			fmData.append('country_ccy_symbol', this.state.country_ccy_symbol);
			fmData.append('country_ccy_exch_rate', this.state.country_ccy_exch_rate);
			let fromDateVar = moment(this.state.country_from_date);
			//let newFromDateVar = fromDateVar.utc().format('DD-MMM-YYYY');
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('country_from_date', newFromDateVar);
			
			let uptoDateVar = moment(this.state.country_upto_date);
			//let newUptoDateVar = uptoDateVar.utc().format('DD-MMM-YYYY');
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('country_upto_date', newUptoDateVar);
			
			fmData.append('country_active_yn', this.state.country_active_yn);
			let $countryId = this.state.country_id;
			fmData.append('countryId', $countryId);
					
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);
			this.props.onFormSubmit(fmData,$countryId);
		}		
	}
	
	validateForm = () => {		
		let errors = {}
		let formIsValid = true;		
		if (!this.state.country_iso) {
		  formIsValid = false
		  errors['country_iso'] = '*Please enter country ISO Code'
		}else if(this.state.errors.country_iso){
			formIsValid = false;
			errors['country_iso'] = this.state.errors.country_iso;
		}		
		
		if(!this.state.country_desc){
			formIsValid = false
			errors['country_desc'] = '*Please enter country description'
		}		
		
		/*if (this.state.footer_desc) {
		  if (!this.state.footer_desc.match(/^\w+$/)) {
			formIsValid = false
			errors['footer_desc'] = '*Please use alphanumeric characters only'
		  }
		}*/
		
		if (!this.state.country_ccy_code) {
		  formIsValid = false
		  errors['country_ccy_code'] = '*Please enter country currency code'
		}
		
		if (!this.state.country_ccy_symbol) {
		  formIsValid = false
		  errors['country_ccy_symbol'] = '*Please enter country currency symbol'
		}
		
		
		if (!this.state.country_ccy_exch_rate) {
		  formIsValid = false
		  errors['country_ccy_exch_rate'] = '*Please enter country exchange rate'
		}
		
		if (this.state.country_ccy_exch_rate) {
		  //regular expression for footer_ordering validation
		  const re = /^[0-9.\b]+$/; //rules
		  if (!re.test(this.state.country_ccy_exch_rate)) {
			formIsValid = false
			errors['country_ccy_exch_rate'] = '*Please enter only number value'
		  }
		}
		//alert(this.state.country_from_date)
		var dateFormat = 'DD-MM-YYYY';
		
		if (!moment(moment(this.state.country_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['country_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.country_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['country_upto_date'] = '*Please enter upto date'
		}
						
		this.setState({ errors });
		return formIsValid;
	}
	
    // componentWillMount(){}
    // componentDidMount(){}
    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
	
	render() {
		//console.log('this.state',this.state);	
		//let pageTitle =(this.state.country_id)?<h2>Edit Country</h2>:<h2>Add Country</h2>;

		//const { country_iso, country_desc, country_ccy_code, country_ccy_symbol, country_ccy_exch_rate, country_from_date, country_upto_date, country_active_yn, avatar} = this.state;
		let $props = this.props;
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row noGutters>
						<Col>
							<Form.Group controlId="country_iso">
							<Form.Label>Country IOS</Form.Label>
								<Form.Control
								  type="text"
								  name="country_iso"
								  value={ (this.state.country_iso)?this.state.country_iso:"" }
								  onKeyUp={this.handleCheckIOSKeyup} 
								  onChange={this.handleChange} 							  
								  placeholder="Country IOS"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_iso}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="country_desc">
								<Form.Label>Country Description</Form.Label>
								<Form.Control
								  type="text"
								  name="country_desc"
								  value={ (this.state.country_desc)?this.state.country_desc:"" }
								  onChange={this.handleChange}
								  placeholder="Country Description" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_desc}</div>
						</Col>
					</Row>
					
					<Row>
						<Col>
							<Form.Group controlId="country_ccy_code">
								<Form.Label>Country Currency Code</Form.Label>
								<Form.Control
								  type="text"
								  name="country_ccy_code"
								  value={ (this.state.country_ccy_code)?this.state.country_ccy_code:"" }
								  onChange={this.handleChange}
								  placeholder="Country Currency Code" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_ccy_code}</div>
						</Col>
						<Col>
							<Form.Group controlId="country_ccy_symbol">
								<Form.Label>Country Currency Symbol</Form.Label>
								<Form.Control
								  type="text"
								  name="country_ccy_symbol"
								  value={ (this.state.country_ccy_symbol)?this.state.country_ccy_symbol:"" }
								  onChange={this.handleChange}
								  placeholder="Country Currency Symbol" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_ccy_symbol}</div>
						</Col>
					</Row>
					
					<Row>
						<Col>	
							<Form.Group controlId="country_ccy_exch_rate">
								<Form.Label>Exchange Rate</Form.Label>
								<Form.Control
								  type="text"
								  name="country_ccy_exch_rate"
								  value={ (this.state.country_ccy_exch_rate)?this.state.country_ccy_exch_rate:"" }
								  onChange={this.handleChange}
								  placeholder="Exchange Rate" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_ccy_exch_rate}</div>
						</Col>
						
						<Col>	
							<Form.Group controlId="avatar">
								<Form.Label>Country Flag</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler}
								  placeholder="Country Flag"
								  ref={fileInput => this.fileInput = fileInput}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar}</div>
						</Col>
						{(this.state.old_avatar) && 
							<Col>
								<img src={this.state.old_avatar} width={80} height={80} alt="Icon" />
							</Col>
						}					
					</Row>
					<Row>
						<Col>
							<Form.Group controlId="country_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ this.state.country_from_date }
									onChange={ this.handleFromDateChange }
									value={ (this.state.country_from_date)?this.state.country_from_date:"" }
									name="country_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="country_upto_date">
								<Form.Label>Upto Date</Form.Label>
								
								<DatePicker
									selected={ this.state.country_upto_date } 
									onChange={ this.handleUptoDateChange }
									value={ (this.state.country_upto_date)?this.state.country_upto_date:"" }
									name="country_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.country_upto_date}</div>
						</Col>				
					</Row>								
					
					<Row noGutters>
						<Col xs={4}>	
							<Form.Group controlId="country_active_yn">
								<Form.Label className="checkbox_label mr-2">Active ?</Form.Label>
								<Form.Control
								  type="checkbox" 								  
								  name="country_active_yn"								  
								  checked={this.state.isActiveChecked}
								  value={ (this.state.country_active_yn)?this.state.country_active_yn:"" }
								  onChange={this.handleActiveCheckboxChange}
								  placeholder="Active ?"
								  className="checkbox_input" />
							</Form.Group>
						</Col>						
					</Row>							
					<Form.Group>
						<Row noGutters>
							<Col xs={4}></Col>
							<Col xs={4} className="alignCenter">
								<Button onClick={this.countryHandler} variant="success" type="submit">Save</Button>
								&nbsp;&nbsp;&nbsp;
								<Button variant="secondary" onClick={$props.closeModal}>Close</Button>
							</Col>
							<Col xs={4}></Col>
						</Row>
					</Form.Group>
				</Form>
			</Container>
		);
	}
}

export default AddUpdateCountryManagement;