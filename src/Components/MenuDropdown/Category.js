import React, { Component } from 'react';
import './Category.scss';
import { Modal, Container } from 'react-bootstrap';
import CategoryList from './CategoryList';
import AddUpdateCategory from './AddUpdateCategory';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SeoManagement from '../Seo/SeoManagement';
import { WindowPanel } from "../../WindowPanel";
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const apiUrl = `admin/portal/category`;
class Category extends Component {
    constructor(props){
        super(props);
		this._isMounted = true;
		this.state = {			
			categories: [],
			seo: [],
			languages: [],
			response: {},
			isAddCategory: false,     
			isEditCategory: false,
			isDeleteCategory:false,
			isOpen:false,
			isAddEditSeo:false,
			hideLangField: '',
			refSysId:''
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);		
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
	//componentDidMount(){}
	componentWillUnmount(){		
		this._isMounted = false;
	}

	// componentWillReceiveProps(){}
	// shouldComponentUpdate(){ }
	// componentWillUpdate(){ }
	// componentDidUpdate(){ }
	
	openModal = () => {		
		this.setState({ isOpen: true });
	}
	closeModal = () => {		
		if (this._isMounted){			
			this.setState({ 
				isOpen: false,
				isEditCategory: false,
				isAddCategory: false,
				isDeleteCategory:false,
				isAddEditSeo: false,
				refSysId:''
			});
		}
	}
  
	onCreate = () => {		
		if (this._isMounted){
			this.setState({ 
				categories: [],				
				isAddCategory: true,
				isOpen: true,
				hideLangField: ''
			});
		}
	}
		
	onFormSubmit(data,catId) {
		let $langUrl = (this.state.isEditCategory && data.get('lang_code')!=="en")?`${apiUrl}/lang/update/${catId}`:`${apiUrl}/update/${catId}`;
		let $url = (this.state.isEditCategory)?$langUrl:apiUrl;
		let msgType = (catId)?'updated':'added';
		ApiDataService.post($url,data)
		.then(res => {			
			if(res.data.return_status==="0"){
				Config.createNotification('success','Category successfully '+msgType+'.');
				if (this._isMounted){
					Config.createNotification('refresh','');
					this.setState({
						response: res.data,
						isAddCategory: false,
						isEditCategory: false,
						isOpen: false
					});
				}
			}else{
				var obj = res.data.result;
				//console.log('obj',obj.cate_parent_id);				
				if(Object.entries(obj).length>0){					
					if(obj.cate_desc){ Config.createNotification('warning',obj.cate_desc); }
					if(obj.cate_ordering){ Config.createNotification('warning',obj.cate_ordering); }
					if(obj.cate_from_date){ Config.createNotification('warning',obj.cate_from_date); }
					if(obj.cate_upto_date){ Config.createNotification('warning',obj.cate_upto_date); }
					if(obj.cate_parent_id){ Config.createNotification('warning',obj.cate_parent_id); }
					if(obj.avatar){ Config.createNotification('warning',obj.avatar); }
					
					if(obj.avatar_icon){ Config.createNotification('warning',obj.avatar_icon); }
					if(obj.avatar_mobile_P){ Config.createNotification('warning',obj.avatar_mobile_P); }
					if(obj.avatar_mobile_L){ Config.createNotification('warning',obj.avatar_mobile_L); }
				}else{
					if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
				}
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });	
	}

	editCategory = categoryId => {		
		let $url = `${apiUrl}/${categoryId}/edit`;
		ApiDataService.get($url)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						categories: res.data,
						isEditCategory: true,
						isAddCategory: true,
						isOpen: true,
						hideLangField: '',
					});
				}
			}else{				
				Config.createNotification('warning',res.data.error_message);
				this.setState({					
					isEditCategory: false,
					isAddCategory: false,
					isOpen: false
				});
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	deleteCategory  = (categoryId) => {		
		if(window.confirm("Are you sure you want to delete this category?")){
			if (this._isMounted){ this.setState({ isDeleteCategory:true }); }
			let $url = `${apiUrl}/`;
			ApiDataService.delete($url,categoryId)
			.then(res => {		
				if(res.data.return_status==="0"){
					Config.createNotification('success','Category successfully deleted.');
					Config.createNotification('refresh','');
				}else{
					Config.createNotification('warning',res.data.error_message);
				}
				if (this._isMounted){
					this.setState({	isDeleteCategory:false });
				}				
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
		}
	}
	
	editLanguageCategory = (categoryId,langCode) => {		
		let $url = `${apiUrl}/lang/${categoryId}/edit`;
		ApiDataService.get($url,langCode)
		.then(res => {		
			if(res.data.return_status==="0"){
				if (this._isMounted){
					this.setState({
						categories: res.data,
						isEditCategory: true,
						isAddCategory: true,						
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
	
	seoCategory = categoryId => {		
		let $url = `${apiUrl}/seo/${categoryId}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,
						isAddEditSeo: true,						
						isOpen: true,
						refSysId:categoryId
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
		let categoryForm;
		let popupTitle = 'Category';
		let poputSize = '';
		if(this.state.isAddCategory || this.state.isEditCategory) {		  
		  categoryForm = <AddUpdateCategory 
							onFormSubmit={this.onFormSubmit}  
							closeModal={this.closeModal} 
							categories={this.state.categories} 							
							languages={this.state.languages} 
							hideLangField={this.state.hideLangField} />
		}
		let seoForm;	
		if(this.state.isAddEditSeo) {
		  seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.closeModal} refSysId={this.state.refSysId} seoFor='category' />
		  popupTitle = 'Seo';
		  poputSize = 'lg';
		}
		//alert(this.state.isDeleteCategory)
		return (	
			<WindowPanel rawHtml={
				<div className="windowContent">				
					{/* {!this.state.isAddCategory && <div className="add-actions-btn"><Button variant="primary" onClick={() => this.onCreate() }>Add Category</Button></div>}  */}
					{/* {(!this.state.isAddCategory && !this.state.isDeleteCategory) && <CategoryList editCategory={this.editCategory} deleteCategory={this.deleteCategory} seoCategory={this.seoCategory} openModal={this.onCreate} editLanguageCategory={this.editLanguageCategory} />} */}
					<CategoryList editCategory={this.editCategory} deleteCategory={this.deleteCategory} seoCategory={this.seoCategory} openModal={this.onCreate} editLanguageCategory={this.editLanguageCategory} />
					<NotificationContainer />
					<Modal animation={false} size={poputSize} id="categoryModal" show={this.state.isOpen} onHide={this.closeModal}>
						<Modal.Header closeButton>
							<Modal.Title>{(this.state.isEditCategory)?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{ categoryForm }
							{ seoForm }
						</Modal.Body>
						{/*<Modal.Footer>
						  <Button variant="secondary" onClick={this.closeModal}>Close</Button>
						</Modal.Footer>*/}
					</Modal>
					
					<Container>
					
					</Container>            
				</div>
			}/>
		);
		
	}
}

export default Category;