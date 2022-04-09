import React, { Component } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

const url = 'admin/portal/ProMotor';

class MotorModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sysid: null,
			errors: {},
			SPM_PR_ITEM_CODE: '',
			SPM_EPB_CODE_GYP: '',
			SPM_MOTOR_TYPE: '',
			SPM_WIRE_LENGTH: '',
			SPM_ACTIVE_YN: '',
			SPM_VALANCE_APP_YN:'',
			SPM_EPB_CODE_ALU: '',
			SPM_WEIGHT: '',
			valanceType: [],

		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		ApiDataService.get(url + '/infoData')
			.then(response => {
				this.setState({
					product_list: response.data.product_list,
					type_of_motor: response.data.type_of_motor,
					motor_code_list : response.data.motor_code_list,
					bracket_concrete: response.data.bracket_concrete,
					bracket_wood: response.data.bracket_wood,
					bracket_gypsum: response.data.bracket_gypsum,
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
		if (name === 'SPM_ACTIVE_YN') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		}else if (name === 'SPM_VALANCE_APP_YN') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		}else if (name === 'SPM_CN_SPECIFIC_YN') {
			let checkBox = e.target.checked;
			values = (checkBox ? 'Y' : 'N');
		}else {
			values = value;
		}
		this.setState({ [name]: values });

		console.log(this.state.valance_scale);
	}
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;

		if (!fields['SPM_PR_ITEM_CODE']) {
			errors["SPM_PR_ITEM_CODE"] = "Product name is required";
			formIsValid = false;
		}
		if (!fields['SPM_EPB_CODE_CON']) {
			errors["SPM_EPB_CODE_CON"] = "Surface material type is required";
			formIsValid = false;
		}
		if (!fields['SPM_MOTOR_TYPE']) {
			errors["SPM_MOTOR_TYPE"] = "Motor type is required";
			formIsValid = false;
		}if (!fields['SPM_MOTOR_CODE']) {
			errors["SPM_MOTOR_CODE"] = "Surface type is required";
			formIsValid = false;
		}if (!fields['SPM_WIRE_LENGTH']) {
			errors["SPM_WIRE_LENGTH"] = "Motor wire length is required";
			formIsValid = false;
		} if (!fields['SPM_WEIGHT']) {
			errors["SPM_WEIGHT"] = "Motor Weight is required";
			formIsValid = false;
		} if (!fields['SPM_EPB_CODE_ALU']) {
			errors["SPM_EPB_CODE_ALU"] = "Wood/Aluminum Bracket is required";
			formIsValid = false;
		}if (!fields['SPM_MIN_WIDTH']) {
			errors["SPM_MIN_WIDTH"] = "Minimum Width is required";
			formIsValid = false;
		}if (!fields['SPM_MAX_HEIGHT']) {
			errors["SPM_MAX_HEIGHT"] = "Maximum Height is required";
			formIsValid = false;
		}if (!fields['SPM_EPB_CODE_GYP']) {
			errors["SPM_EPB_CODE_GYP"] = "Gypsum Bracket is required";
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
		return (
			<div>
				<Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
					<Modal.Header closeButton className="">
						<Modal.Title id="modalTitle">
							Product Motor
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
							<Form.Row>
								<Col xs={7}>
									<Form.Group>
										<Form.Label>Product Name</Form.Label>
										<Form.Control as="select" value={setValue.SPM_PR_ITEM_CODE} name="SPM_PR_ITEM_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Product Name</option>
											{setValue.product_list && setValue.product_list.map((data, i) => (
												<option value={data.SPI_PR_ITEM_CODE} key={i}>{data.SPI_DESC} {data.ITEM_ID}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_PR_ITEM_CODE"] &&
											<span className='custError'>{this.state.errors["SPM_PR_ITEM_CODE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={3}>
									<Form.Group >
										<Form.Label>Motor Type</Form.Label>
										<Form.Control as="select" value={setValue.SPM_MOTOR_TYPE} name="SPM_MOTOR_TYPE" require="true" onChange={this.stateChanges}>
											<option value="">Select Motor Type</option>
											{setValue.type_of_motor && setValue.type_of_motor.map((data, i) => (
												<option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_MOTOR_TYPE"] &&
											<span className='custError'>{this.state.errors["SPM_MOTOR_TYPE"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={2}>
									<Form.Group>
										<Form.Label>Active?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.SPM_ACTIVE_YN === 'Y' ? true : false} type="checkbox" name="SPM_ACTIVE_YN" label="Active" />
									</Form.Group>
								</Col>


								<Col xs={6}>
									<Form.Group >
										<Form.Label>Motor Code</Form.Label>
										<Form.Control as="select" value={setValue.SPM_MOTOR_CODE} name="SPM_MOTOR_CODE" require="true" onChange={this.stateChanges}>
											<option value="">Select Motor Code</option>
											{setValue.motor_code_list && setValue.motor_code_list.map((data, i) => (
												<option value={data.ITEM_CODE} key={i}>{data.ITEM_ID} {data.ITEM_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_MOTOR_CODE"] &&
											<span className='custError'>{this.state.errors["SPM_MOTOR_CODE"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={3}>
									<Form.Group style={{textAlign:'center'}}>
										<Form.Label>Valance Applicable?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.SPM_VALANCE_APP_YN === 'Y' ? true : false} type="checkbox" name="SPM_VALANCE_APP_YN" label="Yes" />
									</Form.Group>
								</Col>
								<Col xs={3}>
									<Form.Group style={{textAlign:'center'}}>
										<Form.Label>Country Specification?</Form.Label>
										<Form.Check onChange={this.stateChanges} checked={setValue.SPM_CN_SPECIFIC_YN === 'Y' ? true : false} type="checkbox" name="SPM_CN_SPECIFIC_YN" label="Yes" />
									</Form.Group>
								</Col>
								

								<Col xs={4}>
									<Form.Group >
										<Form.Label>Concrete Bracket</Form.Label>
										<Form.Control as="select" value={setValue.SPM_EPB_CODE_CON} name="SPM_EPB_CODE_CON" require="true" onChange={this.stateChanges}>
											<option value="">Select Concrete Bracket</option>
											{setValue.bracket_concrete && setValue.bracket_concrete.map((data, i) => (
												<option value={data.SPB_CODE} key={i}>{data.SPB_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_EPB_CODE_CON"] &&
											<span className='custError'>{this.state.errors["SPM_EPB_CODE_CON"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={4}>
									<Form.Group>
										<Form.Label>Gypsum Bracket</Form.Label>
										<Form.Control as="select" value={setValue.SPM_EPB_CODE_GYP} name="SPM_EPB_CODE_GYP" require="true" onChange={this.stateChanges}>
											<option value="">Select Gypsum Bracket</option>
											{setValue.bracket_gypsum && setValue.bracket_gypsum.map((data, i) => (
												<option value={data.SPB_CODE} key={i}>{data.SPB_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_EPB_CODE_GYP"] &&
											<span className='custError'>{this.state.errors["SPM_EPB_CODE_GYP"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={4}>
									<Form.Group>
										<Form.Label className="title_label">Wood/Aluminum Bracket</Form.Label>
										<Form.Control as="select" value={setValue.SPM_EPB_CODE_ALU} name="SPM_EPB_CODE_ALU" require="true" onChange={this.stateChanges}>
											<option value="">Select Wood Bracket</option>
											{setValue.bracket_wood && setValue.bracket_wood.map((data, i) => (
												<option value={data.SPB_CODE} key={i}>{data.SPB_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["SPM_EPB_CODE_ALU"] &&
											<span className='custError'>{this.state.errors["SPM_EPB_CODE_ALU"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={3}>
									<Form.Group>
										<Form.Label>Min. Width </Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPM_MIN_WIDTH} name="SPM_MIN_WIDTH" placeholder="Min Width" />
										{this.state.errors["SPM_MIN_WIDTH"] &&
											<span className='custError'>{this.state.errors["SPM_MIN_WIDTH"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={3}>
									<Form.Group>
										<Form.Label className="title_label">Max Height</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPM_MAX_HEIGHT} name="SPM_MAX_HEIGHT" placeholder="Max Height" />
										{this.state.errors["SPM_MAX_HEIGHT"] &&
											<span className='custError'>{this.state.errors["SPM_MAX_HEIGHT"]}</span>
										}
									</Form.Group>
								</Col>
								<Col xs={3}>
									<Form.Group>
										<Form.Label>Weight</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPM_WEIGHT} name="SPM_WEIGHT" placeholder="Motor Weight" />
										{this.state.errors["SPM_WEIGHT"] &&
											<span className='custError'>{this.state.errors["SPM_WEIGHT"]}</span>
										}
									</Form.Group>
								</Col>

								<Col xs={3}>
									<Form.Group>
										<Form.Label className="title_label">Wire Length</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.SPM_WIRE_LENGTH} name="SPM_WIRE_LENGTH" placeholder="Motor Weight" />
										{this.state.errors["SPM_WIRE_LENGTH"] &&
											<span className='custError'>{this.state.errors["SPM_WIRE_LENGTH"]}</span>
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
export default MotorModal;