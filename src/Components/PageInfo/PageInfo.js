import React, { Component } from 'react';
import './PageInfo.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PageInfoModal from "../PageInfo/PageInfoModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
import AccessSecurity from '../../AccessSecurity';
const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class PageInfo extends Component {
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
      deletesysid:'',
	  security:''
    };
    this.modalRef = React.createRef();
  }
  
  securityAccess = (param) => {
	this.setState({
		security: param
	});
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

  editRecord = (id) => {
    this.setState({ modalShow: true, mode: 'UP', sysid: id },
      () => { this.setState({ sysid: null }); });
  }

  deletRecord = (id) => {
    this.setState({ deletedialog: true, deletesysid: id });
  }
  
  pagePreview = (page_info_code) => {
    //this.setState({ deletedialog: true });
	this.setState({ modalShow: true, mode: 'PR', sysid: page_info_code },
      () => { this.setState({ sysid: null }); });
  }  

  proceedDelete = (params) => {
    let sysid = this.state.deletesysid;
    console.log(sysid, params,"SDFSDFF sysid");
    if (params) {
      this.setState({ mode: 'IS', sysid: sysid },
        () => { this.setState({ sysid: null }); });
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
  
	pageChildList = (page_info_code) => {
		//this.setState({ deletedialog: true });
		this.setState({ modalShow: true, mode: 'SL', sysid: page_info_code },
		  () => { this.setState({ sysid: null }); });
	}

  render() {
    let self = this;	
    const url = `admin/portal/page_info`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add PageInfo</Tooltip>}>
      <button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = ['sr_no','page_info_code', 'page_info_desc', 'page_info_active_yn', 'actions']; //, 'page_info_id'
    const options = {
      perPage: PER_PAGE,
      headings: {
        sr_no: '#',
        //page_info_id: 'Page ID',        
        page_info_code: 'Page Code',
        page_info_desc: 'Page Description',
        page_info_active_yn: 'Active',
        
      },
      search_key: {
        //page_info_id: 'Page Id',
        page_info_code: 'Page Code',
        page_info_desc: 'Page Description'
      },
      sortable: ['page_info_code', 'page_info_desc', 'page_info_active_yn'], //'page_info_id', 
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
		<AccessSecurity accessecurity={this.securityAccess} />
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
								<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => self.editRecord(row.page_info_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
								<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => self.deletRecord(row.page_info_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
								<Dropdown.Item onClick={() => self.pagePreview(row.page_info_code)}><FontAwesomeIcon icon={faEye} /> Preview</Dropdown.Item>
								<Dropdown.Item disabled={(self.state.security.INSERT_YN !== 'Y' || self.state.security.UPDATE_YN !== 'Y')  ? true : false} onClick={() => self.pageChildList(row.page_info_code)}><FontAwesomeIcon icon={faEye} /> Copy Slug</Dropdown.Item>
							</DropdownButton>
                        </div>
                      );
                    default:
                      return (row[column]);
                  }
                }
              }
            </ServerTable>
            <PageInfoModal
              sysid={this.state.sysid}
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

export default PageInfo;