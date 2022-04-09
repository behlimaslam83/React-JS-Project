import React, { Component } from 'react';
import './SiteStructureManagement.scss';
import { Modal, Container } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SiteStructureManagementList from './SiteStructureManagementList';
import AddUpdateSiteStructureManagement from './AddUpdateSiteStructureManagement';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { WindowPanel } from "../../WindowPanel";
const apiUrl = `admin/portal/structure`;
class SiteStructureManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {
			structures: [],
			pages: [],
			sections: [],
			components: [],						
			response: {},
			isAddSiteStructure: false,     
			isEditSiteStructure: false,
			isDeleteSiteStructure:false,
			isOpen:false,
			returnUrl:''
		};	
    }

    openModal = () => this.setState({ isOpen: true });
	
	closeModal = () => {		
		if (this._isMounted){
			Config.createNotification('refresh','');
			this.setState({ 
				isOpen: false,
				isEditSiteStructure: false,
				isAddSiteStructure: false,
				isDeleteSiteStructure:false
			});
		}
	}
	
	componentWillMount(){
		if (this._isMounted){
			let $url = `${apiUrl}/structure_page_lov_s`;		
			ApiDataService.get($url)
			.then(res => {	
				//alert(res.data.page.return_status)			
				if(res.data.page.return_status==="0"){								
					this.setState({
						pages: res.data.page,
						sections: res.data.section,
						components: res.data.component
					});
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	//componentDidMount(){}
	componentWillUnmount(){
		this._isMounted = false;		
	}

	// componentWillReceiveProps(){}
	// shouldComponentUpdate(){}
	// componentWillUpdate(){}
	// componentDidUpdate(){}
  
	onCreate = () => {
		if (this._isMounted){
			this.setState({ 
				structures: [],
				isAddSiteStructure: true,
				isOpen: true
			});
		}
	}
	
	editSiteStructure = structureId => {		
		let $url = `${apiUrl}/${structureId}/edit`;
		ApiDataService.get($url)
		.then(res => {			
			if(res.data.return_status==="0"){				
				if (this._isMounted){
					this.setState({
						structures: res.data,
						isEditSiteStructure: true,
						isAddSiteStructure: true,
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
	
	deleteSiteStructure  = (structureId) => {		
		if(window.confirm("Are you sure you want to delete this structure?")){
			if (this._isMounted){ this.setState({ isDeleteSiteStructure:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,structureId)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){
						this.setState({	isDeleteSiteStructure:false });
					}
					Config.createNotification('success','Site structure successfully deleted.');
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	previewSiteStructure  = (structureId,type) => {		
		if(window.confirm("Are you sure you want to preview this structure?")){
			let $type = (type==='page')?'preview_url':'preview_section_url';
			let $url = `${apiUrl}/${$type}/${structureId}`;
			ApiDataService.get($url)
			.then(res => {		
				if(res.data.return_status==="0"){
					if (this._isMounted){
						window.open(res.data.result.url, 'Data','height=600,width=800,left=200,top=200');
					}
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});	
		}
	}
	
	render() {
		//style={ {resize: "both"}, {overflow: "auto"}, {height: "300px"} } 
		let structureForm;
		let popupTitle = 'Site Structure';
		let poputSize = 'xl';
		if(this.state.isAddSiteStructure || this.state.isEditSiteStructure) {
			structureForm = <AddUpdateSiteStructureManagement  
							closeModal={this.closeModal} 
							pages={this.state.pages} 
							sections={this.state.sections} 
							components={this.state.components} 
							structures={this.state.structures} 	
			  				isEditSiteStructure={this.state.isEditSiteStructure}
						/>
		}		
		return (	
			<WindowPanel rawHtml={				
				<div className="windowContent">				
					{/* {!this.state.isAddSiteStructure && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Site Structure</Button></div>}  */}
					
					{/*	
					{ (!this.state.isAddSiteStructure && !this.state.isDeleteSiteStructure) && <SiteStructureManagementList editSiteStructure={this.editSiteStructure} deleteSiteStructure={this.deleteSiteStructure} openModal={this.onCreate} pagesList={this.state.pages} previewSiteStructure={this.previewSiteStructure} searchType={this.state.searchType} /> }
					*/} 
					
					<SiteStructureManagementList editSiteStructure={this.editSiteStructure} deleteSiteStructure={this.deleteSiteStructure} openModal={this.onCreate} pagesList={this.state.pages} previewSiteStructure={this.previewSiteStructure} />
						
					<NotificationContainer />
					<Modal animation={false} size={poputSize} id="structureModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditSiteStructure)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ structureForm }						
						</Modal.Body>
						{/*<Modal.SiteStructure>
						  <Button variant="secondary" onClick={this.closeModal}>Close</Button>
						</Modal.SiteStructure>*/}
					</Modal>					
					<Container></Container>            
				</div>
			}/>
		);	
	}
}

export default SiteStructureManagement;