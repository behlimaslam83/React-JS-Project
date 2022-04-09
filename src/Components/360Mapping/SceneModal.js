
import React, { Component } from 'react';
import './360Mapping.scss';
import { Col, Form, Modal } from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import LaddaButton from 'react-ladda';

const url = 'admin/portal/sceneInfo';

class SceneModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sysid: null,
            errors: {},
            scene_desc: '',
            scene_image: '',
            scene_fov: '',
            scene_near: '',
            scene_far: '',
            active_yn: '',
            occ_image_path: '',
            imagePreviewUrl: '',
            loading_btn:false,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
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
		} else {
			values = value;
		}
		this.setState({ [name]: values });

	}
	validation = () => {
		let fields = this.state;
		let errors = {};
		let formIsValid = true;


		if (!fields['scene_desc']) {
			errors["scene_desc"] = "Scene name is required";
			formIsValid = false;
		}
		if (!fields['scene_fov']) {
			errors["scene_fov"] = "FOV is required";
			formIsValid = false;
		}
		if (!fields['scene_near']) {
			errors["scene_near"] = "Near is required";
			formIsValid = false;
		}
		if (!fields['scene_far']) {
			errors["scene_far"] = "Far is required";
			formIsValid = false;
		}if (!fields['scene_longitude']) {
			errors["scene_longitude"] = "Longitude is required";
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
                    this.props.closeModal();
                }
            }).catch((error) => {
                this.state.loading_btn=false;
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
				scene_image: reader.result
			});
		}
		reader.readAsDataURL(file)
	}
    _handleImageChange1(e) {
		e.preventDefault();
		let reader1 = new FileReader();
		let file1 = e.target.files[0];
		reader1.onloadend = () => {
			this.setState({
				avatar1: file1,
				occ_image_path: reader1.result
			});
		}
		reader1.readAsDataURL(file1)
	}

    render() {
        const setValue = this.state;
        
        let $imagePreview = setValue.scene_image?(<img src={setValue.scene_image} style={{ width: '100%' }} alt="Scene Image" />):(<div className="previewText"></div>);
        let $imagePreview1 = setValue.occ_image_path?(<img src={setValue.occ_image_path} style={{ width: '100%' }}  alt="Occ Image" />):(<div className="previewText"></div>);

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
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.scene_desc} name="scene_desc" placeholder="Scene Name" require="true" />
                                        {this.state.errors["scene_desc"] &&
                                            <span className='custError'>{this.state.errors["scene_desc"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>FOV</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.scene_fov} name="scene_fov" placeholder="FOV" require="true" />
                                        {this.state.errors["scene_fov"] &&
                                            <span className='custError'>{this.state.errors["scene_fov"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Near</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.scene_near} name="scene_near" placeholder="Near" require="true" />
                                        {this.state.errors["scene_near"] &&
                                            <span className='custError'>{this.state.errors["scene_near"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Far</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.scene_far} name="scene_far" placeholder="Far" />
                                        {this.state.errors["scene_far"] &&
                                            <span className='custError'>{this.state.errors["scene_far"]}</span>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    <Form.Group>
                                        <Form.Label>Longitude</Form.Label>
                                        <Form.Control type="text" onChange={this.stateChanges} value={setValue.scene_longitude} name="scene_longitude" placeholder="Longitude" />
                                        {this.state.errors["scene_longitude"] &&
                                            <span className='custError'>{this.state.errors["scene_longitude"]}</span>
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
                                    <Form.Row>
                                        <Col xs={12}>
                                            <label>Scene file Upload (<small className="custError">* Image Maximum size 2MB</small>)</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
                                                    <input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange(e)} />
                                                    <label className="custom-file-label">{setValue.avatar ? setValue.avatar.name : ''}</label>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={10}>
                                            <small className="text-danger">
                                                {/* {isError.files.image && isError.message} */}
                                            </small>
                                            <div className="imgPreview">
                                                {$imagePreview}
                                            </div>
                                        </Col>
                                    </Form.Row>
                                </Col>
                                <Col xs={5}>
                                    <Form.Row>
                                        <Col xs={12}>
                                            <label>OCC file Upload (<small className="custError">* Image Maximum size 2MB</small>)</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
                                                    <input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this._handleImageChange1(e)} />
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
export default SceneModal;