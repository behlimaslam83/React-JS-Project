
import React, { Component } from 'react';
import './ProductInfo.scss';
import { Col, Row, Form, Modal } from 'react-bootstrap';
import { WindowPanel } from "../../WindowPanel";
import ApiDataService from '../../services/ApiDataService';

import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faLanguage, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";

const insertUrl = 'admin/portal/productinfo/instruction';
const Api_Langlov = 'admin/portal/productinfo/lang/lov';

const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class InstructionModal extends Component {
  state = {
    value: [],
  };
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      prod_instru_desc: '',
      prod_instru_ordering: '',
      prod_instru_link_url: '',
      prod_instru_active_yn: 'Y',
      errors: {},
      prod_instru_info_id: '',


      instructionModalShow: false,
      mode: '',
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      instructionrenderTable: false,
      page: 1,

      prod_instru_image_path: '',
      prod_instru_pdf_path: '',
      prod_instru_video_path: '',
      imagePreviewUrl: '',
      pdfPreviewUrl: '',
      videoPreviewUrl: '',
      avatar_error: false,
      pdf_error: false,
      video_error: false,
      product_desc: '',
      language: '',
      videoPreviewUrl: '',
      langDrop: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.modalRef = React.createRef();
    this.instructionModalRef = React.createRef();
  }



  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show && !prevProps.show) {

      ApiDataService.get(process.env.REACT_APP_SERVER_URL + Api_Langlov, null).then(response => {
        let data = response.data.result;
        this.setState({
          langDrop: data
        });
      });


    }
  }

  setModalShow = () => {
    this.setInput_value();
    this.setState({
      instructionModalShow: true,
      mode: 'IS',
      language: 'en'
    });
  }

  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ instructionModalShow: false });
  }

  instructionrenderTable = () => {
    this.setState({
      instructionrenderTable: true
    }, () => {
      this.setState({ instructionrenderTable: false });
    });
  }

  editRecord = (id) => {
    this.modalRef.current.editModalRecord(id);
    this.setState({ instructionModalShow: true, mode: 'UP' });
  }


  deletRecord = (id) => {
    this.setState({ deletedialog: true, prod_instru_info_id: id });
  }

  proceedDelete = (params) => {
    if (params) {
      this.deleteModalRecord(this.state.prod_instru_info_id);
    } else {

    }

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

  instructionModalRecord = (id, desc) => {
    this.setState({ prod_instru_info_id: id, mode: '', product_desc: desc });
  }

  editinstructionModalRecord = (id, lang) => {
    this.state.mode = 'UP';
    ApiDataService.get(`${insertUrl}/${id}/edit?language=` + lang).then(response => {
      let resp = response.data.result[0];
      Object.entries(resp).forEach(([key, value]) => {
        this.setState({ [key]: value });
      });
    }).catch((error) => {

    });

  }

  deleteModalRecord = (id) => {
    ApiDataService.delete(`${insertUrl}/`, id).then(response => {
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.errorThrough(response.data.result, "ERR-OBJ");
        } else {
          this.errorThrough(response.data.error_message, "ERR");
        }
      } else {
        this.errorThrough(response.data.error_message, "DONE");
        this.instructionrenderTable();
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

    if (name === 'prod_instru_desc' && this.state.language == 'en') {
      let _url = value.replace(/[^A-Z0-9]+/ig, "-");
      this.setState({ 'prod_instru_link_url': _url.replace(/-$/, "").toLowerCase() });
    }
    if (name === 'prod_instru_active_yn') {
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

    if (!fields['prod_instru_desc']) {
      errors["prod_instru_desc"] = "Description is required";
      formIsValid = false;
    }
    if (!fields['prod_instru_ordering']) {
      errors["prod_instru_ordering"] = "Instruction ordering is required";
      formIsValid = false;
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  setInput_value() {
    this.setState({
      prod_instru_desc: '',
      prod_instru_ordering: '',
      prod_instru_link_url: '',
      prod_instru_active_yn: 'Y',
      errors: {},
      mode: '',
      snapopen: false,
      snapcolor: null,
      error: null,
      prod_instru_image_path: '',
      prod_instru_pdf_path: '',
      prod_instru_video_path: '',
      imagePreviewUrl: '',
      pdfPreviewUrl: '',
      videoPreviewUrl: '',
      avatar_error: false,
      pdf_error: false,
      video_error: false,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.pdf_error == true || this.state.video_error) {
      return true;
    }

    var formData = new FormData();
    let Properties = this.state;

      //  console.log(this.state, 'tate');


    for (var key in Properties) {
      formData.append(key, Properties[key]);
    }

    var url = '';
    

    if (this.state.mode === 'IS') {
      //serverSet = ApiDataService.post;
      url = insertUrl + '?prod_instru_info_id=' + this.state.prod_instru_info_id;

      ApiDataService.post(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        } else {
          this.errorThrough(response.data.error_message, "DONE");
          this.instructionrenderTable();
          this.setInput_value();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });

    } else {

      //serverSet = ApiDataService.update;
      url = `${insertUrl}/update/${this.state.prod_instru_id}`;

      ApiDataService.update(url, formData).then(response => {
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        } else {
          this.errorThrough(response.data.error_message, "DONE");
          this.instructionrenderTable();
          this.setInput_value();
        }
      }).catch((error) => {
        console.log(error);
        this.errorThrough(error.message, "ERR");
      });

    }

  }


  _handleImageChange(e, name, size) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    
    var fileSize = parseFloat(file.size / 1024).toFixed(2);
    reader.onloadend = () => {
      // this.setState({
      //   avatar: file,
      //   imagePreviewUrl: reader.result
      // });
      if (name == 'image') {
        if (fileSize <= size) {
          this.setState({
            avatar: file,
            imagePreviewUrl: reader.result,
            avatar_error: false
          });
        } else {
          this.setState({
            avatar_error: true
          });
        }
      }
      if (name == 'pdf') {
        if (fileSize <= size) {
          this.setState({
            avatar_pdf: file,
            pdfPreviewUrl: reader.result,
            pdf_error: false
          });
        } else {
          this.setState({
            pdf_error: true
          });
        }
      }
      if (name == 'video') {
        if (fileSize <= size) {
          this.setState({
            avatar_video: file,
            videoPreviewUrl: reader.result,
            video_error: false
          });
        } else {
          this.setState({
            video_error: true
          });
        }
      }
    }
    //console.log(this.state, 'this.state');

    reader.readAsDataURL(file)
  }





  render() {

    const setValue = this.state;
    let { langDrop } = this.state;

    let { imagePreviewUrl, pdfPreviewUrl, videoPreviewUrl, prod_instru_image_path } = this.state;
    let $imagePreview = imagePreviewUrl ? imagePreviewUrl : prod_instru_image_path;
    let $pdfPreview = null;
    let $videoPreview = null;
    if ($imagePreview) {
      $imagePreview = (<img src={$imagePreview} />);
    } else {
      $imagePreview = (<div className="previewText"></div>);
    }

    if (pdfPreviewUrl) {
      $pdfPreview = (<center><FontAwesomeIcon icon={faFilePdf} className="fa-2x" /></center>);
    } else {
      $pdfPreview = (<a href={setValue.prod_instru_pdf_path} target="_blank"> {setValue.prod_instru_pdf_path}</a>);
    }

    if (videoPreviewUrl) {
      $videoPreview = (
        <video width="200">
          <source src={videoPreviewUrl} />
        </video>
      )
    } else {
      $videoPreview = (<a href={setValue.prod_instru_video_path} target="_blank"> {setValue.prod_instru_video_path}</a>);
    }

    let self = this;
    const url = `admin/portal/productinfo/instruction`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Instruction</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no',
      'prod_instru_desc',
      'prod_instru_ordering',
      'prod_instru_active_yn',
      'prod_instru_image_path',
      'actions'
    ];

    const options = {
      perPage: PER_PAGE,
      headings: {
        sr_no: '#',
        prod_instru_desc: 'Description',
        prod_instru_ordering: 'Ordering',
        prod_instru_active_yn: 'Active ?',
        prod_instru_image_path: 'Image',

      },
      search_key: {
        prod_instru_desc: 'Description',
        prod_instru_ordering: 'Ordering',
        prod_instru_active_yn: 'Active ?'
      },
      sortable: ['prod_instru_desc'],
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





    return (
      <div>
        <Modal animation={false} size="xl" show={this.props.show} onHide={this.props.closeModal} >
          <Modal.Header closeButton className="">
            <Modal.Title id="modalTitle">
              Instruction {this.state.product_desc != '' ? '(' + this.state.product_desc + ')' : ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col className={this.state.mode === '' ? "d-none" : 'col-sm-4'}>
                <Form noValidate onSubmit={this.handleSubmit} autoComplete="off">
                  <Form.Row>
                    <Col className={this.state.language == 'en' ? 'd-none' : ''}>

                      <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as="select" value={setValue.language} name="language" onChange={this.stateChanges}>
                          <option>Select Language</option>
                          {langDrop.map((data, i) => (
                            <option value={data.code} key={i}>{data.desc}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control onChange={this.stateChanges} value={setValue.prod_instru_desc} type="text" name="prod_instru_desc" placeholder="Description" />
                        {this.state.errors["prod_instru_desc"] &&
                          <span className='custError'>{this.state.errors["prod_instru_desc"]}</span>
                        }
                      </Form.Group>
                    </Col>
                  </Form.Row>




                  <Form.Group className={this.state.language != 'en' ? 'd-none' : ''}>
                    <Form.Label>Ordering</Form.Label>
                    <Form.Control onChange={this.stateChanges} value={setValue.prod_instru_ordering} type="text" name="prod_instru_ordering" placeholder="Ordering" />
                    {this.state.errors["prod_instru_ordering"] &&
                      <span className='custError'>{this.state.errors["prod_instru_ordering"]}</span>
                    }
                  </Form.Group>

                  <Form.Group className={this.state.language != 'en' ? 'd-none' : ''}>
                    <Form.Label>Link Url</Form.Label>
                    <Form.Control onChange={this.stateChanges} value={setValue.prod_instru_link_url} type="text" name="prod_instru_link_url" placeholder="Link Url" readOnly />
                    {this.state.errors["prod_instru_link_url"] &&
                      <span className='custError'>{this.state.errors["prod_instru_link_url"]}</span>
                    }
                  </Form.Group>

                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Check onChange={this.stateChanges} checked={setValue.prod_instru_active_yn === 'Y' ? true : false} type="checkbox" name="prod_instru_active_yn" label="Active" />
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row className={this.state.language != 'en' ? 'd-none' : ''}>
                    <Col>
                      <Form.Label>Image Upload</Form.Label>
                      <Form.Group>
                        <div className="previewComponent">
                          <Form.Control className="fileInput" type="file" accept=".jpg,.jpeg,.png,.gif" onChange={(e) => this._handleImageChange(e, 'image', 10)} />

                          {setValue.avatar_error &&
                            <Col sm={12}><p className="text-danger">* Image Maximum size 10KB</p></Col>
                          }

                          <div className="imgPreview">
                            {$imagePreview}
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Label>PDF Upload</Form.Label>
                      <Form.Group>
                        <div className="previewComponent">
                          <Form.Control className="fileInput" type="file" accept=".pdf" onChange={(e) => this._handleImageChange(e, 'pdf', 3072)} />

                          {setValue.pdf_error &&
                            <Col sm={12}><p className="text-danger">* PDF Maximum size 3MB</p></Col>
                          }

                          <div className="imgPreview">
                            {$pdfPreview}
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Label>Video Upload</Form.Label>
                      <Form.Group>
                        <div className="previewComponent">
                          <Form.Control className="fileInput" type="file" accept=".mp4,.webm,.ogg" onChange={(e) => this._handleImageChange(e, 'video', 40000)} />

                          {setValue.video_error &&
                            <Col sm={12}><p className="text-danger">*Video maximum size 40MB</p></Col>
                          }

                          <div className="imgPreview">
                            {$videoPreview}
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <button type="submit" className={this.state.mode === 'IS' ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>{this.state.mode === 'IS' ? 'Save' : 'Update'}</button>
                </Form>
              </Col>

              <Col className={this.state.mode === '' ? "col-sm-12" : 'col-sm-8'}>

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
                    <ServerTable renderView={this.state.instructionrenderTable} columns={columns} url={`${url + `?prod_instru_info_id=` + this.state.prod_instru_info_id}`} options={options} addme={$button} bordered hover updateUrl>
                      {
                        function (row, column, index) {
                          switch (column) {
                            case 'sr_no':
                              return (
                                (index + 1) + (PER_PAGE * ((self.state.page) - 1))
                              );
                            case 'prod_instru_image_path':
                              return (
                                <img src={row.prod_instru_image_path} width="50" className="table-image" alt="" />
                              );
                            case 'actions':
                              return (
                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                  <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                    <Dropdown.Item onClick={() => self.editinstructionModalRecord(row.prod_instru_id, 'en')}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={() => self.deletRecord(row.prod_instru_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                                    <Dropdown.Item onClick={() => self.editinstructionModalRecord(row.prod_instru_id, 'ar')}><FontAwesomeIcon icon={faLanguage} /> Edit Language</Dropdown.Item>
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

export default InstructionModal;