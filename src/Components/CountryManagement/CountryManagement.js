import React, { Component } from 'react';
import './CountryManagement.scss';
import { Modal, Container } from 'react-bootstrap';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTimes } from '@fortawesome/free-solid-svg-icons';

import CountryManagementList from './CountryManagementList';
import AddUpdateCountryManagement from './AddUpdateCountryManagement';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SeoManagement from '../Seo/SeoManagement';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/country`;
class CountryManagement extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {
			countries: [],
			seo: [],			
			response: {},
			isAddCountry: false,     
			isEditCountry: false,
			isDeleteCountry:false,
			isOpen:false,
			isAddEditSeo:false,
			refSysId:''
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);		
    }

    openModal = () => this.setState({ isOpen: true });
	closeModal = () => {
		if (this._isMounted){
			this.setState({ 
				isOpen: false,
				isEditCountry: false,
				isAddCountry: false,
				isDeleteCountry:false,
				isAddEditSeo: false,
				refSysId:''
			});
		}
	}
	
	// componentWillMount(){ }
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
				countries: [],
				isAddCountry: true,
				isOpen: true
			});
		}
	}
		
	onFormSubmit(data,countryISO) {		
		let $url = (this.state.isEditCountry)?`${apiUrl}/update/${countryISO}`:apiUrl;
		let msgType = (countryISO)?'updated':'added';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Country successfully '+msgType+'.');
				if (this._isMounted){
					Config.createNotification('refresh','');
					this.setState({
						response: res.data,
						isAddCountry: false,
						isEditCountry: false,
						isOpen: false
					});
				}
			}else{
				var obj = res.data.result;								
				if(obj.length>0){					
					if(obj.country_iso){ Config.createNotification('warning',obj.country_iso); }
					if(obj.country_desc){ Config.createNotification('warning',obj.country_desc); }
					if(obj.country_ccy_code){ Config.createNotification('warning',obj.country_ccy_code); }
					if(obj.country_ccy_symbol){ Config.createNotification('warning',obj.country_ccy_symbol); }
					if(obj.country_ccy_exch_rate){ Config.createNotification('warning',obj.country_ccy_exch_rate); }
					if(obj.country_from_date){ Config.createNotification('warning',obj.country_from_date); }
					if(obj.country_upto_date){ Config.createNotification('warning',obj.country_upto_date); }					
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
				}else{					
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}

	editCountry = countryISO => {		
		let $url = `${apiUrl}/${countryISO}/edit`;
		ApiDataService.get($url)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						countries: res.data,
						isEditCountry: true,
						isAddCountry: true,
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
	
	deleteCountry  = (countryISO) => {		
		if(window.confirm("Are you sure you want to delete this country?")){
			if (this._isMounted){ this.setState({ isDeleteCountry:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,countryISO)
			.then(res => {		
				if(res.data.return_status==="0"){				
					if (this._isMounted){
						this.setState({	isDeleteCountry:false });
					}
					Config.createNotification('success','Country successfully deleted.');	
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	seoCountry = countryISO => {		
		let $url = `${apiUrl}/seo/${countryISO}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,						
						isAddEditSeo: true,						
						isOpen: true,
						refSysId:countryISO
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
		let countryForm;
		let popupTitle = 'Country';
		let poputSize = '';
		if(this.state.isAddCountry || this.state.isEditCountry) {
		  countryForm = <AddUpdateCountryManagement 
							onFormSubmit={this.onFormSubmit}  
							closeModal={this.closeModal} 
							countries={this.state.countries} 
						/>
		}
		let seoForm;	
		if(this.state.isAddEditSeo) {
			seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.closeModal} refSysId={this.state.refSysId} seoFor='country' />
			popupTitle = 'Seo';
			poputSize = 'lg';
		}
		
		return (	
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddCountry && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Country</Button></div>}  */}
					{/* {(!this.state.isAddCountry && !this.state.isDeleteCountry) && <CountryManagementList editCountry={this.editCountry} deleteCountry={this.deleteCountry} seoCountry={this.seoCountry} openModal={this.onCreate} />} */}
					<CountryManagementList editCountry={this.editCountry} deleteCountry={this.deleteCountry} seoCountry={this.seoCountry} openModal={this.onCreate} />
					<NotificationContainer />
					<Modal animation={false} size={poputSize} id="countryModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditCountry)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ countryForm }
							{ seoForm }
						</Modal.Body>
						{/*<Modal.Country>
						  <Button variant="secondary" onClick={this.closeModal}>Close</Button>
						</Modal.Country>*/}
					</Modal>					
					<Container></Container>            
				</div>
			}/>
		);	
	}
}

export default CountryManagement;