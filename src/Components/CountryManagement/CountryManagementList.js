import React from 'react';
import './CountryManagement.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChartLine, faTrash, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
class CountryManagementList extends React.Component {
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
	
	// componentWillMount(){ }
    // componentDidMount(){}
    // componentWillUnmount(){}

    //componentWillReceiveProps(props){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}

	render() {	
		let self = this;	
		const url = `admin/portal/country`;
		const columns = ['sr_no', 'country_iso', 'country_desc', 'country_ccy_code', 'country_ccy_symbol', 'country_ccy_exch_rate', 'country_from_date', 'country_upto_date', 'country_image_path', 'actions'];
		let propsObj = self.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Country</Tooltip>}>
							<span className="d-inline-block">
								<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }>{<FontAwesomeIcon icon={faPlus} />}</button>
							</span>
						</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				country_iso: 'ISO',
				country_desc: 'Country Description',			
				country_ccy_code: 'CCY Code',
				country_ccy_symbol: 'CCY Symbol',
				country_ccy_exch_rate: 'Exchange Rate',
				country_from_date: 'From Date',
				country_upto_date: 'Upto Date',
				country_image_path: 'Image',
				
			},
			search_key: {			
				country_iso: 'ISO',
				country_desc: 'Country Description',			
				country_ccy_code: 'CCY Code',
				country_ccy_symbol: 'CCY Symbol',
				country_ccy_exch_rate: 'Exchange Rate',
				country_from_date: 'From Date',
				country_upto_date: 'Upto Date'
			},		
			sortable: ['country_desc', 'country_iso', 'country_ccy_code', 'country_from_date'],
			columnsWidth: {sr_no: 5, country_desc: 30, country_iso: 30},
			columnsAlign: {country_iso: 'left', country_image_path: 'center', country_from_date: 'left', country_upto_date: 'left', actions: 'center'},
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
							case 'country_image_path':
								return (
									<img src={row.country_image_path} width="50" className="table-image" alt="" />
								);						
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>																
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editCountry(row.country_iso)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.SEO_YN !== 'Y' ? true : false} onClick={() => propsObj.seoCountry(row.country_iso)}><FontAwesomeIcon icon={faChartLine} /> SEO</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteCountry(row.country_iso)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
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

export default CountryManagementList;