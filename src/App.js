import React, { useRef, createContext, useState} from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Header from "./Components/Header/Header";
import SidePanel from "./Components/SidePanel/SidePanel";
import MapModuleFlow from "./Components/SidePanel/MapModuleFlow";
import RouterSetup from './RouterSetup';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import { ReactLoader } from "./ConfirmationDialog";
export const PageContext = createContext({
  loader: false,
  setLoader: ()=>{}
});
function App(props) {
  const container = useRef(null);
  const user_id = props.user_id;
  const auth_token = props.auth_token;
  const headerClick = props.swipPanel.head;
  const changeLoader = (param) => {
    setState({ ...state, loader: param })
  }
  const initState = {
    loader: false,
    changeLoader: changeLoader
  }
  const [state, setState] = useState(initState);
  return (
    <Container className="master-container" ref={container} fluid>
      <PageContext.Provider value={state}>
        <ReactLoader/>
        <Router>
          {user_id && auth_token ? <Header /> : ''}
          {user_id && auth_token ? <SidePanel /> : ''}
          {user_id && auth_token ? <MapModuleFlow /> : ''}
          {user_id && auth_token ? 
          <div className={headerClick ? 'wrapContainer wrapMaximiz' : 'wrapContainer'}>
            <Container fluid>
              <RouterSetup />
            </Container>
          </div>
          : <RouterSetup />}
        </Router>
      </PageContext.Provider>
    </Container>
  );
}

const mapStateToProps = state => {
  return state.Reducers;
}
export default connect(mapStateToProps)(App);
