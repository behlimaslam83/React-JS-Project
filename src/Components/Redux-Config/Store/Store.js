import './Store.css';
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { Reducers, serverApiReducer } from '../Reducer/Reducer';
const reducers = combineReducers({ Reducers, serverApiReducer });
const store = createStore(reducers, applyMiddleware(thunk));
export default store;