import React from 'react';
import './UserManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCog, faPlus, faTasks } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
class UserManagementList extends React.Component {
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
		
	// componentWillMount(){}
    // componentDidMount(){}
    // componentWillUnmount(){}

    //componentWillReceiveProps(props){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}
  
	render() {	  
		let self = this;
		const url = `admin/portal/user`;
		const columns = ['sr_no', 'user_id', 'user_desc', 'user_locn_code', 'user_personal_code', 'user_email', 'user_office_phone', 'user_role', 'user_from_date', 'user_upto_date', 'user_image_path', 'actions'];
		let propsObj = self.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add User</Tooltip>}>
								<span className="d-inline-block">
									<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }>{<FontAwesomeIcon icon={faPlus} />}</button>
								</span>
							</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				user_id: 'User ID',
				user_desc: 'User Title',
				user_locn_code: 'Location',
				user_personal_code: 'Personal Code',
				user_email: 'Email',
				user_office_phone: 'Phone',
				user_role: 'User Role',
				user_from_date: 'From Date',
				user_upto_date: 'Upto Date',
				user_image_path: 'Image',
				
			},
			search_key: {	
				user_id: 'User ID',
				user_desc: 'User Title',
				user_locn_code: 'Location',
				user_personal_code: 'Personal Code',
				user_email: 'Email',
				user_office_phone: 'Phone',
				user_role: 'User Role',
				user_from_date: 'From Date',
				user_upto_date: 'Upto Date'
			},
			sortable: ['user_id', 'user_desc', 'user_locn_code', 'user_from_date'],
			columnsWidth: {sr_no: 5, user_desc: 30, user_email: 30},
			columnsAlign: {sr_no: 'left', user_image_path: 'center', user_from_date: 'left', user_upto_date: 'left', actions: 'center'},
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
							case 'user_role':
								return (
									<div style={{textAlign: 'center'}}>
										<button className="btn btn-primary form-control-sm">{row.user_role}</button>
									</div>
								);
							case 'user_image_path':
								return (
									<img src={row.user_image} width="50" className="table-image" alt={row.user_desc} />
								);						
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editUser(row.user_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteUser(row.user_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
											<Dropdown.Item onClick={() => propsObj.responsbilityUser(row.user_id)}><FontAwesomeIcon icon={faTasks} /> Responsbility</Dropdown.Item>
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

export default UserManagementList;