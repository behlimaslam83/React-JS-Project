import React, { Component } from 'react';
import './SeoManagement.scss';
import AddUpdateSeoManagement from './AddUpdateSeoManagement';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
const apiUrl = `admin/portal/`;
class SeoManagement extends Component {
    constructor(props){
        super(props);
		//alert(props.isSeoOpen)
		this._isMounted = true;
		this.state = {
			error: null,		
			response: {}
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);		
    }	
	componentWillMount(){			
				
	}
    // componentDidMount(){}
    componentWillUnmount(){
		this._isMounted = false;
	}

   // componentWillReceiveProps(){}
   // shouldComponentUpdate(){ alert('in'); }
   // componentWillUpdate(){}
   // componentDidUpdate(){}
  
		
	updateDeleteSeoFlag() {
		if (this._isMounted){
			this.setState({ 			
				isDeleteSeo: false
			});
		}
	}
	
	onFormSubmit(data,seoId,forSeo) {
		let $url = (seoId)?`${apiUrl}${forSeo}/seo/update/${seoId}`:`${apiUrl}${forSeo}/seo`;
		let msgType = (seoId)?'updated':'added';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Seo data successfully '+msgType+' for '+forSeo+'.');				
				if (this._isMounted){
					this.setState({
						response: res.data						
					});
				}
				this.props.closeModal();
			}else{
				var obj = res.data.result;
				console.log('obj',obj.seo_parent_id);				
				if(obj){
					if(obj.seo_ref_id){ Config.createNotification('warning',obj.seo_ref_id); }
					if(obj.seo_meta_title){ Config.createNotification('warning',obj.seo_meta_title); }
					if(obj.seo_meta_tag){ Config.createNotification('warning',obj.seo_meta_tag); }
					
					if(obj.seo_meta_key_words){ Config.createNotification('warning',obj.seo_meta_key_words); }
					
					if(obj.seo_meta_desc){ Config.createNotification('warning',obj.seo_meta_desc); }
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
					if(obj.seo_og_title){ Config.createNotification('warning',obj.seo_og_title); }										
					if(obj.seo_og_tag){ Config.createNotification('warning',obj.seo_og_tag); }
					
					if(obj.seo_og_key_words){ Config.createNotification('warning',obj.seo_og_key_words); }										
					if(obj.seo_og_desc){ Config.createNotification('warning',obj.seo_og_desc); }
					if(obj.seo_og_image_width){ Config.createNotification('warning',obj.seo_og_image_width); }										
					if(obj.seo_og_image_height){ Config.createNotification('warning',obj.seo_og_image_height); }
					if(obj.seo_twitter_title){ Config.createNotification('warning',obj.seo_twitter_title); }										
					if(obj.seo_twitter_desc){ Config.createNotification('warning',obj.seo_twitter_desc); }
					
					if(obj.seo_twitter_card){ Config.createNotification('warning',obj.seo_twitter_card); }										
					if(obj.seo_twitter_site){ Config.createNotification('warning',obj.seo_twitter_site); }
					if(obj.seo_active_yn){ Config.createNotification('warning',obj.seo_active_yn); }
					
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });
	}	
	
	deleteSeo  = (seoId, forSeo) => {
		//alert(seoId)
		let $url = `${apiUrl}${forSeo}/seo/`;
		ApiDataService.delete($url,seoId)
		.then(res => {		
			if(res.data.return_status==="0"){
				Config.createNotification('success','Seo record successfully deleted for '+forSeo+'.');				
				this.props.closeModal();
			}else{
				Config.createNotification('warning',res.data.error_message);
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}

	render() {	
		let $props = this.props;
		return (
			<AddUpdateSeoManagement 
								onFormSubmit={this.onFormSubmit} 
								onDeleteSubmit={this.deleteSeo}
								closeModal={$props.closeModal} 
								seoData={$props.seoData} 
								refSysId={$props.refSysId}
								seoFor={$props.seoFor}
							/>
	);
	
  }
}

export default SeoManagement;