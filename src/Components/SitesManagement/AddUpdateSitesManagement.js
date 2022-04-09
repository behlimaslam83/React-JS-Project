import React, { Component } from 'react';
import './SitesManagement.scss';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const apiUrl = `admin/portal/site`;
const customStyles = {
  control: base => ({
    ...base,
    height: 36,
    minHeight: 35
  })
};
class AddUpdateSitesManagement extends Component {

	constructor(props) {		
		super(props);
		let $site_id = '';
		var $site_desc = '';
		let $site_domain = '';		
		let $site_theme = '';
		let $site_active_yn = 'N';
		let $isActiveChecked = '';
		let $old_avatar = '';
		let $old_avatar_logo = '';
		let $primary_cn_iso = '';
		let $primary_lang_code = '';
		if(props.sites.return_status==="0"){			
			var $siteObj = props.sites.result[0];
			$site_id = $siteObj.id;
			$site_desc = $siteObj.desc;
			$site_domain = $siteObj.domain;
			$site_theme = $siteObj.theme;
			$site_active_yn = $siteObj.active_yn;
			$isActiveChecked = ($siteObj.active_yn==="Y")?"checked":"";
			$old_avatar = $siteObj.favicon_path;
			$old_avatar_logo = $siteObj.logo_path;
			$primary_cn_iso = $siteObj.primary_cn_iso;
			$primary_lang_code = $siteObj.primary_lang_code;
		}
			
		this.state = {
			site_id: $site_id, //this.props.match.params.id
			site_desc: $site_desc,
			site_domain: $site_domain,
			site_theme: $site_theme,			
			site_active_yn: $site_active_yn,
			isActiveChecked: $isActiveChecked,			
			avatar: '',
			old_avatar: $old_avatar,
			avatar_logo: '',
			old_avatar_logo: $old_avatar_logo,
			primary_cn_iso: $primary_cn_iso,
			primary_lang_code: $primary_lang_code,
			languages: [],
			countries: [],
			errors: {}
		}				
		//this.handleChange = this.handleChange.bind(this);			
		//this.onFileChangeHandler = this.onFileChangeHandler.bind(this);	
	}
	
