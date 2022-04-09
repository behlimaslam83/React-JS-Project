import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./Components/Redux-Config/Store/Store";
import App from './App.js';
// window.store = store;
class IndexReact extends React.Component{
  render(){
    return(
      <React.StrictMode>
        <Provider store={store}>
          <App/>
        </Provider>
      </React.StrictMode>
    );
  }
}
store.subscribe(() => console.log(store.getState(), 'Look ma, Redux!!'));
ReactDOM.render(<IndexReact/>,document.getElementById('root'));

// store.dispatch(headerNav(false));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
