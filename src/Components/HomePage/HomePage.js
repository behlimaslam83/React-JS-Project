import React, { Component } from 'react';
import './HomePage.scss';
import { Col, Row, Modal, Form, Button} from 'react-bootstrap';
import ApiDataService from '../../services/ApiDataService';
import Modalwindow from "../HomePage/Modalwindow";
import "react-datepicker/dist/react-datepicker.css";
import DataTableView from "../HomePage/Datatable";
import {ConfirmationDialog,SnapBarError} from "../../ConfirmationDialog";

import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SeoManagement from '../Seo/SeoManagement';
import Config from '../Config';
import { WindowPanel } from "../../WindowPanel";
import Select from 'react-select';
const querystring = require('querystring');
const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};
const apiUrl = `admin/portal/homepage`;
class HomePage extends Component {
  constructor(props){
    super(props);
    this._isMounted = true;
    this.state = {
      modalShow:false,
      mode: '',
      initialPage: 'page=1&limit=10',
      dataview :[],
	  seo: [],
      totaldata:null,
      snapopen: false,
      snapcolor: null,
      error:null,
      deletedialog:false,
      proceed:false,
      sysid:null,
      pageDrop: [],
      slugDrop: [],
      pagename:"",
      slugname: "",
      deletesysid:"",
      showmodal:false,
      onedup:false,
      manydup:false,
      duplicaption:'',
      checkbox:{
        onedup:'',
        manydup:'',
        page_name: '',
        slugurl: ''
      },
	  isShowSeo:false,
	  isAddEditSeo:false,
	  refSysId:'',
	  security:'',
      language:''
    };
  }

  setModalShow = () =>{
    if (this.state.pagename!==''){
      this.setState({
        modalShow: true,
        mode: 'IS',
        sysid: null,
        language: ''
      });
    }else{
      alert('Select page to create.');
    }
  }
  
  pageDropDown(){
    ApiDataService.getAll('admin/portal/homepage/page_lov','').then(response => {
      if (response.data.return_status !== "0") {
        this.errorThrough(response.data.error_message, "ERR");
      } else {
        let json = response.data.result;
        var objectArray = [];
        objectArray.push({ value: "", label: "Select Page" });
        for (var i = 0; i < json.length; i++) {
          objectArray.push({ value: json[i].id, label: json[i].desc });
        }
        this.setState({
          pageDrop: objectArray
        })
      }
    }).catch((error) => {
      this._isMounted = false;
      this.errorThrough(error, "ERR");
    });
  }

  componentDidMount(){
    if (this._isMounted){
      this.reactDatatable();
      this.pageDropDown();
    }
  } 
  componentWillUnmount() {
    this._isMounted = false;
  }
  pageName = (data) => {
    this.setState({
      pagename: data,
      slugname:""
    },()=>{
      this.reactDatatable();
      this.getSlugDrop(data);
    });
  }

  slugName=(data)=>{
    this.setState({
      slugname: data
    }, () => {
      this.reactDatatable();
    });
  }

  getSlugDrop=(param)=>{
    ApiDataService.getAll('admin/portal/homepage/slug_lov?page_name=' + param, '').then(response => {
      let json = response.data.result;
      var objectArray = [];
        objectArray.push({ value: "", label: "Select Slug" });
        for (var i = 0; i < json.length; i++) {
          objectArray.push({ value: json[i].slug_url, label: json[i].slug_url });
        }
        this.setState({
          slugDrop: objectArray
        })
    });
  }

  reactDatatable = (pagination = this.state.initialPage) =>{
    let pagename = this.state.pagename;
    let slugname = this.state.slugname;
    ApiDataService.getAll('admin/portal/homepage?page_name=' + pagename + '&hp_slug_url=' + slugname+'&', pagination).then(response => {
      if (response.data.return_status !== "0" && typeof response.data.return_status != 'undefined') {
        this.errorThrough(response.data.error_message, "ERR");
      } else {
        if (this._isMounted){
        this.setState({
          dataview: response.data
        });
      }
    }
    }).catch((error) => {
      this._isMounted = false;
      this.errorThrough(error,"ERR");
    });
  }

