
import React, { Component } from 'react';
import './ItemInfo.scss';
import { Col, Form, Modal, Card, Spinner, Tabs, Tab, Button, Table, Collapse } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from 'prop-types';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

//import ItemInfoObject from '../ItemInfo/ItemInfoObject';
// import ItemInfoProduct from '../ItemInfo/ItemInfoProduct';
import DatePicker from "react-datepicker";

import moment from 'moment';


const insertUrl = 'admin/portal/iteminfo';
const Api_Productlov = 'admin/portal/iteminfo/product_lov';
const Api_Itemlov = 'admin/portal/iteminfo/item_lov';
const Api_Countrylov = 'admin/portal/iteminfo/country_lov';
const Api_BorderFamily_lov = 'admin/portal/iteminfo/borderFamily_lov';

const light_effect_lov = 'admin/portal/iteminfo/light_effect_lov';


class ItemInfoModal extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      item_info_code					          : '',
      item_info_id						          : '',
      item_info_uom				              : '',
      item_info_desc					          : '',
      item_info_if_code					        : '',
      item_info_if_desc					        : '',
      item_info_collection_code			    : '',
      item_info_collection_desc			    : '',
      item_info_brand_code				      : '',
      item_info_brand_desc				      : '',
      item_info_color_code				      : '',
      item_info_color_image_path		    : '',
      item_info_color_group_code		    : '',
      item_info_material_type_code	    : '',
      item_info_material_type_desc	    : '',
      item_info_component_code			    : '',
      item_info_component_desc			    : '',
      item_info_tag						          : '',
      item_info_width					          : '',
      item_info_length					        : '',
      item_info_uses					          : '',
      item_info_thickness				        : '',
      item_info_repeat_design			      : '',
      item_info_weight					        : '',
      item_info_tooltip					        : '',
      item_info_more					          : '',
      avatar_mobile		                  : '',
      avatar_desktop	                  : '',
      avatar_tablet		                  : '',
      avatar_mobile_L                   : '',
      avatar_mobile_P		                : '',
      item_info_texture_type			      : '',
      item_info_pattern_code		        : '',
      item_info_pattern_desc            : '',
      item_info_thumbnail_image_path	  : '',
      item_info_ordering				        : '',
      item_info_product_max_height		  : '',
      item_info_border_family			      : '',
      item_info_customizable_yn				  : 'N',
      item_info_price						        : '',
      item_info_currency					      : '',
      item_info_country_specific_price	: 'N',
      item_info_price_band					    : '',
      item_info_lead_time					      : '',
      item_info_min_stock			          : '',
      item_info_free_stock              : '',
      options                           : '',
      country_of_origin		              : '',
      item_info_status				          : '',
      item_info_active_yn			          : 'N',
      item_info_sample_yn			          : 'N',
      item_type			                    : '',
      brand_imge_path			              : '',
      lang_code							            : 'en',
      created_user_id					          : '',
      created_date					            : '',
      updated_user_id					          : '',
      updated_date                      : '',
      no_image_path                     : '',
      item_link_title                   : '',
      item_link_url                     : '',
      item_link_url_slug                : '',
      light_code					              : '',
      effect_type				                : '',
      displacement_image_path			      : '',
      normal_image_path				          : '',
      occ_image_path				            : '',
      back_side_image_path			        : '',
      repeat_texture_x			            : '',
      repeat_texture_y			            : '',
      light_intensity			              : '',
      cord_texture				              : '',
      ladder_texture				            : '',
      cord_repeat_texture_x			        : '',
      cord_repeat_texture_y		          : '',
      ladder_repeat_texture_x		        : '',
      ladder_repeat_texture_y		        : '',
      shininess		                      : '',
      bumpscale		                      : '',
      displacement_scale		            : '',
      errors                            : {},
      sysid                             : '',
      mobileimagePreviewUrl             : '',
      desktopimagePreviewUrl            : '',
      tabletimagePreviewUrl             : '',
      horizontalimagePreviewUrl         : '',
      verticalimagePreviewUrl           : '',
      thumbnailimagePreviewUrl          : '',
      displacement_image_preview        : '',
      normal_image_preview              : '',
      occ_image_preview                 : '',
      back_side_image_preview           : '',
      cord_image_preview                : '',
      ladder_image_preview              : '',
      diffuse_image_preview             : '',
      brand_image_preview               : '',
      productlov                        : [],
      itemlov                           : [],
      editor                            : EditorState.createEmpty(),
      editorHTML                        : '',
      showCode                          : false,
      editablecontent                   : '',
      showDiv                           : false,
      objectlov                         : [],
      objectArray                       : [],
      inputValue                        : '',
      selectedValue                     : '',
      product                           : '',
      countrylov                        : [],
      border_family_selected            : '',
      light_lov                         : [],
      effect_lov                        : [],
      texture_lov                       : [],
      loader                            : false,
      prodFilterTagValue                : '',
      lightvalueArray                   : [],
      valueArray                        : [], 
      set: [],
      flaglist: [],
      selectedFlag: [],
      fetch: [],
      show: false,
      open : [{0 : false}],
      startDate: new Date(),
      endDate: moment("31/Dec/2099", 'DD-MMM-YYYY').toDate(),

      mobile_image_error : '',
      desktop_image_error: '',
      horizontal_image_error: '',
      vertical_image_error: '',
      thumbnail_image_error: '',
      displacement_image_error: '',
      normal_image_error: '',
      occ_image_error: '',
      back_side_image_error: '',
      cord_image_error: '',
      ladder_image_error: '',
      diffuse_image_error: '',
      brand_image_error: '',
      avatar_tablet_image_error: '',

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeLight = this.onChangeLight.bind(this);
    //this.handleCheckChange = this.handleCheckChange.bind(this);
    
  

    this.ref = React.createRef();

  }

  static propTypes = {
		editorState: PropTypes.instanceOf(EditorState),
		onEditorStateChange: PropTypes.func
	}

  

  setOpen(type, key){
    let open = [...this.state.open];

  //  var open = this.state.open[key];
    open[key] = !type;
    this.setState({open});
  }


  changeDate(key, child_key, data, mode){
    // console.log(key);
    // console.log(child_key);
    // console.log(moment(data).format('DD-MMM-YYYY'));
    // console.log(mode);
    //console.log(data);
    
    
    // for(var i=0; i < this.state.tr.length; i++)
    // {
    //   for(var j=0; j < this.state.tr[key].child_tr.length; j++)
    //   {
      
    //     if(child_key == j && mode == 'FD'){
    //       this.state.tr[key].child_tr[child_key].from_date = moment(data).format('DD-MMM-YYYY');
    //     }
    //     if(child_key == j && mode == 'UD'){
    //       this.state.tr[key].child_tr[child_key].upto_date = moment(data).format('DD-MMM-YYYY');
    //     }
    //   }
    // }
    //console.log(this.state.tr);
    //this.props.productRecord(this.state.tr);
    
    // var format = moment(data).format('DD-MMM-YYYY');
    //var end_format = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
    //(mode === 'FD' ? this.setState({ startDate: data }) : this.setState({ endDate: data }));
    //(mode === 'UD' ? this.setState({ from_date: end_format }) : this.setState({ upto_date: end_format }));
  }

  onChangeLight(value, { action, removedValue }) {
    this.state.lightvalueArray = [];

    // console.log(value);
    // console.log(action);
    // console.log(removedValue);
    
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        value = this.props.data.light_lov.filter(v => v.isFixed);
        break;
    }
    
    this.setState({ value: value });
    
    for (var i = 0; i < value.length;i++){
      this.state.lightvalueArray.push(value[i].value);
    }
      
    this.setState({ light_code: this.state.lightvalueArray.join(',') });

  }
 

  toggleShow = () => this.setState((currentState) => ({showDiv: !currentState.showDiv}));


  onChange = value => {
    this.setState({ border_family_selected: value });
    this.setState({ item_info_border_family: value.code });
  }

  componentWillMount(){
    // ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Productlov)
		// 	.then(response => {	
		// 	  this.setState({
    //       productlov: response.data.result
    //     });
    // }).catch(function(error){			
      
    // });

    // ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Countrylov)
		// 	.then(response => {	
		// 	  this.setState({
    //       countrylov: response.data.result
    //     });
    // }).catch(function(error){			
      
    // });

    // ApiDataService.get(process.env.REACT_APP_SERVER_URL + light_effect_lov)
    // .then(response => {	
    //   this.setState({
    //     light_lov: response.data.LIGHT,
    //     effect_lov: response.data.EFFECT,
    //     texture_lov: response.data.TEXTURE_TYPE,
    //     item_type_lov: response.data.ITEM_TYPE
    //   });
    // }).catch(function(error){			
      
    // });
    
   
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.props.show && !prevProps.show) {
      this.setform_input();

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Productlov)
			.then(response => {	
			  this.setState({
          productlov: response.data.result
        });
      }).catch(function(error){			
        
      });

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Countrylov)
        .then(response => {	
          this.setState({
            countrylov: response.data.result
          });
      }).catch(function(error){			
        
      });

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + light_effect_lov)
      .then(response => {	
        this.setState({
          light_lov: response.data.LIGHT,
          effect_lov: response.data.EFFECT,
          texture_lov: response.data.TEXTURE_TYPE,
          item_type_lov: response.data.ITEM_TYPE
        });
      }).catch(function(error){			
        
      });
    }
  }

  deleteModalRecord=(id)=>{
    ApiDataService.delete(`${insertUrl}/`,id).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.props.errorMessage(response.data.result, "ERR-OBJ");
        } else {
          this.props.errorMessage(response.data.error_message, "ERR");
        }
      } else {
        this.props.errorMessage(response.data.error_message, "DONE");
        this.props.renderTable();
      }
      this.closedialog();
    }).catch((error) => {
      this.props.errorMessage(error.message, "ERR");
      this.closedialog();
    });
  }

 
  editModalRecord=(id, type = false)=>{ 
    var flag=[];
    var setIndex=[];
    
    this.setState({ 
      sysid : id,
      loader : true
    });
    ApiDataService.get(`${insertUrl}/${id}/edit`).then(response => {
      this.setState({ loader : false });
      let resp = response.data.result[0];
     
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
        
        if (key === 'repeat_texture'){
          this.setState({ 'repeat_texture_x' : value.split(',')[0] });
          this.setState({ 'repeat_texture_y' : value.split(',')[1] });
        }
        if (key === 'cord_repeat_texture'){
          this.setState({ 'cord_texture_x' : value.split(',')[0] });
          this.setState({ 'cord_texture_y' : value.split(',')[1] });
        }
        if (key === 'ladder_repeat_texture'){
          this.setState({ 'ladder_repeat_texture_x' : value.split(',')[0] });
          this.setState({ 'ladder_repeat_texture_y' : value.split(',')[1] });
        }
        if (key === 'item_info_more'){
          this.setState({ value, editorState: ItemInfoModal.generateEditorStateFromValue(value) })
        }
        if (key === 'selectedFlag'){
         
          this.state.countrylov.forEach(function (val, key) {
            value.filter(function (e) {
              if(e == val.iso_code){
                setIndex[key] = Number(key);
                flag.push(val.iso_code);
              }
            });
          
          });
          this.setState({ 
            set: setIndex,
            selectedFlag: flag
          })
        }else if (key === 'item_info_mobile_image_path'){
          this.setState({ mobileimagePreviewUrl: value });
        }  else if (key === 'item_info_desktop_image_path'){
          this.setState({ desktopimagePreviewUrl: value });
        }  else if (key === 'item_info_horizontal_image_path'){
          this.setState({ horizontalimagePreviewUrl: value });
        }  else if (key === 'item_info_vertical_image_path'){
          this.setState({ verticalimagePreviewUrl: value });
        }  else if (key === 'item_info_thumbnail_image_path'){
          this.setState({ thumbnailimagePreviewUrl: value });
        }

        else if (key === 'item_info_tablet_image_path'){
          this.setState({ tabletimagePreviewUrl: value });
        }
        else if (key === 'displacement_image_path'){
          this.setState({ displacement_image_preview: value });
        }else if (key === 'normal_image_path'){
          this.setState({ normal_image_preview: value });
        }else if (key === 'occ_image_path'){
          this.setState({ occ_image_preview: value });
        }  else if (key === 'back_side_image_path'){
          this.setState({ back_side_image_preview: value });
        }  else if (key === 'cord_texture'){
          this.setState({ cord_image_preview: value });
        }  
        
        else if (key === 'ladder_texture'){
          this.setState({ ladder_image_preview: value });
        }  else if (key === 'diffuse_image_path'){
          this.setState({ diffuse_image_preview: value });
        }  else if (key === 'brand_image_path'){
          this.setState({ brand_image_preview: value });
        }else if (key === 'item_info_code'){
          this.setState({ sysid: value });

        } else {
          this.setState({ [key]: value });

        }
        
        // if(key === 'tr'){
        //   console.log(value)
        // }

      });

      if(type == 'copy'){
        this.setState({ 
          item_info_id : '',
          avatar_mobile : '',
          avatar_desktop : '',
          avatar_tablet : '',
          avatar_mobile_L : '',
          avatar_mobile_P : '',
          item_info_thumbnail_image_path : '',
          brand_imge_path : '',
          displacement_image_path : '',
          normal_image_path : '',
          occ_image_path : '',
          back_side_image_path : '',
          cord_texture : '',
          ladder_texture : '', 
          mobileimagePreviewUrl : '',
          desktopimagePreviewUrl : '',
          tabletimagePreviewUrl : '',
          horizontalimagePreviewUrl : '',
          verticalimagePreviewUrl : '',
          thumbnailimagePreviewUrl : '',
          displacement_image_preview : '',
          normal_image_preview : '',
          occ_image_preview : '',
          back_side_image_preview : '',
          cord_image_preview : '',
          ladder_image_preview : '',
          diffuse_image_preview : '',
          brand_image_preview : ''
        });
      }

      //console.log(this.state.sysid);
     // this.ref.current.tabe2(this.state.item_info_country_specific_price);

    }).catch((error)=>{});
  }

  stateChanges = (e) => { 
    const { name, value } = e.target;
    var values = ''; 
	  if (name === 'item_info_active_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }
    else if (name === 'item_info_customizable_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }
    else if (name === 'item_info_sample_yn'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    }else if (name === 'item_info_country_specific_price'){
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
      //this.ref.current.tabe(values);
    }
    else{
      values = value;
    }
    this.setState({ [name]: values });
    
    console.log(this.state)
  }

  validation = () => {
    let fields = this.state;
    let errors={};
    let formIsValid = true;
    
    this.setState({ errors: errors });
    return formIsValid;
  }
  
  setform_input(){
    this.setState({
      item_info_code					          : '',
      item_info_id						          : '',
      item_info_uom				              : '',
      item_info_desc					          : '',
      item_info_if_code					        : '',
      item_info_if_desc					        : '',
      item_info_collection_code			    : '',
      item_info_collection_desc			    : '',
      item_info_brand_code				      : '',
      item_info_brand_desc				      : '',
      item_info_color_code				      : '',
      item_info_color_image_path		    : '',
      item_info_color_group_code		    : '',
      item_info_material_type_code	    : '',
      item_info_material_type_desc	    : '',
      item_info_component_code			    : '',
      item_info_component_desc			    : '',
      item_info_tag						          : '',
      item_info_width					          : '',
      item_info_length					        : '',
      item_info_uses					          : '',
      item_info_thickness				        : '',
      item_info_repeat_design			      : '',
      item_info_weight					        : '',
      item_info_tooltip					        : '',
      item_info_more					          : '',
      avatar_mobile		                  : '',
      avatar_desktop	                  : '',
      avatar_tablet		                  : '',
      avatar_mobile_L                   : '',
      avatar_mobile_P		                : '',
      item_info_texture_type			      : '',
      item_info_pattern_code		        : '',
      item_info_pattern_desc            : '',
      item_info_thumbnail_image_path	  : '',
      item_info_ordering				        : '',
      item_info_product_max_height		  : '',
      item_info_border_family			      : '',
      item_info_customizable_yn				  : 'N',
      item_info_price						        : '',
      item_info_currency					      : '',
      item_info_country_specific_price	: 'N',
      item_info_price_band					    : '',
      item_info_lead_time					      : '',
      item_info_min_stock			          : '',
      item_info_free_stock              : '',
      options                           : '',
      country_of_origin                 : '',
      item_info_status				          : '',
      item_info_active_yn			          : 'N',
      item_info_sample_yn			          : 'N',
      item_type			                    : '',
      brand_imge_path			              : '',
      lang_code							            : 'en',
      created_user_id					          : '',
      created_date					            : '',
      updated_user_id					          : '',
      updated_date                      : '',
      no_image_path                     : '',
      item_link_title                   : '',
      item_link_url                     : '',
      item_link_url_slug                : '',
      light_code					              : '',
      effect_type				                : '',
      displacement_image_path			      : '',
      normal_image_path				          : '',
      occ_image_path				            : '',
      back_side_image_path			        : '',
      repeat_texture_x			            : '',
      repeat_texture_y			            : '',
      light_intensity			              : '',
      cord_texture				              : '',
      ladder_texture				            : '',
      cord_repeat_texture_x			        : '',
      cord_repeat_texture_y		          : '',
      ladder_repeat_texture_x		        : '',
      ladder_repeat_texture_y		        : '',
      shininess		                      : '',
      bumpscale		                      : '',
      displacement_scale		            : '',
      errors                            : {},
      sysid                             : null,
      mobileimagePreviewUrl             : '',
      desktopimagePreviewUrl            : '',
      tabletimagePreviewUrl             : '',
      horizontalimagePreviewUrl         : '',
      verticalimagePreviewUrl           : '',
      thumbnailimagePreviewUrl          : '',
      displacement_image_preview        : '',
      normal_image_preview              : '',
      occ_image_preview                 : '',
      back_side_image_preview           : '',
      cord_image_preview                : '',
      ladder_image_preview              : '',
      diffuse_image_preview             : '',
      brand_image_preview               : '',
      editor                            : EditorState.createEmpty(),
      editorHTML                        : '',
      showCode                          : false,
      editablecontent                   : '',
      showDiv                           : false,
      inputValue                        : '',
      selectedValue                     : '',
      product                           : '',
      border_family_selected            : '',
      //loader                            : false,
      prodFilterTagValue                : '',
      set: [],
      flaglist: [],
      selectedFlag: [],
      fetch: [],
      show: false,
      mobile_image_error : '',
      desktop_image_error: '',
      horizontal_image_error: '',
      vertical_image_error: '',
      thumbnail_image_error: '',
      displacement_image_error: '',
      normal_image_error: '',
      occ_image_error: '',
      back_side_image_error: '',
      cord_image_error: '',
      ladder_image_error: '',
      diffuse_image_error: '',
      brand_image_error: '',
      avatar_tablet_image_error: '',
    });
  }


  handleSubmit(event){
    event.preventDefault();
    if(!this.validation()){
      return false;
    }
    var formData = new FormData();
    
    console.log(this.state, "STATE ALL");
    let Properties = this.state;
    for (var key in Properties) {
      formData.append(key, Properties[key]);
    }
    var url = '';
	  if (this.props.mode==='IS'){
      url = insertUrl;

      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          this.props.errorMessage(response.data.error_message, "DONE");
          this.props.renderTable();
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }else{
      url = `${insertUrl}/update/${this.state.sysid}`;
      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            this.props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          this.props.errorMessage(response.data.error_message, "DONE");
          this.props.renderTable();
        }
      }).catch((error) => {
        console.log(error);
        this.props.errorMessage(error.message, "ERR");
      });
    }
  }

  errorThrough = (error, argu) => {
    //console.log(error,"RULING");
	var erroMessage = '';
    if (argu === 'ERR-OBJ') {
        erroMessage = Object.keys(error).map(function (key) {
			return <ul key={key} className="mrgnone list-unstyled"><li>{error[key]}</li></ul>;
        });
    } else {
       erroMessage = <ul className="mrgnone list-unstyled"><li>{error}</li></ul>;
    }
    var backColor = ((argu === 'ERR' || argu === 'ERR-OBJ') ? '#ff4c4ceb' : '#20bb20eb');
    this.setState({ snapopen: true, snapcolor: backColor });
    this.setState({ error: erroMessage });
  }

  _imageChange(e) {
    console.log(e)
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    var fileSize = parseFloat(file.size / 1024).toFixed(2);
    let name = e.target.name;

    if(name == 'mobile'){
      // let reader = new FileReader();
      // let mobile_image_path = e.target.files[0];

      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_mobile : file,
            mobileimagePreviewUrl: reader.result,
            mobile_image_error: false
          });
        }
      }else{
        this.setState({
          mobile_image_error: true
        });
      }
      //reader.readAsDataURL(mobile_image_path);

    }else if(name == 'hover_image'){
      // let reader = new FileReader();
      // let desktop_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_desktop : file,
            desktopimagePreviewUrl: reader.result,
            desktop_image_error: false
          });
        }
      }else{
        this.setState({
          desktop_image_error: true
        });
      }
      //reader.readAsDataURL(desktop_image_path);

    }else if(name == 'mobile_landscape'){
      // let reader = new FileReader();
      // let horizontal_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_mobile_L : file,
            horizontalimagePreviewUrl: reader.result,
            horizontal_image_error: false
          });
        }
      }else{
        this.setState({
          horizontal_image_error: true
        });
      }
      //reader.readAsDataURL(horizontal_image_path);

    }else if(name == 'mobile_portrait'){
      // let reader = new FileReader();
      // let vertical_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_mobile_P : file,
            verticalimagePreviewUrl: reader.result,
            vertical_image_error: false
          });
        }
      }else{
        this.setState({
          vertical_image_error: true
        });
      }
      //reader.readAsDataURL(vertical_image_path);
    }else if(name == 'thumbnail'){
      // let reader = new FileReader();
      // let thumbnail_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_thumbnail : file,
            thumbnailimagePreviewUrl: reader.result,
            thumbnail_image_error: false
          });
        }
      }else{
        this.setState({
          thumbnail_image_error: true
        });
      }
      //reader.readAsDataURL(thumbnail_image_path);
    }else if(name == 'displacement'){
      // let reader = new FileReader();
      // let displacement_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            displacement_image : file,
            displacement_image_preview: reader.result,
            displacement_image_error: false
          });
        }
      }else{
        this.setState({
          displacement_image_error: true
        });
      }
      //reader.readAsDataURL(displacement_image_path);

    }else if(name == 'normal'){
      // let reader = new FileReader();
      // let normal_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            normal_image : file,
            normal_image_preview: reader.result,
            normal_image_error: false
          });
        }
      }else{
        this.setState({
          normal_image_error: true
        });
      }
     // reader.readAsDataURL(normal_image_path);

    }else if(name == 'occ'){
      // let reader = new FileReader();
      // let occ_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            occ_image : file,
            occ_image_preview: reader.result,
            occ_image_error: false
          });
        }
      }else{
        this.setState({
          occ_image_error: true
        });
      }
      //reader.readAsDataURL(occ_image_path);
    }else if(name == 'back_side'){
      // let reader = new FileReader();
      // let back_side_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            back_side_image : file,
            back_side_image_preview: reader.result,
            back_side_image_error: false
          });
        }
      }else{
        this.setState({
          back_side_image_error: true
        });
      }
      //reader.readAsDataURL(back_side_image_path);
    }else if(name == 'cord'){
      // let reader = new FileReader();
      // let cord_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            cord_image : file,
            cord_image_preview: reader.result,
            cord_image_error: false
          });
        }
      }else{
        this.setState({
          cord_image_error: true
        });
      }
      //reader.readAsDataURL(cord_image_path);
    }else if(name == 'ladder'){
      // let reader = new FileReader();
      // let ladder_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            ladder_image : file,
            ladder_image_preview: reader.result,
            ladder_image_error: false
          });
        }
      }else{
        this.setState({
          ladder_image_error: true
        });
      }
      //reader.readAsDataURL(ladder_image_path);
    }else if(name == 'diffuse_image'){
      // let reader = new FileReader();
      // let diffuse_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            diffuse_image : file,
            diffuse_image_preview: reader.result,
            diffuse_image_error: false
          });
        }
      }else{
        this.setState({
          diffuse_image_error: true
        });
      }
      //reader.readAsDataURL(diffuse_image_path);
    }else if(name == 'avatar_brand'){
      // let reader = new FileReader();
      // let brand_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_brand : file,
            brand_image_preview: reader.result,
            brand_image_error: false
          });
        }
      }else{
        this.setState({
          brand_image_error: true
        });
      }
     // reader.readAsDataURL(brand_image_path);
    }else if(name == 'avatar_tablet'){
      // let reader = new FileReader();
      // let brand_image_path = e.target.files[0];
      if (fileSize <= 200) {
        reader.onloadend = () => {
          this.setState({
            avatar_tablet : file,
            tabletimagePreviewUrl: reader.result,
            avatar_tablet_image_error: false
          });
        }
      }else{
        this.setState({
          avatar_tablet_image_error: true
        });
      }
     // reader.readAsDataURL(brand_image_path);
    }


    reader.readAsDataURL(file)
    

  }

	onEditorStateChange = editorState => {
		this.setState(
			{
				editorState,
				item_info_more: draftToHtml(
					convertToRaw(editorState.getCurrentContent())
				)
			}
		)
	}

	static generateEditorStateFromValue(value) {
		const contentBlock = htmlToDraft(value || '')
		const contentState = ContentState.createFromBlockArray(
			contentBlock.contentBlocks
		)
		return EditorState.createWithContent(contentState)
	}

  handleChange = value => {
    this.setState({
      selectedValue: value 
    });
    

      this.setState({ 'item_info_desc' : value.id });
      this.setState({ 'item_info_tooltip' : value.id });
      this.setState({ 'item_info_code' : value.code });
      this.setState({ 'item_info_id' : value.id });
      this.setState({ 'item_info_uom' : value.uom_code });
      this.setState({ 'item_info_if_code' : value.if_code });
      this.setState({ 'item_info_if_desc' : value.if_desc });
      this.setState({ 'item_info_collection_code' : value.colection_code });
      this.setState({ 'item_info_collection_desc' : value.colection_desc });
      this.setState({ 'item_info_brand_code' : value.brand_code });
      this.setState({ 'item_info_brand_desc' : value.brand_desc });
      this.setState({ 'item_info_color_code' : value.color_code });
      this.setState({ 'item_info_color_image_path' : value.color_image_path });
      this.setState({ 'item_info_color_group_code' : value.color_group_code });
      this.setState({ 'item_info_material_type_code' : value.material_type_code });
      this.setState({ 'item_info_material_type_desc' : value.material_type_desc });
      this.setState({ 'item_info_component_code' : value.component_code });

      this.setState({ 'item_info_component_desc' : value.component_desc });
      this.setState({ 'item_info_tag' : value.tag });
      this.setState({ 'item_info_width' : value.width == null ? 0 :  value.width});
      this.setState({ 'item_info_length' : value.length == null ? 0 :  value.length});
      this.setState({ 'item_info_uses' : value.uses });
      this.setState({ 'item_info_thickness' : value.thickness });
      this.setState({ 'item_info_repeat_design' : value.repeat_design == null ? 0 : value.repeat_design });
      this.setState({ 'item_info_weight' : value.weight == null ? 0 :  value.weight});

      this.setState({ 'item_info_pattern_code' : value.pattern_code });
      this.setState({ 'item_info_pattern_desc' : value.pattern_desc });
      this.setState({ 'item_info_status' : value.status });

      let _url = value.id.replace(/[^A-Z0-9]+/ig, "-");
      this.setState({ 'item_link_url' : _url.replace(/-$/,"").toLowerCase()});
      this.setState({ 'item_link_title' : value.id});

  };

  handleInputChange = value => {
    this.setState({
      inputValue: value 
    });
  };

  loadOptions = (inputValue) => {
    const itemFetch = ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Itemlov +'/'+ inputValue)
    .then(response => {	
        return response.data;
      });
    return itemFetch;
   };

  loadFamily = (inputValue) => {
    const itemFamily = ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_BorderFamily_lov +'/'+ inputValue)
    .then(response => {	
      return response.data;
    });
    return itemFamily;
  };


  mapOptionsToValues = options => {
    return options.map(option => ({
      value: option.id,
      label: option.name
    }));
  };
 
 
  checkboxRecord=(id)=>{
    this.setState({'item_info_country_specific_price' : id});
    console.log(this.state);
  }
  
  selectFlag = (e, ind, param) => {
    let checkFlagExist = this.state.selectedFlag;
    let checkActive = this.state.set;

    if (checkFlagExist.indexOf(param) != -1) {
        checkFlagExist.splice(checkFlagExist.indexOf(param), 1);
        checkActive[ind] = 'N';
    } else {
        checkFlagExist.push(param);
        checkActive[ind] = ind;
    }
    this.setState({
        set: checkActive,
        selectedFlag: checkFlagExist
    });
    console.log(this.state);
  }

  tab(e){
    let {text} = e.target;
    if(text == 'Product'){
      this.setState({show: true});
    }
  }


 
  render(){
    const setValue = this.state;

    let { mobileimagePreviewUrl, desktopimagePreviewUrl, tabletimagePreviewUrl, 
      horizontalimagePreviewUrl, verticalimagePreviewUrl, thumbnailimagePreviewUrl, light_lov,
      productlov, showDiv, displacement_image_preview, normal_image_preview, 
      occ_image_preview, back_side_image_preview, cord_image_preview, 
      ladder_image_preview, diffuse_image_preview, brand_image_preview, set
    } = this.state;
    
    let $imagePreview = (<div className="previewText"><center><img className="imgWidth" src={this.state.no_image_path}/></center></div>);

    let $mobileimagePreview =   mobileimagePreviewUrl ? (<center><img className="imgWidth" src={mobileimagePreviewUrl} /></center>) : $imagePreview;
    let $desktopimagePreview =  desktopimagePreviewUrl ? (<center><img className="imgWidth" src={desktopimagePreviewUrl} /></center>) : $imagePreview;
    let $tabletimagePreview =  tabletimagePreviewUrl ? (<center><img className="imgWidth" src={tabletimagePreviewUrl} /></center>) : $imagePreview;
    let $horizontalimagePreview =  horizontalimagePreviewUrl ? (<center><img className="imgWidth" src={horizontalimagePreviewUrl} /></center>) : $imagePreview;
    let $verticalimagePreview =  verticalimagePreviewUrl ? (<center><img className="imgWidth" src={verticalimagePreviewUrl} /></center>) : $imagePreview;
    let $thumbnailimagePreview =  thumbnailimagePreviewUrl ? (<center><img className="imgWidth" src={thumbnailimagePreviewUrl} /></center>) : $imagePreview;
 
    let $displacement_image_preview =  displacement_image_preview ? (<center><img className="imgWidth" src={displacement_image_preview} /></center>) : $imagePreview;
    let $normal_image_preview =  normal_image_preview ? (<center><img className="imgWidth" src={normal_image_preview} /></center>) : $imagePreview;
    let $occ_image_preview =  occ_image_preview ? (<center><img className="imgWidth" src={occ_image_preview} /></center>) : $imagePreview;
    let $back_side_image_preview =  back_side_image_preview ? (<center><img className="imgWidth" src={back_side_image_preview} /></center>) : $imagePreview;
    let $cord_image_preview =  cord_image_preview ? (<center><img className="imgWidth" src={cord_image_preview} /></center>) : $imagePreview;
    let $ladder_image_preview =  ladder_image_preview ? (<center><img className="imgWidth" src={ladder_image_preview} /></center>) : $imagePreview;
    let $diffuse_image_preview =  diffuse_image_preview ? (<center><img className="imgWidth" src={diffuse_image_preview} /></center>) : $imagePreview;
    let $brand_image_preview =  brand_image_preview ? (<center><img className="imgWidth" src={brand_image_preview} /></center>) : $imagePreview;
    
    
    var prodlovArray=[];
    for (var i = 0; i < productlov.length;i++){
      prodlovArray.push({ value: productlov[i].id, label: productlov[i].desc});
    }

    var prodFilterTags = this.state.product.split(',');

    var prodFilterTagValue = [];
    for (var i = 0; i < prodFilterTags.length;i++){
      prodFilterTagValue.push(prodlovArray.filter((item) => item.value === prodFilterTags[i])[0]);
    }
    
    this.state.prodFilterTagValue = prodFilterTagValue;

    var lightlovArray=[];
    for (var i = 0; i < light_lov.length;i++){
      lightlovArray.push({ value: light_lov[i].code, label: light_lov[i].desc});
    }

    var lightTags = this.state.light_code.split(',');

    var lightTagValue = [];
    for (var i = 0; i < lightTags.length;i++){
      lightTagValue.push(lightlovArray.filter((item) => item.value === lightTags[i])[0]);
    }
    

    let security = this.props.security_access;
    let theis = this;
    //console.log(setValue.loader)
    return (
    <div>
        <Modal className="item-modal" animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal}>
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Item Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          {setValue.loader == true ?
            <Col className="popupSpinner">
              <Spinner animation="grow" variant="dark" />
            </Col>
          : ''}

            <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
            
              <Col className="d-none">
                <Form.Group>
                <Form.Control value={(setValue.lang_code == null) ? 'en' : setValue.lang_code} type="text" name="lang_code" placeholder="Language" />
                </Form.Group>
              </Col>

              <Tabs defaultActiveKey="info" id="uncontrolled-tab-example" className="mb-3" onClick={(e) => this.tab(e)}>
                
                <Tab eventKey="info" title="Info">
                  <Form.Row>
                    <Col sm={7}> 
                      <Form.Row>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.stateChanges} checked={setValue.item_info_active_yn==='Y' ? true : false} type="checkbox" name="item_info_active_yn" label="Active" />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.stateChanges} checked={setValue.item_info_customizable_yn==='Y' ? true : false} type="checkbox" name="item_info_customizable_yn" label="Customizable" />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.stateChanges} checked={setValue.item_info_sample_yn==='Y' ? true : false} type="checkbox" name="item_info_sample_yn" label="Sample Allow" />
                          </Form.Group>
                        </Col>
                        {/* <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.stateChanges} checked={setValue.item_info_country_specific_price==='A' ? true : false} type="checkbox" name="item_info_country_specific_price" label="Country Specific Price" />
                          </Form.Group>
                        </Col> */}

                      </Form.Row>

                      <Form.Row>
                      <Col>
                        <Form.Label>Item</Form.Label>
                        {this.props.mode === 'IS' ?
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            value={this.state.selectedValue}
                            getOptionLabel={e => e.desc}
                            getOptionValue={e => e.id}
                            loadOptions={this.loadOptions}
                            onInputChange={this.handleInputChange}
                            onChange={this.handleChange}
                          />
                        : <Col><h6><b>{setValue.item_info_id}</b></h6></Col>}
                      </Col>
          
                    </Form.Row>
      

                      {/* <Form.Row>
                        <Col>
                          <Form.Group> 
                            <Form.Label>Product</Form.Label>
                            
                              <Select
                                value={prodFilterTagValue}
                                isMulti
                                name="prod_filter_tags"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.onChange}
                                options={prodlovArray}
                              />
                            </Form.Group>
                        </Col>
                      </Form.Row>          */}
                    
                      <Form.Row>          
                        <Col>
                          <Form.Group>
                            <Form.Label>Description</Form.Label>
                              <Form.Control onChange={this.stateChanges} value={setValue.item_info_desc} type="text" name="item_info_desc" placeholder="Description" />
                              {this.state.errors["item_info_desc"] &&
                                <span className='custError'>{this.state.errors["item_info_desc"]}</span>
                              }
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Tooltip</Form.Label>
                              <Form.Control onChange={this.stateChanges} value={setValue.item_info_tooltip} type="text" name="item_info_tooltip" placeholder="Tooltip" />
                              {this.state.errors["item_info_tooltip"] &&
                                <span className='custError'>{this.state.errors["item_info_tooltip"]}</span>
                              }
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      
                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Ordering</Form.Label>
                              <Form.Control onChange={this.stateChanges} value={setValue.item_info_ordering} type="text" name="item_info_ordering" placeholder="Ordering" />
                              {this.state.errors["item_info_ordering"] &&
                                <span className='custError'>{this.state.errors["item_info_ordering"]}</span>
                              }
                          </Form.Group>
                        </Col>
                      
                      </Form.Row>

                      <Form.Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Weight</Form.Label>
                                <Form.Control type="text" value={setValue.item_info_weight} onChange={this.stateChanges} name="item_info_weight" placeholder="Weight" />
                                {this.state.errors["item_info_weight"] &&
                                  <span className='custError'>{this.state.errors["item_info_weight"]}</span>
                                }
                            </Form.Group>

                          </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Item Status</Form.Label>
                              <Form.Control type="text" value={setValue.item_info_status} onChange={this.stateChanges} name="item_info_status" placeholder="Item Status" />
                              {this.state.errors["item_info_status"] &&
                                <span className='custError'>{this.state.errors["item_info_status"]}</span>
                              }
                          </Form.Group>
                        </Col>
                      </Form.Row>
                        
                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Product Max Height</Form.Label>
                              <Form.Control type="text" value={setValue.item_info_product_max_height} onChange={this.stateChanges} name="item_info_product_max_height" placeholder="Product Max Height" />
                              {this.state.errors["item_info_product_max_height"] &&
                                <span className='custError'>{this.state.errors["item_info_product_max_height"]}</span>
                              }
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Lead Time</Form.Label>
                              <Form.Control type="text" value={setValue.item_info_lead_time} onChange={this.stateChanges} name="item_info_lead_time" placeholder="Lead Time" />
                              {this.state.errors["item_info_lead_time"] &&
                                <span className='custError'>{this.state.errors["item_info_lead_time"]}</span>
                              }
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      
                      <Form.Row>
                        {/* <Col>
                          <Form.Group> 
                            <Form.Label>Price Band</Form.Label>
                            <Form.Control as="select" value={setValue.item_info_price_band} name="item_info_price_band" onChange={this.stateChanges}>
                              <option>Select Price Band</option>
                            
                            </Form.Control>
                          </Form.Group> borderFamilylov
                        </Col> */}
                      

                        <Col>
                          
                          <Form.Group>
                            <Form.Label>Border Family</Form.Label>

                            {this.props.mode === 'IS' ?
                              <AsyncSelect
                                cacheOptions
                                defaultOptions
                                value={this.state.border_family_selected}
                                getOptionLabel={e => e.desc}
                                getOptionValue={e => e.id}
                                loadOptions={this.loadFamily}
                                onInputChange={this.handleInputChange}
                                onChange={this.onChange}
                              />
                            : <Col><h6><b>{setValue.item_info_border_family}</b></h6></Col>}


                            {/* <Select
                              value={borderFamilyArray.filter(function (option) {
                                return option.value === setValue.item_info_border_family;
                              })}
                              name="item_info_border_family"
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.onChange}
                              options={borderFamilyArray}

                            /> */}
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Texture Type</Form.Label>
                            
                            <Form.Control as="select" value={setValue.item_info_texture_type} name="item_info_texture_type" onChange={this.stateChanges}>
                              <option>Select Texture Type</option>
                                {setValue.texture_lov && setValue.texture_lov.map((data,i) => (
                                    <option value={data.CODE} key={i}>{data.DESCRIPTION}</option>
                                ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Item Type</Form.Label>
                            
                            <Form.Control as="select" value={setValue.item_type} name="item_type" onChange={this.stateChanges}>
                              <option>Select Item Type</option>
                                {setValue.item_type_lov && setValue.item_type_lov.map((data,i) => (
                                    <option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
                                ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Minimum Stock</Form.Label>
                              <Form.Control type="text" value={setValue.item_info_min_stock} onChange={this.stateChanges} name="item_info_min_stock" placeholder="Minimum Stock" />
                              {this.state.errors["item_info_min_stock"] &&
                                <span className='custError'>{this.state.errors["item_info_min_stock"]}</span>
                              }
                          </Form.Group>
                        </Col>  

                        <Col>
                          <Form.Group>
                            <Form.Label>Free Stock</Form.Label>
                              <Form.Control type="text" value={setValue.item_info_free_stock} onChange={this.stateChanges} name="item_info_free_stock" placeholder="Free Stock" readOnly />
                              {this.state.errors["item_info_free_stock"] &&
                                <span className='custError'>{this.state.errors["item_info_free_stock"]}</span>
                              }
                          </Form.Group>
                        </Col>       
                        
                      </Form.Row>

                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Options</Form.Label>
                            <Form.Control type="text" value={setValue.options} onChange={this.stateChanges} name="options" placeholder="Options" />
                            {this.state.errors["options"] &&
                              <span className='custError'>{this.state.errors["options"]}</span>
                            }
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Country of Origin</Form.Label>
                            <Form.Control type="text" value={setValue.country_of_origin} onChange={this.stateChanges} name="country_of_origin" placeholder="Country of Origin"/>
                            {this.state.errors["country_of_origin"] &&
                              <span className='custError'>{this.state.errors["country_of_origin"]}</span>
                            }
                          </Form.Group>
                        </Col>

                      </Form.Row>

                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Link Title {setValue.item_link_title}</Form.Label>
                              <Form.Control type="text" value={setValue.item_link_title} onChange={this.stateChanges} name="item_link_title" placeholder="Link Title" />
                              {this.state.errors["item_link_title"] &&
                                <span className='custError'>{this.state.errors["item_link_title"]}</span>
                              }
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Link Url</Form.Label>
                              <Form.Control type="text" value={setValue.item_link_url} onChange={this.stateChanges} name="item_link_url" placeholder="Link Url" />
                              {this.state.errors["item_link_url"] &&
                                <span className='custError'>{this.state.errors["item_link_url"]}</span>
                              }
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <Form.Label>Slug Url</Form.Label>
                              <Form.Control type="text" value={setValue.item_link_url_slug} onChange={this.stateChanges} name="item_link_url_slug" placeholder="Slug Url" />
                              {this.state.errors["item_link_url_slug"] &&
                                <span className='custError'>{this.state.errors["item_link_url_slug"]}</span>
                              }
                          </Form.Group>
                        </Col>
                      </Form.Row>



                      <Form.Row>
                      

                        <Col>
                        <Form.Label>Features</Form.Label>

                          <Editor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange} />
                        </Col>
                      </Form.Row>


                      <Form.Row>
                        <Col className="mb-3">
                          <Card bg="light" border="success">
                          <Card.Header onClick={this.toggleShow}>Optional</Card.Header>
                          {showDiv && 
                          <Card.Body>
                            <Col>
                              <Form.Group>
                                <Form.Label>Currency</Form.Label>
                                <Form.Control as="select" value={setValue.item_info_currency} name="item_info_currency" onChange={this.stateChanges}>
                                  <option>Select Currency</option>
                                  {this.state.countrylov && this.state.countrylov.map((data,i) => (
                                    <option value={data.currency_code} key={i}>{`${data.currency_code} - ${data.desc}`}</option>
                                  ))}
                                </Form.Control>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <Form.Label>Price Basic</Form.Label>
                                  <Form.Control type="text" value={setValue.item_info_price} onChange={this.stateChanges} name="item_info_price" placeholder="Price Basic" />
                                  {this.state.errors["item_info_price"] &&
                                    <span className='custError'>{this.state.errors["item_info_price"]}</span>
                                  }
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <Form.Label>Tags</Form.Label>
                                  <Form.Control type="text" value={setValue.item_info_tag} onChange={this.stateChanges} name="item_info_tag" placeholder="Tags" />
                                  {this.state.errors["item_info_tag"] &&
                                    <span className='custError'>{this.state.errors["item_info_tag"]}</span>
                                  }
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Row>
                                <Col>
                                  <Form.Group>
                                    <Form.Label>Length</Form.Label>
                                      <Form.Control type="text" value={setValue.item_info_length} onChange={this.stateChanges} name="item_info_length" placeholder="Length" />
                                      {this.state.errors["item_info_length"] &&
                                        <span className='custError'>{this.state.errors["item_info_length"]}</span>
                                      }
                                  </Form.Group>
                                </Col>

                                <Col>
                                  <Form.Group>
                                    <Form.Label>Uses</Form.Label>
                                      <Form.Control type="text" value={setValue.item_info_uses} onChange={this.stateChanges} name="item_info_uses" placeholder="Uses" />
                                      {this.state.errors["item_info_uses"] &&
                                        <span className='custError'>{this.state.errors["item_info_uses"]}</span>
                                      }
                                  </Form.Group>
                                </Col>
                              </Form.Row>
                              
                              <Form.Row>
                                <Col>
                                  <Form.Group>
                                    <Form.Label>Thickness</Form.Label>
                                      <Form.Control type="text" value={setValue.item_info_thickness} onChange={this.stateChanges} name="item_info_thickness" placeholder="Thickness" />
                                      {this.state.errors["item_info_thickness"] &&
                                        <span className='custError'>{this.state.errors["item_info_thickness"]}</span>
                                      }
                                  </Form.Group>
                                </Col>
                              
                                <Col>
                                <Form.Group>
                                  <Form.Label>UOM</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_uom} onChange={this.stateChanges} name="item_info_uom" placeholder="UOM" />
                                    {this.state.errors["item_info_uom"] &&
                                      <span className='custError'>{this.state.errors["item_info_uom"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              </Form.Row>
                              
                              <Form.Row>
                                <Col>
                                  <Form.Group>
                                    <Form.Label>Width</Form.Label>
                                      <Form.Control type="text" value={setValue.item_info_width} onChange={this.stateChanges} name="item_info_width" placeholder="Width" />
                                      {this.state.errors["item_info_width"] &&
                                        <span className='custError'>{this.state.errors["item_info_width"]}</span>
                                      }
                                  </Form.Group>
                                </Col>

                                <Col>
                                <Form.Group>
                                  <Form.Label>Repeat Design</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_repeat_design} onChange={this.stateChanges} name="item_info_repeat_design" placeholder="Repeat Design" />
                                    {this.state.errors["item_info_repeat_design"] &&
                                      <span className='custError'>{this.state.errors["item_info_repeat_design"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              </Form.Row>


                            <Form.Row>
                              
                              <Col>
                                <Form.Group>
                                  <Form.Label>Pattern Desc</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_pattern_desc} onChange={this.stateChanges} name="item_info_pattern_desc" placeholder="Pattern Desc" />
                                    {this.state.errors["item_info_pattern_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_pattern_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                            
                              <Col>
                                <Form.Group>
                                  <Form.Label>Family Description</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_if_desc} onChange={this.stateChanges} name="item_info_if_desc" placeholder="Family Description" />
                                    {this.state.errors["item_info_if_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_if_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                            
                            </Form.Row>

                            <Form.Row>  
                              
                              <Col>
                                <Form.Group>
                                  <Form.Label>Collection Description</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_collection_desc} onChange={this.stateChanges} name="item_info_collection_desc" placeholder="Collection Description" />
                                    {this.state.errors["item_info_collection_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_collection_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>

                              <Col>
                                <Form.Group>
                                  <Form.Label>Brand Description</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_brand_desc} onChange={this.stateChanges} name="item_info_brand_desc" placeholder="Brand Description" />
                                    {this.state.errors["item_info_brand_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_brand_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                            
                            </Form.Row>

                            <Form.Row>  

                              <Col>
                                <Form.Group>
                                  <Form.Label>Color Path</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_color_image_path} onChange={this.stateChanges} name="item_info_color_image_path" placeholder="Color Path" />
                                    {this.state.errors["item_info_color_image_path"] &&
                                      <span className='custError'>{this.state.errors["item_info_color_image_path"]}</span>
                                    }
                                </Form.Group>
                              </Col>

                              <Col>
                                <Form.Group>
                                  <Form.Label>Color Group Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_color_group_code} onChange={this.stateChanges} name="item_info_color_group_code" placeholder="Color Group Code" />
                                    {this.state.errors["item_info_color_group_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_color_group_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
      
                            </Form.Row>


                            <Form.Row>

                              <Col>
                                <Form.Group>
                                  <Form.Label>Material Desc</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_material_type_desc} onChange={this.stateChanges} name="item_info_material_type_desc" placeholder="Material Desc" />
                                    {this.state.errors["item_info_material_type_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_material_type_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                            
                              <Col>
                                <Form.Group>
                                  <Form.Label>Component Desc</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_component_desc} onChange={this.stateChanges} name="item_info_component_desc" placeholder="Component Desc" />
                                    {this.state.errors["item_info_component_desc"] &&
                                      <span className='custError'>{this.state.errors["item_info_component_desc"]}</span>
                                    }
                                </Form.Group>
                              </Col>

                            </Form.Row>

                            <Form.Row className="d-none">
                              
                              

                              <Col>
                                <Form.Group>
                                  <Form.Label>Pattern Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_pattern_code} onChange={this.stateChanges} name="item_info_pattern_code" placeholder="Pattern Code" />
                                    {this.state.errors["item_info_pattern_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_pattern_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Family Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_if_code} onChange={this.stateChanges} name="item_info_if_code" placeholder="Family Code" />
                                    {this.state.errors["item_info_if_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_if_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>

                              <Col>
                                <Form.Group>
                                  <Form.Label>Collection Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_collection_code} onChange={this.stateChanges} name="item_info_collection_code" placeholder="Collection Code" />
                                    {this.state.errors["item_info_collection_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_collection_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Component Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_component_code} onChange={this.stateChanges} name="item_info_component_code" placeholder="Component Code" />
                                    {this.state.errors["item_info_component_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_component_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Material Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_material_type_code} onChange={this.stateChanges} name="item_info_material_type_code" placeholder="Material Code" />
                                    {this.state.errors["item_info_material_type_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_material_type_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Color Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_color_code} onChange={this.stateChanges} name="item_info_color_code" placeholder="Color Code" />
                                    {this.state.errors["item_info_color_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_color_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Brand Code</Form.Label>
                                    <Form.Control type="text" value={setValue.item_info_brand_code} onChange={this.stateChanges} name="item_info_brand_code" placeholder="Brand Code" />
                                    {this.state.errors["item_info_brand_code"] &&
                                      <span className='custError'>{this.state.errors["item_info_brand_code"]}</span>
                                    }
                                </Form.Group>
                              </Col>
                            
                            </Form.Row>

                            </Col>
                          </Card.Body>
                          }
                          </Card>
                        </Col>
                        
                      </Form.Row>


                    </Col>

                    <Col sm={4} className="ml-4"> 

                      <Form.Row>
                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            {/* <Form.Check onChange={this.handleCheckChange(this)} checked={this.state.item_info_country_specific_price==='Y' ? true : false} type="checkbox" name="item_info_country_specific_price" label="Common price for all countries" /> */}
                            <Form.Check onChange={this.stateChanges} checked={setValue.item_info_country_specific_price === 'Y' ? true : false} type="checkbox" name="item_info_country_specific_price" label="Country Specific ?" />

                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row className={setValue.item_info_country_specific_price == 'N' ? 'd-none' : ''}>
                        <Col className="countryParent">
                          {this.state.countrylov.map(function (data, index) {
                            return (
                              <div title={data.desc} key={index} onClick={(e) => theis.selectFlag(e, index, data.iso_code)} className={`countryFlag ${set != '' ? set[index] === index ? 'activeFlag' : '' : ''}`}>
                                <img alt={data.iso_code} src={data.image_path} />
                                <span className="flagName"> {data.iso_code}</span>
                              </div>
                            )
                          })
                          }
                        </Col>
                      </Form.Row>





                      {/* <Form.Row>
                        
                        <Col sm={12}>
                          <Form.Label>Mobile Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="mobile" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$mobileimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col> 
                      </Form.Row> */}

                      <Form.Row>
                        <Col sm={12}>
                          <Form.Label>Thumbnail Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            {setValue.thumbnail_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="thumbnail" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$thumbnailimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      <Form.Row> 
                        <Col sm={12}>
                          <Form.Label>Thumbnail Hover Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            {setValue.desktop_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="hover_image" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$desktopimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>


                      {/* <Form.Row> 
                        <Col sm={12}>
                          <Form.Label>Tablet Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" onChange={(e)=>this._tabletImageChange(e)} />
                              <div className="imgPreview">
                                {$tabletimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row> */}

                      <Form.Row> 
                        <Col sm={12}>
                          <Form.Label>Mobile Landscape Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            {setValue.horizontal_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="mobile_landscape" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$horizontalimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      <Form.Row>
                        <Col sm={12}>
                          <Form.Label>Mobile Portrait Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            {setValue.vertical_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="mobile_portrait" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$verticalimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>

                      
                      <Form.Row> 
                        <Col sm={12}>
                          <Form.Label>Brand Image Upload</Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Group>
                            {setValue.brand_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="avatar_brand" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$brand_image_preview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>


                  
                </Tab>

                <Tab eventKey="object" title="Object" disabled={security.USER_ROLE != 'TECHNICAL' ? true : false}>
                  <Form.Row>
                    <Col sm={5}>   
                      <Form.Row>
                        <Col>
                        <Form.Group> 
                            <Form.Label>Lights</Form.Label>
                              {/* <Form.Control as="select" value={setValue.light_code} name="light_code" onChange={this.stateChanges}>
                                <option>Select Light</option>
                                {setValue.light_lov && setValue.light_lov.map((data,i) => (
                                    <option value={data.code} key={i}>{data.desc}</option>
                                ))}
                              </Form.Control> */}

                              <Select
                                value={lightTagValue}
                                isMulti
                                name="light_code"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.onChangeLight}
                                options={lightlovArray}
                              />
                            </Form.Group>
                        </Col>
                      </Form.Row>
                      
                      <Form.Row>
                          <Col>
                              <Form.Group>
                                  <Form.Label>Effect Type</Form.Label>
                                  <Form.Control as="select" value={setValue.effect_type} name="effect_type" onChange={this.stateChanges}>
                                  <option>Select Effect Type</option>
                                  {setValue.effect_lov && setValue.effect_lov.map((data,i) => (
                                      <option value={data.code} key={i}>{data.desc}</option>
                                  ))}
                                  </Form.Control>
                              </Form.Group>
                          </Col>

                          <Col>
                            <Form.Group>
                            <Form.Label>Shininess</Form.Label>
                                <Form.Control type="text" value={setValue.shininess} onChange={this.stateChanges} name="shininess" placeholder="Repeat Texture" />
                                {this.state.errors["shininess"] &&
                                <span className='custError'>{this.state.errors["shininess"]}</span>
                                }
                            </Form.Group>
                          </Col>
                      </Form.Row> 
                      
                      <Form.Row>
                          
                                
                          <Col>
                            <Form.Group>
                            <Form.Label>Repeat Texture (X)</Form.Label>
                              <Form.Control type="text" value={setValue.repeat_texture_x} onChange={this.stateChanges} name="repeat_texture_x" placeholder="X" />
                            </Form.Group>
                          </Col>
  
                          <Col>
                            <Form.Group>
                            <Form.Label>Repeat Texture (Y)</Form.Label>
                              <Form.Control type="text" value={setValue.repeat_texture_y} onChange={this.stateChanges} name="repeat_texture_y" placeholder="Y" />
                            </Form.Group>
                          </Col>
  
                          {/* <Form.Control type="text" value={setValue.repeat_texture} onChange={this.stateChanges} name="repeat_texture" placeholder="Repeat Texture" />
                          {this.state.errors["repeat_texture"] &&
                          <span className='custError'>{this.state.errors["repeat_texture"]}</span>
                          } */}
                              
                            <Col>
                                <Form.Group>
                                <Form.Label>Light Intensity</Form.Label>
                                    <Form.Control type="text" value={setValue.light_intensity} onChange={this.stateChanges} name="light_intensity" placeholder="Light Intensity" />
                                    {this.state.errors["light_intensity"] &&
                                    <span className='custError'>{this.state.errors["light_intensity"]}</span>
                                    }
                                </Form.Group>
                            </Col>
                        </Form.Row>
                      
                      <Form.Row>
                        
                        <Col>
                          <Form.Group>
                          <Form.Label>Cord Texture (X)</Form.Label>
                            <Form.Control type="text" value={setValue.cord_texture_x} onChange={this.stateChanges} name="cord_texture_x" placeholder="X" />
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                          <Form.Label>Cord Texture (Y)</Form.Label>
                            <Form.Control type="text" value={setValue.cord_texture_y} onChange={this.stateChanges} name="cord_texture_y" placeholder="Y" />
                          </Form.Group>
                        </Col>
                        
                        <Col>
                            <Form.Group>
                            <Form.Label>Bumpscale</Form.Label>
                                <Form.Control type="text" value={setValue.bumpscale} onChange={this.stateChanges} name="bumpscale" placeholder="Bumpscale" />
                                {this.state.errors["bumpscale"] &&
                                <span className='custError'>{this.state.errors["bumpscale"]}</span>
                                }
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                          {/* <Col>
                              <Form.Group>
                              <Form.Label>Cord Repeat</Form.Label>
                                  <Form.Control type="text" value={setValue.cord_repeat_texture} onChange={this.stateChanges} name="cord_repeat_texture" placeholder="Cord Repeat Texture" />
                                  {this.state.errors["cord_repeat_texture"] &&
                                  <span className='custError'>{this.state.errors["cord_repeat_texture"]}</span>
                                  }
                              </Form.Group>
                          </Col> */}
                          <Col>
                              <Form.Group>
                              <Form.Label>Ladder Repeat (X)</Form.Label>
                                  <Form.Control type="text" value={setValue.ladder_repeat_texture_x} onChange={this.stateChanges} name="ladder_repeat_texture_x" placeholder="Ladder Repeat Texture" />
                                  {this.state.errors["ladder_repeat_texture"] &&
                                  <span className='custError'>{this.state.errors["ladder_repeat_texture"]}</span>
                                  }
                              </Form.Group>
                          </Col>
                          <Col>
                              <Form.Group>
                              <Form.Label>Ladder Repeat (Y)</Form.Label>
                                  <Form.Control type="text" value={setValue.ladder_repeat_texture_y} onChange={this.stateChanges} name="ladder_repeat_texture_y" placeholder="Ladder Repeat Texture" />
                                  {this.state.errors["ladder_repeat_texture"] &&
                                  <span className='custError'>{this.state.errors["ladder_repeat_texture"]}</span>
                                  }
                              </Form.Group>
                          </Col>
                          <Col>
                              <Form.Group>
                              <Form.Label>Displacement Scale</Form.Label>
                                  <Form.Control type="text" value={setValue.displacement_scale} onChange={this.stateChanges} name="displacement_scale" placeholder="Displacement Scale" />
                                  {this.state.errors["displacement_scale"] &&
                                  <span className='custError'>{this.state.errors["displacement_scale"]}</span>
                                  }
                              </Form.Group>
                          </Col>
                      </Form.Row>
                    </Col>


                    <Col sm={6} className="ml-4">  
                    <Form.Row> 
                      <Col>
                        <Form.Label>Diffuse Image Upload</Form.Label>
                        <Form.Group>
                          {setValue.diffuse_image_error && 
                            <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                          }
                          <div className="previewComponent">
                            <Form.Control className="fileInput" type="file" name="diffuse_image" onChange={(e)=>this._imageChange(e)} />
                            <div className="imgPreview">
                              {$diffuse_image_preview}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                        <Col>
                          <Form.Label>Displacement Image Upload</Form.Label>
                          <Form.Group>
                            {setValue.displacement_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <Form.Control className="fileInput" type="file" name="displacement" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$displacement_image_preview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                      <Col>
                        <Form.Label>Normal Image Upload</Form.Label>
                        <Form.Group>
                          {setValue.normal_image_error && 
                            <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                          }
                          <div className="previewComponent">
                            <Form.Control className="fileInput" type="file" name="normal" onChange={(e)=>this._imageChange(e)} />
                            <div className="imgPreview">
                              {$normal_image_preview}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col>
                          <Form.Label>OCC Image Upload</Form.Label>
                          <Form.Group>
                            {setValue.occ_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <Form.Control className="fileInput" type="file" name="occ" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$occ_image_preview}
                              </div>
                            </div>
                          </Form.Group>
                      </Col>
                    </Form.Row>

                    <Form.Row>
                      <Col>
                        <Form.Label>Back Side Image Upload</Form.Label>
                        <Form.Group>
                          {setValue.back_side_image_error && 
                            <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                          }
                          <div className="previewComponent">
                            <Form.Control className="fileInput" type="file" name="back_side" onChange={(e)=>this._imageChange(e)} />
                            <div className="imgPreview">
                              {$back_side_image_preview}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Label>Cord Image Upload</Form.Label>
                        <Form.Group>
                          {setValue.cord_image_error && 
                            <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                          }
                          <div className="previewComponent">
                            <Form.Control className="fileInput" type="file" name="cord" onChange={(e)=>this._imageChange(e)} />
                            <div className="imgPreview">
                              {$cord_image_preview}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                    </Form.Row>

                    <Form.Row>
                      <Col>
                        <Form.Label>Ladder Image Upload</Form.Label>
                        <Form.Group>
                          {setValue.ladder_image_error && 
                            <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                          }
                          <div className="previewComponent">
                            <Form.Control className="fileInput" type="file" name="ladder" onChange={(e)=>this._imageChange(e)} />
                            <div className="imgPreview">
                              {$ladder_image_preview}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>

                      
                        <Col>
                          <Form.Label>Customize Thumbnail Image Upload</Form.Label>
                          <Form.Group>
                            {setValue.avatar_tablet_image_error && 
                              <Col sm={12}><p className="text-danger">* Image Maximum size 200KB </p></Col>
                            }
                            <div className="previewComponent">
                              <Form.Control className="fileInput" type="file" name="avatar_tablet" onChange={(e)=>this._imageChange(e)} />
                              <div className="imgPreview">
                                {$tabletimagePreview}
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      
                    </Form.Row>
                  </Col>              
                  </Form.Row>
                </Tab>
              
              </Tabs>

              <button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    )
  }
}

export default ItemInfoModal;