import React, { Component } from 'react';
import './FooterManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
const moment= require('moment');
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const apiUrl = `admin/portal/footer`;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};
class AddUpdateFooterManagement extends Component {

	constructor(props) {		
		super(props);
		let $footer_id = '';
		var $footer_desc = '';
		let $footer_parent_yn = 'Y';
		let $isParentChecked = 'checked';
		//let $isParentLovShowHide = 'd-sm-none';
		let $isParentLovShowHide = 'd-block';
		let $footer_parent_id = '';
		let $footer_ordering = 1;
		let $footer_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $footer_upto_date = moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();	
		let $footer_link_title = '';
		let $footer_link_url = '';
		let $footer_active_yn = 'N';
		let $isActiveChecked = '';
		let $langCode = 'en';
		let $old_avatar = '';
		let $hideLangField = props.hideLangField;
		let $hideDateField = 'd-sm-none';
		let $footer_date_specific_yn = 'N';
		let $isDateShowChecked = '';
		if(props.footers.return_status==="0"){			
			var $footerObj = props.footers.result[0];
			$footer_id = $footerObj.footer_id;
			$footer_desc = $footerObj.footer_desc;
			$footer_parent_yn = $footerObj.footer_parent_yn;
			$isParentChecked = ($footerObj.footer_parent_yn==="Y")?"checked":"";
			//$isParentLovShowHide = ($footerObj.footer_parent_yn==="Y")?"d-sm-none":"d-block";
			$isParentLovShowHide = ($footerObj.footer_parent_yn==="Y")?"d-block":"d-block";
			$footer_parent_id = ($footerObj.footer_parent_id)?$footerObj.footer_parent_id:'';
			$footer_ordering = ($footerObj.footer_ordering)?$footerObj.footer_ordering:$footer_ordering;
			$footer_from_date = moment($footerObj.footer_from_date, 'DD-MMM-YYYY').toDate();
			$footer_upto_date = moment($footerObj.footer_upto_date, 'DD-MMM-YYYY').toDate();
			$footer_link_title = ($footerObj.footer_link_title!=="" && $footerObj.footer_link_title!=="null")?$footerObj.footer_link_title:"";
			$footer_link_url = ($footerObj.footer_link_url)?$footerObj.footer_link_url:$footer_link_url;
			$footer_active_yn = $footerObj.footer_active_yn;
			$isActiveChecked = ($footerObj.footer_active_yn==="Y")?"checked":"";
			$old_avatar = $footerObj.footer_image_path;
			$langCode = $footerObj.lang_code;
			$footer_date_specific_yn = $footerObj.footer_date_specific_yn;
			$isDateShowChecked = ($footerObj.footer_date_specific_yn==="Y")?"checked":"";
			$hideDateField = ($footerObj.footer_date_specific_yn==="Y")?"d-block":"d-sm-none";
		}
		let $parent_footers = [];			
		let $languages = [];
		if(props.languages.return_status==="0"){
			$languages = props.languages.result;			
		}	
		this.state = {
			footer_id: $footer_id, //this.props.match.params.id
			footer_desc: $footer_desc,
			footer_parent_yn: $footer_parent_yn,
			isParentChecked: $isParentChecked,
			isParentLovShowHide: $isParentLovShowHide,
			footer_parent_id: $footer_parent_id,
			footer_ordering: $footer_ordering,			
			footer_from_date: $footer_from_date,
			footer_upto_date: $footer_upto_date,
			footer_link_title: $footer_link_title,
			footer_link_url: $footer_link_url,
			footer_active_yn: $footer_active_yn,
			isActiveChecked: $isActiveChecked,			
			avatar: '',
			old_avatar: $old_avatar,			
			parent_footers: $parent_footers,
			languages: $languages,
			langCode: $langCode,
			hideLangField: $hideLangField,
			footer_date_specific_yn: $footer_date_specific_yn,
			isDateShowChecked: $isDateShowChecked,
			hideDateField: $hideDateField,
			errors: {}
		}
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.onFileChangeHandler = this.onFileChangeHandler.bind(this);	
	}
	
