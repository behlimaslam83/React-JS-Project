import React, { Component } from 'react';
import './Slug.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChartLine, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import SlugModal from "../Slug/SlugModal";
import AccessSecurity from '../../AccessSecurity';
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import SeoManagement from '../Seo/SeoManagement';


import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { WindowPanel } from "../../WindowPanel";
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
const apiUrl = `admin/portal/slug`;
class Slug extends Component {
  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = {      
      modalShow: false,
      mode: '',
	  seo: [],
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      renderTable:false,
      sysid: null,
	  isShowSeo:false,
	  isAddEditSeo:false,
	  refSysId:'',
	  security:'',
	  page: 1
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
    this.setState({ modalShow: false, isAddEditSeo: false, refSysId:'', isShowSeo: false });
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
  
    seoCategory = slugId => {		
		let $url = `${apiUrl}/seo/${slugId}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,
						isAddEditSeo: true,						
						isShowSeo: true,
						refSysId:slugId
					});
				}
			//}else{
				//Config.createNotification('warning',res.data.error_message);
			//}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}
	
	securityAccess = (param) => {
		this.setState({
			security: param
		});
	}	

  render() {
    let self = this;
    const url = `admin/portal/slug`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Slug</Tooltip>}>
          <button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary btn-sm" onClick={ this.setModalShow }>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
	  const columns = ['sr_no', 'slug_desc', 'slug_url', 'slug_redirect_url', 'actions'];
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        slug_desc: 'Description',
        slug_url: 'Slug Url',
        slug_redirect_url: 'Redirect Url',
		    
      },
	    search_key: {
        slug_desc: 'Description',
        slug_url: 'Slug Url',
        slug_redirect_url: 'Redirect Url'

      },
      sortable: ['slug_desc', 'slug_url', 'slug_redirect_url'],
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
	let popupTitle = 'Seo';
	let seoForm;
	let popupSize = '';	
	if(this.state.isAddEditSeo) {
	  seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.modalClose} refSysId={this.state.refSysId} seoFor='slug' />
	  popupTitle = 'Seo';
	  popupSize = 'lg';
	}
    return (
      <div>
	  <AccessSecurity accessecurity={this.securityAccess} />
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
                          <Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => self.editRecord(row.slug_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
						  <Dropdown.Item disabled={self.state.security.SEO_YN !== 'Y' ? true : false} onClick={() => self.seoCategory(row.slug_id)}><FontAwesomeIcon icon={faChartLine} /> SEO</Dropdown.Item>
                          <Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => self.deletRecord(row.slug_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                        </DropdownButton>
                      </div>
                    );
                  default:
                    return (row[column]);
                }
              }
            }
          </ServerTable>
            <SlugModal
              ref={this.modalRef}
              renderTable={this.renderTable}
              editModal={this.editModal}
              mode={this.state.mode}
              show={this.state.modalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />
			
			
			<Modal animation={false} size={popupSize} id="slugSeoModal" show={this.state.isShowSeo} onHide={this.modalClose}>
				<Modal.Header closeButton>
					<Modal.Title>{(this.state.mode==="UP")?'Edit '+popupTitle:'Add '+popupTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>					
					{ seoForm }
				</Modal.Body>
				{/*<Modal.Footer>
				  <Button variant="secondary" onClick={this.closeModal}>Close</Button>
				</Modal.Footer>*/}
			</Modal>
          </div> 
        }/>
      </div>
    );
  }
}

export default Slug;