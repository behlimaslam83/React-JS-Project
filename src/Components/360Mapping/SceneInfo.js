import React, { Component } from 'react';
import './360Mapping.scss';
import ServerTable from '../../services/server-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SceneModal from "./SceneModal";
import { ConfirmationDialog, SnapBarError } from "../../ConfirmationDialog";
import { WindowPanel } from "../../WindowPanel";
const PER_PAGE = process.env.REACT_APP_PER_PAGE;

class SceneInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
          modalShow: false,
          mode: '',
          snapopen: false,
          snapcolor: null,
          error: null,
          deletedialog: false,
          proceed: false,
          renderTable: false,
          sysid: null,
          page: 1,
          deletesysid: ''
        };
        this.modalRef = React.createRef();
      }
    setModalShow = () => {
        this.setState({
            modalShow: true,
            mode: 'IS'
        });
    }

    editRecord = (id) => {
        this.modalRef.current.editModalRecord(id);
        this.setState({ modalShow: true, mode: 'UP' });
      }
    
      deletRecord = (id) => {
        this.setState({ deletedialog: true, deletesysid: id });
      }
     
      proceedDelete = (params) => {
        let sysid = this.state.deletesysid;
        if (params) {
          this.modalRef.current.deleteModalRecord(sysid);
        } else {
          console.log('here111...');
        }
      }
    closedialog = () => {
        this.setState({ deletedialog: false });
    }
    modalClose = () => {
        this.setState({ modalShow: false });
    }
    snapclose = () => {
        this.setState({ snapopen: false });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    errorThrough = (error, argu) => {
        console.log(error, "RULING");
        var erroMessage = '';
        if (argu === 'ERR-OBJ') {
            erroMessage = Object.keys(error).map(function (key) {
                return <ul key={key} className="mrgnone list-unstyled"><li>{error[key]}</li></ul>;
            });
        } else {
            erroMessage = <ul className="mrgnone list-unstyled"><li>{error}</li></ul>;
        }
        var backColor = ((argu === 'ERR' || argu === 'ERR-OBJ') ? '#ff4c4ceb' : '#20bb20eb');
        this.setState({ snapopen: true, snapcolor: backColor });
        this.setState({ error: erroMessage });
    }

    renderTable = () => {
        this.setState({
          renderTable: true
        }, () => {
          this.setState({ renderTable: false });
        });
      }

    render() {
        let self = this;
        const url = `admin/portal/sceneInfo`;
        let $button = (<OverlayTrigger overlay={<Tooltip id="tooltip">Add Steps</Tooltip>}>
            <button className="btn btn-primary btn-sm" onClick={this.setModalShow}>{<FontAwesomeIcon icon={faPlus} />}</button></OverlayTrigger>);
        const columns = ['sr_no', 'scene_desc', 'scene_image', 'scene_fov', 'scene_near', 'scene_far','scene_longitude', 'active_yn', 'actions'];
        const options = {
            perPage: PER_PAGE,
            headings: {
                sr_no: '#',
                scene_desc: 'Name',
                scene_image: 'Image',
                scene_fov: 'FOV',
                scene_near: 'Near',
                scene_far: 'FAR',
                scene_longitude:'Longitude',
                active_yn: 'Active',
                
            },
            search_key: {
                SSC_DESC: 'Name',
                SSC_FOV_LENGTH: 'FOV',
                SSC_SCENE_LONGITUDE: 'Longitude',
                SSC_ACTIVE_YN: 'Active',
            },
            sortable: ['scene_desc', 'scene_image', 'scene_fov', 'active_yn'],
            requestParametersNames: { search_value: 'search_value', search_column: 'search_column', direction: 'order' },
            columnsAlign: { actions: 'center' },
            responseAdapter: function (resp_data) {
                self.setState({ page: resp_data.page });
                return { data: resp_data.results, total: resp_data.row_count }
            },
            texts: {
                show: ''
            },
			search_lov: {
				pages:[]
			}
        };
        return (
            <div>
                <SnapBarError
                    message={this.state.error}
                    snapopen={this.state.snapopen}
                    snapcolor={this.state.snapcolor}
                    snapclose={this.snapclose} />
                <ConfirmationDialog
                    dialogopen={this.state.deletedialog}
                    dialogclose={this.closedialog}
                    agreeProcess={this.proceedDelete}
                />

                <WindowPanel rawHtml={
                    <div className="windowContent">
                        <ServerTable renderView={this.state.renderTable} columns={columns} url={url} options={options} addme={$button} bordered hover updateUrl>
                            {
                                function (row, column, index) {
                                    switch (column) {
                                        case 'sr_no':
                                            return (
                                                (index + 1) + (PER_PAGE * ((self.state.page) - 1))
                                            );
                                            case 'scene_image':
                                                return (
                                                    <img src={row.scene_image} width="120px" className="table-image" alt="" />
                                                );	
                                        case 'actions':
                                            return (
                                                <div className="form-control-sm" style={{ textAlign: 'center' }}>
                                                    <DropdownButton size="sm" id="dropdown-basic-button" title={<FontAwesomeIcon icon={faCog} />}>
                                                        <Dropdown.Item onClick={() => self.editRecord(row.scene_id)}><FontAwesomeIcon icon={faEdit} /> Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => self.deletRecord(row.scene_id)}><FontAwesomeIcon icon={faTrash} /> Delete</Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            );
                                        default:
                                            return (row[column]);
                                    }
                                }
                            }
                        </ServerTable>
                        <SceneModal
                            ref={this.modalRef}
                            sysid={this.state.sysid}
                            renderTable={this.renderTable}
                            mode={this.state.mode}
                            show={this.state.modalShow}
                            closeModal={this.modalClose}
                            closeDelete={this.closedialog}
                            errorMessage={this.errorThrough}
                        />

                    </div>
                } />

            </div>
        )
    }

}
export default SceneInfo;