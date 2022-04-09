import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import ReactDatatable from '../Datatable/ReactDatatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCog, faPlus, faCopy, faLanguage, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, Form} from 'react-bootstrap';
import Select from 'react-select';
import AccessSecurity from '../../AccessSecurity';

const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32
  })
};
function DataTableView(props) {
  const [pageNames, setPageNames] = useState("");
  const [slug, setSlug] = useState("");
  const [security, setSecurity] = useState("");
  const pageFilter = async (e,param) => {
    if (param==='P'){
      await setPageNames(e.value);
      setSlug('');
    }else{
      await setSlug(e.value);
    }
  }
  useEffect(() => { 
    props.pageName(pageNames);
  }, [pageNames]);
  useEffect(() => {
    props.slugName(slug);
  }, [slug]);

  const securityAccess=(param)=>{
    setSecurity(param);
  }

  let actionButton = (<button disabled={security.INSERT_YN !== 'Y' ? true:false} onClick={props.callAdd} type="button" className="btn btn-sm btn-primary"><FontAwesomeIcon icon={faPlus} /></button>);
  const selectDrop = (<div>
    <Select 
      onChange={(e)=>pageFilter(e,'P')}
      options={props.pageDrop}
      className="custdropdwn pointerr"
      styles={customStyles}
    />
    </div>);
  const slugDrop = (<div>
    <Select
      value={props.slugDrop.filter(function (option) {
        return option.value === slug;
      })}
      onChange={(e) => pageFilter(e,'S')}
      options={props.slugDrop}
      className="custdropdwn pointerr"
      styles={customStyles}
    />
  </div>);

  const columns = [
    {
      key: "hp_desc",
      text: 'Desc',
      sortable: true,
    },
    {
      key: 'hp_parent_desc',
      text: 'Parent',
      sortable: true,
    },  
    {
      key: 'hp_slug_url',
      text: 'Slug Url',
      sortable: true,
    },
    {
      key: 'hp_ordering',
      text: 'Ordering',
      sortable: true,
    },
    {
      key: 'hp_from_date',
      text: 'From Date',
      sortable: true,
    },
    {
      key: 'hp_upto_date',
      text: 'Upto Date',
      sortable: true,
    },
    {
      key: 'hp_active_yn',
      text: 'Active',
      sortable: true,
    },
    {
      key: 'null',
      text: actionButton,
      align: 'right',
      className:'text-right',
      button: true,
      cell: record  => {
        return( <div className="actioncol1">
          <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
            <Dropdown.Item disabled={security.UPDATE_YN !== 'Y' ? true : false} onClick={() => props.childRow(record.hp_id, "E")}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
            <Dropdown.Item disabled={security.UPDATE_YN !== 'Y' ? true : false} onClick={() => props.childRow(record.hp_id, "DU", record.hp_desc)}><FontAwesomeIcon icon={faCopy} /> Duplicate</Dropdown.Item>
            <Dropdown.Item disabled={security.LANGUAGE_YN !== 'Y' ? true : false} onClick={() => props.childRow(record.hp_id, "LG")}><FontAwesomeIcon icon={faLanguage} /> Language</Dropdown.Item>
            <Dropdown.Item disabled={security.DELETE_YN !== 'Y' ? true : false} onClick={() => props.childRow(record.hp_id, "D")}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
			<Dropdown.Item disabled={security.SEO_YN !== 'Y' ? true : false} onClick={() => props.seoCategory(record.hp_id)}><FontAwesomeIcon icon={faChartLine} /> SEO</Dropdown.Item>
		  </DropdownButton>
        </div>);
      }
    }, 
    {
      key: 'created_user_id',
      text: 'Created User ID',
      className: 'childColumn'
    },
    {
      key: 'updated_user_id',
      text: 'Updated User ID',
      className: 'childColumn'
    },
    {
      key: 'created_date',
      text: 'Created Date',
      className: 'childColumn'
    },
    {
      key: 'updated_date',
      text: 'Updated Date',
      className: 'childColumn'
    }
  ];
  const config = {
    page_size: 10,
    page_set : 1,
    length_menu: [10,20,40,50],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    key_column: 'hp_id',
  }

  const tableChangeHandler = data => {
    let queryString = Object.keys(data).map((key) => {
      if (key === "sort_order" && data[key]) {
        return encodeURIComponent("sort_by") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("search_column") + '=' + encodeURIComponent(data[key].column)
      } else {
        var chngKey = key;
        if (key === 'page_number'){
          chngKey = 'page';
        } else if (key === 'page_size'){
          chngKey = 'limit';
        }
        return encodeURIComponent(chngKey) + '=' + encodeURIComponent(data[key])
      }

    }).join('&');
    props.renderTable(queryString);
  }
  useEffect(()=>{
    console.log(props.datajson,"test");
  }, [props.datajson]);
  useEffect(() => () => [props.datajson]);
  return (
    
    <div className="DataTableView">
      <AccessSecurity 
        accessecurity={securityAccess}
      />
      <ReactDatatable
        className="table custom-style-table"
        tHeadClassName="custom-header-style"
        config={config}
        records={props.datajson.results}
        columns={columns}
        dropdown={selectDrop}
        dropdownslug={slugDrop}
        dynamic={true}
        total_record={props.datajson.row_count}
        onChange={tableChangeHandler}
      />
    </div>
  );
}
export default DataTableView;
