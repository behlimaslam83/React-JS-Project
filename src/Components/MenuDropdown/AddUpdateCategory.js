import React, { Component } from 'react';
import './Category.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Config from '../Config';
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
const moment= require('moment') ;
const apiUrl = `admin/portal/category`;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};
class AddUpdateCategory extends Component {

	constructor(props) {		
		super(props);
		let $cate_id = '';
		var $cate_desc = '';
		let $cate_parent_yn = 'Y';
		let $isParentChecked = 'checked';
		//let $isParentLovShowHide = 'd-sm-none';
		let $isParentLovShowHide = 'd-block';
		let $cate_parent_id = '';
		let $cate_ordering = 1;
		let $cate_from_date = moment(new Date(), 'DD-MMM-YYYY').toDate();
		let $cate_upto_date = moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();	
		let $cate_link_title = '';
		let $cate_link_url = '';
		let $cate_active_yn = 'N';
		let $isActiveChecked = '';
		let $langCode = 'en';
		let $old_avatar = '';
		let $old_avatar_thumbnail = '';
		let $old_avatar_icon = '';
		let $old_avatar_icon_two = '';
		let $old_avatar_mobile_p = '';
		let $old_avatar_mobile_l = '';
		let $hideLangField = props.hideLangField;
		let $hideDateField = 'd-sm-none';
		let $cate_date_specific_yn = 'N';
		let $isDateShowChecked = '';
		if(props.categories.return_status==="0"){			
			var $catObj = props.categories.result[0];
			$cate_id = $catObj.cate_id;
			$cate_desc = $catObj.cate_desc;
			$cate_parent_yn = $catObj.cate_parent_yn;
			$isParentChecked = ($catObj.cate_parent_yn==="Y")?"checked":"";
			//$isParentLovShowHide = ($catObj.cate_parent_yn==="Y")?"d-sm-none":"d-block";
			$isParentLovShowHide = ($catObj.cate_parent_yn==="Y")?"d-block":"d-block";
			$cate_parent_id = ($catObj.cate_parent_id)?$catObj.cate_parent_id:'';
			$cate_ordering = ($catObj.cate_ordering)?$catObj.cate_ordering:$cate_ordering;
			$cate_from_date = moment($catObj.cate_from_date, 'DD-MMM-YYYY').toDate();
			$cate_upto_date = moment($catObj.cate_upto_date, 'DD-MMM-YYYY').toDate();
			$cate_link_title = ($catObj.cate_link_title!=="" && $catObj.cate_link_title!=="null")?$catObj.cate_link_title:"";
			$cate_link_url = ($catObj.cate_link_url)?$catObj.cate_link_url:$cate_link_url;
			$cate_active_yn = $catObj.cate_active_yn;
			$isActiveChecked = ($catObj.cate_active_yn==="Y")?"checked":"";
			$old_avatar = $catObj.cate_image_path;
			$old_avatar_thumbnail = $catObj.cate_image_thumbnail;
			$old_avatar_icon = $catObj.cate_icon_path;
			$old_avatar_icon_two = $catObj.cate_icon_path_02;
			$old_avatar_mobile_p = $catObj.cate_image_mobile_P;
			$old_avatar_mobile_l = $catObj.cate_image_mobile_L;	
			$langCode = $catObj.lang_code;
			$cate_date_specific_yn = $catObj.cate_date_specific_yn;
			$isDateShowChecked = ($catObj.cate_date_specific_yn==="Y")?"checked":"";
			$hideDateField = ($catObj.cate_date_specific_yn==="Y")?"d-block":"d-sm-none";
		}
		let $parent_categories = [];		
		let $languages = [];
		if(props.languages.return_status==="0"){
			$languages = props.languages.result;
		}	
		this.state = {
			cate_id: $cate_id, //this.props.match.params.id
			cate_desc: $cate_desc,
			cate_parent_yn: $cate_parent_yn,
			isParentChecked: $isParentChecked,
			isParentLovShowHide: $isParentLovShowHide,
			cate_parent_id: $cate_parent_id,
			cate_ordering: $cate_ordering,			
			cate_from_date: $cate_from_date,
			cate_upto_date: $cate_upto_date,
			cate_link_title: $cate_link_title,
			cate_link_url: $cate_link_url,
			cate_active_yn: $cate_active_yn,
			isActiveChecked: $isActiveChecked,
			avatar: '',
			old_avatar: $old_avatar,
			avatar_thumbnail: '',
			old_avatar_thumbnail: $old_avatar_thumbnail,
			avatar_icon: '',
			old_avatar_icon: $old_avatar_icon,
			avatar_icon_2: '',
			old_avatar_icon_two: $old_avatar_icon_two,
			avatar_mobile_p: '',
			old_avatar_mobile_p: $old_avatar_mobile_p,
			avatar_mobile_l: '',
			old_avatar_mobile_l: $old_avatar_mobile_l,
			parent_categories: $parent_categories,
			languages: $languages,
			langCode: $langCode,
			hideLangField: $hideLangField,
			cate_date_specific_yn: $cate_date_specific_yn,
			isDateShowChecked: $isDateShowChecked,
			hideDateField: $hideDateField,
			errors: {}
		}	
		this.handleLanguageChange = this.handleLanguageChange.bind(this);		
	}
	
