import React from 'react';
import './HeaderManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChartLine, faTrash, faCog, faPlus, faLanguage } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
class HeaderManagementList extends React.Component {
    constructor(props){
        super(props);
		this.state = {
			page: 1,
			security:''
		};		
    }

	securityAccess = (param) => {
		this.setState({
			security: param
		});
	}

	render() {	  
		let self = this;
		const url = `admin/portal/header`;
		const columns = ['sr_no', 'header_desc', 'header_parent_desc', 'header_from_date', 'header_upto_date', 'header_active_yn', 'header_image_path', 'actions'];
		let propsObj = self.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Header</Tooltip>}>
		<span className="d-inline-block">
			<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }><FontAwesomeIcon icon={faPlus} /></button>
		</span>
		</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				header_desc: 'Header Title',
				header_parent_desc: 'Parent',
				header_from_date: 'From Date',
				header_upto_date: 'Upto Date',
				header_active_yn: 'Active YN',
				header_image_path: 'Image',
			},
			search_key: {			
				header_desc: 'Header Title',
				header_parent_desc: 'Parent',
				header_from_date: 'From Date',
				header_upto_date: 'Upto Date',
				header_active_yn: 'Active YN'
			},
			sortable: ['header_desc', 'header_parent_desc', 'header_from_date'],
			columnsWidth: {sr_no: 5, header_desc: 30, header_parent_desc: 30},
			columnsAlign: {sr_no: 'left', header_image_path: 'center', header_from_date: 'left', header_upto_date: 'left', actions: 'center'},
			requestParametersNames: {search_value: 'search_value', search_column: 'search_column', direction: 'order'},
			responseAdapter: function (resp_data) {
				self.setState({ page: resp_data.page });
				return {data: resp_data.result, total: resp_data.row_count}
			},
			texts: {
				//show: 'عرض'
				show: ''
			},
			search_lov: {
				pages:[]
			}
		};
		
		return (	
			<>
			<AccessSecurity accessecurity={this.securityAccess} />
				<ServerTable columns={columns} url={url} options={options} addme={$button} addme={$button} bordered hover updateUrl>
			{
				function (row, column, index) {
					switch (column) {
						case 'sr_no':
							return (
								(index+1)+(PER_PAGE*((self.state.page)-1))	
							);
						case 'header_parent_yn':
							return (
								<div style={{textAlign: 'center'}}>
									<button className="btn btn-primary form-control-sm">{row.header_parent_yn}</button>
								</div>
							);
						case 'header_active_yn':
							return (
								<div style={{textAlign: 'center'}}>
									<button className="btn btn-primary form-control-sm">{row.header_active_yn}</button>
								</div>
							);
						case 'header_image_path':
							return (
								<img src={row.header_image_path} width="50" className="table-image" alt={row.header_desc} />
							);						
						case 'actions':							
							return (								
								<div className="form-control-sm" style={{textAlign: 'center'}}>
									<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
										<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editHeader(row.header_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
										<Dropdown.Item disabled={self.state.security.SEO_YN !== 'Y' ? true : false}  onClick={() => propsObj.seoHeader(row.header_id)}><FontAwesomeIcon icon={faChartLine} /> SEO</Dropdown.Item>
										<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteHeader(row.header_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
										<Dropdown.Item disabled={self.state.security.LANGUAGE_YN !== 'Y' ? true : false} onClick={() => propsObj.editLanguageHeader(row.header_id,'ar')}><FontAwesomeIcon icon={faLanguage} /> Edit Language</Dropdown.Item>
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

export default HeaderManagementList;