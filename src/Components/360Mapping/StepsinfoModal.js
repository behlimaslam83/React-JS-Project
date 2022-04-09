
import React, { Component } from 'react';
import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

const url = 'admin/portal/stepsInfo';

class StepsinfoModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			step_name: '',
			component_path: '',
			source_data: '',
			material_text: '',
			step_code_name: '',
			sysid: null,
			active_yn: '',
			step_image_path: '',
			imagePreviewUrl: '',
			getStepType: [],

		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	componentWillMount() {
		ApiDataService.get(url + '/getStepType')
			.then(response => {
				this.setState({
					getStepType: response.data.results
				});
			}).catch(function (error) {

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
		if (name === 'active_yn') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		} else {
			values = value;
		}
		this.setState({ [name]: values });

	}
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;


		if (!fields['step_name']) {
			errors["step_name"] = "Step name is required";
			formIsValid = false;
		}
		if (!fields['component_path']) {
			errors["component_path"] = "Component path is required";
			formIsValid = false;
		}
		if (!fields['source_data']) {
			errors["source_data"] = "Source data is required";
			formIsValid = false;
		}
		if (!fields['material_text']) {
			errors["material_text"] = "Material text is required";
			formIsValid = false;
		}
		if (!fields['step_code_name']) {
			errors["step_code_name"] = "Step code name is required";
			formIsValid = false;
		}
		this.setState({ errors: errors });
		return formIsValid;
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
		if (this.props.mode === 'IS') {
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
			ApiDataService.update(`${url}/update/${this.state.sysid}`, formData).then(response => {
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

	}


	_handleImageChange(e) {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		reader.onloadend = () => {
			this.setState({
				avatar: file,
				step_image_path: reader.result
			});
		}
		reader.readAsDataURL(file)
	}


	render() {
		const setValue = this.state;
		let imagePreviewUrl = this.state.step_image_path;

		let $imagePreview = null;

		if (imagePreviewUrl) {
			$imagePreview = (<img src={imagePreviewUrl} style={{ width: '100%' }} alt="Preview Image" />);
		} else {
			$imagePreview = (<div className="previewText"></div>);
		}

		return (
			<div>
				<Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
					<Modal.Header closeButton className="">
						<Modal.Title id="modalTitle">
							Step Info
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form noValidate onSubmit={this.handleSubmit} autoComplete="off">

							<Form.Row>
								<Col xs={5}>
									<Form.Group>
										<Form.Label>Step Name</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.step_name} name="step_name" placeholder="Step Name" require="true" />
										{this.state.errors["step_name"] &&
											<span className='custError'>{this.state.errors["step_name"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={5}>
									<Form.Group>
										<Form.Label>Component Path</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.component_path} name="component_path" placeholder="Component Path" require="true" />
										{this.state.errors["component_path"] &&
											<span className='custError'>{this.state.errors["component_path"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" label="Active" />
									</Form.Group>
								</Col>
								<Col xs={5}>
									<Form.Group >
										<Form.Label>Source Data</Form.Label>
										<Form.Control as="select" value={setValue.source_data} name="source_data" require="true" onChange={this.stateChanges}>
											<option value="">Select</option>
											{setValue.getStepType.map((data, i) => (
												<option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["source_data"] &&
											<span className='custError'>{this.state.errors["source_data"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={5}>
									<Form.Group>
										<Form.Label>Material Text</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.material_text} name="material_text" placeholder="Material Text" require="true" />
										{this.state.errors["material_text"] &&
											<span className='custError'>{this.state.errors["material_text"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={5}>
									<Form.Group>
										<Form.Label>Step Code Name</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.step_code_name} name="step_code_name" placeholder="Step Code Name" />
										<small className="text-danger">
											{this.state.step_code_name && this.state.step_code_name.message}
										</small>
									</Form.Group>
								</Col>
								<Col xs={7}>
									<Form.Row>
										<Col xs={6} style={{ paddingRight: '0px' }}>
											<label>Thumbnail Image</label>
											<div className="input-group input-group-sm p-0">
												<div className="custom-file p-0">
													{/* <input type="file" accept=".jpg,.jpeg,.png" name="image123" onChange={e => fileUpload(e)} className="custom-file-input form-control-sm p-0" id="inputGroupFile02" /> */}
													<input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange(e)} />
													<label className="custom-file-label">{setValue.avatar ? setValue.avatar.name : ''}</label>

												</div>
											</div>
										</Col>
										<Col xs={6} style={{ padding: '0px' }}>
											<small className="text-danger">
												{/* {isError.files.image && isError.message} */}
											</small>
											<small className="text-danger">* Image Maximum size 2MB</small>
											{/* <div className="fileborder">
												<img src={file.previewimage} alt="" thumbnail="true" />
											</div> */}
											<div className="imgPreview">
												{$imagePreview}
											</div>
										</Col>
									</Form.Row>
								</Col>

								<Col xs={12}>
									{/* <button type="submit" className={props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{props.mode === 'IS' ? 'Save' : 'Update'}</button> */}
									<button type="submit" className={this.props.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.props.mode === 'IS' ? 'Save' : 'Update'}</button>
								</Col>
							</Form.Row>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		)
	}
}

export default StepsinfoModal;