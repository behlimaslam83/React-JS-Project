import React from 'react';
import './SiteStructureManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import ServerTable from '../../services/server-table';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCog, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
// const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
const apiUrl = `admin/portal/structure`;
class SiteStructureManagementList extends React.Component {
    constructor(props){
        super(props);
		this.state = {
			page: 1,
			pages:[],
			security:''
		};
    }	
	
	securityAccess = (param) => {
		this.setState({
			security: param
		});
	}
	
	componentWillMount(){ 
		let $url = `${apiUrl}/structure_page_lov_s`;		
		ApiDataService.get($url)
		.then(res => {	
			//alert(res.data.page.return_status)			
			if(res.data.page.return_status==="0"){
				let $pages = [];
				let $pageDate = [];
				$pages = res.data.page.result;			
				$pageDate.push({ value: "", label: "Select Page" });
				for (var i = 0; i < $pages.length;i++){
					if(this.state.security.USER_ROLE != 'TECHNICAL' && $pages[i].id == 'product_category_listing' || $pages[i].id == 'item_info_listing'){
						$pageDate.push({ value: $pages[i].id, label: $pages[i].desc});
					}else if(this.state.security.USER_ROLE == 'TECHNICAL'){
						$pageDate.push({ value: $pages[i].id, label: $pages[i].desc});

					}
				}			
				this.setState({pages: $pageDate});				
				//this.setState({pages: res.data.page.result});
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});
	}
    
	//componentDidMount(){}
    //componentWillUnmount(){}
    // componentWillReceiveProps(props){}
    // shouldComponentUpdate(){}
    //componentWillUpdate(){}
    //componentDidUpdate(){}

	render() {		
		let self = this;	
		const url = `admin/portal/structure`;
		const columns = ['sr_no', 'struc_desc', 'struc_section_desc', 'struc_compo_desc', 'struc_ordering', 'struc_active_yn', 'struc_from_date', 'struc_upto_date', 'actions'];
		let propsObj = self.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Site Structure</Tooltip>}>
								<span className="d-inline-block">
									<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }>{<FontAwesomeIcon icon={faPlus} />}</button>
								</span>
							</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				struc_desc: 'Structure Name',
				// struc_page_desc: 'Page',			
				struc_section_desc: 'Section',
				struc_compo_desc: 'Component',
				// struc_slug_url: 'Slug Url',
				struc_active_yn: 'Active?',
				struc_ordering: 'Ordering',
				struc_from_date: 'From Date',
				struc_upto_date: 'Upto Date',
				
			},
			search_key: {
				struc_desc: 'Structure Name',
				// struc_page_desc: 'Page',
				struc_section_desc: 'Section',
				struc_compo_desc: 'Component',
				// struc_slug_url: 'Slug',
				struc_ordering: 'Ordering',
				struc_from_date: 'From Date',
				struc_upto_date: 'Upto Date'
			},
			sortable: ['struc_desc', 'struc_page_desc', 'struc_section_desc', 'struc_from_date'],
			columnsWidth: {sr_no: 5, struc_desc: 30, struc_page_desc: 30},
			columnsAlign: {struc_desc: 'left', struc_active_yn: 'center', struc_from_date: 'left', struc_upto_date: 'left', actions: 'center'},
			requestParametersNames: {
								search_value: 'search_value', 
								search_column: 'search_column', 
								direction: 'order',
								page_search_column: 'struc_page_name',
								slug_search_column: 'struc_slug_url',
							},
			responseAdapter: function (resp_data) {
				//alert(resp_data.page);
				self.setState({ page: resp_data.page });
				return {data: resp_data.result, total: resp_data.row_count}
			},
			texts: {
				//show: 'عرض'
				show: ''
			},
			search_lov: {
				pages:this.state.pages
			}
		};
			
		return (
			<>
				<AccessSecurity accessecurity={this.securityAccess} />
				<ServerTable searchType={this.props.searchType} columns={columns} slugUrl='admin/portal/structure/slug_lov' url={url} options={options} addme={$button} bordered hover updateUrl>
				{
					function (row, column, index) {
						switch (column) {					
							case 'sr_no':
								return (
									(index+1)+(PER_PAGE*((self.state.page)-1))
								);
							case 'struc_active_yn':
								return (
									<div style={{textAlign: 'center'}}>
										<button className="btn btn-primary form-control-sm">{row.struc_active_yn}</button>
									</div>
								);						
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editSiteStructure(row.struc_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteSiteStructure(row.struc_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
											<Dropdown.Item onClick={() => propsObj.previewSiteStructure(row.struc_id,'section')}><FontAwesomeIcon icon={faEye} /> Preview Section</Dropdown.Item>
											<Dropdown.Item onClick={() => propsObj.previewSiteStructure(row.struc_id,'page')}><FontAwesomeIcon icon={faEye} /> Preview Page</Dropdown.Item>
										</DropdownButton>
										
									</div>
								);
							default:
								return (row[column]);
						}
					}
				}
				</ServerTable>	
			</>
		);	
	}
}

export default SiteStructureManagementList;