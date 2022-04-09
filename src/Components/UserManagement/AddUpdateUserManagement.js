import React, { Component } from 'react';
import './UserManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'; //formatPhoneNumber, formatPhoneNumberIntl, 
import 'react-phone-number-input/style.css'
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
const apiUrl = `admin/portal/user`;
const moment= require('moment') ;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};

class AddUpdateUserManagement extends Component {

	constructor(props) {		
		super(props);
		let $user_id = '';
		var $user_desc = '';
		let $user_locn_code = '';
		let $user_personal_code = '';
		let $user_pass_word = '';
		let $user_pass_word_change_yn = 'Y';
		let $isPasswordChangeChecked = 'checked';
		//let $isParentLovShowHide = 'd-sm-none';
		let $isPasswordTextShowHide = 'd-sm-block';
		let $user_email = '';
		let $user_office_phone = '';
		let $user_home_phone = '';
		let $user_cell_phone = '';
		let $user_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $user_upto_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $user_login_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $user_login_upto_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $user_pass_word_auth_code = '';
		let $user_type = '';	
		let $user_role = '';
		
		let $user_reset_pass_word_yn = 'N';
		let $isResetPasswordChecked = '';
		let $user_show_sale_price_yn = 'N';	
		let $isShowSalePriceChecked = '';
		let $user_global_yn = 'N';
		let $isGlobalChecked = '';
		let $user_global_access_yn = 'N';
		let $isGlobalAccessChecked = '';
		let $user_force_security_yn = 'N';
		let $isForceSecurityChecked = '';
		let $user_feedback_yn = 'N';
		let $isFeedbackChecked = '';
		let $user_session_expiry_yn = 'N';		
		let $isSessionExpiryChecked = '';
		
		let $user_active_yn = 'N';
		let $isActiveChecked = '';
		let $old_avatar = '';	
		if(props.users.return_status==="0"){			
			var $userObj = props.users.result[0];
			$user_id = $userObj.user_id;
			$user_desc = $userObj.user_desc;
			$user_locn_code = ($userObj.user_locn_code)?$userObj.user_locn_code:'';
			$user_personal_code = ($userObj.user_personal_code)?$userObj.user_personal_code:'';
			$user_pass_word = $userObj.user_pass_word;
			$user_pass_word_change_yn = $userObj.user_pass_word_change_yn;			
			$isPasswordChangeChecked = ($userObj.user_pass_word_change_yn==="Y")?"checked":"";
			//$isParentLovShowHide = ($userObj.user_parent_yn==="Y")?"d-sm-none":"d-block";
			$isPasswordTextShowHide = ($userObj.user_pass_word_change_yn==="Y")?"d-block":"d-block";
			$user_email = $userObj.user_email;
			$user_office_phone = $userObj.user_office_phone;
			$user_home_phone = $userObj.user_home_phone;
			$user_cell_phone = $userObj.user_cell_phone;			
			$user_from_date = moment($userObj.user_from_date, 'DD-MMM-YYYY').toDate();
			$user_upto_date = moment($userObj.user_upto_date, 'DD-MMM-YYYY').toDate();			
			$user_login_from_date = moment($userObj.user_login_from_date, 'DD-MMM-YYYY').toDate();
			$user_login_upto_date = moment($userObj.user_login_upto_date, 'DD-MMM-YYYY').toDate();
			$user_pass_word_auth_code = $userObj.user_pass_word_auth_code;
			$user_type = ($userObj.user_type)?$userObj.user_type:'';
			$user_role = ($userObj.user_role)?$userObj.user_role:'';			
			$user_reset_pass_word_yn = $userObj.user_reset_pass_word_yn;
			$isResetPasswordChecked = ($userObj.user_reset_pass_word_yn==="Y")?"checked":"";
			$user_show_sale_price_yn = $userObj.user_show_sale_price_yn;
			$isShowSalePriceChecked = ($userObj.user_show_sale_price_yn==="Y")?"checked":"";
			$user_global_yn = $userObj.user_global_yn;
			$isGlobalChecked = ($userObj.user_global_yn==="Y")?"checked":"";
			$user_global_access_yn = $userObj.user_global_access_yn;
			$isGlobalAccessChecked = ($userObj.user_global_access_yn==="Y")?"checked":"";
			$user_force_security_yn = $userObj.user_force_security_yn;
			$isForceSecurityChecked = ($userObj.user_force_security_yn==="Y")?"checked":"";
			$user_feedback_yn = $userObj.user_feedback_yn;
			$isFeedbackChecked = ($userObj.user_feedback_yn==="Y")?"checked":"";
			$user_session_expiry_yn = $userObj.user_session_expiry_yn;
			$isSessionExpiryChecked = ($userObj.user_session_expiry_yn==="Y")?"checked":"";
			$user_active_yn = $userObj.user_active_yn;
			$isActiveChecked = ($userObj.user_active_yn==="Y")?"checked":"";
			$old_avatar = $userObj.user_image;
		}
		
		this.state = {
			user_id: $user_id, //this.props.match.params.id
			user_desc: $user_desc,
			user_locn_code: $user_locn_code,
			user_personal_code: $user_personal_code,
			user_pass_word: $user_pass_word,
			user_pass_word_change_yn: $user_pass_word_change_yn,
			isPasswordChangeChecked: $isPasswordChangeChecked,			
			user_email: $user_email,
			user_office_phone: $user_office_phone,
			user_home_phone: $user_home_phone,
			user_cell_phone: $user_cell_phone,			
			user_from_date: $user_from_date,
			user_upto_date: $user_upto_date,
			user_login_from_date: $user_login_from_date,
			user_login_upto_date: $user_login_upto_date,
			user_pass_word_auth_code: $user_pass_word_auth_code,
			user_type: $user_type,
			user_role: $user_role,			
			user_reset_pass_word_yn: $user_reset_pass_word_yn,
			isResetPasswordChecked: $isResetPasswordChecked,
			user_show_sale_price_yn: $user_show_sale_price_yn,
			isShowSalePriceChecked: $isShowSalePriceChecked,
			user_global_yn: $user_global_yn,
			isGlobalChecked: $isGlobalChecked,
			user_global_access_yn: $user_global_access_yn,
			isGlobalAccessChecked: $isGlobalAccessChecked,
			user_force_security_yn: $user_force_security_yn,
			isForceSecurityChecked: $isForceSecurityChecked,
			user_feedback_yn: $user_feedback_yn,
			isFeedbackChecked: $isFeedbackChecked,
			user_session_expiry_yn: $user_session_expiry_yn,
			isSessionExpiryChecked: $isSessionExpiryChecked,
			user_active_yn: $user_active_yn,
			isActiveChecked: $isActiveChecked,
			avatar: '',
			old_avatar: $old_avatar,
			user_location: [],
			user_types: [],
			user_roles: [],			
			user_emp_codes: [],
			errors: {},			
			isPasswordTextShowHide: $isPasswordTextShowHide
		}
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);			
	}
	
	getDefaultSettingData(userID,searchLocation) {		
		let $url = `${apiUrl}/fetch/lovs?search_user=${userID}&search_location=${searchLocation}`;		
		ApiDataService.get($url)
		.then(res => {	
			if(res.data.return_status==="0"){	
				console.log('res.data - 1',res.data.result.location.result);
				
				let $user_location = []; 
				let $userLocnCodesDate = [];
				if(res.data.result.location.return_status==="0"){
					$user_location = res.data.result.location.result;
					$userLocnCodesDate.push({ value: "", label: "Select User Code" });
					for (var i = 0; i < $user_location.length;i++){
						$userLocnCodesDate.push({ value: $user_location[i].locn_code, label: $user_location[i].locn_desc, name:'user_locn_code' });
					}
				} 
				
				let $emp_codes = []; 
				let $userEmpCodesDate = [];
				if(res.data.result.employee_code.return_status==="0"){
					$emp_codes = res.data.result.employee_code.result;
					$userEmpCodesDate.push({ value: "", label: "Select User Code" });
					for (var emp = 0; emp < $emp_codes.length;emp++){
						$userEmpCodesDate.push({ value: $emp_codes[emp].emp_code, label: $emp_codes[emp].emp_code+' - '+$emp_codes[emp].emp_desc+' - '+$emp_codes[emp].reference, name:'user_personal_code' });
					}
				}
				
				this.setState({
					user_location: $userLocnCodesDate,
					user_types: res.data.result.type.result,
					user_roles: res.data.result.role.result,
					user_emp_codes: $userEmpCodesDate
				});
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});
	}
	
	handleChange(type,field_name,event) {		
		var name = '';
		var value = '';
		if(type==="mobile"){
			name = field_name;
			value = event;
		}else{
			name = (type==="lov")?event.name:event.target.name;
			value = (type==="lov")?event.value:event.target.value;
		}
		this.setState({
			[name]: value
		});
	}
		
	handleCheckboxChange(isChecked, event) {		
		const name = event.target.name;
		var value = event.target.value;
		value = (value==='Y')?'N':'Y';		
		let checkedAttr = (value==='Y')?'checked':'';
		let parentLovShowHide = (value==='Y')?'d-block':'d-block';
		this.setState({
			[name]: value,
			[isChecked]: checkedAttr,
			'isParentLovShowHide': parentLovShowHide
		});
	}
	
	handleDateChange(name, date) {
		if(moment(date).isValid()){
			this.setState({
				[name]: moment(date).toDate()
			});
		}
	}
	
	onFileChangeHandler (e) {		
		//const name = e.target.name;		
        this.setState({
            'avatar': e.target.files[0]
        });
	}
	
	userHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			//let userParentId = (this.state.user_parent_yn==="N" && this.state.user_parent_id!=="" && this.state.user_parent_id!=null)?this.state.user_parent_id:'';
			let $userId = this.state.user_id;
			fmData.append('user_id', $userId);
			fmData.append('user_desc', this.state.user_desc);
			fmData.append('user_locn_code', this.state.user_locn_code);
			fmData.append('user_personal_code', this.state.user_personal_code);
			fmData.append('user_pass_word', this.state.user_pass_word);
			fmData.append('user_pass_word_change_yn', this.state.user_pass_word_change_yn);
			fmData.append('user_email', this.state.user_email);			
			fmData.append('user_office_phone', this.state.user_office_phone);
			fmData.append('user_home_phone', this.state.user_home_phone);
			fmData.append('user_cell_phone', this.state.user_cell_phone);			
			
			let fromDateVar = moment(this.state.user_from_date);
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('user_from_date', newFromDateVar);
			
			let uptoDateVar = moment(this.state.user_upto_date);
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('user_upto_date', newUptoDateVar);
			
			let loginFromDateVar = moment(this.state.user_login_from_date);
			let newLoginFromDateVar = loginFromDateVar.format('DD-MMM-YYYY');
			fmData.append('user_login_from_date', newLoginFromDateVar);
			
			let loginUptoDateVar = moment(this.state.user_login_upto_date);
			let newLoginUptoDateVar = loginUptoDateVar.format('DD-MMM-YYYY');
			fmData.append('user_login_upto_date', newLoginUptoDateVar);
			
			fmData.append('user_pass_word_auth_code', this.state.user_pass_word_auth_code);
			fmData.append('user_type', this.state.user_type);
			fmData.append('user_role', this.state.user_role);
			
			fmData.append('user_reset_pass_word_yn', this.state.user_reset_pass_word_yn);
			fmData.append('user_show_sale_price_yn', this.state.user_show_sale_price_yn);
			fmData.append('user_global_yn', this.state.user_global_yn);
			fmData.append('user_global_access_yn', this.state.user_global_access_yn);
			fmData.append('user_force_security_yn', this.state.user_force_security_yn);
			fmData.append('user_feedback_yn', this.state.user_feedback_yn);
			fmData.append('user_session_expiry_yn', this.state.user_session_expiry_yn);
			fmData.append('user_active_yn', this.state.user_active_yn);
								
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);
			this.props.onFormSubmit(fmData,$userId);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.user_id) {
		  formIsValid = false
		  errors['user_id'] = '*Please enter user ID'
		}
		
		if (!this.state.user_desc) {
		  formIsValid = false
		  errors['user_desc'] = '*Please enter user description'
		}
		
		if (!this.state.user_locn_code) {
		  formIsValid = false
		  errors['user_locn_code'] = '*Please select user location'
		}
		if (!this.state.user_personal_code) {
		  formIsValid = false
		  errors['user_personal_code'] = '*Please select user personal code'
		}
		if (!this.state.user_type) {
		  formIsValid = false
		  errors['user_type'] = '*Please select user type'
		}
		if (!this.state.user_role) {
		  formIsValid = false
		  errors['user_role'] = '*Please select user role'
		}
		/*
		if (!this.state.user_pass_word) {
		  formIsValid = false
		  errors['user_pass_word'] = '*Please enter user password'
		}
		*/
		if (!this.state.user_type) {
		  formIsValid = false
		  errors['user_type'] = '*Please select user type'
		}
		
		if (!this.state.user_role) {
		  formIsValid = false
		  errors['user_role'] = '*Please select user role'
		}
		
		if (!this.state.user_email) {
		  formIsValid = false
		  errors['user_email'] = '*Please enter user email'
		}
		if (this.state.user_email) {
		  //regular expression for header_ordering validation
		  //const re = /^[0-9\b]+$/; //rules
		  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		  if (!pattern.test(this.state.user_email)) {
			formIsValid = false
			errors['user_email'] = '*Please enter valid email address'
		  }
		}
		
		if (!this.state.user_office_phone) {
		  formIsValid = false
		  errors['user_office_phone'] = '*Please enter user mobile number'
		}
		/*
		if (this.state.user_office_phone) {
		  //regular expression for header_ordering validation
		  const re = /^[0-9\b]+$/; //rules
		  if (!re.test(this.state.user_office_phone)) {
			formIsValid = false
			errors['user_office_phone'] = '*Please enter valid MOBILE number'
		  }
		}
		*/
		var dateFormat = 'DD-MM-YYYY';		
		if (!moment(moment(this.state.user_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['user_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.user_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['user_upto_date'] = '*Please enter upto date'
		}
		
		this.setState({ errors });
		return formIsValid;
	}
	
    componentWillMount(){
		this.getDefaultSettingData(this.state.user_personal_code,this.state.user_locn_code);
	}
    // componentDidMount(){}
    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
	userCodeSearch = (e)=>{
		console.log(e.target.value,"USE FOR API");		
		let $url = `${apiUrl}/fetch/employee_code?search_user=${e.target.value}`;
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){				
				let $user_emp_codes = [];
				let $userEmpCodesDate = [];				
				$user_emp_codes = res.data.result;
				$userEmpCodesDate.push({ value: "", label: "Select User Code" });
				for (var i = 0; i < $user_emp_codes.length;i++){
					$userEmpCodesDate.push({ value: $user_emp_codes[i].emp_code, label: $user_emp_codes[i].emp_code+' - '+$user_emp_codes[i].emp_desc+' - '+$user_emp_codes[i].reference, name:'user_personal_code' });
				}				
				this.setState({	user_emp_codes: $userEmpCodesDate });				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}			
		}).catch(function(error){
			if(error){ Config.createNotification('error',error); }
		})
	}
	
	userLocnSearch = (e)=>{
		console.log(e.target.value,"USE FOR API");		
		let $url = `${apiUrl}/fetch/location?search_location=${e.target.value}`;
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){				
				let $user_location = [];
				let $userLocnCodesDate = [];				
				$user_location = res.data.result;
				$userLocnCodesDate.push({ value: "", label: "Select User Location" });
				for (var i = 0; i < $user_location.length;i++){
					$userLocnCodesDate.push({ value: $user_location[i].locn_code, label: $user_location[i].locn_desc, name:'user_locn_code' });
				}				
				this.setState({	user_location: $userLocnCodesDate });				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}			
		}).catch(function(error){
			if(error){ Config.createNotification('error',error); }
		})
	}
	
	render() {		
		//let pageTitle = (this.state.user_id)?<h2>Edit Header</h2>:<h2>Add Header</h2>;
		const { user_location, user_types, user_roles, user_emp_codes } = this.state;
		let $props = this.props;	
		let select_personal_code = (this.state.user_personal_code)?this.state.user_personal_code:'';
		let select_locn_code = (this.state.user_locn_code)?this.state.user_locn_code:'';
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row>
						<Col xs={6}>
							<Form.Group controlId="user_id">
							<Form.Label>User Id</Form.Label>
								<Form.Control
								  type="text"
								  name="user_id"
								  value={(this.state.user_id)?this.state.user_id:''}
								  onChange={this.handleChange.bind(this,'text','')}
								  placeholder="User Id"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_id}</div>
						</Col>
					
						<Col xs={6}>
							<Form.Group controlId="user_desc">
							<Form.Label>User Desc</Form.Label>
								<Form.Control
								  type="text"
								  name="user_desc"
								  value={(this.state.user_desc)?this.state.user_desc:''}
								  onChange={this.handleChange.bind(this,'text','')}
								  placeholder="User Desc"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_desc}</div>
						</Col>
					</Row>
					<Row>
						<Col xs={6} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="user_locn_code">
								<Form.Label>User Location</Form.Label>								
								<div onKeyUp={(e) => this.userLocnSearch(e)}>
								  <Select
									value={user_location.filter(function (option) {
									  return option.value === select_locn_code;
									})}
									onChange={this.handleChange.bind(this,'lov','')}
									options={user_location}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>								
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_locn_code}</div>
						</Col>
						<Col xs={6} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="user_personal_code">
								<Form.Label>User Code</Form.Label>								
								<div onKeyUp={(e) => this.userCodeSearch(e)}>
								  <Select
									value={user_emp_codes.filter(function (option) {
									  return option.value === select_personal_code;
									})}
									onChange={this.handleChange.bind(this,'lov','')}
									options={user_emp_codes}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_personal_code}</div>
						</Col>
					</Row>
					<Row>
						<Col xs={6} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="user_type">
								<Form.Label>User Type</Form.Label>
								<select className="form-control" name="user_type" value={(this.state.user_type)?this.state.user_type:''} onChange={this.handleChange.bind(this,'text','')}>
									<option value="">Select Type</option>
									{user_types.map((data,i) => (
										<option value={data.code} key={i}>{data.desc}</option>
									))}
								</select>							
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_type}</div>
						</Col>
						<Col xs={6} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="user_role">
								<Form.Label>User Role</Form.Label>
								<select className="form-control" name="user_role" value={(this.state.user_role)?this.state.user_role:''} onChange={this.handleChange.bind(this,'text','')}>
									<option value="">Select Role</option>
									{user_roles.map((data,i) => (
										<option value={data.code} key={i}>{data.desc}</option>
									))}
								</select>							
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_role}</div>
						</Col>
					</Row>
					<Row>
						<Col xs={6}>
							<Form.Group controlId="user_pass_word_change_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_pass_word_change_yn)?this.state.user_pass_word_change_yn:''} 
									name="user_pass_word_change_yn"								  
								    checked={this.state.isPasswordChangeChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isPasswordChangeChecked') }
									id="user_pass_word_change_yn"
									label="Change Password ?"
									custom
								/>								
							</Form.Group>
						</Col>
						<Col xs={6}>
							<Form.Group controlId="user_desc">
							<Form.Label>User Password</Form.Label>
								<Form.Control
								  type="text"
								  name="user_pass_word"
								  value={(this.state.user_pass_word)?this.state.user_pass_word:''}
								  onChange={this.handleChange.bind(this,'text','')}
								  placeholder="User Password"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_pass_word}</div>
						</Col>						
					</Row>
					<Row>
						<Col xs={6}>	
							<Form.Group controlId="user_email">
								<Form.Label>User Email</Form.Label>
								<Form.Control
								  type="text"
								  name="user_email"
								  value={(this.state.user_email)?this.state.user_email:''}
								  onChange={this.handleChange.bind(this,'text','')}
								  placeholder="User Email" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_email}</div>
						</Col>
					
						<Col xs={6}>	
							<Form.Group controlId="user_office_phone">
								<Form.Label>Office Phone</Form.Label>
								<PhoneInput
								  className="form-control" 
								  international
								  countryCallingCodeEditable={true}
								  defaultCountry="AE"
								  value={(this.state.user_office_phone)?this.state.user_office_phone:''}
								  onChange={this.handleChange.bind(this,'mobile','user_office_phone')} 
								  placeholder="Enter office phone number"
								  error={this.state.user_office_phone ? (isValidPhoneNumber(this.state.user_office_phone) ? undefined : 'Invalid phone number') : 'Phone number required'} />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_office_phone}</div>
						</Col>
					</Row>
					<Row>
						<Col xs={6}>	
							<Form.Group controlId="user_home_phone">
								<Form.Label>Home Phone</Form.Label>
								<PhoneInput
								  className="form-control" 
								  international
								  countryCallingCodeEditable={true}
								  defaultCountry=""
								  value={(this.state.user_home_phone)?this.state.user_home_phone:''}
								  onChange={this.handleChange.bind(this,'mobile','user_home_phone')} 
								  placeholder="Enter office phone number"
								  error={this.state.user_home_phone ? (isValidPhoneNumber(this.state.user_home_phone) ? undefined : 'Invalid phone number') : 'Phone number required'} />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_home_phone}</div>
						</Col>
					
						<Col xs={6}>	
							<Form.Group controlId="user_cell_phone">
								<Form.Label>Cell Phone</Form.Label>
								<PhoneInput
								  className="form-control" 
								  international
								  countryCallingCodeEditable={true}
								  defaultCountry=""
								  value={(this.state.user_cell_phone)?this.state.user_cell_phone:''}
								  onChange={this.handleChange.bind(this,'mobile','user_cell_phone')} 
								  placeholder="Enter cell phone number"
								  error={this.state.user_cell_phone ? (isValidPhoneNumber(this.state.user_cell_phone) ? undefined : 'Invalid phone number') : 'Phone number required'} />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_cell_phone}</div>
						</Col>
					</Row>			
					<Row>
						<Col>
							<Form.Group controlId="user_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.user_from_date).toDate() }
									onChange={ this.handleDateChange.bind(this,'user_from_date') }
									value={ moment(this.state.user_from_date).toDate() }
									name="user_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="From Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="user_upto_date">
								<Form.Label>Upto Date</Form.Label>
								
								<DatePicker
									selected={ moment(this.state.user_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'user_upto_date') } 
									value={ moment(this.state.user_upto_date).toDate() }
									name="user_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="Upto Date" 
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_upto_date}</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group controlId="user_login_from_date">
								<Form.Label>Login From Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.user_login_from_date).toDate() }
									onChange={ this.handleDateChange.bind(this,'user_login_from_date') }
									value={ moment(this.state.user_login_from_date).toDate() }
									name="user_login_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="Login From Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_login_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="user_login_upto_date">
								<Form.Label>Login Upto Date</Form.Label>
								
								<DatePicker
									selected={ moment(this.state.user_login_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'user_login_upto_date') } 
									value={ moment(this.state.user_login_upto_date).toDate() }
									name="user_login_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="Login Upto Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.user_login_upto_date}</div>
						</Col>
					</Row>					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar">
								<Form.Label>User Image</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler}
								  placeholder="User Image"
								  ref={fileInput => this.fileInput = fileInput}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar}</div>
						</Col>
						{(this.state.old_avatar) && 
						<Col>
							<img src={this.state.old_avatar} width={80} height={80} alt={this.state.user_desc} />
						</Col>
						}
					</Row>
					<Row noGutters>
						<Col xs={4}>	
							<Form.Group controlId="user_reset_pass_word_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_reset_pass_word_yn)?this.state.user_reset_pass_word_yn:''} 
									name="user_reset_pass_word_yn"								  
								    checked={this.state.isRestPasswordChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isResetPasswordChecked') }
									id="user_reset_pass_word_yn"
									label="Reset Password ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>	
							<Form.Group controlId="user_show_sale_price_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_show_sale_price_yn)?this.state.user_show_sale_price_yn:''} 
									name="user_show_sale_price_yn"								  
								    checked={this.state.isShowSalePriceChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isShowSalePriceChecked') }
									id="user_show_sale_price_yn"
									label="Sale Price ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>	
							<Form.Group controlId="user_global_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_global_yn)?this.state.user_global_yn:''} 
									name="user_global_yn"								  
								    checked={this.state.isGlobalChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isGlobalChecked') }
									id="user_global_yn"
									label="Global User ?"
									custom
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row noGutters>
						<Col xs={4}>	
							<Form.Group controlId="user_global_access_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_global_access_yn)?this.state.user_global_access_yn:''} 
									name="user_global_access_yn"								  
								    checked={this.state.isGlobalAccessChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isGlobalAccessChecked') }
									id="user_global_access_yn"
									label="Global Access ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>	
							<Form.Group controlId="user_force_security_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_force_security_yn)?this.state.user_force_security_yn:''} 
									name="user_force_security_yn"								  
								    checked={this.state.isForceSecurityChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isForceSecurityChecked') }
									id="user_force_security_yn"
									label="Force Security ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>	
							<Form.Group controlId="user_feedback_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_feedback_yn)?this.state.user_feedback_yn:''} 
									name="user_feedback_yn"								  
								    checked={this.state.isFeedbackChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isFeedbackChecked') }
									id="user_feedback_yn"
									label="Feedback ?"
									custom
								/>
							</Form.Group>
						</Col>
					</Row>					
					<Row noGutters>
						<Col xs={4}>	
							<Form.Group controlId="user_session_expiry_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_session_expiry_yn)?this.state.user_session_expiry_yn:''} 
									name="user_session_expiry_yn"								  
								    checked={this.state.isSessionExpiryChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isSessionExpiryChecked') }
									id="user_session_expiry_yn"
									label="Session Expiry ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>	
							<Form.Group controlId="user_active_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.user_active_yn)?this.state.user_active_yn:''} 
									name="user_active_yn"								  
								    checked={this.state.isActiveChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
									id="user_active_yn"
									label="Active ?"
									custom
								/>
							</Form.Group>
						</Col>						
					</Row>
					<Form.Group>
						<Row noGutters>
							<Col xs={4}></Col>
							<Col xs={4} className="alignCenter">
								<Button onClick={this.userHandler} variant="success" type="submit">Save</Button>
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

export default AddUpdateUserManagement;