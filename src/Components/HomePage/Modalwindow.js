
import React, { useState, useEffect, useRef, useContext  } from 'react';
import { useForm, Controller } from "react-hook-form";
import './HomePage.scss';
import { Col, Row, Modal, Form } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import ApiDataService from '../../services/ApiDataService';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw, SelectionState} from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from 'draft-js-import-html';
import htmlToDraft from 'html-to-draftjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faEye } from '@fortawesome/free-solid-svg-icons';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Select, { components } from 'react-select';
import makeAnimated from "react-select/animated";
import MySelect from "./MySelect.js";

import CountryFlag from '../../CountryFlag';
import { PageContext } from '../../App.js';
const querystring = require('querystring');
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};


const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const allOption = {
  label: "Select all",
  value: "*"
};

const ValueContainer = ({ children, ...props }) => {
  const currentValues = props.getValue();
  let toBeRendered = children;
  if (currentValues.some(val => val.value === allOption.value)) {
    toBeRendered = [[children[0][0]], children[1]];
  }

  return (
    <components.ValueContainer {...props}>
      {toBeRendered}
    </components.ValueContainer>
  );
};

const MultiValue = props => {
  let labelToBeDisplayed = `${props.data.label}, `;
  if (props.data.value === allOption.value) {
    labelToBeDisplayed = "All is selected";
  }
  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  );
};

const animatedComponents = makeAnimated();

