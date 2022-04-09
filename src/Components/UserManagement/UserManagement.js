import React, { Component } from 'react';
import './UserManagement.scss';
import { Modal, Container } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';
import UserManagementList from './UserManagementList';
import UserResponsbilityList from './UserResponsbility/UserResponsbilityList';
import AddUpdateUserManagement from './AddUpdateUserManagement';
import AddUpdateUserRespManagement from './UserResponsbility/AddUpdateUserRespManagement';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/user`;
class UserManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {			
			users: [],
			responsbility: [],			
			resp_lov: [],
			response: {},
			isAddUser: false,     
			isEditUser: false,
			isDeleteUser:false,
			isRespUser: false,
			addUpdateRespUser: false,
			isOpen:false,			
			refSysId:'',
			usrsUserId:'',
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormRespSubmit = this.onFormRespSubmit.bind(this);	
    }

    openModal = () => {		
		this.setState({ isOpen: true });
	}
	closeModal = () => {
		if (this._isMounted){	
			this.setState({ 
				isOpen: false,
				isEditUser: false,
				isAddUser: false,
				isRespUser: false,
				isDeleteUser:false,
				refSysId:''
			});
		}
	}
	
	componentWillMount(){		
		this.getResponsbilityLovData();
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
				users: [],
				isAddUser: true,
				isOpen: true
			});
		}
	}
		
	onFormSubmit(data,userId) {		
		let $url = (this.state.isEditUser)?`${apiUrl}/update/${userId}`:apiUrl;		
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','User Responsbility successfully added.');				
				if (this._isMounted){
					this.setState({
						response: res.data,
						isAddUser: false,
						isEditUser: false,	
						isRespUser: false,
						isOpen: false
					});
				}
			}else{
				var obj = res.data.result;
				//console.log('obj',obj.user_parent_id);				
				if(Object.entries(obj).length>0){
					if(obj.user_desc){ Config.createNotification('warning',obj.user_desc); }
					if(obj.user_locn_code){ Config.createNotification('warning',obj.user_locn_code); }
					if(obj.user_personal_code){ Config.createNotification('warning',obj.user_personal_code); }
					if(obj.user_pass_word){ Config.createNotification('warning',obj.user_pass_word); }					
					if(obj.user_email){ Config.createNotification('warning',obj.user_email); }
					if(obj.user_office_phone){ Config.createNotification('warning',obj.user_office_phone); }
					if(obj.user_home_phone){ Config.createNotification('warning',obj.user_home_phone); }
					if(obj.user_cell_phone){ Config.createNotification('warning',obj.user_cell_phone); }										
					if(obj.user_from_date){ Config.createNotification('warning',obj.user_from_date); }
					if(obj.user_upto_date){ Config.createNotification('warning',obj.user_upto_date); }
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });
	}

	editUser = (userId) => {		
		let $url = `${apiUrl}/${userId}/edit`;		
		ApiDataService.get($url)
		.then(res => {
			//alert('in side');
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						users: res.data,
						isEditUser: true,
						isAddUser: true,
						isRespUser: false,
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
	
	deleteUser  = (userId) => {		
		if(window.confirm("Are you sure you want to delete this User?")){
			if (this._isMounted){ this.setState({ isDeleteUser:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,userId)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){
						this.setState({	isDeleteUser:false });
					}
					Config.createNotification('success','User successfully deleted.');	
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	responsbilityUser = userId => {			
		let $url = `${apiUrl}/userresp?usrs_user_id=${userId}`;		
		ApiDataService.get($url)
		.then(res => {
			//alert('in side');
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						users: res.data,
						usrsUserId: userId,
						isEditUser: false,
						isAddUser: false,
						isRespUser: true,
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
	
	getResponsbilityLovData() {
		if (this._isMounted){
			let $url = `${apiUrl}/userresp/fetch/resp_lov?usrs_user_id=${this.state.usrsUserId}`;		
			ApiDataService.get($url)
			.then(res => {
				//return false;					
				if(res.data.return_status==="0"){	
					//console.log('res.data - 1',res.data.result.location.result);
					this.setState({
						resp_lov: res.data						
					});
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	addUserResp = () => {
		this.getResponsbilityLovData();
		this.setState({ 
			responsbility:[],			
			addUpdateRespUser: true, 
			isEditUser: false,
			isAddUser: false,
			isRespUser: false 
		});
	}
	
	closeRespFormModal = () => {
		//this.getResponsbilityLovData();
		if (this._isMounted){	
			this.setState({
				isEditUser: false,
				isAddUser: false,
				addUpdateRespUser: false,
				isRespUser: true
			});
		}
	}
	
	onFormRespSubmit(data,usrsRespCode) {		
		let $url = (usrsRespCode)?`${apiUrl}/userresp/update/${usrsRespCode}`:`${apiUrl}/userresp`;	
		let $action = (usrsRespCode)?' updated.':' added.';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','User responsbility successfully'+$action);
				Config.createNotification('refresh','');
				if (this._isMounted){
					this.setState({
						isEditUser: false,
						isAddUser: false,
						addUpdateRespUser: false,
						isRespUser: true
					});
				}
			}else{
				var obj = res.data.result;
				console.log('obj',obj.user_parent_id);				
				if(obj.length>0){
					if(obj.usrs_user_id){ Config.createNotification('warning',obj.usrs_user_id); }
					if(obj.usrs_resp_code){ Config.createNotification('warning',obj.usrs_resp_code); }
					if(obj.usrs_from_date){ Config.createNotification('warning',obj.usrs_from_date); }
					if(obj.usrs_upto_date){ Config.createNotification('warning',obj.usrs_upto_date); }					
					if(obj.usrs_desc){ Config.createNotification('warning',obj.usrs_desc); }					
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });
	}
	
	editUserResp = (userId, usrsRespCode) => {		
		this.getResponsbilityLovData();
		let $url = `${apiUrl}/userresp/${usrsRespCode}/edit?usrs_user_id=${userId}`;		
		ApiDataService.get($url)
		.then(res => {
			//alert('in side');
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						responsbility: res.data,
						isEditUser: false,
						isAddUser: false,
						isRespUser: false,
						addUpdateRespUser: true
					});	
				}				
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	deleteUserResp  = (userId, usrsRespCode) => {		
		if(window.confirm("Are you sure you want to delete this user responsbility?")){
			if (this._isMounted){ this.setState({ isRespUser:false }); }
			let $url = `${apiUrl}/userresp/`;
			ApiDataService.delete($url,`${usrsRespCode}/${userId}`)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){
						this.setState({	isRespUser:true });
					}
					Config.createNotification('success','User responsbility successfully deleted.');
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
		let UserManagementForm;
		let popupTitle = (this.state.isRespUser)?'User Responsbility':'User';
		let poputSize = 'lg';
		if(this.state.isAddUser || this.state.isEditUser) {
			UserManagementForm = <AddUpdateUserManagement 
									onFormSubmit={this.onFormSubmit}  
									closeModal={this.closeModal} 
									users={this.state.users} />
			popupTitle = (this.state.isEditUser)?'Edit '+popupTitle:'Add '+popupTitle
		}else if(this.state.addUpdateRespUser) {
			UserManagementForm = <AddUpdateUserRespManagement 
									onFormRespSubmit={this.onFormRespSubmit}  
									closeModal={this.closeModal} 
									closeRespFormModal={this.closeRespFormModal} 
									responsbility={this.state.responsbility} 
									usrsUserId ={this.state.usrsUserId}
									resp_lov={this.state.resp_lov} />
			popupTitle = (this.state.usrsUserId)?'Edit Responsbility':'Add Responsbility';
		}
		
		return (	
			
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddUser && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add User</Button></div>} */}
					{(!this.state.isAddUser && !this.state.isDeleteUser) && <UserManagementList editUser={this.editUser} deleteUser={this.deleteUser} openModal={this.onCreate} responsbilityUser={this.responsbilityUser} />}
						
					<NotificationContainer />
					<Modal animation={false} size={poputSize} id="userModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
						    {(!this.state.addUpdateRespUser && this.state.isRespUser) && <UserResponsbilityList editUser={this.editUserResp} deleteUser={this.deleteUserResp} addUserResp={this.addUserResp} usrsUserId={this.state.usrsUserId} />}
							{(this.state.addUpdateRespUser && !this.state.isRespUser) && UserManagementForm }
							{(!this.state.addUpdateRespUser && (this.state.isAddUser || this.state.isEditUser)) && UserManagementForm }							
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

export default UserManagement;