
import React, { Component } from 'react';
//import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

const url = 'admin/portal/ProBracket';

class BracketModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sysid: null,
			errors: {},
			SPB_PR_ITEM_CODE: '',
			SPB_CODE: '',
			SPB_CONTROL_TYPE: '',
			SPB_DEPTH: '',
			SPB_ACTIVE_YN: '',
			SPB_CALC_TYPE: '',
			SPB_WEIGHT: '',
			valanceType: [],
			calc_type: {}

		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		ApiDataService.get(url + '/infoData')
			.then(response => {
				this.setState({
					product_list: response.data.product_list,
					control_type: response.data.control_type,
					surface_type : response.data.surface_type,
					material_type: response.data.material_type,
					valance_type: response.data.valance_type,
					valance_code_list: response.data.valance_code_list,
					calc_type: response.data.calc_type
				});
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
		if (name === 'SPB_ACTIVE_YN') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		} else {
			values = value;
		}
		this.setState({ [name]: values });

		console.log(this.state.valance_scale);
	}
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;

		if (!fields['SPB_PR_ITEM_CODE']) {
			errors["SPB_PR_ITEM_CODE"] = "Product name is required";
			formIsValid = false;
		}
		if (!fields['SPB_SURFACE_MATERIAL']) {
			errors["SPB_SURFACE_MATERIAL"] = "Surface material type is required";
			formIsValid = false;
		}
		if (!fields['SPB_CONTROL_TYPE']) {
			errors["SPB_CONTROL_TYPE"] = "Control type is required";
			formIsValid = false;
		}if (!fields['SPB_SURFACE_TYPE']) {
			errors["SPB_SURFACE_TYPE"] = "Surface type is required";
			formIsValid = false;
		}if (!fields['SPB_DEPTH']) {
			errors["SPB_DEPTH"] = "Bracket depth is required";
			formIsValid = false;
		} if (!fields['SPB_WEIGHT']) {
			errors["SPB_WEIGHT"] = "Bracket Weight is required";
			formIsValid = false;
		} if (!fields['SPB_CALC_TYPE']) {
			errors["SPB_CALC_TYPE"] = "Formula is required";
			formIsValid = false;
		}if (!fields['SPB_VALANCE_OPTION']) {
			errors["SPB_VALANCE_OPTION"] = "Valance Option is required";
			formIsValid = false;
		}if (!fields['SPB_CODE']) {
			errors["SPB_CODE"] = "Bracket Code is required";
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


	render() {
		const setValue = this.state;
		let calc_type_list = Object.keys(this.state.calc_type);
		return (
			<div>
				<Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
					<Modal.Header closeButton className="">
						<Modal.Title id="modalTitle">
							Product Bracket
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
							<Form.Row>
								<Col xs={6}>
									<Form.Group>
										<Form.Label>Product Name</Form.Label>
										<Form.Control as="select" value={setValue.SPB_PR_ITEM_CODE} name="SPB_PR_ITEM_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Product Name</option>
											{setValue.product_list && setValue.product_list.map((data, i) => (
												<option value={data.SPI_PR_ITEM_CODE} key={i}>{data.SPI_DESC} {data.ITEM_ID}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_PR_ITEM_CODE"] &&
											<span className='custError'>{this.state.errors["SPB_PR_ITEM_CODE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={4}>
									<Form.Group >
										<Form.Label>Control Type</Form.Label>
										<Form.Control as="select" value={setValue.SPB_CONTROL_TYPE} name="SPB_CONTROL_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Control Type</option>
											{setValue.control_type && setValue.control_type.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_CONTROL_TYPE"] &&
											<span className='custError'>{this.state.errors["SPB_CONTROL_TYPE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.SPB_ACTIVE_YN === 'Y' ? true : false} type="checkbox" name="SPB_ACTIVE_YN" label="Active" />
									</Form.Group>
								</Col>


								<Col xs={4}>
									<Form.Group >
										<Form.Label>Surface Type</Form.Label>
										<Form.Control as="select" value={setValue.SPB_SURFACE_TYPE} name="SPB_SURFACE_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Surface Type</option>
											{setValue.surface_type && setValue.surface_type.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_SURFACE_TYPE"] &&
											<span className='custError'>{this.state.errors["SPB_SURFACE_TYPE"]}</span>
										}
									</Form.Group>
								</Col>


								<Col xs={4}>
									<Form.Group >
										<Form.Label>Material Type</Form.Label>
										<Form.Control as="select" value={setValue.SPB_SURFACE_MATERIAL} name="SPB_SURFACE_MATERIAL" require="true" onChange={this.stateChanges}>
											<option value="">Select Material Type</option>
											{setValue.material_type && setValue.material_type.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_SURFACE_MATERIAL"] &&
											<span className='custError'>{this.state.errors["SPB_SURFACE_MATERIAL"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={4}>
									<Form.Group >
										<Form.Label>Valance Type</Form.Label>
										<Form.Control as="select" value={setValue.SPB_VALANCE_OPTION} name="SPB_VALANCE_OPTION" require="true" onChange={this.stateChanges}>
											<option value="">Select Control Type</option>
											{setValue.valance_type && setValue.valance_type.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_VALANCE_OPTION"] &&
											<span className='custError'>{this.state.errors["SPB_VALANCE_OPTION"]}</span>
										}
									</Form.Group>
								</Col>


								<Col xs={6}>
									<Form.Group>
										<Form.Label>Bracket Code</Form.Label>
										<Form.Control as="select" value={setValue.SPB_CODE} name="SPB_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Bracket Code</option>
											{setValue.valance_code_list && setValue.valance_code_list.map((data, i) => (
												<option value={data.ITEM_CODE} key={i}>{data.ITEM_ID} {data.ITEM_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_CODE"] &&
											<span className='custError'>{this.state.errors["SPB_CODE"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label className="title_label">Calc Type </Form.Label>
										<Form.Control as="select" value={setValue.SPB_CALC_TYPE} name="SPB_CALC_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Calc Type</option>
											{calc_type_list && calc_type_list.map((data, i) => (
												<option value={data} key={i}>{setValue.calc_type[data]}</option>
											))}
										</Form.Control>
										{this.state.errors["SPB_CALC_TYPE"] &&
											<span className='custError'>{this.state.errors["SPB_CALC_TYPE"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label>Bracket Depth </Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPB_DEPTH} name="SPB_DEPTH" placeholder="Bracket Depth" />
										{this.state.errors["SPB_DEPTH"] &&
											<span className='custError'>{this.state.errors["SPB_DEPTH"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label className="title_label">Bracket Weight</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPB_WEIGHT} name="SPB_WEIGHT" placeholder="Bracket Weight" />
										{this.state.errors["SPB_WEIGHT"] &&
											<span className='custError'>{this.state.errors["SPB_WEIGHT"]}</span>
										}
									</Form.Group>
								</Col>


								<Col xs={12}>
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
export default BracketModal;