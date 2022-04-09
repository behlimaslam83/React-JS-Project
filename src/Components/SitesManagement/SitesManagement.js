import React, { Component } from 'react';
import './SitesManagement.scss';
import { Modal, Container } from 'react-bootstrap';
import SitesManagementList from './SitesManagementList';
import AddUpdateSitesManagement from './AddUpdateSitesManagement';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/site`;
class SitesManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {						
			sites: [],
			response: {},
			isAddSite: false,     
			isEditSite: false,
			isDeleteSite:false,
			isOpen:false
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
				isEditSite: false,
				isAddSite: false,
				isDeleteSite:false
			});
		}
	}
	
	//componentWillMount(){}
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
				sites: [],
				isAddSite: true,				
				isOpen: true
			});			
		}
	}
	
	onFormSubmit(data,siteId) {			
		let $url = (this.state.isEditSite)?`${apiUrl}/update/${siteId}`:apiUrl;
		let msgType = (siteId)?'updated':'added';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Site successfully '+msgType+'.');
				if (this._isMounted){
					Config.createNotification('refresh','');
					this.setState({
						response: res.data,
						isAddSite: false,
						isEditSite: false,
						isOpen: false
					});					
				}
			}else{
				var obj = res.data.result;							
				if(Object.entries(obj).length>0){					
					if(obj.site_desc){ Config.createNotification('warning',obj.site_desc); }
					if(obj.domain){ Config.createNotification('warning',obj.domain); }
					if(obj.theme){ Config.createNotification('warning',obj.theme); }
					if(obj.favicon_path){ Config.createNotification('warning',obj.favicon_path); }
				}else{					
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}

	editSite = siteId => {
		let $url = `${apiUrl}/${siteId}/edit`;
		ApiDataService.get($url)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						sites: res.data,
						isEditSite: true,
						isAddSite: true,						
						isOpen: true
					});
				}
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	deleteSite  = (siteId) => {		
		if(window.confirm("Are you sure you want to delete this site?")){
			if (this._isMounted){ this.setState({ isDeleteSite:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,siteId)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){						
						this.setState({	isDeleteSite:false });
					}
					Config.createNotification('success','Site successfully deleted.');
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	render() {	
		let siteForm;
		let popupTitle = 'Site';
		let popupSize = '';
		if(this.state.isAddSite || this.state.isEditSite) {
			siteForm = <AddUpdateSitesManagement 
							onFormSubmit={this.onFormSubmit}  
							closeModal={this.closeModal} 
							sites={this.state.sites} />
		}
		
		return (	
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddSite && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Site</Button></div>} */}
					{/* {(!this.state.isAddSite && !this.state.isDeleteSite) && <SitesManagementList editSite={this.editSite} deleteSite={this.deleteSite} openModal={this.onCreate} />} */}
					<SitesManagementList editSite={this.editSite} deleteSite={this.deleteSite} openModal={this.onCreate} />
					<NotificationContainer />
					<Modal animation={false} size={popupSize} id="siteModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditSite)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ siteForm }							
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

export default SitesManagement;