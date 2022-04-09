import React from 'react';
import './Category.scss';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
//import { LANG_CODE, USER_ID, SITE_ID, AUTH_TOKEN, CHANNEL_ID } from '../Redux-Config/Action/ActionType';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChartLine, faTrash, faCog, faPlus, faLanguage } from '@fortawesome/free-solid-svg-icons';
import AccessSecurity from '../../AccessSecurity';
const PER_PAGE = process.env.REACT_APP_PER_PAGE;
//const SERVER_URL = process.env.REACT_APP_SERVER_URL;
//const AVATAR_URL = process.env.REACT_APP_AVATAR_URL;
class CategoryList extends React.Component {
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

    // componentWillReceiveProps(props){}
    // shouldComponentUpdate(){}
    // componentWillUpdate(){}
    // componentDidUpdate(){}

	render() {	
		let self = this;	
		const url = `admin/portal/category`;
		const columns = ['sr_no', 'cate_desc', 'cate_parent_yn', 'cate_parent_desc', 'cate_from_date', 'cate_upto_date', 'cate_image_path', 'actions'];
		let propsObj = self.props;
		let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Category</Tooltip>}>
							<span className="d-inline-block">
								<button disabled={self.state.security.INSERT_YN !== 'Y' ? true : false} className="btn btn-primary form-control-sm" onClick={ propsObj.openModal }>{<FontAwesomeIcon icon={faPlus} />}</button>
							</span>
						</OverlayTrigger>);
		const options = {
			perPage: PER_PAGE,
			headings: {
				sr_no: '#', 
				cate_desc: 'Category Title',
				cate_parent_desc: 'Parent',
				cate_parent_yn: 'Parent Y/N',
				cate_from_date: 'From Date',
				cate_upto_date: 'Upto Date',
				cate_image_path: 'Image',
			},
			search_key: {
				cate_desc: 'Category Title',
				cate_parent_desc: 'Parent',
				cate_parent_yn: 'Parent Y/N',
				cate_from_date: 'From Date',
				cate_upto_date: 'Upto Date'
			},
			sortable: ['cate_desc', 'cate_parent_desc', 'cate_parent_yn', 'cate_from_date'],
			columnsWidth: { sr_no: 5, cate_desc: 30, cate_parent_desc: 30},
			columnsAlign: {sr_no: 'left', cate_desc: 'left', cate_parent_desc: 'left', cate_image_path: 'center', cate_from_date: 'center', cate_upto_date: 'center', actions: 'center'},
			requestParametersNames: {search_value: 'search_value', search_column: 'search_column', direction: 'order'},
			responseAdapter: function (resp_data) {
				//console.log('resp_data',resp_data.page);
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
							case 'cate_parent_yn':
								return (
									<div style={{textAlign: 'center'}}>								
										<button className="btn btn-primary form-control-sm">{row.cate_parent_yn}</button>
									</div>
								);
							case 'cate_image_path':
								return (
									<img src={row.cate_image_path} width="50" className="table-image" alt={row.cate_desc}/>
								);							
							case 'actions':							
								return (								
									<div className="form-control-sm" style={{textAlign: 'center'}}>
										<DropdownButton id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
											<Dropdown.Item disabled={self.state.security.UPDATE_YN !== 'Y' ? true : false} onClick={() => propsObj.editCategory(row.cate_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.SEO_YN !== 'Y' ? true : false} onClick={() => propsObj.seoCategory(row.cate_id)}><FontAwesomeIcon icon={faChartLine} /> SEO</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.DELETE_YN !== 'Y' ? true : false} onClick={() => propsObj.deleteCategory(row.cate_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
											<Dropdown.Item disabled={self.state.security.LANGUAGE_YN !== 'Y' ? true : false} onClick={() => propsObj.editLanguageCategory(row.cate_id,'ar')}><FontAwesomeIcon icon={faLanguage} /> Edit Language</Dropdown.Item>
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

export default CategoryList;