  parentModel = (id,param,desc=null) =>{
    if (param==='E'){
      this.setState({
        modalShow: true,
        mode:'UP',
        sysid: id,
        language: ''
      });
    } else if (param === 'DU') {
      this.setState({
        showmodal: true,
        deletesysid: id,
        duplicaption:desc,
        onedup:false,
        manydup:false,
        checkbox: {
          ...this.state.checkbox,
          page_name: ''
        }
      });
    } else if (param === 'LG') {
      this.setState({ sysid: id, language: param, modalShow: true });
    }else{
      this.setState({ deletedialog: true, deletesysid: id});
    }
  }
  proceedDelete= (params) =>{
    if(params){
      ApiDataService.delete('admin/portal/homepage/', this.state.deletesysid).then(response => {
        console.log(response, "rest");
        this.setState({ deletedialog: false });
        if (response.data.return_status !== "0") {
          if (response.data.error_message === 'Error') {
            this.errorThrough(response.data.result, "ERR-OBJ");
          } else {
            this.errorThrough(response.data.error_message, "ERR");
          }
        }else{
          this.reactDatatable();
        }
      }).catch((error)=>{
        this.errorThrough(error.message, "ERR");
      }); 
    }
  }
  closedialog = () => {
    this.setState({ deletedialog: false });
  }
  modalClose= () =>{
    this.setState({ sysid: null, modalShow: false, isAddEditSeo: false, refSysId:'', isShowSeo: false });
  }
  renderTable = (pagination) => {
    this.reactDatatable(pagination);
  }
  snapclose = () => {
    this.setState({ snapopen: false });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
 
  errorThrough = (error,argu) =>{
    console.log(error);
    var erroMessage='';
    if (argu === 'ERR-OBJ'){
      erroMessage = Object.keys(error).map(function (key) {
        return <ul key={key} className="mrgnone list-unstyled"><li>{error[key]}</li></ul>;
      });
    }else{
      erroMessage =  <ul className="mrgnone list-unstyled"><li>{error}</li></ul>;
    }
    var backColor = ((argu === 'ERR' || argu === 'ERR-OBJ') ? '#ff4c4ceb' : '#20bb20eb');
    this.setState({ snapopen: true, snapcolor: backColor});
    this.setState({ error: erroMessage });
  }
  confirmModal=()=>{
    this.setState({
      showmodal:false
    });
  }
  switchDub=(e,params)=>{
    let check = e.target.checked;
    let attribute = e.target.getAttribute('id');
    var value = '';
    if (params==='DUP_ONE'){
      if (check){
        this.setState({ onedup: false, manydup: true });
        value = attribute;
      }else{
        this.setState({ onedup: false, manydup: false });
        value = '';
      }
      this.setState({
        checkbox:{
          ...this.state.checkbox,
          onedup: value,
          manydup:'',
        }
      });
    }else{
      if (check) {
        this.setState({ manydup: false, onedup: true });
        value = attribute;
      }else{
        this.setState({ onedup: false, manydup: false });
        value = '';
      }
      this.setState({
        checkbox: {
          ...this.state.checkbox,
          onedup: '',
          manydup: value
        }
      });
    }
  }
  processDuplicate=()=>{
    let pageName = this.state.checkbox.page_name;
    let slugurl = this.state.checkbox.slugurl;
    let object = { 
      hp_id: this.state.deletesysid,
      page_name_while_duplicate: pageName,
      slug_url_while_duplicate: slugurl
    };
    console.log(object,this.state,"ORE STATE");
    if (this.state.checkbox.onedup === '' && this.state.checkbox.manydup === ''){
      alert('Atleast one should select');
      return false;
    }
    let level = (this.state.checkbox.onedup !== '' ? this.state.checkbox.onedup : this.state.checkbox.manydup !== '' ? this.state.checkbox.manydup : '');
    ApiDataService.post('admin/portal/homepage/duplicate/' + level, querystring.stringify(object)).then(response => {
      console.log(response, "rest");
      if (response.data.return_status !== "0") {
        if (response.data.error_message === 'Error') {
          this.errorThrough(response.data.result, "ERR-OBJ");
        } else {
          this.errorThrough(response.data.error_message, "ERR");
        }
      } else {
        this.setState({
          showmodal: false,
          deletesysid: ''
        });
        this.reactDatatable();
        this.errorThrough(response.data.error_message, "DONE");
      }
    }).catch((error) => {
      this.errorThrough(error.message, "ERR");
    });
  }

  pageFilter = async (e) => {
    await this.setState({
      checkbox: {
        ...this.state.checkbox,
        page_name: e.value
      }
    });
  }

  changInput = async (e) => {
    await this.setState({
      checkbox: {
        ...this.state.checkbox,
        slugurl: e.target.value
      }
    });
  }
  
    seoCategory = contentId => {		
		let $url = `${apiUrl}/seo/${contentId}/ref_edit`;
		ApiDataService.get($url)
		.then(res => {		
			//if(res.data.return_status==0){
				if (this._isMounted){
					this.setState({						
						seo: res.data,
						isAddEditSeo: true,						
						isShowSeo: true,
						refSysId:contentId
					});
				}
			//}else{
				//Config.createNotification('warning',res.data.error_message);
			//}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
	    });		
	}	

  render() {
	let popupTitle = 'Seo';
	let seoForm;
	let popupSize = '';	
	if(this.state.isAddEditSeo) {
	  seoForm = <SeoManagement seoData={this.state.seo} closeModal={this.modalClose} refSysId={this.state.refSysId} seoFor='homepage' />
	  popupTitle = 'Seo';
	  popupSize = 'lg';
	}
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
        <WindowPanel rawHtml= {
          <div className="windowContent">
          <Row>
            <Col>
                <DataTableView 
                childRow={this.parentModel} 
                renderTable={this.renderTable} 
                datajson={this.state.dataview} 
                callAdd={this.setModalShow}
                pageDrop={this.state.pageDrop}
                slugDrop={this.state.slugDrop}
                pageName={this.pageName}
                slugName={this.slugName}
				seoCategory={this.seoCategory}
                />
            </Col>
          </Row>
          <Row>
            <Col>
              <Modalwindow 
              renderTable={this.renderTable}  
              modaledit={this.state.modalData} 
              mode={this.state.mode}  
              show={this.state.modalShow} 
              sysid={this.state.sysid}
              closeModal={this.modalClose} 
              errorMessage={this.errorThrough}
              allState={this.state}
              />
            </Col>
          </Row>
			<Modal animation={false} size={popupSize} id="contentSeoModal" show={this.state.isShowSeo} onHide={this.modalClose}>
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
            <Modal animation={false} size="md" show={this.state.showmodal} onHide={this.confirmModal} >
              <Modal.Header closeButton className="">
                <Modal.Title id="modalTitle">
                  {this.state.duplicaption}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Page Name</Form.Label>
                    <div>
                      <Select
                        onChange={e => this.pageFilter(e)}
                        options={this.state.pageDrop}
                        className="custdropdwn"
                        styles={customStyles}
                      />
                    </div>  
                  </Form.Group>
                  <Form.Group>
                  <Form.Label>Slug Url</Form.Label>
                    <Form.Control type="text" onChange={e => this.changInput(e)} name="slug_url_while_duplicate" placeholder="Slug Url" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Check
                      type="switch"
                      id="ONE"
                      disabled = {this.state.onedup ? 'disabled' : ''}
                      label="Duplicate this particular one record."
                      onChange={(e) => this.switchDub(e,'DUP_ONE')}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Check
                      disabled={this.state.manydup ? 'disabled' : ''}
                      type="switch"
                      id="MANY"
                      label="Duplicate this hierarchy records."
                      onChange={(e)=>this.switchDub(e,'DUP_MANY')}
                    />
                  </Form.Group>
                  <Form.Group style={{ margin: "0px" }}>
                    <Button onClick={this.processDuplicate} className="float-right" size="sm">Process</Button>
                  </Form.Group>
                </Form>
              </Modal.Body>
            </Modal>
        </div>
        }/>
     </div>
    );
  }
}

export default HomePage;