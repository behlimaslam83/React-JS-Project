import React, { Component } from 'react';
import './FooterManagement.scss';
import { Modal, Container } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';
import FooterManagementList from './FooterManagementList';
import AddUpdateFooterManagement from './AddUpdateFooterManagement';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SeoManagement from '../Seo/SeoManagement';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/footer`;
class FooterManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {						
			footers: [],
			seo: [],
			languages: [],
			response: {},
			isAddFooter: false,     
			isEditFooter: false,
			isDeleteFooter:false,
			isOpen:false,
			isAddEditSeo:false,
			hideLangField: '',
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
				isEditFooter: false,
				isAddFooter: false,
				isDeleteFooter:false,
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
				footers: [],
				isAddFooter: true,				
				isOpen: true,
				hideLangField: '',
			});			
		}
	}
	
	onFormSubmit(data,footerId) {			
		let $langUrl = (this.state.isEditFooter && data.get('lang_code')!=="en")?`${apiUrl}/lang/update/${footerId}`:`${apiUrl}/update/${footerId}`;
		let $url = (this.state.isEditFooter)?$langUrl:apiUrl;
		let msgType = (footerId)?'updated':'added';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Footer successfully '+msgType+'.');
				if (this._isMounted){
					Config.createNotification('refresh','');
					this.setState({
						response: res.data,
						isAddFooter: false,
						isEditFooter: false,
						isOpen: false
					});					
				}
			}else{
				var obj = res.data.result;
				//console.log('obj',obj.footers_parent_id);				
				if(Object.entries(obj).length>0){					
					if(obj.footers_desc){ Config.createNotification('warning',obj.footers_desc); }
					if(obj.footers_ordering){ Config.createNotification('warning',obj.footers_ordering); }
					if(obj.footers_from_date){ Config.createNotification('warning',obj.footers_from_date); }
					if(obj.footers_upto_date){ Config.createNotification('warning',obj.footers_upto_date); }
					if(obj.footers_link_title){ Config.createNotification('warning',obj.header_link_title); }
					if(obj.footers_link_url){ Config.createNotification('warning',obj.header_link_url); }	
					if(obj.footers_parent_id){ Config.createNotification('warning',obj.footers_parent_id); }
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
				}else{					
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}

	editFooter = footerId => {
		let $url = `${apiUrl}/${footerId}/edit`;
		ApiDataService.get($url)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						footers: res.data,
						isEditFooter: true,
						isAddFooter: true,						
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
	
	deleteFooter  = (footerId) => {		
		if(window.confirm("Are you sure you want to delete this footer?")){
			if (this._isMounted){ this.setState({ isDeleteFooter:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,footerId)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){						
						this.setState({	isDeleteFooter:false });
					}
					Config.createNotification('success','Footer successfully deleted.');
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	editLanguageFooter = (footerId,langCode) => {
		let $url = `${apiUrl}/lang/${footerId}/edit`;
		ApiDataService.get($url,langCode)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						footers: res.data,
						isEditFooter: true,
						isAddFooter: true,						
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
	
	seoFooter = footerId => {		
		let $url = `${apiUrl}/seo/${footerId}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,						
						isAddEditSeo: true,						
						isOpen: true,
						refSysId:footerId
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
		let footerForm;
		let popupTitle = 'Footer';
		let popupSize = '';
		if(this.state.isAddFooter || this.state.isEditFooter) {
			footerForm = <AddUpdateFooterManagement 
							onFormSubmit={this.onFormSubmit}  
							closeModal={this.closeModal} 
							footers={this.state.footers} 
							languages={this.state.languages} 
							hideLangField={this.state.hideLangField} />
		}
		let seoForm;	
		if(this.state.isAddEditSeo) {
			seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.closeModal} refSysId={this.state.refSysId} seoFor='footer' />
			popupTitle = 'Seo';
			popupSize = 'lg';
		}
		
		return (	
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddFooter && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Footer</Button></div>} */}
					{/* {(!this.state.isAddFooter && !this.state.isDeleteFooter) && <FooterManagementList editFooter={this.editFooter} deleteFooter={this.deleteFooter} seoFooter={this.seoFooter} openModal={this.onCreate} editLanguageFooter={this.editLanguageFooter} />} */}
					<FooterManagementList editFooter={this.editFooter} deleteFooter={this.deleteFooter} seoFooter={this.seoFooter} openModal={this.onCreate} editLanguageFooter={this.editLanguageFooter} />
					<NotificationContainer />
					<Modal animation={false} size={popupSize} id="footerModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditFooter)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ footerForm }
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

export default FooterManagement;