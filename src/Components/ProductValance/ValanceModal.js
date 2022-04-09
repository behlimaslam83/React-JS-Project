
import React, { Component } from 'react';
//import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

const url = 'admin/portal/ProValance';

class ValanceModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sysid: null,
			errors: {},
			SPV_PR_ITEM_CODE: '',
			SPV_CODE: '',
			SPV_CONTROL_TYPE: '',
			SPV_DEPTH: '',
			SPV_ACTIVE_YN: '',
			SPV_CALC_TYPE:'',
			SPV_WEIGHT:'',
			valanceType: [],
			calc_type:{}

		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		ApiDataService.get(url + '/infoData')
			.then(response => {
				this.setState({
					product_list: response.data.product_list,
					control_type: response.data.control_type,
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
		if (name === 'SPV_ACTIVE_YN') {
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

		if (!fields['SPV_PR_ITEM_CODE']) {
			errors["SPV_PR_ITEM_CODE"] = "Product name is required";
			formIsValid = false;
		}
		if (!fields['SPV_CODE']) {
			errors["SPV_CODE"] = "Valance code is required";
			formIsValid = false;
		}
		if (!fields['SPV_CONTROL_TYPE']) {
			errors["SPV_CONTROL_TYPE"] = "Control type is required";
			formIsValid = false;
		}
		if (!fields['SPV_DEPTH']) {
			errors["SPV_DEPTH"] = "Valance depth is required";
			formIsValid = false;
		} if (!fields['SPV_WEIGHT']) {
			errors["SPV_WEIGHT"] = "Valance Weight is required";
			formIsValid = false;
		}if (!fields['SPV_CALC_TYPE']) {
			errors["SPV_CALC_TYPE"] = "Formula is required";
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
							Product Valance
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
							<Form.Row>
								<Col xs={6}>
									<Form.Group>
										<Form.Label>Product Name</Form.Label>
										<Form.Control as="select" value={setValue.SPV_PR_ITEM_CODE} name="SPV_PR_ITEM_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Product Name</option>
											{setValue.product_list && setValue.product_list.map((data, i) => (
												<option value={data.SPI_PR_ITEM_CODE} key={i}>{data.SPI_DESC} {data.ITEM_ID}</option>
											))}
										</Form.Control>
										{this.state.errors["SPV_PR_ITEM_CODE"] &&
											<span className='custError'>{this.state.errors["SPV_PR_ITEM_CODE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={4}>
									<Form.Group >
										<Form.Label>Control Type</Form.Label>
										<Form.Control as="select" value={setValue.SPV_CONTROL_TYPE} name="SPV_CONTROL_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Control Type</option>
											{setValue.control_type && setValue.control_type.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPV_CONTROL_TYPE"] &&
											<span className='custError'>{this.state.errors["SPV_CONTROL_TYPE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.SPV_ACTIVE_YN === 'Y' ? true : false} type="checkbox" name="SPV_ACTIVE_YN" label="Active" />
									</Form.Group>
								</Col>
								<Col xs={6}>
									<Form.Group>
										<Form.Label>Valance Code</Form.Label>
										<Form.Control as="select" value={setValue.SPV_CODE} name="SPV_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Valance Code</option>
											{setValue.valance_code_list && setValue.valance_code_list.map((data, i) => (
												<option value={data.ITEM_CODE} key={i}>{data.ITEM_ID} {data.ITEM_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPV_CODE"] &&
											<span className='custError'>{this.state.errors["SPV_CODE"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label className="title_label">Calc Type </Form.Label>
										<Form.Control as="select" value={setValue.SPV_CALC_TYPE} name="SPV_CALC_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Calc Type</option>
											{calc_type_list && calc_type_list.map((data, i) => (
												<option value={data} key={i}>{setValue.calc_type[data]}</option>
											))}
										</Form.Control>
										{this.state.errors["SPV_CALC_TYPE"] &&
											<span className='custError'>{this.state.errors["SPV_CALC_TYPE"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label>Valance Depth </Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPV_DEPTH} name="SPV_DEPTH" placeholder="Valance Depth" />
										{this.state.errors["SPV_DEPTH"] &&
											<span className='custError'>{this.state.errors["SPV_DEPTH"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={6}>
									<Form.Group>
										<Form.Label className="title_label">Valance Weight</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPV_WEIGHT} name="SPV_WEIGHT" placeholder="Valance Weight" />
										{this.state.errors["SPV_WEIGHT"] &&
											<span className='custError'>{this.state.errors["SPV_WEIGHT"]}</span>
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
export default ValanceModal;