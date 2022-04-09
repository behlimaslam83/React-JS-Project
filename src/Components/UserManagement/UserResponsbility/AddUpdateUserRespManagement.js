import React, { Component } from 'react';
//import './UserManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import Config from '../Config';
const moment= require('moment') ;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
class AddUpdateUserRespManagement extends Component {
	constructor(props) {		
		super(props);
		let $userRespId = '';
		let $usrs_user_id = props.usrsUserId;		
		let $usrs_resp_code = '';
		let $isRespCodeChecked = '';
		var $usrs_desc = '';
		let $usrs_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $usrs_upto_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $usrs_active_yn = 'N';
		let $isActiveChecked = '';		
		if(props.responsbility.return_status==="0"){			
			var $userObj = props.responsbility.result[0];
			$userRespId = $userObj.usrs_resp_code;
			$usrs_user_id = $userObj.usrs_user_id;			
			$usrs_resp_code = ($userObj.usrs_resp_code)?$userObj.usrs_resp_code:'';
			$isRespCodeChecked = ($userObj.usrs_resp_code==="Y")?"checked":"";
			$usrs_desc = $userObj.usrs_desc;					
			$usrs_from_date = moment($userObj.usrs_from_date, 'DD-MMM-YYYY').toDate();
			$usrs_upto_date = moment($userObj.usrs_upto_date, 'DD-MMM-YYYY').toDate();			
			$usrs_active_yn = $userObj.usrs_active_yn;
			$isActiveChecked = ($userObj.usrs_active_yn==="Y")?"checked":"";
		}
		
		let $resp_lov = [];
		if(props.resp_lov.return_status==="0"){
			$resp_lov = props.resp_lov.result;			
		}
					
		this.state = {
			userRespId: $userRespId, 
			usrs_user_id: $usrs_user_id, //this.props.match.params.id			
			usrs_resp_code: $usrs_resp_code,
			isRespCodeChecked: $isRespCodeChecked,	
			usrs_desc: $usrs_desc,
			usrs_from_date: $usrs_from_date,
			usrs_upto_date: $usrs_upto_date,			
			usrs_active_yn: $usrs_active_yn,
			isActiveChecked: $isActiveChecked,
			resp_lov: $resp_lov,
			errors: {}
		}				
		this.handleChange = this.handleChange.bind(this);			
	}
	
	handleChange(event) {
		const name = event.target.name;
		var value = event.target.value;
		this.setState({
			[name]: value
		});
	}
				
	handleCheckboxChange(isChecked, event) {		
		const name = event.target.name;
		var value = event.target.value;
		value = (value==='Y')?'N':'Y';		
		let checkedAttr = (value==='Y')?'checked':'';
		this.setState({
			[name]: value,
			[isChecked]: checkedAttr
		});
	}
	
	handleDateChange(name, date) {
		if(moment(date).isValid()){
			this.setState({
				[name]: moment(date).toDate()
			});
		}
	}
		
	userRespHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			let $userRespCode = this.state.userRespId;
			fmData.append('usrs_user_id', this.state.usrs_user_id);			
			fmData.append('usrs_resp_code', this.state.usrs_resp_code);
			fmData.append('usrs_desc', this.state.usrs_desc);			
			let fromDateVar = moment(this.state.usrs_from_date);
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('usrs_from_date', newFromDateVar);			
			let uptoDateVar = moment(this.state.usrs_upto_date);
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('usrs_upto_date', newUptoDateVar);			
			fmData.append('usrs_active_yn', this.state.usrs_active_yn);			
			this.props.onFormRespSubmit(fmData,$userRespCode);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.usrs_user_id) {
		  formIsValid = false
		  errors['usrs_user_id'] = '*Please enter user ID'
		}
		
		if (!this.state.usrs_resp_code) {
		  formIsValid = false
		  errors['usrs_resp_code'] = '*Please select responsbility code'
		}
		
		if (!this.state.usrs_desc) {
		  formIsValid = false
		  errors['usrs_desc'] = '*Please enter responsbility description'
		}
				
		var dateFormat = 'DD-MM-YYYY';		
		if (!moment(moment(this.state.usrs_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['usrs_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.usrs_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['usrs_upto_date'] = '*Please enter upto date'
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
		//let pageTitle = (this.state.usrs_user_id)?<h2>Edit Header</h2>:<h2>Add Header</h2>;
		const { resp_lov } = this.state;
		let $props = this.props;		
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row>
						<Col xs={6}>
							<Form.Group controlId="usrs_user_id">
							<Form.Label>User Id</Form.Label>
								<Form.Control
								  type="text"
								  name="usrs_user_id"
								  value={(this.state.usrs_user_id)?this.state.usrs_user_id:''}
								  onChange={this.handleChange}
								  placeholder="User Id"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.usrs_user_id}</div>
						</Col>
						
						<Col xs={6} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="usrs_resp_code">
								<Form.Label>Responsbility Code</Form.Label>
								<select className="form-control" name="usrs_resp_code" value={(this.state.usrs_resp_code)?this.state.usrs_resp_code:''} onChange={this.handleChange}>
									<option value="">Select Code</option>
									{resp_lov.map((data,i) => (
										<option value={data.code} key={i}>{data.desc}</option>
									))}
								</select>							
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.usrs_resp_code}</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group controlId="usrs_desc">
							<Form.Label>Responsbility Description</Form.Label>
								<Form.Control
								  type="text"
								  name="usrs_desc"
								  value={(this.state.usrs_desc)?this.state.usrs_desc:''}
								  onChange={this.handleChange}
								  placeholder="User Desc"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.usrs_desc}</div>
						</Col>
					</Row>										
					<Row>
						<Col>
							<Form.Group controlId="usrs_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.usrs_from_date).toDate() }
									onChange={ this.handleDateChange.bind(this,'usrs_from_date') }
									value={ moment(this.state.usrs_from_date).toDate() }
									name="usrs_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="From Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.usrs_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="usrs_upto_date">
								<Form.Label>Upto Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.usrs_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'usrs_upto_date') } 
									value={ moment(this.state.usrs_upto_date).toDate() }
									name="usrs_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="Upto Date" 
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.usrs_upto_date}</div>
						</Col>
					</Row>							
					
					<Row noGutters>						
						<Col xs={4}>	
							<Form.Group controlId="usrs_active_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.usrs_active_yn)?this.state.usrs_active_yn:''} 
									name="usrs_active_yn"								  
								    checked={this.state.isActiveChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
									id="usrs_active_yn"
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
								<Button onClick={this.userRespHandler} variant="success" type="submit">Save</Button>
								&nbsp;&nbsp;&nbsp;
								<Button variant="secondary" onClick={$props.closeRespFormModal}>Close</Button>
							</Col>
							<Col xs={4}></Col>
						</Row>
					</Form.Group>
				</Form>
			</Container>
		);
	}
}

export default AddUpdateUserRespManagement;