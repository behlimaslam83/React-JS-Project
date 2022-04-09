import React, { Component } from 'react';
import './HeaderManagement.scss';
import { Modal, Container } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';
import HeaderManagementList from './HeaderManagementList';
import AddUpdateHeaderManagement from './AddUpdateHeaderManagement';
import Config from '../Config'
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import ApiDataService from '../../services/ApiDataService';
import SeoManagement from '../Seo/SeoManagement';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/header`;
class HeaderManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {			
			headers: [],
			languages: [],
			response: {},
			isAddHeader: false,     
			isEditHeader: false,
			isDeleteHeader:false,
			isOpen:false,
			isAddEditSeo:false,
			hideLangField: '',//d-block
			refSysId:''
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);		
    }

    openModal = () => {		
		this.setState({ isOpen: true });
	}
	closeModal = () => {		
		if (this._isMounted){	
			this.setState({ 
				isOpen: false,
				isEditHeader: false,
				isAddHeader: false,
				isDeleteHeader:false,
				isAddEditSeo: false,
				refSysId:''
			});
		}
	}	
		
	getLanguagesData() {
		if (this._isMounted){
			let $url = `${apiUrl}/lang/lov`;		
			ApiDataService.get($url)
			.then(res => {			
				if(res.data.return_status==="0"){								
					this.setState({
						languages: res.data
					});
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	componentWillMount(){
		this.getLanguagesData();
	}
    // componentDidMount(){}
    componentWillUnmount(){
		this._isMounted = false;
	}

    // componentWillReceiveProps(){}
    // shouldComponentUpdate(){ alert('in'); }
    // componentWillUpdate(){}
    // componentDidUpdate(){}  
	onCreate = () => {	
		if (this._isMounted){
			this.setState({ 
				headers: [],
				isAddHeader: true,
				isOpen: true,
				hideLangField: '',
			});
		}
	}
		
	onFormSubmit(data,headerId) {	
		let $langUrl = (this.state.isEditHeader && data.get('lang_code')!=="en")?`${apiUrl}/lang/update/${headerId}`:`${apiUrl}/update/${headerId}`;
		let $url = (this.state.isEditHeader)?$langUrl:apiUrl;
		let msgType = (headerId)?'updated':'added';		
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Header successfully '+msgType+'.');				
				if (this._isMounted){
					Config.createNotification('refresh','');
					this.setState({
						response: res.data,
						isAddHeader: false,
						isEditHeader: false,						
						isOpen: false
					});
				}
			}else{
				var obj = res.data.result;
				//console.log('obj',obj.header_parent_id);				
				if(Object.entries(obj.length)>0){
					if(obj.header_desc){ Config.createNotification('warning',obj.header_desc); }
					if(obj.header_ordering){ Config.createNotification('warning',obj.header_ordering); }
					if(obj.header_from_date){ Config.createNotification('warning',obj.header_from_date); }
					if(obj.header_upto_date){ Config.createNotification('warning',obj.header_upto_date); }					
					if(obj.header_link_title){ Config.createNotification('warning',obj.header_link_title); }
					if(obj.header_link_url){ Config.createNotification('warning',obj.header_link_url); }										
					if(obj.header_parent_id){ Config.createNotification('warning',obj.header_parent_id); }
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });
	}

	editHeader = headerId => {
		let $url = `${apiUrl}/${headerId}/edit`;		
		ApiDataService.get($url)
		.then(res => {
			//alert('in side');
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						headers: res.data,
						isEditHeader: true,
						isAddHeader: true,
						isOpen: true,
						hideLangField: '',
					});	
				}				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	deleteHeader  = (headerId) => {		
		if(window.confirm("Are you sure you want to delete this header?")){
			if (this._isMounted){ this.setState({ isDeleteHeader:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,headerId)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){
						this.setState({	isDeleteHeader:false });
					}
					Config.createNotification('success','Header successfully deleted.');
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	editLanguageHeader = (headerId,langCode) => {
		let $url = `${apiUrl}/lang/${headerId}/edit`;
		ApiDataService.get($url,langCode)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						headers: res.data,
						isEditHeader: true,
						isAddHeader: true,						
						isOpen: true,
						hideLangField: 'd-sm-none'
					});
				}
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	seoHeader = headerId => {		
		let $url = `${apiUrl}/seo/${headerId}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,						
						isAddEditSeo: true,						
						isOpen: true,
						refSysId:headerId
					});
				}
			//}else{
				//Config.createNotification('warning',res.data.error_message);
			//}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}

	render() {	
		let headerManagementForm;
		let popupTitle = 'Footer';
		let poputSize = '';
		if(this.state.isAddHeader || this.state.isEditHeader) {
		  headerManagementForm = <AddUpdateHeaderManagement 
									onFormSubmit={this.onFormSubmit}  
									closeModal={this.closeModal} 
									headers={this.state.headers} 
									languages={this.state.languages}
									hideLangField={this.state.hideLangField} />
		}
		let seoForm;	
		if(this.state.isAddEditSeo) {
		  seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.closeModal} refSysId={this.state.refSysId} seoFor='header' />
		  popupTitle = 'Seo';
		  poputSize = 'lg';
		}
		return (	
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddHeader && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Header</Button></div>} */}
					{/* {(!this.state.isAddHeader && !this.state.isDeleteHeader) && <HeaderManagementList editHeader={this.editHeader} deleteHeader={this.deleteHeader} seoHeader={this.seoHeader} openModal={this.onCreate} editLanguageHeader={this.editLanguageHeader} />} */}
					<HeaderManagementList editHeader={this.editHeader} deleteHeader={this.deleteHeader} seoHeader={this.seoHeader} openModal={this.onCreate} editLanguageHeader={this.editLanguageHeader} />
					<NotificationContainer />
					<Modal  animation={false} size={poputSize} id="headerModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditHeader)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ headerManagementForm }
							{ seoForm }
						</Modal.Body>
						{/*<Modal.Footer>
						  <Button variant="secondary" onClick={this.closeModal}>Close</Button>
						</Modal.Footer>*/}
					</Modal>				
					
					<Container></Container>            
				</div>
			}/>
		);
	}
}

export default HeaderManagement;