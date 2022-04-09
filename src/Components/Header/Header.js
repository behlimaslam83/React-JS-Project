import React, { Component } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import logo from '../../Assets/images/logo.svg';
//import  FlagIcon  from '@material-ui/icons/Flag';
//import  MailOutlineIcon  from '@material-ui/icons/MailOutline';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faAlignJustify,faCommentAlt,faEnvelope,faUserTie,faCog,faSignOutAlt,faUndo } from '@fortawesome/free-solid-svg-icons';
import { headerNav, clearLogin } from "../Redux-Config/Action/Action";
import { connect } from 'react-redux';
import face from '../../Assets/images/face.jpg';
import Config from '../Config'
import ApiDataService from '../../services/ApiDataService';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
const apiUrl = `clearcache/all`;
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchMenu: false,
      profile:false,
      email: false,
      user_name: props.user_info.user_desc,
      user_email: props.user_info.user_email,
    }
    //console.log(props.user_info);
    this.parentHead = React.createRef();
    this.MessageHead = React.createRef();
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  adjustPanel = async () =>{
    await this.setState({
      switchMenu: !this.state.switchMenu
    });
    this.props.changePanel(this.state.switchMenu);
  }
  profileSetting = (e) =>{
    if (this.parentHead.contains(e.target)){
      this.setState({
        profile: true
      });
    }
  }
  EmailSetting = (e) => {
    if (this.MessageHead.contains(e.target)) {
      this.setState({
        email: true
      });
    }
  }
  
  handleClickOutside = (event)  => {
    if (!this.parentHead.contains(event.target)) {
      this.setState({
        profile: false,
      });
    }
    if (this.MessageHead && !this.MessageHead.contains(event.target)) {
      this.setState({
        email: false,
      });
    }
  }
  signOut=()=>{
    localStorage.clear();
    this.props.logoutClear();
  }
  
  cacheClear = (e) => {
    let $url = `${apiUrl}`;
	ApiDataService.get($url)
	.then(res => {		
		if(res.data.return_status==="0"){			
			Config.createNotification('success','Cache successfuly clear.');
		}else{				
			Config.createNotification('warning',res.data.error_message);			
		}
	}).catch(function(error){			
		if(error){ Config.createNotification('error',error); }
	});	
  }
  
  render() {

    return (
      <div className="nav-stickey">
		    <NotificationContainer />
        <Navbar bg="primary" className="nav-stickey navPadd" variant="dark">
          <Navbar.Brand className={(this.state.switchMenu && !this.props.headSwipe) ? 'navMenuLogo navMenuMiniz' : 'navMenuLogo'}>
            <img src={logo} width="50" height="50" className="d-inline-block align-top" alt="Logo" />
            <span className={this.state.switchMenu ? 'logo-text logo-textMiniz' : 'logo-text'}>Spineweb</span>
          </Navbar.Brand>
          <div className="navMenu">
            <Navbar.Collapse>
              <Nav.Link onClick={() => this.adjustPanel()} className="iconslide">
                <FontAwesomeIcon icon={faAlignJustify} />
              </Nav.Link>
              <Nav className="centerbar">
                <Nav.Item>Managing Site - {this.props.user_info.site_desc}</Nav.Item>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
            <ul className="list-group list-group-horizontal">
				    <Nav.Item className="list-inline-item" as="li" onClick={(e) => this.cacheClear(e)} title="Delete Cache"><FontAwesomeIcon className="iconMessg" icon={faUndo} /></Nav.Item>               
			        <Nav.Item className="list-inline-item" as="li"><FontAwesomeIcon className="iconMessg" icon={faCommentAlt} /></Nav.Item>
                <Nav.Item className="list-inline-item" as="li" ref={node => { this.MessageHead = node }} onClick={(e) => this.EmailSetting(e)} ><FontAwesomeIcon className="iconMail" icon={faEnvelope} />
                  {this.state.email ?
                  <div className="messageMenu">
                    <div className="profileInfo">
                      <div className="profileName">
                        <h6>3 New</h6>
                        <p>Messages</p>
                      </div>
                    </div>
                    <ul className="list-group list-unstyled">
                      <li><div className="icons"><span>M</span></div>
                        <div className="iconContent">
                          <h6>Every Today</h6>
                          <p>just a reminder at events</p>
                          <p>9:30 PM</p>
                        </div>
                      </li>
                      <li><div className="icons"><span>M</span></div>
                        <div className="iconContent">
                          <h6>Every Today</h6>
                          <p>just a reminder at events</p>
                          <p>9:30 PM</p>
                        </div>
                      </li>
                      <li>
                        <div className="icons"><span>M</span></div>
                        <div className="iconContent">
                          <h6>Every Today</h6>
                          <p>just a reminder at events</p>
                          <p>9:30 PM</p>
                        </div>
                      </li>
                      <li className="noBorder">
                        <span>
                          See e-Mails
                        </span>
                      </li>
                    </ul>
                  </div>
                  : '' }
                </Nav.Item>
                <Nav.Item className="list-inline-item" as="li" ref={node => { this.parentHead = node }} onClick={(e) => this.profileSetting(e)}>
                <img src={face}  width="30" height="30" className="d-inline-block align-top imgRound" alt="" />
                {this.state.profile ? 
                <div className="profileMenu">
                  <div className="profileInfo">
                    <img src={face} className="logoCircle" width="60" height="60" alt="Logo Circle" />
                    <div className="profileName">
                      <h6>{this.state.user_name}</h6>
                        <p>{(this.state.user_email.length > 19) ? this.state.user_email.substr(0, 19) + '...' : this.state.user_email}</p>
                    </div>
                  </div>
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="">
                      <FontAwesomeIcon icon={faUserTie} />{' '}<span className="sideMenuText">My Account</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="">
                      <FontAwesomeIcon icon={faCog} />{' '}<span className="sideMenuText">Account Setting</span>
                    </Nav.Link>
                        <Nav.Link onClick={this.signOut} as={Link} to="/" className="linkcss">
                      <FontAwesomeIcon icon={faSignOutAlt} />{' '}<span className="sideMenuText">Logout</span>
                    </Nav.Link>
                  </Nav>
                </div>
                :'' }
              </Nav.Item>
              </ul>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changePanel: (boolen) => {
      let object = { head: boolen, sidepan:false}
      dispatch(headerNav(object));
    },
    logoutClear: (boolen) => {
      dispatch(clearLogin({data:''}));
    }
  }
}

const mapStateToProps = state => {
  return {
    headSwipe: state.Reducers.swipPanel.sidepan,
    user_info:JSON.parse(state.Reducers.user_info)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);