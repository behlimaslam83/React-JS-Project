import React, { Component } from 'react';
import './ProductInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faStepForward, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import StepOptionModal from "../ProductInfo/StepOptionModal";
import Select from 'react-select'
import zIndex from '@material-ui/core/styles/zIndex';
import LaddaButton from 'react-ladda';

const api_url = process.env.REACT_APP_SERVER_URL + 'admin/portal/productinfo';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class StepsModal extends Component {
    state = {
        value: [],
    };
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            SPS_DESC: '',
            product_step_id: null,
            step_id: '',
            SPS_ORDERING: '',
            active_yn: 'N',
            step_code: 'STEP',
            SPS_QUICK_BUY_YN: 'N',
            errors: {},
            product_id: '', //localStorage.getItem('PRODUCT_INFO_ID'),
            product_name: localStorage.getItem('PRODUCT_NAME'),
            step_list: [],
            uom_list: [],
            parent_step_list: [],
            modalShow: false,
            loading_btn: false,
            mode: '',
            dataview: [],
            totaldata: null,
            snapopen: false,
            snapcolor: null,
            error: null,
            deletedialog: false,
            proceed: false,
            filterRenderTable: false,
            stepOptionModalShow: false,
            page: 1,
            step_input_type_list: [],
            text: '',
            SPS_INPUT_TYPE: 0,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.stepOptionModalRef = React.createRef();
        this.SelectOption = this.SelectOption.bind(this);
    }


    setModalShow = () => {
        this.setState({
            //  filterModalShow: true,
            mode: 'IS',
            //  step_id: '',
            step_desc: '',
            step_ordering: '',
            // parent_step_id: '',
            image_path: '',
            SPS_INFO_IMAGE_PATH: '',
            avatar: '',
            imagesArray: '',
            text: '',
            SPS_INPUT_TYPE: 0,
        });

    }

    SelectOption(val, e) {
        let $name = e.name;
        console.log($name, 'here...');
        this.setState({ [$name]: val.value });
        if ($name == 'step_id') {
            this.setState({ 'stepID_value': val });
            this.getMaterialUOM(val.value);
        } else if ($name == 'parent_step_id') {
            this.setState({ 'stepParentID_value': val });
        } else if ($name == 'step_uom') {
            this.setState({ 'step_uom_value': val });
        }
        console.log(val, e, 'here...');

    }
    getMaterialUOM(step_id) {

        ApiDataService.get(api_url + '/getMaterialUOM/' + this.state.product_id + '/' + step_id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    uom_list: response.data.uom_list,
                });
            }).catch(function (error) {
                console.log(error);
                this.errorThrough(error.message, "ERR");
            });
    }

    stepOptionRecord = (data) => {
        this.stepOptionModalRef.current.stepsModalRecord(data);
        this.setState({ stepOptionModalShow: true, mode: 'IS' });
    }

    modalClose = () => {
        this.setState({ modalShow: false });
        //  this.setState({ filterModalShow: false });
        this.setState({ stepOptionModalShow: false });
    }

    filterRenderTable = () => {
        this.setState({
            filterRenderTable: true
        }, () => {
            this.setState({ filterRenderTable: false });
            /*   this.setState({
                   //  step_id: '',
                   step_desc: '',
                   step_ordering: '',
                   //  parent_step_id: '',
                   image_path: '',
                   SPS_INFO_IMAGE_PATH: '',
                   avatar: '',
                   imagesArray: '',
                   text: '',
                   SPS_INPUT_TYPE: 0,
               });*/
        });
    }


    deletRecord = (id) => {
        this.setState({ deletedialog: true, product_step_id: id });
    }

    proceedDelete = (params) => {
        if (params) {
            this.deleteModalRecord(this.state.product_step_id);
        } else {

        }
    }
    closedialog = () => {
        this.setState({ deletedialog: false });
    }
    snapclose = () => {
        this.setState({ snapopen: false });
    };
    handleClose = () => {
        this.setState({ open: false });
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

    getStepList = (id) => {
        ApiDataService.get(api_url + '/getStepList/' + id)
            .then(response => {
                this.setState({
                    step_list: response.data.step_list,
                    parent_step_list: response.data.parent_step_list,
                    step_input_type_list: response.data.step_input_list,
                });
            }).catch(function (error) {
                console.log(error);
                this.errorThrough(error.message, "ERR");
            });
    }


    stepsModalRecord = (pro_data) => {
        // let id = pro_data.prod_info_id;
        let id = pro_data.prod_info_pr_code;

        //localStorage.setItem('PRODUCT_INFO_ID', id);
        localStorage.setItem('PRODUCT_NAME', pro_data.prod_info_desc);
        this.setState({ product_id: id, mode: 'IS', product_name: pro_data.prod_info_desc });
        this.setState({
            step_desc: '',
            step_ordering: '',
            image_path: '',
            SPS_INFO_IMAGE_PATH: '',
            avatar: '',
            imagesArray: '',
            text: '',
            SPS_INPUT_TYPE: 0,
        });
    }

    editStepModalRecord = (id, lang = 'en') => {
        //this.state.mode = 'UP';
        this.setState({ product_step_id: id, mode: 'UP' });
        ApiDataService.get(`${api_url}/productStep/${id}/edit`, lang).then(response => {
            let resp = response.data.result;
            Object.entries(resp).forEach(([key, value]) => {
                this.setState({ [key]: value });
            });
            this.getMaterialUOM(resp.step_id);
        }).catch((error) => {
            console.log(error);
            this.errorThrough(error.message, "ERR");
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
                this.filterRenderTable();
                this.getStepList(this.state.product_id);
            }
            this.closedialog();
        }).catch((error) => {
            this.errorThrough(error.message, "ERR");
            this.closedialog();
        });
    }

    stateChanges = (e) => {
        const { name, value } = e.target;
        var values = '';
        if (name === 'active_yn') {
            let checkBox = e.target.checked;
            values = (checkBox ? 'Y' : 'N');
        } else if (name === 'SPS_QUICK_BUY_YN') {
            let checkBox = e.target.checked;
            values = (checkBox ? 'Y' : 'N');
        }
        else {
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
        if (!fields['step_code'] || fields['step_code'] != 'STEP') {
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

    fileSelectedHandler(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                imagesArray: file,
                SPS_INFO_IMAGE_PATH: reader.result
            });
        }
        reader.readAsDataURL(file)
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
        this.state.loading_btn = true;
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
                    this.filterRenderTable();
                    //this.props.closeModal();
                    this.getStepList(this.state.product_id);

                    this.setState({
                        step_desc: '',
                        step_ordering: '',
                        image_path: '',
                        SPS_INFO_IMAGE_PATH: '',
                        avatar: '',
                        imagesArray: '',
                        text: '',
                        SPS_INPUT_TYPE: 0,
                    });
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
                    this.filterRenderTable();
                    this.getStepList(this.state.product_id);
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
        let { step_list, parent_step_list, product_id, product_name, step_input_type_list, lang_code, uom_list } = this.state;
        let $imagePreview = setValue.image_path ? (<img src={setValue.image_path} />) : (<div className="previewText"></div>);
        let $imagesArray_imagePreview = setValue.SPS_INFO_IMAGE_PATH ? (<img src={setValue.SPS_INFO_IMAGE_PATH} style={{ background: '#ef9c00' }} />) : (<div className="previewText"></div>);

        let self = this;
        const url = `admin/portal/productinfo/productStep/${product_id}`;
        let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product Step</Tooltip>}>
            <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
        const columns = [
            'sr_no',
            'SPS_DESC',
            'product_parent_step_name',
            'SPS_ORDERING',
            'SPS_QUICK_BUY_YN',
            'active_yn',
            'actions'
        ];

        const options = {
            perPage: PER_PAGE,
            headings: {
                sr_no: '#',
                SPS_DESC: 'Name',
                product_parent_step_name: 'Parent Step',
                SPS_ORDERING: 'Ordering',
                SPS_QUICK_BUY_YN: 'Quick Buy',
                active_yn: 'Active ?',

            },
            search_key: {
                SPS_DESC: 'Name',
                PARENT_DESC: 'Parent Step',
                SPS_ACTIVE_YN: 'Active ?',
                SPS_ORDERING: 'Ordering',
                SPS_QUICK_BUY_YN: 'Quick Buy'
            },
            sortable: ['SPS_DESC', 'product_parent_step_name', 'SPS_ORDERING', 'SPS_QUICK_BUY_YN', 'active_yn'],
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

        // let obj_lightTags = this.state.obj_light.split(',');
        // let objLightTagValue = [];
        // for (let i = 0; i < obj_lightTags.length;i++){
        //   objLightTagValue.push(setValue.light_list.filter((item) => item.value === obj_lightTags[i])[0]);
        // }

        let stepID_value = setValue.step_id ? step_list.filter((item) => item.value === setValue.step_id)[0] : setValue.stepID_value;
        let stepParentID_value = setValue.parent_step_id ? parent_step_list.filter((item) => item.value === setValue.parent_step_id)[0] : setValue.stepParentID_value;

        let step_uom_value = setValue.step_uom ? uom_list.filter((item) => item.value === setValue.step_uom)[0] : setValue.step_uom_value;

       //  console.log(step_uom_value);

        if (stepParentID_value == undefined) {
            stepParentID_value = { label: "N/A", value: 0 };
        }

        if (step_uom_value == undefined) {
            step_uom_value = { label: "N/A", value: 0 };
        }

        return (
            <div>
                <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
                    <Modal.Header closeButton className="">
                        <Modal.Title id="modalTitle">
                            <span>   Product Steps ({product_name})</span>
                            <span style={{ position: 'absolute', right: '35px' }}> Language=> {lang_code ? lang_code : 'en'}</span>
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={4}>
                                <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">

                                    {this.state.errors["product_id"] &&
                                        <span className='custError'>{this.state.errors["product_id"]}</span>
                                    }
                                    {this.state.errors["step_code"] &&
                                        <span className='custError'>{this.state.errors["step_code"]}</span>
                                    }

                                    <Form.Row className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                        <Col xs={9}>
                                            <Form.Group style={{ zIndex: 12, position: "relative" }}>
                                                <Form.Label>Step List </Form.Label>
                                                <Select
                                                    className="basic-single"
                                                    name="step_id"
                                                    value={stepID_value}
                                                    //  defaultValue={step_list[1]}
                                                    options={step_list ? step_list : []}
                                                    onChange={this.SelectOption}
                                                />

                                            </Form.Group>
                                        </Col>

                                        <Col xs={3} >
                                            <Form.Group controlId="formBasicCheckbox" style={{ 'float': 'right' }}>
                                                <Form.Label>Active ?</Form.Label>
                                                <Form.Check onChange={this.stateChanges} checked={setValue.active_yn === 'Y' ? true : false} type="checkbox" name="active_yn" />
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col xs={9}>
                                            <Form.Group>
                                                <Form.Label>Step Name</Form.Label>
                                                <Form.Control type="text" onChange={this.stateChanges} value={setValue.step_desc} name="step_desc" placeholder="Step Name" require="true" />
                                                {this.state.errors["step_desc"] &&
                                                    <span className='custError'>{this.state.errors["step_desc"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>

                                        <Col xs={3} className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                            <Form.Group>
                                                <Form.Label>Ordering</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.step_ordering} type="text" name="step_ordering" placeholder="Ordering" />
                                                {this.state.errors["step_ordering"] &&
                                                    <span className='custError'>{this.state.errors["step_ordering"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <Form.Row>
                                        <Col xs={7}>
                                            <Form.Group>
                                                <Form.Label>Text</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.text} type="text" name="text" placeholder="Text" />
                                                {this.state.errors["text"] &&
                                                    <span className='custError'>{this.state.errors["text"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={5} className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                            <Form.Group>
                                                <Form.Label>Input Type</Form.Label>
                                                <Form.Control as="select" value={setValue.SPS_INPUT_TYPE} name="SPS_INPUT_TYPE" onChange={this.stateChanges}>
                                                    {step_input_type_list ? step_input_type_list.map((data, i) => (
                                                        <option value={data.VSL_CODE} key={i}>{data.VSL_DESC}</option>
                                                    )) : ''}
                                                </Form.Control>
                                                {this.state.errors["SPS_INPUT_TYPE"] &&
                                                    <span className='custError'>{this.state.errors["SPS_INPUT_TYPE"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>

                                    </Form.Row>
                                    <Form.Row className={lang_code == 'ar' ? 'd-none' : 'en'}>

                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label>Min. Width/Depth</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.min_width} type="text" name="min_width" placeholder="Min. Width" />
                                                {this.state.errors["min_width"] &&
                                                    <span className='custError'>{this.state.errors["min_width"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Group>
                                                <Form.Label>Max. Height</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.max_height} type="text" name="max_height" placeholder="Max. Height" />
                                                {this.state.errors["max_height"] &&
                                                    <span className='custError'>{this.state.errors["max_height"]}</span>
                                                }
                                            </Form.Group>
                                        </Col>

                                        {/* <Col xs={3}>
                                            <Form.Group>
                                                <Form.Label>UOM</Form.Label>
                                                <Form.Control onChange={this.stateChanges} value={setValue.step_uom} type="text" name="step_uom" placeholder="UOM" />
                                                {this.state.errors["step_uom"] &&
                                                    <span className='custError'>{this.state.errors["step_uom"]}</span>
                                                }
                                            </Form.Group>
                                        </Col> */}
                                    </Form.Row>

                                    <Form.Row>
                                        <Col xl={12}>
                                            <Form.Group style={{ zIndex: 12, position: "relative" }}>
                                                <Form.Label>UOM List </Form.Label>
                                                <Select
                                                    className="basic-single"
                                                    name="step_uom"
                                                    value={step_uom_value}
                                                    //  defaultValue={step_list[1]}
                                                    options={uom_list ? uom_list : []}
                                                    onChange={this.SelectOption}
                                                />

                                            </Form.Group>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row className={lang_code == 'ar' ? 'd-none' : 'en'}>
                                        <Col xs={9}>
                                            <Form.Group style={{ zIndex: 11, position: "relative" }}>
                                                <Form.Label>Parent Step</Form.Label>
                                                <Select name="parent_step_id"
                                                    value={stepParentID_value}
                                                    options={parent_step_list ? parent_step_list : []}
                                                    onChange={this.SelectOption}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={3} >
                                            <Form.Group controlId="formBasicCheckbox" style={{ 'float': 'right' }}>
                                                <Form.Label>Quick Buy?</Form.Label>
                                                <Form.Check onChange={this.stateChanges} checked={setValue.SPS_QUICK_BUY_YN === 'Y' ? true : false} type="checkbox" name="SPS_QUICK_BUY_YN" style={{ textAlign: 'center' }} />
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>


                                    <Form.Row>
                                        <Col xs={12}>
                                            <label> Image/PDF File Upload (<small className="custError">* Image Maximum size 2MB</small>)</label>
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
                                            <div className="imgPreview" style={{ textAlign: 'center' }}>
                                                {$imagePreview}
                                            </div>
                                        </Col>
                                    </Form.Row>


                                    <Form.Row>
                                        <Col xs={12}>
                                            <label> Active icon Upload (<small className="custError">* Image Maximum size 2MB</small>)</label>
                                            <div className="input-group input-group-sm p-0">
                                                <div className="custom-file p-0">
                                                    <input className="custom-file-input form-control-sm p-0" accept=".jpg,.jpeg,.png" type="file" onChange={(e) => this.fileSelectedHandler(e)} multiple />
                                                    <label className="custom-file-label">{setValue.imagesArray ? setValue.imagesArray.name : ''}</label>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={10}>
                                            <small className="text-danger">
                                                {/* {isError.files.image && isError.message} */}
                                            </small>
                                            <div className="imgPreview" style={{ textAlign: 'center' }}>
                                                {$imagesArray_imagePreview}
                                            </div>
                                        </Col>
                                    </Form.Row>


                                    <Form.Row>
                                        <Form.Control value={setValue.product_id} type="hidden" name="product_id" />
                                        <Form.Control value={setValue.step_code} type="hidden" name="step_code" />
                                    </Form.Row>

                                    {/* <button type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.state.mode === 'IS' ? 'Save' : 'Update'}</button> */}
                                    <LaddaButton loading={this.state.loading_btn} type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"} >{this.state.mode === 'IS' ? 'Save' : 'Update'}</LaddaButton>
                                </Form>
                            </Col>

                            <Col sm={8}>

                                <SnapBarError
                                    message={this.state.error}
                                    snapopen={this.state.snapopen}
                                    snapcolor={this.state.snapcolor}
                                    snapclose={this.snapclose} />
                                <ConfirmationDialog
                                    dialogopen={this.state.deletedialog}
                                    dialogclose={this.closedialog}
                                    agreeProcess={this.proceedDelete}
                                />
                                <WindowPanel rawHtml={
                                    <div className="windowContent">
                                        <ServerTable renderView={this.state.filterRenderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
                                            {
                                                function (row, column, index) {
                                                    switch (column) {
                                                        case 'sr_no':
                                                            return (
                                                                (index + 1) + (PER_PAGE * ((self.state.page) - 1))
                                                            );
                                                        case 'actions':
                                                            return (
                                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                                        {row.step_option == 'Y' ? <Dropdown.Item onClick={() => self.stepOptionRecord(row)}><FontAwesomeIcon icon={faStepForward} /> Step Option</Dropdown.Item> : ''}
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


                <StepOptionModal
                    ref={this.stepOptionModalRef}
                    renderTable={this.renderTable}
                    mode={this.state.mode}
                    show={this.state.stepOptionModalShow}
                    closeDelete={this.closedialog}
                    errorMessage={this.errorThrough}
                    closeModal={this.modalClose}
                />
            </div>
        )
    }
}

export default StepsModal;
