import React,{ useState,useEffect } from 'react';
import './SideBar.css'
import ApiDataService from '../../services/ApiDataService'
import { Col, Row, Form, Modal, Dropdown, Table, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const qs = require('qs');
function SideBar(){
    // const axios = require('axios');
    const qs = require('qs');
    const [form, setForm] = useState({
        name:'',
        age:'',
        order:''
    });

    useEffect(() => {
        var head = '';//{ headers: { 'Access-Control-Allow-origin': '*', "Content-Type": "application/x-www-form-urlencoded;multipart/form-data; charset=UTF-8" }};
        var passvalue = {
                logged_user_id: 'admin@spineweb',
                lang_code: 'en',
                logged_site_id: '100001',
                channel_id: '101-00000016',
                auth_token: '$2y$10$7fcUFQoINQ4HIYLyITJZbOwJYmi3sd5MUTVKifAZd5awkmlWgDF3C',
                process: 'homepage'
        };
        // var data = {
        //     logged_user_id:'admin@spineweb',
        //     lang_code: 'en',
        //     logged_site_id: '100001',
        //     channel_id: '101-00000016',
        //     auth_token  : '$2y$10$7fcUFQoINQ4HIYLyITJZbOwJYmi3sd5MUTVKifAZd5awkmlWgDF3C',
        //     process: 'homepage'
        // }
            // axios.delete('http://132.1.0.103/homepage/delete/1').then(response => {
            //     console.log(response,"testset");
            // }).catch(e => {
            //     console.log(e);
            // });
    },[]);

    const typeData=(e)=>{
        setForm({
            ...form,[e.target.name]:e.target.value
        });
    }
    
    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(form,"test");
    }

    return (
        <div className="windowPanel">
            <div className="windowHead inline-css">
                <h6 className="rm-Mrg">Caption Of window</h6>
                <ul className="list-inline list-unstyled rm-Mrg">
                    <li className="list-inline-item"><FontAwesomeIcon icon={faTimes} /></li>
                </ul>
            </div>
            <div className="windowContent">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md="4">
                            <div className="form-group">
                                <label>name</label>
                                <input type="text" onChange={typeData} className="form-control form-control-sm" id="name" name="name" value={form.name} />
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="form-group">
                                <label>age</label>
                                <input type="text" onChange={typeData} className="form-control form-control-sm" id="age" name="age" value={form.age} />
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="form-group">
                                <label>Ordering</label>
                                <input type="text" onChange={typeData} className="form-control form-control-sm" id="order" name="order" value={form.order} />
                            </div>
                        </Col>
                    </Row>
                    <button type="submit" className="btn btn-sm btn-primary">Add</button>
                </Form>
            </div>
        </div>

    );
}

export default SideBar;