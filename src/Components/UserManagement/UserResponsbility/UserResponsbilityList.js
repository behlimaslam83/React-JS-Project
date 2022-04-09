import React from 'react';
import './../UserManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ServerTable from '../../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../../AccessSecurity';
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
class UserResponsbilityList extends React.Component {
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
		let propsObj = self.props;
		
		//console.log('Portal data - ',propsObj);
		
		const url = `admin/portal/user/userresp?usrs_user_id=${propsObj.usrsUserId}`;
		const columns = ['sr_no', 'usrs_user_id', 'usrs_resp_code', 'usrs_desc', 'usrs_from_date', 'usrs_upto_date', 'usrs_active_yn', 'actions'];
		
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">User Responsbility</Tooltip>}>
								<span className="d-inline-block">
									<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={() => propsObj.addUserResp() }>{<FontAwesomeIcon icon={faPlus} />}</button>
								</span>
							</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				usrs_user_id: 'User ID',
				usrs_resp_code: 'Responsbility Code',
				usrs_desc: 'Description',				
				usrs_from_date: 'From Date',
				usrs_upto_date: 'Upto Date',
				usrs_active_yn: 'Active?',
				
			},
			search_key: {	
				usrs_user_id: 'User ID',
				usrs_resp_code: 'Responsbility Code',
				usrs_desc: 'Description',
				usrs_from_date: 'From Date',
				usrs_upto_date: 'Upto Date'
			},
			sortable: ['usrs_user_id', 'usrs_resp_code', 'usrs_desc', 'usrs_from_date'],
			columnsWidth: {sr_no: 5, usrs_desc: 30},
			columnsAlign: {sr_no: 'left', usrs_from_date: 'left', usrs_upto_date: 'left', actions: 'center'},
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
							case 'usrs_active_yn':
								return (
									<div style={{textAlign: 'center'}}>
										<button className="btn btn-primary form-control-sm">{row.usrs_active_yn}</button>
									</div>
								);												
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editUser(row.usrs_user_id,row.usrs_resp_code)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteUser(row.usrs_user_id,row.usrs_resp_code)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>										
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

export default UserResponsbilityList;