import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import './360Mapping.scss';
import { Row, Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
const moment = require('moment');
const querystring = require('querystring');

const url = 'admin/portal/stepsInfo';
function StepsinfoModal(props) {
	const [formData, setFormData] = useState({
		checkYn: "Y",
		checkActive: true,
		pageYn: "Y",
		checkPage: true,
		autoYn: "N",
		checkPrnt: false,
		checkAuto: false,
		isPublish: false,
		headsysid: "",
		previewPageName: "",
		previewCountyCode: "",
		previewLangCode: "",
		previewFromDate: "",
		previewUptoDate: ""
		//preview_from_date:moment(new Date(), 'DD-MMM-YYYY').toDate(),
		//preview_upto_date:moment(new Date(), 'DD-MMM-YYYY').toDate(),
	});
	console.log(props.editModal);
	const [date, setDate] = useState({
		startDate: new Date(),
		endDate: new Date()
	});
	const [isError, setIsError] = useState({
		buttonDisabled: false,
		files: {
			image: false,
		},
		message: "File size should n't greater then 2Mb."
	});
	const [file, setFile] = useState({
		validate: "image is required",
		image: '',
		previewimage: 'http://api.spineweb.com/uploads/common/noimage.jpg',
		boolprevi: false,
		name: '',
	});
	const [getStepType, setGetStepType] = useState([]);


	const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
	const [countryLov, setCountryLov] = useState([]);
	const [languageLov, setLanguageLov] = useState([]);
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
		} else if (props.mode === 'PR') {
			//alert('Hello')
			//console.log("DATA - ",data);			
			ApiDataService.post(`${url}/page_preview`, querystring.stringify(data)).then(response => {
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					setFormData({ ...formData, isPublish: true, previewPageName: data.page_name, previewCountyCode: data.country, previewLangCode: data.lang_code_flag, previewFromDate: data.from_date, previewUptoDate: data.upto_date });
					props.errorMessage(response.data.error_message, "DONE");
					window.open(response.data.result.url, 'Data', 'height=600,width=800,left=200,top=200');
					setFormData({ ...formData, isPublish: true, previewPageName: data.page_name, previewCountyCode: data.country, previewLangCode: data.lang_code_flag, previewFromDate: data.from_date, previewUptoDate: data.upto_date });
					console.log(formData, "formData TESIGNG");
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
		step_name: { required: "Step name is required" },
		component_path: { required: "Component path is required" },
		source_data: { required: "Source data is required" },
		material_text: { required: "Source data is required" },
		from_date: { required: "From date is required" },
		upto_date: { required: "Upto date is required" },
		country: { required: "Please select country" },
		lang_code_flag: { required: "Please select language." },
	};

	const fileUpload = (e) => {
		let name = e.target.files[0].name;
		let preview = URL.createObjectURL(e.target.files[0]);
		let fileSize = e.target.files[0].size / 1024 / 1024;
		var boolenCount = '';
		console.log(file);
		if (fileSize <= 2) {
			setIsError(prevState => ({
				...prevState, files: { ...prevState.files, image: false }
			}));
		} else {
			setIsError(prevState => ({
				...prevState, files: { ...prevState.files, image: true }
			}));
		}
		setFile({ ...file, image: e.target.files[0], previewimage: preview, boolprevi: true, name: name });
		console.log(file);
	}

	useEffect(() => {

		ApiDataService.getAll(url + '/getStepType', '').then(response => {
			console.log(response.data, "rest");
			if (response.data.return_status !== "0") {
				if (response.data.error_message === 'Error') {
					props.errorMessage(response.data.result, "ERR-OBJ");
				} else {
					props.errorMessage(response.data.error_message, "ERR");
				}
			} else {
				props.errorMessage(response.data.error_message, "DONE");
				setGetStepType(response.data.results);
			}
		}).catch((error) => {
			props.errorMessage(error.message, "ERR");
		});


		// if (props.sysid && props.mode === 'UP') {
		// 	let id = props.sysid;
		// 	ApiDataService.get(`${url}/${id}/edit`).then(response => {
		// 		console.log(response.data, "rest");
		// 		let data = response.data.result[0];
		// 		Object.keys(data).forEach((key) => {
		// 			setValue(key, data[key]);
		// 			if (key === "active_yn") {
		// 				if (data[key] === 'Y') {
		// 					setFormData((formData) => ({ checkActive: true, headsysid: id }));
		// 				} else {
		// 					setFormData((formData) => ({ checkActive: false, headsysid: id }))
		// 				}
		// 			}
		// 			if (key === "page_info_common_struc_yn") {
		// 				if (data[key] === 'Y') {
		// 					setFormData((formData) => ({ checkPage: true }));
		// 				} else {
		// 					setFormData((formData) => ({ checkPage: false }))
		// 				}
		// 			}
		// 		});
		// 	}).catch({});
		// } else if (props.sysid && props.mode === 'PR') {
		// 	let defaultDate = moment(new Date(), 'DD-MMM-YYYY').toDate();
		// 	let dbDate = moment(new Date()).format('DD-MMM-YYYY');
		// 	setDate((date) => ({
		// 		...date, startDate: defaultDate, endDate: defaultDate
		// 	}));
		// 	setValue('from_date', dbDate);
		// 	setValue('upto_date', dbDate);
		// 	setValue('headsysid', props.sysid);
		// 	//setFormData({ ...formData, isPublish: true, headsysid: props.sysid });
		// 	setFormData((formData) => ({ isPublish: false, previewPageName: props.sysid, previewCountyCode: "", previewLangCode: "", previewFromDate: "", previewUptoDate: "" }))

		// 	ApiDataService.get(`${url}/lov_for_preview_page`).then(response => {
		// 		const resultObj = response.data;
		// 		let countryObj = resultObj.country;
		// 		if (countryObj.return_status === "0") {
		// 			setCountryLov(countryObj.result);
		// 		} else {
		// 			props.errorMessage(countryObj.error_message, "ERR");
		// 		}

		// 		let languageObj = resultObj.language;
		// 		if (languageObj.return_status === "0") {
		// 			setLanguageLov(languageObj.result)
		// 		} else {
		// 			props.errorMessage(languageObj.error_message, "ERR");
		// 		}
		// 	}).catch((error) => {
		// 		props.errorMessage(error.message, "ERR");
		// 	});
		// } else if (props.sysid && props.mode === 'IS') {
		// 	let id = props.sysid;
		// 	ApiDataService.delete(`${url}/`, id).then(response => {
		// 		console.log(response.data, "rest");
		// 		if (response.data.return_status !== "0") {
		// 			if (response.data.error_message === 'Error') {
		// 				props.errorMessage(response.data.result, "ERR-OBJ");
		// 			} else {
		// 				props.errorMessage(response.data.error_message, "ERR");
		// 			}
		// 		} else {
		// 			props.errorMessage(response.data.error_message, "DONE");
		// 			props.renderTable();
		// 		}
		// 		props.closeDelete();
		// 	}).catch((error) => {
		// 		props.errorMessage(error.message, "ERR");
		// 		props.closeDelete();
		// 	});
		// }
		// setFormData((formData) => ({ checkActive: true, checkPage: true, checkYn: "Y", pageYn: "Y" }));
	}, []);

	const abc=()=>{
		console.log('here..');
	}
	const changeDate = (data, mode) => {
		console.log(data);
		var format = moment(data).format('DD-MMM-YYYY');
		(mode === 'FD' ? setDate({ ...date, startDate: data }) : setDate({ ...date, endDate: data }));
		(mode === 'FD' ? setValue('from_date', format) : setValue('upto_date', format));
	}

	const pagePublish = () => {
		//console.log('formData - ',formData);
		//alert('Aaya - '+formData.previewCountyCode+'   '
		//+formData.previewPageName+'   '
		//+formData.previewLangCode);
		const dataObj = {
			page_name: formData.previewPageName,
			country: formData.previewCountyCode,
			lang_code_flag: formData.previewLangCode,
			from_date: formData.previewFromDate,
			upto_date: formData.previewUptoDate
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
		<>
			<Modal animation={false} className="full-width" size={props.mode === 'PR' ? "lg" : "lg"} show={props.show} onHide={props.closeModal} >
				<Modal.Header closeButton className="">
					<Modal.Title id="modalTitle">
						Step {props.mode === 'PR' ? 'Preview' : 'Info'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">

						{props.mode === 'PR' &&
							<Row>
								<Col xs={6}>
									<Form.Group controlId="preview_from_date">
										<Form.Label>From Date</Form.Label>
										<Controller
											control={control}
											name="from_date"
											render={(onChange) => (
												<DatePicker
													selected={date.startDate}
													onChange={date => changeDate(date, 'FD')}
													value={date.startDate}
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

								<Col xs={6}>
									<Form.Group controlId="preview_upto_date">
										<Form.Label>Upto Date</Form.Label>
										<Controller
											control={control}
											name="upto_date"
											render={(onChange) => (
												<DatePicker
													selected={date.endDate}
													onChange={date => changeDate(date, 'UP')}
													value={date.endDate}
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
											{countryLov.map((data, i) => (
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
											{languageLov.map((data, i) => (
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
									{formData.isPublish === true && <button type="button" className="btn btn-success m-1" onClick={date => pagePublish(props.sysid)}>Publish</button>}
									<button type="submit" className="btn btn-primary m-1">Preview</button>
								</Col>
							</Row>
						}

						{props.mode !== 'PR' &&
							<Row>
								<Col xs={5}>
									<Form.Group>
										<Form.Label>Step Name</Form.Label>
										<Form.Control ref={register(validate.step_name)} type="text" name="step_name" placeholder="Step Name" require="true" />
										<small className="text-danger">
											{errors.step_name && errors.step_name.message}
										</small>
									</Form.Group>
								</Col>
								<Col xs={5}>
									<Form.Group>
										<Form.Label>Component Path</Form.Label>
										<Form.Control type="text" name="component_path" ref={register(validate.component_path)} placeholder="Component Path" require="true" />
										<small className="text-danger">
											{errors.component_path && errors.component_path.message}
										</small>
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check type="checkbox" checked={formData.checkActive} onChange={ActiveCheck} />
										<input type="hidden" name="active_yn" ref={register} value={formData.checkYn} />
									</Form.Group>
								</Col>
								<Col xs={5}>
									<Form.Group >
										<Form.Label>Source Data</Form.Label>
										<select ref={register(validate.country)} className="form-control" name="source_data" require="true">
											<option value="">Select</option>
											{getStepType.map((data, i) => (
												<option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
											))}
										</select>
										<small className="text-danger">
											{errors.source_data && errors.source_data.message}
										</small>
									</Form.Group>
								</Col>

								<Col xs={5}>
									<Form.Group>
										<Form.Label>Material Text</Form.Label>
										<Form.Control type="text" name="material_text" ref={register(validate.material_text)} placeholder="Material Text" require="true" />
										<small className="text-danger">
											{errors.material_text && errors.material_text.message}
										</small>
									</Form.Group>
								</Col>

								<Col xs={5}>
									<Form.Group>
										<Form.Label>Tooltip</Form.Label>
										<Form.Control type="text" name="tooltip" ref={register(validate.tooltip)} placeholder="Tooltip" />
										<small className="text-danger">
											{errors.tooltip && errors.tooltip.message}
										</small>
									</Form.Group>
								</Col>
								<Col xs={7}>
									<Row>
										<Col xs={6} style={{ paddingRight: '0px' }}>
											<label>Thumbnail Image</label>
											<div className="input-group input-group-sm p-0">
												<div className="custom-file p-0">
													<input type="file" accept=".jpg,.jpeg,.png" name="image123" onChange={e => fileUpload(e)} ref={register} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" />
													<label className="custom-file-label">{file.name}</label>
												</div>
											</div>
										</Col>
										<Col xs={6} style={{ padding: '0px' }}>
											<small className="text-danger">
												{isError.files.image && isError.message}
											</small>
											<small className="text-danger">* Image Maximum size 2MB</small>
											<div className="fileborder">
												<img src={file.previewimage} alt="" thumbnail="true" />
											</div>
										</Col>
									</Row>
								</Col>



								<Col xs={12}>
									<button type="submit" className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button>
								</Col>
							</Row>
						}
					</Form>

				</Modal.Body>
			</Modal>
		</>
	)
}

export default StepsinfoModal;