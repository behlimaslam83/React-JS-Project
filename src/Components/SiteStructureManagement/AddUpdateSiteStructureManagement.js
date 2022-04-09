import React, { Component } from 'react';
import './SiteStructureManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ApiDataService from '../../services/ApiDataService';
import Config from '../Config';
import Select from 'react-select';
const moment= require('moment');
const apiUrl = `admin/portal/structure`;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};

class AddUpdateSiteStructureManagement extends Component {
	constructor(props) {		
		super(props);
		var $struc_id = '';
		var $struc_desc = '';
		let $struc_page_name = '';		
		let $struc_section = '';
		let $struc_slug_url = '';
		let $struc_compo_id = '';
		let $struc_ordering = '';
		let $struc_time = '';
		let $struc_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $struc_upto_date = moment(new Date(), 'DD-MMM-YYYY').toDate();		
		let $struc_active_yn = 'N';
		let $isActiveChecked = '';
		let $struc_preview_yn = 'Y';
		let $isPreviewChecked = 'checked';
		let $isSlugUrlShow = false;
		let $slug_urls = [];
		let $sections = [];
		let $components = [];
		let $siteUrl = '';
		
		let $pages = [];
		let $pageDate = [];		
		if(props.pages.return_status==="0"){
			$pages = props.pages.result;			
			$pageDate.push({ value: "", label: "Select Page" });
			for (var i = 0; i < $pages.length;i++){
				$pageDate.push({ value: $pages[i].id, label: $pages[i].desc, name:'struc_page_name' });
			}			
		}
		
		//let $sections = [];
		//if(props.sections.return_status==="0"){
			//$sections = props.sections.result;
		//}
		
		//let $components = [];
		//if(props.components.return_status==="0"){
			//$components = props.components.result;
		//}		
		
		if(props.structures.return_status==="0"){			
			var $siteObj = props.structures.result[0];
			$struc_id = $siteObj.struc_id;
			$struc_desc = $siteObj.struc_desc;
			$struc_page_name = $siteObj.struc_page_name;
			$struc_section = ($siteObj.struc_section!=="" && $siteObj.struc_section!==null)?$siteObj.struc_section:'';
			$struc_slug_url = ($siteObj.struc_slug_url!=="" && $siteObj.struc_slug_url!==null)?$siteObj.struc_slug_url:'';
			$struc_compo_id = $siteObj.struc_compo_id;
			$struc_ordering = $siteObj.struc_ordering;
			$struc_time = ($siteObj.struc_time!=="" && $siteObj.struc_time!==null)?$siteObj.struc_time:'';			
			$struc_from_date = moment($siteObj.struc_from_date, 'DD-MMM-YYYY').toDate();
			$struc_upto_date = moment($siteObj.struc_upto_date, 'DD-MMM-YYYY').toDate();
			$struc_active_yn = $siteObj.struc_active_yn;
			$isActiveChecked = ($siteObj.struc_active_yn==="Y")?"checked":"";
			$struc_preview_yn = $siteObj.struc_preview_yn;
			$isPreviewChecked = ($siteObj.struc_preview_yn==="Y")?"checked":"";	
			$isSlugUrlShow = ($siteObj.struc_slug_url!=="")?true:false;
			$siteUrl = $siteObj.url;
		}
							
		this.state = {
			struc_id: $struc_id, //this.props.match.params.id
			struc_desc: $struc_desc,
			struc_page_name: $struc_page_name,
			struc_section: $struc_section,
			struc_slug_url: $struc_slug_url,
			struc_compo_id: $struc_compo_id,
			struc_ordering: $struc_ordering,
			struc_time: $struc_time,
			struc_from_date: $struc_from_date,
			struc_upto_date: $struc_upto_date,			
			struc_active_yn: $struc_active_yn,
			isActiveChecked: $isActiveChecked,
			struc_preview_yn: $struc_preview_yn,
			isPreviewChecked: $isPreviewChecked,
			isSlugUrlShow: $isSlugUrlShow,
			siteUrl: $siteUrl,
			pages: $pageDate,
			slug_urls: $slug_urls,
			sections: $sections,
			components: $components,
			errors: {}
		}
		if(this.state.struc_id){
			this.fetchLOVDate('struc_slug_url',this.state.struc_slug_url);		
		}		
	}
	