	handleChange(type,event) {
		const name = (type==="lov")?event.name:event.target.name;
		var value = (type==="lov")?event.value:event.target.value;
		this.setState({
			[name]: value
		})
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
		
	onFileChangeHandler (preview_type,e) {
		//'avatar': e.target.files[0],
		//'old_avatar': URL.createObjectURL(e.target.files[0])
        this.setState({
			[e.target.name]: e.target.files[0],
			[preview_type]: URL.createObjectURL(e.target.files[0])
        });
	}
	
	footerHandler = event => {
		event.preventDefault();
		if (this.validateForm()) {
			const fmData = new FormData();		
			fmData.append('desc', this.state.site_desc);
			fmData.append('domain', this.state.site_domain);
			fmData.append('theme', this.state.site_theme);			
			fmData.append('active_yn', this.state.site_active_yn);						
			let $siteId = this.state.site_id;
			fmData.append('id', $siteId);
			fmData.append('old_avatar',this.state.old_avatar);
			fmData.append('avatar',this.state.avatar);			
			fmData.append('old_avatar_logo',this.state.old_avatar_logo);
			fmData.append('avatar_logo',this.state.avatar_logo);			
			fmData.append('primary_cn_iso',this.state.primary_cn_iso);
			fmData.append('primary_lang_code',this.state.primary_lang_code);
			this.props.onFormSubmit(fmData,$siteId);
		}		
	}
	
	validateForm = () => {
		let errors = {}
		let formIsValid = true;
		
		if (!this.state.site_desc) {
		  formIsValid = false
		  errors['site_desc'] = '*Please enter site title'
		}	
		
		if (!this.state.site_domain) {
		  formIsValid = false
		  errors['site_domain'] = '*Please enter site domain'
		}
		
		
		
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
			//alert(pattern.test(this.state.site_domain));
		if (pattern.test(this.state.site_domain)===false) {
			formIsValid = false
			errors['site_domain'] = '*Please enter valid site domain.'
		}
		
		if (!this.state.site_theme) {
		  formIsValid = false
		  errors['site_theme'] = '*Please enter site theme'
		}
		
		if (!this.state.primary_cn_iso) {
		  formIsValid = false
		  errors['primary_cn_iso'] = '*Please select primary country iso code'
		}
		
		if (!this.state.primary_lang_code) {
		  formIsValid = false
		  errors['primary_lang_code'] = '*Please select primary language code'
		}
		
		this.setState({ errors });
		return formIsValid;
	}
	
	getDefaultSettingData(){		
		let $url = `${apiUrl}/lov_s`;		
		ApiDataService.get($url)
		.then(res => {

			console.log('res.data.return_status',res.data.return_status);
			if(res.data.return_status==="0"){	
				let $countries = [];
				let $countryDate = [];	
				$countries = res.data.result.country_lov;			
				$countryDate.push({ value: "", label: "Select Country", name:'primary_cn_iso' });
				for (var i = 0; i < $countries.length;i++){
					$countryDate.push({ value: $countries[i].code, label: $countries[i].desc, name:'primary_cn_iso' });
				}
				this.setState({ countries: $countryDate });
				
				let $languages = [];
				let $languageDate = [];	
				$languages = res.data.result.lang_lov;			
				$languageDate.push({ value: "", label: "Select Language", name:'primary_lang_code' });
				for (var i = 0; i < $languages.length;i++){
					$languageDate.push({ value: $languages[i].code, label: $languages[i].desc, name:'primary_lang_code' });
				}
				this.setState({ languages: $languageDate });
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});		
	}
	
    // componentWillMount(){}
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
	render() {
		//console.log('this.state',this.state);	
		//let pageTitle =(this.state.footer_id)?<h2>Edit Footer</h2>:<h2>Add Footer</h2>;

		const { countries, languages } = this.state;
		let $props = this.props;
		let select_country_id = (this.state.primary_cn_iso)?this.state.primary_cn_iso:'';
		let select_language_id = (this.state.primary_lang_code)?this.state.primary_lang_code:'';
		return (	
			<Container className="themed-container" fluid="true">
				{/*<Form onSubmit={this.handleSubmit}>*/}
				<Form>
					<Row noGutters>
						<Col xs={12}>
							<Form.Group controlId="site_desc">
							<Form.Label>Site Title</Form.Label>
								<Form.Control
								  type="text"
								  name="site_desc"
								  value={this.state.site_desc}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Site Title"/>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.site_desc}</div>
						</Col>
					</Row>
									
					<Row noGutters>
						<Col>	
							<Form.Group controlId="site_domain">
								<Form.Label>Site Domain</Form.Label>
								<Form.Control
								  type="text"
								  name="site_domain"
								  value={this.state.site_domain}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Site Domain" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.site_domain}</div>
						</Col>
					</Row>
										
					<Row noGutters>
						<Col>	
							<Form.Group controlId="site_theme">
								<Form.Label>Site Theme</Form.Label>
								<Form.Control
								  type="text"
								  name="site_theme"
								  value={this.state.site_theme}
								  onChange={this.handleChange.bind(this,'text')}
								  placeholder="Site Theme" />
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.site_theme}</div>
						</Col>
					</Row>
					
					<Row>
						<Col xs={6}>
							<Form.Group controlId="primary_cn_iso">
								<Form.Label>Country ISO</Form.Label>								
								<div onKeyUp={(e) => this.keyupsearch(e)}>
								  <Select
									value={countries.filter(function (option) {
									  return option.value === select_country_id;
									})}
									onChange={this.handleChange.bind(this,'lov')}
									options={countries}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.primary_cn_iso}</div>
						</Col>
						<Col xs={6}>
							<Form.Group controlId="primary_lang_code">
								<Form.Label>Language</Form.Label>								
								<div onKeyUp={(e) => this.keyupsearch(e)}>
								  <Select
									value={languages.filter(function (option) {
									  return option.value === select_language_id;
									})}
									onChange={this.handleChange.bind(this,'lov')}
									options={languages}
									className="custdropdwn"
									styleSheet={customStyles}
								  />
								</div>
							</Form.Group>
							<div className='errorMsg'>{this.state.errors.primary_lang_code}</div>
						</Col>
					</Row>
					
					
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar">
								<Form.Label>Favicon Icon</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar')}
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
							<img src={this.state.old_avatar} width={80} height={80} alt={this.state.site_desc} />
						</Col>
						}
					</Row>
					
					<Row noGutters>
						<Col>	
							<Form.Group controlId="avatar_logo">
								<Form.Label>Site Logo</Form.Label>
								<Form.Control
								  type="file"
								  name="avatar_logo"	
								  style={{display:'none'}}
								  onChange={this.onFileChangeHandler.bind(this,'old_avatar_logo')}
								  placeholder="Site Logo"
								  ref={fileAvatarLogo => this.fileAvatarLogo = fileAvatarLogo}
								  />
								  &nbsp;
								  <Button onClick={() => this.fileAvatarLogo.click()} variant="info">Upload</Button>
							</Form.Group>
							
							<div className='errorMsg'>{this.state.errors.avatar_logo}</div>
						</Col>
						{(this.state.old_avatar_logo) && 
						<Col>
							<img src={this.state.old_avatar_logo} width={80} height={80} alt={this.state.site_desc} />
						</Col>
						}
					</Row>
					<Row noGutters>
						<Col xs={4}>							
							<Form.Check
								type="checkbox" 
								value={(this.state.site_active_yn)?this.state.site_active_yn:''} 
								name="site_active_yn"								  
								checked={this.state.isActiveChecked}
								onChange={ this.handleCheckboxChange.bind(this,'isActiveChecked') }
								id="site_active_yn"
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

export default AddUpdateSitesManagement;