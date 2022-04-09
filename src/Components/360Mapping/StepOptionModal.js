import React, { Component } from 'react';
import './360Mapping.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Modal, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { faEdit, faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import ApiDataService from '../../services/ApiDataService';
import { ConfirmationDialog } from "../../ConfirmationDialog";

const url = 'admin/portal/stepsInfo';

class StepOptionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            deletedialog: false,
            option_id: null,
            step_code: 0,
            option_name: '',
            option_code: '',
            active_yn: '',
            option_image_path: '',
            imagePreviewUrl: '',
            step_name: '',
            step_data: null,
            option_data: [],
            mode: ''

        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    stepOptionModalRecord = (data) => {
        let id = data.step_info_id;
        this.setState({ step_code: id, step_name: data.step_desc, step_data: data, mode: 'IS' });
        ApiDataService.get(`${url}/getOptionList/${id}`).then(response => {
            this.setState({ option_data: response.data.result });
            this.setState({ option_name: '', option_code: '', option_image_path: '' });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
    }
    editRecord = (id) => {
        // this.modalRef.current.editModalRecord(id);
        this.setState({ sysid: id });
        ApiDataService.get(`${url}/editOption/${id}`).then(response => {
            console.log(response.data.result, "eresr");
            let resp = response.data.result;
            Object.entries(resp).forEach(([key, value]) => {
                this.setState({ [key]: value });
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
        this.setState({ mode: 'UP' });
    }

    deletRecord = (id) => {
        this.setState({ deletedialog: true, option_code: id });
    }

    proceedDelete = (params) => {
        let sysid = this.state.option_code;
        if (params) {
            ApiDataService.delete(`${url}/deleteOption/`,sysid).then(response => {
                if (response.data.return_status !== "0") {
                  if (response.data.error_message === 'Error') {
                    this.props.errorMessage(response.data.result, "ERR-OBJ");
                  } else {
                    this.props.errorMessage(response.data.error_message, "ERR");
                  }
                } else {
                  this.props.errorMessage(response.data.error_message, "DONE");
                  this.stepOptionModalRecord(this.state.step_data);
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
        if (name === 'active_yn') {
            let checkBox = e.target.checked;
            values = (checkBox ? 'Y' : 'N');
        } else {
            values = value;
        }
        this.setState({ [name]: values });

    }

    _handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                avatar: file,
                option_image_path: reader.result
            });
        }
        reader.readAsDataURL(file)
    }
    validation = () => {
        let fields = this.state;
        let errors = {};
        let formIsValid = true;

        if (!fields['option_name']) {
            errors["option_name"] = "Option name is required";
            formIsValid = false;
        }
        if (!fields['option_code']) {
            errors["option_code"] = "Option code is required";
            formIsValid = false;
        }
        if (!fields['step_code']) {
            errors["step_code"] = "Step code is required";
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
            ApiDataService.post(`${url}/addOption`, formData).then(response => {
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.props.errorMessage(response.data.result, "ERR-OBJ");
                    } else {
                        this.props.errorMessage(response.data.error_message, "ERR");
                    }
                } else {
                    this.props.errorMessage(response.data.error_message, "DONE");
                    this.stepOptionModalRecord(this.state.step_data);
                }
            }).catch((error) => {
                console.log(error);
                this.props.errorMessage(error.message, "ERR");
            });
        } else {
            ApiDataService.update(`${url}/updateOption/${this.state.option_code}`, formData).then(response => {
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.props.errorMessage(response.data.result, "ERR-OBJ");
                    } else {
                        this.props.errorMessage(response.data.error_message, "ERR");
                    }
                } else {
                    this.props.errorMessage(response.data.error_message, "DONE");
                    this.stepOptionModalRecord(this.state.step_data);
                }
            }).catch((error) => {
                console.log(error);
                this.props.errorMessage(error.message, "ERR");
            });
        }
        
    }


    render() {
        let setValue = this.state;
        let imagePreviewUrl = this.state.option_image_path;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{ width: '100%' }} alt="Preview" />);
        } else {
            $imagePreview = (<div className="previewText"></div>);
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
                            Step Option Info({setValue.step_name})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                            <Form.Row>
                                <Col xs={5}>
                                    <Form.Group>
                                        <Form.Label>Option Name</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.option_name} name="option_name" placeholder="Step Name" require="true" />
                                        {this.state.errors["option_name"] &&
                                            <span className='custError'>{this.state.errors["option_name"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={5}>
                                    <Form.Group>
                                        <Form.Label>Step Code</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.option_code} name="option_code" placeholder="Step Code" require="true" />
                                        {this.state.errors["option_code"] &&
                                            <span className='custError'>{this.state.errors["option_code"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Active?</Form.Label>
                                        <Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" label="Active" />
                                    </Form.Group>

                                    <Form.Control type="hidden" value={setValue.step_code} name="step_code" require="true" />
                                    {this.state.errors["step_code"] &&
                                        <span className='custError'>{this.state.errors["step_code"]}</span>
                                    }
                                </Col>


                                <Col xs={9}>
                                    <Form.Row>
                                        <Col xs={6} style={{ paddingRight: '0px' }}>
                                            <label>Thumbnail Image</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
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
                                            <div className="imgPreview">
                                                {$imagePreview}
                                            </div>
                                        </Col>
                                    </Form.Row>
                                </Col>

                                <Col xs={3}>
                                    <button type="submit" className={setValue.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"} style={{ float: 'right', margin: '75px 0px 10px 0px' }}>{setValue.mode === 'IS' ? 'Save' : 'Update'}</button>
                                </Col>

                            </Form.Row>
                        </Form>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Step Code</th>
                                    <th>Option Name</th>
                                    <th>Active</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {setValue.option_data.map((data, i) => {
                                    let img = data.option_image ? <img src={data.option_image} style={{ width: '120px' }} /> : 'No Image';
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{data.option_code}</td>
                                            <td>{data.option_name}</td>
                                            <td>{data.active_yn}</td>
                                            <th>{img}</th>
                                            <th>
                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                        <Dropdown.Item onClick={() => this.editRecord(data.option_code)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.deletRecord(data.option_code)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
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
export default StepOptionModal;