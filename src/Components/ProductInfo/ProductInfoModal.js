
import React, { Component } from 'react';
import './ProductInfo.scss';
import { Col, Form, Modal, Row, Tabs, Tab, Spinner } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import PropTypes from 'prop-types';

const insertUrl = 'admin/portal/productinfo';
const Api_Productlov = 'admin/portal/productinfo/product_lov';
const Api_Categorylov = 'admin/portal/productinfo/category_lov';
const Api_Objectlov = 'admin/portal/productinfo/object_lov';
const Api_Langlov = 'admin/portal/productinfo/lang/lov';


class ProductInfoModal extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      startDate: new Date(),
      endDate: moment("31/Dec/2099", 'DD-MMM-YYYY').toDate(),
      prod_info_from_date: '',
      prod_info_upto_date: '',
      prod_info_pr_code: '',
      prod_info_desc: '',
      prod_info_features: '',
      prod_info_collection_features_01: '',
      prod_info_collection_features_02: '',
      prod_info_collection_features_03: '',
      prod_info_collection_features_04: '',
      prod_info_active_yn: 'N',
      prod_info_motorization_yn: 'N',
      prod_info_category_id: '',
      prod_info_category_slug_url: '',
      prod_info_min_width: '',
      prod_info_max_width: '',
      prod_info_min_height: '',
      prod_info_max_height: '',
      restrict_to_material_width_yn: 'N',
      show_price_yn: '',
      product_yn: '',
      allow_customization_yn: 'N',
      allow_add_to_cart_yn: '',
      minimum_chg_qty: '',
      qty_calculation_type: '',
      box_width: '',
      box_height: '',
      box_weight: '',
      acc_fix_weight: '',
      acc_var_weight: '',
      motorize_min_width: '',
      motorize_max_height: '',
      gathering_type: '',
      gathering: '',
      side_allowance: '',
      bottom_allowance: '',
      production_time: '',
      ar_obj_name: '',
      country_specific_price_yn: 'N',
      ccy_code: '',
      primary_price: '',
      errors: {},
      sysid: null,
      avatar: '',
      mobile_avatar: '',
      imagePreviewUrl: '',
      collectionimagePreviewUrl: '',
      productlov: [],
      cartstatuslov: [],
      calculation_lov: [],
      gathering_lov: [],
      country_lov: [],
      categorylov: [],
      objectlov: [],
      editor: EditorState.createEmpty(),
      editorHTML: '',
      showCode: false,
      editablecontent: '',
      set: [],
      flaglist: [],
      selectedFlag: [],
      collection_banner_error: false,
      validated: false,
      prod_info_ordering: '',
      prod_info_link_title: '',
      prod_info_link_url: '',
      editorState: '',
      features_editorState01: '',
      features_editorState02: '',
      features_editorState03: '',
      features_editorState04: '',
      collection_bannerPreviewUrl: '',
      image_path_PreviewUrl01: '',
      image_path_PreviewUrl02: '',
      image_path_PreviewUrl03: '',
      image_path_PreviewUrl04: '',
      change_date: false,
      product_desc: '',
      language: 'en',
      langDrop: [],
      loader: false,
      browse_collection_yn: 'N',
      sample_yn: 'N',
      additional_dim: '',
      packaging_dim: '',
      country_of_origin: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    editorState: PropTypes.instanceOf(EditorState),
    onEditorStateChange: PropTypes.func,
    onEditorStateChange01: PropTypes.func
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show && !prevProps.show) {
      this.setform_input();

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Productlov)
        .then(response => {
          this.setState({
            productlov: response.data.result.product_lov,
            cartstatuslov: response.data.result.cart_status_lov,
            calculation_lov: response.data.result.calculation_lov,
            gathering_lov: response.data.result.gathering_lov,
            country_lov: response.data.result.country_lov,
          });

        }).catch(function (error) {

        });


      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Categorylov)
        .then(response => {
          this.setState({
            categorylov: response.data.result
          });
        }).catch(function (error) {

        });

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Objectlov)
        .then(response => {
          this.setState({
            objectlov: response.data.result
          });
        }).catch(function (error) {

        });


      if (this.props.language != 'en') {
        ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Langlov, null).then(response => {
          let data = response.data.result;
          this.setState({
            langDrop: data
          });
        });
      }


    }

  }
  // component_Mount(){

  //   ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Productlov)
  // 		.then(response => {	
  // 		  this.setState({
  //         productlov: response.data.result.product_lov,
  //         cartstatuslov: response.data.result.cart_status_lov,
  //         calculation_lov: response.data.result.calculation_lov,
  //         gathering_lov: response.data.result.gathering_lov,
  //         country_lov: response.data.result.country_lov,
  //       });

  //     }).catch(function(error){			

  //     });


  //     ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Categorylov)
  //       .then(response => {	
  //         this.setState({
  //           categorylov: response.data.result
  //         });
  //       }).catch(function(error){			

  //     });

  //     ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Objectlov)
  //       .then(response => {	
  //         this.setState({
  //           objectlov: response.data.result
  //         });
  //       }).catch(function(error){			

  //     });

  // }


  resetFlag = (json) => {
    var defaultArray = [];
    json.forEach(function (obj, inx) {
      defaultArray.push('N');
    });
    return defaultArray;
  }



  componentDidMount() {
    var format = moment(new Date()).format('DD-MMM-YYYY');
    this.setState({ prod_info_from_date: format });
    this.setState({ prod_info_upto_date: moment("31/Dec/2099").format('DD-MMM-YYYY') });
  }

  editModalRecord = (id, desc, lang, type = false) => {

    this.setState({ loader: true });

    var flag = [];
    var setIndex = [];
    var flag_iso = [];
    ApiDataService.get(`${insertUrl}/${id}/edit?language=` + lang,

    ).then(response => {
      //console.log(response.data.result,"eresr");
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
        if (key === 'prod_info_from_date') {
          let fdate = moment(value, 'DD-MMM-YYYY').toDate();
          this.setState({ startDate: fdate });
          this.setState({ prod_info_from_date: value });
        } else if (key === 'prod_info_upto_date') {
          let udate = moment(value, 'DD-MMM-YYYY').toDate();
          this.setState({ prod_info_upto_date: value });
          this.setState({ endDate: udate });
        } else if (key === 'prod_info_features') {
          this.setState({ value, editorState: ProductInfoModal.generateEditorStateFromValue(value) })
        } else if (key === 'prod_info_collection_features_01') {
          this.setState({ value, features_editorState01: ProductInfoModal.generateEditorStateFromValue(value) })
        } else if (key === 'prod_info_collection_features_02') {
          this.setState({ value, features_editorState02: ProductInfoModal.generateEditorStateFromValue(value) })
        } else if (key === 'prod_info_collection_features_03') {
          this.setState({ value, features_editorState03: ProductInfoModal.generateEditorStateFromValue(value) })
        } else if (key === 'prod_info_collection_features_04') {
          this.setState({ value, features_editorState04: ProductInfoModal.generateEditorStateFromValue(value) })
        } else if (key === 'prod_info_collection_image_path') {
          this.setState({ collection_bannerPreviewUrl: value });
        } else if (key === 'image_path_01') {
          this.setState({ image_path_PreviewUrl01: value });
        } else if (key === 'image_path_02') {
          this.setState({ image_path_PreviewUrl02: value });
        } else if (key === 'image_path_03') {
          this.setState({ image_path_PreviewUrl03: value });
        } else if (key === 'image_path_04') {
          this.setState({ image_path_PreviewUrl04: value });
        } else if (key === 'selectedFlag') {

          this.state.country_lov.forEach(function (val, key) {
            value.filter(function (e) {
              if (e == val.iso_code) {
                setIndex[key] = Number(key);
                //flag.push(val.iso_code);
                flag[key] = val.iso_code;
              }
            });

            console.log(flag)
          });

         // console.log(this.state.country_lov)
          this.setState({
            set: setIndex,
            selectedFlag: flag,
          })
         

        }
      });


      this.setState({ sysid: id, product_desc: desc, language: lang, loader: false });


      if (type == 'copy') {
        this.setState({
          prod_info_category_id: '',
        });
      }



    }).catch((error) => { });
  }

  deleteModalRecord = (id) => {
    ApiDataService.delete(`${insertUrl}/`, id).then(response => {
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
      this.props.closeDelete();
    }).catch((error) => {
      this.props.errorMessage(error.message, "ERR");
      this.props.closeDelete();
    });
  }

  changeDate = (data, mode) => {
    var format = moment(data).format('DD-MMM-YYYY');
    let fdate = moment(data, 'DD-MMM-YYYY').toDate();
    console.log(format);
    console.log(fdate);
    if (mode === 'FD') {
      this.setState({ startDate: fdate });
      this.setState({ prod_info_from_date: format });
    }
    if (mode === 'UD') {
      this.setState({ endDate: fdate });
      this.setState({ prod_info_upto_date: format });
    }
  }

  stateChanges = (e) => {

    const { name, value } = e.target;
    var values = '';

    if (name === 'prod_info_active_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'prod_info_motorization_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'restrict_to_material_width_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'show_price_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'product_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'allow_customization_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'country_specific_price_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'browse_collection_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'sample_yn') {
      let checkBox = e.target.checked;
      values = (checkBox ? 'Y' : 'N');
    } else if (name === 'change_date') {
      let checkBox = e.target.checked;
      values = (checkBox ? true : false);
    } else {
      values = value;

     
    }
    this.setState({ [name]: values });

    if (name === 'prod_info_pr_code') {
      let text = e.target.selectedOptions[0].dataset.description;
      let _url = text.replace(/[^A-Z0-9]+/ig, "-");
      this.setState({ 'prod_info_desc': text });
      this.setState({ 'prod_info_tooltip': text });
      this.setState({ 'prod_info_link_url': _url.replace(/-$/, "").toLowerCase() });
      this.setState({ 'prod_info_link_title': text });
    }

    if (name === 'prod_info_category_id') {
      this.setState({ 'prod_info_category_slug_url': e.target.selectedOptions[0].dataset.slug });
      //  this.setState({ 'prod_info_category_id' : e.target.selectedOptions[0].dataset.value });
    }
  }

  validation = () => {
    let fields = this.state;
    let errors = {};
    let formIsValid = true;


    if (!fields['prod_info_category_id']) {
      errors["prod_info_category_id"] = "Category is required";
      formIsValid = false;
    }
    if (!fields['prod_info_pr_code']) {
      errors["prod_info_pr_code"] = "Product is required";
      formIsValid = false;
    }
    if (!fields['prod_info_desc']) {
      errors["prod_info_desc"] = "Product description is required";
      formIsValid = false;
    }

    if (!fields['prod_info_ordering']) {
      errors["prod_info_ordering"] = "Product ordering is required";
      formIsValid = false;
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  setValidated(type) {
    this.setState({
      validated: type
    })
  }

  setform_input() {
    this.setState({
      startDate: new Date(),
      endDate: moment("31/Dec/2099", 'DD-MMM-YYYY').toDate(),
      prod_info_pr_code: '',
      prod_info_desc: '',
      prod_info_features: '',
      prod_info_collection_features_01: '',
      prod_info_collection_features_02: '',
      prod_info_collection_features_03: '',
      prod_info_collection_features_04: '',
      prod_info_active_yn: 'N',
      prod_info_motorization_yn: 'N',
      prod_info_category_id: '',
      prod_info_category_slug_url: '',
      prod_info_min_width: '',
      prod_info_max_width: '',
      prod_info_min_height: '',
      prod_info_max_height: '',
      restrict_to_material_width_yn: 'N',
      show_price_yn: '',
      product_yn: '',
      allow_customization_yn: 'N',
      allow_add_to_cart_yn: '',
      minimum_chg_qty: '',
      qty_calculation_type: '',
      box_width: '',
      box_height: '',
      box_weight: '',
      acc_fix_weight: '',
      acc_var_weight: '',
      motorize_min_width: '',
      motorize_max_height: '',
      gathering_type: '',
      gathering: '',
      side_allowance: '',
      bottom_allowance: '',
      production_time: '',
      ar_obj_name: '',
      country_specific_price_yn: 'N',
      ccy_code: '',
      primary_price: '',
      errors: {},
      avatar: '',
      mobile_avatar: '',
      imagePreviewUrl: '',
      collectionimagePreviewUrl: '',
    //  productlov: [],
     // cartstatuslov: [],
    //  calculation_lov: [],
    //  gathering_lov: [],
    //  country_lov: [],
    //  categorylov: [],
    //  objectlov: [],
      editor: EditorState.createEmpty(),
      editorHTML: '',
      showCode: false,
      editablecontent: '',
      set: [],
      flaglist: [],
      selectedFlag: [],
      collection_banner_error: false,
      image_path_error: false,
      image_path_error: false,
      validated: false,
      prod_info_ordering: '',
      prod_info_link_title: '',
      prod_info_link_url: '',
      editorState: '',
      features_editorState01: '',
      features_editorState02: '',
      features_editorState03: '',
      features_editorState04: '',
      collection_bannerPreviewUrl: '',
      image_path_PreviewUrl01: '',
      image_path_PreviewUrl02: '',
      image_path_PreviewUrl03: '',
      image_path_PreviewUrl04: '',
      change_date: false,
      product_desc: '',
      language: 'en',
      browse_collection_yn: 'N',
      sample_yn: 'N',
      additional_dim: '',
      packaging_dim: '',
      country_of_origin: ''
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    // if(!this.validation()){
    //   return false;
    // }
    const form = event.currentTarget;

    if (form.checkValidity() === false) {

      var formData = new FormData();

      // console.log(this.state, "STATE ALL");



      let Properties = this.state;
      for (var key in Properties) {
        formData.append(key, Properties[key]);
      }

      var url = '';

      if (this.props.mode === 'IS') {
        //serverSet = ApiDataService.post;
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
            this.props.closeModal();
          }
        }).catch((error) => {
          console.log(error);
          this.props.errorMessage(error.message, "ERR");
        });

      } else {
        //serverSet = ApiDataService.update; 
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


            this.props.closeModal();
          }
        }).catch((error) => {
          console.log(error);
          this.props.errorMessage(error.message, "ERR");
        });
      }
    } else {
      this.setValidated(true);
    }

    this.setValidated(true);
  }


  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    var fileSize = parseFloat(file.size / 1024).toFixed(2);
    let name = e.target.name;

    reader.onloadend = () => {
      if (name == 'image_path') {
        if (fileSize <= 500) {
          this.setState({
            avatar: file,
            imagePreviewUrl: reader.result,
            image_path_error: false
          });
        } else {
          this.setState({
            image_path_error: true
          });
        }
      } else if (name == 'collection_banner') {
        if (fileSize <= 500) {
          this.setState({
            collection_banner: file,
            collection_bannerPreviewUrl: reader.result,
            collection_banner_error: false
          });
        } else {
          this.setState({
            collection_banner_error: true
          });
        }
      } else if (name == 'feature_path_01') {
        this.setState({
          image_path_01: file,
          image_path_PreviewUrl01: reader.result
        });
      } else if (name == 'feature_path_02') {
        this.setState({
          image_path_02: file,
          image_path_PreviewUrl02: reader.result
        });
      } else if (name == 'feature_path_03') {
        this.setState({
          image_path_03: file,
          image_path_PreviewUrl03: reader.result
        });
      } else if (name == 'feature_path_04') {
        this.setState({
          image_path_04: file,
          image_path_PreviewUrl04: reader.result
        });
      }
    }
    reader.readAsDataURL(file)
  }


  onEditorStateChange = editorState => {
    this.setState(
      {
        editorState,
        prod_info_features: draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        )
      }
    )
  }

  onEditorStateChange01 = features_editorState01 => {
    this.setState(
      {
        features_editorState01,
        prod_info_collection_features_01: draftToHtml(
          convertToRaw(features_editorState01.getCurrentContent())
        )
      }
    )
  }

  onEditorStateChange02 = features_editorState02 => {
    this.setState(
      {
        features_editorState02,
        prod_info_collection_features_02: draftToHtml(
          convertToRaw(features_editorState02.getCurrentContent())
        )
      }
    )
  }

  onEditorStateChange03 = features_editorState03 => {
    this.setState(
      {
        features_editorState03,
        prod_info_collection_features_03: draftToHtml(
          convertToRaw(features_editorState03.getCurrentContent())
        )
      }
    )
  }

  onEditorStateChange04 = features_editorState04 => {
    this.setState(
      {
        features_editorState04,
        prod_info_collection_features_04: draftToHtml(
          convertToRaw(features_editorState04.getCurrentContent())
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





  render() {
    const setValue = this.state;

    let { set, imagePreviewUrl, langDrop, productlov, cartstatuslov, calculation_lov, gathering_lov, country_lov, categorylov, objectlov, collection_bannerPreviewUrl, image_path_PreviewUrl01, image_path_PreviewUrl02, image_path_PreviewUrl03, image_path_PreviewUrl04 } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} style={{ width: '100%' }} />);
    } else {
      $imagePreview = (<div className="previewText"></div>);
    }

    let $collection_bannerPreviewUrl = null;
    if (collection_bannerPreviewUrl) {
      $collection_bannerPreviewUrl = (<img src={collection_bannerPreviewUrl} style={{ width: '100%' }} />);
    } else {
      $collection_bannerPreviewUrl = (<div className="previewText"></div>);
    }

    let $image_path_PreviewUrl01 = null;
    if (image_path_PreviewUrl01) {
      $image_path_PreviewUrl01 = (<img src={image_path_PreviewUrl01} style={{ width: '100%' }} />);
    } else {
      $image_path_PreviewUrl01 = (<div className="previewText"></div>);
    }

    let $image_path_PreviewUrl02 = null;
    if (image_path_PreviewUrl02) {
      $image_path_PreviewUrl02 = (<img src={image_path_PreviewUrl02} style={{ width: '100%' }} />);
    } else {
      $image_path_PreviewUrl02 = (<div className="previewText"></div>);
    }

    let $image_path_PreviewUrl03 = null;
    if (image_path_PreviewUrl03) {
      $image_path_PreviewUrl03 = (<img src={image_path_PreviewUrl03} style={{ width: '100%' }} />);
    } else {
      $image_path_PreviewUrl03 = (<div className="previewText"></div>);
    }

    let $image_path_PreviewUrl04 = null;
    if (image_path_PreviewUrl04) {
      $image_path_PreviewUrl04 = (<img src={image_path_PreviewUrl04} style={{ width: '100%' }} />);
    } else {
      $image_path_PreviewUrl04 = (<div className="previewText"></div>);
    }

    let security = this.props.security_access;
    let theis = this;
    return (
      <div>
        <Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
          <Modal.Header closeButton className="">
            <Modal.Title id="modalTitle">
              Product Info {this.state.product_desc != '' ? '(' + this.state.product_desc + ')' : ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.loader ?
              <Col className="popupSpinner">
                <Spinner animation="grow" variant="dark" />
              </Col>
              : ''}
            <Form noValidate validated={setValue.validated} onSubmit={this.handleSubmit} autoComplete="off">
              <Tabs defaultActiveKey="info" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="info" title="Info">

                  <Form.Row className={this.state.language === 'en' ? '' : 'd-none'}>
                    <Col>
                      <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={setValue.prod_info_category_id} name="prod_info_category_id" onChange={this.stateChanges} required>
                          <option>Select Category</option>
                          {categorylov.map((data, i) => (
                            <option data-slug={data.slug_url} value={data.id} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Category is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Product</Form.Label>
                        <Form.Control as="select" value={setValue.prod_info_pr_code} name="prod_info_pr_code" onChange={this.stateChanges} required disabled={this.state.language === 'en' ? false : true} disabled={this.props.mode === 'UP' ? true : false}>
                          <option>Select Product</option>
                          {productlov.map((data, i) => (
                            <option value={data.id} data-description={data.description} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Product is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                  </Form.Row>

                  <Form.Row>
                    <Col className={this.state.language == 'en' ? 'd-none' : ''}>

                      <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as="select" value={setValue.language} name="language" onChange={this.stateChanges}>
                          <option>Select Language</option>
                          {langDrop.map((data, i) => (
                            <option value={data.code} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Form.Group as={Col} controlId="validationCustom01">
                      <Form.Label>Description</Form.Label>
                      <Form.Control onChange={this.stateChanges} value={setValue.prod_info_desc} type="text" name="prod_info_desc" placeholder="Description" required disabled={this.props.mode === 'UP' ? true : false}/>
                      <Form.Control.Feedback type="invalid">Description is a required field</Form.Control.Feedback>
                    </Form.Group>


                    <Col>
                      <Form.Group>
                        <Form.Label>Tooltip</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.prod_info_tooltip} type="text" name="prod_info_tooltip" placeholder="Tooltip" required />
                        <Form.Control.Feedback type="invalid">Tooltip is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col className={this.state.language === 'en' ? '' : 'd-none'}>
                      <Form.Group>
                        <Form.Label>Ordering</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.prod_info_ordering} type="text" name="prod_info_ordering" placeholder="Ordering" required />
                        <Form.Control.Feedback type="invalid">Ordering is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Additional Dimensions</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.additional_dim} type="text" name="additional_dim" placeholder="Additional Dimensions" required />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Packaging Dimensions</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.packaging_dim} type="text" name="packaging_dim" placeholder="Packaging Dimensions" required />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Country of Origin</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.country_of_origin} type="text" name="country_of_origin" placeholder="Country of Origin" required />
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row className={this.state.language === 'en' ? '' : 'd-none'}>
                    <Col>
                      <Form.Group>
                        <Form.Label>Slug Url</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_category_slug_url} onChange={this.stateChanges} name="prod_info_category_slug_url" placeholder="Slug Url" required readOnly />
                        <Form.Control.Feedback type="invalid">Slug URL is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Link Url</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_link_url} onChange={this.stateChanges} name="prod_info_link_url" placeholder="Link Url" required readOnly />
                        <Form.Control.Feedback type="invalid">Link URL is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Link Title</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_link_title} onChange={this.stateChanges} name="prod_info_link_title" placeholder="Link Title" required />
                        <Form.Control.Feedback type="invalid">Link Title is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col sm={5}>   
                        <Row>
                          <Col>
                            <Form.Label>Image Upload</Form.Label>
                          <Form.Group>
                            {setValue.image_path_error &&
                              <Col sm={12}><p className="text-danger">* Image Maximum size 500KB</p></Col>
                            }
                              <div className="previewComponent">
                                <input className="fileInput" type="file" name="image_path" onChange={(e)=>this._handleImageChange(e)} />
                                <div className="imgPreview">
                                  {$imagePreview}
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                          {/* <Col>
                            <Form.Label>Collection Banner</Form.Label>
                            <Form.Group>
                              <div className="previewComponent">
                                <input className="fileInput" type="file" name="collection_banner" onChange={(e)=>this._handleImageChange(e)} />
                                <div className="imgPreview">
                                  {$collection_bannerPreviewUrl}
                                </div>
                              </div>
                            </Form.Group>
                          </Col> */}
                        </Row>
                    </Col>
                  </Form.Row>

                  <Form.Row className={this.state.language === 'en' ? '' : 'd-none'}>
                    <Col sm={3}>
                      <Form.Check onChange={this.stateChanges} checked={setValue.change_date ? true : false} type="checkbox" name="change_date" label="Change Date?" />
                    </Col>

                    <Col sm={3}>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.prod_info_active_yn === 'Y' ? true : false} type="checkbox" name="prod_info_active_yn" label="Active" />
                        <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col sm={3}>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.browse_collection_yn === 'Y' ? true : false} type="checkbox" name="browse_collection_yn" label="Browse Collection Y/N" />
                      </Form.Group>
                    </Col>

                    <Col sm={3}>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.sample_yn === 'Y' ? true : false} type="checkbox" name="sample_yn" label="Sample Y/N" />
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    {setValue.change_date && (
                      <>
                        <Col>
                          <Form.Group>
                            <Form.Label>From Date</Form.Label>
                            <DatePicker selected={this.state.startDate} className="form-control form-control-sm" name="prod_info_from_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'FD')} required />
                            <Form.Control.Feedback type="invalid">Start Date is a required field</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Upto Date</Form.Label>
                            <DatePicker selected={this.state.endDate} className="form-control form-control-sm" name="prod_info_upto_date" dateFormat="dd-MMM-yyyy" onChange={date => this.changeDate(date, 'UD')} required />
                            <Form.Control.Feedback type="invalid">Upto Date is a required field</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </>)}
                  </Form.Row>



                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Feature</Form.Label>
                        <Editor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange} required />

                        <Form.Control.Feedback type="invalid">Feature is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                </Tab>


                <Tab eventKey="browse_collection" title="Browse Collection">
                  <Form.Row>
                    <Col className="p-3 mb-2 bg-light">
                      <Form.Row>
                        <Col>
                          <label>Feature 01</label>
                          <Editor editorState={this.state.features_editorState01} onEditorStateChange={this.onEditorStateChange01} />
                        </Col>
                        <Col sm={4}>
                          <Form.Label>Image Upload</Form.Label>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="feature_path_01" onChange={(e) => this._handleImageChange(e)} />
                              <div className="imgPreview">
                                <center>{$image_path_PreviewUrl01}</center>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col className="p-3 mb-2 bg-light">
                      <Form.Row>
                        <Col>
                          <label>Feature 02</label>
                          <Editor editorState={this.state.features_editorState02} onEditorStateChange={this.onEditorStateChange02} />
                        </Col>
                        <Col sm={4}>
                          <Form.Label>Image Upload</Form.Label>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="feature_path_02" onChange={(e) => this._handleImageChange(e)} />
                              <div className="imgPreview">
                                <center>{$image_path_PreviewUrl02}</center>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col className="p-3 mb-2 bg-light">
                      <Form.Row>
                        <Col>
                          <label>Feature 03</label>
                          <Editor editorState={this.state.features_editorState03} onEditorStateChange={this.onEditorStateChange03} />
                        </Col>
                        <Col sm={4}>
                          <Form.Label>Image Upload</Form.Label>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="feature_path_03" onChange={(e) => this._handleImageChange(e)} />
                              <div className="imgPreview">
                                <center>{$image_path_PreviewUrl03}</center>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col className="p-3 mb-2 bg-light">
                      <Form.Row>
                        <Col>
                          <label>Feature 04</label>
                          <Editor editorState={this.state.features_editorState04} onEditorStateChange={this.onEditorStateChange04} />
                        </Col>

                        <Col sm={4}>
                          <Form.Label>Image Upload</Form.Label>
                          <Form.Group>
                            <div className="previewComponent">
                              <input className="fileInput" type="file" name="feature_path_04" onChange={(e) => this._handleImageChange(e)} />
                              <div className="imgPreview">
                                <center>{$image_path_PreviewUrl04}</center>
                              </div>
                            </div>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col>
                      <Form.Label>Collection Banner</Form.Label>
                      <Form.Group>
                        <div className="previewComponent">
                          <Form.Control className="fileInput" type="file" name="collection_banner" onChange={(e) => this._handleImageChange(e)} required />

                          {setValue.collection_banner_error &&
                            <Col sm={12}><p className="text-danger">* Image Maximum size 500KB</p></Col>
                          }

                          <div className="imgPreview">
                            <center>{$collection_bannerPreviewUrl}</center>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                </Tab>


                <Tab eventKey="technical" title="Technical" disabled={security.USER_ROLE != 'TECHNICAL' || this.state.language !== 'en' ? true : false}>
                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.prod_info_motorization_yn === 'Y' ? true : false} type="checkbox" name="prod_info_motorization_yn" label="Motorization Y/N" />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.restrict_to_material_width_yn === 'Y' ? true : false} type="checkbox" name="restrict_to_material_width_yn" label="Restrict To Material Width Y/N" />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.show_price_yn === 'Y' ? true : false} type="checkbox" name="show_price_yn" label="Show Price Y/N" />
                      </Form.Group>
                    </Col>

                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.product_yn === 'Y' ? true : false} type="checkbox" name="product_yn" label="Product Y/N" />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.allow_customization_yn === 'Y' ? true : false} type="checkbox" name="allow_customization_yn" label="Allow Customization Y/N" />
                      </Form.Group>
                    </Col>





                    {/* <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.country_specific_price_yn==='Y' ? true : false} type="checkbox" name="country_specific_price_yn" label="Country Specific Price Y/N" />
                      </Form.Group>
                    </Col> */}

                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Object</Form.Label>
                        <Form.Control as="select" value={setValue.prod_info_object} name="prod_info_object" onChange={this.stateChanges} required>
                          <option>Select Object</option>
                          {objectlov.map((data, i) => (
                            <option data-slug={data.slug_url} value={data.id} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Object is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Cart Status</Form.Label>
                        <Form.Control as="select" value={setValue.allow_add_to_cart_yn} name="allow_add_to_cart_yn" onChange={this.stateChanges} required>
                          <option>Select Cart Status</option>
                          {cartstatuslov.map((data, i) => (
                            <option data-slug={data.slug_url} value={data.id} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Cart Staus is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>

                    <Col>
                      <Form.Group>
                        <Form.Label>Min Width</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_min_width} onChange={this.stateChanges} name="prod_info_min_width" placeholder="Min Width" required />
                        <Form.Control.Feedback type="invalid">Product minimum width is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Max Width</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_max_width} onChange={this.stateChanges} name="prod_info_max_width" placeholder="Max Width" required />
                        <Form.Control.Feedback type="invalid">Product max width is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Min Height</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_min_height} onChange={this.stateChanges} name="prod_info_min_height" placeholder="Min Height" required />
                        <Form.Control.Feedback type="invalid">Minimum height is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Max Height</Form.Label>
                        <Form.Control type="text" value={setValue.prod_info_max_height} onChange={this.stateChanges} name="prod_info_max_height" placeholder="Max Height" required />
                        <Form.Control.Feedback type="invalid">Minimum width is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Minimum Charge Qty</Form.Label>
                        <Form.Control type="text" value={setValue.minimum_chg_qty} onChange={this.stateChanges} name="minimum_chg_qty" placeholder="Minimum Charge Qty" required />
                        <Form.Control.Feedback type="invalid">Minimum Charge is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Quantity Calculation Type</Form.Label>
                        <Form.Control as="select" value={setValue.qty_calculation_type} name="qty_calculation_type" onChange={this.stateChanges} required>
                          <option>Select Object</option>
                          {calculation_lov.map((data, i) => (
                            <option value={data.id} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Qty calculation is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>


                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Box Width</Form.Label>
                        <Form.Control type="text" value={setValue.box_width} onChange={this.stateChanges} name="box_width" placeholder="Box Width" required />
                        <Form.Control.Feedback type="invalid">Box width is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Box Height</Form.Label>
                        <Form.Control type="text" value={setValue.box_height} onChange={this.stateChanges} name="box_height" placeholder="Box Height" required />
                        <Form.Control.Feedback type="invalid">Box height is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Box Weight</Form.Label>
                        <Form.Control type="text" value={setValue.box_weight} onChange={this.stateChanges} name="box_weight" placeholder="Box Weight" required />
                        <Form.Control.Feedback type="invalid">Box weight is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Acc Fix Weight</Form.Label>
                        <Form.Control type="text" value={setValue.acc_fix_weight} onChange={this.stateChanges} name="acc_fix_weight" placeholder="Acc Fix Weight" required />
                        <Form.Control.Feedback type="invalid">Acc fix weight is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Acc Var Weight</Form.Label>
                        <Form.Control type="text" value={setValue.acc_var_weight} onChange={this.stateChanges} name="acc_var_weight" placeholder="Acc Var Weight" required />
                        <Form.Control.Feedback type="invalid">Acc var weight is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Motorize Min Width</Form.Label>
                        <Form.Control type="text" value={setValue.motorize_min_width} onChange={this.stateChanges} name="motorize_min_width" placeholder="Motorize Min Width" required />
                        <Form.Control.Feedback type="invalid">Motorize minimum width is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Motorize Max Height</Form.Label>
                        <Form.Control type="text" value={setValue.motorize_max_height} onChange={this.stateChanges} name="motorize_max_height" placeholder="Motorize Max Height" required />
                        <Form.Control.Feedback type="invalid">Motorize maximum height is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Gathering Type</Form.Label>
                        <Form.Control as="select" value={setValue.gathering_type} name="gathering_type" onChange={this.stateChanges} required>
                          <option>Select Gathering Type</option>
                          {gathering_lov.map((data, i) => (
                            <option value={data.id} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Gathering type is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Gathering</Form.Label>
                        <Form.Control type="text" value={setValue.gathering} onChange={this.stateChanges} name="gathering" placeholder="Gathering" required />
                        <Form.Control.Feedback type="invalid">Gathering is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Side Allowance</Form.Label>
                        <Form.Control type="text" value={setValue.side_allowance} onChange={this.stateChanges} name="side_allowance" placeholder="Side Allowance" required />
                        <Form.Control.Feedback type="invalid">Side allowance is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Bottom Allowance</Form.Label>
                        <Form.Control type="text" value={setValue.bottom_allowance} onChange={this.stateChanges} name="bottom_allowance" placeholder="Bottom Allowance" required />
                        <Form.Control.Feedback type="invalid">Bottom allowance is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Production Time</Form.Label>
                        <Form.Control type="text" value={setValue.production_time} onChange={this.stateChanges} name="production_time" placeholder="Production Time" required />
                        <Form.Control.Feedback type="invalid">Production time is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>


                    <Col>
                      <Form.Group>
                        <Form.Label>AR Object Name</Form.Label>
                        <Form.Control type="text" value={setValue.ar_obj_name} onChange={this.stateChanges} name="ar_obj_name" placeholder="AR Object Name" />
                        {this.state.errors["ar_obj_name"] &&
                          <span className='custError'>{this.state.errors["ar_obj_name"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>

                    <Col>
                      <Form.Group>
                        <Form.Label>Currency Code</Form.Label>
                        <Form.Control as="select" value={setValue.ccy_code} name="ccy_code" onChange={this.stateChanges} required>
                          <option>Select Currency</option>
                          {country_lov.map((data, i) => (
                            <option value={data.currency_code} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">Currency is a required field</Form.Control.Feedback>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Primary Price</Form.Label>
                        <Form.Control type="text" value={setValue.primary_price} onChange={this.stateChanges} name="primary_price" placeholder="Primary Price" required />
                        <Form.Control.Feedback type="invalid">Primary price is a required field</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        {/* <Form.Control type="text" value={setValue.applicable_countries} onChange={this.stateChanges} name="applicable_countries" placeholder="applicable_countries" />
                          {this.state.errors["applicable_countries"] &&
                            <span className='custError'>{this.state.errors["applicable_countries"]}</span>
                          } */}


                        <Col>
                          <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.stateChanges} checked={setValue.country_specific_price_yn === 'Y' ? true : false} type="checkbox" name="country_specific_price_yn" label="Applicable Countries" />
                          </Form.Group>
                          {/* <div className="form-check form-check-inline">
                              <input className="form-check-input" name="country_specific_price_yn" checked={setValue.country_specific_price_yn} onChange={this.stateChanges} type="checkbox" />
                              <Form.Label>Applicable Countries</Form.Label>
                            </div> */}
                        </Col>
                        {setValue.country_specific_price_yn == 'Y' &&
                          // <CountryFlag 
                          // countryActionNt={setValue.editCountry}
                          // sendData={this.receiveFlagData}
                          // sysid={this.state.sysid}
                          // urlname="productinfo"
                          // />

                          <div className="countryParent">
                            {country_lov.map(function (data, index) {
                              return (
                                <div title={data.desc} key={index} onClick={(e) => theis.selectFlag(e, index, data.iso_code)} className={`countryFlag ${set != '' ? set[index] === index ? 'activeFlag' : '' : ''}`}>
                                  <img alt={data.iso_code} src={data.image_path} />
                                  <span className="flagName"> {data.iso_code}</span>
                                </div>
                              )
                            })
                            }
                          </div>
                        }
                      </Form.Group>
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

export default ProductInfoModal;