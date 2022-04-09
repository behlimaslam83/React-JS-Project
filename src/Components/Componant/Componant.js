import React, { Component } from 'react';
import './Componant.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ComponantModal from "../Componant/ComponantModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
class Componant extends Component {
  constructor(props){
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
      renderTable:false,
      sysid: null,
	  page: 1
    };
    this.modalRef = React.createRef();
  }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}
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
    this.setState({ renderTable:true
    },() => {
      this.setState({ renderTable: false });
    });
  }

  editRecord=(id)=>{
    this.modalRef.current.editModalRecord(id);
    this.setState({ modalShow: true,mode: 'UP' });
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
    console.log(error,"RULING");
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
    const url = `admin/portal/component`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Component</Tooltip>}>
          <button className="btn btn-primary btn-sm" onClick={ this.setModalShow }>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = ['cm_desc', 'cm_unique_id', 'cm_from_date', 'cm_upto_date', 'actions', 'created_user_id', 'updated_user_id', 'created_date', 'updated_date'];
    const options = {
      perPage: PER_PAGE,
      headings: {
		// sr_no: '#', 
        cm_desc: 'Description',
        cm_unique_id: 'Unique ID',
        cm_from_date: 'From Date',
        cm_upto_date: 'Upto Date',
        created_user_id: 'Create User ID',
        updated_user_id: 'Updated User ID',
        created_date: 'Created Date',
        updated_date: 'Updated Date',
      },
	  search_key: {
        cm_desc: 'Description',
        cm_unique_id: 'Unique ID',
        cm_from_date: 'From Date',
        cm_upto_date: 'Upto Date'
      },
      sortable: ['cm_desc', 'cm_unique_id', 'cm_from_date', 'cm_upto_date'],
      requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order' },
      columnsAlign: { actions: 'center', created_user_id: 'hideColumn', updated_user_id: 'hideColumn', created_date: 'hideColumn', updated_date: 'hideColumn' },
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
        <WindowPanel rawHtml={
          <div className="windowContent">
            <ServerTable renderView={this.state.renderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
            {
              function (row, column, index) {
                switch (column) {
                  case 'sr_no':
					return (
						(index+1)+(PER_PAGE*((self.state.page)-1))
					);
				  case 'actions':
                    return (
                      <div className="form-control-sm" style={{ textAlign: 'center' }}>
                        <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                          <Dropdown.Item onClick={() => self.editRecord(row.cm_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.deletRecord(row.cm_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                        </DropdownButton>
                      </div>
                    );
                  default:
                    return (row[column]);
                }
              }
            }
          </ServerTable>
            <ComponantModal
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
        }/>
      </div>
    );
  }
}

export default Componant;