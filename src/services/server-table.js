import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import Config from '../Components/Config'
import ApiDataService from '../services/ApiDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
const customStyles = {
  control: base => ({
    ...base,
    height: 31,
    minHeight: 31,
	width:200
  })
};
class ServerTable extends Component {
    constructor(props) {
        super(props);
		console.log('PageList-',this.props.pageList);
        if (this.props.columns === undefined || this.props.url === undefined) {
            throw new Error("The prop 'columns' and 'url' is required.");
        }

        let default_texts = Object.assign(ServerTable.defaultProps.options.texts, {});
        let default_icons = Object.assign(ServerTable.defaultProps.options.icons, {});
        let default_parameters_names = Object.assign(ServerTable.defaultProps.options.requestParametersNames, {});
		
		let $search_key = [];
		let $addon_search_key = [];
		let $page_search_key = [];
		let $slug_search_key = [];
		$search_key = ServerTable.defaultProps.options.search_key;
		$addon_search_key = ServerTable.defaultProps.options.addon_search_key;		
		$page_search_key = ServerTable.defaultProps.options.page_search_key;		
		$slug_search_key = ServerTable.defaultProps.options.slug_search_key;		
				
        this.state = {
            options: Object.assign(ServerTable.defaultProps.options, this.props.options),
            requestData: {
                search_value: '',
				search_column: '',
				addon_search_column: '',
				page_search_column: '',
				slug_search_column: '',
                limit: 10,
                page: 1,
                orderBy: '',
                direction: 0,
            },
            data: [],
			slugs: [], 
            isLoading: true,
			search_key: $search_key,
            addon_search_key: $addon_search_key,			
			page_search_column: $page_search_key,
			slug_search_column: $slug_search_key,			
            addonList : {},
			select_page_name: '',
			//searchLov: $searchLov,
            childshowhide: ''
        };
        this.state.requestData.limit = this.state.options.perPage;
        this.state.options.texts = Object.assign(default_texts, this.props.options.texts);
        this.state.options.icons = Object.assign(default_icons, this.props.options.icons);
        this.state.options.requestParametersNames = Object.assign(default_parameters_names, this.props.options.requestParametersNames);
		  
        this.handlePerPageChange = this.handlePerPageChange.bind(this);
		this.handlePagesSlugChange = this.handlePagesSlugChange.bind(this);
		//this.handleSearchClick = this.handleSearchClick.bind(this);
		
        this.table_search_column = React.createRef();
		this.table_search_input = React.createRef();
        this.table_addon_search_column = React.createRef();		
		this.table_page_name = React.createRef();
		this.table_slug_name = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.url !== this.props.url) {
            this.setState({isLoading: true}, () => {
                this.handleFetchData();
            });
        }
        return true;
    }

    componentDidMount() {		
        this.handleFetchData();
		//this.renderPagination();
        if (this.props.addon){
			//alert('inside')
            this.addonListDown();
        }
    }

    componentDidUpdate(){		
        console.log(this.props.renderView, "TESTE");
        if (this.props.renderView){
            this.handleFetchData();
			//this.renderPagination();
        }
    }


    addonListDown(){
        const lov_url = this.props.lov_url;

        ApiDataService.getAll(lov_url,'').then(response => {
            if(response.data.result){
                let json = response.data.result;
                var objectArray = [];
                objectArray.push({ value: "", label: "Select" });
                for (var i = 0; i < json.length; i++) {
                objectArray.push({ value: json[i].id, label: json[i].desc });
                }
                this.setState({
                addonList: objectArray
                })
            }
        }).catch((error) => {
          this._isMounted = false;
          this.errorThrough(error, "ERR");
        });
      }




      



    tableClass() {
        let classes = 'table cust-table';
        classes += this.props.hover ? 'table-hover ' : '';
        classes += this.props.bordered ? 'table-bordered ' : '';
        classes += this.props.condensed ? 'table-condensed ' : '';
        classes += this.props.striped ? 'table-striped ' : '';
        return classes;
    }

    renderColumns() {
        const columns = this.props.columns.slice();
        const headings = this.state.options.headings;
        const options = this.state.options;
        const columns_width = this.state.options.columnsWidth;
        const self = this;
        const childrowDefine = this.state.options.columnsAlign;
        return columns.map(function (column, inx) {
            if (childrowDefine[column] !== 'hideColumn'){
            return(<th key={column}
                className={'table-' + column + '-th ' + (options.sortable.includes(column) ? ' table-sort-th ' : '') +
                (options.columnsAlign.hasOwnProperty(column) ? ' text-' + options.columnsAlign[column] : '')}
                style={{
                    maxWidth: columns_width.hasOwnProperty(column) ?
                        Number.isInteger(columns_width[column]) ?
                            columns_width[column] + '%' :
                            columns_width[column] : ''
                }}
                onClick={() => self.handleSortColumnClick(column)}>
                <span>{
                    headings.hasOwnProperty(column) ? headings[column] : column === 'actions' ? self.props.addme : column.replace(/^\w/, c => c.toUpperCase())
                }</span>
                { options.sortable.includes(column) &&
                <div className="sortOrder">
                    <svg className="sortUp">
                        <path style={{ fill: (self.state.requestData.orderBy !== column ? '#b0b0b0' : (self.state.requestData.direction === 1 ? '#b0b0b0' : 'blue')) }} d="M3.5 3 L7 10 Q3.5 10 0 10z" />
                    </svg>
                    <svg className="sortDown">
                        <path style={{ fill: (self.state.requestData.orderBy !== column ? '#b0b0b0' : (self.state.requestData.direction === 1 ? 'blue' : '#b0b0b0')) }} d="M3.5 7 L7 0 Q3.15 0 0 0z" />
                    </svg>
                </div>
                }
            </th>)
            }
        });
    }

    expandChild = (e, inx)=>{
        let current = this.state.childshowhide;
        if (inx === current) {
            inx = '';
        }
        this.setState({
            childshowhide: inx
        });
    }
    checkChildButton=(defineRow)=>{
        let returnval = false;
        Object.values(defineRow).map(function(data,inx){
            if (data ==='hideColumn'){
                returnval = true;
            }
        });
        return returnval;
    }
    renderData() {
        const data = this.state.data.slice();
        const columns = this.props.columns.slice();
        const has_children = this.props.children !== undefined;
        const childrowDefine = this.state.options.columnsAlign;
        let showChildButton = this.checkChildButton(childrowDefine);
        let self = this;
		let bgClass = '';
        return data.map(function (row, row_index) {
            row.index = row_index;
			if(row.record_level==="1"){
				bgClass = '';
			}else if(row.record_level==="2"){
				bgClass = 'tow_level';
			}else if(row.record_level==="3"){
				bgClass = 'three_level';
			}else if(row.record_level==="3"){
				bgClass = 'four_level';
			}
            let parentRow=[];
            let childRow = [];
            columns.map((column, index) => {
                let spantag = '';
                if (childrowDefine[column] !=='hideColumn'){
                    if (index === 0 && showChildButton) {
                        spantag = (<span onClick={(e) => self.expandChild(e, row_index)} className="childExpand"><FontAwesomeIcon icon={self.state.childshowhide === row_index ? faMinusSquare : faPlusSquare} /></span>);
                    }
                    parentRow.push(<td key={column + index} className={'table-' + column + '-td'}>{has_children ? [spantag, self.props.children(row, column, row_index)] : [spantag,row[column]]}</td>);
                }else{
                    childRow.push(<li className="list-group-item" key={column + index}>{has_children ? column + ' : ' + self.props.children(row, column, row_index) : column + ' : ' +row[column]}</li>);
                }
                
            });
            let parentTrRow = (<tr className={`bgClass`} key={row_index}>{parentRow}</tr>);
            let childTrRow = (<tr className={`bgClass childClassView ${self.state.childshowhide === row_index ? '' : ' childshowhide'}`} key={row_index + 1}><td><ul className="list-group list-group-flush">{childRow}</ul></td></tr>);
            return ([parentTrRow, childTrRow]);
        });
    }
	
    renderPagination() {
        const options = this.state.options;
        let pagination = [];
        pagination.push(
            <li key="first"
                className={'page-item ' + (options.currentPage === 1 || options.currentPage === 0 ? 'disabled' : '')}>
                <button className="page-link" onClick={() => this.handlePageChange(1)}>&laquo;</button>
            </li>
        );
		
		
		/*const startIndex = currentPage * dataLimit - dataLimit;
		const endIndex = startIndex + dataLimit;
		return data.slice(startIndex, endIndex);*/
		
		//const startIndex = (this.state.options.currentPage * this.state.options.perPage) - this.state.options.perPage;
		//const endIndex = Number(startIndex) + Number(this.state.options.perPage);
		//return data.slice(startIndex, endIndex);
		
		/*
		var startIndex = (Number(this.state.options.currentPage) - 1) * Number(this.state.options.perPage);

        var endIndex = Math.min(Number(startIndex) + Number(this.state.options.perPage) - 1, Number(options.total) - 1);
		
		const data = this.state.data.slice(startIndex, endIndex);
		
		console.log(startIndex,endIndex,' - This is data - ',data);
		*/
		
		
		
		
		 // calculate total pages
		let totalPages = options.lastPage;
		let currentPage = this.state.options.currentPage;
		 
		//let totalItems = Number(this.state.options.total);
		//let pageSize = Number(this.state.options.perPage); 
		let maxPages = Number(this.state.options.perPage);
		
		// ensure current page isn't out of range
		if (currentPage < 1) {
			currentPage = 1;
		} else if (currentPage > totalPages) {
			currentPage = totalPages;
		}

		let startPage: number, endPage: number;
		if (totalPages <= maxPages) {
			// total pages less than max so show all pages
			startPage = 1;
			endPage = totalPages;
		} else {
			// total pages more than max so calculate start and end pages
			let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
			let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
			if (currentPage <= maxPagesBeforeCurrentPage) {
				// current page near the start
				startPage = 1;
				endPage = maxPages;
			} else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
				// current page near the end
				startPage = totalPages - maxPages + 1;
				endPage = totalPages;
			} else {
				// current page somewhere in the middle
				startPage = currentPage - maxPagesBeforeCurrentPage;
				endPage = currentPage + maxPagesAfterCurrentPage;
			}
		}

		// calculate start and end item indexes
		//let startIndex = (currentPage - 1) * pageSize;
		//let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

		// create an array of pages to ng-repeat in the pager control
		let data = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

		// return object with all pager properties required by the view
		
		
		
		//console.log('pages - ',data);				
		//alert(options.lastPage+'   ---   '+options.currentPage);
		
        for (let i = 0; i <= (data.length)-1; i++) {
		// for (let i = 1; i <= options.lastPage; i++) {
            /*pagination.push(
                <li key={i} className={'page-item ' + (options.currentPage === i ? 'active' : '')}>
                    <button className="page-link" onClick={() => this.handlePageChange(i)}>{i}</button>
                </li>
            );*/
			
			//if(i<=data[i] || data[i]){
				
			//}
			
			pagination.push(
                <li key={data[i]} className={'page-item ' + (options.currentPage === data[i] ? 'active' : '')}>
                    <button className="page-link" onClick={() => this.handlePageChange(data[i])}>{data[i]}</button>
                </li>
            );
        }
		
        pagination.push(
            <li key="last" className={'page-item ' + (options.currentPage === options.lastPage ? 'disabled' : '')}>
                <button className="page-link" onClick={() => this.handlePageChange(options.lastPage)}>&raquo;</button>
            </li>
        );

        return pagination;
    }

    handleSortColumnClick(column) {
        if (this.state.options.sortable.includes(column)) {
            const request_data = this.state.requestData;

            if (request_data.orderBy === column) {
                request_data.direction = request_data.direction === 1 ? 0 : 1;
            } else {
                request_data.orderBy = column;
                request_data.direction = 1;
            }

            this.setState({requestData: request_data, isLoading: true}, () => {
                this.handleFetchData();
            });
        }
    }

    refreshData() {
        this.setState({isLoading: true}, () => {
            this.handleFetchData();
        });
    }

    mapRequestData() {
        let parametersNames = this.state.options.requestParametersNames;
        let directionValues = Object.assign(this.props.options.orderDirectionValues || {}, ServerTable.defaultProps.options.orderDirectionValues);
        let requestData = this.state.requestData;		
		//console.log(directionValues.ascending,"GOOGLE CHORM");
		//alert(requestData.page_search_column);
		
		//console.log('parametersNames',parametersNames);
		//console.log('requestData - ',requestData);
		
	   return {
            [parametersNames.search_value]: requestData.search_value,
			[parametersNames.search_column]: requestData.search_column,
			[parametersNames.addon_search_column]: requestData.addon_search_column,
			[parametersNames.page_search_column]: (requestData.page_search_column)?requestData.page_search_column:'',
			[parametersNames.slug_search_column]: (requestData.slug_search_column)?requestData.slug_search_column:'',
            [parametersNames.limit]: requestData.limit,
            [parametersNames.page]: requestData.page,
            [parametersNames.orderBy]: requestData.orderBy,
            [parametersNames.direction]: requestData.direction === 1 ? directionValues.ascending:directionValues.descending,
		};
    }

    handleFetchData() {
        let url = this.props.url;
        let options = Object.assign({}, this.state.options);
        let requestData = Object.assign({}, this.state.requestData);
        let self = this;
        const urlParams = new URLSearchParams(this.mapRequestData());
        //let baseUrl = urlParams.toString();		
		//alert(url.includes('?'))
		url = (url.includes('?')===true)?url + '&':url + '?';	
		ApiDataService.getAll(url,urlParams.toString())		
            .then(function (response) {
                //console.log(response,"COMMON SERVICE");
                let response_data = response.data;
				response_data['page'] = requestData.page;
                //console.log('response_data-',response_data);
				if(response_data.return_status==="0"){				
					let out_adapter = self.state.options.responseAdapter(response_data);
					if (out_adapter === undefined || !out_adapter ||
						typeof out_adapter !== 'object' || out_adapter.constructor !== Object ||
						!out_adapter.hasOwnProperty('data') || !out_adapter.hasOwnProperty('total')) {
						throw new Error("You must return 'object' contains 'data' and 'total' attributes");
					} else if (out_adapter.data === undefined || out_adapter.total === undefined) {
						throw new Error("Please check from returned data or your 'responseAdapter'. \n response must have 'data' and 'total' attributes.");
					}

					options.total = out_adapter.total;
					if (out_adapter.total === 0) {
						options.currentPage = 0;
						options.lastPage = 0;
						options.from = 0;
						options.to = 0;
					} else {
						options.currentPage = requestData.page;
						options.lastPage = Math.ceil(out_adapter.total / requestData.limit);
						options.from = requestData.limit * (requestData.page - 1) + 1;
						options.to = options.lastPage === options.currentPage ? options.total : requestData.limit * (requestData.page);
					}
					self.setState({data: out_adapter.data, options: options, isLoading: false});
				}else{
					if(response_data.result.search_value){ Config.createNotification('warning',response_data.result.search_value); }
					if(response_data.result.search_column){ Config.createNotification('warning',response_data.result.search_column); }
					if(response_data.result.addon_search_column){ Config.createNotification('warning',response_data.result.addon_search_column); }
					if(response_data.result.page_search_column){ Config.createNotification('warning',response_data.result.page_search_column); }
					if(response_data.result.slug_search_column){ Config.createNotification('warning',response_data.result.slug_search_column); }
				}
			}).catch(function(error){			
				if(error){ Config.createNotification('error',error); }
			});
    }

    handlePerPageChange(event) {
        const {value} = event.target;
        let options = Object.assign({}, this.state.options);
        let requestData = Object.assign({}, this.state.requestData);

        options.perPage = value;
        requestData.limit = event.target.value;
        requestData.page = 1;

        this.setState({requestData: requestData, options: options, isLoading: true}, () => {
            this.handleFetchData();
        });
    }
	
	handlePagesSlugChange(event) {
		//alert(this.props.slugUrl)
        let $url = `${this.props.slugUrl}?page_name=${event.value}`;		
		ApiDataService.get($url)
		.then(res => {						
			if(res.data.return_status==="0"){								
				this.setState({
					slugs: res.data.result,
					select_page_name: event.value
				});				
				this.handleSearchClick();
			}else{
				if(res.data.error_message){ Config.createNotification('error',res.data.error_message); }
			}
		}).catch(function(error){			
			if(error){ Config.createNotification('error',error); }
		});
    }

    handlePageChange(page) {
        let requestData = Object.assign({}, this.state.requestData);
        requestData.page = page;

        this.setState({requestData: requestData, isLoading: true}, () => {
            this.handleFetchData();
        });
    }
			
    handleSearchClick() {
       // let search_value = this.table_search_input.current.value;
        let requestData = Object.assign({}, this.state.requestData);
        requestData.search_value = this.table_search_input.current.value;
		requestData.search_column = this.table_search_column.current.value;
		
		//alert(this.table_page_name.current.value)
		
        if(this.state.addonList.length > 1){
		    requestData.addon_search_column = this.table_addon_search_column.current.value;
        }
		if(this.props.options.search_lov.pages.length > 1){
			//alert(this.table_page_name.current.value)
		    requestData.page_search_column = this.state.select_page_name;//this.table_page_name.current.value;			
			requestData.slug_search_column = this.table_slug_name.current.value;
        }
        requestData.page = 1;

        this.setState({requestData: requestData, isLoading: true}, () => {
            this.handleFetchData();
        });
    }

    render() {
		let select_page_name = this.state.select_page_name;
        return (
            <div className="card react-strap-table custcard">
                {
                    (this.props.perPage || this.props.search) &&

                    <div className="card-header text-center">
                        {this.props.perPage &&
                            <div className="float-left">
                                <span>{this.state.options.texts.show}</span>
                                <label>
                                    <select className="form-control form-control-sm" onChange={this.handlePerPageChange}>
                                        {this.state.options.perPageValues.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </select>
                                </label>
                                <span> {this.state.options.texts.entries}</span>
                            </div>
                        }
                        {this.state.isLoading && (this.state.options.loading)}

                        {this.props.search &&
                            <div className="form-group- float-right">
								<div className="mb-0 input-group">
                                    {(this.state.addonList.length > 1) &&
                                        <div className="input-group-prepend" style={{marginRight: '15px'}}>
                                            <select className="custom-select custom-select-sm" ref={this.table_addon_search_column} onChange={() => this.handleSearchClick()}>
                                                {Object.entries(this.state.addonList).map(row => (
                                                    <option key={row[1].value} value={row[1].value}>{row[1].label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    }
                                    {(this.props.addModal) &&
                                       this.props.addModal
                                    }

									
									{this.props.options.search_lov.pages.length>0 && 
										<div className="input-group-prepend">
										{/*
											<select className="custom-select custom-select-sm" ref={this.table_page_name} onChange={this.handlePagesSlugChange}>
												<option key="" value="">Select Page</option>
												{this.props.options.search_lov.pages.map(row => (
													<option key={row.id} value={row.id}>{row.desc}</option>
												))}
											</select>
										*/}	
											<Select
												value={this.props.options.search_lov.pages.filter(function (option) {
												  return option.value === select_page_name;
												})}
												onChange={this.handlePagesSlugChange}
												options={this.props.options.search_lov.pages}
												className="custdropdwn"
												ref={this.table_page_name}
												styles={customStyles}
											/>
										
										
											<select className="custom-select custom-select-sm" ref={this.table_slug_name}  onChange={this.handleSearchClick.bind(this)}>
												<option key="" value="">Select Slug</option>
												{this.state.slugs.map(row => (
													<option key={row.slug_url} value={row.slug_url}>{row.slug_url}</option>
												))}
											</select>
										</div>
										
									}
									
                                    <div className="input-group-prepend">
										<select className="custom-select custom-select-sm" ref={this.table_search_column}>
											{Object.entries(this.state.options.search_key).map(row => (
												<option key={row[0]} value={row[0]}>{row[1]}</option>
											))}
										</select>
									</div>
									<input type="text" className="form-control form-control-sm" 
										   placeholder={this.state.options.texts.search} ref={this.table_search_input} 
										   onKeyUp={() => this.handleSearchClick()}/>
									<div className="input-group-append">
										<button id="btn-id" onClick={() => this.handleSearchClick()} className="btn btn-primary form-control form-control-sm"  style={{fontSize:'0.9rem'}}><FontAwesomeIcon icon={faFilter} /></button >
									</div>
								</div>
							</div>
                        }
                    </div>
                }
                <div className="card-body">
                    <div className="table-responsive" style={{maxHeight: this.props.options.maxHeightTable}}>
                        <table className={this.tableClass()}>
                            <thead>
                                <tr className="custom-header-style">
									{this.renderColumns()}
								</tr>
                            </thead>
                            <tbody>
                            {
                                this.state.options.total > 0 ?
                                    this.renderData() :
                                    <tr className="text-center">
                                        <td colSpan={this.props.columns.length}>{this.state.options.texts.empty}</td>
                                    </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer clearfix">
				{
					this.props.pagination ?
						<div className="float-left">
							{this.state.options.texts.showing + ' ' + this.state.options.from + ' ' + this.state.options.texts.to + ' ' +
							this.state.options.to + ' ' + this.state.options.texts.of + ' ' + this.state.options.total +
							' ' + this.state.options.texts.entries}
						</div> :
						<div className="float-left">
							{
								this.state.options.total + ' ' + this.state.options.texts.entries
							}
						</div>
				}
				{
					this.props.pagination &&
					<ul className="pagination m-0 float-right">
						{this.renderPagination()}
					</ul>
				}
                </div>
            </div>
        );
    }
}

ServerTable.defaultProps = {
    options: {
        headings: {},
        sortable: [],
        columnsWidth: {},
        columnsAlign: {},
        initialPage: 1,
        perPage: 10,
        perPageValues: [10, 20, 25, 100],
        icons: {
            sortBase: 'fa fa-sort',
            sortUp: 'fa fa-sort-amount-up',
            sortDown: 'fa fa-sort-amount-down',
            search: 'fa fa-search'
        },
        texts: {
            show: 'Show',
            entries: 'entries',
            showing: 'Showing',
            to: 'to',
            of: 'of',
            search: 'Search',
            empty: 'Data not found.'
        },
        requestParametersNames: {
            search_value: 'search_value',
			search_column: 'search_column',
			addon_search_column: 'addon_search_column',
			page_search_column: 'page_search_column',
			slug_search_column: 'slug_search_column',
            limit: 'limit',
            page: 'page',
            orderBy: 'orderBy',
            direction: 'direction',
        },
        orderDirectionValues: {
            ascending: 'asc',
            descending: 'desc',
        },
        total: 10,
        currentPage: 1,
        lastPage: 1,
        from: 1,
        to: 1,
        loading: (
            <div style={{fontSize: 14, display: "initial"}}><span style={{fontSize: 18}}
                                                                  className="fa fa-spinner fa-spin"/> Loading...
            </div>),
        responseAdapter: function (resp_data) {
            return {data: resp_data.data, total: resp_data.total}
        },
        maxHeightTable: 'unset',
		search_key: {},
		addon_search_key: {},
		search_lov:{}
    },
    perPage: true,
    search: true,
    pagination: true,
    updateUrl: false,
};

ServerTable.propTypes = {
    columns: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    hover: PropTypes.bool,
    bordered: PropTypes.bool,
    condensed: PropTypes.bool,
    striped: PropTypes.bool,
    perPage: PropTypes.bool,
    search: PropTypes.bool,
    pagination: PropTypes.bool,
    updateUrl: PropTypes.bool,
    options: PropTypes.object,
    children: PropTypes.func,
};


export default ServerTable;