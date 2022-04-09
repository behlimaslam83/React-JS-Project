import React, { Component } from 'react';
import { Col, Row, Modal, Form, Button } from 'react-bootstrap';
import ApiDataService from './services/ApiDataService';
const Api_Country = 'admin/portal/';
// const Api_Country_edit = 'admin/portal/homepage/country_access/';
class CountryFlag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            set: [],
            flaglist: [],
            selectedFlag: [],
            incExlud: 'INCLUDE'
        }
    }
    componentDidMount() {
        let flagShow = this.props.countryActionNt;
        let sysid = this.props.sysid;
        let CountryFun = this.getAllCountryFlag();
        let these=this;
        var selectedFlag=[];
        var setIndex=[];
        if (flagShow){
            Promise.all([CountryFun]).then(function (values){
                if (sysid !== '' && sysid !== null) {
                    let flagList = these.state.flaglist;
                    selectedFlag = these.state.selectedFlag;
                    setIndex = these.state.set;
                    ApiDataService.get(`${Api_Country + this.props.urlname +'/country_access/'+ sysid}/edit`, null).then(response => {
                        let editFlags = response.data.result;
                        let countryAccess = response.data.result[0].country_access;
                        Object.keys(editFlags).forEach(function (inx) {
                            Object.keys(flagList).forEach(function (key) {
                                if (flagList[key].code === editFlags[inx].country_list){
                                    selectedFlag.push(flagList[key].code);
                                    setIndex[key] = Number(key);
                                }
                            });
                        });
                        these.setState({
                            set: setIndex,
                            selectedFlag: selectedFlag,
                            incExlud: countryAccess
                        });
                    });
                }
            });
        }
    }

    componentDidUpdate(previousProps, previousState){
        if (previousState.incExlud !== this.state.incExlud) {
            this.commonSaveCountry();
        }
    }

    getAllCountryFlag = async () => {
        await ApiDataService.get(`${Api_Country + this.props.urlname}+/country_access/list`, null).then(response => {
            let json = response.data.result;
            let defaultArray = this.resetFlag(json);
            this.setState({
                flaglist: json,
                set: defaultArray
            });
        }).catch((error) => {
            this.props.errorMessage(error.message, "ERR");
        });
        console.log(this.state,"tjos/staet");
    }
    resetFlag = (json) => {
        var defaultArray = [];
        json.forEach(function (obj, inx) {
            defaultArray.push('N');
        });
        return defaultArray;
    }
    selectFlag = (e, ind, param) => {
        let checkFlagExist = this.state.selectedFlag;
        let checkActive = this.state.set;
        if (checkFlagExist.indexOf(param) !== -1) {
            checkFlagExist.splice(checkFlagExist.indexOf(param), 1);
            checkActive[ind] = 'N';
        } else {
            checkFlagExist.push(param);
            checkActive[ind] = ind;
        }
        this.setState({
            set: checkActive,
            selectedFlag: checkFlagExist
        });
        this.commonSaveCountry();
        console.log(this.state,"SDFSDF");
    }
    countryNeccessary = (param) => {
        this.setState({
            incExlud: param
        });
    }
    commonSaveCountry=()=>{
        let selectFlag = this.state.selectedFlag;
        let option = this.state.incExlud;
        let countryObj = {
            selectedCountry: selectFlag,
            options: option
        }
        this.props.sendData(countryObj);
    }
    render() {
        let { set } = this.state;
        let theis = this;
        return (
            <Row>
                <Col md={6}>
                    <div className="countryParent">
                        {this.state.flaglist.map(function (data, inx) {
                            return (
                                <div key={inx} onClick={(e) => theis.selectFlag(e, inx, data.code)} className={`countryFlag ${set != '' ? set[inx] === inx ? 'activeFlag' : '' : ''}`}>
                                    <img alt={data.code} title={data.desc} src={data.image_path} />
                                    <span className="flagName"> {data.code}</span>
                                </div>)
                        })
                        }
                    </div>
                </Col>
                <Col>
                    <div className="form-check">
                        <input className="form-check-input" name="country_access" value="INCLUDE" checked={this.state.incExlud === "INCLUDE"} onChange={(e) => this.countryNeccessary('INCLUDE')} type="radio" />
                        <label className="form-check-label">Include</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" name="country_access" value="EXCLUDE" checked={this.state.incExlud === "EXCLUDE"} onChange={(e) =>  this.countryNeccessary('EXCLUDE')} type="radio" />
                        <label className="form-check-label">Exclude</label>
                    </div>
                </Col>
            </Row>
        );
    }
    }

export default CountryFlag;