
import React, { Component } from 'react';
import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import Select from 'react-select';
import LaddaButton from 'react-ladda';

const url = 'admin/portal/objInfo';

class OBJModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sysid: null,
			errors: {},
			obj_light:'',
			taglov:[],
			// active_yn: '',
			scene_list: [],
			light_list: [],
			obj_list_type: [],
			border_list_type: [],
			loading_btn:false,

		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.multiSelectOption = this.multiSelectOption.bind(this);
	}

	componentWillMount() {
		ApiDataService.get(url + '/getList')
			.then(response => {
				this.setState({
					scene_list: response.data.scene_list,
					light_list: response.data.light_list,
					obj_list_type: response.data.obj_list_type,
					border_list_type: response.data.border_type
				});
				console.log(response.data.obj_list_type);
			}).catch(function (error) {
				console.log(error);
			});
	}
	editModalRecord = (id) => {
		this.setState({ sysid: id });
		ApiDataService.get(`${url}/${id}/edit`).then(response => {
			console.log(response.data.result, "eresr");
			let resp = response.data.result;
			Object.entries(resp).forEach(([key, value]) => {
				this.setState({ [key]: value });
			});
		}).catch((error) => {
			this.props.errorMessage(error.message, "ERR");
		});
	}

	deleteModalRecord = (id) => {
		ApiDataService.delete(`${url}/`, id).then(response => {
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

	stateChanges = (e) => {
		const { name, value } = e.target;
		var values = '';
		console.log(name);
		if (name === 'active_yn' || name === 'transparent') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		} else {
			values = value;
		}
		this.setState({ [name]: values });

		console.log(this.state.obj_scale);
	}


	multiSelectOption(value) {
		let valueArray = [];
		
		for (var i = 0; i < value.length;i++){
		  valueArray.push(value[i].value);
		}
		this.setState({ obj_light: valueArray.join(',') });
	  }

	
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;

		if (!fields['obj_desc']) {
			errors["obj_desc"] = "OBJ name is required";
			formIsValid = false;
		}
		if (!fields['obj_scene']) {
			errors["obj_scene"] = "Scene is required";
			formIsValid = false;
		}
		if (!fields['obj_type']) {
			errors["obj_type"] = "OBJ type is required";
			formIsValid = false;
		}
		if (!fields['obj_light']) {
			errors["obj_light"] = "OBJ Light is required";
			formIsValid = false;
		}
		if (!fields['border_type']) {
			errors["border_type"] = "OBJ border is required";
			formIsValid = false;
		}
		if (!fields['longitude']) {
			errors["longitude"] = "Longitude is required";
			formIsValid = false;
		}
		if (!fields['latitude']) {
			errors["latitude"] = "Latitude is required";
			formIsValid = false;
		}


		this.setState({ errors: errors });
		return formIsValid;
	}
	_handleImageChange1(e) {
		e.preventDefault();
		let reader1 = new FileReader();
		let file1 = e.target.files[0];
		reader1.onloadend = () => {
			this.setState({
				avatar1: file1,
				obj_path: reader1.result
			});
		}
		reader1.readAsDataURL(file1)
	}
	_handleImageChange2(e) {
		e.preventDefault();
		let reader2 = new FileReader();
		let file2 = e.target.files[0];
		reader2.onloadend = () => {
			this.setState({
				avatar2: file2,
				fabric_texture: reader2.result
			});
		}
		reader2.readAsDataURL(file2)
	}
	_handleImageChange3(e) {
		e.preventDefault();
		let reader3 = new FileReader();
		let file3 = e.target.files[0];
		reader3.onloadend = () => {
			this.setState({
				avatar3: file3,
				aluminum_texture: reader3.result
			});
		}
		reader3.readAsDataURL(file3)
	}

	_handleImageChange4(e) {
		e.preventDefault();
		let reader4 = new FileReader();
		let file4 = e.target.files[0];
		reader4.onloadend = () => {
			this.setState({
				avatar4: file4,
				metal_texture: reader4.result
			});
		}
		reader4.readAsDataURL(file4)
	}
	_handleImageChange5(e) {
		e.preventDefault();
		let reader5 = new FileReader();
		let file5 = e.target.files[0];
		reader5.onloadend = () => {
			this.setState({
				avatar5: file5,
				plastic_texture: reader5.result
			});
		}
		reader5.readAsDataURL(file5)
	}
	_handleImageChange6(e) {
		e.preventDefault();
		let reader6 = new FileReader();
		let file6 = e.target.files[0];
		reader6.onloadend = () => {
			this.setState({
				avatar6: file6,
				plastic_OCC: reader6.result
			});
		}
		reader6.readAsDataURL(file6)
	}
	handleSubmit(event) {
		event.preventDefault();
		if (!this.validation()) {
			return false;
		}
		var formData = new FormData();

		let Properties = this.state;
		for (var key in Properties) {
			formData.append(key, Properties[key]);
		}
		this.state.loading_btn=true;
		if (this.props.mode === 'IS') {
			
			ApiDataService.post(url, formData).then(response => {
				this.state.loading_btn=false;
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
				this.state.loading_btn=false;
				console.log(error);
				this.props.errorMessage(error.message, "ERR");
			});
		} else {
			ApiDataService.update(`${url}/update/${this.state.sysid}`, formData).then(response => {
				this.state.loading_btn=false;
				if (response.data.return_status !== "0") {
					if (response.data.error_message === 'Error') {
						this.props.errorMessage(response.data.result, "ERR-OBJ");
					} else {
						this.props.errorMessage(response.data.error_message, "ERR");
					}
				} else {
					this.props.errorMessage(response.data.error_message, "DONE");
					this.props.renderTable();
					//this.props.closeModal();
				}
			}).catch((error) => {
				this.state.loading_btn=false;
				console.log(error);
				this.props.errorMessage(error.message, "ERR");
			});
		}
		
	}


	render() {
		const setValue = this.state;
		let $imagePreview1 = setValue.obj_path ? (<img src={setValue.obj_path} style={{ width: '100%' }} alt="obj" />) : (<div className="previewText"></div>);
		let $imagePreview2 = setValue.fabric_texture ? (<img src={setValue.fabric_texture} style={{ width: '100%' }} alt="fabric texture" />) : (<div className="previewText"></div>);
		let $imagePreview3 = setValue.aluminum_texture ? (<img src={setValue.aluminum_texture} style={{ width: '100%' }} alt="Aluminum Texture" />) : (<div className="previewText"></div>);
		let $imagePreview4 = setValue.metal_texture ? (<img src={setValue.metal_texture} style={{ width: '100%' }} alt="Metal Texture"/>) : (<div className="previewText"></div>);
		let $imagePreview5 = setValue.plastic_texture ? (<img src={setValue.plastic_texture} style={{ width: '100%' }} alt="Plastic Texture" />) : (<div className="previewText"></div>);
		let $imagePreview6 = setValue.plastic_OCC ? (<img src={setValue.plastic_OCC} style={{ width: '100%' }} alt="Occ Texture" />) : (<div className="previewText"></div>);
		
		let obj_lightTags = this.state.obj_light.split(',');
		let objLightTagValue = [];
		for (let i = 0; i < obj_lightTags.length;i++){
		  objLightTagValue.push(setValue.light_list.filter((item) => item.value === obj_lightTags[i])[0]);
		}
		
		return (
			<div>
				<Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
					<Modal.Header closeButton className="">
						<Modal.Title id="modalTitle">
							OBJ Info
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form noValidate onSubmit={this.handleSubmit} autoComplete="off">

							<Form.Row>
								<Col xs={5}>
									<Form.Group>
										<Form.Label>OBJ Name</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.obj_desc} name="obj_desc" placeholder="OBJ Name" require="true" />
										{this.state.errors["obj_desc"] &&
											<span className='custError'>{this.state.errors["obj_desc"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={4}>
									<Form.Group >
										<Form.Label>OBJ Scene</Form.Label>
										<Form.Control as="select" value={setValue.obj_scene} name="obj_scene" require="true" onChange={this.stateChanges}>
											<option value="">Select</option>
											{setValue.scene_list.map((data, i) => (
												<option value={data.SSC_SYS_ID} key={i}>{data.SSC_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["obj_scene"] &&
											<span className='custError'>{this.state.errors["obj_scene"]}</span>
										}
									</Form.Group>
								</Col>
								
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" label="Active" />
									</Form.Group>
								</Col>
								<Col xs={7}>
									<Form.Group >
										<Form.Label>OBJ Light</Form.Label>

										<Select name="obj_light"
										   value={objLightTagValue}
											isMulti
											options={setValue.light_list}
											onChange={this.multiSelectOption} 
											/>

										{this.state.errors["obj_light"] &&
											<span className='custError'>{this.state.errors["obj_light"]}</span>
										}
									</Form.Group>
								</Col>
								
								<Col xs={4}>
									<Form.Group >
										<Form.Label>Border</Form.Label>
										<Form.Control as="select" value={setValue.border_type} name="border_type" require="true" onChange={this.stateChanges}>
											<option value="">Select</option>
											{setValue.border_list_type.map((data, i) => (
												<option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["border_type"] &&
											<span className='custError'>{this.state.errors["border_type"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={3}>
									<Form.Group >
										<Form.Label>Object Type</Form.Label>
										<Form.Control as="select" value={setValue.obj_type} name="obj_type" require="true" onChange={this.stateChanges}>
											<option value="">Select</option>
											{setValue.obj_list_type.map((data, i) => (
												<option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["obj_type"] &&
											<span className='custError'>{this.state.errors["obj_type"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={3}>
									<Form.Group>
										<Form.Label>Longitude</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.longitude} name="longitude" placeholder="Longitude" require="true" />
										{this.state.errors["longitude"] &&
											<span className='custError'>{this.state.errors["longitude"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={3}>
									<Form.Group>
										<Form.Label>Latitude</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.latitude} name="latitude" placeholder="Latitude" />
										{this.state.errors["latitude"] &&
											<span className='custError'>{this.state.errors["latitude"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Transparent?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.transparent === 'Y' ? true : false} type="checkbox" name="transparent" label="Transparent" />
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label col-4">Outside Scale</Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_scale_X} name="outside_scale_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_scale_Y} name="outside_scale_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_scale_Z} name="outside_scale_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label col-4">Inside Scale</Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_scale_X} name="inside_scale_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_scale_Y} name="inside_scale_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_scale_Z} name="inside_scale_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>

								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label col-4">Outside Position</Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_position_X} name="outside_position_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_position_Y} name="outside_position_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.outside_position_Z} name="outside_position_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={6}>
									<Form.Row className="xyz ">
										<Form.Label className="title_label col-4">Inside Position</Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_position_X} name="inside_position_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_position_Y} name="inside_position_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.inside_position_Z} name="inside_position_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>

								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label col-4">Chain Postion</Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.chain_position_X} name="chain_position_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.chain_position_Y} name="chain_position_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.chain_position_Z} name="chain_position_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label col-4">OBJ Rotation </Form.Label>
										<Col xs={2}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.rotation_X} name="rotation_X" placeholder="X" />
										</Col>
										<Col xs={2}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.rotation_Y} name="rotation_Y" placeholder="Y" />
										</Col>
										<Col xs={2}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.rotation_Z} name="rotation_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>

								<Col xs={12} className="text_postion">Vertical Text Position</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label">Inside </Form.Label>
										<Col xs={3}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_inside_X} name="v_text_position_inside_X" placeholder="X" />
										</Col>
										<Col xs={3}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_inside_Y} name="v_text_position_inside_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_inside_Z} name="v_text_position_inside_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label">Outside </Form.Label>
										<Col xs={3}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_outside_X} name="v_text_position_outside_X" placeholder="X" />
										</Col>
										<Col xs={3}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_outside_Y} name="v_text_position_outside_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.v_text_position_outside_Z} name="v_text_position_outside_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={12} className="text_postion">Horizontal Text Position</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label">Inside </Form.Label>
										<Col xs={3}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_inside_X} name="h_text_position_inside_X" placeholder="X" />
										</Col>
										<Col xs={3}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_inside_Y} name="h_text_position_inside_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_inside_Z} name="h_text_position_inside_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Col xs={6}>
									<Form.Row className="xyz">
										<Form.Label className="title_label">Outside </Form.Label>
										<Col xs={3}>
											<Form.Label>X</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_outside_X} name="h_text_position_outside_X" placeholder="X" />
										</Col>
										<Col xs={3}>
											<Form.Label>Y</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_outside_Y} name="h_text_position_outside_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
											<Form.Label>Z</Form.Label>
											<Form.Control type="text" onChange={this.stateChanges} value={setValue.h_text_position_outside_Z} name="h_text_position_outside_Z" placeholder="Z" />
										</Col>
									</Form.Row>
								</Col>
								<Form.Row style={{ paddingTop: '20px' }}>
									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Object file Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png,.obj" type="file" onChange={(e) => this._handleImageChange1(e)} />
														<label className="custom-file-label">{setValue.avatar1 ? setValue.avatar1.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview1}
												</div>
											</Col>
										</Form.Row>
									</Col>
									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Fabric Texture Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange2(e)} />
														<label className="custom-file-label">{setValue.avatar2 ? setValue.avatar2.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview2}
												</div>
											</Col>
										</Form.Row>
									</Col>

									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Aluminum Texture Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange3(e)} />
														<label className="custom-file-label">{setValue.avatar3 ? setValue.avatar3.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview3}
												</div>
											</Col>
										</Form.Row>
									</Col>
									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Metal Texture Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange4(e)} />
														<label className="custom-file-label">{setValue.avatar4 ? setValue.avatar4.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview4}
												</div>
											</Col>
										</Form.Row>
									</Col>

									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Plastic Texture Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange5(e)} />
														<label className="custom-file-label">{setValue.avatar5 ? setValue.avatar5.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview5}
												</div>
											</Col>
										</Form.Row>
									</Col>
									<Col xs={4}>
										<Form.Row>
											<Col xs={12}>
												<label>Plastic OCC Upload</label>
												<div className="input-group input-group-sm p-0">
													<div className="custom-file p-0">
														<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange6(e)} />
														<label className="custom-file-label">{setValue.avatar6 ? setValue.avatar6.name : ''}</label>
													</div>
												</div>
											</Col>
											<Col xs={10}>
												<small className="text-danger">
													{/* {isError.files.image && isError.message} */}
												</small>
												<div className="imgPreview">
													{$imagePreview6}
												</div>
											</Col>
										</Form.Row>
									</Col>

								</Form.Row>




								<Col xs={12}>
									{/* <button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button> */}
									<LaddaButton loading={this.state.loading_btn} type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"} >{this.props.mode === 'IS' ? 'Save' : 'Update'}</LaddaButton>
								</Col>
							</Form.Row>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		)
	}
}
export default OBJModal;