	handleChange(type,event) {
		console.log('event',event);
		var name = (type==='lov')?event.name:event.target.name;
		var value = (type==='lov')?event.value:event.target.value;
		this.setState({ [name]: value });	
		if(name==="struc_page_name" || name==="struc_slug_url"){
			this.fetchLOVDate(name,value);
		}else if(name==="struc_section"){
			let $fDate = (event.from_date)?event.from_date:new Date();	
			let $uDate = (event.upto_date)?event.upto_date:new Date();
			this.setState({
				['struc_from_date']: moment($fDate, 'DD-MMM-YYYY').toDate(),
				['struc_upto_date']: moment($uDate, 'DD-MMM-YYYY').toDate()
			});		
		}else if(name==="struc_compo_id"){
			let $url = `${apiUrl}/preview_before_save?page_name=${this.state.struc_page_name}&section=${this.state.struc_section}&component=${value}`;
			ApiDataService.get($url)
			.then(res => {			
				if(res.data.return_status==="0"){				
					this.setState({	siteUrl: res.data.result.url });				
				}else{
					Config.createNotification('warning',res.data.error_message);
				}			
			}).catch(function(error){
				if(error){ Config.createNotification('error',error); }
			})
		}
	}
			
	handleDateChange(name, date) {
		if(moment(date).isValid()){
			this.setState({
				[name]: moment(date).toDate()
			});
		}
	}
	
