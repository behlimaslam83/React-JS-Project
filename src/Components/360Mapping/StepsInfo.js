import React, { Component } from 'react';
import './360Mapping.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import StepsinfoModal from "./StepsinfoModal";
import StepOptionModal from "./StepOptionModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class StepsInfo extends Component {


  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      stepOptionModalShow:false,
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
      deletesysid: ''
    };
    this.modalRef = React.createRef();
    this.stepOptionModalRef=React.createRef();
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
  stepOptionModalClose = () => {
    this.setState({ stepOptionModalShow: false });
  }

  renderTable = () => {
    this.setState({
      renderTable: true
    }, () => {
      this.setState({ renderTable: false });
    });
  }

  editRecord = (id) => {
    this.modalRef.current.editModalRecord(id);
    this.setState({ modalShow: true, mode: 'UP' });
  }

  deletRecord = (id) => {
    this.setState({ deletedialog: true, deletesysid: id });
  }
 
  proceedDelete = (params) => {
    let sysid = this.state.deletesysid;
    if (params) {
      this.modalRef.current.deleteModalRecord(sysid);
    } else {
      console.log('here111...');
    }
  }
  stepOptionRecord = (data) => {
    this.stepOptionModalRef.current.stepOptionModalRecord(data);
    this.setState({ stepOptionModalShow: true, mode: 'IS' });
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

  render() {
    let self = this;
    const url = `admin/portal/stepsInfo`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Steps</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = ['sr_no', 'step_desc', 'step_data_source', 'step_text','step_code_name', 'step_component_path', 'step_active_yn', 'actions'];
    const options = {
      perPage: PER_PAGE,
      headings: {
        sr_no: '#',
        step_desc: 'Step Name',
        step_data_source: 'Source Data',
        step_text: 'Material Text',
        step_component_path: 'Component Path',
        step_active_yn: 'Active',
        step_code_name:'Code Name'
      },
      search_key: {
        ss_desc: 'Step Name',
        ss_data_source: 'Source Data',
        ss_html_template_path: 'Component Path',
        ss_active_yn: 'Active',
      },
      sortable: ['step_desc', 'step_text', 'step_data_source', 'step_active_yn','step_code_name'],
      requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order', step_code_name:'Code Name' },
      columnsAlign: { actions: 'center' },
      responseAdapter: function (resp_data) {
        self.setState({ page: resp_data.page });
        return { data: resp_data.results, total: resp_data.row_count }
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
                            <Dropdown.Item onClick={() => self.editRecord(row.step_info_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => self.stepOptionRecord(row)}><FontAwesomeIcon icon={faEye} /> Step Option</Dropdown.Item>
                            <Dropdown.Item onClick={() => self.deletRecord(row.step_info_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                            {/*<Dropdown.Item onClick={()=> window.open("https://www.sedarglobal.com", 'Data','height=600,width=800,left=200,top=200')}><FontAwesomeIcon icon={faEye} /> Preview</Dropdown.Item>*/}
                          </DropdownButton>
                        </div>
                      );
                    default:
                      return (row[column]);
                  }
                }
              }
            </ServerTable>
            <StepsinfoModal
              ref={this.modalRef}
              sysid={this.state.sysid}
              renderTable={this.renderTable}
              mode={this.state.mode}
              show={this.state.modalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />
            <StepOptionModal
              ref={this.stepOptionModalRef}
              sysid={this.state.sysid}
              show={this.state.stepOptionModalShow}
              closeModal={this.stepOptionModalClose}
              errorMessage={this.errorThrough}
              mode={this.state.mode}
            />
          </div>
        } />
      </div>
    );
  }
}

export default StepsInfo;