	handleChange(type,event) {
		const name = (type==="lov")?event.name:event.target.name;
		var value = (type==="lov")?event.value:event.target.value;
		this.setState({
			[name]: value
		});
		if(name==="cate_parent_id"){
			let $fDate = (event.from_date)?event.from_date:moment(new Date(), 'DD-MMM-YYYY').toDate();;	
			let $uDate = (event.upto_date)?event.upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate();
			this.setState({
				['cate_from_date']: moment($fDate, 'DD-MMM-YYYY').toDate(),
				['cate_upto_date']: moment($uDate, 'DD-MMM-YYYY').toDate()
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
		let $url = `${apiUrl}/lang/${this.state.cate_id}/edit`;
		ApiDataService.get($url,value)
		.then(res => {		
			if(res.data.return_status==="0"){					
					this.setState({
						cate_desc: res.data.result[0].cate_desc,
						cate_link_title: (this.state.cate_link_title!=="")?this.state.cate_link_title:res.data.result[0].cate_link_title,
						cate_from_date: this.state.cate_from_date,
						cate_upto_date: this.state.cate_upto_date,						
						//cate_link_title: this.state.cate_link_title,
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
		let dateFieldsShowHide = (name==='cate_date_specific_yn' && value==='Y')?'d-block':'d-sm-none';		
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
	
	onFileChangeHandler (preview_type,e) {
		//alert(e.target.name);
		//alert(preview_type)
        this.setState({
            [e.target.name]: e.target.files[0],
			[preview_type]: URL.createObjectURL(e.target.files[0])
        });
		//alert(this.state.preview_type)
	}
	
	getDefaultSettingData(){		
		let $url = `${apiUrl}/parent/fetch?cate_id=${this.state.cate_id}`;		
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){	
				let $categories = [];
				let $categoryDate = [];	
				$categories = res.data.result;			
				$categoryDate.push({ value: "", label: "Select Parent Header", name:'cate_parent_id', from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(), upto_date:moment('31-DEC-2099', 'DD-MMM-YYYY').toDate() });
				for (var i = 0; i < $categories.length;i++){
					$categoryDate.push({ value: $categories[i].parent_id, label: $categories[i].parent_desc, name:'cate_parent_id', from_date:$categories[i].from_date, upto_date:$categories[i].upto_date });
				}
				this.setState({ parent_categories: $categoryDate });
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});		
	}
	
	categoryHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();	
			//this.state.cate_parent_yn==="N" && 
			let cateParentId = (this.state.cate_parent_id!=="" && this.state.cate_parent_id!=null)?this.state.cate_parent_id:'';
			fmData.append('cate_desc', this.state.cate_desc);
			fmData.append('cate_parent_yn', this.state.cate_parent_yn);
			fmData.append('cate_parent_id', cateParentId);
			fmData.append('cate_ordering', this.state.cate_ordering);
			fmData.append('cate_date_specific_yn', this.state.cate_date_specific_yn);
			let fromDateVar = moment(this.state.cate_from_date);
			//let newFromDateVar = fromDateVar.utc().format('DD-MMM-YYYY');
			let newFromDateVar = fromDateVar.format('DD-MMM-YYYY');
			fmData.append('cate_from_date', newFromDateVar);
			
			let uptoDateVar = moment(this.state.cate_upto_date);
			//let newUptoDateVar = uptoDateVar.utc().format('DD-MMM-YYYY');
			let newUptoDateVar = uptoDateVar.format('DD-MMM-YYYY');
			fmData.append('cate_upto_date', newUptoDateVar);
			
			fmData.append('cate_link_title', this.state.cate_link_title);
			fmData.append('cate_link_url', this.state.cate_link_url);
			
			fmData.append('cate_active_yn', this.state.cate_active_yn);
			fmData.append('lang_code', this.state.langCode);
			let $cateId = this.state.cate_id;
			fmData.append('cate_id', $cateId);				
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);
			
			fmData.append('old_avatar_icon',this.state.old_avatar_icon);			
			fmData.append('avatar_icon',this.state.avatar_icon);
			fmData.append('old_avatar_icon_two',this.state.old_avatar_icon_two);
			fmData.append('avatar_icon_2',this.state.avatar_icon_2);
			fmData.append('old_avatar_mobile_p',this.state.old_avatar_mobile_p);
			fmData.append('avatar_mobile_P',this.state.avatar_mobile_p);
			fmData.append('old_avatar_mobile_l',this.state.old_avatar_mobile_l);
			fmData.append('avatar_mobile_L',this.state.avatar_mobile_l);
			fmData.append('old_avatar_thumbnail',this.state.old_avatar_thumbnail);
			fmData.append('avatar_thumbnail',this.state.avatar_thumbnail);
			this.props.onFormSubmit(fmData,$cateId);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.cate_desc) {
		  formIsValid = false
		  errors['cate_desc'] = '*Please enter category title'
		}
		
		if (this.state.cate_parent_yn==='N') {
		  if(!this.state.cate_parent_id){
			formIsValid = false
			errors['cate_parent_id'] = '*Please select parent category'
		  }
		}
		
				
		if (!this.state.cate_ordering) {
		  formIsValid = false
		  errors['cate_ordering'] = '*Please enter category order number'
		}
		
		if (this.state.cate_ordering) {
		  //regular expression for cate_ordering validation
		  const re = /^[0-9\b]+$/; //rules
		  if (!re.test(this.state.cate_ordering)) {
			formIsValid = false
			errors['cate_ordering'] = '*Please enter only number value'
		  }
		}
		//alert(this.state.cate_from_date)
		var dateFormat = 'DD-MM-YYYY';
		
		if (!moment(moment(this.state.cate_from_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['cate_from_date'] = '*Please enter from date'
		}
		
		if (!moment(moment(this.state.cate_upto_date).format(dateFormat),dateFormat,true).isValid()) {
		  formIsValid = false
		  errors['cate_upto_date'] = '*Please enter upto date'
		}
		/*
		if (!this.state.cate_link_title) {
		  formIsValid = false
		  errors['cate_link_title'] = '*Please enter category link title'
		}
		
		if (!this.state.cate_link_url) {
		  formIsValid = false
		  errors['cate_link_url'] = '*Please enter category link url'
		}
		*/
		this.setState({ errors });
		return formIsValid;
	}
	
    //componentWillMount(){}
    componentDidMount(){
		this.getDefaultSettingData();
	}
    // componentWillUnmount(){}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
	
	keyupsearch = (e)=>{
		console.log(e.target.value,"USE FOR API");
	}
	
	makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
	
	generateCategorySlugUrl = (e)=>{	
		//console.log(e.target.value,"USE FOR API");
		let titleText = e.target.value;
		titleText = titleText.replace(/[^a-zA-Z ]/g, "");
		titleText = titleText.replace(/\s+/g, '-');	
		
		let $url = `${apiUrl}/link_url_exist_or_not`;
		const urlData = new FormData();				
		urlData.append('cate_link_url', titleText.toLowerCase());
		ApiDataService.post($url,urlData)
		.then(res => {
			//console.log('obj',res.data);
			if(res.data.return_status==="0"){				
				this.setState({
					['cate_link_url']: titleText.toLowerCase()
				});	
			}else{
				this.setState({
					['cate_link_url']: titleText.toLowerCase()+'-'+this.makeid(5)
				});
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }				
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });
	}
	
	render() {
		//let pageTitle =(this.state.cate_id)?<h2>Edit Category</h2>:<h2>Add Category</h2>;
		const {parent_categories, languages} = this.state;
		let $props = this.props;		
		let select_parent_id = (this.state.cate_parent_id)?this.state.cate_parent_id:'';
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
							<Form.Group controlId="cate_desc">
							<Form.Label>Category Title</Form.Label>
								<Form.Control
								  type="text"
								  name="cate_desc"
								  value={this.state.cate_desc} 
								  onKeyUp={(e) => this.generateCategorySlugUrl(e)} 
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Category Title"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_desc}</div>
						</Col>
					</Row>
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>
							<Form.Group controlId="cate_parent_yn">								
								<Form.Check
									type="checkbox" 
									value={(this.state.cate_parent_yn)?this.state.cate_parent_yn:''} 
									name="cate_parent_yn"								  
								    checked={this.state.isParentChecked} 									
									onChange={ this.handleCheckboxChange.bind(this,'isParentChecked') }
									id="cate_parent_yn"
									label="Parent ?"
									custom
								/>
							</Form.Group>
						</Col>
						<Col xs={8} className={this.state.isParentLovShowHide}>
							<Form.Group controlId="cate_parent_yn">
								<Form.Label>Parent Category</Form.Label>								
								<div onKeyUp={(e) => this.keyupsearch(e)}>
								  <Select
									value={parent_categories.filter(function (option) {
									  return option.value === select_parent_id;
									})}
									onChange={this.handleChange.bind(this,'lov')}
									options={parent_categories}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_parent_id}</div>
						</Col>
					</Row>					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="cate_ordering">
								<Form.Label>Ordering</Form.Label>
								<Form.Control
								  type="text"
								  name="cate_ordering"
								  value={this.state.cate_ordering}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Ordering" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_ordering}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>	
							<Form.Group controlId="cate_date_specific_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.cate_date_specific_yn)?this.state.cate_date_specific_yn:''} 
									name="cate_date_specific_yn"								  
								    checked={this.state.isDateShowChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isDateShowChecked') }
									id="cate_date_specific_yn"
									label="Change Date ?"
									custom
								/>
							</Form.Group>
						</Col>						
					</Row>
					
					<Row className={this.state.hideLangField+' '+this.state.hideDateField}>
						<Col>
							<Form.Group controlId="cate_from_date">
								<Form.Label>From Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.cate_from_date).toDate() }
									onChange={ this.handleDateChange.bind(this,'cate_from_date') }
									value={ moment(this.state.cate_from_date).toDate() }
									name="cate_from_date"
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_from_date}</div>								
						</Col>							
						<Col>
							<Form.Group controlId="cate_upto_date">
								<Form.Label>Upto Date</Form.Label>								
								<DatePicker
									selected={ moment(this.state.cate_upto_date).toDate() } 
									onChange={ this.handleDateChange.bind(this,'cate_upto_date') }
									value={ moment(this.state.cate_upto_date).toDate() }
									name="cate_upto_date" 
									dateFormat="dd-MMM-yyyy" 
									className="form-control"
								/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_upto_date}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="cate_link_title">
								<Form.Label>Link Title</Form.Label>
								<Form.Control
								  type="text"
								  name="cate_link_title"
								  value={this.state.cate_link_title}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Title" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_link_title}</div>
						</Col>
					</Row>
					
					<Row noGutters className={this.state.hideLangField}>
						<Col>	
							<Form.Group controlId="cate_link_url">
								<Form.Label>Link Url</Form.Label>
								<Form.Control
								  type="text"
								  name="cate_link_url"
								  value={this.state.cate_link_url}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Link Url" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.cate_link_url}</div>
						</Col>
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar">								
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar')}
								  placeholder="Category Banner"
								  ref={fileInput => this.fileInput = fileInput}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInput.click()} variant="info">Upload</Button>
								  &nbsp;
								  <Form.Label>Banner</Form.Label>
							</Form.Group>							
							<div className='errorMsg'>{this.state.errors.avatar}</div>
						</Col>
						{(this.state.old_avatar) && 
						<Col>
							<img src={this.state.old_avatar} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_icon">								
								<Form.Control
								  type="file"
								  name="avatar_icon"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_icon')}
								  placeholder="Category Icon"
								  ref={fileInputAvatarIcon => this.fileInputAvatarIcon = fileInputAvatarIcon}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInputAvatarIcon.click()} variant="info">Upload</Button>
							      &nbsp;
								  <Form.Label>Icon</Form.Label>
							</Form.Group>							
							<div className='errorMsg'>{this.state.errors.avatar_icon}</div>
						</Col>
						{(this.state.old_avatar_icon) && 
						<Col>
							<img src={this.state.old_avatar_icon} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_icon_2">								
								<Form.Control
								  type="file"
								  name="avatar_icon_2"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_icon_two')}
								  placeholder="Category Icon 2"
								  ref={fileInputAvatarIcon2 => this.fileInputAvatarIcon2 = fileInputAvatarIcon2}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInputAvatarIcon2.click()} variant="info">Upload</Button>
							      &nbsp;
								  <Form.Label>Icon 2</Form.Label>
							</Form.Group>							
							<div className='errorMsg'>{this.state.errors.avatar_icon_2}</div>
						</Col>
						{(this.state.old_avatar_icon_two) && 
						<Col>
							<img src={this.state.old_avatar_icon_two} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_mobile_p">								
								<Form.Control
								  type="file"
								  name="avatar_mobile_p"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_mobile_p')}
								  placeholder="Category Mobile Portrait"
								  ref={fileInputAvatarMobileP => this.fileInputAvatarMobileP = fileInputAvatarMobileP}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInputAvatarMobileP.click()} variant="info">Upload</Button>
								  &nbsp;	
								  <Form.Label>Mobile Portrait</Form.Label>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar_mobile_p}</div>
						</Col>
						{(this.state.old_avatar_mobile_p) && 
						<Col>
							<img src={this.state.old_avatar_mobile_p} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_mobile_l">
								
								<Form.Control
								  type="file"
								  name="avatar_mobile_l"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_mobile_l')}
								  placeholder="Category Mobile Landscape"
								  ref={fileInputAvatarMobileL => this.fileInputAvatarMobileL = fileInputAvatarMobileL}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInputAvatarMobileL.click()} variant="info">Upload</Button>
								  &nbsp;
								  <Form.Label>Mobile Landscape</Form.Label>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar_mobile_l}</div>
						</Col>
						{(this.state.old_avatar_mobile_l) && 
						<Col>
							<img src={this.state.old_avatar_mobile_l} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_thumbnail">								
								<Form.Control
								  type="file"
								  name="avatar_thumbnail"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_thumbnail')}
								  placeholder="Category Thumbnail"
								  ref={fileInputAvatarThumbnail => this.fileInputAvatarThumbnail = fileInputAvatarThumbnail}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileInputAvatarThumbnail.click()} variant="info">Upload</Button>
								  &nbsp;
								  <Form.Label>Thumbnail</Form.Label>
							</Form.Group>							
							<div className='errorMsg'>{this.state.errors.avatar_thumbnail}</div>
						</Col>
						{(this.state.old_avatar_thumbnail) && 
						<Col>
							<img src={this.state.old_avatar_thumbnail} width={80} height={80} alt={this.state.cate_desc} />
						</Col>
						}
					</Row>
					
					
					
					<Row noGutters className={this.state.hideLangField}>
						<Col xs={4}>	
							<Form.Group controlId="cate_active_yn">
								<Form.Check
									type="checkbox" 
									value={(this.state.cate_active_yn)?this.state.cate_active_yn:''} 
									name="cate_active_yn"								  
								    checked={this.state.isActiveChecked}
									onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
									id="cate_active_yn"
									label="Active ?"
									custom
								/>
							</Form.Group>
						</Col>						
					</Row>							
					<Form.Group>
						<Form.Control type="hidden" name="cate_id" value={this.state.cate_id} />
						<Form.Control type="hidden" name="old_avatar" value={this.state.old_avatar} />							
						<Row noGutters>
							<Col xs={4}></Col>
							<Col xs={4} className="alignCenter">
								<Button onClick={this.categoryHandler} variant="success" type="submit">Save</Button>
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

export default AddUpdateCategory;