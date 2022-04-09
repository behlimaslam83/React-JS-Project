import React from 'react';
import './SitesManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
class SitesManagementList extends React.Component {
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
	
	//componentWillMount(){ }
    // componentDidMount(){}
    // componentWillUnmount(){}

    //componentWillReceiveProps(props){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}

	render() {	
		let self = this;	
		const url = `admin/portal/site`;
		const columns = ['sr_no', 'site_desc', 'domain', 'theme', 'favicon_path', 'logo_path', 'active_yn', 'actions'];
		let propsObj = this.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Footer</Tooltip>}>
								<span className="d-inline-block">
									<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }>{<FontAwesomeIcon icon={faPlus} />}</button>
								</span>
							</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				site_desc: 'Site Title',
				domain: 'Domain Name',
				theme: 'Theme Name',
				favicon_path: 'Favicon',
				logo_path: 'Site Logo',
				active_yn: 'Status ?',
				
			},
			search_key: {			
				site_desc: 'Site Title',
				domain: 'Domain Name',
				theme: 'Theme Name'
			},
			sortable: ['site_desc', 'domain', 'theme'],
			columnsWidth: {sr_no: 5, site_desc: 30, domain: 30},
			columnsAlign: {sr_no: 'left', favicon_path: 'center', logo_path: 'center', actions: 'center'},
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
				<ServerTable columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
				{				
					function (row, column, index) {					 
						switch (column) {
							case 'sr_no':
								return (
									(index+1)+(PER_PAGE*((self.state.page)-1))
								);						
							case 'favicon_path':
								return (
									<img src={row.favicon_path} width="50" className="table-image" alt={row.site_desc} />
								);
							case 'logo_path':
								return (
									<img src={row.logo_path} width="50" className="table-image" alt={row.site_desc} />
								);	
							case 'active_yn':
								return (
									<div style={{textAlign: 'center'}}>
										<button className="btn btn-primary form-control-sm">{row.active_yn}</button>
									</div>
								);		
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editSite(row.site_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>										
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteSite(row.site_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>										
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

export default SitesManagementList;