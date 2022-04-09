
import React, { Component } from 'react';
import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';

const url = 'admin/portal/lightInfo';

class SceneModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sysid: null,
            errors: {},
            light_desc: '',
            light_color: '',
            light_type: '',
            light_value: '',
            active_yn: '',
			// light_scale:[],
			// light_position:[],
			lightType:[],

        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

	componentWillMount() {
		ApiDataService.get(url + '/getLightType')
			.then(response => {
				this.setState({
					lightType: response.data.results
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
	
	deleteModalRecord=(id)=>{
		ApiDataService.delete(`${url}/`,id).then(response => {
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
		}else {
			values = value;
		}
		this.setState({ [name]: values });

		console.log( this.state.light_scale);
	}
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;

		if (!fields['light_desc']) {
			errors["light_desc"] = "Light name is required";
			formIsValid = false;
		}
		if (!fields['light_color']) {
			errors["light_color"] = "Light color is required";
			formIsValid = false;
		}
		if (!fields['light_type']) {
			errors["light_type"] = "Light type is required";
			formIsValid = false;
		}
		if (!fields['light_value']) {
			errors["light_value"] = "Light value is required";
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
			ApiDataService.update( `${url}/update/${this.state.sysid}`, formData).then(response => {
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
        console.log(setValue);
        return (
            <div>
                <Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
                    <Modal.Header closeButton className="">
                        <Modal.Title id="modalTitle">
                            Scene Info
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">

                            <Form.Row>
                                <Col xs={4}>
                                    <Form.Group>
                                        <Form.Label>Light Name</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.light_desc} name="light_desc" placeholder="Light Name" require="true" />
                                        {this.state.errors["light_desc"] &&
                                            <span className='custError'>{this.state.errors["light_desc"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
								<Col xs={3}>
									<Form.Group >
										<Form.Label>Light Type</Form.Label>
										<Form.Control as="select" value={setValue.light_type} name="light_type" require="true" onChange={this.stateChanges}>
											<option value="">Select</option>
											{setValue.lightType.map((data, i) => (
												<option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
											))}
										</Form.Control>
										{this.state.errors["light_type"] &&
											<span className='custError'>{this.state.errors["light_type"]}</span>
										}
									</Form.Group>
								</Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Light Color</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.light_color} name="light_color" placeholder="Light Color" require="true" />
                                        {this.state.errors["light_color"] &&
                                            <span className='custError'>{this.state.errors["light_color"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                            
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Light Value</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.light_value} name="light_value" placeholder="Light Value" />
                                        {this.state.errors["light_value"] &&
                                            <span className='custError'>{this.state.errors["light_value"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
								<Col xs={1}>
                                    <Form.Group>
                                        <Form.Label>Active?</Form.Label>
                                        <Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" label="Active" />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Row className="xyz">
									<Form.Label className="title_label">Light Scale</Form.Label>
										<Col xs={3}>
										<Form.Label>X</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.light_scale_X} name="light_scale_X" placeholder="X" />
										</Col>
										<Col xs={3}>
										<Form.Label>Y</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.light_scale_Y} name="light_scale_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
										<Form.Label>Z</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.light_scale_Z} name="light_scale_Z" placeholder="Z" />
										</Col>
                                    </Form.Row>
                                </Col>

								<Col xs={6}>
                                    <Form.Row className="xyz">
									<Form.Label className="title_label">Light Position </Form.Label>
										<Col xs={3}>
										<Form.Label>X</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.light_position_X} name="light_position_X" placeholder="X" />
										</Col>
										<Col xs={3}>
										<Form.Label>Y</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.light_position_Y} name="light_position_Y" placeholder="Y" />
										</Col>
										<Col xs={3}>
										<Form.Label>Z</Form.Label>
										<Form.Control type="text" onChange={this.stateChanges} value={setValue.light_position_Z} name="light_position_Z" placeholder="Z" />
										</Col>
                                    </Form.Row>
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
export default SceneModal;