	fetchLOVDate = (name,value) => {
		let $url = `${apiUrl}/page_dependent?page_name=${value}`;
		if(name==="struc_slug_url"){			
			$url = `${apiUrl}/page_dependent?page_name=${this.state.struc_page_name}&slug_url=${value}`;
			this.setState({ struc_section:'' });
		}else{
			this.setState({ struc_slug_url:'', struc_section:'' });
		}			
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.section.return_status==="0"){
				let $sections = [];
				let $sectionDate = [];
				$sections = res.data.section.result;			
				$sectionDate.push({ value: "", label: "Select Section", name:'struc_section', from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(), upto_date:moment(new Date(), 'DD-MMM-YYYY').toDate() });
				for (var i = 0; i < $sections.length;i++){
					$sectionDate.push({ value: $sections[i].id, label: $sections[i].desc, name:'struc_section', from_date:$sections[i].from_date, upto_date:$sections[i].upto_date });
				}
				//this.setState({	sections: res.data.section.result });
				this.setState({	sections: $sectionDate });				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
			
			if(res.data.slug_url.return_status==="0"){
				let $isSlugUrlShow = (res.data.slug_url.result.length>0)?true:false;				
				let $slugs = [];
				let $slugDate = [];
				$slugs = res.data.slug_url.result;			
				$slugDate.push({ value: "", label: "Select Slug Url", name:'struc_slug_url' });
				for (var sl = 0; sl < $slugs.length;sl++){
					$slugDate.push({ value: $slugs[sl].slug_url, label: $slugs[sl].slug_url, name:'struc_slug_url' });
				}		
				//this.setState({	slug_urls: res.data.slug_url.result, isSlugUrlShow:$isSlugUrlShow });
				this.setState({	slug_urls: $slugDate, isSlugUrlShow:$isSlugUrlShow });				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
			
			if(res.data.component.return_status==="0"){
				let $components = [];
				let $componentDate = [];
				$components = res.data.component.result;			
				$componentDate.push({ value: "", label: "Select Component", name:'struc_compo_id' });
				for (var cm = 0; cm < $components.length;cm++){
					$componentDate.push({ value: $components[cm].id, label: $components[cm].desc, name:'struc_compo_id' });
				}
				//this.setState({	components: res.data.component.result });
				this.setState({	components: $componentDate });		
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
		//let parentLovShowHide = (value==='Y')?'d-block':'d-block';
		this.setState({
			[name]: value,
			[isChecked]: checkedAttr
		});
	}
	
	getPreviewUrl (e) {	
		var name = e.name;
		var value = e.value;
		this.setState({ [name]: value });		
		let $url = `${apiUrl}/preview_before_save?page_name=${this.state.struc_page_name}&section=${this.state.struc_section}&component=${value}`;
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){				
				this.setState({	siteUrl: res.data.result.url });				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}			
		}).catch(function(error){
			if(error){ Config.createNotification('error',error); }
		});
	}
		
	siteStructureHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();
			let $struc_id = this.state.struc_id;
			fmData.append('struc_id', $struc_id);
			fmData.append('struc_desc', this.state.struc_desc);
			fmData.append('struc_page_name', this.state.struc_page_name);
			fmData.append('struc_slug_url', this.state.struc_slug_url);
			fmData.append('struc_section', this.state.struc_section);
			fmData.append('struc_compo_id', this.state.struc_compo_id);			
			fmData.append('struc_ordering', this.state.struc_ordering);
			fmData.append('struc_time', this.state.struc_time);			
			let fromDateVar = moment(this.state.struc_from_date);
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('struc_from_date', newFromDateVar);			
			let uptoDateVar = moment(this.state.struc_upto_date);
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('struc_upto_date', newUptoDateVar);			
			fmData.append('struc_active_yn', this.state.struc_active_yn);
			fmData.append('struc_preview_yn', this.state.struc_preview_yn);
			
			let $url = (this.props.isEditSiteStructure)?`${apiUrl}/update/${$struc_id}`:apiUrl;			
			let msgType = ($struc_id)?'updated':'added';
			ApiDataService.post($url,fmData)
			.then(res => {			
				if(res.data.return_status==="0"){
					Config.createNotification('success','Site structure successfully '+msgType+'.');
					this.setState({ siteUrl:res.data.result.url });
				}else{
					var obj = res.data.result;					
					//alert(Object.entries(obj).length)
					if(Object.entries(obj).length>0){					
						if(obj.struc_id){ Config.createNotification('warning',obj.struc_id); }
						if(obj.struc_desc){ Config.createNotification('warning',obj.struc_desc); }
						if(obj.struc_page_name){ Config.createNotification('warning',obj.struc_page_name); }
						if(obj.struc_slug_url){ Config.createNotification('warning',obj.struc_slug_url); }
						if(obj.struc_section){ Config.createNotification('warning',obj.struc_section); }
						if(obj.struc_compo_id){ Config.createNotification('warning',obj.struc_compo_id); }
						if(obj.struc_ordering){ Config.createNotification('warning',obj.struc_ordering); }
						if(obj.struc_from_date){ Config.createNotification('warning',obj.struc_from_date); }
						if(obj.struc_upto_date){ Config.createNotification('warning',obj.struc_upto_date); }					
						//if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
					}else{					
						if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
					}
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});			
		}		
	}
	
	validateForm = () => {		
		let errors = {}
		let formIsValid = true;		
		
		if (!this.state.struc_desc) {
		  formIsValid = false
		  errors['struc_desc'] = '*Please enter structure description'
		}	
		
		if(!this.state.struc_page_name){
			formIsValid = false
			errors['struc_page_name'] = '*Please select page'
		}
		//alert(this.state.isSlugUrlShow)
		if(!this.state.struc_slug_url && this.state.isSlugUrlShow===true){
			formIsValid = false
			errors['struc_slug_url'] = "*Please select slug url"
		}
		//alert(this.state.struc_section)	
		if (!this.state.struc_section) {
		  formIsValid = false
		  errors['struc_section'] = '*Please select section'
		}
		
		if (!this.state.struc_compo_id) {
		  formIsValid = false
		  errors['struc_compo_id'] = '*Please select component'
		}		
		
		if (!this.state.struc_ordering) {
		  formIsValid = false
		  errors['struc_ordering'] = '*Please enter ordering number'
		}
		
		if (this.state.struc_ordering) {
		  //regular expression for footer_ordering validation
		  const re = /^[0-9\b]+$/; //rules
		  if (!re.test(this.state.struc_ordering)) {
			formIsValid = false
			errors['struc_ordering'] = '*Please enter only number value'
		  }
		}
		//alert(this.state.struc_from_date)
		var dateFormat = 'DD-MM-YYYY';
		
		if (!moment(moment(this.state.struc_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['struc_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.struc_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['struc_upto_date'] = '*Please enter upto date'
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
	
	keyupsearch = (e)=>{
		console.log(e.target.value,"USE FOR API");
	}
	render() {		
		//let pageTitle =(this.state.struc_id)?<h2>Edit Structure</h2>:<h2>Add Structure</h2>;
		const { pages, slug_urls, sections, components } = this.state;
		let $props = this.props;		
		console.log(this.state.struc_page_name)
		let select_page_name = this.state.struc_page_name;
		let select_slug_url = this.state.struc_slug_url;
		let select_struc_section = this.state.struc_section;
		let select_struc_compo_id = this.state.struc_compo_id;
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row noGutters>
						<Col className="block-example border-left border-top border-bottom border-dark" xs={3}>
							<Col>	
								<Form.Group controlId="struc_desc">
									<Form.Label>Structure Description</Form.Label>
									<Form.Control
									  type="text"
									  name="struc_desc"
									  value={this.state.struc_desc}
									  onChange={this.handleChange.bind(this,'text')}
									  placeholder="Structure Description" />
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_desc}</div>
							</Col>
							<Col>
								<Form.Group controlId="struc_page_name">
									<Form.Label>Page</Form.Label>									
									<div onKeyUp={(e) => this.keyupsearch(e)}>
									  <Select
										value={pages.filter(function (option) {
										  return option.value === select_page_name;
										})}
										onChange={this.handleChange.bind(this,'lov')}
										options={pages}
										className="page_custdropdwn"
										styleSheet={customStyles}
									  />
									</div>									
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_page_name}</div>
							</Col>
							
							{this.state.isSlugUrlShow===true && <Col>
								<Form.Group controlId="struc_slug_url">
									<Form.Label>Slug Url</Form.Label>									
									<div onKeyUp={(e) => this.keyupsearch(e)}>
									  <Select
										value={slug_urls.filter(function (option) {
										  return option.value === select_slug_url;
										})}
										onChange={this.handleChange.bind(this,'lov')}
										options={slug_urls}
										className="slug_custdropdwn"
										styles={customStyles}
									  />
									</div>
									
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_slug_url}</div>
							</Col>
							}
							
							<Col>
								<Form.Group controlId="struc_section">
									<Form.Label>Section</Form.Label>
									<div onKeyUp={(e) => this.keyupsearch(e)}>
									  <Select
										value={sections.filter(function (option) {
										  return option.value === select_struc_section;
										})}
										onChange={this.handleChange.bind(this,'lov')}
										options={sections}
										className="section_custdropdwn"
										styles={customStyles}
									  />
									</div>
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_section}</div>
							</Col>
							
							<Col>
								<Form.Group controlId="struc_compo_id">
									<Form.Label>Component</Form.Label>
									<div onKeyUp={(e) => this.keyupsearch(e)}>
									  <Select
										value={components.filter(function (option) {
										  return option.value === select_struc_compo_id;
										})}
										onChange={this.handleChange.bind(this,'lov')}
										options={components}
										className="custdropdwn"
										styles={customStyles}
									  />
									</div>
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_compo_id}</div>
							</Col>
														
							<Col>
								<Form.Group controlId="struc_ordering">
									<Form.Label>Ordering</Form.Label>
									<Form.Control
									  type="text"
									  name="struc_ordering"
									  value={this.state.struc_ordering}
									  onChange={this.handleChange.bind(this,'text')}
									  placeholder="Ordering" />
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_ordering}</div>
							</Col>
							<Col>
								<Form.Group controlId="struc_time">
									<Form.Label>Time</Form.Label>
									<Form.Control
									  type="text"
									  name="struc_time"
									  value={this.state.struc_time}
									  onChange={this.handleChange.bind(this,'text')}
									  placeholder="Time" />
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_time}</div>
							</Col>
							
							<Col>
								<Form.Group controlId="struc_from_date">
									<Form.Label>From Date</Form.Label>								
									<DatePicker
										selected={ this.state.struc_from_date }
										onChange={ this.handleDateChange.bind(this,'struc_from_date') }
										value={ this.state.struc_from_date }
										name="struc_from_date"
										dateFormat="dd-MMM-yyyy" 
										className="form-control"
									/>
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_from_date}</div>								
							</Col>							
							<Col>
								<Form.Group controlId="struc_upto_date">
									<Form.Label>Upto Date</Form.Label>
									
									<DatePicker
										selected={ this.state.struc_upto_date } 
										onChange={ this.handleDateChange.bind(this,'struc_upto_date') }
										value={ this.state.struc_upto_date }
										name="struc_upto_date" 
										dateFormat="dd-MMM-yyyy" 
										className="form-control"
									/>
								</Form.Group>
								<div className='errorMsg'>{this.state.errors.struc_upto_date}</div>
							</Col>
							<Col xs={6}>	
								<Form.Group controlId="struc_active_yn">
									<Form.Check
										type="checkbox" 
										value={(this.state.struc_preview_yn)?this.state.struc_active_yn:''} 
										name="struc_active_yn"								  
										checked={this.state.isActiveChecked}
										onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
										id="struc_active_yn"
										label="Active ?"
										custom
									/>
								</Form.Group>
							</Col>
							<Col className="d-none" xs={6}>	
								<Form.Group controlId="struc_preview_yn">
									<Form.Check
										type="checkbox" 
										value={(this.state.struc_preview_yn)?this.state.struc_preview_yn:''} 
										name="struc_preview_yn"								  
										checked={this.state.isPreviewChecked}
										onChange={ this.handleCheckboxChange.bind(this,'isPreviewChecked') }
										id="struc_preview_yn"
										label="Preview ?"
										custom
									/>
								</Form.Group>
							</Col>
						</Col>
						
						<Col className="block-example border border-dark" xs={9}>
							<iframe title="Preview" className="block-example border border-none" src={this.state.siteUrl} height='100%' width='100%' />
						</Col>
						
					</Row>								
					<Form.Group>
					<Row noGutters></Row>
					</Form.Group>					
					<Form.Group>
						<Row noGutters>
							<Col xs={4}></Col>
							<Col xs={4} className="alignCenter">
								<Button onClick={this.siteStructureHandler} variant="success" type="submit">Save</Button>
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

export default AddUpdateSiteStructureManagement;