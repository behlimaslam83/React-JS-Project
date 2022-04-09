import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Modal, Table, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { faEdit, faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import ApiDataService from '../../services/ApiDataService';
import { ConfirmationDialog } from "../../ConfirmationDialog";

const url = 'admin/portal/ProValance/build';

class ValanceBuildModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            deletedialog: false,
            option_id: null,
            SPVB_CMH_CODE: '',
            SPVB_SYS_ID: '',
            SPVB_ITEM_CODE: '',
            SPVB_ACTIVE_YN: '',
            product_name: '',
            step_data: null,
            build_data: [],
            mode: '',
            calc_type: {}

        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    buildModalRecord = (data) => {
        console.log(data);
        let id = data.SPV_SYS_ID;
        this.setState({
            product_name: data.PR_ITEM_DESC,
            SPVB_EPV_SYS_ID: data.SPV_SYS_ID,
            SPVB_PR_ITEM_CODE: data.SPV_PR_ITEM_CODE,
            step_data: data,
            mode: 'IS'
        });
        ApiDataService.get(`${url}/${id}`).then(response => {
            this.setState({
                build_data: response.data.result,
                component: response.data.component,
                UOM_List: response.data.UOM_List,
                calc_type: response.data.calc_type,
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
    }
    getValanceItemList = (code) => {
        ApiDataService.get(`${url}/valanceItemList/${code}`).then(response => {
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
                if (key === 'SPVB_CMH_CODE') {
                    this.getValanceItemList(value);
                }
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
        this.setState({ mode: 'UP' });
    }

    deletRecord = (id) => {
        this.setState({ deletedialog: true, SPVB_SYS_ID: id });
    }

    proceedDelete = (params) => {
        let sysid = this.state.SPVB_SYS_ID;
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
        if (name === 'SPVB_ACTIVE_YN') {
            let checkBox = e.target.checked;
            values = (checkBox ? 'Y' : 'N');
        } else if (name === 'SPVB_CMH_CODE') {
            this.getValanceItemList(value);
            values = value;
        } else {
            values = value;
        }
        this.setState({ [name]: values });

    }

    validation = () => {
        let fields = this.state;
        let errors = {};
        let formIsValid = true;

        if (!fields['SPVB_PR_ITEM_CODE']) {
            errors["SPVB_PR_ITEM_CODE"] = "Product Code is required";
            formIsValid = false;
        } if (!fields['SPVB_EPV_SYS_ID']) {
            errors["SPVB_EPV_SYS_ID"] = "Valance Code is required";
            formIsValid = false;
        } if (!fields['SPVB_CMH_CODE']) {
            errors["SPVB_CMH_CODE"] = "Component name is required";
            formIsValid = false;
        }
        if (!fields['SPVB_ITEM_CODE']) {
            errors["SPVB_ITEM_CODE"] = "Valance Item is required";
            formIsValid = false;
        }
        if (!fields['SPVB_UOM_CODE']) {
            errors["SPVB_UOM_CODE"] = "UOM code is required";
            formIsValid = false;
        } if (!fields['SPVB_QTY']) {
            errors["SPVB_QTY"] = "QTY is required";
            formIsValid = false;
        } if (!fields['SPVB_WEIGHT']) {
            errors["SPVB_WEIGHT"] = "Weight is required";
            formIsValid = false;
        } if (!fields['SPVB_FORMULA']) {
            errors["SPVB_FORMULA"] = "Formula is required";
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
            ApiDataService.update(`${url}/update/${this.state.SPVB_SYS_ID}`, formData).then(response => {
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
        let calc_type_list = Object.keys(this.state.calc_type);

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
                            Product Valance Build({setValue.product_name})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                            <Form.Row>
                                <Col xs={4}>
                                    <Form.Group>
                                        <Form.Label>Component</Form.Label>
                                        <Form.Control as="select" value={setValue.SPVB_CMH_CODE} name="SPVB_CMH_CODE" require="true" onChange={this.stateChanges}>
                                            <option value="">Select Component</option>
                                            {setValue.component && setValue.component.map((data, i) => (
                                                <option value={data.CMH_CODE} key={i}>{data.CMH_DESC}</option>
                                            ))}
                                        </Form.Control>
                                        {this.state.errors["SPVB_CMH_CODE"] &&
                                            <span className='custError'>{this.state.errors["SPVB_CMH_CODE"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label>Valance Item</Form.Label>
                                        <Form.Control as="select" value={setValue.SPVB_ITEM_CODE} name="SPVB_ITEM_CODE" require="true" onChange={this.stateChanges}>
                                            <option value="">Select Valance Item</option>
                                            {setValue.valance_item_list && setValue.valance_item_list.map((data, i) => (
                                                <option value={data.ITEM_CODE} key={i}>{data.ITEM_DESC}</option>
                                            ))}
                                        </Form.Control>
                                        {this.state.errors["SPVB_ITEM_CODE"] &&
                                            <span className='custError'>{this.state.errors["SPVB_ITEM_CODE"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Active?</Form.Label>
                                        <Form.Check onChange={this.stateChanges} checked={setValue.SPVB_ACTIVE_YN === 'Y' ? true : false} type="checkbox" name="SPVB_ACTIVE_YN" label="Active" />
                                    </Form.Group>
                                </Col>
                                <Col xs={3}>
                                    <Form.Group>
                                        <Form.Label>UOM</Form.Label>
                                        <Form.Control as="select" value={setValue.SPVB_UOM_CODE} name="SPVB_UOM_CODE" require="true" onChange={this.stateChanges}>
                                            <option value="">Select UOM</option>
                                            {setValue.UOM_List && setValue.UOM_List.map((data, i) => (
                                                <option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
                                            ))}
                                        </Form.Control>
                                        {this.state.errors["SPVB_UOM_CODE"] &&
                                            <span className='custError'>{this.state.errors["SPVB_UOM_CODE"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Qty</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.SPVB_QTY} name="SPVB_QTY" placeholder="QTY" require="true" />
                                        {this.state.errors["SPVB_QTY"] &&
                                            <span className='custError'>{this.state.errors["SPVB_QTY"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={3}>
                                    <Form.Group>
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.SPVB_WEIGHT} name="SPVB_WEIGHT" placeholder="Weight" require="true" />
                                        {this.state.errors["SPVB_WEIGHT"] &&
                                            <span className='custError'>{this.state.errors["SPVB_WEIGHT"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={4}>
                                    <Form.Group>
                                        <Form.Label className="title_label">Calc Type {setValue.mode}</Form.Label>
                                        <Form.Control as="select" value={setValue.SPVB_FORMULA} name="SPVB_FORMULA" require="true" onChange={this.stateChanges}>
                                            <option value="">Select Calc Type</option>
                                            {calc_type_list && calc_type_list.map((data, i) => (
                                                <option value={data} key={i}>{setValue.calc_type[data]}</option>
                                            ))}
                                        </Form.Control>
                                        {this.state.errors["SPVB_FORMULA"] &&
                                            <span className='custError'>{this.state.errors["SPVB_FORMULA"]}</span>
                                        }
                                    </Form.Group>
                                </Col>

                                <Row>
                                    <Col xs={12}>
                                        <Form.Control type="hidden" onChange={this.stateChanges} value={setValue.SPVB_PR_ITEM_CODE} name="SPVB_PR_ITEM_CODE" placeholder="Product Code" require="true" />
                                        <Form.Control type="hidden" onChange={this.stateChanges} value={setValue.SPVB_EPV_SYS_ID} name="SPVB_EPV_SYS_ID" placeholder="valance Code" require="true" />


                                        {this.state.errors["SPVB_PR_ITEM_CODE"] &&
                                            <div className='custError'>{this.state.errors["SPVB_PR_ITEM_CODE"]}</div>
                                        }
                                        {this.state.errors["SPVB_EPV_SYS_ID"] &&
                                            <div className='custError'>{this.state.errors["SPVB_EPV_SYS_ID"]}</div>
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
                                    <th>Component</th>
                                    <th>Valance Item</th>
                                    <th>UOM</th>
                                    <th>Qty</th>
                                    <th>Weight</th>
                                    <th>Formula</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {setValue.build_data.map((data, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{data.CMH_DESC}</td>
                                            <td>{data.ITEM_DESC}</td>
                                            <td>{data.SPVB_UOM_CODE}</td>
                                            <td>{data.SPVB_QTY}</td>
                                            <td>{data.SPVB_WEIGHT}</td>
                                            <td>{data.SPVB_FORMULA}</td>
                                            <td>{data.SPVB_ACTIVE_YN}</td>
                                            <th>
                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                        <Dropdown.Item onClick={() => this.editRecord(data.SPVB_SYS_ID)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.deletRecord(data.SPVB_SYS_ID)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
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
export default ValanceBuildModal;