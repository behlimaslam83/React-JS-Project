import React, { Component } from 'react';
import './ItemInfo.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faFilter, faImages, faDirections, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ItemInfoModal from "../ItemInfo/ItemInfoModal";
import FilterModal from "../ItemInfo/FilterModal";
import PriceModal from '../ItemInfo/PriceModal';

// import GalleryModal from "../ProductInfo/GalleryModal";
// import InstructionModal from "../ProductInfo/InstructionModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
import AccessSecurity from '../../AccessSecurity';


const PER_PAGE = process.env.REACT_APP_PER_PAGE ;

const Api_Productlov = 'admin/portal/iteminfo/product_lov';


class ItemInfo extends Component {
  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = {      
      modalShow: false,
      filterModalShow: false,
      galleryModalShow: false,
      instructionModalShow: false,
      priceModalShow: false,
      mode: '',
      dataview: [],
      totaldata: null,
      snapopen: false,
      snapcolor: null,
      error: null,
      deletedialog: false,
      proceed: false,
      renderTable:false,
      setProductShow: false,
      sysid: null,
	    page: 1,
      addonList: true,
      security: []
    };
    this.modalRef = React.createRef();
    this.filtermodalRef = React.createRef();
    this.galleryModalRef = React.createRef();
    this.instructionModalRef = React.createRef();
    this.priceModalRef = React.createRef();
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
    this.setState({ filterModalShow: false });
    this.setState({ galleryModalShow: false });
    this.setState({ instructionModalShow: false });
    this.setState({ priceModalShow: false });   
     
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

  duplicateRecord=(id)=>{
    this.modalRef.current.editModalRecord(id, 'copy');
    this.setState({ modalShow: true,mode: 'IS' });
  }

  filterRecord=(id)=>{
    this.filtermodalRef.current.filterModalRecord(id);
    this.setState({ filterModalShow: true,mode: 'IS' });
  }
  priceRecord=(id)=>{
    this.priceModalRef.current.priceModalRecord(id);
    this.setState({ priceModalShow: true,mode: 'IS' });
  }
  instructionRecord=(id)=>{
    this.instructionModalRef.current.instructionModalRecord(id);
    this.setState({ instructionModalShow: true,mode: 'IS' });
  }
  

  galleryRecord=(id)=>{
    this.galleryModalRef.current.galleryModalRecord(id);
    this.setState({ galleryModalShow: true,mode: 'IS' });
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

  setsecurity = (param) => {
    //console.log(param.USER_ROLE)
    this.setState({ security: param });
   }
  render() {
    let security = this.state.security;

    let self = this;

    const url = `admin/portal/iteminfo`;
    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Item</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={ this.setModalShow } disabled={security.INSERT_YN != 'Y' ? true:false}>{<FontAwesomeIcon  icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no', 
      'sii_item_id',
      'sii_desc',
      'sii_ordering',
      'sii_active_yn',
      'item_info_image_path',
      'actions'
    ];
	
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        sii_item_id: 'Item Id',
        sii_desc: 'Description',
        sii_ordering: 'Ordering',
        sii_active_yn: 'Active ?',
        item_info_image_path: 'Image',
        
      },
	    search_key: {
        sii_item_id: 'Item Id',
        sii_desc: 'Description',
        sii_ordering: 'Ordering',
        sii_active_yn: 'Active ?',
        item_info_image_path: 'Image'
      },
      
      sortable: ['sii_item_id', 'sii_desc', 'sii_active_yn'],
      requestParametersNames: { search_value: 'search_value', search_column: 'search_column', addon_search_key: 'addon_search_key', direction: 'order' },
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
            <ServerTable lov_url={Api_Productlov} addon={this.state.addonList} renderView={this.state.renderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
            {
              function (row, column, index) {
                switch (column) {
                  	case 'sr_no':
                      return (
                        (index+1)+(PER_PAGE*((self.state.page)-1))
                      );
                    case 'item_info_image_path':
                      return (
                        <center><img src={row.item_info_image_path} height="60" className="table-image" alt="" /></center>
                      );		
                    case 'actions':
                      return (
                        <div className="form-control-sm" style={{ textAlign: 'center' }}>
                          <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                          <Dropdown.Item onClick={() => self.editRecord(row.item_info_code)}><FontAwesomeIcon icon={faEdit} disabled={security.UPDATE_YN != 'Y' ? true:false}/> Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.duplicateRecord(row.item_info_code)}><FontAwesomeIcon icon={faCopy} /> Duplicate</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.filterRecord(row.item_info_code)}><FontAwesomeIcon icon={faFilter} /> Filter</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.priceRecord(row.item_info_code)}><FontAwesomeIcon icon={faFilter} /> Price</Dropdown.Item>
                          {/* <Dropdown.Item onClick={() => self.instructionRecord(row.item_info_code)}><FontAwesomeIcon icon={faDirections} /> Instruction</Dropdown.Item>
                          <Dropdown.Item onClick={() => self.galleryRecord(row.item_info_code)}><FontAwesomeIcon icon={faImages} /> Gallery</Dropdown.Item> */}
                          <Dropdown.Item onClick={() => self.deletRecord(row.item_info_code)} disabled={security.DELETE_YN != 'Y' ? true:false}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                          </DropdownButton>
                        </div>
                      );
                  	default:
                    	return (row[column]);
                }
              }
            }
          </ServerTable>
            <ItemInfoModal
              ref={this.modalRef}
              renderTable={this.renderTable}
              editModal={this.editModal}
              mode={this.state.mode}
              show={this.state.modalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
              security_access={security}

            />

            <FilterModal
              ref={this.filtermodalRef}
              renderTable={this.renderTable}
              filterModal={this.filterModal}
              mode={this.state.mode}
              show={this.state.filterModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />

            <PriceModal
              ref={this.priceModalRef}
              renderTable={this.renderTable}
              priceModal={this.priceModal}
              mode={this.state.mode}
              show={this.state.priceModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />

            {/* <GalleryModal
              ref={this.galleryModalRef}
              galleryrenderTable={this.renderTable}
              galleryModal={this.galleryModal}
              mode={this.state.mode}
              show={this.state.galleryModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            />

            <InstructionModal
              ref={this.instructionModalRef}
              galleryrenderTable={this.renderTable}
              instructionModal={this.instructionModal}
              mode={this.state.mode}
              show={this.state.instructionModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
            /> */}

          </div> 
        }/>
      </div>
    );
  }
}

export default ItemInfo;