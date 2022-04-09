import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Modal, Table, Dropdown, DropdownButton, Row,OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faEdit, faCog, faTrash,faPlus } from '@fortawesome/free-solid-svg-icons';
import ApiDataService from '../../services/ApiDataService';
import { ConfirmationDialog } from "../../ConfirmationDialog";
import Select from 'react-select';

const url = 'admin/portal/ProMotor/build';

class MotorBuildModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            deletedialog: false,
            SPMC_ACTIVE_YN: '',
            product_name: '',
            step_data: null,
            build_data: [],
            country_list: [],
            SPMC_APP_COUNTRIES: '',
            mode: '',

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.multiSelectOption = this.multiSelectOption.bind(this);

    }
    multiSelectOption(value) {
        let valueArray = [];

        for (var i = 0; i < value.length; i++) {
            valueArray.push(value[i].value);
        }
        this.setState({ SPMC_APP_COUNTRIES: valueArray.join(',') });
    }

    buildModalRecord = (data) => {
        console.log(data);
        let id = data.SPM_SYS_ID;
        this.setState({
            product_name: data.PR_ITEM_DESC,
            SPMC_SPM_SYS_ID: data.SPM_SYS_ID,
            SPMC_MOTOR_CODE: data.SPM_MOTOR_CODE,
            step_data: data,
            mode: 'IS'
        });
        ApiDataService.get(`${url}/${id}`).then(response => {
            this.setState({
                build_data: response.data.result,
                motor_code_list: response.data.motor_code_list,
                country_list: response.data.country_list,
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
    }
    getMotorItemList = (code) => {
        ApiDataService.get(`${url}/bracketItemList/${code}`).then(response => {
            this.setState({
                valance_item_list: response.data.result,
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
    }
    editRecord = (id) => {
        this.setState({ sysid: id });
        ApiDataService.get(`${url}/${id}/edit`).then(response => {
            console.log(response.data.result, "eresr");
            let resp = response.data.result;
            Object.entries(resp).forEach(([key, value]) => {
                this.setState({ [key]: value });
                if (key === 'SPBB_CMH_CODE') {
                    this.getMotorItemList(value);
                }
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
        this.setState({ mode: 'UP' });
    }

    deletRecord = (id) => {
        this.setState({ deletedialog: true, SPMC_SYS_ID: id });
    }

    proceedDelete = (params) => {
        let sysid = this.state.SPMC_SYS_ID;
        if (params) {
            ApiDataService.delete(`${url}/`, sysid).then(response => {
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.props.errorMessage(response.data.result, "ERR-OBJ");
                    } else {
                        this.props.errorMessage(response.data.error_message, "ERR");
                    }
                } else {
                    this.props.errorMessage(response.data.error_message, "DONE");
                    this.buildModalRecord(this.state.step_data);
                }
                this.closedialog();
            }).catch((error) => {
                this.props.errorMessage(error.message, "ERR");
                this.closedialog();
            });
        } else {
            console.log('here111...');
        }
    }

    closedialog = () => {
        this.setState({ deletedialog: false });
    }

    stateChanges = (e) => {
        const { name, value } = e.target;
        var values = '';
        if (name === 'SPMC_ACTIVE_YN') {
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

        if (!fields['SPMC_SPM_SYS_ID']) {
            errors["SPMC_SPM_SYS_ID"] = "Motor name is required";
            formIsValid = false;
        } if (!fields['SPMC_MOTOR_CODE']) {
            errors["SPMC_MOTOR_CODE"] = "Motor Code is required";
            formIsValid = false;
        } if (!fields['SPMC_APP_COUNTRIES']) {
            errors["SPMC_APP_COUNTRIES"] = "Country name is required";
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
        if (this.state.mode === 'IS') {
            ApiDataService.post(`${url}`, formData).then(response => {
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.props.errorMessage(response.data.result, "ERR-OBJ");
                    } else {
                        this.props.errorMessage(response.data.error_message, "ERR");
                    }
                } else {
                    this.props.errorMessage(response.data.error_message, "DONE");
                    this.buildModalRecord(this.state.step_data);
                }
            }).catch((error) => {
                console.log(error);
                this.props.errorMessage(error.message, "ERR");
            });
        } else {
            ApiDataService.update(`${url}/update/${this.state.SPMC_SYS_ID}`, formData).then(response => {
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.props.errorMessage(response.data.result, "ERR-OBJ");
                    } else {
                        this.props.errorMessage(response.data.error_message, "ERR");
                    }
                } else {
                    this.props.errorMessage(response.data.error_message, "DONE");
                    this.buildModalRecord(this.state.step_data);
                }
            }).catch((error) => {
                console.log(error);
                this.props.errorMessage(error.message, "ERR");
            });
        }

    }


    render() {
        let setValue = this.state;
        let listTags = this.state.SPMC_APP_COUNTRIES.split(',');
        let selectedTagValue = [];
        for (let i = 0; i < listTags.length; i++) {
            selectedTagValue.push(setValue.country_list.filter((item) => item.value === listTags[i])[0]);
        }
        return (
            <div>
                <ConfirmationDialog
                    dialogopen={this.state.deletedialog}
                    dialogclose={this.closedialog}
                    agreeProcess={this.proceedDelete}
                />
                <Modal animation={false} size="lg" show={this.props.show} onHide={this.props.closeModal} >
                    <Modal.Header closeButton className="">
                        <Modal.Title id="modalTitle">
                            Product Motor Build({setValue.product_name})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                            <Form.Row>

                                <Col xs={7}>
                                    <Form.Group>
                                        <Form.Label>Motor Item Code</Form.Label>
                                        <Form.Control as="select" value={setValue.SPMC_MOTOR_CODE} name="SPMC_MOTOR_CODE" require="true" onChange={this.stateChanges}>
                                            <option value="">Select Motor Code</option>
                                            {setValue.motor_code_list && setValue.motor_code_list.map((data, i) => (
                                                <option value={data.ITEM_CODE} key={i}>{data.ITEM_ID} {data.ITEM_DESC}</option>
                                            ))}
                                        </Form.Control>
                                        {this.state.errors["SPMC_MOTOR_CODE"] &&
                                            <span className='custError'>{this.state.errors["SPMC_MOTOR_CODE"]}</span>
                                        }
                                    </Form.Group>
                                </Col>

                                <Col xs={4}>
                                    <Form.Group>
                                        <Form.Label>Country</Form.Label>


                                        <Select name="SPMC_APP_COUNTRIES"
                                            value={selectedTagValue}
                                            isMulti
                                            options={setValue.country_list}
                                            onChange={this.multiSelectOption}
                                        />

                                        {/* <Form.Control as="select" value={setValue.SPMC_APP_COUNTRIES} name="SPMC_APP_COUNTRIES" require="true" onChange={this.stateChanges}>
                                            <option value="">Select Country</option>
                                            {setValue.country_list && setValue.country_list.map((data, i) => (
                                                <option value={data.SCN_ISO} key={i}>{data.SCN_DESC}</option>
                                            ))}
                                        </Form.Control> */}
                                        {this.state.errors["SPMC_APP_COUNTRIES"] &&
                                            <span className='custError'>{this.state.errors["SPMC_APP_COUNTRIES"]}</span>
                                        }
                                    </Form.Group>
                                </Col>

                                <Col xs={1}>
                                    <Form.Group>
                                        <Form.Label>Active?</Form.Label>
                                        <Form.Check onChange={this.stateChanges} checked={setValue.SPMC_ACTIVE_YN === 'Y' ? true : false} type="checkbox" name="SPMC_ACTIVE_YN" label="Active" />
                                    </Form.Group>
                                </Col>


                                <Row>
                                    <Col xs={12}>
                                        <Form.Control type="hidden" onChange={this.stateChanges} value={setValue.SPMC_SPM_SYS_ID} name="SPMC_SPM_SYS_ID" placeholder="Product Code" require="true" />

                                        {this.state.errors["SPMC_SPM_SYS_ID"] &&
                                            <div className='custError'>{this.state.errors["SPMC_SPM_SYS_ID"]}</div>
                                        }
                                        <button type="submit" className={setValue.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{setValue.mode === 'IS' ? 'Save' : 'Update'}</button>
                                    </Col>
                                </Row>
                            </Form.Row>
                        </Form>
                        <br />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {/* <th>Component</th> */}
                                    <th>Motor Item</th>
                                    <th>UOM</th>
                                    <th>Active</th>
                                    <th style={{'textAlign': 'center'}}>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">Add Motor</Tooltip>}>
                                            <button className="btn btn-primary btn-sm" onClick={()=>this.buildModalRecord(setValue.step_data)} style={{'padding': '5px 15px'}}>{<FontAwesomeIcon icon={faPlus} />}</button>
                                        </OverlayTrigger>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {setValue.build_data.map((data, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            {/* <td>{data.SPMC_SPM_SYS_ID}</td> */}
                                            <td>{data.SPMC_MOTOR_CODE}</td>
                                            <td>{data.SPMC_APP_COUNTRIES}</td>
                                            <td>{data.SPMC_ACTIVE_YN}</td>
                                            <th>
                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                        <Dropdown.Item onClick={() => this.editRecord(data.SPMC_SYS_ID)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.deletRecord(data.SPMC_SYS_ID)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </th>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}
export default MotorBuildModal;