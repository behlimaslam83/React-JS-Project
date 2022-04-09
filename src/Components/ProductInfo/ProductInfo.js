import React, { Component } from 'react';
import './ProductInfo.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus, faFilter, faImages, faDirections, faStepForward, faLanguage, faMoneyBillAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ProductInfoModal from "../ProductInfo/ProductInfoModal";
import PriceModal from "../ProductInfo/PriceModal";
import FilterModal from "../ProductInfo/FilterModal";
import GalleryModal from "../ProductInfo/GalleryModal";
import InstructionModal from "../ProductInfo/InstructionModal";
import StepsModal from "../ProductInfo/StepsModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
import AccessSecurity from '../../AccessSecurity';


const PER_PAGE = process.env.REACT_APP_PER_PAGE;



class ProductInfo extends Component {
  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = {      
      modalShow: false,
      filterModalShow: false,
      stepModalShow:false,
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
      sysid: null,
	    page: 1,
      security: [],
      
    };
    this.modalRef = React.createRef();
    this.priceModalRef = React.createRef();
    this.filtermodalRef = React.createRef();
    this.galleryModalRef = React.createRef();
    this.instructionModalRef = React.createRef();
    this.stepsModalRef = React.createRef();
    
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
    this.setState({ priceModalShow: false });
    this.setState({ filterModalShow: false });
    this.setState({ galleryModalShow: false });
    this.setState({ instructionModalShow: false });    
    this.setState({ stepModalShow: false });    
  }

  renderTable = () => {
    this.setState({ renderTable:true
    },() => {
      this.setState({ renderTable: false });
    });


  }

  duplicateRecord = (id, desc, lang) => {
    this.modalRef.current.editModalRecord(id, desc, lang, 'copy');
    this.setState({ modalShow: true, mode: 'IS' });
  }

  editRecord=(id, desc, lang)=>{
    this.modalRef.current.editModalRecord(id, desc, lang);
    this.setState({ modalShow: true,mode: 'UP' });
  }

  priceRecord=(id, desc)=>{
    this.setState({ priceModalShow: true,mode: 'IS' });
    this.priceModalRef.current.PriceModalRecord(id, desc);

  }
  

  filterRecord=(id, desc)=>{
    
    this.setState({ filterModalShow: true,mode: 'IS'});

    this.filtermodalRef.current.filterModalRecord(id, desc);


  }

  stepRecord=(data)=>{
    this.stepsModalRef.current.getStepList(data.prod_info_pr_code);
    this.stepsModalRef.current.stepsModalRecord(data);
    this.setState({ stepModalShow: true,mode: 'IS' });
  }

  instructionRecord=(id, desc)=>{
    this.instructionModalRef.current.instructionModalRecord(id, desc);
    this.setState({ instructionModalShow: true,mode: 'IS' });
  }
  

  galleryRecord=(id, desc)=>{
    this.galleryModalRef.current.galleryModalRecord(id, desc);
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
    const url = `admin/portal/productinfo`;
    let $addModal = (<button className="btn btn-primary btn-sm mr-3" onClick={() => self.priceRecord()} disabled={security.USER_ROLE != 'TECHNICAL' ? true:false}><FontAwesomeIcon icon={faMoneyBillAlt} /> Price </button> );

    let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Product</Tooltip>}>
      <button className="btn btn-primary btn-sm" onClick={ this.setModalShow } disabled={security.INSERT_YN != 'Y' ? true:false}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
    const columns = [
      'sr_no', 
      'prod_info_desc',
      'prod_info_category_desc',
      'prod_info_ordering',
      'prod_info_from_date',
      'prod_info_upto_date',
      'prod_info_active_yn',
      'actions'
    ];
	
    const options = {
      perPage: PER_PAGE,
      headings: {
		    sr_no: '#', 
        prod_info_desc: 'Description',
        prod_info_category_desc: 'Catrgory',
        prod_info_ordering: 'Ordering',
        prod_info_from_date: 'From Date',
        prod_info_upto_date: 'Upto Date',
        prod_info_active_yn: 'Active ?',
        
      },
	    search_key: {
        prod_info_desc: 'Description',
        prod_info_category_desc: 'Catrgory',
        prod_info_ordering: 'Ordering',
        prod_info_from_date: 'From Date',
        prod_info_upto_date: 'Upto Date',
        prod_info_active_yn: 'Active ?',
      },
      sortable: ['prod_info_desc', 'prod_info_from_date', 'prod_info_upto_date'],
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
            <ServerTable renderView={this.state.renderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl addModal={$addModal}>
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
                      <Dropdown.Item onClick={() => self.editRecord(row.prod_info_id, row.prod_info_desc, 'en')} disabled={security.UPDATE_YN != 'Y' ? true:false}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => self.duplicateRecord(row.prod_info_id, row.prod_info_desc, 'en')} disabled={security.INSERT_YN != 'Y' ? true : false}><FontAwesomeIcon icon={faCopy} /> Duplicate</Dropdown.Item>
                        <Dropdown.Item onClick={() => self.filterRecord(row.prod_info_pr_code, row.prod_info_desc)}><FontAwesomeIcon icon={faFilter} /> Filter</Dropdown.Item>
                      <Dropdown.Item onClick={() => self.stepRecord(row, row.prod_info_desc)} disabled={security.USER_ROLE != 'TECHNICAL' ? true:false}><FontAwesomeIcon icon={faStepForward} /> Steps</Dropdown.Item>
                      <Dropdown.Item onClick={() => self.instructionRecord(row.prod_info_id, row.prod_info_desc)}><FontAwesomeIcon icon={faDirections} /> Instruction</Dropdown.Item>
                      <Dropdown.Item onClick={() => self.galleryRecord(row.prod_info_id, row.prod_info_desc)}><FontAwesomeIcon icon={faImages} /> Gallery</Dropdown.Item>
                      <Dropdown.Item onClick={() => self.deletRecord(row.prod_info_id, row.prod_info_desc)} disabled={security.DELETE_YN != 'Y' ? true:false}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                      <Dropdown.Item disabled={security.LANGUAGE_YN !== 'Y' ? true : false} onClick={() => self.editRecord(row.prod_info_id, row.prod_info_desc, 'ar')}>
                        <FontAwesomeIcon icon={faLanguage} /> Edit Language
                      </Dropdown.Item>
                      </DropdownButton>
                    </div>
                  );
                  	default:
                    	return (row[column]);
                }
              }
            }
            </ServerTable>

            <ProductInfoModal
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

            <PriceModal
              ref={this.priceModalRef}
              renderTable={this.renderTable}
              mode={this.state.mode}
              show={this.state.priceModalShow}
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
              security_access={security}
            />

            <GalleryModal
              ref={this.galleryModalRef}
              galleryrenderTable={this.renderTable}
              galleryModal={this.galleryModal}
              mode={this.state.mode}
              show={this.state.galleryModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
              security_access={security}
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
              security_access={security}
            />

            <StepsModal
              ref={this.stepsModalRef}
              renderTable={this.renderTable}
              mode={this.state.mode}
              show={this.state.stepModalShow}
              closeModal={this.modalClose}
              closeDelete={this.closedialog}
              errorMessage={this.errorThrough}
              security_access={security}
            />

          </div> 
        }/>
      </div>
    );
  }
}

export default ProductInfo;