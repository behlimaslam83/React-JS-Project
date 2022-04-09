import React, { Component, useEffect, useState } from 'react';
import './Dashboard.scss';
import ReactDatatable from '../Datatable/ReactDatatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function DataTableView(props) {
  const [users, setUsers] = useState({});
  const [page, setPage] = useState(1);
  const countPerPage = 10;

  const columns = [
    {
      key: "hp_desc",
      text: 'Desc',
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
      key: 'hp_auto_play',
      text: 'Auto',
      sortable: true,
    },
    {
      key: 'null',
      text: 'Action',
      align: 'right',
      className:'text-right',
      button: true,
      cell: record  => {
        return( <div className="actioncol1">
          {/* <MuiThemeProvider theme={theme}><Button variant="contained" size="small" color="secondary" onClick={() => props.childRow(record.hp_id,"E")}>edit</Button>
            <Button style={{ maxWidth: '30px', minWidth: '30px', marginLeft: '5px', minHeight: '28px' }} variant="contained" onClick={() => props.childRow(record.hp_id,"D")}  color="default" size="small"><FontAwesomeIcon icon={faTrash} /></Button>
          </MuiThemeProvider> */}
          <button type="button" onClick={() => props.childRow(record.hp_id, "E")} className="btn btn-sm btn-primary">Edit</button>
          <button type="button" style={{ marginLeft: '5px' }}  onClick={() => props.childRow(record.hp_id, "D")} className="btn btn-sm btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
        </div>);
      }
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
        if (key == 'page_number'){
          chngKey = 'page';
        } else if (key == 'page_size'){
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
      <ReactDatatable
        className="table custom-style-table"
        tHeadClassName="custom-header-style"
        config={config}
        records={props.datajson.results}
        columns={columns}
        dynamic={true}
        total_record={props.datajson.row_count}
        onChange={tableChangeHandler}
      />
    </div>
  );
}
export default DataTableView;