function Modalwindow(props) {
  const updateContext = useContext(PageContext);
  const [richText, setRichText] = useState({
    editor: EditorState.createEmpty(),
    editorHTML: '',
    showCode: false,
    editablecontent:''
  });
  const Api_Insert = 'admin/portal/homepage';
  const Api_Update = 'admin/portal/homepage/update/';
  const Api_UpdateLang = 'admin/portal/homepage/lang/update/';
  const Api_Parentlov = 'admin/portal/homepage/parent/fetch';
  const Api_Sluglov = 'admin/portal/homepage/master/slug_lov';
  const Api_Categorylov = 'admin/portal/homepage/category_lov';
  const Api_Productlov = 'admin/portal/homepage/Product_lov';
  const Api_Edit = 'admin/portal/homepage/';
  const Api_Langlov = 'admin/portal/homepage/lang/lov';
  const Api_country = 'admin/portal/homepage/country_access';
  const vedioFormat = ['.mov','.mp4'];
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date() 
  });
  const [staticDate, setStaticDate] = useState({
    staticfrom: "",
    staticupto: ""
  });
  const [checkBox, setCheckBox] = useState({
    parentYn:"N",
    activeYn: "N",
    autoYn: "N",
    globalYn:"N",
    spcifydate: "N",
	relatedpost: "N",
    checkPrnt:false,
    checkActive:true,
    checkAuto:false,
    checkGlobal: false,
    checkCountry:false,
    checkSpecfiDate: false,
	checkRelatedPost: false,
    countryYn:"N",
    editCountry: false,
    hideshowDate: "hideDate",
	hideshowRelatedPost: "hideDate"
  });
  const [selected, SetSelected] = useState("");
  const [selectedSlug, SetSelectedSlug] = useState("");
  const [selectedProd, SetSelectedProd] = useState("");
  const [selectedCateg, SetSelectedCateg] = useState("");
  const [sysid, setSysid] = useState(null);
  const [pageName, setPageName] = useState(null);
  const [parentlov, setParentlov] = useState([]);
  const [slugLov, setSlugLov] = useState([]);
  const [producLov, setProducLov] = useState([]);
  const [categoryLov, setCategoryLov] = useState([]);
  
  const [selectedRelatedPost, SetSelectedRelatedPost] = useState([]);
  const [RelatedPostArray, SetRelatedPostArray] = useState([]);
  const [selectedRelatedPostPageName, SetSelectedRelatedPostPageName] = useState("");
  const [relatedPostLov, setRelatedPostLov] = useState([]);
  const [relatedPostPageNameLov, setRelatedPostPageNameLov] = useState([]);
  
  const [showParent, setShowParent] = useState(false);
  const [file, setFile] = useState({
    validate:"image is required",
    image:'',
    previewimage:'http://api.spineweb.com/uploads/common/noimage.jpg',
    boolprevi : false,
    previewtype:false,
    name:'',
    image1: '',
    previewimage1: 'http://api.spineweb.com/uploads/common/noimage.jpg',
    boolprevi1: false,
    previewtype1: false,
    name1: '',
    image2: '',
    previewimage2: 'http://api.spineweb.com/uploads/common/noimage.jpg',
    boolprevi2: false,
    previewtype2: false,
    name2: ''
  });
  const [country, setCountry] = useState({
    country_list:[],
    country_access:''
  });
  const [langForm, setLangForm] = useState({
    langDrop:[],
    selectLang:''
  });
  const { register, handleSubmit, control, reset, setValue, getValues,trigger, setError , formState: { errors } } = useForm({ });
  const [isError, setIsError] = useState({
    buttonDisabled:false,
    files:{
      image: false,
      imageO: false,
      imageT: false, 
      fromdate: false,
      uptodate: false
    },
    message:"File size should n't greater then 2Mb.",
    
  });
  const onSubmit = (data) => {
    var formData = new FormData();
    let image = file.image;
    let image1 = file.image1;
    let image2 = file.image2;
    formData.append("avatar", image);
    console.log(image, "SUBMIT image DATA");
    formData.append("avatar_mobile_P", image1);
    formData.append("avatar_mobile_L", image2);
    const hp_html = (richText.editor !== '' ? richText.editorHTML : '');
    formData.append("hp_html", hp_html);
    let real = {
      ...data
    };
    for (var key in real) {
      formData.append(key, real[key]);
    }
    console.log(formData, "SUBMIT DATA");
     //return false;
    var Headsysid='';
    updateContext.changeLoader(true);
    if(props.mode==='IS'){
      ApiDataService.post(Api_Insert, formData).then(response => {
        if(response.data.return_status!=="0"){ 
          if (response.data.error_message==='Error'){
            props.errorMessage(response.data.result, "ERR-OBJ");
          }else{
            props.errorMessage(response.data.error_message, "ERR");
          }
        }else{
          Headsysid = response.data.result.hp_parent_id;
          saveCountryRecord(Headsysid);
          props.errorMessage(response.data.error_message,"DONE");
          props.renderTable();
          props.closeModal();
        }
        updateContext.changeLoader(false);
      }).catch((error) => {
        console.log(error);
        props.errorMessage(error.message, "ERR");
        updateContext.changeLoader(false);
      });
    }else{
      var url = Api_Update;
      let sysid = props.sysid;
      var langExist = props.allState.language;
      if (langExist !== ''){
        url = Api_UpdateLang;
      }
      ApiDataService.update(url + sysid, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            props.errorMessage(response.data.result, "ERR-OBJ");
          } else {
            props.errorMessage(response.data.error_message, "ERR");
          }
        } else {
          if(langExist === '') saveCountryRecord(sysid);
          props.errorMessage(response.data.error_message, "DONE");
          props.renderTable();
          props.closeModal();
        }
        updateContext.changeLoader(false);
      }).catch((error) => {
        console.log(error);
        props.errorMessage(error.message, "ERR");
        updateContext.changeLoader(false);
      });
    }
  }

  const saveCountryRecord = async(sysid)=>{
    var formData = '';
    let country_list = country.country_list;
    let country_access = country.country_access;
    formData ={
      'country_list[]': country_list,
      country_access: country_access,
      country_ref_id: sysid,
      country_access_page_name: pageName
    }
    await ApiDataService.post(Api_country, querystring.stringify(formData)).then(response => {
      console.log(response,"TESTSE");
    }).catch((error) => {
      console.log(error);
    });
  }  
  const parentDropdown = async () =>{
    await ApiDataService.get(Api_Parentlov + '?page_name=' + pageName, null).then(response => {
      let json = response.data.result;
      var objectArray=[];
      objectArray.push({ value: "", label: "Select",fromdate:"",uptodate:"" });
      for (var i = 0; i < json.length;i++){
        objectArray.push({ value: json[i].parent_id, label: json[i].parent_desc, fromdate: json[i].from_date, uptodate: json[i].upto_date});
      }
      setParentlov(objectArray);
      }).catch((error) => {
        console.log(error);
      });
  }

  const slugDropdown=()=>{
    ApiDataService.get(Api_Sluglov + '?page_name=' + pageName, null).then(response => {
      let json = response.data.result;
      var objectArray = [];
      if (json!=''){
        objectArray.push({ value: "", label: "Select" });
        for (var i = 0; i < json.slug_list.length; i++) {
          objectArray.push({ value: json.slug_list[i], label: json.slug_list[i] });
        }
        setSlugLov(objectArray);
      }else{
        setSlugLov([]);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const CategoryDropdown=()=>{
    ApiDataService.get(Api_Categorylov, null).then(response => {
      let json = response.data.result;
      var objectArray = [];
      if (json!=''){
        objectArray.push({ value: "", label: "Select" });
        for (var i = 0; i < json.length; i++) {
          objectArray.push({ value: json[i].id, label: json[i].desc });
        }
        setCategoryLov(objectArray);
      }else{
        setCategoryLov([]);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const ProdcutDropdown = (id,sysid=null) => {
    ApiDataService.get(Api_Productlov + '/' + id, null).then(response => {
      let json = response.data.result;
      var objectArray = [];
      if (json != '') {
        objectArray.push({ value: "", label: "Select" });
        for (var i = 0; i < json.length; i++) {
          objectArray.push({ value: json[i].id, label: json[i].desc });
        }
        setProducLov(objectArray);
      } else {
        setProducLov([]);
      }
      if (sysid){
        SetSelectedProd(sysid);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  
  const relatedPostDropdown = async () =>{
    await ApiDataService.get(Api_Edit + 'parent/fetch?page_name=homepage', null).then(response => {
      let json = response.data.result;
      var objectArray=[];
      //objectArray.push({ value: "", label: "Select Page" });
      for (var i = 0; i < json.length;i++){
        objectArray.push({ value: json[i].parent_id, label: json[i].parent_desc });
      }
	  
      setRelatedPostLov(objectArray);
	  SetRelatedPostArray(json);
      }).catch((error) => {
        console.log(error);
      });
  }

  const relatedPostPageNameDropdown = async () =>{
    await ApiDataService.get(Api_Edit + 'page_lov', null).then(response => {
      let json = response.data.result;
      var objectArray=[];
      objectArray.push({ value: "", label: "Select Page" });
      for (var i = 0; i < json.length;i++){
        objectArray.push({ value: json[i].id, label: json[i].desc });
      }
	  
      setRelatedPostPageNameLov(objectArray);
      }).catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    defineDefalutDate();
    console.log(updateContext,"updateContext");
    setIsError({
      buttonDisabled: false,
      files:{
        image: false,
        imageO: false,
        imageT: false
      },
      message: "File size should n't greater then 2Mb."
    });
    setValue('hp_parent_id', "");
    setValue("hp_sc_sys_id", '');
    setValue("hp_pr_item_code", '');
    SetSelected("");
    SetSelectedSlug("");
    SetSelectedCateg("");
    SetSelectedProd("");
	SetSelectedRelatedPost([]);
	SetSelectedRelatedPostPageName("");
    reset();
    setPageName(props.allState.pagename);
    setCheckBox((checkBox) => ({
      parentYn: "N", activeYn: "Y", autoYn: "N", checkPrnt: false, checkActive: true, checkAuto: false, checkGlobal: false, checkCountry: false, checkSpecfiDate: false, spcifydate: "N", hideshowDate: "hideDate", checkRelatedPost: false, relatedpost: "N", hideshowRelatedPost: "hideDate"
    }));
    if (props.show && props.sysid == null) {
      parentDropdown();
      slugDropdown();
      // ProducDropdown();
      CategoryDropdown();
	  relatedPostDropdown();
	  relatedPostPageNameDropdown();
      setFile((file) => ({
        boolprevi: false,
        previewimage: 'http://api.spineweb.com/uploads/common/noimage.jpg',
        name: 'Upload', 
        boolprevi1: false,
        previewtype: false,
        previewimage1: 'http://api.spineweb.com/uploads/common/noimage.jpg',
        name1: 'Upload', 
        boolprevi2: false,
        previewtype1: false,
        previewimage2: 'http://api.spineweb.com/uploads/common/noimage.jpg',
        name2: 'Upload',
        previewtype2: false,
      }));
    }
    if (props.sysid && props.allState.language==='') {
      Promise.all([parentDropdown(), slugDropdown(), CategoryDropdown(), relatedPostDropdown(), relatedPostPageNameDropdown()]).then((result) => {
        let sysid = props.sysid;
        ApiDataService.get(Api_Edit + sysid + '/edit').then(response => {
          console.log(response.data, "rest");
          let data = response.data.result[0];
          let valid = (data.hp_file_path != null ? false : 'image is required');
          var hp_from_date = moment(data.hp_from_date, 'DD-MMM-YYYY').toDate();
          var hp_upto_date = moment(data.hp_upto_date, 'DD-MMM-YYYY').toDate();
          if (data.hp_html != null) {
            var hp_html = stateFromHTML(data.hp_html);
            var createHtml = EditorState.createWithContent(hp_html);
            setRichText((richText) => ({
              editor: createHtml, editorHTML: data.hp_html
            }));
          } else {
            setRichText((richText) => ({
              editor: '', editorHTML: ''
            }));
          }
          setDate((date) => ({
            ...date,startDate: hp_from_date, endDate: hp_upto_date
          }));
          setValue('hp_from_date', data.hp_from_date);
          setValue('hp_upto_date', data.hp_upto_date);
          let hp_parent_id = (data.hp_parent_id === null ? '' : data.hp_parent_id);
          let hp_slug_url = (data.hp_slug_url === null ? '' : data.hp_slug_url);
          let hp_sc_sys_id = (data.hp_sc_sys_id === null ? '' : data.hp_sc_sys_id);
          let hp_pr_item_code = (data.hp_pr_item_code === null ? '' : data.hp_pr_item_code);
		  
		  let hp_related_post_sys_id  = (data.hp_related_post_sys_id  === null ? '' : data.hp_related_post_sys_id );
		  let hp_related_post_page_name = (data.hp_related_post_page_name === null ? '' : data.hp_related_post_page_name);
		  
          setValue("hp_parent_id", hp_parent_id);
          SetSelected(hp_parent_id);
          SetSelectedSlug(hp_slug_url);
          SetSelectedCateg(hp_sc_sys_id);

			//SetSelectedRelatedPost(hp_related_post_sys_id);
			setValue('hp_related_post_sys_id', hp_related_post_sys_id);
		  
		  const realtedPostArr = hp_related_post_sys_id.split(',');
		  //console.log(realtedPostArr,'-Aslam');
		  
		   //console.log(RelatedPostArray,'-Aslam RelatedPostArray');
		   
		   //console.log(realtedPostArr.includes('135941'),'Check Array');
		  
			const relatedPostObjectArray=[];
			//objectArray.push({ value: "", label: "Select Page" });
			for (var i = 0; i < RelatedPostArray.length;i++){
				//console.log(realtedPostArr[i],'realtedPostArr[i]');
				//if(RelatedPostArray[i].parent_id===realtedPostArr[i]){
				if(realtedPostArr.includes(RelatedPostArray[i].parent_id)===true){
					relatedPostObjectArray.push({ value: RelatedPostArray[i].parent_id, label: RelatedPostArray[i].parent_desc });
				}
			}
		    //console.log(relatedPostObjectArray,'-Aslam 1');
		    //setRelatedPostLov(relatedPostObjectArray);
	        //setRelatedPostArray(json);
		  
		  
		  
		  SetSelectedRelatedPost(relatedPostObjectArray);
		  SetSelectedRelatedPostPageName(hp_related_post_page_name);		  
		  
          if(hp_sc_sys_id!=''){ ProdcutDropdown(hp_sc_sys_id, hp_pr_item_code); }
          setValue("hp_desc", data.hp_desc);
          setValue("hp_ordering", data.hp_ordering);
          setValue("hp_link_url", data.hp_link_url);
          setValue("hp_link_title", data.hp_link_title);
          setValue("hp_timer", data.hp_timer);
          setValue("hp_slug_url", hp_slug_url);
          setValue("hp_sc_sys_id", hp_sc_sys_id);
          setValue("hp_pr_item_code", hp_pr_item_code);
          setValue("hp_classname", data.hp_classname);
          setValue("hp_date_specific_yn", data.hp_date_specific_yn);
		  
		  setValue("hp_related_post_yn", data.hp_related_post_yn);
          setValue("hp_related_post_limit", data.hp_related_post_limit);
		  setValue("hp_related_post_sys_id", hp_related_post_sys_id);
		  setValue("hp_related_post_page_name", hp_related_post_page_name);
		  
          setStaticDate({
            ...staticDate,
            staticfrom: data.hp_from_date,
            staticupto: data.hp_upto_date
          });
          if (data.hp_file_path === ''){
            var previewimage = '';
            var boolprevi=false;
            var previewtype=false;
          } else{
            var previewtype = checkFileTypeExist(data.hp_file_path);
            console.log(previewtype,"SDFSDF");
            var previewimage = data.hp_file_path;
            var boolprevi = true;
          } if (data.avatar_mobile_P === '') {
            var previewimage1 = '';
            var boolprevi1 = false;
            var previewtype1 = false;
          } else{
            var previewimage1 = data.avatar_mobile_P;
            var boolprevi1 = true;
            var previewtype1 = checkFileTypeExist(data.avatar_mobile_P);
            //(vedioFormat.includes(data.avatar_mobile_P) ? true : false);
          } if (data.avatar_mobile_L === '') {
            var previewimage2 = '';
            var boolprevi2 = false;
            var previewtype2 = false;
          }else{
            var previewimage2 = data.avatar_mobile_L;
            var boolprevi2 = true;
            var previewtype2 = checkFileTypeExist(data.avatar_mobile_L);
            // (vedioFormat.includes(data.avatar_mobile_L) ? true : false);
          }
          setFile((file) => ({ 
            image: data.hp_file_path, 
            validate: valid, 
            previewimage: previewimage,
            previewtype: previewtype,
            boolprevi: boolprevi,
            image1: data.avatar_mobile_P,
            previewimage1: previewimage1,
            previewtype1: previewtype1,
            boolprevi1: boolprevi1,
            image2: data.avatar_mobile_L,
            previewimage2: previewimage2,
            boolprevi2: boolprevi2,
            previewtype2: previewtype2,
          }));
          setSysid(data.hp_id);
          var parentBox = '';
          if (data.hp_parent_yn === 'Y') {
            setShowParent(true);
            parentBox = true;
          } else {
            setShowParent(false);
            parentBox = false;
          }
          let activeBox = (data.hp_active_yn === 'Y' ? true : false);
          let autoBox = (data.hp_auto_play === 'Y' ? true : false);
          let globalBox = (data.hp_global_section === 'Y' ? true : false);
          let country_specific = (data.country_specific === 'TRUE' ? true : false);
          let specifyDate = (data.hp_date_specific_yn === 'Y' ? true : false);
          let hidedate = (data.hp_date_specific_yn === 'Y' ? "" : "hideDate");
		  
		  let relatedPostFlag = (data.hp_related_post_yn === 'Y' ? true : false);
          let showRelatedPost = (data.hp_related_post_yn === 'Y' ? "" : "hideDate");		  
          setCheckBox({ parentYn: data.hp_parent_yn, activeYn: data.hp_active_yn, autoYn: data.hp_auto_play, checkPrnt: parentBox, checkActive: activeBox, checkAuto: autoBox, globalYn: data.hp_global_section, checkGlobal: globalBox, editCountry: country_specific, checkCountry: country_specific, checkSpecfiDate: specifyDate, hideshowDate: hidedate, relatedpost:data.hp_related_post_yn, checkRelatedPost: relatedPostFlag, hideshowRelatedPost: showRelatedPost });
        }).catch({

        });
      }
      )
    } else if (props.sysid && props.allState.language !== ''){
      getLanguageLov();
    }
  }, [props.sysid, props.show, props.allState.pagename,setValue, reset]);
  useEffect(() => {
    if (langForm.langDrop.length>0){
      var lang = langForm.langDrop[0].code;
      executeLanguage(lang);
    }
  }, [langForm.langDrop]);

  const checkFileTypeExist=(stringurl)=>{
    return vedioFormat.some(function (data) {
      return stringurl.includes(data);
    });
  }

  const getLanguageLov= async ()=>{
    await ApiDataService.get(Api_Langlov, null).then(response => {
      let data = response.data.result;
      setLangForm({
        ...langForm,
        langDrop: data
      });
    });
  }
  const executeLanguage = (lang) => {
    let sysid = props.sysid;
    ApiDataService.get(Api_Edit + 'lang/' + sysid + '/edit', lang).then(response => {
      let data = response.data.result[0];
      setValue("hp_desc", data.hp_desc);
      setValue("hp_link_title", data.hp_link_title);
      if (data.hp_html != null) {
        var hp_html = stateFromHTML(data.hp_html);
        var createHtml = EditorState.createWithContent(hp_html);
        setRichText((richText) => ({
          editor: createHtml, editorHTML: data.hp_html
        }));
      } else {
        setRichText((richText) => ({
          editor: '', editorHTML: ''
        }));
      }
      if (data.hp_file_path === '') {
        var previewimage = '';
        var boolprevi = false;
        var previewtype = false;
      } else {
        var previewtype = checkFileTypeExist(data.hp_file_path);
        var previewimage = data.hp_file_path;
        var boolprevi = true;
      } if (data.avatar_mobile_P === '') {
        var previewimage1 = '';
        var boolprevi1 = false;
        var previewtype1 = false;
      } else {
        var previewimage1 = data.avatar_mobile_P;
        var boolprevi1 = true;
        var previewtype1 = checkFileTypeExist(data.avatar_mobile_P);
      } if (data.avatar_mobile_L === '') {
        var previewimage2 = '';
        var boolprevi2 = false;
        var previewtype2 = false;
      } else {
        var previewimage2 = data.avatar_mobile_L;
        var boolprevi2 = true;
        var previewtype2 = checkFileTypeExist(data.avatar_mobile_L);
      }
      setFile((file) => ({
        image: data.hp_file_path,
        previewimage: previewimage,
        previewtype: previewtype,
        boolprevi: boolprevi,
        image1: data.avatar_mobile_P,
        previewimage1: previewimage1,
        previewtype1: previewtype1,
        boolprevi1: boolprevi1,
        image2: data.avatar_mobile_L,
        previewimage2: previewimage2,
        boolprevi2: boolprevi2,
        previewtype2: previewtype2
      }));
    });
  }
  const isTesting = (file) =>{
    console.log(file,"TSET");
  }
  useEffect(() => () => [props.show, props.mode]); // unmount exiting data...
  const Inputwidth = { width: '100%' };
  const validation ={
    hp_desc: { required: "Description is required" },
    hp_ordering: { required: "Ordering is required" },
    hp_parent_id: { required: "Parent name is required" },
    hp_parent_id_false: { required: false },
    image: { required: true, validate: isTesting },
    image1: { required: file.validate },
    
  };

  const changeDate = (data, mode) => {
    console.log(data);
    var format = moment(data).format('DD-MMM-YYYY');
    fromDateFunction(format,mode);
    (mode === 'FD' ? setDate({ ...date, startDate: data }) : setDate({ ...date, endDate: data }));
    (mode === 'FD' ? setValue('hp_from_date', format) : setValue('hp_upto_date', format));
  }

  const fromDateFunction=(data,mode)=>{
    let selectDate = moment(data,'DD-MMM-YYYY');//.format('DD/MM/YYYY');
    let sholdbefrom = moment(staticDate.staticfrom, 'DD-MMM-YYYY');//.format('DD/MM/YYYY');
    let sholdbeupto = moment(staticDate.staticupto, 'DD-MMM-YYYY');//.format('DD/MM/YYYY');
    console.log(selectDate, sholdbefrom, sholdbeupto, "fromDatefromDate");
    var dateset ='';
    if (selectDate >= sholdbefrom && selectDate <= sholdbeupto){
      dateset =false;
    }else{
      dateset = true;
    }
    if (mode ==='FD'){
      setIsError((prevState) => ({
        ...prevState,
        files: {
          ...prevState.files,
          fromdate: dateset
        }
      }));
    }else{
      setIsError((prevState) => ({
        ...prevState,
        files: {
          ...prevState.files,
          uptodate: dateset
        }
      }));
    }
  }
  
  const fileUpload = (e,param) => {
    let fileObj = e.target.files[0];
    let name = e.target.files[0].name;
    let preview = URL.createObjectURL(e.target.files[0]);
    let fileSize ='';
    let maxFileSize = '';
    let filetype='';
    var reader = new FileReader();
    console.log(fileObj.type, "ileObj.type");
    if (fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/jpeg' || fileObj.type == 'image/gif' || fileObj.type == 'image/bmp'){
      fileSize = e.target.files[0].size / 1024 / 1024;
      maxFileSize=2;
      filetype=false;
    } else if (fileObj.type == 'video/mov' || fileObj.type == 'video/mp4' || fileObj.type == 'video/ogg' || fileObj.type == 'video/webm' || fileObj.type == 'video/x-m4v' || fileObj.type == 'video/quicktime'){
      fileSize = e.target.files[0].size / 1024 / 1024;
      maxFileSize=200;
      filetype = true;
    }
    // console.log(preview, reader.result,"SDFSDF");
    var boolenCount='';
    if (param=='PC'){
      if (fileSize <= maxFileSize) {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files,image: false }
        }));
      } else {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files,image: true}
        }));
      }
      setFile({ ...file, image: e.target.files[0], previewtype: filetype, previewimage: preview, boolprevi: true, name: name });
    } else if (param == 'MP') {
      if (fileSize <= maxFileSize) {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files, imageO: false}
        }));
      } else {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files, imageO: true}
        }));
      }
      setFile({ ...file, image1: e.target.files[0], previewtype1: filetype, previewimage1: preview, boolprevi1: true, name1: name });
    } else if (param == 'ML') {
      if (fileSize <= maxFileSize) {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files,imageT: false}
        }));
      } else {
        setIsError(prevState => ({
          ...prevState, files: { ...prevState.files, imageT: true}
        }));
      }
      setFile({ ...file, image2: e.target.files[0], previewtype2: filetype, previewimage2: preview, boolprevi2: true, name2: name });
    }
  }
  useEffect(()=>{
    var buttonSubmit = false;
    let data = isError.files;
    Object.keys(data).forEach(function (key) {
      if (data[key]) {
        buttonSubmit = true;
      }
    });
    setIsError((prevState) => ({
      ...prevState, buttonDisabled: buttonSubmit
    }));
    console.log(isError,"ESTTSET");
  }, [isError.files])
  const parentCheck = (event)=>{
    let checked = event.target.checked;
    if (checked){
      setCheckBox({ ...checkBox, parentYn: "Y", checkPrnt: true });
      setShowParent(true);
    }else{
      setCheckBox({ ...checkBox, parentYn: "N", checkPrnt: false});
      setShowParent(false);
    }
  }
  const ActiveCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, activeYn: "Y", checkActive: true });
    } else {
      setCheckBox({ ...checkBox, activeYn: "N", checkActive: false});
    }
  }
  const AutoCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, autoYn: "Y", checkAuto: true });
    } else {
      setCheckBox({ ...checkBox, autoYn: "N", checkAuto: false });
    }
  }
  const GlobalCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, globalYn: "Y", checkGlobal: true });
    } else {
      setCheckBox({ ...checkBox, globalYn: "N", checkGlobal: false });
    }
  }
  const countryCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, checkCountry: true });
    } else {
      setCheckBox({ ...checkBox, checkCountry: false });
    }
  }

  const specificDate = (event) => {
    let checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, spcifydate: "Y", checkSpecfiDate: true, hideshowDate:"" });
    } else {
      setCheckBox({ ...checkBox, spcifydate: "N", checkSpecfiDate: false, hideshowDate: "hideDate" });
    }
  }
  
  const relatedPost = (event) => {
    let checked = event.target.checked;
    if (checked) {
      setCheckBox({ ...checkBox, relatedpost: "Y", checkRelatedPost: true, hideshowRelatedPost:"" });
    } else {
      setCheckBox({ ...checkBox, relatedpost: "N", checkRelatedPost: false, hideshowRelatedPost: "hideRelatedPost" });
    }
  }
  
  const onEditorStateChange = (editorState) => {
    let htmlcontent = stateToHTML(editorState.getCurrentContent());
    setRichText({ ...richText, editor: editorState, editorHTML: htmlcontent });
  };

  const onEditEditorHTML = e => {
    const editorHTML = e.target.value;
    let editor;
    const contentBlock = htmlToDraft(editorHTML);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      editor = EditorState.createWithContent(contentState)
    } else {
      editor = EditorState.createEmpty()
    }
    setRichText({ ...richText, editor: editor, editorHTML: editorHTML });
  }

  const toggleEditorCode = () => {
    const { showEditorCode } = richText;
    setRichText({ ...richText, showEditorCode:!showEditorCode});
    (richText.showEditorCode ? setRichText({ ...richText, showEditorCode: !showEditorCode, editablecontent: '' }) : setRichText({ ...richText, showEditorCode: !showEditorCode, editablecontent: 'hideTextCont' }))
  }
  
  const ShowEditorCode = () => (
    <div className="rdw-option-wrapper"
      onClick={toggleEditorCode}>
      {richText.showEditorCode ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faCode} /> }
  </div>)

  const handleChange = (selected)=>{
    SetSelected(selected.value);
    setValue('hp_parent_id', selected.value);
    if (selected.fromdate!==''){
      setStaticDate({
        ...staticDate,
        staticfrom: selected.fromdate,
        staticupto: selected.uptodate
      });
      let defaultStart = moment(selected.fromdate, 'DD/MMM/YYYY').toDate();
      let defaultEnd = moment(selected.uptodate, 'DD/MMM/YYYY').toDate();
      setDate((date) => ({
        ...date, startDate: defaultStart, endDate: defaultEnd
      }));
      setValue('hp_from_date', selected.fromdate);
      setValue('hp_upto_date', selected.uptodate);
    }else{
      defineDefalutDate();
    }
  }
  const handleChangeSlug = (selected) => {
    SetSelectedSlug(selected.value);
    setValue('hp_slug_url', selected.value);
  }

  const handleChangeCateg = (selected) => {
    SetSelectedCateg(selected.value);
    setValue('hp_sc_sys_id', selected.value);
    ProdcutDropdown(selected.value);
    setValue('hp_pr_item_code', '');
  }

  const handleChangeProd = (selected) => {
    SetSelectedProd(selected.value);
    setValue('hp_pr_item_code', selected.value);
  }
  
  const handleChangeRelatedPost_OLD = (selected) => {
	//console.log('Aslam - ',selected);	
	const postIds = selected.map(({
	  value
	}) => value).join(',')
	//console.log('Aslam - ',postIds);	
    SetSelectedRelatedPost(postIds);
    setValue('hp_related_post_sys_id', postIds);
  }
  
  const handleChangeRelatedPost = (selected) => {
	console.log('Aslam - ',selected);	
	const postIds = selected.map(({
	  value
	}) => value).join(',')
	console.log('Aslam - ',postIds.replace('*,',''));	
    SetSelectedRelatedPost(selected);
    setValue('hp_related_post_sys_id', postIds.replace('*,',''));
  }
  
  const handleChangeRelatedPostPageName = (selected) => {
    SetSelectedRelatedPostPageName(selected.value);
    setValue('hp_related_post_page_name', selected.value);
  }

  const defineDefalutDate=()=>{
    let defaultStart = moment(new Date(), 'DD-MMM-YYYY').toDate();
    let defaultEnd = moment("31/Dec/2099", 'DD-MMM-YYYY').toDate();
    let dbStart = moment(new Date()).format('DD-MMM-YYYY');
    let dbEnd = moment("31/Dec/2099").format('DD-MMM-YYYY');
    setDate((date) => ({
      ...date, startDate: defaultStart, endDate: defaultEnd
    }));
    setValue('hp_from_date', dbStart);
    setValue('hp_upto_date', dbEnd);
  }
  
  const keyupsearch = (e)=>{
    console.log(e.target.value,"USE FOR API");
  }
  const receiveFlagData=(data)=>{
    setCountry({
      ...country,
      country_list: data.selectedCountry,
      country_access: data.options
    })
  }
  const selectLang=(e)=>{
    let lang = e.target.value;
    setLangForm({
      ...langForm,
      selectLang: lang
    });
    executeLanguage(lang);
  }

  return (
    <div>
      <Modal animation={false} size="lg" show={props.show} onHide={props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Home Page
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            {props.allState.language === '' ?
           (<div>
            <Row>
              <Col>
                <div className="form-group">
                  <label>Section</label>
                  <input type="text" className="form-control form-control-sm" ref={register(validation.hp_desc)} id="hp_desc" name="hp_desc" placeholder="Section"/>
                  <input type="hidden" defaultValue={pageName} className="form-control form-control-sm" ref={register} id="hp_page_name" name="hp_page_name" />
                  <small className="text-danger">
                    {errors.hp_desc && errors.hp_desc.message}
                  </small>
              </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label>Ordering</label>
                  <input type="text" className="form-control form-control-sm" ref={register} id="hp_ordering" name="hp_ordering" placeholder="Ordering" />
                </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label >Slug Url</label>
                  {/* <Controller
                    render={() => (
                      <div onKeyUp={(e) => keyupsearch(e)}>
                        <Select
                          value={slugLov.filter(function (option) {
                            return option.value === selectedSlug;
                          })}
                          onChange={handleChangeSlug}
                          options={slugLov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="hp_slug_url"
                  /> */} 
                  {/* Enable slug lov already concept was done. */}
                 <input type="text" className="form-control form-control-sm" ref={register} id="hp_slug_url" name="hp_slug_url" placeholder="Slug" />
                </div>
              </Col>
            </Row>{' '}
            <Row>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" onChange={parentCheck} checked={checkBox.checkPrnt} type="checkbox" id="inlineCheckbox1"/>
                  <label className="form-check-label">Parent ?</label>
                  <input type="hidden" name="hp_parent_yn" ref={register} value={checkBox.parentYn} />
                </div>
              </Col>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkActive} onChange={ActiveCheck} type="checkbox" id="inlineCheckbox1" />
                  <label className="form-check-label">Active ?</label>
                  <input type="hidden" name="hp_active_yn" ref={register} value={checkBox.activeYn} />
                </div>
              </Col>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkAuto} onChange={AutoCheck} type="checkbox" id="inlineCheckbox1" />
                  <label className="form-check-label">Auto Play ?</label>
                  <input type="hidden" name="hp_auto_play" ref={register} value={checkBox.autoYn} />
                </div>
              </Col>
              <Col className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkGlobal} onChange={GlobalCheck} type="checkbox" id="inlineCheckbox1" />
                  <label className="form-check-label">Global Section Y/N</label>
                  <input type="hidden" name="hp_global_section" ref={register} value={checkBox.globalYn} />
                </div>
              </Col>
            </Row>{' '}
            <Row>
              <Col>
                <label>Parent Name</label>
                <Controller
                  render={() => (
                    <div onKeyUp={(e) => keyupsearch(e)}>
                      <Select
                        value={parentlov.filter(function (option) {
                          return option.value === selected;
                        })}
                        onChange={handleChange}
                        options={parentlov}
                        className="custdropdwn"
                        styles={customStyles}
                      />
                    </div>)}
                  control={control}
                  name="hp_parent_id"
                  rules={showParent ? (validation.hp_parent_id_false) : (validation.hp_parent_id)}
                />
                {
                showParent ? '' :
                <small className="text-danger">
                    {errors.hp_parent_id && errors.hp_parent_id.message}
                </small>
                }
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label >Timer</label>
                  <input className="form-control form-control-sm" ref={register} type="number" defaultValue="0" id="hp_timer" name="hp_timer" />
                </div>
              </Col>
              <Col md={3}>
                <div className="form-group">
                  <label>Class Name</label>
                  <input placeholder="Class name" className="form-control form-control-sm" ref={register} type="text" id="hp_classname" name="hp_classname" />
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md={3} className="checkBox">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" checked={checkBox.checkCountry} onChange={countryCheck} type="checkbox" />
                  <label className="form-check-label">Country Specific ?</label>
                </div>
              </Col>              
            </Row>
            {checkBox.checkCountry &&
              <CountryFlag 
              countryActionNt={checkBox.editCountry}
              sendData={receiveFlagData}
              sysid={props.sysid}
              urlname="homepage"
              />
            }
            <Row>
              <Col>
                <label>PC/Tablet</label>
                <div className="input-group input-group-sm p-0">
                  <div className="custom-file p-0">
                    <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg,.pdf" name="images" onChange={e => fileUpload(e, 'PC')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                    <label className="custom-file-label">{file.name}</label>
                  </div>
                </div>
                <small className="text-danger">
                  {isError.files.image && isError.message}
                </small>
                <small className="text-danger">* Video Maximum size 200MB</small>
                <div className="fileborder">
				
				{file.previewimage.split('.').pop()==='pdf'?
					<a href={file.previewimage} target="_blank" >{file.previewimage}</a>
					:file.previewtype ?
					  <video width="200">
						<source src={file.previewimage} />
					  </video>
					  : <img src={file.previewimage} alt="" thumbnail="true" />
					
				}
                </div>  
              </Col>
              <Col>
                <label>Mobile Portrait</label>
                <div className="input-group input-group-sm p-0">
                  <div className="custom-file p-0">
                      <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg,.pdf" onChange={e=>fileUpload(e,'MP')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                    <label className="custom-file-label">{file.name1}</label>
                  </div>
                </div>
                <small className="text-danger">
                  {isError.files.imageO && isError.message}
                </small>
                <small className="text-danger">* Video Maximum size 10MB</small>
                <div className="fileborder">
				{file.previewimage1.split('.').pop()==='pdf'?
					<a href={file.previewimage1} target="_blank" >{file.previewimage1}</a>
                    :file.previewtype1 ?
                    <video width="200">
                      <source src={file.previewimage1} />
                    </video>
                    : <img src={file.previewimage1} alt="" thumbnail="true" />
                }
                </div>
              </Col>
              <Col>
                <label>Mobile Landscape</label>
                <div className="input-group input-group-sm p-0">
                  <div className="custom-file p-0">
                        <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg,.pdf" onChange={e => fileUpload(e, 'ML')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                    <label className="custom-file-label">{file.name2}</label>
                  </div>
                </div>
                <small className="text-danger">
                  {isError.files.imageT && isError.message}
                </small>
                <small className="text-danger">* Video Maximum size 10MB</small>
                <div className="fileborder">
                  {file.previewimage2.split('.').pop()==='pdf'?
					<a href={file.previewimage2} target="_blank" >{file.previewimage2}</a>
				    :file.previewtype2 ?
                    <video width="200">
                      <source src={file.previewimage2} />
                    </video>
                    : <img src={file.previewimage2} alt="" thumbnail="true" />
                  }
                </div>
              </Col>
            </Row>{' '}
            <Row>
            <Col md={3} className="checkBox checktop">
              <div className="form-check form-check-inline">
                <input className="form-check-input" onChange={specificDate} checked={checkBox.checkSpecfiDate} type="checkbox" id="inlineCheckbox1" />
                <label className="form-check-label">Specific Date ?</label>
                <input type="hidden" name="hp_date_specific_yn" ref={register} value={checkBox.spcifydate} />
              </div>
            </Col>
            <Col md={3} className={`checkBox ${checkBox.hideshowDate}`}>
              <label>From Date</label>
              <Controller
                control={control}
                name="hp_from_date"
                render={(onChange) => (
                  <DatePicker className="form-control dateindex form-control-sm" selected={date.startDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'FD')} />
                )}
              />
              <small className="text-danger">
              {isError.files.fromdate && <span>From date should be between {staticDate.staticfrom +' to '+ staticDate.staticupto}</span>}
              </small>
            </Col>
            <Col md={3} className={`checkBox ${checkBox.hideshowDate}`}>
              <label>Upto Date</label>
              <Controller
                control={control}
                name="hp_upto_date"
                render={(onChange) => (
                  <DatePicker className="form-control form-control-sm" selected={date.endDate} style={Inputwidth} dateFormat="dd-MMM-yyyy" onChange={date => changeDate(date, 'UD')} />
                )}
              />
              <small className="text-danger">
              {isError.files.uptodate && <span>From date should be between {staticDate.staticfrom + ' to ' + staticDate.staticupto}</span>}
              </small>
            </Col>
            <Col md={3}>
              <div className="form-group">
                <label >Link Title</label>
                <input type="text" ref={register} className="form-control form-control-sm" id="hp_link_title" name="hp_link_title" placeholder="Link Title" />
              </div>
            </Col>
            </Row>{' '}
            <Row>
              <Col md={4}>
                <div className="form-group">
                  <label >Link Url</label>
                  <input type="text" ref={register} className="form-control form-control-sm" id="hp_link_url" name="hp_link_url" placeholder="Link Url" />
                </div>
              </Col>
              <Col md={4}>
                <div className="form-group">
                  <label >Category</label>
                  <Controller
                    render={() => (
                      <div onKeyUp={(e) => keyupsearch(e)}>
                        <Select
                          value={categoryLov.filter(function (option) {
                            return option.value === selectedCateg;
                          })}
                          onChange={handleChangeCateg}
                          options={categoryLov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="hp_sc_sys_id"
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="form-group">
                  <label >Product</label>
                  <Controller
                    render={() => (
                      <div onKeyUp={(e) => keyupsearch(e)}>
                        <Select
                          value={producLov.filter(function (option) {
                            return option.value === selectedProd;
                          })}
                          onChange={handleChangeProd}
                          options={producLov}
                          className="custdropdwn"
                          styles={customStyles}
                        />
                      </div>)}
                    control={control}
                    name="hp_pr_item_code"
                  />
                </div>
              </Col>
            </Row>{' '}				
            <Row>
              <Col>
                <Editor
                  editorState={richText.editor}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName={`editorClassName `+richText.editablecontent}
                  onEditorStateChange={onEditorStateChange}
                  toolbarCustomButtons={[<ShowEditorCode />]}
                />
                {richText.showEditorCode && <textarea className="htmlsourcecss"
                  value={richText.editorHTML}
                  onChange={onEditEditorHTML}
                />}
              </Col>
            </Row>
			
			
			<Row>
				<Col md={3} className="checkBox checktop">
				  <div className="form-check form-check-inline">
					<input className="form-check-input" onChange={relatedPost} checked={checkBox.checkRelatedPost} type="checkbox" id="inlineCheckboxRelatedPost" />
					<label className="form-check-label" for="inlineCheckboxRelatedPost">Related Post ?</label>
					<input type="hidden" name="hp_related_post_yn" ref={register} value={checkBox.relatedpost} />
				  </div>
				</Col>
				<Col md={2} className={`checkBox ${checkBox.hideshowRelatedPost}`}>
				  <div className="form-group">
					<label >Limit</label>
					<input type="number" defaultValue="1" step="1" min="0" max="100" ref={register} className="form-control form-control-sm-" id="hp_related_post_limit" name="hp_related_post_limit" placeholder="Related Post Limit" />
				  </div>
				</Col>
				{/* alert(selectedRelatedPost) */}
				<Col md={2} className={`checkBox ${checkBox.hideshowRelatedPost}`}>
					<div className="form-group">
					  <label >Page Name</label>
					  <Controller
						render={() => (
						  <div onKeyUp={(e) => keyupsearch(e)}>
							<Select
							  value={relatedPostPageNameLov.filter(function (option) {
								return option.value === selectedRelatedPostPageName;
							  })}
							  onChange={handleChangeRelatedPostPageName}
							  options={relatedPostPageNameLov}
							  className="custdropdwn"
							  //styles={customStyles}
							/>
						  </div>)}
						control={control}
						name="hp_related_post_page_name"
					  />
					</div>
					<small className="text-danger">
					{isError.files.uptodate && <span>From date should be between {staticDate.staticfrom + ' to ' + staticDate.staticupto}</span>}
					</small>
				</Col>
				 
				<Col md={5} className={`checkBox ${checkBox.hideshowRelatedPost}`}>
					<div className="form-group">
					  <label >Related Post</label>					  
					  <Controller
						render={() => (						  
							<span
								class="d-inline-block"
								data-toggle="popover"
								data-trigger="focus"
								data-content="Please selecet account(s)"
								style={{display: "block !important"}}
							>
								<MySelect
								  options={relatedPostLov}
								  isMulti
								  closeMenuOnSelect={false}
								  hideSelectedOptions={false}
								  components={{
									Option,
									MultiValue,
									ValueContainer,
									animatedComponents
								  }}
								  onChange={handleChangeRelatedPost}
								  allowSelectAll={true}
								  value={selectedRelatedPost}
								/>
							</span>						  
						)}
						control={control}
						name="hp_related_post_sys_id"
					  />
					  
					  {/*<Controller
						render={() => (
						  <Select
							//defaultValue={selectedRelatedPost}
							value={selectedRelatedPost}
							isMulti
							onChange={handleChangeRelatedPost}
							//name="hp_related_post_sys_id"
							options={relatedPostLov}
							className="basic-multi-select"
							classNamePrefix="select"
							//styles={customStyles}
						  />)}
						control={control}
						name="hp_related_post_sys_id"
					  />*/}
					  
					  {/*
					  <Controller
						render={() => (
						  <div onKeyUp={(e) => keyupsearch(e)}>
							<Select
							  
							  isMulti
							  value={relatedPostLov.filter(function (option) {
								return option.value === selectedRelatedPost;
							  })}							  
							  onChange={handleChangeRelatedPost}
							  options={relatedPostLov}
							  className="basic-multi-select custdropdwn--"
							  styles={customStyles}
							  classNamePrefix="Select Related Post"
							/>
						  </div>)}
						control={control}
						name="hp_related_post_sys_id "
					  />
					  */}
					</div>
					<small className="text-danger">
					{isError.files.fromdate && <span>From date should be between {staticDate.staticfrom +' to '+ staticDate.staticupto}</span>}
					</small>
				</Col>
				
				
            </Row>{' '}
			
			
            <Row>
              <Col>
                <button type="submit" disabled={isError.buttonDisabled} className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
              </Col>
            </Row>
            </div>
           ) : (
            <div>
              <Row>
                  <Col md={2}>
                    <label>Language</label>
                      <select onChange={(e) => selectLang(e)} ref={register} className="form-control form-control-sm" name="lang_code">
                        {(langForm.langDrop.length>0 ?
                          langForm.langDrop.map((data,inx) => {
                            return(
                              <option key={inx} value={data.code}>{data.desc}</option>
                          )}) :'')
                        }
                    </select>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Section</label>
                      <input type="text" className="form-control form-control-sm" ref={register(validation.hp_desc)} id="hp_desc" name="hp_desc" placeholder="Section" />
                      <input type="hidden" defaultValue={pageName} className="form-control form-control-sm" ref={register} id="hp_page_name" name="hp_page_name" />
                      <small className="text-danger">
                        {errors.hp_desc && errors.hp_desc.message}
                      </small>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label >Link Title</label>
                        <input type="text" ref={register} className="form-control form-control-sm" id="hp_link_title" name="hp_link_title" placeholder="Link Title" />
                    </div>
                  </Col>
              </Row>
              <Row>
                <Col>
                  <label>PC/Tablet</label>
                  <div className="input-group input-group-sm p-0">
                    <div className="custom-file p-0">
                          <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg,.pdf" name="images" onChange={e => fileUpload(e, 'PC')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                      <label className="custom-file-label">{file.name}</label>
                    </div>
                  </div>
                  <small className="text-danger">
                    {isError.files.image && isError.message}
                  </small>
                  <small className="text-danger">* Video Maximum size 200MB</small>
                  <div className="fileborder">
                    {/* <img src={file.previewimage} alt="" thumbnail="true" /> */}
                    {file.previewtype ?
                      <video width="200">
                        <source src={file.previewimage} />
                      </video>
                      : <img src={file.previewimage} alt="" thumbnail="true" />
                    }
                  </div>
                </Col>
                <Col>
                  <label>Mobile Portrait</label>
                  <div className="input-group input-group-sm p-0">
                    <div className="custom-file p-0">
                          <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg,.pdf" onChange={e => fileUpload(e, 'MP')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                      <label className="custom-file-label">{file.name1}</label>
                    </div>
                  </div>
                  <small className="text-danger">
                    {isError.files.imageO && isError.message}
                  </small>
                  <small className="text-danger">* Video Maximum size 200MB</small>
                  <div className="fileborder">
                    {/* <img src={file.previewimage1} alt="" thumbnail="true" /> */}
                        {file.previewtype1 ?
                          <video width="200">
                            <source src={file.previewimage1} />
                          </video>
                          : <img src={file.previewimage1} alt="" thumbnail="true" />
                        }
                  </div>
                </Col>
                <Col>
                  <label>Mobile Landscape</label>
                  <div className="input-group input-group-sm p-0">
                    <div className="custom-file p-0">
                          <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm,.ogg" onChange={e => fileUpload(e, 'ML')} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
                      <label className="custom-file-label">{file.name2}</label>
                    </div>
                  </div>
                  <small className="text-danger">
                    {isError.files.imageT && isError.message}
                  </small>
                  <small className="text-danger">* Video Maximum size 200MB</small>
                  <div className="fileborder">
                    {/* <img src={file.previewimage2} alt="" thumbnail="true" /> */}
                        {file.previewtype2 ?
                          <video width="200">
                            <source src={file.previewimage2} />
                          </video>
                          : <img src={file.previewimage2} alt="" thumbnail="true" />
                        }
                  </div>
                </Col>
              </Row>
              <Row className="mrgTop">
                <Col>
                  <Editor
                    editorState={richText.editor}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName={`editorClassName ` + richText.editablecontent}
                    onEditorStateChange={onEditorStateChange}
                    toolbarCustomButtons={[<ShowEditorCode />]}
                  />
                  {richText.showEditorCode && <textarea className="htmlsourcecss"
                    value={richText.editorHTML}
                    onChange={onEditEditorHTML}
                  />}
                </Col>
              </Row>
              <Row>
                <Col>
                  <button type="submit" disabled={isError.buttonDisabled} className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
                </Col>
              </Row>
            </div>
           )}
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Modalwindow;