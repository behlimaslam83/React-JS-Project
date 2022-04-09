import React, { Component } from 'react';
import './Showroom.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faLanguage, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ShowroomModal from "../Showroom/ShowroomModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
import AccessSecurity from '../../AccessSecurity';

const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class Showroom extends Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      modalShow: false,
      mode: '',
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      renderTable: false,
      sysid: null,
      page: 1,
      deletesysid: '',
      security: [],
    };
    this.modalRef = React.createRef();
  }
  setModalShow = () => {
    this.setState({
      modalShow: true,
      mode: 'IS'
    });
  }

  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose = () => {
    this.setState({ modalShow: false });
  }

  renderTable = () => {
    this.setState({
      renderTable: true
    }, () => {
      this.setState({ renderTable: false });
    });
  }

  duplicateRecord = (id, desc, lang) => {
    this.modalRef.current.editModalRecord(id, desc, lang, 'copy');
    this.setState({ modalShow: true, mode: 'IS' });
  }

  editRecord = (id, desc, lang) => {
    this.modalRef.current.editModalRecord(id, desc, lang);

    this.setState({ modalShow: true, mode: 'UP', sysid: id },
      () => { this.setState({ sysid: null }); });
  }

  deletRecord = (id) => {
    this.setState({ deletedialog: true, sysid: id });
  }
  

  proceedDelete = (params) => {
    if (params) {
      this.modalRef.current.deleteModalRecord(this.state.sysid);
    }else{

    }

  }

  snapclose = () => {
    this.setState({ snapopen: false });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  errorThrough = (error, argu) => {
    var erroMessage ='';
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
  
  setsecurity = (param) => {
    //console.log(param.USER_ROLE)
    this.setState({ security: param });
  }

  render() {
    let security = this.state.security;

    let self = this;	
    const url = `admin/portal/showroom`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Showroom</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = ['sr_no', 'address_title', 'address_desc', 'phone_no', 'active_yn', 'actions']; //, 'tag_id'
    const options = {
      perPage: PER_PAGE,
      headings: {
        sr_no: '#',
        address_title: 'Title',
        address_desc: 'Description',
        phone_no: 'Phone No',
        active_yn: 'Active',
        
      },
      search_key: {
        address_title: 'Title',
        address_desc: 'Description',
        phone_no: 'Phone No'
      },
      sortable: ['address_title', 'address_desc', 'active_yn'], //'tag_id', 
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
        pages:[]
      }
    };
    
    return (
      <div>
        <AccessSecurity
          accessecurity={this.setsecurity}
        />
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
            <ServerTable renderView={this.state.renderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
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
                            <Dropdown.Item onClick={() => self.editRecord(row.id, row.address_desc, 'en')}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => self.duplicateRecord(row.id, row.address_desc, 'en')}><FontAwesomeIcon icon={faCopy} /> Duplicate</Dropdown.Item>
                            <Dropdown.Item disabled={security.LANGUAGE_YN !== 'Y' ? true : false} onClick={() => self.editRecord(row.id, row.address_desc, 'ar')}>
                              <FontAwesomeIcon icon={faLanguage} /> Edit Language
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => self.deletRecord(row.id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                          </DropdownButton>
                        </div>
                      );
                    default:
                      return (row[column]);
                  }
                }
              }
            </ServerTable>
            
            <ShowroomModal
              ref={this.modalRef}
              renderTable={this.renderTable}
              editModal={this.editModal}
              mode={this.state.mode}
              show={this.state.modalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />
          </div>
        } />
      </div>
    );
  }
}

export default Showroom;