import React, { Component } from 'react';
import './HeaderManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Config from '../Config';
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
const moment= require('moment');
const apiUrl = `admin/portal/header`;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};
class AddUpdateHeaderManagement extends Component {

	constructor(props) {		
		super(props);
		let $header_id = '';
		var $header_desc = '';
		let $header_parent_yn = 'Y';
		let $isParentChecked = 'checked';
		//let $isParentLovShowHide = 'd-sm-none';
		let $isParentLovShowHide = 'd-sm-block';
		let $header_parent_id = '';
		let $header_ordering = 1;
		let $header_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $header_upto_date = moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();
		let $header_link_title = '';;
		let $header_link_url = '';		
		let $header_active_yn = 'N';
		let $isActiveChecked = '';
		let $langCode = 'en';
		let $old_avatar = '';
		let $hideLangField = props.hideLangField;
		let $hideDateField = 'd-sm-none';
		let $header_date_specific_yn = 'N';
		let $isDateShowChecked = '';
		if(props.headers.return_status==="0"){			
			var $headerObj = props.headers.result[0];
			$header_id = $headerObj.header_id;
			$header_desc = $headerObj.header_desc;
			$header_parent_yn = $headerObj.header_parent_yn;
			$isParentChecked = ($headerObj.header_parent_yn==="Y")?"checked":"";
			//$isParentLovShowHide = ($headerObj.header_parent_yn==="Y")?"d-sm-none":"d-block";
			$isParentLovShowHide = ($headerObj.header_parent_yn==="Y")?"d-block":"d-block";
			$header_parent_id = ($headerObj.header_parent_id)?$headerObj.header_parent_id:'';
			$header_ordering = ($headerObj.header_ordering)?$headerObj.header_ordering:$header_ordering;			
			$header_from_date = moment($headerObj.header_from_date, 'DD-MMM-YYYY').toDate();
			$header_upto_date = moment($headerObj.header_upto_date, 'DD-MMM-YYYY').toDate();			
			$header_link_title = ($headerObj.header_link_title!=="" && $headerObj.header_link_title!=="null")?$headerObj.header_link_title:"";
			$header_link_url = ($headerObj.header_link_url)?$headerObj.header_link_url:$header_link_url;			
			$header_active_yn = $headerObj.header_active_yn;
			$isActiveChecked = ($headerObj.header_active_yn==="Y")?"checked":"";
			$old_avatar = $headerObj.header_image_path;
			$langCode = $headerObj.lang_code;
			$header_date_specific_yn = $headerObj.header_date_specific_yn;
			$isDateShowChecked = ($headerObj.header_date_specific_yn==="Y")?"checked":"";
			$hideDateField = ($headerObj.header_date_specific_yn==="Y")?"d-block":"d-sm-none";
		}
		let $parent_headers = [];		
		let $languages = [];
		if(props.languages.return_status==="0"){
			$languages = props.languages.result;
		}	
		this.state = {
			header_id: $header_id, //this.props.match.params.id
			header_desc: $header_desc,
			header_parent_yn: $header_parent_yn,
			isParentChecked: $isParentChecked,			
			isParentLovShowHide: $isParentLovShowHide,
			header_parent_id: $header_parent_id,
			header_ordering: $header_ordering,			
			header_from_date: $header_from_date,
			header_upto_date: $header_upto_date,
			header_link_title: $header_link_title,
			header_link_url: $header_link_url,
			header_active_yn: $header_active_yn,
			isActiveChecked: $isActiveChecked,
			avatar: '',
			old_avatar: $old_avatar,			
			parent_headers: $parent_headers,
			languages: $languages,
			langCode: $langCode,
			hideLangField: $hideLangField,
			header_date_specific_yn: $header_date_specific_yn,
			isDateShowChecked: $isDateShowChecked,
			hideDateField: $hideDateField,
			errors: {}
		}				
		//this.handleChange = this.handleChange.bind(this);
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);	
	}
	
	handleChange(type,event) {
		const name = (type==="lov")?event.name:event.target.name;
		var value = (type==="lov")?event.value:event.target.value;
		this.setState({
			[name]: value
		});
		if(name==="header_parent_id"){
			let $fDate = (event.from_date)?event.from_date:moment(new Date(), 'DD-MMM-YYYY').toDate();;	
			let $uDate = (event.upto_date)?event.upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();
			this.setState({
				['header_from_date']: moment($fDate, 'DD-MMM-YYYY').toDate(),
				['header_upto_date']: moment($uDate, 'DD-MMM-YYYY').toDate()
			});		
		}
	}
	
	handleLanguageChange(event) {
		const name = event.target.name;
		var value = event.target.value;
		this.setState({
			[name]: value
		});		
		//this.getDefaultSettingData();
		let $url = `${apiUrl}/lang/${this.state.header_id}/edit`;
		ApiDataService.get($url,value)
		.then(res => {		
			if(res.data.return_status==="0"){
					this.setState({
						header_desc: res.data.result[0].header_desc,
						header_link_title: res.data.result[0].header_link_title,
						header_from_date: this.state.header_from_date,
						header_upto_date: this.state.header_upto_date,						
						header_link_url: this.state.header_link_url,
						langCode: this.state.lang_code,
						//hideLangField: 						
					});				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}	
		
	handleCheckboxChange(isChecked, event) {		
		const name = event.target.name;
		var value = event.target.value;
		value = (value==='Y')?'N':'Y';		
		let checkedAttr = (value==='Y')?'checked':'';
		let parentLovShowHide = (value==='Y')?'d-block':'d-block';
		let dateFieldsShowHide = (name==='header_date_specific_yn' && value==='Y')?'d-block':'d-sm-none';
		this.setState({
			[name]: value,
			[isChecked]: checkedAttr,
			['isParentLovShowHide']: parentLovShowHide,
			['hideDateField']: dateFieldsShowHide
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
            'avatar': e.target.files[0],
			'old_avatar': URL.createObjectURL(e.target.files[0])
        });
	}
	
	getDefaultSettingData() {
		let $url = `${apiUrl}/parent/fetch?header_id=${this.state.header_id}`;		
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){
				let $headers = [];
				let $headerDate = [];	
				$headers = res.data.result;			
				$headerDate.push({ value: "", label: "Select Parent Header", name:'header_parent_id', from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(), upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate() });
				for (var i = 0; i < $headers.length;i++){
					$headerDate.push({ value: $headers[i].parent_id, label: $headers[i].parent_desc, name:'header_parent_id', from_date:$headers[i].from_date, upto_date:$headers[i].upto_date });
				}
				this.setState({ parent_headers: $headerDate });
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});
	}
	
	headerHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			//let headerParentId = (this.state.header_parent_yn==="N" && this.state.header_parent_id!=="" && this.state.header_parent_id!=null)?this.state.header_parent_id:'';
			let headerParentId = (this.state.header_parent_id!=="" && this.state.header_parent_id!=null)?this.state.header_parent_id:'';
			fmData.append('header_desc', this.state.header_desc);
			fmData.append('header_parent_yn', this.state.header_parent_yn);
			fmData.append('header_parent_id', headerParentId);
			fmData.append('header_ordering', this.state.header_ordering);
			
			fmData.append('header_date_specific_yn', this.state.header_date_specific_yn);
			let fromDateVar = moment(this.state.header_from_date);
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('header_from_date', newFromDateVar);
			
			let uptoDateVar = moment(this.state.header_upto_date);
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('header_upto_date', newUptoDateVar);
			
			fmData.append('header_link_title', this.state.header_link_title);
			fmData.append('header_link_url', this.state.header_link_url);
			
			fmData.append('header_active_yn', this.state.header_active_yn);
			fmData.append('lang_code', this.state.langCode);
			let $headerId = this.state.header_id;
			fmData.append('header_id', $headerId);
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);
			this.props.onFormSubmit(fmData,$headerId);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.header_desc) {
		  formIsValid = false
		  errors['header_desc'] = '*Please enter header title'
		}
		
		if (this.state.header_parent_yn==='N') {
		  if (!this.state.header_parent_id) {
			formIsValid = false
			errors['header_parent_id'] = '*Please selecte parent header'
		  }
		}
		
		if (!this.state.header_ordering) {
		  formIsValid = false
		  errors['header_ordering'] = '*Please enter header order number'
		}
		
		if (this.state.header_ordering) {
		  //regular expression for header_ordering validation
		  const re = /^[0-9\b]+$/; //rules
		  if (!re.test(this.state.header_ordering)) {
			formIsValid = false
			errors['header_ordering'] = '*Please enter only number value'
		  }
		}
		
		var dateFormat = 'DD-MM-YYYY';
		if (!moment(moment(this.state.header_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['header_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.header_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['header_upto_date'] = '*Please enter upto date'
		}
		
		this.setState({ errors });
		return formIsValid;
	}
	
    componentWillMount(){
		this.getDefaultSettingData();
	}
    // componentDidMount(){}
    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
	
	keyupsearch = (e)=>{
		console.log(e.target.value,"USE FOR API");
	}
	
	render() {
		const { parent_headers, languages } = this.state;
		let $props = this.props;
		let select_parent_id = (this.state.header_parent_id)?this.state.header_parent_id:'';
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row noGutters>
						<Col xs={(this.state.langCode!=='en')?4:0} className={(this.state.langCode!=='en')?'':'d-sm-none'}>
							<Form.Group controlId="footer_parent_yn">
								<Form.Label>Language</Form.Label>
								<select className="form-control" name="footer_parent_id" value={this.state.footer_parent_id} onChange={this.handleLanguageChange}>
									{/* <option value="">Parent Footer</option> */}
									{languages.map((data,i) => (
										<option value={data.code} key={i}>{data.desc}</option>
									))}
								</select>								
							</Form.Group>							
						</Col>
						<Col xs={(this.state.langCode!=='en')?8:12}>
							<Form.Group controlId="header_desc">
							<Form.Label>Header Title</Form.Label>
								<Form.Control
								  type="text"
								  name="header_desc"
								  value={(this.state.header_desc)?this.state.header_desc:''}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Header Title"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_desc}</div>
						</Col>
					</Row>
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>
							<Form.Check
								type="checkbox" 
								value={(this.state.header_parent_yn)?this.state.header_parent_yn:''} 
								name="header_parent_yn"								  
								checked={this.state.isParentChecked}
								onChange={ this.handleCheckboxChange.bind(this,'isParentChecked') }
								id="header_parent_yn"
								label="Parent ?"
								custom
							/>							
						</Col>
						<Col xs={8} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="header_parent_id">
								<Form.Label>Parent Header</Form.Label>								
								<div onKeyUp={(e) => this.keyupsearch(e)}>
								  <Select
									value={parent_headers.filter(function (option) {
									  return option.value === select_parent_id;
									})}
									onChange={this.handleChange.bind(this,'lov')}
									options={parent_headers}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_parent_id}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="header_ordering">
								<Form.Label>Ordering</Form.Label>
								<Form.Control
								  type="text"
								  name="header_ordering"
								  value={(this.state.header_ordering)?this.state.header_ordering:''}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Ordering" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_ordering}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>	
							<Form.Group controlId="header_date_specific_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.header_date_specific_yn)?this.state.header_date_specific_yn:''} 
									name="header_date_specific_yn"								  
								    checked={this.state.isDateShowChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isDateShowChecked') }
									id="header_date_specific_yn"
									label="Change Date ?"
									custom
								/>
							</Form.Group>
						</Col>						
					</Row>
					
					<Row className={this.state.hideLangField+' '+this.state.hideDateField}>
						<Col>
							<Form.Group controlId="header_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.header_from_date).toDate() }
									onChange={ this.handleDateChange.bind(this,'header_from_date') }
									value={ moment(this.state.header_from_date).toDate() }
									name="header_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="header_upto_date">
								<Form.Label>Upto Date</Form.Label>
								<DatePicker
									selected={ moment(this.state.header_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'header_upto_date') } 
									value={ moment(this.state.header_upto_date).toDate() }
									name="header_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_upto_date}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="header_link_title">
								<Form.Label>Link Title</Form.Label>
								<Form.Control
								  type="text"
								  name="header_link_title"
								  value={(this.state.header_link_title)?this.state.header_link_title:''}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Title" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_link_title}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="header_link_url">
								<Form.Label>Link Url</Form.Label>
								<Form.Control
								  type="text"
								  name="header_link_url"
								  value={(this.state.header_link_url)?this.state.header_link_url:''}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Url" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.header_link_url}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar">
								<Form.Label>Header Icon</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler}
								  placeholder="Header Icon"
								  ref={fileInput => this.fileInput = fileInput}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
							</Form.Group>							
							<div className='errorMsg'>{this.state.errors.avatar}</div>
						</Col>
						{(this.state.old_avatar) && 
						<Col>
							<img src={this.state.old_avatar} width={80} height={80} alt={this.state.header_desc} />
						</Col>
						}
					</Row>
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>	
							<Form.Group controlId="header_active_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.header_active_yn)?this.state.header_active_yn:''} 
									name="header_active_yn"								  
									checked={this.state.isActiveChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
									id="header_active_yn"
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
								<Button onClick={this.headerHandler} variant="success" type="submit">Save</Button>
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

export default AddUpdateHeaderManagement;