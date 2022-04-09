
import React, { Component } from 'react';
import './ProductInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faTrashAlt, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LaddaButton from 'react-ladda';

const api_url = process.env.REACT_APP_SERVER_URL + 'admin/portal/productinfo';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class StepOptionModal extends Component {
    state = {
        value: [],
    };
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            SPS_DESC: '',
            product_step_id: null,
            step_id: localStorage.getItem('STEP_ID'),
            SPS_ORDERING: '',
            active_yn: 'N',
            default_selected: 'N',
            errors: {},
            product_id: '', //localStorage.getItem('PRODUCT_INFO_ID'),
            product_step_info: localStorage.getItem('PRODUCT_STEP_INFO'),
            imagesArray: [],
            mode: '',
            more_text: '',
            info_img_path: [],
            loading_btn: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    setModalShow = () => {
        this.setState({
            filterModalShow: true,
            mode: 'IS',
            step_code: '',
            step_desc: '',
            step_ordering: '',
            image_path: '',
            info_img_path: [],
            avatar: '',
            default_selected: 'N',
            imagesArray: []
        });
    }

    stepsModalRecord = (pro_data) => {

        console.log(pro_data);
        // localStorage.setItem('PRODUCT_INFO_ID', pro_data.product_id);
        localStorage.setItem('PRODUCT_STEP_INFO', pro_data);
        localStorage.setItem('STEP_ID', pro_data.step_id);

        this.setState({
            product_id: pro_data.product_id,
            mode: 'IS',
            product_step_info: pro_data,
            //product_step_id: pro_data.product_step_id,
            step_id: pro_data.step_id,
            parent_step_id: pro_data.product_step_id,
            image_path: '',
            info_img_path: [],
            avatar: '',
            step_desc: '',
            step_ordering: '',
            imagesArray: [],
        });
        this.getStepOption(pro_data.step_id);
    }

    getStepOption = (step_id) => {
        ApiDataService.get(api_url + '/getStepOption/' + step_id)
            .then(response => {
                this.setState({
                    step_option_list: response.data.step_option,
                });
            }).catch(function (error) {
                console.log(error);
            });
    }

    modalClose = () => {
        this.setState({ stepOptionModalShow: false });
        //this.setState({ filterModalShow: false });
    }
    snapclose = () => {
        this.setState({ snapopen: false });
    };
    errorThrough = (error, argu) => {
        console.log(error, "RULING");
        var erroMessage = '';
        if (argu === 'ERR-OBJ') {
            erroMessage = Object.keys(error).map(function (key) {
                return <ul key={key} className="mrgnone list-unstyled"><li>{error[key]}</li></ul>;
            });
        } else {
            erroMessage = <ul className="mrgnone list-unstyled"><li>{error}</li></ul>;
        }
        var backColor = ((argu === 'ERR' || argu === 'ERR-OBJ') ? '#ff4c4ceb' : '#20bb20eb');
        this.setState({ snapopen: true, snapcolor: backColor });
        this.setState({ error: erroMessage });
    }

    optionListRenderTable = () => {
        this.setState({
            optionListRenderTable: true
        }, () => {
            this.setState({ optionListRenderTable: false });
            /*  this.setState({
                  step_desc: '',
                  step_ordering: '',
                  image_path: '',
                  info_img_path: [],
                  avatar: '',
                  default_selected: 'N'
              });*/
        });
    }
    stateChanges = (e) => {
        const { name, value } = e.target;
        var values = '';
        if (name === 'active_yn' || name === 'default_selected') {
            let checkBox = e.target.checked;
            values = (checkBox ? 'Y' : 'N');
        } else {
            values = value;
        }
        this.setState({ [name]: values });
    }
    validation = () => {
        let fields = this.state;
        //  let errors = {};
        let formIsValid = true;

        let errors = this.state.errors;

        if (!fields['product_id']) {
            errors["product_id"] = "Product ID is required";
            formIsValid = false;
        }
        /*  if (!fields['product_step_id']) {
              errors["product_step_id"] = "Product step id is required";
              formIsValid = false;
          }*/
        if (!fields['step_id']) {
            errors["step_id"] = "Step ID is required";
            formIsValid = false;
        }
        if (!fields['step_code']) {
            errors["step_code"] = "Step Code is required";
            formIsValid = false;
        }
        if (!fields['step_desc']) {
            errors["step_desc"] = "Step name is required";
            formIsValid = false;
        }
        if (!fields['step_ordering']) {
            errors["step_ordering"] = "Step ordering is required";
            formIsValid = false;
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    deletRecord = (id) => {
        this.setState({ deletedialog: true, product_step_id: id });
    }
    proceedDelete = (params) => {
        if (params) {
            this.deleteModalRecord(this.state.product_step_id);
        }
    }
    closedialog = () => {
        this.setState({ deletedialog: false });
    }
    editStepModalRecord = (id, lang = 'en') => {
        this.setState({ info_img_path: [], imagesArray: [] });
        this.setState({ product_step_id: id, mode: 'UP' });
        ApiDataService.get(`${api_url}/productStep/${id}/edit`, lang).then(response => {
            let resp = response.data.result;
            Object.entries(resp).forEach(([key, value]) => {
                this.setState({ [key]: value });
            });
        }).catch((error) => {
            console.log(error);
        });

    }

    deleteModalRecord = (id) => {
        ApiDataService.delete(`${api_url}/productStep/`, id).then(response => {
            if (response.data.return_status !== "0") {
                if (response.data.error_message === 'Error') {
                    this.errorThrough(response.data.result, "ERR-OBJ");
                } else {
                    this.errorThrough(response.data.error_message, "ERR");
                }
            } else {
                this.errorThrough(response.data.error_message, "DONE");
                this.optionListRenderTable();
            }
            this.closedialog();
        }).catch((error) => {
            this.errorThrough(error.message, "ERR");
            this.closedialog();
        });
    }
    deleteInfoImg = (str, img_array) => {
        var newArray = this.state.info_img_path.filter(e => e !== str);
        this.setState({ info_img_path: newArray });
        if (img_array) {
            var new_img_array = this.state.imagesArray.filter(e => e.name !== img_array.name);
            this.setState({ imagesArray: new_img_array });
            console.log(new_img_array, this.state.imagesArray);
        }

    }
    _handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                avatar: file,
                image_path: reader.result
            });
        }
        reader.readAsDataURL(file)
    }
    fileSelectedHandler = (e) => {
        e.preventDefault();
        //  this.setState({ info_img_path: [], imagesArray: [] });


        if (e.target.files) {
            //  this.setState({ imagesArray: [this.state.imagesArray, ...e.target.files] });
            this.setState({ imagesArray: [...e.target.files, ...this.state.imagesArray] });
            /* Get files in array form */
            const files = Array.from(e.target.files);

            /* Map each file to a promise that resolves to an array of image URI's */
            Promise.all(files.map(file => {
                return (new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }));
            }))
                .then(images => {
                    /* Once all promises are resolved, update state with image URI array */
                    //this.setState({ info_img_path: images });
                    this.setState({ info_img_path: this.state.info_img_path.concat(images) });

                    console.log(this.state.imagesArray);
                    console.log(e.target.files);
                }, error => {
                    console.error(error);
                });
        }

    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.validation()) {
            return false;
        }


        var formData = new FormData();

        let Properties = this.state;
        // let self = this;
        for (var key in Properties) {
            formData.append(key, Properties[key]);
        }
        this.state.loading_btn = true;
        for (const key of Object.keys(this.state.imagesArray)) {
            formData.append('imagesArray[]', this.state.imagesArray[key]);
        }

        if (this.state.mode === 'IS') {
            ApiDataService.post(api_url + '/productStep', formData).then(response => {
                this.state.loading_btn = false;
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.errorThrough(response.data.result, "ERR-OBJ");
                    } else {
                        this.errorThrough(response.data.error_message, "ERR");
                    }
                } else {
                    this.errorThrough(response.data.error_message, "DONE");
                    this.optionListRenderTable();
                    //this.props.closeModal();
                }
            }).catch((error) => {
                this.state.loading_btn = false;
                console.log(error);
                this.errorThrough(error.message, "ERR");
            });
        } else {
            ApiDataService.update(`${api_url}/productStep/update/${this.state.product_step_id}`, formData).then(response => {
                this.state.loading_btn = false;
                if (response.data.return_status !== "0") {
                    if (response.data.error_message === 'Error') {
                        this.errorThrough(response.data.result, "ERR-OBJ");
                    } else {
                        this.errorThrough(response.data.error_message, "ERR");
                    }
                } else {
                    this.errorThrough(response.data.error_message, "DONE");
                    this.optionListRenderTable();
                    //this.props.closeModal();
                }
            }).catch((error) => {
                this.state.loading_btn = false;
                console.log(error);
                this.errorThrough(error.message, "ERR");
            });
        }

    }



    render() {

        let setValue = this.state;
        let { step_option_list, product_id, product_step_info, info_img_path, lang_code, parent_step_id } = this.state;
        let $imagePreview = setValue.image_path ? (<img src={setValue.image_path} style={{ width: '100%' }} alt="Image" />) : (<div className="previewText"></div>);

        let step_id = localStorage.getItem('STEP_ID');
        let self = this;

        // const url = `admin/portal/productinfo/getProStepList/${product_id}/${step_id}`;

        const url = `admin/portal/productinfo/getProStepList/${product_id}/${parent_step_id}`;
        let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product Step</Tooltip>}>
            <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
        const columns = [
            'sr_no',
            'SPS_DESC',
            'step_code',
            'image_path',
            'SPS_ORDERING',
            'default_selected',
            'active_yn',
            'actions'
        ];

        const options = {
            perPage: PER_PAGE,
            headings: {
                sr_no: '#',
                SPS_DESC: 'Name',
                step_code: 'Code',
                image_path: 'Image',
                SPS_ORDERING: 'Ordering',
                active_yn: 'Active ?',
                default_selected: 'Selected ?',

            },
            search_key: {
                SPS_DESC: 'Name',
                //  SPS_SS_CODE: 'Step ID',
                //  SPS_SPS_SYS_ID:'Parent Step',
                SPS_ACTIVE_YN: 'Active ?'
            },
            sortable: ['SPS_DESC', 'step_id', 'SPS_ORDERING', 'active_yn', 'default_selected'],
            requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order' },
            columnsAlign: { actions: 'center' },
            responseAdapter: function (resp_data) {
                self.setState({ page: resp_data.page });
                return { data: resp_data.result, total: resp_data.row_count }
            },
            texts: {
                show: ''
            },
            search_lov: {
                pages: []
            }
        };

        var img_count = -1;
        return (
            <div>
                <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
                    <Modal.Header closeButton className="">
                        <Modal.Title id="modalTitle">
                            Steps option ({product_step_info ? product_step_info.step_name : ''})
                            <span style={{ position: 'absolute', right: '35px' }}> Language=>{lang_code ? lang_code : 'en'}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                            <Row>
                                <Col sm={8}>
                                    {this.state.errors["product_id"] &&
                                        <span className='custError'>{this.state.errors["product_id"]}</span>
                                    }
                                    {this.state.errors["step_id"] &&
                                        <span className='custError'>{this.state.errors["step_id"]}</span>
                                    }
                                    {this.state.errors["product_step_id"] &&
                                        <span className='custError'>{this.state.errors["product_step_id"]}</span>
                                    }

                                    <Form.Row className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label>Step Option</Form.Label>
                                                <Form.Control as="select" value={setValue.step_code} name="step_code" onChange={this.stateChanges}>
                                                    <option value="">Select step option</option>
                                                    {step_option_list ? step_option_list.map((data, i) => (
                                                        <option value={data.SSO_CODE} key={i}>{data.SSO_DESC}</option>
                                                    )) : ''}
                                                </Form.Control>
                                                {this.state.errors["step_code"] &&
                                                    <span className='custError'>{this.state.errors["step_code"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Form.Group>
                                                <Form.Label>Ordering</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.step_ordering} type="text" name="step_ordering" placeholder="Ordering" />
                                                {this.state.errors["step_ordering"] &&
                                                    <span className='custError'>{this.state.errors["step_ordering"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2}>
                                            <Form.Group>
                                                <Form.Label>UOM</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.step_uom} type="text" name="step_uom" placeholder="UOM" />
                                                {this.state.errors["step_uom"] &&
                                                    <span className='custError'>{this.state.errors["step_uom"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>

                                        <Col xs={2} >
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Label>Active ?</Form.Label>
                                                <Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" style={{ 'margin': '0px' }} />
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label>Step Name</Form.Label>
                                                <Form.Control type="text" onChange={this.stateChanges} value={setValue.step_desc} name="step_desc" placeholder="Step Name" require="true" />
                                                {this.state.errors["step_desc"] &&
                                                    <span className='custError'>{this.state.errors["step_desc"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2} className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                            <Form.Group>
                                                <Form.Label>Min. Width/Depth</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.min_width} type="text" name="min_width" placeholder="Min. Width" />
                                                {this.state.errors["min_width"] &&
                                                    <span className='custError'>{this.state.errors["min_width"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={2} className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                            <Form.Group>
                                                <Form.Label>Max. Height</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.max_height} type="text" name="max_height" placeholder="Max. Height" />
                                                {this.state.errors["max_height"] &&
                                                    <span className='custError'>{this.state.errors["max_height"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>

                                        <Col xs={2} className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Label>Selected ?</Form.Label>
                                                <Form.Check onChange={this.stateChanges} checked={setValue.default_selected === 'Y' ? true : false} type="checkbox" name="default_selected" style={{ 'margin': '0px' }} />
                                            </Form.Group>
                                        </Col>

                                    </Form.Row>

                                    <Form.Row>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label>Tooltip</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.tooltip} type="text" name="tooltip" placeholder="Tooltip" />
                                                {this.state.errors["tooltip"] &&
                                                    <span className='custError'>{this.state.errors["tooltip"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Group>
                                                <Form.Label>Text</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.text} type="text" name="text" placeholder="Text" />
                                                {this.state.errors["text"] &&
                                                    <span className='custError'>{this.state.errors["text"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                </Col>
                                <Col xs={4}>
                                    <Form.Row>
                                        <Col xs={12}>
                                            <label>Image Upload/PDF/Video (<small className="custError">* Image Maximum size 2MB</small>)</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
                                                    <input className="custom-file-input form-control-sm p-0" type="file" onChange={(e) => this._handleImageChange(e)} />
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
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <CKEditor
                                        className="ck_textarea"
                                        editor={ClassicEditor}
                                        height="300px"
                                        name="more_text"
                                        data={setValue.more_text}
                                        onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            // console.log({ event, editor, data });
                                            this.setState({ more_text: data });
                                        }}

                                    />
                                </Col>

                                <Col xs={12}>
                                    <Form.Row>
                                        <Col xs={4}>
                                            <label>Info Image Upload/Video (<small className="custError">* Image Maximum size 2MB</small>)</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
                                                    <input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this.fileSelectedHandler(e)} multiple />
                                                    <label className="custom-file-label">{setValue.avatar1 ? setValue.avatar1.name : ''}</label>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <small className="text-danger">
                                                {/* {isError.files.image && isError.message} */}
                                            </small>
                                            <Row style={{ padding: '15px' }}>
                                                {

                                                    info_img_path && info_img_path.map((data, i) => {

                                                        if (data.length > 150) {
                                                            img_count++;
                                                            return (
                                                                <Col xs={3} key={i}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} className="info_del_icon" id={img_count} onClick={() => this.deleteInfoImg(data, this.state.imagesArray[img_count])} />
                                                                    <img src={data} style={{ width: '100%' }} alt="image" />
                                                                </Col>
                                                            )

                                                        } else {
                                                            return (
                                                                <Col xs={3} key={i}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} className="info_del_icon" onClick={() => this.deleteInfoImg(data, -1)} />
                                                                    <img src={data} style={{ width: '100%' }} alt="image" />
                                                                </Col>
                                                            )
                                                        }

                                                    })}
                                            </Row>
                                        </Col>
                                    </Form.Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Form.Control value={product_id} type="hidden" name="product_id" />
                                    <Form.Control value={step_id} type="hidden" name="step_id" />
                                    {/* <Form.Control value={product_step_id} type="hidden" name="parent_step_id" /> */}
                                    <Form.Control value={this.state.parent_step_id} type="hidden" name="parent_step_id" />

                                    {/* <button type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.state.mode === 'IS' ? 'Save' : 'Update'}</button> */}
                                    <LaddaButton loading={this.state.loading_btn} type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"} >{this.state.mode === 'IS' ? 'Save' : 'Update'}</LaddaButton>
                                </Col>
                            </Row>
                        </Form>

                        <Row>
                            <Col xs={12}>
                                <SnapBarError
                                    message={this.state.error}
                                    snapopen={this.state.snapopen}
                                    snapcolor={this.state.snapcolor}
                                    snapclose={this.snapclose}
                                />
                                <ConfirmationDialog
                                    dialogopen={this.state.deletedialog}
                                    dialogclose={this.closedialog}
                                    agreeProcess={this.proceedDelete}
                                />
                                <WindowPanel rawHtml={
                                    <div className="windowContent">
                                        <ServerTable renderView={this.state.optionListRenderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
                                            {
                                                function (row, column, index) {
                                                    switch (column) {
                                                        case 'sr_no':
                                                            return (
                                                                (index + 1) + (PER_PAGE * ((self.state.page) - 1))
                                                            );
                                                        case 'image_path':
                                                            if (row.step_code == 'PDF') {
                                                                return (
                                                                    <a href={row.image_path} target="_blank">
                                                                        <b>Pdf File</b>
                                                                    </a>);
                                                            } else if (row.step_code == 'VIDEO') {
                                                                return (
                                                                    <a href={row.image_path} target="_blank">
                                                                        <b>Video File</b>
                                                                    </a>);
                                                            } else {
                                                                return (
                                                                    row.image_path ? <img src={row.image_path} width="80px" className="table-image" alt="" /> : 'No Image'
                                                                );
                                                            }
                                                        case 'actions':
                                                            return (
                                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                                        <Dropdown.Item onClick={() => self.editStepModalRecord(row.product_step_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => self.deletRecord(row.product_step_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => self.editStepModalRecord(row.product_step_id, 'ar')}><FontAwesomeIcon icon={faLanguage} /> Edit Language</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </div>
                                                            );
                                                        default:
                                                            return (row[column]);
                                                    }
                                                }
                                            }
                                        </ServerTable>

                                    </div>
                                } />
                            </Col>
                        </Row>


                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default StepOptionModal;