	handleChange(type,event) {
		const name = (type==="lov")?event.name:event.target.name;
		var value = (type==="lov")?event.value:event.target.value;
		this.setState({
			[name]: value
		});
		if(name==="footer_parent_id"){
			let $fDate = (event.from_date)?event.from_date:moment(new Date(), 'DD-MMM-YYYY').toDate();;	
			let $uDate = (event.upto_date)?event.upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();
			this.setState({
				['footer_from_date']: moment($fDate, 'DD-MMM-YYYY').toDate(),
				['footer_upto_date']: moment($uDate, 'DD-MMM-YYYY').toDate()
			});		
		}
	}
	
	handleLanguageChange(event) {
		const name = event.target.name;
		var value = event.target.value;
		this.setState({
			[name]: value
		});
		let $url = `${apiUrl}/lang/${this.state.footer_id}/edit`;
		ApiDataService.get($url,value)
		.then(res => {		
			if(res.data.return_status==="0"){
					this.setState({
						footer_desc: res.data.result[0].footer_desc,
						footer_link_title: res.data.result[0].footer_link_title,
						footer_from_date: this.state.footer_from_date,
						footer_upto_date: this.state.footer_upto_date,						
						footer_link_url: this.state.footer_link_url,
						langCode: this.state.lang_code		
					});				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}
	
	getDefaultSettingData() {
		//if (this._isMounted){
			let $url = `${apiUrl}/parent/fetch?footer_id=${this.state.footer_id}`;		
			ApiDataService.get($url)
			.then(res => {			
				if(res.data.return_status==="0"){	
					let $footers = [];
					let $footerDate = [];	
					$footers = res.data.result;			
					$footerDate.push({ value: "", label: "Select Parent Header", name:'footer_parent_id', from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(), upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate() });
					for (var i = 0; i < $footers.length;i++){
						$footerDate.push({ value: $footers[i].parent_id, label: $footers[i].parent_desc, name:'footer_parent_id', from_date:$footers[i].from_date, upto_date:$footers[i].upto_date });
					}
					this.setState({ parent_footers: $footerDate });
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		//}
	}
	
	handleCheckboxChange(isChecked, event) {		
		const name = event.target.name;
		var value = event.target.value;
		value = (value==='Y')?'N':'Y';		
		let checkedAttr = (value==='Y')?'checked':'';
		let parentLovShowHide = (value==='Y')?'d-block':'d-block';
		let dateFieldsShowHide = (name==='footer_date_specific_yn' && value==='Y')?'d-block':'d-sm-none';
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
        this.setState({
            'avatar': e.target.files[0],
			'old_avatar': URL.createObjectURL(e.target.files[0])
        });
	}
	
	footerHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			//let footerParentId = (this.state.footer_parent_yn==="N" && this.state.footer_parent_id!=="" && this.state.footer_parent_id!=null)?this.state.footer_parent_id:'';
			let footerParentId = (this.state.footer_parent_id!=="" && this.state.footer_parent_id!=null)?this.state.footer_parent_id:'';
			fmData.append('footer_desc', this.state.footer_desc);
			fmData.append('footer_parent_yn', this.state.footer_parent_yn);
			fmData.append('footer_parent_id', footerParentId);
			fmData.append('footer_ordering', this.state.footer_ordering);
			fmData.append('footer_date_specific_yn', this.state.footer_date_specific_yn);
			let fromDateVar = moment(this.state.footer_from_date);			
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('footer_from_date', newFromDateVar);
			
			let uptoDateVar = moment(this.state.footer_upto_date);			
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('footer_upto_date', newUptoDateVar);
			
			fmData.append('footer_link_title', this.state.footer_link_title);
			fmData.append('footer_link_url', this.state.footer_link_url);
			
			fmData.append('footer_active_yn', this.state.footer_active_yn);
			fmData.append('lang_code', this.state.langCode);			
			let $footerId = this.state.footer_id;
			fmData.append('footer_id', $footerId);
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);
			this.props.onFormSubmit(fmData,$footerId);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.footer_desc) {
		  formIsValid = false
		  errors['footer_desc'] = '*Please enter footer title'
		}
		
		if (this.state.footer_parent_yn==='N') {
		  if(!this.state.footer_parent_id){
			formIsValid = false
			errors['footer_parent_id'] = '*Please select parent footer'
		  }
		}
		
		if (!this.state.footer_ordering) {
		  formIsValid = false
		  errors['footer_ordering'] = '*Please enter footer order number'
		}
		
		if (this.state.footer_ordering) {
		  //regular expression for footer_ordering validation
		  const re = /^[0-9\b]+$/; //rules
		  if (!re.test(this.state.footer_ordering)) {
			formIsValid = false
			errors['footer_ordering'] = '*Please enter only number value'
		  }
		}	
		
		var dateFormat = 'DD-MM-YYYY';		
		if (!moment(moment(this.state.footer_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['footer_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.footer_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['footer_upto_date'] = '*Please enter upto date'
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
		const { parent_footers, languages } = this.state;
		let $props = this.props;		
		let select_parent_id = (this.state.footer_parent_id)?this.state.footer_parent_id:'';
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
							<Form.Group controlId="footer_desc">
							<Form.Label>Footer Title</Form.Label>
								<Form.Control
								  type="text"
								  name="footer_desc"
								  value={this.state.footer_desc}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Footer Title"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_desc}</div>
						</Col>
					</Row>
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>							
							<Form.Check
								type="checkbox" 
								value={(this.state.footer_parent_yn)?this.state.footer_parent_yn:''} 
								name="footer_parent_yn"								  
								checked={this.state.isParentChecked}
								onChange={ this.handleCheckboxChange.bind(this,'isParentChecked') }
								id="footer_parent_yn"
								label="Parent ?"
								custom
							/>							
						</Col>
						<Col xs={8} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="footer_parent_yn">
								<Form.Label>Parent Footer</Form.Label>								
								<div onKeyUp={(e) => this.keyupsearch(e)}>
								  <Select
									value={parent_footers.filter(function (option) {
									  return option.value === select_parent_id;
									})}
									onChange={this.handleChange.bind(this,'lov')}
									options={parent_footers}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_parent_id}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="footer_ordering">
								<Form.Label>Ordering</Form.Label>
								<Form.Control
								  type="text"
								  name="footer_ordering"
								  value={this.state.footer_ordering}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Ordering" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_ordering}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>	
							<Form.Group controlId="footer_date_specific_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.footer_date_specific_yn)?this.state.footer_date_specific_yn:''} 
									name="footer_date_specific_yn"								  
								    checked={this.state.isDateShowChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isDateShowChecked') }
									id="footer_date_specific_yn"
									label="Change Date ?"
									custom
								/>
							</Form.Group>
						</Col>						
					</Row>
					
					<Row className={this.state.hideLangField+' '+this.state.hideDateField}>
						<Col>
							<Form.Group controlId="footer_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ this.state.footer_from_date }
									onChange={ this.handleDateChange.bind(this,'footer_from_date') }
									value={ moment(this.state.footer_from_date).toDate() }
									name="footer_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
									placeholder="From Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="footer_upto_date">
								<Form.Label>Upto Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.footer_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'footer_upto_date') }
									value={ moment(this.state.footer_upto_date).toDate() }
									name="footer_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control" 
									placeholder="Upto Date"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_upto_date}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="footer_link_title">
								<Form.Label>Link Title</Form.Label>
								<Form.Control
								  type="text"
								  name="footer_link_title"
								  value={this.state.footer_link_title}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Title" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_link_title}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="footer_link_url">
								<Form.Label>Link Url</Form.Label>
								<Form.Control
								  type="text"
								  name="footer_link_url"
								  value={this.state.footer_link_url}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Url" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.footer_link_url}</div>
						</Col>
					</Row>
					
					<Row>
						<Col>	
							<Form.Group controlId="avatar">
								<Form.Label>Footer Icon</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler}
								  placeholder="Footer Icon"
								  ref={fileInput => this.fileInput = fileInput}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar}</div>
						</Col>
						{(this.state.old_avatar) && 
						<Col>
							<img src={this.state.old_avatar} width={80} height={80} alt={this.state.footer_desc} />
						</Col>
						}
					</Row>
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>							
							<Form.Check
								type="checkbox" 
								value={(this.state.footer_active_yn)?this.state.footer_active_yn:''} 
								name="footer_active_yn"								  
								checked={this.state.isActiveChecked}
								onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
								id="footer_active_yn"
								label="Active ?"
								custom
							/>							
						</Col>						
					</Row>							
					<Form.Group>						
						<Row noGutters>
							<Col xs={4}></Col>
							<Col xs={4} className="alignCenter">
								<Button onClick={this.footerHandler} variant="success" type="submit">Save</Button>
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

export default AddUpdateFooterManagement;