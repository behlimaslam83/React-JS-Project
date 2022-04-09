import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import './PageInfo.scss';
import { Row, Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
//import SlugInfo from '../PageInfo/SlugInfo';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
const moment= require('moment');
const querystring = require('querystring');

const url = 'admin/portal/page_info';
function PageInfoModal(props){
  const [formData, setFormData] = useState({
    checkYn: "Y",
    checkActive: true,
    pageYn: "Y",
    checkPage: true,
    autoYn: "N",
    checkPrnt: false,
    checkAuto: false,
    isPublish:false,
    headsysid:"",
    previewPageName:"",
	previewSlugName:"",
    previewCountyCode:"",
    previewLangCode:"",
    previewFromDate:"",
    previewUptoDate:"",
	slugListData:"",
	from_slug_url:"",
	to_slug_url:"",
	//slugName: (props.sysid)?props.sysid:''
	//preview_from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(),
	//preview_upto_date:moment(new Date(), 'DD-MMM-YYYY').toDate(),
  });
	const [date, setDate] = useState({
		startDate: new Date(),
		endDate: new Date() 
	});
	const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
	const [countryLov, setCountryLov] = useState([]);
	const [languageLov, setLanguageLov] = useState([]);
	const [slugLov, setSlugLov] = useState([]);
	const [slugName, setSlugName] = useState({
		slugName: props.sysid,
	});
	
	const onSubmit = (data) => {
		console.log(data);
		if (props.mode === 'IS') {
			ApiDataService.post(url, querystring.stringify(data)).then(response => {
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					props.errorMessage(response.data.error_message, "DONE");
					props.renderTable();
					props.closeModal();
				}
			}).catch((error) => {
				console.log(error);
				props.errorMessage(error.message, "ERR");
			});
		}else if (props.mode === 'PR') {
			//alert('Hello')
			//console.log("DATA GET - ",data);	
			
			ApiDataService.post(`${url}/page_preview`, querystring.stringify(data)).then(response => {
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {					
					//alert(data.slug_name);					
					setFormData({ ...formData, isPublish: true, previewPageName: data.page_name, previewSlugName: data.slug_url, previewCountyCode: data.country, previewLangCode: data.lang_code_flag, previewFromDate:data.from_date, previewUptoDate:data.upto_date });
					props.errorMessage(response.data.error_message, "DONE");
					window.open(response.data.result.url, 'Data','height=600,width=800,left=200,top=200');
					setFormData({ ...formData, isPublish: true, previewPageName: data.page_name, previewSlugName: data.slug_url, previewCountyCode: data.country, previewLangCode: data.lang_code_flag, previewFromDate:data.from_date, previewUptoDate:data.upto_date });
					console.log(formData,"formData TESIGNG");
				}
			}).catch((error) => {
				console.log(error);
				props.errorMessage(error.message, "ERR");
			});	
		}else if (props.mode === 'SL') {
			//alert('Hello')
			//console.log("DATA - ",formData);
			//alert(data.from_slug_url)
			//return false;
			
			//setSlugName(props.sysid);
			
			const slugDataObj = {
							from_slug_url:data.from_slug_url,
							to_slug_url:data.to_slug_url,
							dup_structure_yn:data.page_info_active_yn,
							//dup_section_yn:data.page_info_common_struc_yn,
							page_name:slugName
						}
			ApiDataService.post(`${url}/duplicate_slug`, querystring.stringify(slugDataObj)).then(response => {
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					//setFormData({ ...formData, slugListData: response.data });
					props.errorMessage(response.data.error_message+': Selected slug successfully duplicated.', "DONE");
					props.closeModal();
					//window.open(response.data.result.url, 'Data','height=600,width=800,left=200,top=200');
					//setFormData({ ...formData, isPublish: true, previewPageName: data.page_name });
					//console.log(formData,"formData TESIGNG");
				}
			}).catch((error) => {
				console.log(error);
				props.errorMessage(error.message, "ERR");
			});	
		} else {			
			ApiDataService.update(`${url}/update/${formData.headsysid}`, querystring.stringify(data)).then(response => {
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					props.errorMessage(response.data.error_message, "DONE");
					props.renderTable();
					props.closeModal();
				}
			}).catch((error) => {
				console.log(error);
				props.errorMessage(error.message, "ERR");
			});
		}
	}
	
  const ActiveCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setFormData({ ...formData, checkYn: "Y", checkActive: true });
    } else {
      setFormData({ ...formData, checkYn: "N", checkActive: false });
    }
  }

  const PageCheck = (event) => {
    var checked = event.target.checked;
    if (checked) {
      setFormData({ ...formData, pageYn: "Y", checkPage: true });
    } else {
      setFormData({ ...formData, pageYn: "N", checkPage: false });
    }
  }
	
	const validate = {
		page_info_code: { required: "Info Code is required" },
		page_info_desc: { required: "Info Description is required" },		
		from_date: { required: "From date is required" },
		upto_date: { required: "Upto date is required" },
		country: { required: "Please select country" },
		lang_code_flag: { required: "Please select language." },
		//slug_url: { required: "Please select slug url." }, 
		from_slug_url: { required: "Please select slug url." },
		to_slug_url: { required: "Slug URL is required." }, 
	};

	useEffect(() => {
		if (props.mode === 'IS'){
			setFormData((formData) => ({ checkActive: true, checkPage: true, checkYn: "Y", pageYn: "Y" }));
		}
		if (props.sysid && props.mode === 'UP') {
			let id = props.sysid;
			ApiDataService.get(`${url}/${id}/edit`).then(response => {
				console.log(response.data, "rest");
				let data = response.data.result[0];
				let checkActive='';
				let checkPage = '';
				let checkYn = '';
				let pageYn = '';
				Object.keys(data).forEach((key) => {
					setValue(key, data[key]);
					if (key === "page_info_active_yn") {
						if (data[key] === 'Y') {
							checkActive = true;
							checkYn = "Y";
						} else {
							checkActive = false;
							checkYn = "N";
						}
						console.log(formData,"formData");
					}
					if (key === "page_info_common_struc_yn"){
						if (data[key] === 'Y') {
							checkPage = true;
							pageYn = "Y"
						} else {
							checkPage = false;
							pageYn = "N"
						}
					}
					
				});
				setFormData((formData) => ({ checkPage: checkPage, checkActive: checkActive, headsysid: id, checkYn: checkYn, pageYn: pageYn }));
			}).catch({ });
		}else if (props.sysid && props.mode === 'PR') {		
			let defaultDate = moment(new Date(), 'DD-MMM-YYYY').toDate();
			let dbDate = moment(new Date()).format('DD-MMM-YYYY');
			setDate((date) => ({
			  ...date, startDate: defaultDate, endDate: defaultDate
			}));
			setValue('from_date', dbDate);
			setValue('upto_date', dbDate);
			setValue('headsysid', props.sysid);	
			//setFormData({ ...formData, isPublish: true, headsysid: props.sysid });
			setFormData((formData) => ({ isPublish: false, previewPageName: props.sysid, previewSlugName: "", previewCountyCode: "", previewLangCode: "", previewFromDate: "", previewUptoDate: "" }))
			
			ApiDataService.get(`${url}/slug_list_view?page_name=${props.sysid}`).then(response => {				
				const resultObj = response.data;
				console.log('Result Object - ',resultObj.results);
				if(resultObj.return_status === "0"){				   
				   setSlugLov(resultObj.result);				   
				}else{
					props.errorMessage(resultObj.error_message, "ERR");				  
				}				
			}).catch((error) => {
				props.errorMessage(error.message, "ERR");				
			});
			
			ApiDataService.get(`${url}/lov_for_preview_page`).then(response => {				
				const resultObj = response.data;			
				let countryObj = resultObj.country;				
				if(countryObj.return_status === "0"){				   
				   setCountryLov(countryObj.result);				   
				}else{
					props.errorMessage(countryObj.error_message, "ERR");				  
				}
				
				let languageObj = resultObj.language;				
				if(languageObj.return_status === "0"){
				   setLanguageLov(languageObj.result)
				}else{
					props.errorMessage(languageObj.error_message, "ERR");				  
				}				
			}).catch((error) => {
				props.errorMessage(error.message, "ERR");				
			});
		} else if (props.sysid && props.mode === 'IS'){
			let id = props.sysid;
			ApiDataService.delete(`${url}/`, id).then(response => {
				console.log(response.data, "rest");
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					props.errorMessage(response.data.error_message, "DONE");
					props.renderTable();
				}
				props.closeDelete();
			}).catch((error) => {
				props.errorMessage(error.message, "ERR");
				props.closeDelete();
			});
		} else if (props.sysid && props.mode === 'SL'){
			//let id = props.sysid;
			setSlugName(props.sysid);
			ApiDataService.get(`${url}/slug_list_view?page_name=${props.sysid}`).then(response => {				
				const resultObj = response.data;
				console.log('Result Object - ',resultObj.results);
				if(resultObj.return_status === "0"){				   
				   setSlugLov(resultObj.result);				   
				}else{
					props.errorMessage(resultObj.error_message, "ERR");				  
				}				
			}).catch((error) => {
				props.errorMessage(error.message, "ERR");				
			});
		}
	}, [props, setValue]);
  		
	const changeDate = (data, mode) => {
		console.log(data);
		var format = moment(data).format('DD-MMM-YYYY');
		(mode === 'FD' ? setDate({ ...date, startDate: data }) : setDate({ ...date, endDate: data }));
		(mode === 'FD' ? setValue('from_date', format) : setValue('upto_date', format));
	}
	
	/*
	const pagePreview = (page_info_code) => {
		//this.setState({ deletedialog: true });
		this.setState({ modalShow: true, mode: 'PR', sysid: page_info_code },
		  () => { this.setState({ sysid: null }); });
	}
	*/

	const pagePublish = () => {
		console.log('formData - ',formData);
		//alert('Aaya - '+formData.previewCountyCode+'   '
		//+formData.previewPageName+'   '
		//+formData.previewLangCode);
		
		//alert(formData.previewSlugName);
		//return false;
		
		const dataObj = {
							page_name:formData.previewPageName,
							slug_url:formData.previewSlugName,
							country:formData.previewCountyCode,
							lang_code_flag:formData.previewLangCode,
							from_date:formData.previewFromDate,
							upto_date:formData.previewUptoDate
						}
		ApiDataService.post(`${url}/publish`, querystring.stringify(dataObj)).then(response => {
			if (response.data.return_status !== "0") {
				if (response.data.error_message === 'Error') {
					props.errorMessage(response.data.result, "ERR-OBJ");
				} else {
					props.errorMessage(response.data.error_message, "ERR");
				}
			} else {
				props.errorMessage("Page successfully published", "DONE");
				//props.renderTable();
				props.closeModal();
			}
		}).catch((error) => {
			console.log(error);
			props.errorMessage(error.message, "ERR");
		});
	}
	
  return (
    <div>
      <Modal animation={false} className="full-width-" size={props.mode === 'SL'?"md":"sm"} show={props.show} onHide={props.closeModal} >
        <Modal.Header closeButton className="">
          <Modal.Title id="modalTitle">
            Page 
			{ (props.mode === 'PR') && ' Preview' } 				
			{ (props.mode === 'SL') && ' Slug - '+slugName }
			{ (props.mode !== 'PR' && props.mode !== 'SL') && ' Info' }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 			
			<Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
			{props.mode === 'SL' && 				
				<Row>
					<Col xs={12}>
						<Form.Group controlId="from_slug_url">
							<Form.Label>Slug Name</Form.Label>
							<select ref={register(validate.from_slug_url)} className="form-control" name="from_slug_url">
								<option value="">Select Slug Name</option>
								{slugLov.map((data,i) => (
									<option value={data.slug_url} key={i}>{data.slug_url}</option>
								))}
							</select>
							
						</Form.Group>						
					</Col>
					<Col xs={12}>
						<Form.Group>
						  <Form.Label>Enter New Slug</Form.Label>
						  <Form.Control ref={register(validate.to_slug_url)} type="text" name="to_slug_url" placeholder="Enter New Slug" />
							<small className="text-danger">
							{errors.to_slug_url && errors.to_slug_url.message}
							</small>
						</Form.Group>
					</Col>
					<Col xs={12}>
						<Form.Group className="flexgrp">
						  <Form.Check type="checkbox" checked={formData.checkActive} onChange={ActiveCheck} label="Structure Duplicate" />
						  <input type="hidden" name="page_info_active_yn" ref={register} value={formData.checkYn} />
							  {/*
						  <Form.Check type="checkbox" checked={formData.checkPage} onChange={PageCheck} label="Section Duplicate" />
						  <input type="hidden" name="page_info_common_struc_yn" ref={register} value={formData.pageYn} />
							  */}
						</Form.Group>
					</Col>
					<Col xs={12}>
						<Form.Group>
							<button type="submit" className={"btn btn-primary btn-sm"}>Copy</button>
						</Form.Group>
					</Col>
					
				</Row>
				/* <SlugInfo page_name={props.sysid} pageSecondPreview={props.pagePreview} /> */
			
			}
			
			{props.mode === 'PR' && 
				<Row>
					<Col xs={12}>
						<Form.Group controlId="slug_url">
							<Form.Label>Slug Name</Form.Label>
							<select ref={register(validate.slug_url)} className="form-control" name="slug_url">
								<option value="">Select Slug Name</option>
								{slugLov.map((data,i) => (
									<option value={data.slug_url} key={i}>{data.slug_url}</option>
								))}
							</select>
							<small className="text-danger">
								{errors.slug_url && errors.slug_url.message}
							</small>
						</Form.Group>						
					</Col>
					<Col xs={12}>
						<Form.Group controlId="preview_from_date">
							<Form.Label>Preview Date</Form.Label>								
							<Controller
							  control={control}
							  name="from_date"							  
								render={(onChange) => (
									<DatePicker										
										selected={ date.startDate }
										onChange={ date => changeDate(date, 'FD') }
										value={ date.startDate }
										//name="from_date"
										dateFormat="dd-MMM-yyyy" 
										className="form-control"
									/>
								)}
							/>
							<small className="text-danger">
								{errors.from_date && errors.from_date.message}
							</small>
						</Form.Group>														
					</Col>
					
					<Col xs={12} className="d-sm-none">
						<Form.Group controlId="preview_upto_date">
							<Form.Label>Upto Date</Form.Label>							
							<Controller
							  control={control}
							  name="upto_date"							  
								render={(onChange) => (
									<DatePicker											
										selected={ date.endDate } 
										onChange={ date => changeDate(date, 'UP') }
										value={ date.endDate }
										//name="upto_date" 
										dateFormat="dd-MMM-yyyy" 
										className="form-control"
									/>
								)}
							/>
							<small className="text-danger">
								{errors.upto_date && errors.upto_date.message}
							</small>
						</Form.Group>					
					</Col>				
					
					<Col xs={12}>
						<Form.Group controlId="country">
							<Form.Label>Country</Form.Label>
							<select ref={register(validate.country)} className="form-control" name="country">
								<option value="">Select Country</option>
								{countryLov.map((data,i) => (
									<option value={data.code} key={i}>{data.desc}</option>
								))}
							</select>
							<small className="text-danger">
								{errors.country && errors.country.message}
							</small>
						</Form.Group>						
					</Col>	
					
					<Col xs={12}>
						<Form.Group controlId="lang_code_flag">
							<Form.Label>Language</Form.Label>
							<select ref={register(validate.lang_code_flag)} className="form-control" name="lang_code_flag">
								<option value="">Select Language</option>
								{languageLov.map((data,i) => (
									<option value={data.code} key={i}>{data.desc}</option>
								))}
							</select>
							<small className="text-danger">
								{errors.lang_code_flag && errors.lang_code_flag.message}
							</small>
						</Form.Group>						
					</Col>	
					<Col xs={12} className="alignCenter">
						<input ref={register} type="hidden" name="page_name" value={props.sysid} />
						{ formData.isPublish===true && <button type="button" className="btn btn-success m-1" onClick={ date => pagePublish(props.sysid) }>Publish</button> }
						<button type="submit" className="btn btn-primary m-1">Preview</button>
					</Col>
				</Row>
			}
			
			{(props.mode !== 'PR' && props.mode !== 'SL') && 
				<Row>					
					<Col xs={12}>
						<Form.Group>
						  <Form.Label>Page Info Code</Form.Label>
						  <Form.Control ref={register(validate.page_info_code)} type="text" name="page_info_code" placeholder="Page Info Code" />
							<small className="text-danger">
							{errors.page_info_code && errors.page_info_code.message}
							</small>
						</Form.Group>
					</Col>
								
					<Col xs={12}>
						<Form.Group>
							<Form.Label>Page Info Description</Form.Label>
						  <Form.Control type="text" name="page_info_desc" ref={register(validate.page_info_desc)} placeholder="Page Info Description" />
						  <small className="text-danger">
							{errors.page_info_desc && errors.page_info_desc.message}
						  </small>
						</Form.Group>
					</Col>
									
					<Col xs={12}>
						<Form.Group className="">
						  <Form.Check type="checkbox" checked={formData.checkActive} onChange={ActiveCheck} label="Active" />
						  <input type="hidden" name="page_info_active_yn" ref={register} value={formData.checkYn} />
						</Form.Group>
					</Col>
					<Col xs={12}>
						<Form.Group className="">
							<Form.Check type="checkbox" checked={formData.checkPage} onChange={PageCheck} label="Common Structure ?" />
							<input type="hidden" name="page_info_common_struc_yn" ref={register} value={formData.pageYn} />
						</Form.Group>
					</Col>
				
					<Col xs={12}>
						<button type="submit" className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
					</Col>
				</Row>				
			}
			</Form>
			
        </Modal.Body>
      </Modal>
    </div>
    )
}

export default PageInfoModal;